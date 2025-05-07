"use client"

import { useState, useEffect } from "react"
import { useParams, useRouter } from "next/navigation"
import { doc, getDoc, getFirestore } from "firebase/firestore"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Separator } from "@/components/ui/separator"
import { useToast } from "@/components/ui/use-toast"
import { Loader2, ArrowLeft, Clock, CheckCircle, AlertCircle, PauseCircle } from "lucide-react"
import { updateProjectStatus } from "@/lib/firebase"
import Link from "next/link"
import { motion } from "framer-motion"
import { CircularProgressbar, buildStyles } from "react-circular-progressbar"
import "react-circular-progressbar/dist/styles.css"

interface ProjectDetails {
  id: string
  userId: string
  userEmail: string
  websiteType: string
  features: string[]
  deadline: string
  budget: string
  status: string
  createdAt: any
  designPreferences?: string
  additionalNotes?: string
  paymentStatus?: string
  depositPaid?: boolean
  finalPaid?: boolean
}

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

export default function ProjectDetailsPage() {
  const params = useParams()
  const router = useRouter()
  const { toast } = useToast()
  const [project, setProject] = useState<ProjectDetails | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [updating, setUpdating] = useState(false)
  const db = getFirestore()

  useEffect(() => {
    const fetchProject = async () => {
      try {
        setLoading(true)
        const projectId = params.id as string
        const projectDoc = await getDoc(doc(db, "projects", projectId))

        if (!projectDoc.exists()) {
          setError("Project not found")
          return
        }

        setProject({
          id: projectDoc.id,
          ...projectDoc.data(),
        } as ProjectDetails)
      } catch (error: any) {
        console.error("Error fetching project:", error)
        setError(error.message || "Failed to load project")
      } finally {
        setLoading(false)
      }
    }

    fetchProject()
  }, [db, params.id])

  const handleUpdateStatus = async (newStatus: string) => {
    if (!project) return

    try {
      setUpdating(true)
      await updateProjectStatus(project.id, newStatus)

      // Update local state
      setProject({
        ...project,
        status: newStatus,
      })

      toast({
        title: "Status Updated",
        description: `Project status updated to ${newStatus}`,
      })
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to update status",
        variant: "destructive",
      })
    } finally {
      setUpdating(false)
    }
  }

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
      <div className="flex justify-center items-center h-full">
        <Loader2 className="h-8 w-8 animate-spin text-purple-500" />
      </div>
    )
  }

  if (error || !project) {
    return (
      <div className="flex flex-col items-center justify-center h-full">
        <AlertCircle className="h-12 w-12 text-red-500 mb-4" />
        <h2 className="text-xl font-bold mb-2">Error Loading Project</h2>
        <p className="text-gray-400 mb-4">{error || "Project not found"}</p>
        <Button onClick={() => router.back()} className="bg-purple-600 hover:bg-purple-700">
          Go Back
        </Button>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Button variant="outline" size="icon" onClick={() => router.back()}>
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <h1 className="text-2xl font-bold">Project Details</h1>
        </div>
        <Badge
          className={`${statusColors[project.status as keyof typeof statusColors]} flex items-center gap-1 px-3 py-1.5`}
        >
          {getStatusIcon(project.status)}
          <span className="capitalize">{project.status}</span>
        </Badge>
      </div>

      <Tabs defaultValue="overview" className="space-y-6">
        <TabsList className="bg-black/40 border border-purple-500/20">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="details">Details</TabsTrigger>
          <TabsTrigger value="payments">Payments</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          <Card className="border border-purple-500/30 bg-black/60 backdrop-blur-md">
            <CardHeader>
              <CardTitle>Project Overview</CardTitle>
              <CardDescription>Basic information about this project</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h3 className="text-sm font-medium text-gray-400 mb-1">Project Type</h3>
                  <p className="text-lg font-medium capitalize">{project.websiteType} Website</p>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-gray-400 mb-1">Client</h3>
                  <p className="text-lg font-medium">{project.userEmail}</p>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-gray-400 mb-1">Budget</h3>
                  <p className="text-lg font-medium">${project.budget}</p>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-gray-400 mb-1">Deadline</h3>
                  <p className="text-lg font-medium">{new Date(project.deadline).toLocaleDateString()}</p>
                </div>
              </div>

              <Separator className="bg-purple-500/20" />

              <div>
                <h3 className="text-sm font-medium text-gray-400 mb-2">Features</h3>
                <div className="flex flex-wrap gap-2">
                  {project.features.map((feature) => (
                    <Badge key={feature} variant="outline" className="capitalize">
                      {feature.replace("-", " ")}
                    </Badge>
                  ))}
                </div>
              </div>

              <Separator className="bg-purple-500/20" />

              <div>
                <h3 className="text-sm font-medium text-gray-400 mb-4">Project Progress</h3>
                <div className="flex flex-col lg:flex-row gap-8">
                  <div className="w-32 h-32 mx-auto lg:mx-0">
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
                      text={`${
                        project.status === "completed"
                          ? "100%"
                          : project.status === "final review"
                          ? "90%"
                          : project.status === "client review"
                          ? "75%"
                          : project.status === "in progress"
                          ? "50%"
                          : "25%"
                      }`}
                      strokeWidth={10}
                      styles={buildStyles({
                        pathColor: `rgba(147, 51, 234, ${project.status === "completed" ? 1 : 0.8})`,
                        trailColor: "rgba(147, 51, 234, 0.1)",
                        textColor: "#fff",
                        textSize: "16px",
                        strokeLinecap: "round"
                      })}
                    />
                  </div>
                  
                  <div className="flex-1 space-y-4">
                    <div className="relative pt-1">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm font-medium text-purple-300">Progress</span>
                        <span className="text-sm font-medium text-purple-300">{project.status}</span>
                      </div>
                      <div className="flex h-2 mb-4 overflow-hidden rounded-full bg-purple-900/20">
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
                          className="flex flex-col justify-center rounded-full bg-gradient-to-r from-purple-600 to-purple-400 shadow-lg shadow-purple-500/30"
                        />
                      </div>
                      <div className="grid grid-cols-5 gap-2 text-xs text-gray-400">
                        <div className="text-center">
                          <div className="w-2 h-2 mb-1 rounded-full bg-purple-500 mx-auto" />
                          <span>Start</span>
                        </div>
                        <div className="text-center">
                          <div className="w-2 h-2 mb-1 rounded-full bg-purple-500/50 mx-auto" />
                          <span>In Progress</span>
                        </div>
                        <div className="text-center">
                          <div className="w-2 h-2 mb-1 rounded-full bg-purple-500/50 mx-auto" />
                          <span>Review</span>
                        </div>
                        <div className="text-center">
                          <div className="w-2 h-2 mb-1 rounded-full bg-purple-500/50 mx-auto" />
                          <span>Final</span>
                        </div>
                        <div className="text-center">
                          <div className="w-2 h-2 mb-1 rounded-full bg-purple-500/50 mx-auto" />
                          <span>Complete</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border border-purple-500/30 bg-black/60 backdrop-blur-md">
            <CardHeader>
              <CardTitle>Update Status</CardTitle>
              <CardDescription>Change the current status of this project</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-2">
                <Button
                  onClick={() => handleUpdateStatus("in progress")}
                  disabled={updating || project.status === "in progress"}
                  className="bg-purple-600 hover:bg-purple-700"
                >
                  In Progress
                </Button>
                <Button
                  onClick={() => handleUpdateStatus("client review")}
                  disabled={updating || project.status === "client review"}
                  className="bg-orange-600 hover:bg-orange-700"
                >
                  Client Review
                </Button>
                <Button
                  onClick={() => handleUpdateStatus("final review")}
                  disabled={updating || project.status === "final review"}
                  className="bg-indigo-600 hover:bg-indigo-700"
                >
                  Final Review
                </Button>
                <Button
                  onClick={() => handleUpdateStatus("completed")}
                  disabled={updating || project.status === "completed"}
                  className="bg-green-600 hover:bg-green-700"
                >
                  Completed
                </Button>
                <Button
                  onClick={() => handleUpdateStatus("on hold")}
                  disabled={updating || project.status === "on hold"}
                  variant="outline"
                  className="border-blue-500/30 text-blue-500 hover:bg-blue-900/20"
                >
                  On Hold
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="details" className="space-y-6">
          <Card className="border border-purple-500/30 bg-black/60 backdrop-blur-md hover:border-purple-500/50 transition-all duration-300">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <span className="inline-block w-2 h-2 rounded-full bg-purple-500" />
                Project Details
              </CardTitle>
              <CardDescription className="text-purple-300/70">Detailed information about this project</CardDescription>
            </CardHeader>
            <CardContent className="space-y-8">
              {project.designPreferences && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5 }}
                >
                  <h3 className="text-sm font-medium text-purple-300 mb-2 flex items-center gap-2">
                    <span className="inline-block w-1 h-1 rounded-full bg-purple-500" />
                    Design Preferences
                  </h3>
                  <p className="text-gray-300 bg-black/40 p-6 rounded-lg border border-purple-500/20 hover:border-purple-500/40 transition-all duration-300">
                    {project.designPreferences}
                  </p>
                </motion.div>
              )}

              {project.additionalNotes && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.2 }}
                >
                  <h3 className="text-sm font-medium text-purple-300 mb-2 flex items-center gap-2">
                    <span className="inline-block w-1 h-1 rounded-full bg-purple-500" />
                    Additional Notes
                  </h3>
                  <p className="text-gray-300 bg-black/40 p-6 rounded-lg border border-purple-500/20 hover:border-purple-500/40 transition-all duration-300">
                    {project.additionalNotes}
                  </p>
                </motion.div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="payments" className="space-y-6">
          <Card className="border border-purple-500/30 bg-black/60 backdrop-blur-md">
            <CardHeader>
              <CardTitle>Payment Status</CardTitle>
              <CardDescription>Manage payments for this project</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h3 className="text-sm font-medium text-gray-400 mb-1">Total Budget</h3>
                  <p className="text-2xl font-medium">${project.budget}</p>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-gray-400 mb-1">Payment Status</h3>
                  <Badge
                    className={
                      project.depositPaid ? "bg-green-500/20 text-green-500" : "bg-yellow-500/20 text-yellow-500"
                    }
                  >
                    {project.paymentStatus || "Awaiting Deposit"}
                  </Badge>
                </div>
              </div>

              <Separator className="bg-purple-500/20" />

              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <div>
                    <h3 className="font-medium">Deposit (50%)</h3>
                    <p className="text-sm text-gray-400">${Number.parseFloat(project.budget) * 0.5}</p>
                  </div>
                  <Badge
                    variant={project.depositPaid ? "default" : "outline"}
                    className={project.depositPaid ? "bg-green-500/20 text-green-500" : ""}
                  >
                    {project.depositPaid ? "Paid" : "Unpaid"}
                  </Badge>
                </div>

                <div className="flex justify-between items-center">
                  <div>
                    <h3 className="font-medium">Final Payment (50%)</h3>
                    <p className="text-sm text-gray-400">${Number.parseFloat(project.budget) * 0.5}</p>
                  </div>
                  <Badge
                    variant={project.finalPaid ? "default" : "outline"}
                    className={project.finalPaid ? "bg-green-500/20 text-green-500" : ""}
                  >
                    {project.finalPaid ? "Paid" : "Unpaid"}
                  </Badge>
                </div>
              </div>

              <Separator className="bg-purple-500/20" />

              <div className="space-y-4">
                <h3 className="text-sm font-medium text-gray-400 mb-2">Payment Actions</h3>
                <div className="flex flex-wrap gap-2">
                  {!project.depositPaid && (
                    <Button className="bg-purple-600 hover:bg-purple-700">Request Deposit Payment</Button>
                  )}

                  {project.depositPaid && !project.finalPaid && project.status === "completed" && (
                    <Button className="bg-green-600 hover:bg-green-700">Request Final Payment</Button>
                  )}

                  <Button variant="outline" asChild>
                    <Link href={`/admin/payments/invoice/${project.id}`}>View Invoice</Link>
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
