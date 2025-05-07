"use client"

import { useState, useEffect } from "react"
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
import { handlePaymentSuccess } from "@/app/actions/payment"
import { PaymentButton } from "@/components/payment-button"
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

export default function DashboardPage() {
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

  // Handle payment success
  useEffect(() => {
    const payment = searchParams.get("payment")
    const sessionId = searchParams.get("session_id")

    if (payment === "success" && sessionId) {
      const confirmPayment = async () => {
        try {
          await handlePaymentSuccess(sessionId)

          toast({
            title: "Payment Successful",
            description: "Your payment has been processed successfully.",
            variant: "default",
          })

          // Refresh projects to show updated payment status
          if (user) {
            const projectsData = await getUserProjects(user.uid)
            setProjects(projectsData)
          }
        } catch (error: any) {
          toast({
            title: "Payment Verification Error",
            description: error.message || "Failed to verify payment",
            variant: "destructive",
          })
        }
      }

      confirmPayment()
    } else if (payment === "cancelled") {
      toast({
        title: "Payment Cancelled",
        description: "Your payment was cancelled.",
        variant: "destructive",
      })
    }
  }, [searchParams, toast, user])

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
    )
  }

  return (
    <AuthGuard>
      <div className="container mx-auto px-4 py-24">
        <h1 className="text-3xl font-bold mb-8">Dashboard</h1>

        <Tabs defaultValue="requests" className="space-y-8">
          <TabsList className="bg-black/40 border border-purple-500/20">
            <TabsTrigger value="requests">Requests</TabsTrigger>
            <TabsTrigger value="projects">Projects</TabsTrigger>
          </TabsList>

          <TabsContent value="requests" className="space-y-6">
            <Card className="border border-purple-500/30 bg-black/60 backdrop-blur-md">
              <CardHeader>
                <CardTitle>Website Requests</CardTitle>
                <CardDescription>View and manage your website requests</CardDescription>
              </CardHeader>
              <CardContent>
                {requests.length === 0 ? (
                  <div className="text-center py-8">
                    <p className="text-muted-foreground mb-4">You haven't submitted any requests yet</p>
                    <Button asChild className="bg-purple-600 hover:bg-purple-700">
                      <Link href="/request">Create a Request</Link>
                    </Button>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {requests.map((request) => (
                      <Card key={request.id} className="border border-purple-500/20 bg-black/40">
                        <CardContent className="p-6">
                          <div className="flex flex-col md:flex-row md:items-center justify-between mb-4">
                            <div>
                              <h3 className="text-lg font-semibold capitalize">{request.websiteType} Website</h3>
                              <p className="text-sm text-muted-foreground">
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
                            <Badge
                              className={`mt-2 md:mt-0 flex items-center gap-1 ${statusColors[request.status as keyof typeof statusColors]}`}
                            >
                              {getStatusIcon(request.status)}
                              <span className="capitalize">{request.status}</span>
                            </Badge>
                          </div>

                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                            <div>
                              <p className="text-sm font-medium">Budget</p>
                              <p className="text-sm">${request.budget}</p>
                            </div>
                            <div>
                              <p className="text-sm font-medium">Deadline</p>
                              <p className="text-sm">{new Date(request.deadline).toLocaleDateString()}</p>
                            </div>
                          </div>

                          <div className="mb-4">
                            <p className="text-sm font-medium mb-1">Features</p>
                            <div className="flex flex-wrap gap-2">
                              {request.features.map((feature) => (
                                <Badge key={feature} variant="outline" className="capitalize">
                                  {feature.replace("-", " ")}
                                </Badge>
                              ))}
                            </div>
                          </div>

                          {request.status === "pending" && (
                            <div className="flex justify-end">
                              <Button
                                variant="outline"
                                size="sm"
                                className="border-purple-500/30 hover:bg-purple-900/20"
                              >
                                Edit Request
                              </Button>
                            </div>
                          )}
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="projects" className="space-y-6">
            <Card className="border border-purple-500/30 bg-black/60 backdrop-blur-md">
              <CardHeader>
                <CardTitle>Your Projects</CardTitle>
                <CardDescription>Track the progress of your active projects</CardDescription>
              </CardHeader>
              <CardContent>
                {projects.length === 0 ? (
                  <div className="text-center py-8">
                    <p className="text-muted-foreground">You don't have any active projects yet</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {projects.map((project) => (
                      <Card key={project.id} className="border border-purple-500/20 bg-black/40">
                        <CardContent className="p-6">
                          <div className="flex flex-col md:flex-row md:items-center justify-between mb-4">
                            <div>
                              <h3 className="text-lg font-semibold capitalize">{project.websiteType} Website</h3>
                              <p className="text-sm text-muted-foreground">
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
                              className={`mt-2 md:mt-0 ${statusColors[project.status as keyof typeof statusColors]}`}
                            >
                              <span className="capitalize">{project.status}</span>
                            </Badge>
                          </div>

                          <div className="mb-4">
                            <p className="text-sm font-medium">Deadline</p>
                            <p className="text-sm">{new Date(project.deadline).toLocaleDateString()}</p>
                          </div>

                          <div className="space-y-4 mt-6">
                            <p className="text-sm font-medium">Project Progress</p>
                            <div className="flex flex-col md:flex-row items-center gap-6">
                              <div className="w-24 h-24">
                                <CircularProgressbar
                                  value={
                                    project.status === "completed"
                                      ? 100
                                      : project.status === "final review"
                                      ? 90
                                      : project.status === "client review"
                                      ? 75
                                      : project.status === "in progress"
                                      ? 50
                                      : 25
                                  }
                                  strokeWidth={10}
                                  styles={buildStyles({
                                    pathColor: `rgba(147, 51, 234, ${
                                      project.status === "completed" ? 1 : 0.8
                                    })`,
                                    trailColor: "rgba(147, 51, 234, 0.1)",
                                    strokeLinecap: "round"
                                  })}
                                />
                              </div>
                              
                              <div className="flex-1 space-y-2 w-full">
                                <div className="flex justify-between text-sm">
                                  <span className="text-muted-foreground">Progress</span>
                                  <span className="font-medium">
                                    {project.status === "completed"
                                      ? "100%"
                                      : project.status === "final review"
                                      ? "90%"
                                      : project.status === "client review"
                                      ? "75%"
                                      : project.status === "in progress"
                                      ? "50%"
                                      : "25%"}
                                  </span>
                                </div>
                                
                                <div className="relative h-2 w-full bg-purple-950/30 rounded-full overflow-hidden">
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
                                    transition={{ duration: 0.5, ease: "easeOut" }}
                                    className="absolute top-0 left-0 h-full bg-gradient-to-r from-purple-600 to-purple-400 rounded-full"
                                  />
                                </div>
                                
                                <div className="flex justify-between text-xs text-muted-foreground">
                                  <span>Start</span>
                                  <span className="capitalize">{project.status}</span>
                                  <span>Completion</span>
                                </div>
                              </div>
                            </div>
                          </div>

                          <div className="flex flex-col md:flex-row justify-between items-center mt-4 gap-4">
                            <div>
                              <p className="text-sm font-medium">Payment Status</p>
                              <Badge
                                variant={project.depositPaid ? "default" : "outline"}
                                className={project.depositPaid ? "bg-green-500/20 text-green-500" : ""}
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
                                variant="outline"
                                size="sm"
                                className="border-purple-500/30 hover:bg-purple-900/20"
                              >
                                <Link href={`/dashboard/projects/${project.id}`}>View Details</Link>
                              </Button>

                              {!project.depositPaid && (
                                <PaymentButton
                                  projectId={project.id}
                                  amount={Number.parseFloat(project.budget) * 0.5}
                                  userEmail={project.userEmail}
                                  paymentType="deposit"
                                  label="Pay Deposit"
                                  className="bg-purple-600 hover:bg-purple-700 size-sm"
                                />
                              )}

                              {project.depositPaid && !project.finalPaid && project.status === "completed" && (
                                <PaymentButton
                                  projectId={project.id}
                                  amount={Number.parseFloat(project.budget) * 0.5}
                                  userEmail={project.userEmail}
                                  paymentType="final"
                                  label="Pay Final Amount"
                                  className="bg-green-600 hover:bg-green-700 size-sm"
                                />
                              )}
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
    </AuthGuard>
  )
}
