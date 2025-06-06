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
import { useAuth } from "@/lib/auth"
import AuthGuard from "@/components/auth-guard"
import { PaymentButton } from "@/components/payment-button"
import { InvoiceButton } from "@/components/invoice-button"
import { DiscountCodeForm } from "@/components/discount-code-form"
import { PaymentReminderCard } from "@/components/payment-reminder"

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

// Move this outside the component to avoid recreation on each render
const createSampleReminder = (project: ProjectDetails | null) => {
  if (!project) return null

  return {
    id: "sample-reminder",
    projectId: project.id,
    userId: project.userId,
    userEmail: project.userEmail,
    paymentType: "deposit",
    amount: Number.parseFloat(project.budget) * 0.5,
    dueDate: new Date(new Date().setDate(new Date().getDate() + 7)).toISOString(),
    status: "pending",
    createdAt: new Date().toISOString(),
  }
}

export default function ProjectDetailsPage() {
  const params = useParams()
  const router = useRouter()
  const { toast } = useToast()
  const { user } = useAuth()
  const [project, setProject] = useState<ProjectDetails | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
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

        const projectData = {
          id: projectDoc.id,
          ...projectDoc.data(),
        } as ProjectDetails

        // Check if the project belongs to the current user
        if (projectData.userId !== user?.uid) {
          setError("You don't have permission to view this project")
          return
        }

        setProject(projectData)
      } catch (error: any) {
        console.error("Error fetching project:", error)
        setError(error.message || "Failed to load project")
      } finally {
        setLoading(false)
      }
    }

    if (user) {
      fetchProject()
    }
  }, [db, params.id, user])

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

  if (error || !project) {
    return (
      <div className="container mx-auto px-4 py-24">
        <Card className="border border-red-500/30 bg-black/60 backdrop-blur-md">
          <CardContent className="p-6">
            <div className="text-center py-8">
              <AlertCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
              <h2 className="text-xl font-bold mb-2">Error Loading Project</h2>
              <p className="text-gray-400 mb-4">{error || "Project not found"}</p>
              <Button onClick={() => router.push("/dashboard")} className="bg-purple-600 hover:bg-purple-700">
                Back to Dashboard
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
        <div className="flex items-center justify-between mb-6">
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
                <CardDescription>Basic information about your project</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h3 className="text-sm font-medium text-gray-400 mb-1">Project Type</h3>
                    <p className="text-lg font-medium capitalize">{project.websiteType} Website</p>
                  </div>
                  <div>
                    <h3 className="text-sm font-medium text-gray-400 mb-1">Budget</h3>
                    <p className="text-lg font-medium">£{project.budget}</p>
                  </div>
                  <div>
                    <h3 className="text-sm font-medium text-gray-400 mb-1">Deadline</h3>
                    <p className="text-lg font-medium">{new Date(project.deadline).toLocaleDateString()}</p>
                  </div>
                  <div>
                    <h3 className="text-sm font-medium text-gray-400 mb-1">Payment Status</h3>
                    <Badge
                      className={
                        project.depositPaid ? "bg-green-500/20 text-green-500" : "bg-yellow-500/20 text-yellow-500"
                      }
                    >
                      {project.depositPaid ? (project.finalPaid ? "Fully Paid" : "Deposit Paid") : "Awaiting Deposit"}
                    </Badge>
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
                  <h3 className="text-sm font-medium text-gray-400 mb-2">Progress</h3>
                  <div className="space-y-2">
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
                    <div className="flex justify-between text-xs text-gray-400">
                      <span>Start</span>
                      <span>In Progress</span>
                      <span>Client Review</span>
                      <span>Final Review</span>
                      <span>Complete</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="details" className="space-y-6">
            <Card className="border border-purple-500/30 bg-black/60 backdrop-blur-md">
              <CardHeader>
                <CardTitle>Project Details</CardTitle>
                <CardDescription>Detailed information about your project</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {project.designPreferences && (
                  <div>
                    <h3 className="text-sm font-medium text-gray-400 mb-2">Design Preferences</h3>
                    <p className="text-gray-300 bg-black/40 p-4 rounded-md border border-purple-500/20">
                      {project.designPreferences}
                    </p>
                  </div>
                )}

                {project.additionalNotes && (
                  <div>
                    <h3 className="text-sm font-medium text-gray-400 mb-2">Additional Notes</h3>
                    <p className="text-gray-300 bg-black/40 p-4 rounded-md border border-purple-500/20">
                      {project.additionalNotes}
                    </p>
                  </div>
                )}

                <div>
                  <h3 className="text-sm font-medium text-gray-400 mb-2">Timeline</h3>
                  <div className="space-y-4">
                    <div className="flex items-start gap-3">
                      <div className="w-8 h-8 rounded-full bg-purple-600 flex items-center justify-center shrink-0">
                        <Clock className="h-4 w-4 text-white" />
                      </div>
                      <div>
                        <p className="font-medium">Project Created</p>
                        <p className="text-sm text-gray-400">
                          {project.createdAt && typeof project.createdAt === "object" && "toDate" in project.createdAt
                            ? project.createdAt.toDate().toLocaleString()
                            : new Date(project.createdAt).toLocaleString()}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-start gap-3">
                      <div className="w-8 h-8 rounded-full bg-yellow-600 flex items-center justify-center shrink-0">
                        <Clock className="h-4 w-4 text-white" />
                      </div>
                      <div>
                        <p className="font-medium">Deadline</p>
                        <p className="text-sm text-gray-400">{new Date(project.deadline).toLocaleString()}</p>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="payments" className="space-y-6">
            {loading ? (
              <div className="flex justify-center py-8">
                <Loader2 className="h-8 w-8 animate-spin text-purple-500" />
              </div>
            ) : !project ? (
              <Card className="border border-red-500/30 bg-black/60 backdrop-blur-md">
                <CardContent className="p-6 text-center">
                  <p>Project information not available</p>
                </CardContent>
              </Card>
            ) : (
              <>
                <Card className="border border-purple-500/30 bg-black/60 backdrop-blur-md">
                  <CardHeader>
                    <CardTitle>Payment Information</CardTitle>
                    <CardDescription>Manage payments for your project</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <h3 className="text-sm font-medium text-gray-400 mb-1">Total Budget</h3>
                        <p className="text-2xl font-medium">£{project.budget}</p>
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
                          <p className="text-sm text-gray-400">£{Number.parseFloat(project.budget) * 0.5}</p>
                        </div>
                        <div className="flex items-center gap-3">
                          <Badge
                            variant={project.depositPaid ? "default" : "outline"}
                            className={project.depositPaid ? "bg-green-500/20 text-green-500" : ""}
                          >
                            {project.depositPaid ? "Paid" : "Unpaid"}
                          </Badge>

                          {!project.depositPaid ? (
                            <PaymentButton
                              projectId={project.id}
                              amount={Number.parseFloat(project.budget) * 0.5}
                              userEmail={project.userEmail}
                              paymentType="deposit"
                              label="Pay Deposit"
                              className="bg-purple-600 hover:bg-purple-700"
                            />
                          ) : (
                            <InvoiceButton
                              project={{
                                ...project,
                                requestId: project.id,
                                customerId: project.userId,
                                depositAmount: Number.parseFloat(project.budget) * 0.5,
                                finalAmount: Number.parseFloat(project.budget) * 0.5,
                                title: `${project.websiteType} Website Project`
                              }}
                              invoiceType="deposit"
                              className="border-green-500/30 text-green-500 hover:bg-green-900/20"
                            />
                          )}
                        </div>
                      </div>

                      <div className="flex justify-between items-center">
                        <div>
                          <h3 className="font-medium">Final Payment (50%)</h3>
                          <p className="text-sm text-gray-400">£{Number.parseFloat(project.budget) * 0.5}</p>
                        </div>
                        <div className="flex items-center gap-3">
                          <Badge
                            variant={project.finalPaid ? "default" : "outline"}
                            className={project.finalPaid ? "bg-green-500/20 text-green-500" : ""}
                          >
                            {project.finalPaid ? "Paid" : "Unpaid"}
                          </Badge>

                          {project.depositPaid && !project.finalPaid && project.status === "completed" ? (
                            <PaymentButton
                              projectId={project.id}
                              amount={Number.parseFloat(project.budget) * 0.5}
                              userEmail={project.userEmail}
                              paymentType="final"
                              label="Pay Final Amount"
                              className="bg-green-600 hover:bg-green-700"
                            />
                          ) : (
                            project.finalPaid && (
                              <InvoiceButton
                                project={{
                                  ...project,
                                  requestId: project.id, // Using id as requestId
                                  customerId: project.userId, // Using userId as customerId
                                  depositAmount: Number.parseFloat(project.budget) * 0.5,
                                  finalAmount: Number.parseFloat(project.budget) * 0.5,
                                  title: `${project.websiteType} Website Project` // Generating title from websiteType
                                }}
                                invoiceType="final"
                                className="border-green-500/30 text-green-500 hover:bg-green-900/20"
                              />
                            )
                          )}
                        </div>
                      </div>
                    </div>

                    <Separator className="bg-purple-500/20" />

                    {/* Add discount code form */}
                    <DiscountCodeForm
                      onApplyDiscount={(discount) => {
                        toast({
                          title: "Discount Applied",
                         description: `${discount.percentage}% discount has been applied to your order.`,

                        })
                      }}
                    />

                    <div>
                      <h3 className="text-sm font-medium text-gray-400 mb-2">Payment Policy</h3>
                      <div className="text-gray-300 bg-black/40 p-4 rounded-md border border-purple-500/20">
                        <p className="mb-2">Our payment process is structured in two parts:</p>
                        <ul className="list-disc pl-5 space-y-1">
                          <li>50% deposit payment is required to begin work on your project</li>
                          <li>The remaining 50% is due upon project completion</li>
                          <li>All payments are processed securely through Stripe</li>
                          <li>Invoices will be provided for all payments</li>
                        </ul>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card className="border border-purple-500/30 bg-black/60 backdrop-blur-md">
                  <CardHeader>
                    <CardTitle>Payment Reminders</CardTitle>
                    <CardDescription>Upcoming and past payment reminders</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <PaymentReminderCard
                      reminder={createSampleReminder(project)}
                      projectId={project.id}
                      userEmail={project.userEmail}
                    />
                  </CardContent>
                </Card>
              </>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </AuthGuard>
  )
}
