"use client"

import { useState, useEffect } from "react"
import { useAuth } from "@/lib/auth"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import AuthGuard from "@/components/auth-guard"
import { PaymentFilters } from "@/components/admin/payment-filters"
import { PaymentDetails } from "@/components/admin/payment-details"
import { getStripePayments, getProjectPayments } from "@/app/actions/admin-payments"
import { format, isToday, isThisWeek, isThisMonth, isThisYear } from "date-fns"
import {
  CreditCard,
  FileText,
  Loader2,
  AlertCircle,
  Calendar,
  User,
  DollarSign,
  ArrowUpDown,
  ExternalLink,
} from "lucide-react"
import { useToast } from "@/components/ui/use-toast"

const statusColors = {
  succeeded: "bg-green-500/20 text-green-500 border-green-500/50",
  paid: "bg-green-500/20 text-green-500 border-green-500/50",
  complete: "bg-green-500/20 text-green-500 border-green-500/50",
  pending: "bg-yellow-500/20 text-yellow-500 border-yellow-500/50",
  processing: "bg-yellow-500/20 text-yellow-500 border-yellow-500/50",
  failed: "bg-red-500/20 text-red-500 border-red-500/50",
  canceled: "bg-red-500/20 text-red-500 border-red-500/50",
  default: "bg-gray-500/20 text-gray-500 border-gray-500/50",
}

export default function AdminPaymentsPage() {
  const { user } = useAuth()
  const [stripePayments, setStripePayments] = useState<any[]>([])
  const [projectPayments, setProjectPayments] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [filters, setFilters] = useState<any>({})
  const [sortConfig, setSortConfig] = useState<{ key: string; direction: "asc" | "desc" }>({
    key: "created",
    direction: "desc",
  })
  const [selectedPayment, setSelectedPayment] = useState<any>(null)
  const [selectedProject, setSelectedProject] = useState<any>(null)
  const [isDetailsOpen, setIsDetailsOpen] = useState(false)
  const { toast } = useToast()

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true)

        // Fetch Stripe payments
        const stripeResult = await getStripePayments()
        if (stripeResult.success) {
          setStripePayments(stripeResult.data || [])
        } else {
          toast({
            title: "Error",
            description: stripeResult.error,
            variant: "destructive",
          })
        }

        // Fetch project payments
        const projectResult = await getProjectPayments()
        if (projectResult.success) {
          setProjectPayments(projectResult.data || [])
        } else {
          toast({
            title: "Error",
            description: projectResult.error,
            variant: "destructive",
          })
        }

        setError(null)
      } catch (error: any) {
        console.error("Error fetching payment data:", error)
        setError(error.message || "Failed to load payment data")
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [toast])

  // Filter payments based on current filters
  const filterPayments = (payments: any[], isStripe = true) => {
    if (!filters || Object.keys(filters).length === 0) {
      return payments
    }

    return payments.filter((payment) => {
      // Filter by search term
      if (filters.searchTerm) {
        const searchLower = filters.searchTerm.toLowerCase()
        const searchFields = isStripe
          ? [payment.id, payment.receipt_email, payment.description, payment.customer]
          : [payment.id, payment.userEmail, payment.websiteType]

        const matchesSearch = searchFields.some(
          (field) => field && field.toString().toLowerCase().includes(searchLower),
        )

        if (!matchesSearch) return false
      }

      // Filter by status
      if (filters.status && payment.status !== filters.status) {
        return false
      }

      // Filter by source
      if (filters.source) {
        if (filters.source === "stripe" && !isStripe) return false
        if (filters.source === "project" && isStripe) return false
      }

      // Filter by date range
      if (filters.dateRange) {
        const paymentDate = new Date(payment.created)

        switch (filters.dateRange) {
          case "today":
            if (!isToday(paymentDate)) return false
            break
          case "week":
            if (!isThisWeek(paymentDate)) return false
            break
          case "month":
            if (!isThisMonth(paymentDate)) return false
            break
          case "year":
            if (!isThisYear(paymentDate)) return false
            break
        }
      }

      return true
    })
  }

  // Sort payments
  const sortPayments = (payments: any[]) => {
    return [...payments].sort((a, b) => {
      let aValue = a[sortConfig.key]
      let bValue = b[sortConfig.key]

      // Handle nested properties
      if (sortConfig.key === "amount" && !aValue && a.budget) {
        aValue = Number.parseFloat(a.budget)
        bValue = Number.parseFloat(b.budget)
      }

      if (aValue < bValue) {
        return sortConfig.direction === "asc" ? -1 : 1
      }
      if (aValue > bValue) {
        return sortConfig.direction === "asc" ? 1 : -1
      }
      return 0
    })
  }

  // Handle sort
  const handleSort = (key: string) => {
    setSortConfig((prevConfig) => ({
      key,
      direction: prevConfig.key === key && prevConfig.direction === "asc" ? "desc" : "asc",
    }))
  }

  // Format date
  const formatDate = (dateString: string) => {
    try {
      return format(new Date(dateString), "MMM d, yyyy")
    } catch (e) {
      return dateString || "N/A"
    }
  }

  // Get status badge color
  const getStatusColor = (status: string) => {
    const key = status?.toLowerCase() as keyof typeof statusColors
    return statusColors[key] || statusColors.default
  }

  // View payment details
  const viewPaymentDetails = (payment: any, project?: any) => {
    setSelectedPayment(payment)
    setSelectedProject(project)
    setIsDetailsOpen(true)
  }

  // Calculate totals
  const calculateTotals = () => {
    const filteredStripe = filterPayments(stripePayments)
    const filteredProjects = filterPayments(projectPayments, false)

    const stripeTotal = filteredStripe.filter((p) => p.status === "succeeded").reduce((sum, p) => sum + p.amount, 0)

    const projectTotal = filteredProjects.reduce((sum, p) => sum + Number.parseFloat(p.budget || 0), 0)

    return {
      stripeCount: filteredStripe.length,
      projectCount: filteredProjects.length,
      stripeTotal,
      projectTotal,
      total: stripeTotal + projectTotal,
    }
  }

  const totals = calculateTotals()
  const filteredStripePayments = sortPayments(filterPayments(stripePayments))
  const filteredProjectPayments = sortPayments(filterPayments(projectPayments, false))

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
              <h2 className="text-xl font-bold mb-2">Error Loading Payment Data</h2>
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
        <h1 className="text-3xl font-bold mb-8">Payment Dashboard</h1>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <Card className="border border-purple-500/30 bg-black/60 backdrop-blur-md">
            <CardContent className="p-4 flex items-center">
              <div className="bg-purple-500/20 p-3 rounded-full mr-4">
                <CreditCard className="h-6 w-6 text-purple-500" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Total Transactions</p>
                <h3 className="text-2xl font-bold">{totals.stripeCount + totals.projectCount}</h3>
              </div>
            </CardContent>
          </Card>

          <Card className="border border-purple-500/30 bg-black/60 backdrop-blur-md">
            <CardContent className="p-4 flex items-center">
              <div className="bg-green-500/20 p-3 rounded-full mr-4">
                <DollarSign className="h-6 w-6 text-green-500" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Total Revenue</p>
                <h3 className="text-2xl font-bold">£{totals.total.toFixed(2)}</h3>
              </div>
            </CardContent>
          </Card>

          <Card className="border border-purple-500/30 bg-black/60 backdrop-blur-md">
            <CardContent className="p-4 flex items-center">
              <div className="bg-blue-500/20 p-3 rounded-full mr-4">
                <FileText className="h-6 w-6 text-blue-500" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Project Payments</p>
                <h3 className="text-2xl font-bold">{totals.projectCount}</h3>
              </div>
            </CardContent>
          </Card>

          <Card className="border border-purple-500/30 bg-black/60 backdrop-blur-md">
            <CardContent className="p-4 flex items-center">
              <div className="bg-orange-500/20 p-3 rounded-full mr-4">
                <CreditCard className="h-6 w-6 text-orange-500" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Stripe Payments</p>
                <h3 className="text-2xl font-bold">{totals.stripeCount}</h3>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Filters */}
        <PaymentFilters onFilterChange={setFilters} />

        {/* Payment Tables */}
        <Tabs defaultValue="all" className="mt-8">
          <TabsList className="bg-black/40 border border-purple-500/20">
            <TabsTrigger value="all">All Payments</TabsTrigger>
            <TabsTrigger value="stripe">Stripe Transactions</TabsTrigger>
            <TabsTrigger value="projects">Project Payments</TabsTrigger>
          </TabsList>

          {/* All Payments Tab */}
          <TabsContent value="all" className="space-y-6 mt-6">
            <Card className="border border-purple-500/30 bg-black/60 backdrop-blur-md">
              <CardHeader>
                <CardTitle>All Payment Transactions</CardTitle>
                <CardDescription>View all payment transactions from both Stripe and projects</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-purple-500/20">
                        <th className="text-left py-3 px-4">
                          <Button
                            variant="ghost"
                            className="flex items-center p-0 h-auto font-semibold"
                            onClick={() => handleSort("created")}
                          >
                            Date
                            <ArrowUpDown className="ml-2 h-3 w-3" />
                          </Button>
                        </th>
                        <th className="text-left py-3 px-4">ID/Description</th>
                        <th className="text-left py-3 px-4">
                          <Button
                            variant="ghost"
                            className="flex items-center p-0 h-auto font-semibold"
                            onClick={() => handleSort("amount")}
                          >
                            Amount
                            <ArrowUpDown className="ml-2 h-3 w-3" />
                          </Button>
                        </th>
                        <th className="text-left py-3 px-4">Status</th>
                        <th className="text-left py-3 px-4">Source</th>
                        <th className="text-right py-3 px-4">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {[...filteredStripePayments, ...filteredProjectPayments]
                        .sort((a, b) => {
                          const dateA = new Date(a.created).getTime()
                          const dateB = new Date(b.created).getTime()
                          return sortConfig.key === "created"
                            ? sortConfig.direction === "asc"
                              ? dateA - dateB
                              : dateB - dateA
                            : 0
                        })
                        .map((payment) => {
                          const isStripePayment = payment.currency !== undefined
                          const amount = isStripePayment ? payment.amount : Number.parseFloat(payment.budget || "0")

                          return (
                            <tr key={payment.id} className="border-b border-purple-500/10 hover:bg-purple-500/5">
                              <td className="py-3 px-4">
                                <div className="flex items-center">
                                  <Calendar className="h-4 w-4 mr-2 text-muted-foreground" />
                                  <span>{formatDate(payment.created)}</span>
                                </div>
                              </td>
                              <td className="py-3 px-4">
                                <div>
                                  <p className="font-mono text-xs text-muted-foreground">
                                    {payment.id.substring(0, 14)}...
                                  </p>
                                  <p className="text-sm">
                                    {isStripePayment
                                      ? payment.description || "Stripe payment"
                                      : `${payment.websiteType} Website`}
                                  </p>
                                </div>
                              </td>
                              <td className="py-3 px-4 font-semibold">£{amount.toFixed(2)}</td>
                              <td className="py-3 px-4">
                                <Badge className={getStatusColor(payment.status)}>{payment.status}</Badge>
                              </td>
                              <td className="py-3 px-4">
                                <Badge variant="outline">{isStripePayment ? "Stripe" : "Project"}</Badge>
                              </td>
                              <td className="py-3 px-4 text-right">
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => viewPaymentDetails(payment, isStripePayment ? null : payment)}
                                >
                                  View
                                </Button>
                              </td>
                            </tr>
                          )
                        })}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Stripe Payments Tab */}
          <TabsContent value="stripe" className="space-y-6 mt-6">
            <Card className="border border-purple-500/30 bg-black/60 backdrop-blur-md">
              <CardHeader>
                <CardTitle>Stripe Transactions</CardTitle>
                <CardDescription>View all payments processed through Stripe</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-purple-500/20">
                        <th className="text-left py-3 px-4">
                          <Button
                            variant="ghost"
                            className="flex items-center p-0 h-auto font-semibold"
                            onClick={() => handleSort("created")}
                          >
                            Date
                            <ArrowUpDown className="ml-2 h-3 w-3" />
                          </Button>
                        </th>
                        <th className="text-left py-3 px-4">Customer</th>
                        <th className="text-left py-3 px-4">Description</th>
                        <th className="text-left py-3 px-4">
                          <Button
                            variant="ghost"
                            className="flex items-center p-0 h-auto font-semibold"
                            onClick={() => handleSort("amount")}
                          >
                            Amount
                            <ArrowUpDown className="ml-2 h-3 w-3" />
                          </Button>
                        </th>
                        <th className="text-left py-3 px-4">Status</th>
                        <th className="text-right py-3 px-4">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredStripePayments.map((payment) => (
                        <tr key={payment.id} className="border-b border-purple-500/10 hover:bg-purple-500/5">
                          <td className="py-3 px-4">
                            <div className="flex items-center">
                              <Calendar className="h-4 w-4 mr-2 text-muted-foreground" />
                              <span>{formatDate(payment.created)}</span>
                            </div>
                          </td>
                          <td className="py-3 px-4">
                            <div className="flex items-center">
                              <User className="h-4 w-4 mr-2 text-muted-foreground" />
                              <span>{payment.receipt_email || payment.customer || "Anonymous"}</span>
                            </div>
                          </td>
                          <td className="py-3 px-4">
                            <p className="font-mono text-xs text-muted-foreground">{payment.id.substring(0, 8)}...</p>
                            <p className="text-sm">{payment.description || "Stripe payment"}</p>
                          </td>
                          <td className="py-3 px-4 font-semibold">£{payment.amount.toFixed(2)}</td>
                          <td className="py-3 px-4">
                            <Badge className={getStatusColor(payment.status)}>{payment.status}</Badge>
                          </td>
                          <td className="py-3 px-4 text-right">
                            <div className="flex justify-end gap-2">
                              {payment.receipt_url && (
                                <Button
                                  variant="outline"
                                  size="sm"
                                  onClick={() => window.open(payment.receipt_url, "_blank")}
                                >
                                  <ExternalLink className="h-3 w-3 mr-1" />
                                  Receipt
                                </Button>
                              )}
                              <Button variant="ghost" size="sm" onClick={() => viewPaymentDetails(payment)}>
                                View
                              </Button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Project Payments Tab */}
          <TabsContent value="projects" className="space-y-6 mt-6">
            <Card className="border border-purple-500/30 bg-black/60 backdrop-blur-md">
              <CardHeader>
                <CardTitle>Project Payments</CardTitle>
                <CardDescription>View all project-related payments</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-purple-500/20">
                        <th className="text-left py-3 px-4">
                          <Button
                            variant="ghost"
                            className="flex items-center p-0 h-auto font-semibold"
                            onClick={() => handleSort("created")}
                          >
                            Date
                            <ArrowUpDown className="ml-2 h-3 w-3" />
                          </Button>
                        </th>
                        <th className="text-left py-3 px-4">Client</th>
                        <th className="text-left py-3 px-4">Project</th>
                        <th className="text-left py-3 px-4">
                          <Button
                            variant="ghost"
                            className="flex items-center p-0 h-auto font-semibold"
                            onClick={() => handleSort("amount")}
                          >
                            Budget
                            <ArrowUpDown className="ml-2 h-3 w-3" />
                          </Button>
                        </th>
                        <th className="text-left py-3 px-4">Status</th>
                        <th className="text-right py-3 px-4">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredProjectPayments.map((project) => (
                        <tr key={project.id} className="border-b border-purple-500/10 hover:bg-purple-500/5">
                          <td className="py-3 px-4">
                            <div className="flex items-center">
                              <Calendar className="h-4 w-4 mr-2 text-muted-foreground" />
                              <span>{formatDate(project.createdAt)}</span>
                            </div>
                          </td>
                          <td className="py-3 px-4">
                            <div className="flex items-center">
                              <User className="h-4 w-4 mr-2 text-muted-foreground" />
                              <span>{project.userEmail}</span>
                            </div>
                          </td>
                          <td className="py-3 px-4">
                            <p className="font-mono text-xs text-muted-foreground">{project.id.substring(0, 8)}...</p>
                            <p className="text-sm capitalize">{project.websiteType} Website</p>
                          </td>
                          <td className="py-3 px-4 font-semibold">
                            £{Number.parseFloat(project.budget || "0").toFixed(2)}
                          </td>
                          <td className="py-3 px-4">
                            <Badge className={getStatusColor(project.status)}>{project.status}</Badge>
                          </td>
                          <td className="py-3 px-4 text-right">
                            <div className="flex justify-end gap-2">
                              <Button variant="ghost" size="sm" onClick={() => viewPaymentDetails(project, project)}>
                                View
                              </Button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* Payment Details Dialog */}
        <PaymentDetails
          payment={selectedPayment}
          project={selectedProject}
          isOpen={isDetailsOpen}
          onClose={() => setIsDetailsOpen(false)}
        />
      </div>
    </AuthGuard>
  )
}
