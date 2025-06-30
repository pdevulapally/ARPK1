"use client"

import { useState, useEffect } from "react"
import { useAuth } from "@/lib/auth"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Textarea } from "@/components/ui/textarea"
import { useToast } from "@/components/ui/use-toast"
import AuthGuard from "@/components/auth-guard"
import {
  getAllRequests,
  getAllContactSubmissions,
  getAllMaintenanceSubmissions,
  updateSubmissionStatus,
} from "@/lib/firebase-client"
import { type Request } from "@/lib/firebase-types"
import { formatDistanceToNow } from "date-fns"
import { 
  Clock, 
  CheckCircle, 
  AlertCircle, 
  PauseCircle, 
  Loader2, 
  Search, 
  Filter, 
  Eye, 
  MessageCircle, 
  Wrench,
  FileText,
  Mail,
  Calendar,
  User,
  Building,
  Phone,
  ExternalLink
} from "lucide-react"

const statusColors = {
  new: "bg-blue-500/20 text-blue-500 border-blue-500/50",
  pending: "bg-yellow-500/20 text-yellow-500 border-yellow-500/50",
  approved: "bg-green-500/20 text-green-500 border-green-500/50",
  rejected: "bg-red-500/20 text-red-500 border-red-500/50",
  "on hold": "bg-orange-500/20 text-orange-500 border-orange-500/50",
  "in progress": "bg-purple-500/20 text-purple-500 border-purple-500/50",
  "client review": "bg-indigo-500/20 text-indigo-500 border-indigo-500/50",
  "final review": "bg-pink-500/20 text-pink-500 border-pink-500/50",
  completed: "bg-green-500/20 text-green-500 border-green-500/50",
  contacted: "bg-green-500/20 text-green-500 border-green-500/50",
  archived: "bg-gray-500/20 text-gray-500 border-gray-500/50",
}

const statusOptions = [
  { value: "new", label: "New" },
  { value: "pending", label: "Pending" },
  { value: "contacted", label: "Contacted" },
  { value: "approved", label: "Approved" },
  { value: "rejected", label: "Rejected" },
  { value: "on hold", label: "On Hold" },
  { value: "in progress", label: "In Progress" },
  { value: "completed", label: "Completed" },
  { value: "archived", label: "Archived" },
]

export default function AdminSubmissionsPage() {
  const { user } = useAuth()
  const [requests, setRequests] = useState<Request[]>([])
  const [contactSubmissions, setContactSubmissions] = useState<any[]>([])
  const [maintenanceSubmissions, setMaintenanceSubmissions] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [selectedSubmission, setSelectedSubmission] = useState<any>(null)
  const [detailDialogOpen, setDetailDialogOpen] = useState(false)
  const [statusDialogOpen, setStatusDialogOpen] = useState(false)
  const [newStatus, setNewStatus] = useState("")
  const [adminNotes, setAdminNotes] = useState("")
  const { toast } = useToast()

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true)

        // Fetch all types of submissions
        const [requestsData, contactData, maintenanceData] = await Promise.all([
          getAllRequests(),
          getAllContactSubmissions(),
          getAllMaintenanceSubmissions(),
        ])

        setRequests(requestsData)
        setContactSubmissions(contactData)
        setMaintenanceSubmissions(maintenanceData)
        setError(null)
      } catch (error: any) {
        console.error("Error fetching submissions:", error)
        setError(error.message || "Failed to load submissions")
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [])

  const handleStatusUpdate = async () => {
    if (!selectedSubmission || !newStatus) return

    try {
      const collectionName = selectedSubmission.type === "contact" ? "contactSubmissions" : 
                           selectedSubmission.type === "maintenance" ? "maintenanceSubmissions" : "requests"

      await updateSubmissionStatus(collectionName, selectedSubmission.id, newStatus, {
        adminNotes: adminNotes || undefined,
      })

      // Update local state
      const updateSubmission = (submissions: any[], type: string) => {
        return submissions.map((sub) =>
          sub.id === selectedSubmission.id ? { ...sub, status: newStatus, adminNotes } : sub
        )
      }

      if (selectedSubmission.type === "contact") {
        setContactSubmissions(prev => updateSubmission(prev, "contact"))
      } else if (selectedSubmission.type === "maintenance") {
        setMaintenanceSubmissions(prev => updateSubmission(prev, "maintenance"))
      } else {
        setRequests(prev => updateSubmission(prev, "request"))
      }

      toast({
        title: "Status Updated",
        description: "Submission status has been updated successfully.",
      })
    } catch (error: any) {
      toast({
        title: "Error",
        description: `Failed to update status: ${error.message}`,
        variant: "destructive",
      })
    } finally {
      setStatusDialogOpen(false)
      setNewStatus("")
      setAdminNotes("")
    }
  }

  const openDetailDialog = (submission: any, type: string) => {
    setSelectedSubmission({ ...submission, type })
    setDetailDialogOpen(true)
  }

  const openStatusDialog = (submission: any, type: string) => {
    setSelectedSubmission({ ...submission, type })
    setNewStatus(submission.status)
    setAdminNotes(submission.adminNotes || "")
    setStatusDialogOpen(true)
  }

  const filterSubmissions = (submissions: any[]) => {
    return submissions.filter((submission) => {
      const matchesSearch = 
        submission.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        submission.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        submission.subject?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        submission.message?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        submission.needs?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        submission.company?.toLowerCase().includes(searchTerm.toLowerCase())

      const matchesStatus = statusFilter === "all" || submission.status === statusFilter

      return matchesSearch && matchesStatus
    })
  }

  const getSubmissionIcon = (type: string) => {
    switch (type) {
      case "contact":
        return <Mail className="w-4 h-4" />
      case "maintenance":
        return <Wrench className="w-4 h-4" />
      case "request":
        return <FileText className="w-4 h-4" />
      default:
        return <MessageCircle className="w-4 h-4" />
    }
  }

  const getSubmissionTypeLabel = (type: string) => {
    switch (type) {
      case "contact":
        return "Contact Form"
      case "maintenance":
        return "Custom Maintenance"
      case "request":
        return "Website Request"
      default:
        return "Unknown"
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <Loader2 className="w-8 h-8 animate-spin mx-auto mb-4 text-purple-500" />
          <p className="text-gray-400">Loading submissions...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <AlertCircle className="w-8 h-8 mx-auto mb-4 text-red-500" />
          <p className="text-red-400">Error: {error}</p>
        </div>
      </div>
    )
  }

  const allSubmissions = [
    ...contactSubmissions.map(contact => ({ ...contact, type: "contact" })),
    ...maintenanceSubmissions.map(maintenance => ({ ...maintenance, type: "maintenance" }))
  ].sort((a, b) => {
    const dateA = a.createdAt?.toDate?.() || new Date(a.createdAt)
    const dateB = b.createdAt?.toDate?.() || new Date(b.createdAt)
    return dateB.getTime() - dateA.getTime()
  })

  const filteredSubmissions = filterSubmissions(allSubmissions)

  return (
    <AuthGuard>
      <div className="container mx-auto px-4 py-4 sm:py-6 lg:py-8 max-w-7xl">
        {/* Header */}
        <div className="mb-6 sm:mb-8">
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-white mb-2">Submissions</h1>
          <p className="text-sm sm:text-base text-gray-400">Manage all incoming submissions and requests</p>
        </div>

        {/* Filters */}
        <div className="mb-6 space-y-3 sm:space-y-0 sm:flex sm:items-center sm:gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <Input
              placeholder="Search submissions..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 h-12 sm:h-10 bg-black/40 border-white/20 text-white placeholder:text-gray-400 text-base"
            />
          </div>
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-full sm:w-48 h-12 sm:h-10 bg-black/40 border-white/20 text-white">
              <SelectValue placeholder="Filter by status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Statuses</SelectItem>
              {statusOptions.map((status) => (
                <SelectItem key={status.value} value={status.value}>
                  {status.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4 mb-6 sm:mb-8">
          <Card className="bg-black/40 border-white/20">
            <CardContent className="p-3 sm:p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs sm:text-sm text-gray-400">Total Submissions</p>
                  <p className="text-xl sm:text-2xl font-bold text-white">{allSubmissions.length}</p>
                </div>
                <MessageCircle className="w-6 h-6 sm:w-8 sm:h-8 text-purple-500" />
              </div>
            </CardContent>
          </Card>
          <Card className="bg-black/40 border-white/20">
            <CardContent className="p-3 sm:p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs sm:text-sm text-gray-400">New</p>
                  <p className="text-xl sm:text-2xl font-bold text-blue-500">
                    {allSubmissions.filter(s => s.status === "new").length}
                  </p>
                </div>
                <Clock className="w-6 h-6 sm:w-8 sm:h-8 text-blue-500" />
              </div>
            </CardContent>
          </Card>
          <Card className="bg-black/40 border-white/20">
            <CardContent className="p-3 sm:p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs sm:text-sm text-gray-400">Pending</p>
                  <p className="text-xl sm:text-2xl font-bold text-yellow-500">
                    {allSubmissions.filter(s => s.status === "pending").length}
                  </p>
                </div>
                <PauseCircle className="w-6 h-6 sm:w-8 sm:h-8 text-yellow-500" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Submissions List */}
        <div className="space-y-3 sm:space-y-4">
          {filteredSubmissions.length === 0 ? (
            <Card className="bg-black/40 border-white/20">
              <CardContent className="p-8 text-center">
                <MessageCircle className="w-12 h-12 mx-auto mb-4 text-gray-400" />
                <p className="text-gray-400">No submissions found</p>
              </CardContent>
            </Card>
          ) : (
            filteredSubmissions.map((submission) => (
              <Card key={`${submission.type}-${submission.id}`} className="bg-black/40 border-white/20 hover:border-purple-500/50 transition-colors">
                <CardContent className="p-4 sm:p-6">
                  <div className="space-y-4 sm:space-y-0 sm:flex sm:items-start sm:justify-between sm:gap-4">
                    <div className="flex-1 space-y-3">
                      {/* Header with badges */}
                      <div className="flex flex-wrap items-center gap-2 sm:gap-3">
                        {getSubmissionIcon(submission.type)}
                        <Badge variant="outline" className={`text-xs sm:text-sm ${statusColors[submission.status as keyof typeof statusColors] || "bg-gray-500/20 text-gray-500 border-gray-500/50"}`}>
                          {submission.status}
                        </Badge>
                        <Badge variant="outline" className="bg-purple-500/20 text-purple-500 border-purple-500/50 text-xs sm:text-sm">
                          {getSubmissionTypeLabel(submission.type)}
                        </Badge>
                      </div>
                      
                      {/* Submission details */}
                      <div className="space-y-2">
                        <div className="flex items-center gap-2">
                          <User className="w-4 h-4 text-gray-400 flex-shrink-0" />
                          <span className="font-medium text-white text-sm sm:text-base">{submission.name}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Mail className="w-4 h-4 text-gray-400 flex-shrink-0" />
                          <span className="text-gray-300 text-sm sm:text-base break-all">{submission.email}</span>
                        </div>
                        {submission.company && (
                          <div className="flex items-center gap-2">
                            <Building className="w-4 h-4 text-gray-400 flex-shrink-0" />
                            <span className="text-gray-300 text-sm sm:text-base">{submission.company}</span>
                          </div>
                        )}
                        {submission.subject && (
                          <p className="text-gray-300 font-medium text-sm sm:text-base">{submission.subject}</p>
                        )}
                        {submission.needs && (
                          <p className="text-gray-300 text-sm line-clamp-2">{submission.needs}</p>
                        )}
                        {submission.message && (
                          <p className="text-gray-300 text-sm line-clamp-2">{submission.message}</p>
                        )}
                        <div className="flex items-center gap-2 text-xs text-gray-400 pt-1">
                          <Calendar className="w-3 h-3" />
                          {submission.createdAt?.toDate ? 
                            formatDistanceToNow(submission.createdAt.toDate(), { addSuffix: true }) :
                            formatDistanceToNow(new Date(submission.createdAt), { addSuffix: true })
                          }
                        </div>
                      </div>
                    </div>
                    
                    {/* Action buttons */}
                    <div className="flex flex-col gap-2 sm:flex-shrink-0">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => openDetailDialog(submission, submission.type)}
                        className="border-white/20 text-white hover:bg-white/10 h-10 sm:h-9 text-sm"
                      >
                        <Eye className="w-4 h-4 mr-2" />
                        View
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => openStatusDialog(submission, submission.type)}
                        className="border-purple-500/50 text-purple-400 hover:bg-purple-500/10 h-10 sm:h-9 text-sm"
                      >
                        <Filter className="w-4 h-4 mr-2" />
                        Update Status
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </div>

        {/* Detail Dialog */}
        <Dialog open={detailDialogOpen} onOpenChange={setDetailDialogOpen}>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto bg-black/90 border-white/20 mx-4">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2 text-lg sm:text-xl">
                {selectedSubmission && getSubmissionIcon(selectedSubmission.type)}
                {selectedSubmission && getSubmissionTypeLabel(selectedSubmission.type)} Details
              </DialogTitle>
            </DialogHeader>
            {selectedSubmission && (
              <div className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium text-gray-400">Name</label>
                    <p className="text-white text-sm sm:text-base">{selectedSubmission.name}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-400">Email</label>
                    <p className="text-white text-sm sm:text-base break-all">{selectedSubmission.email}</p>
                  </div>
                  {selectedSubmission.company && (
                    <div>
                      <label className="text-sm font-medium text-gray-400">Company</label>
                      <p className="text-white text-sm sm:text-base">{selectedSubmission.company}</p>
                    </div>
                  )}
                  {selectedSubmission.companySize && (
                    <div>
                      <label className="text-sm font-medium text-gray-400">Company Size</label>
                      <p className="text-white text-sm sm:text-base">{selectedSubmission.companySize}</p>
                    </div>
                  )}
                  {selectedSubmission.subject && (
                    <div className="sm:col-span-2">
                      <label className="text-sm font-medium text-gray-400">Subject</label>
                      <p className="text-white text-sm sm:text-base">{selectedSubmission.subject}</p>
                    </div>
                  )}
                </div>
                
                {selectedSubmission.message && (
                  <div>
                    <label className="text-sm font-medium text-gray-400">Message</label>
                    <p className="text-white whitespace-pre-wrap text-sm sm:text-base">{selectedSubmission.message}</p>
                  </div>
                )}
                
                {selectedSubmission.needs && (
                  <div>
                    <label className="text-sm font-medium text-gray-400">Maintenance Needs</label>
                    <p className="text-white whitespace-pre-wrap text-sm sm:text-base">{selectedSubmission.needs}</p>
                  </div>
                )}
                
                {selectedSubmission.extra && (
                  <div>
                    <label className="text-sm font-medium text-gray-400">Additional Information</label>
                    <p className="text-white whitespace-pre-wrap text-sm sm:text-base">{selectedSubmission.extra}</p>
                  </div>
                )}

                {selectedSubmission.adminNotes && (
                  <div>
                    <label className="text-sm font-medium text-gray-400">Admin Notes</label>
                    <p className="text-white whitespace-pre-wrap text-sm sm:text-base">{selectedSubmission.adminNotes}</p>
                  </div>
                )}

                <div className="flex flex-col sm:flex-row sm:items-center gap-2 pt-2 border-t border-white/10">
                  <Badge variant="outline" className={`text-xs sm:text-sm w-fit ${statusColors[selectedSubmission.status as keyof typeof statusColors] || "bg-gray-500/20 text-gray-500 border-gray-500/50"}`}>
                    {selectedSubmission.status}
                  </Badge>
                  <span className="text-xs text-gray-400">
                    {selectedSubmission.createdAt?.toDate ? 
                      selectedSubmission.createdAt.toDate().toLocaleString() :
                      new Date(selectedSubmission.createdAt).toLocaleString()
                    }
                  </span>
                </div>
              </div>
            )}
          </DialogContent>
        </Dialog>

        {/* Status Update Dialog */}
        <Dialog open={statusDialogOpen} onOpenChange={setStatusDialogOpen}>
          <DialogContent className="max-w-md bg-black/90 border-white/20 mx-4">
            <DialogHeader>
              <DialogTitle className="text-lg sm:text-xl">Update Status</DialogTitle>
              <DialogDescription className="text-sm sm:text-base">
                Update the status and add notes for this submission.
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium text-gray-400">Status</label>
                <Select value={newStatus} onValueChange={setNewStatus}>
                  <SelectTrigger className="bg-black/40 border-white/20 text-white h-12 sm:h-10">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {statusOptions.map((status) => (
                      <SelectItem key={status.value} value={status.value}>
                        {status.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-400">Admin Notes</label>
                <Textarea
                  value={adminNotes}
                  onChange={(e) => setAdminNotes(e.target.value)}
                  placeholder="Add notes about this submission..."
                  className="bg-black/40 border-white/20 text-white placeholder:text-gray-400 min-h-[100px]"
                />
              </div>
            </div>
            <DialogFooter className="flex-col sm:flex-row gap-2">
              <Button variant="outline" onClick={() => setStatusDialogOpen(false)} className="w-full sm:w-auto h-12 sm:h-10">
                Cancel
              </Button>
              <Button onClick={handleStatusUpdate} disabled={!newStatus} className="w-full sm:w-auto h-12 sm:h-10">
                Update Status
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </AuthGuard>
  )
} 