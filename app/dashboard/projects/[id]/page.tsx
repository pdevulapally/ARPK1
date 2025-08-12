"use client"

import { useState, useEffect } from "react"
import { useParams, useRouter } from "next/navigation"
import { doc, getDoc, getFirestore, collection, query, where, getDocs } from "firebase/firestore"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Separator } from "@/components/ui/separator"
import { useToast } from "@/components/ui/use-toast"
import { Loader2, ArrowLeft, Clock, CheckCircle, AlertCircle, PauseCircle, Calendar, DollarSign, Target, Users, FileText } from "lucide-react"
import { useAuth } from "@/lib/auth"
import AuthGuard from "@/components/auth-guard"
import { PaymentButton } from "@/components/payment-button"
import { InvoiceButton } from "@/components/invoice-button"
import { DiscountCodeForm } from "@/components/discount-code-form"
import { PaymentReminderCard } from "@/components/payment-reminder"
import { motion } from "framer-motion"

interface ProjectDetails {
  id: string
  userId: string
  userEmail: string
  websiteType: string
  features: string[]
  deadline: any
  budget: string | number
  status: string
  createdAt: any
  designPreferences?: string
  additionalNotes?: string
  paymentStatus?: string
  depositPaid?: boolean
  finalPaid?: boolean
  quotedBudget?: string | number
  appliedDiscount?: {
    code: string
    percentage: number
    appliedAt: any
  }
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

const ProjectDetailsPage = () => {
  const params = useParams()
  const router = useRouter()
  const { toast } = useToast()
  const { user } = useAuth()
  const [project, setProject] = useState<ProjectDetails | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [paymentReminders, setPaymentReminders] = useState<any[]>([])
  const [appliedDiscount, setAppliedDiscount] = useState<any>(null)
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

        // Load applied discount if it exists
        if (projectData.appliedDiscount) {
          setAppliedDiscount(projectData.appliedDiscount)
        }

        // Fetch payment reminders for this project
        try {
          const remindersQuery = query(
            collection(db, "paymentReminders"),
            where("projectId", "==", projectId)
          )
          const remindersSnapshot = await getDocs(remindersQuery)
          const reminders = remindersSnapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data()
          }))
          setPaymentReminders(reminders)
        } catch (reminderError) {
          console.error("Error fetching payment reminders:", reminderError)
          // Don't fail the whole page if reminders fail to load
        }
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
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900 flex justify-center items-center">
        <div className="text-center">
          <div className="w-16 h-16 bg-purple-600/20 rounded-full flex items-center justify-center mx-auto mb-4">
        <Loader2 className="h-8 w-8 animate-spin text-purple-500" />
          </div>
          <p className="text-gray-400">Loading project details...</p>
        </div>
      </div>
    )
  }

  if (error || !project) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900">
      <div className="container mx-auto px-4 py-24">
        <Card className="border border-red-500/30 bg-black/60 backdrop-blur-md">
          <CardContent className="p-6">
            <div className="text-center py-8">
                <div className="w-16 h-16 bg-red-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
                  <AlertCircle className="h-8 w-8 text-red-500" />
                </div>
                <h2 className="text-xl font-bold mb-2 text-white">Error Loading Project</h2>
                <p className="text-gray-400 mb-6">{error || "Project not found"}</p>
              <Button onClick={() => router.push("/dashboard")} className="bg-purple-600 hover:bg-purple-700">
                Back to Dashboard
              </Button>
            </div>
          </CardContent>
        </Card>
        </div>
      </div>
    )
  }

  // Add safety check for null/undefined project
  if (!project) {
    return <div>Loading...</div>
  }

  // Ensure features is always an array
  const features = Array.isArray(project.features) ? project.features : []

  // Get budget from project data
  const budgetValue = typeof project.budget === 'number' ? project.budget : 
                     typeof project.budget === 'string' ? parseFloat(project.budget) || 0 : 0

  // Calculate discounted amounts
  const calculateDiscountedAmount = (originalAmount: number) => {
    if (!appliedDiscount) return originalAmount
    const discountMultiplier = (100 - appliedDiscount.percentage) / 100
    return originalAmount * discountMultiplier
  }

  const depositAmount = budgetValue * 0.5
  const finalAmount = budgetValue * 0.5
  const discountedDepositAmount = calculateDiscountedAmount(depositAmount)
  const discountedFinalAmount = calculateDiscountedAmount(finalAmount)

  return (
    <AuthGuard>
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900">
        <div className="container mx-auto px-4 py-16 sm:py-24">
          {/* Premium Header */}
          <motion.div 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex items-center justify-between mb-8"
          >
            <div className="flex items-center gap-4">
              <Button 
                variant="outline" 
                size="icon" 
                onClick={() => router.back()}
                className="h-12 w-12 border-purple-500/30 text-purple-400 hover:bg-purple-500/20 transition-all duration-300"
              >
                <ArrowLeft className="h-5 w-5" />
            </Button>
              <div>
                <h1 className="text-xl sm:text-2xl font-bold text-white flex items-center gap-3">
                  <div className="w-10 h-10 bg-purple-600 rounded-lg flex items-center justify-center">
                    <FileText className="h-5 w-5 text-white" />
                  </div>
                  Project Details
                </h1>
                <p className="text-sm sm:text-base text-gray-400 mt-1">Manage your project and track progress</p>
              </div>
          </div>
          <Badge
              className={`${statusColors[project.status as keyof typeof statusColors]} flex items-center gap-2 px-4 py-2 text-sm`}
          >
            {getStatusIcon(project.status)}
              <span className="capitalize hidden sm:inline">{project.status}</span>
              <span className="capitalize sm:hidden">{project.status.slice(0, 3)}</span>
          </Badge>
          </motion.div>

          <Tabs defaultValue="overview" className="space-y-6 sm:space-y-8">
            <TabsList className="grid w-full grid-cols-3 bg-black/40 border border-purple-500/20 h-14">
              <TabsTrigger value="overview" className="text-sm sm:text-base data-[state=active]:bg-purple-600/20">Overview</TabsTrigger>
              <TabsTrigger value="details" className="text-sm sm:text-base data-[state=active]:bg-purple-600/20">Details</TabsTrigger>
              <TabsTrigger value="payments" className="text-sm sm:text-base data-[state=active]:bg-purple-600/20">Payments</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
              >
                <Card className="border border-purple-500/30 bg-gradient-to-br from-black/60 to-gray-900/60 backdrop-blur-md">
                  <CardHeader className="pb-6">
                    <CardTitle className="text-xl sm:text-2xl flex items-center gap-3">
                      <div className="w-10 h-10 bg-purple-600/20 rounded-lg flex items-center justify-center">
                        <Target className="h-5 w-5 text-purple-400" />
                      </div>
                      Project Overview
                    </CardTitle>
                    <CardDescription className="text-base">Essential information about your project</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                    {/* Project Stats Grid */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                      <div className="bg-gray-800/30 rounded-xl p-4 border border-gray-700/50">
                        <div className="flex items-center gap-3 mb-2">
                          <div className="w-8 h-8 bg-blue-500/20 rounded-lg flex items-center justify-center">
                            <span className="text-blue-400 text-sm font-semibold">T</span>
                          </div>
                          <span className="text-xs font-medium text-gray-400 uppercase tracking-wide">Type</span>
                        </div>
                        <p className="text-lg font-semibold capitalize text-white">{project.websiteType} Website</p>
                      </div>

                      <div className="bg-gray-800/30 rounded-xl p-4 border border-gray-700/50">
                        <div className="flex items-center gap-3 mb-2">
                          <div className="w-8 h-8 bg-green-500/20 rounded-lg flex items-center justify-center">
                            <DollarSign className="h-4 w-4 text-green-400" />
                          </div>
                          <span className="text-xs font-medium text-gray-400 uppercase tracking-wide">Budget</span>
                        </div>
                        <p className="text-lg font-semibold text-white">£{budgetValue}</p>
                      </div>

                      <div className="bg-gray-800/30 rounded-xl p-4 border border-gray-700/50">
                        <div className="flex items-center gap-3 mb-2">
                          <div className="w-8 h-8 bg-orange-500/20 rounded-lg flex items-center justify-center">
                            <Calendar className="h-4 w-4 text-orange-400" />
                  </div>
                          <span className="text-xs font-medium text-gray-400 uppercase tracking-wide">Deadline</span>
                  </div>
                        <p className="text-lg font-semibold text-white">
                      {project.deadline ? 
                        (typeof project.deadline === 'object' && project.deadline && 'toDate' in project.deadline ? 
                          (project.deadline as any).toDate().toLocaleDateString() : 
                          new Date(project.deadline).toLocaleDateString()
                        ) : 
                        'Not set'
                      }
                    </p>
                  </div>

                      <div className="bg-gray-800/30 rounded-xl p-4 border border-gray-700/50">
                        <div className="flex items-center gap-3 mb-2">
                          <div className="w-8 h-8 bg-purple-500/20 rounded-lg flex items-center justify-center">
                            <Users className="h-4 w-4 text-purple-400" />
                          </div>
                          <span className="text-xs font-medium text-gray-400 uppercase tracking-wide">Payment</span>
                        </div>
                    <Badge
                      className={
                            project.depositPaid ? "bg-green-500/20 text-green-500 border-green-500/50" : "bg-yellow-500/20 text-yellow-500 border-yellow-500/50"
                      }
                    >
                      {project.depositPaid ? (project.finalPaid ? "Fully Paid" : "Deposit Paid") : "Awaiting Deposit"}
                    </Badge>
                  </div>
                </div>

                <Separator className="bg-purple-500/20" />

                    {/* Features Section */}
                <div>
                      <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                        <span className="text-purple-400">✨</span>
                        Project Features
                      </h3>
                      <div className="flex flex-wrap gap-3">
                    {features.map((feature) => (
                          <Badge key={feature} variant="outline" className="capitalize text-sm bg-purple-500/10 border-purple-500/30 text-purple-400 hover:bg-purple-500/20 transition-colors">
                        {feature.replace("-", " ")}
                      </Badge>
                    ))}
                  </div>
                </div>

                <Separator className="bg-purple-500/20" />

                    {/* Progress Section */}
                <div>
                      <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                        <span className="text-purple-400">📊</span>
                        Project Progress
                      </h3>
                      <div className="space-y-4">
                        <div className="flex justify-between items-center">
                          <span className="text-sm text-gray-400">Progress</span>
                          <Badge className="bg-purple-500/20 text-purple-400 border-purple-500/30">
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
                        
                        <div className="relative">
                          <div className="h-4 w-full bg-gray-800 rounded-full overflow-hidden border border-gray-700">
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
                              transition={{ duration: 1, ease: "easeOut" }}
                              className="h-full bg-gradient-to-r from-purple-600 via-purple-500 to-purple-400 rounded-full relative"
                            >
                              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent animate-pulse"></div>
                            </motion.div>
                          </div>
                        </div>

                        {/* Progress Steps */}
                        <div className="grid grid-cols-5 gap-2 mt-4">
                          {[
                            { label: "Start", status: "completed" },
                            { label: "In Progress", status: project.status === "in progress" || project.status === "client review" || project.status === "final review" || project.status === "completed" ? "completed" : "pending" },
                            { label: "Review", status: project.status === "client review" || project.status === "final review" || project.status === "completed" ? "completed" : "pending" },
                            { label: "Final", status: project.status === "final review" || project.status === "completed" ? "completed" : "pending" },
                            { label: "Done", status: project.status === "completed" ? "completed" : "pending" }
                          ].map((step, index) => (
                            <div key={index} className="flex flex-col items-center">
                              <div className={`
                                w-8 h-8 rounded-full flex items-center justify-center text-xs font-medium mb-2
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
                  </div>
                </div>
              </CardContent>
            </Card>
              </motion.div>
          </TabsContent>

          <TabsContent value="details" className="space-y-6">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
              >
                <Card className="border border-purple-500/30 bg-gradient-to-br from-black/60 to-gray-900/60 backdrop-blur-md">
                  <CardHeader className="pb-6">
                    <CardTitle className="text-xl sm:text-2xl flex items-center gap-3">
                      <div className="w-10 h-10 bg-purple-600/20 rounded-lg flex items-center justify-center">
                        <FileText className="h-5 w-5 text-purple-400" />
                      </div>
                      Project Details
                    </CardTitle>
                    <CardDescription className="text-base">Comprehensive information about your project</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {project.designPreferences && (
                      <div className="bg-gray-800/30 rounded-xl p-6 border border-gray-700/50">
                        <h3 className="text-lg font-semibold text-white mb-3 flex items-center gap-2">
                          <span className="text-purple-400">🎨</span>
                          Design Preferences
                        </h3>
                        <p className="text-gray-300 leading-relaxed">
                      {project.designPreferences}
                    </p>
                  </div>
                )}

                {project.additionalNotes && (
                      <div className="bg-gray-800/30 rounded-xl p-6 border border-gray-700/50">
                        <h3 className="text-lg font-semibold text-white mb-3 flex items-center gap-2">
                          <span className="text-purple-400">📝</span>
                          Additional Notes
                        </h3>
                        <p className="text-gray-300 leading-relaxed">
                      {project.additionalNotes}
                    </p>
                  </div>
                )}

                    <div className="bg-gray-800/30 rounded-xl p-6 border border-gray-700/50">
                      <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                        <span className="text-purple-400">📅</span>
                        Project Timeline
                      </h3>
                  <div className="space-y-4">
                        <div className="flex items-start gap-4">
                          <div className="w-10 h-10 rounded-full bg-purple-600 flex items-center justify-center shrink-0">
                            <Clock className="h-5 w-5 text-white" />
                      </div>
                      <div>
                            <p className="font-semibold text-white">Project Created</p>
                        <p className="text-sm text-gray-400">
                          {project.createdAt && typeof project.createdAt === "object" && "toDate" in project.createdAt
                            ? project.createdAt.toDate().toLocaleString()
                            : new Date(project.createdAt).toLocaleString()}
                        </p>
                      </div>
                    </div>

                        <div className="flex items-start gap-4">
                          <div className="w-10 h-10 rounded-full bg-orange-600 flex items-center justify-center shrink-0">
                            <Calendar className="h-5 w-5 text-white" />
                      </div>
                      <div>
                            <p className="font-semibold text-white">Deadline</p>
                        <p className="text-sm text-gray-400">
                          {project.deadline ? 
                            (typeof project.deadline === 'object' && project.deadline && 'toDate' in project.deadline ? 
                              (project.deadline as any).toDate().toLocaleString() : 
                              new Date(project.deadline).toLocaleString()
                            ) : 
                            'Not set'
                          }
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
              </motion.div>
          </TabsContent>

            <TabsContent value="payments" className="space-y-6 mt-20 sm:mt-0">
            {loading ? (
                <div className="flex justify-center py-12">
                  <div className="text-center">
                    <Loader2 className="h-8 w-8 animate-spin text-purple-500 mx-auto mb-4" />
                    <p className="text-gray-400">Loading payment information...</p>
                  </div>
              </div>
            ) : !project ? (
              <Card className="border border-red-500/30 bg-black/60 backdrop-blur-md">
                <CardContent className="p-6 text-center">
                  <p>Project information not available</p>
                </CardContent>
              </Card>
            ) : (
              <>
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                  >
                    <Card className="border border-purple-500/30 bg-gradient-to-br from-black/60 to-gray-900/60 backdrop-blur-md">
                      <CardHeader className="pb-6">
                        <CardTitle className="text-xl sm:text-2xl flex items-center gap-3">
                          <div className="w-10 h-10 bg-purple-600/20 rounded-lg flex items-center justify-center">
                            <DollarSign className="h-5 w-5 text-purple-400" />
                          </div>
                          Payment Information
                        </CardTitle>
                        <CardDescription className="text-base">Manage payments for your project</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                        {/* Payment Summary */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                          <div className="bg-gray-800/30 rounded-xl p-6 border border-gray-700/50">
                            <div className="flex items-center gap-3 mb-3">
                              <div className="w-8 h-8 bg-green-500/20 rounded-lg flex items-center justify-center">
                                <DollarSign className="h-4 w-4 text-green-400" />
                              </div>
                              <span className="text-sm font-medium text-gray-400 uppercase tracking-wide">Total Budget</span>
                            </div>
                            <p className="text-2xl sm:text-3xl font-bold text-white">£{budgetValue}</p>
                          </div>
                          <div className="bg-gray-800/30 rounded-xl p-6 border border-gray-700/50">
                            <div className="flex items-center gap-3 mb-3">
                              <div className="w-8 h-8 bg-purple-500/20 rounded-lg flex items-center justify-center">
                                <CheckCircle className="h-4 w-4 text-purple-400" />
                              </div>
                              <span className="text-sm font-medium text-gray-400 uppercase tracking-wide">Payment Status</span>
                      </div>
                        <Badge
                          className={
                                project.depositPaid ? "bg-green-500/20 text-green-500 border-green-500/50 text-sm" : "bg-yellow-500/20 text-yellow-500 border-yellow-500/50 text-sm"
                          }
                        >
                          {project.paymentStatus || "Awaiting Deposit"}
                        </Badge>
                      </div>
                    </div>

                    <Separator className="bg-purple-500/20" />

                        {/* Payment Breakdown */}
                        <div className="space-y-4">
                          <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                            <span className="text-purple-400">💳</span>
                            Payment Breakdown
                          </h3>

                    <div className="space-y-4">
                            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 p-4 bg-gray-800/30 rounded-xl border border-gray-700/50">
                              <div className="flex items-center gap-4">
                                <div className="w-12 h-12 bg-purple-600/20 rounded-lg flex items-center justify-center">
                                  <span className="text-purple-400 font-semibold">50%</span>
                                </div>
                        <div>
                                  <h4 className="font-semibold text-white">Deposit Payment</h4>
                                  <p className="text-sm text-gray-400">£{discountedDepositAmount.toFixed(2)}</p>
                                </div>
                        </div>
                              <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3">
                          <Badge
                            variant={project.depositPaid ? "default" : "outline"}
                                  className={project.depositPaid ? "bg-green-500/20 text-green-500 border-green-500/50" : "border-gray-600 text-gray-400"}
                          >
                            {project.depositPaid ? "Paid" : "Unpaid"}
                          </Badge>

                          {!project.depositPaid ? (
                            <PaymentButton
                              projectId={project.id}
                                    amount={discountedDepositAmount}
                              paymentType="deposit"
                              discountCode={appliedDiscount?.code}
                              discountPercentage={appliedDiscount?.percentage}
                            />
                          ) : (
                            <InvoiceButton
                              project={{
                                ...project,
                                requestId: project.id,
                                      depositAmount: discountedDepositAmount,
                                      finalAmount: discountedDepositAmount,
                                title: `${project.websiteType} Website Project`
                              } as any}
                              invoiceType="deposit"
                                    className="border-green-500/30 text-green-500 hover:bg-green-900/20 w-full sm:w-auto"
                            />
                          )}
                        </div>
                      </div>

                            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 p-4 bg-gray-800/30 rounded-xl border border-gray-700/50">
                              <div className="flex items-center gap-4">
                                <div className="w-12 h-12 bg-green-600/20 rounded-lg flex items-center justify-center">
                                  <span className="text-green-400 font-semibold">50%</span>
                                </div>
                        <div>
                                  <h4 className="font-semibold text-white">Final Payment</h4>
                                  <p className="text-sm text-gray-400">£{discountedFinalAmount.toFixed(2)}</p>
                                </div>
                        </div>
                              <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3">
                          <Badge
                            variant={project.finalPaid ? "default" : "outline"}
                                  className={project.finalPaid ? "bg-green-500/20 text-green-500 border-green-500/50" : "border-gray-600 text-gray-400"}
                          >
                            {project.finalPaid ? "Paid" : "Unpaid"}
                          </Badge>

                          {project.depositPaid && !project.finalPaid && project.status === "completed" ? (
                            <PaymentButton
                              projectId={project.id}
                                    amount={discountedFinalAmount}
                              paymentType="final"
                              discountCode={appliedDiscount?.code}
                              discountPercentage={appliedDiscount?.percentage}
                            />
                          ) : (
                            project.finalPaid && (
                              <InvoiceButton
                                project={{
                                  ...project,
                                  requestId: project.id,
                                        depositAmount: discountedDepositAmount,
                                        finalAmount: discountedDepositAmount,
                                  title: `${project.websiteType} Website Project`
                                } as any}
                                invoiceType="final"
                                      className="border-green-500/30 text-green-500 hover:bg-green-900/20 w-full sm:w-auto"
                              />
                            )
                          )}
                              </div>
                        </div>
                      </div>
                    </div>

                    <Separator className="bg-purple-500/20" />

                        {/* Discount Code Form */}
                        <div className="bg-gray-800/30 rounded-xl p-6 border border-gray-700/50">
                      <DiscountCodeForm
                        userEmail={project.userEmail}
                        onApplyDiscount={(discount) => {
                              setAppliedDiscount(discount)
                          toast({
                            title: "Discount Applied",
                           description: `${discount.percentage}% discount has been applied to your order.`,
                          })
                        }}
                      />
                    </div>

                        {/* Discount Summary */}
                        {appliedDiscount && (
                          <div className="bg-green-900/20 rounded-xl p-6 border border-green-500/30">
                            <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                              <span className="text-green-400">💰</span>
                              Discount Applied
                            </h3>
                            <div className="space-y-3">
                              <div className="flex justify-between items-center">
                                <span className="text-gray-300">Original Deposit:</span>
                                <span className="text-white line-through">£{depositAmount.toFixed(2)}</span>
                              </div>
                              <div className="flex justify-between items-center">
                                <span className="text-gray-300">Discounted Deposit:</span>
                                <span className="text-green-400 font-semibold">£{discountedDepositAmount.toFixed(2)}</span>
                              </div>
                              <div className="flex justify-between items-center">
                                <span className="text-gray-300">Original Final Payment:</span>
                                <span className="text-white line-through">£{finalAmount.toFixed(2)}</span>
                              </div>
                              <div className="flex justify-between items-center">
                                <span className="text-gray-300">Total Savings:</span>
                                <span className="text-green-400 font-bold">
                                  £{((depositAmount + finalAmount) - (discountedDepositAmount + discountedFinalAmount)).toFixed(2)}
                                </span>
                              </div>
                              <div className="pt-3 border-t border-green-500/30">
                                <div className="flex justify-between items-center">
                                  <span className="text-gray-300">Discounted Final Payment:</span>
                                  <span className="text-green-400 font-semibold">£{discountedFinalAmount.toFixed(2)}</span>
                                </div>
                              </div>
                            </div>
                          </div>
                        )}

                        {/* Payment Policy */}
                        <div className="bg-gray-800/30 rounded-xl p-6 border border-gray-700/50">
                          <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                            <span className="text-purple-400">📋</span>
                            Payment Policy
                          </h3>
                          <div className="text-gray-300 space-y-3">
                            <p className="mb-3">Our payment process is structured in two parts:</p>
                            <ul className="space-y-2 pl-5">
                              <li className="flex items-start gap-2">
                                <span className="text-purple-400 mt-1">•</span>
                                <span>50% deposit payment is required to begin work on your project</span>
                              </li>
                              <li className="flex items-start gap-2">
                                <span className="text-purple-400 mt-1">•</span>
                                <span>The remaining 50% is due upon project completion</span>
                              </li>
                              <li className="flex items-start gap-2">
                                <span className="text-purple-400 mt-1">•</span>
                                <span>All payments are processed securely through Stripe</span>
                              </li>
                              <li className="flex items-start gap-2">
                                <span className="text-purple-400 mt-1">•</span>
                                <span>Invoices will be provided for all payments</span>
                              </li>
                        </ul>
                      </div>
                    </div>
                  </CardContent>
                </Card>
                  </motion.div>

                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4 }}
                  >
                    <Card className="border border-purple-500/30 bg-gradient-to-br from-black/60 to-gray-900/60 backdrop-blur-md">
                      <CardHeader className="pb-6">
                        <CardTitle className="text-xl sm:text-2xl flex items-center gap-3">
                          <div className="w-10 h-10 bg-purple-600/20 rounded-lg flex items-center justify-center">
                            <Clock className="h-5 w-5 text-purple-400" />
                          </div>
                          Payment Reminders
                        </CardTitle>
                        <CardDescription className="text-base">Upcoming and past payment reminders</CardDescription>
                  </CardHeader>
                  <CardContent>
                    {paymentReminders.length > 0 ? (
                      paymentReminders.map((reminder) => (
                        <PaymentReminderCard
                          key={reminder.id}
                          reminder={reminder}
                          projectId={project.id}
                          userEmail={project.userEmail}
                        />
                      ))
                    ) : (
                          <div className="text-center py-12">
                            <div className="w-16 h-16 bg-gray-800 rounded-full flex items-center justify-center mx-auto mb-4">
                              <span className="text-gray-400 text-2xl">🔔</span>
                            </div>
                            <h3 className="text-lg font-semibold text-gray-300 mb-2">No Payment Reminders</h3>
                            <p className="text-muted-foreground">No payment reminders found for this project</p>
                      </div>
                    )}
                  </CardContent>
                </Card>
                  </motion.div>
              </>
            )}
          </TabsContent>
        </Tabs>
        </div>
      </div>
    </AuthGuard>
  )
}

export default ProjectDetailsPage
