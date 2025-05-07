"use client"

import { useState, useEffect } from "react"
import { useAuth } from "@/lib/auth"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import AuthGuard from "@/components/auth-guard"
import {
  getAllRequests,
  getAllProjects,
  updateRequestStatus,
  updateProjectStatus,
  createProject,
  type Request,
  type Project,
} from "@/lib/firebase"
import { formatDistanceToNow } from "date-fns"
import { Clock, CheckCircle, AlertCircle, PauseCircle, Loader2, DollarSign, X } from "lucide-react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useToast } from "@/components/ui/use-toast"

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

export default function AdminDashboardPage() {
  const { user } = useAuth()
  const [requests, setRequests] = useState<Request[]>([])
  const [projects, setProjects] = useState<Project[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [approveDialogOpen, setApproveDialogOpen] = useState(false)
  const [rejectDialogOpen, setRejectDialogOpen] = useState(false)
  const [holdDialogOpen, setHoldDialogOpen] = useState(false)
  const [selectedRequest, setSelectedRequest] = useState<Request | null>(null)
  const [quotedBudget, setQuotedBudget] = useState("")
  const [rejectReason, setRejectReason] = useState("")
  const [holdReason, setHoldReason] = useState("")
  const { toast } = useToast()

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true)

        // Fetch all requests
        const requestsData = await getAllRequests()
        setRequests(requestsData)

        // Fetch all projects
        const projectsData = await getAllProjects()
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
  }, [])

  const handleApproveClick = (request: Request) => {
    setSelectedRequest(request)
    setQuotedBudget(request.budget)
    setApproveDialogOpen(true)
  }

  const handleRejectClick = (request: Request) => {
    setSelectedRequest(request)
    setRejectReason("")
    setRejectDialogOpen(true)
  }

  const handleHoldClick = (request: Request) => {
    setSelectedRequest(request)
    setHoldReason("")
    setHoldDialogOpen(true)
  }

  const confirmApprove = async () => {
    if (!selectedRequest) return

    try {
      // Update request status
      await updateRequestStatus(selectedRequest.id, "approved", {
        quotedBudget: quotedBudget,
      })

      // Create a new project
      const projectData = {
        requestId: selectedRequest.id,
        userId: selectedRequest.userId,
        userEmail: selectedRequest.userEmail,
        websiteType: selectedRequest.websiteType,
        features: selectedRequest.features,
        deadline: selectedRequest.deadline,
        budget: quotedBudget,
        status: "in progress",
      }

      const projectId = await createProject(projectData)

      // Update local state
      setRequests((prev) =>
        prev.map((req) => (req.id === selectedRequest.id ? { ...req, status: "approved", quotedBudget } : req)),
      )

      // Add the new project to the projects list
      const newProject = {
        id: projectId,
        ...projectData,
        createdAt: new Date().toISOString(),
      } as Project

      setProjects((prev) => [newProject, ...prev])

      toast({
        title: "Request Approved",
        description: "The request has been approved and a new project has been created.",
      })
    } catch (error: any) {
      toast({
        title: "Error",
        description: `Failed to approve request: ${error.message}`,
        variant: "destructive",
      })
    } finally {
      setApproveDialogOpen(false)
    }
  }

  const confirmReject = async () => {
    if (!selectedRequest) return

    try {
      await updateRequestStatus(selectedRequest.id, "rejected", {
        rejectionReason: rejectReason,
      })

      setRequests((prev) =>
        prev.map((req) =>
          req.id === selectedRequest.id ? { ...req, status: "rejected", rejectionReason: rejectReason } : req,
        ),
      )

      toast({
        title: "Request Rejected",
        description: "The request has been rejected.",
      })
    } catch (error: any) {
      toast({
        title: "Error",
        description: `Failed to reject request: ${error.message}`,
        variant: "destructive",
      })
    } finally {
      setRejectDialogOpen(false)
    }
  }

  const confirmHold = async () => {
    if (!selectedRequest) return

    try {
      await updateRequestStatus(selectedRequest.id, "on hold", {
        holdReason: holdReason,
      })

      setRequests((prev) =>
        prev.map((req) =>
          req.id === selectedRequest.id ? { ...req, status: "on hold", holdReason: holdReason } : req,
        ),
      )

      toast({
        title: "Request On Hold",
        description: "The request has been put on hold.",
      })
    } catch (error: any) {
      toast({
        title: "Error",
        description: `Failed to put request on hold: ${error.message}`,
        variant: "destructive",
      })
    } finally {
      setHoldDialogOpen(false)
    }
  }

  const handleUpdateProjectStatus = async (projectId: string, newStatus: string) => {
    try {
      await updateProjectStatus(projectId, newStatus)

      setProjects((prev) =>
        prev.map((project) => (project.id === projectId ? { ...project, status: newStatus } : project)),
      )

      toast({
        title: "Project Updated",
        description: `Project status updated to ${newStatus}.`,
      })
    } catch (error: any) {
      toast({
        title: "Error",
        description: `Failed to update project: ${error.message}`,
        variant: "destructive",
      })
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
              <h2 className="text-xl font-bold mb-2">Error Loading Admin Dashboard</h2>
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
        <h1 className="text-3xl font-bold mb-8">Admin Dashboard</h1>

        <Tabs defaultValue="requests" className="space-y-8">
          <TabsList className="bg-black/40 border border-purple-500/20">
            <TabsTrigger value="requests">Requests</TabsTrigger>
            <TabsTrigger value="projects">Projects</TabsTrigger>
          </TabsList>

          <TabsContent value="requests" className="space-y-6">
            <Card className="border border-purple-500/30 bg-black/60 backdrop-blur-md">
              <CardHeader>
                <CardTitle>Website Requests</CardTitle>
                <CardDescription>Manage client website requests</CardDescription>
              </CardHeader>
              <CardContent>
                {requests.length === 0 ? (
                  <div className="text-center py-8">
                    <p className="text-muted-foreground">No requests available</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {requests.map((request) => (
                      <Card key={request.id} className="border border-purple-500/20 bg-black/40">
                        <CardContent className="p-6">
                          <div className="flex flex-col md:flex-row md:items-center justify-between mb-4">
                            <div>
                              <h3 className="text-lg font-semibold capitalize">{request.websiteType} Website</h3>
                              <p className="text-sm text-muted-foreground">From: {request.userEmail}</p>
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

                          {request.designPreferences && (
                            <div className="mb-4">
                              <p className="text-sm font-medium mb-1">Design Preferences</p>
                              <p className="text-sm text-muted-foreground">{request.designPreferences}</p>
                            </div>
                          )}

                          {request.status === "pending" && (
                            <div className="flex justify-end gap-2">
                              <Button
                                onClick={() => handleApproveClick(request)}
                                className="bg-green-600 hover:bg-green-700"
                                size="sm"
                              >
                                <CheckCircle className="h-4 w-4 mr-1" /> Approve
                              </Button>
                              <Button
                                onClick={() => handleHoldClick(request)}
                                variant="outline"
                                className="border-blue-500/30 text-blue-500 hover:bg-blue-900/20"
                                size="sm"
                              >
                                <PauseCircle className="h-4 w-4 mr-1" /> Hold
                              </Button>
                              <Button
                                onClick={() => handleRejectClick(request)}
                                variant="outline"
                                className="border-red-500/30 text-red-500 hover:bg-red-900/20"
                                size="sm"
                              >
                                <X className="h-4 w-4 mr-1" /> Reject
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
                <CardTitle>Active Projects</CardTitle>
                <CardDescription>Manage ongoing projects</CardDescription>
              </CardHeader>
              <CardContent>
                {projects.length === 0 ? (
                  <div className="text-center py-8">
                    <p className="text-muted-foreground">No active projects</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {projects.map((project) => (
                      <Card key={project.id} className="border border-purple-500/20 bg-black/40">
                        <CardContent className="p-6">
                          <div className="flex flex-col md:flex-row md:items-center justify-between mb-4">
                            <div>
                              <h3 className="text-lg font-semibold capitalize">{project.websiteType} Website</h3>
                              <p className="text-sm text-muted-foreground">Client: {project.userEmail}</p>
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

                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                            <div>
                              <p className="text-sm font-medium">Budget</p>
                              <p className="text-sm">${project.budget}</p>
                            </div>
                            <div>
                              <p className="text-sm font-medium">Deadline</p>
                              <p className="text-sm">{new Date(project.deadline).toLocaleDateString()}</p>
                            </div>
                          </div>

                          <div className="space-y-2 mb-4">
                            <p className="text-sm font-medium">Progress</p>
                            <div className="w-full bg-gray-800 rounded-full h-2.5">
                              <div
                                className="bg-purple-600 h-2.5 rounded-full"
                                style={{
                                  width:
                                    project.status === "completed"
                                      ? "100%"
                                      : project.status === "final review"
                                        ? "90%"
                                        : project.status === "client review"
                                          ? "75%"
                                          : project.status === "in progress"
                                            ? "50%"
                                            : "25%",
                                }}
                              ></div>
                            </div>
                          </div>

                          <div className="flex justify-end gap-2">
                            {project.status === "in progress" && (
                              <Button
                                onClick={() => handleUpdateProjectStatus(project.id, "client review")}
                                className="bg-orange-600 hover:bg-orange-700"
                                size="sm"
                              >
                                Move to Client Review
                              </Button>
                            )}
                            {project.status === "client review" && (
                              <Button
                                onClick={() => handleUpdateProjectStatus(project.id, "final review")}
                                className="bg-indigo-600 hover:bg-indigo-700"
                                size="sm"
                              >
                                Move to Final Review
                              </Button>
                            )}
                            {project.status === "final review" && (
                              <Button
                                onClick={() => handleUpdateProjectStatus(project.id, "completed")}
                                className="bg-green-600 hover:bg-green-700"
                                size="sm"
                              >
                                Mark as Completed
                              </Button>
                            )}
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

        {/* Approve Dialog */}
        <Dialog open={approveDialogOpen} onOpenChange={setApproveDialogOpen}>
          <DialogContent className="bg-black/90 border border-purple-500/30">
            <DialogHeader>
              <DialogTitle>Approve Request</DialogTitle>
              <DialogDescription>
                Confirm the budget for this project. The client will be notified and payment will be requested.
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="budget">Budget (USD)</Label>
                <div className="flex items-center">
                  <DollarSign className="h-4 w-4 mr-2 text-muted-foreground" />
                  <Input
                    id="budget"
                    type="number"
                    value={quotedBudget}
                    onChange={(e) => setQuotedBudget(e.target.value)}
                    className="bg-black/50 border-purple-500/30 focus:border-purple-500"
                  />
                </div>
                <p className="text-xs text-muted-foreground">Client's proposed budget: ${selectedRequest?.budget}</p>
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setApproveDialogOpen(false)}>
                Cancel
              </Button>
              <Button className="bg-green-600 hover:bg-green-700" onClick={confirmApprove}>
                Approve & Create Project
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Reject Dialog */}
        <Dialog open={rejectDialogOpen} onOpenChange={setRejectDialogOpen}>
          <DialogContent className="bg-black/90 border border-purple-500/30">
            <DialogHeader>
              <DialogTitle>Reject Request</DialogTitle>
              <DialogDescription>
                Provide a reason for rejecting this request. The client will be notified.
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="reason">Reason (Optional)</Label>
                <Textarea
                  id="reason"
                  placeholder="Enter reason for rejection"
                  value={rejectReason}
                  onChange={(e) => setRejectReason(e.target.value)}
                  className="min-h-[100px] bg-black/50 border-purple-500/30 focus:border-purple-500"
                />
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setRejectDialogOpen(false)}>
                Cancel
              </Button>
              <Button className="bg-red-600 hover:bg-red-700" onClick={confirmReject}>
                Reject Request
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Hold Dialog */}
        <Dialog open={holdDialogOpen} onOpenChange={setHoldDialogOpen}>
          <DialogContent className="bg-black/90 border border-purple-500/30">
            <DialogHeader>
              <DialogTitle>Put Request On Hold</DialogTitle>
              <DialogDescription>
                Provide a reason for putting this request on hold. The client will be notified.
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="holdReason">Reason (Optional)</Label>
                <Textarea
                  id="holdReason"
                  placeholder="Enter reason for hold"
                  value={holdReason}
                  onChange={(e) => setHoldReason(e.target.value)}
                  className="min-h-[100px] bg-black/50 border-purple-500/30 focus:border-purple-500"
                />
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setHoldDialogOpen(false)}>
                Cancel
              </Button>
              <Button className="bg-blue-600 hover:bg-blue-700" onClick={confirmHold}>
                Put On Hold
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </AuthGuard>
  )
}
