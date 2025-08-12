"use client"

import { useState, useEffect, Suspense } from "react"
import { useAuth } from "@/lib/auth"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import AuthGuard from "@/components/auth-guard"
import { getUserRequests, getUserProjects, type Request, type Project } from "@/lib/firebase"
import { formatDistanceToNow } from "date-fns"
import { Clock, CheckCircle, AlertCircle, PauseCircle, Loader2 } from "lucide-react"
import Link from "next/link"
import { useSearchParams } from "next/navigation"
import { useToast } from "@/components/ui/use-toast"


import { motion } from "framer-motion"
import { CircularProgressbar, buildStyles } from "react-circular-progressbar"
import "react-circular-progressbar/dist/styles.css"

const statusColors = {
  pending: "bg-yellow-500/20 text-yellow-500 border-yellow-500/50",
  approved: "bg-green-500/20 text-green-500 border-green-500/50",
  rejected: "bg-red-500/20 text-red-500 border-red-500/50",
  "on hold": "bg-blue-500/20 text-blue-500 border-blue-500/50",
  "in progress": "bg-purple-500/20 text-purple-500 border-purple-500/50",
  "client review": "bg-orange-500/20 text-orange-500 border-orange-500/50",
  "final review": "bg-indigo-500/20 text-indigo-500 border-indigo-500/50",
  completed: "bg-green-500/20 text-green-500 border-green-500/50",
}

function DashboardContent() {
  const { user } = useAuth()
  const [requests, setRequests] = useState<Request[]>([])
  const [projects, setProjects] = useState<Project[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const searchParams = useSearchParams()
  const { toast } = useToast()

  useEffect(() => {
    const fetchData = async () => {
      if (!user) return

      try {
        setLoading(true)

        // Fetch requests
        const requestsData = await getUserRequests(user.uid)
        setRequests(requestsData)

        // Fetch projects
        const projectsData = await getUserProjects(user.uid)
        setProjects(projectsData)

        setError(null)
      } catch (error: any) {
        console.error("Error fetching data:", error)
        setError(error.message || "Failed to load data")
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [user])



  const getStatusIcon = (status: string) => {
    switch (status) {
      case "pending":
        return <Clock className="h-4 w-4" />
      case "approved":
        return <CheckCircle className="h-4 w-4" />
      case "rejected":
        return <AlertCircle className="h-4 w-4" />
      case "on hold":
        return <PauseCircle className="h-4 w-4" />
      default:
        return <Clock className="h-4 w-4" />
    }
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin text-purple-500" />
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900">
      <div className="container mx-auto px-4 py-24">
        <Card className="border border-red-500/30 bg-black/60 backdrop-blur-md">
          <CardContent className="p-6">
            <div className="text-center py-8">
              <AlertCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
              <h2 className="text-xl font-bold mb-2">Error Loading Dashboard</h2>
              <p className="text-gray-400 mb-4">{error}</p>
              <Button onClick={() => window.location.reload()} className="bg-purple-600 hover:bg-purple-700">
                Try Again
              </Button>
            </div>
          </CardContent>
        </Card>
        </div>
      </div>
    )
  }

  return (
    <AuthGuard>
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900">
        <div className="container mx-auto px-4 py-20 sm:py-28">
          {/* Mobile Header */}
          <div className="mb-8">
            <h1 className="text-2xl sm:text-3xl font-bold text-white mb-2">Dashboard</h1>
            <p className="text-sm sm:text-base text-gray-400">Manage your website requests and projects</p>
          </div>

          <Tabs defaultValue="requests" className="space-y-6 sm:space-y-8">
            <TabsList className="grid w-full grid-cols-2 bg-black/40 border border-purple-500/20 h-12">
              <TabsTrigger value="requests" className="text-sm sm:text-base">Requests</TabsTrigger>
              <TabsTrigger value="projects" className="text-sm sm:text-base">Projects</TabsTrigger>
          </TabsList>

            <TabsContent value="requests" className="space-y-4 sm:space-y-6">
            <Card className="border border-purple-500/30 bg-black/60 backdrop-blur-md">
                <CardHeader className="pb-4">
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                    <div>
                      <CardTitle className="text-lg sm:text-xl flex items-center gap-2">
                        <div className="w-8 h-8 bg-purple-600 rounded-lg flex items-center justify-center">
                          <span className="text-white font-bold text-sm">R</span>
                        </div>
                        Website Requests
                      </CardTitle>
                      <CardDescription className="text-sm mt-2">View and manage your website requests</CardDescription>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge variant="outline" className="bg-purple-500/10 border-purple-500/30 text-purple-400">
                        {requests.length} {requests.length === 1 ? 'Request' : 'Requests'}
                      </Badge>
                    </div>
                  </div>
              </CardHeader>
              <CardContent>
                {requests.length === 0 ? (
                    <div className="text-center py-12">
                      <div className="w-16 h-16 bg-gray-800 rounded-full flex items-center justify-center mx-auto mb-4">
                        <span className="text-gray-400 text-2xl">📝</span>
                      </div>
                      <h3 className="text-lg font-semibold text-gray-300 mb-2">No Requests Yet</h3>
                      <p className="text-muted-foreground mb-6 text-sm sm:text-base max-w-md mx-auto">
                        You haven't submitted any website requests yet. Start your journey by creating your first request.
                      </p>
                      <Button asChild className="bg-purple-600 hover:bg-purple-700 w-full sm:w-auto px-8">
                        <Link href="/request" className="flex items-center gap-2">
                          <span>Create Your First Request</span>
                          <span className="text-lg">→</span>
                        </Link>
                    </Button>
                  </div>
                ) : (
                  <div className="space-y-4">
                      {requests.map((request, index) => (
                        <motion.div
                          key={request.id}
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ duration: 0.3, delay: index * 0.1 }}
                        >
                          <Card className="border border-purple-500/20 bg-gradient-to-br from-gray-900/50 to-black/50 backdrop-blur-sm hover:border-purple-500/40 transition-all duration-300 group">
                            <CardContent className="p-4 sm:p-6">
                              {/* Header Section */}
                              <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between mb-4 gap-3">
                                <div className="flex items-start gap-3">
                                  <div className="w-10 h-10 bg-purple-600/20 rounded-lg flex items-center justify-center flex-shrink-0">
                                    <span className="text-purple-400 font-semibold text-sm">
                                      {request.websiteType.charAt(0).toUpperCase()}
                                    </span>
                                  </div>
                                  <div className="flex-1 min-w-0">
                                    <h3 className="text-base sm:text-lg font-semibold capitalize text-white group-hover:text-purple-300 transition-colors">
                                      {request.websiteType} Website
                                    </h3>
                                    <p className="text-xs sm:text-sm text-gray-400 flex items-center gap-2 mt-1">
                                      <span>📅</span>
                                Submitted{" "}
                                {formatDistanceToNow(
                                  request.createdAt &&
                                    typeof request.createdAt === "object" &&
                                    "toDate" in request.createdAt
                                    ? request.createdAt.toDate()
                                    : new Date(request.createdAt as string),
                                  { addSuffix: true },
                                )}
                              </p>
                                  </div>
                            </div>
                            <Badge
                                  className={`flex items-center gap-1 text-xs sm:text-sm px-3 py-1 ${statusColors[request.status as keyof typeof statusColors]}`}
                            >
                              {getStatusIcon(request.status)}
                              <span className="capitalize">{request.status}</span>
                            </Badge>
                          </div>

                              {/* Details Grid */}
                              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
                                <div className="bg-gray-800/30 rounded-lg p-3 border border-gray-700/50">
                                  <div className="flex items-center gap-2 mb-1">
                                    <span className="text-purple-400">💰</span>
                                    <p className="text-xs font-medium text-gray-400 uppercase tracking-wide">Budget</p>
                                  </div>
                                  <p className="text-sm sm:text-base font-semibold text-white">${request.budget}</p>
                                </div>
                                <div className="bg-gray-800/30 rounded-lg p-3 border border-gray-700/50">
                                  <div className="flex items-center gap-2 mb-1">
                                    <span className="text-purple-400">⏰</span>
                                    <p className="text-xs font-medium text-gray-400 uppercase tracking-wide">Deadline</p>
                            </div>
                                  <p className="text-sm sm:text-base font-semibold text-white">
                                    {new Date(request.deadline).toLocaleDateString()}
                                  </p>
                            </div>
                          </div>

                              {/* Features Section */}
                          <div className="mb-4">
                                <div className="flex items-center gap-2 mb-3">
                                  <span className="text-purple-400">✨</span>
                                  <p className="text-xs font-medium text-gray-400 uppercase tracking-wide">Features</p>
                                </div>
                            <div className="flex flex-wrap gap-2">
                              {request.features.map((feature) => (
                                    <Badge 
                                      key={feature} 
                                      variant="outline" 
                                      className="capitalize text-xs bg-purple-500/10 border-purple-500/30 text-purple-400 hover:bg-purple-500/20 transition-colors"
                                    >
                                  {feature.replace("-", " ")}
                                </Badge>
                              ))}
                            </div>
                          </div>

                              {/* Action Section */}
                          {request.status === "pending" && (
                                <div className="flex justify-end pt-3 border-t border-gray-700/50">
                              <Button
                                variant="outline"
                                size="sm"
                                    className="border-purple-500/30 hover:bg-purple-900/20 text-purple-400 hover:text-purple-300 w-full sm:w-auto"
                              >
                                    <span className="flex items-center gap-2">
                                      <span>✏️</span>
                                Edit Request
                                    </span>
                              </Button>
                            </div>
                          )}

                              {/* Status-specific actions */}
                              {request.status === "approved" && (
                                <div className="flex justify-end pt-3 border-t border-gray-700/50">
                                  <Badge className="bg-green-500/20 text-green-400 border-green-500/30">
                                    <span className="flex items-center gap-1">
                                      <CheckCircle className="h-3 w-3" />
                                      Ready to Start
                                    </span>
                                  </Badge>
                            </div>
                          )}
                        </CardContent>
                      </Card>
                        </motion.div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

            <TabsContent value="projects" className="space-y-4 sm:space-y-6">
            <Card className="border border-purple-500/30 bg-black/60 backdrop-blur-md">
                <CardHeader className="pb-4">
                  <CardTitle className="text-lg sm:text-xl">Your Projects</CardTitle>
                  <CardDescription className="text-sm">Track the progress of your active projects</CardDescription>
              </CardHeader>
              <CardContent>
                {projects.length === 0 ? (
                  <div className="text-center py-8">
                      <p className="text-muted-foreground text-sm sm:text-base">You don't have any active projects yet</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {projects.map((project) => (
                      <Card key={project.id} className="border border-purple-500/20 bg-black/40">
                          <CardContent className="p-4 sm:p-6">
                            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-4 gap-3">
                            <div>
                                <h3 className="text-base sm:text-lg font-semibold capitalize">{project.websiteType} Website</h3>
                                <p className="text-xs sm:text-sm text-muted-foreground">
                                Started{" "}
                                {formatDistanceToNow(
                                  project.createdAt &&
                                    typeof project.createdAt === "object" &&
                                    "toDate" in project.createdAt
                                    ? project.createdAt.toDate()
                                    : new Date(project.createdAt as string),
                                  { addSuffix: true },
                                )}
                              </p>
                            </div>
                            <Badge
                                className={`text-xs sm:text-sm ${statusColors[project.status as keyof typeof statusColors]}`}
                            >
                              <span className="capitalize">{project.status}</span>
                            </Badge>
                          </div>

                          <div className="mb-4">
                              <p className="text-xs sm:text-sm font-medium text-gray-400">Deadline</p>
                              <p className="text-sm sm:text-base">{new Date(project.deadline).toLocaleDateString()}</p>
                          </div>

                          <div className="space-y-4 mt-6">
                              <div className="flex items-center justify-between">
                            <p className="text-sm font-medium">Project Progress</p>
                                <Badge 
                                  variant="outline" 
                                  className="text-xs bg-purple-500/10 border-purple-500/30 text-purple-400"
                                >
                                    {project.status === "completed"
                                      ? "100%"
                                      : project.status === "final review"
                                      ? "90%"
                                      : project.status === "client review"
                                      ? "75%"
                                      : project.status === "in progress"
                                      ? "50%"
                                      : "25%"}
                                </Badge>
                                </div>
                                
                              <div className="space-y-3">
                                {/* Progress Bar */}
                                <div className="relative">
                                  <div className="h-3 w-full bg-gray-800 rounded-full overflow-hidden border border-gray-700">
                                  <motion.div
                                    initial={{ width: 0 }}
                                    animate={{
                                      width:
                                        project.status === "completed"
                                          ? "100%"
                                          : project.status === "final review"
                                          ? "90%"
                                          : project.status === "client review"
                                          ? "75%"
                                          : project.status === "in progress"
                                          ? "50%"
                                          : "25%"
                                    }}
                                      transition={{ duration: 0.8, ease: "easeOut" }}
                                      className="h-full bg-gradient-to-r from-purple-600 via-purple-500 to-purple-400 rounded-full relative"
                                    >
                                      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent animate-pulse"></div>
                                    </motion.div>
                                  </div>
                                </div>
                                
                                {/* Progress Steps */}
                                <div className="grid grid-cols-5 gap-2">
                                  {[
                                    { label: "Start", status: "completed" },
                                    { label: "In Progress", status: project.status === "in progress" || project.status === "client review" || project.status === "final review" || project.status === "completed" ? "completed" : "pending" },
                                    { label: "Review", status: project.status === "client review" || project.status === "final review" || project.status === "completed" ? "completed" : "pending" },
                                    { label: "Final", status: project.status === "final review" || project.status === "completed" ? "completed" : "pending" },
                                    { label: "Done", status: project.status === "completed" ? "completed" : "pending" }
                                  ].map((step, index) => (
                                    <div key={index} className="flex flex-col items-center">
                                      <div className={`
                                        w-6 h-6 rounded-full flex items-center justify-center text-xs font-medium mb-1
                                        ${step.status === "completed" 
                                          ? "bg-purple-600 text-white" 
                                          : "bg-gray-700 text-gray-400 border border-gray-600"
                                        }
                                      `}>
                                        {step.status === "completed" ? "✓" : index + 1}
                                      </div>
                                      <span className={`text-xs text-center ${step.status === "completed" ? "text-purple-400" : "text-gray-500"}`}>
                                        {step.label}
                                      </span>
                                    </div>
                                  ))}
                                </div>
                                
                                {/* Current Status */}
                                <div className="mt-4 p-3 bg-gray-800/50 rounded-lg border border-gray-700">
                                  <div className="flex items-center gap-2">
                                    <div className="w-2 h-2 bg-purple-500 rounded-full animate-pulse"></div>
                                    <span className="text-sm text-gray-300">
                                      Current Status: <span className="font-medium text-purple-400 capitalize">{project.status}</span>
                                    </span>
                                </div>
                              </div>
                            </div>
                          </div>

                            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mt-4 gap-4">
                            <div>
                                <p className="text-xs sm:text-sm font-medium text-gray-400 mb-1">Payment Status</p>
                              <Badge
                                variant={project.depositPaid ? "default" : "outline"}
                                  className={`text-xs sm:text-sm ${project.depositPaid ? "bg-green-500/20 text-green-500" : ""}`}
                              >
                                {project.depositPaid
                                  ? project.finalPaid
                                    ? "Fully Paid"
                                    : "Deposit Paid"
                                  : "Awaiting Payment"}
                              </Badge>
                            </div>

                            <div className="flex gap-2">
                              <Button
                                asChild
                                size="lg"
                                className="bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800 text-white font-semibold shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200 w-full sm:w-auto px-6 py-3"
                              >
                                <Link href={`/dashboard/projects/${project.id}`} className="flex items-center gap-2">
                                  <span>👁️</span>
                                  <span>View Details</span>
                                  <span>→</span>
                                </Link>
                              </Button>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
        </div>
      </div>
    </AuthGuard>
  )
}

function LoadingFallback() {
  return (
    <div className="flex justify-center items-center min-h-screen">
      <Loader2 className="h-8 w-8 animate-spin text-purple-500" />
    </div>
  )
}

export default function DashboardPage() {
  return (
    <Suspense fallback={<LoadingFallback />}>
      <DashboardContent />
    </Suspense>
  )
}
