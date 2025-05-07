"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useToast } from "@/components/ui/use-toast"
import { Loader2, TrendingUp, Users, DollarSign, Calendar } from "lucide-react"
import { getAllProjects, getAllRequests, type Project, type Request } from "@/lib/firebase"
import { format, subDays, isWithinInterval } from "date-fns"
import AuthGuard from "@/components/auth-guard"

// Import Chart.js components
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
} from "chart.js"
import { Line, Bar, Pie } from "react-chartjs-2"

// Register Chart.js components
ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, BarElement, Title, Tooltip, Legend, ArcElement)

export default function AnalyticsDashboardPage() {
  const [projects, setProjects] = useState<Project[]>([])
  const [requests, setRequests] = useState<Request[]>([])
  const [loading, setLoading] = useState(true)
  const [timeframe, setTimeframe] = useState<"7days" | "30days" | "90days">("30days")
  const { toast } = useToast()

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true)
        const [projectsData, requestsData] = await Promise.all([getAllProjects(), getAllRequests()])
        setProjects(projectsData)
        setRequests(requestsData)
      } catch (error: any) {
        toast({
          title: "Error",
          description: error.message || "Failed to load analytics data",
          variant: "destructive",
        })
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [toast])

  // Filter data based on timeframe
  const getFilteredData = (data: (Project | Request)[]) => {
    const now = new Date()
    const startDate = subDays(now, timeframe === "7days" ? 7 : timeframe === "30days" ? 30 : 90)

    return data.filter((item) => {
      const itemDate =
        item.createdAt && typeof item.createdAt === "object" && "toDate" in item.createdAt
          ? item.createdAt.toDate()
          : new Date(item.createdAt as string)

      return isWithinInterval(itemDate, { start: startDate, end: now })
    })
  }

  const filteredProjects = getFilteredData(projects) as Project[]
  const filteredRequests = getFilteredData(requests) as Request[]

  // Calculate metrics
  const totalRevenue = filteredProjects.reduce((sum, project) => {
    const budget = Number.parseFloat(project.budget)
    return sum + (isNaN(budget) ? 0 : budget)
  }, 0)

  const pendingRevenue = filteredProjects.reduce((sum, project) => {
    if (!project.finalPaid) {
      const budget = Number.parseFloat(project.budget)
      const amount = project.depositPaid ? budget * 0.5 : budget
      return sum + (isNaN(amount) ? 0 : amount)
    }
    return sum
  }, 0)

  const conversionRate = filteredRequests.length > 0 ? (filteredProjects.length / filteredRequests.length) * 100 : 0

  // Prepare chart data
  const prepareTimeSeriesData = () => {
    const days = timeframe === "7days" ? 7 : timeframe === "30days" ? 30 : 90
    const labels = Array.from({ length: days }, (_, i) => {
      return format(subDays(new Date(), days - i - 1), "MMM d")
    })

    const requestsData = new Array(days).fill(0)
    const projectsData = new Array(days).fill(0)
    const revenueData = new Array(days).fill(0)

    filteredRequests.forEach((request) => {
      const date =
        request.createdAt && typeof request.createdAt === "object" && "toDate" in request.createdAt
          ? request.createdAt.toDate()
          : new Date(request.createdAt as string)

      const dayIndex = days - Math.ceil((new Date().getTime() - date.getTime()) / (1000 * 60 * 60 * 24))
      if (dayIndex >= 0 && dayIndex < days) {
        requestsData[dayIndex]++
      }
    })

    filteredProjects.forEach((project) => {
      const date =
        project.createdAt && typeof project.createdAt === "object" && "toDate" in project.createdAt
          ? project.createdAt.toDate()
          : new Date(project.createdAt as string)

      const dayIndex = days - Math.ceil((new Date().getTime() - date.getTime()) / (1000 * 60 * 60 * 24))
      if (dayIndex >= 0 && dayIndex < days) {
        projectsData[dayIndex]++
        revenueData[dayIndex] += Number.parseFloat(project.budget) || 0
      }
    })

    return { labels, requestsData, projectsData, revenueData }
  }

  const { labels, requestsData, projectsData, revenueData } = prepareTimeSeriesData()

  // Prepare website type distribution data
  const websiteTypeData = () => {
    const typeCounts: Record<string, number> = {}

    filteredProjects.forEach((project) => {
      const type = project.websiteType || "other"
      typeCounts[type] = (typeCounts[type] || 0) + 1
    })

    return {
      labels: Object.keys(typeCounts),
      data: Object.values(typeCounts),
    }
  }

  const { labels: typeLabels, data: typeData } = websiteTypeData()

  if (loading) {
    return (
      <div className="flex justify-center items-center h-full">
        <Loader2 className="h-8 w-8 animate-spin text-purple-500" />
      </div>
    )
  }

  return (
    <AuthGuard>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold">Analytics Dashboard</h1>
          <Tabs value={timeframe} onValueChange={(value) => setTimeframe(value as any)} className="w-auto">
            <TabsList className="bg-black/40 border border-purple-500/20">
              <TabsTrigger value="7days">7 Days</TabsTrigger>
              <TabsTrigger value="30days">30 Days</TabsTrigger>
              <TabsTrigger value="90days">90 Days</TabsTrigger>
            </TabsList>
          </Tabs>
        </div>

        {/* Key Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card className="border border-purple-500/30 bg-black/60 backdrop-blur-md">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-400">Total Revenue</p>
                  <p className="text-2xl font-bold">${totalRevenue.toFixed(2)}</p>
                </div>
                <div className="p-2 bg-purple-900/20 rounded-lg">
                  <DollarSign className="h-6 w-6 text-purple-400" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border border-purple-500/30 bg-black/60 backdrop-blur-md">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-400">Pending Revenue</p>
                  <p className="text-2xl font-bold">${pendingRevenue.toFixed(2)}</p>
                </div>
                <div className="p-2 bg-yellow-900/20 rounded-lg">
                  <Calendar className="h-6 w-6 text-yellow-400" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border border-purple-500/30 bg-black/60 backdrop-blur-md">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-400">Conversion Rate</p>
                  <p className="text-2xl font-bold">{conversionRate.toFixed(1)}%</p>
                </div>
                <div className="p-2 bg-green-900/20 rounded-lg">
                  <TrendingUp className="h-6 w-6 text-green-400" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border border-purple-500/30 bg-black/60 backdrop-blur-md">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-400">New Requests</p>
                  <p className="text-2xl font-bold">{filteredRequests.length}</p>
                </div>
                <div className="p-2 bg-blue-900/20 rounded-lg">
                  <Users className="h-6 w-6 text-blue-400" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card className="border border-purple-500/30 bg-black/60 backdrop-blur-md">
            <CardHeader>
              <CardTitle>Revenue & Projects</CardTitle>
              <CardDescription>Revenue and project creation over time</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-80">
                <Line
                  options={{
                    responsive: true,
                    maintainAspectRatio: false,
                    scales: {
                      y: {
                        beginAtZero: true,
                        grid: {
                          color: "rgba(255, 255, 255, 0.1)",
                        },
                        ticks: {
                          color: "rgba(255, 255, 255, 0.7)",
                        },
                      },
                      x: {
                        grid: {
                          color: "rgba(255, 255, 255, 0.1)",
                        },
                        ticks: {
                          color: "rgba(255, 255, 255, 0.7)",
                        },
                      },
                    },
                    plugins: {
                      legend: {
                        labels: {
                          color: "rgba(255, 255, 255, 0.7)",
                        },
                      },
                    },
                  }}
                  data={{
                    labels,
                    datasets: [
                      {
                        label: "Revenue ($)",
                        data: revenueData,
                        borderColor: "rgba(168, 85, 247, 1)",
                        backgroundColor: "rgba(168, 85, 247, 0.5)",
                        yAxisID: "y",
                      },
                      {
                        label: "Projects",
                        data: projectsData,
                        borderColor: "rgba(59, 130, 246, 1)",
                        backgroundColor: "rgba(59, 130, 246, 0.5)",
                        yAxisID: "y",
                      },
                    ],
                  }}
                />
              </div>
            </CardContent>
          </Card>

          <Card className="border border-purple-500/30 bg-black/60 backdrop-blur-md">
            <CardHeader>
              <CardTitle>Website Types</CardTitle>
              <CardDescription>Distribution of website types</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-80">
                <Pie
                  options={{
                    responsive: true,
                    maintainAspectRatio: false,
                    plugins: {
                      legend: {
                        position: "right",
                        labels: {
                          color: "rgba(255, 255, 255, 0.7)",
                        },
                      },
                    },
                  }}
                  data={{
                    labels: typeLabels.map((label) => label.charAt(0).toUpperCase() + label.slice(1)),
                    datasets: [
                      {
                        data: typeData,
                        backgroundColor: [
                          "rgba(168, 85, 247, 0.7)",
                          "rgba(59, 130, 246, 0.7)",
                          "rgba(16, 185, 129, 0.7)",
                          "rgba(245, 158, 11, 0.7)",
                          "rgba(239, 68, 68, 0.7)",
                          "rgba(107, 114, 128, 0.7)",
                        ],
                        borderColor: [
                          "rgba(168, 85, 247, 1)",
                          "rgba(59, 130, 246, 1)",
                          "rgba(16, 185, 129, 1)",
                          "rgba(245, 158, 11, 1)",
                          "rgba(239, 68, 68, 1)",
                          "rgba(107, 114, 128, 1)",
                        ],
                        borderWidth: 1,
                      },
                    ],
                  }}
                />
              </div>
            </CardContent>
          </Card>

          <Card className="border border-purple-500/30 bg-black/60 backdrop-blur-md lg:col-span-2">
            <CardHeader>
              <CardTitle>Request to Project Conversion</CardTitle>
              <CardDescription>Comparison of requests and converted projects</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-80">
                <Bar
                  options={{
                    responsive: true,
                    maintainAspectRatio: false,
                    scales: {
                      y: {
                        beginAtZero: true,
                        grid: {
                          color: "rgba(255, 255, 255, 0.1)",
                        },
                        ticks: {
                          color: "rgba(255, 255, 255, 0.7)",
                        },
                      },
                      x: {
                        grid: {
                          color: "rgba(255, 255, 255, 0.1)",
                        },
                        ticks: {
                          color: "rgba(255, 255, 255, 0.7)",
                        },
                      },
                    },
                    plugins: {
                      legend: {
                        labels: {
                          color: "rgba(255, 255, 255, 0.7)",
                        },
                      },
                    },
                  }}
                  data={{
                    labels,
                    datasets: [
                      {
                        label: "Requests",
                        data: requestsData,
                        backgroundColor: "rgba(245, 158, 11, 0.7)",
                        borderColor: "rgba(245, 158, 11, 1)",
                        borderWidth: 1,
                      },
                      {
                        label: "Projects",
                        data: projectsData,
                        backgroundColor: "rgba(16, 185, 129, 0.7)",
                        borderColor: "rgba(16, 185, 129, 1)",
                        borderWidth: 1,
                      },
                    ],
                  }}
                />
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </AuthGuard>
  )
}
