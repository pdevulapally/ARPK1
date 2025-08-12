"use client"

import { useEffect, useState, Suspense } from "react"
import { useSearchParams } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { useToast } from "@/components/ui/use-toast"
import { motion } from "framer-motion"
import { 
  CheckCircle, 
  Download, 
  Receipt, 
  ArrowLeft, 
  Calendar,
  CreditCard,
  User,
  Building,
  FileText,
  Mail
} from "lucide-react"
import Link from "next/link"

interface PaymentDetails {
  id: string
  amount: number
  currency: string
  status: string
  created: number
  customer_email: string
  project_id: string
  project_name: string
  discount_code?: string
  discount_percentage?: number
  original_amount?: number
}

function PaymentSuccessContent() {
  const searchParams = useSearchParams()
  const [paymentDetails, setPaymentDetails] = useState<PaymentDetails | null>(null)
  const [loading, setLoading] = useState(true)
  const [downloading, setDownloading] = useState(false)
  const { toast } = useToast()

  useEffect(() => {
    const sessionId = searchParams.get('session_id')
    const paymentIntentId = searchParams.get('payment_intent')
    
    if (sessionId || paymentIntentId) {
      fetchPaymentDetails(sessionId, paymentIntentId)
    } else {
      setLoading(false)
    }
  }, [searchParams])

  const fetchPaymentDetails = async (sessionId: string | null, paymentIntentId: string | null) => {
    try {
      const response = await fetch('/api/payment/details', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          sessionId,
          paymentIntentId
        }),
      })

      if (response.ok) {
        const data = await response.json()
        setPaymentDetails(data)
      } else {
        throw new Error('Failed to fetch payment details')
      }
    } catch (error) {
      console.error('Error fetching payment details:', error)
      toast({
        title: "Error",
        description: "Failed to load payment details",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const handleDownloadInvoice = async () => {
    if (!paymentDetails) return

    setDownloading(true)
    try {
      const response = await fetch('/api/payment/invoice', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          paymentId: paymentDetails.id,
          projectId: paymentDetails.project_id,
          amount: paymentDetails.amount,
          customerEmail: paymentDetails.customer_email,
          projectName: paymentDetails.project_name,
          discountCode: paymentDetails.discount_code,
          discountPercentage: paymentDetails.discount_percentage,
          originalAmount: paymentDetails.original_amount
        }),
      })

      if (response.ok) {
        const blob = await response.blob()
        const url = window.URL.createObjectURL(blob)
        const a = document.createElement('a')
        a.href = url
        a.download = `invoice-${paymentDetails.id}.pdf`
        document.body.appendChild(a)
        a.click()
        window.URL.revokeObjectURL(url)
        document.body.removeChild(a)

        toast({
          title: "Invoice Downloaded",
          description: "Your invoice has been downloaded successfully",
        })
      } else {
        throw new Error('Failed to generate invoice')
      }
    } catch (error) {
      console.error('Error downloading invoice:', error)
      toast({
        title: "Error",
        description: "Failed to download invoice. Please try again.",
        variant: "destructive",
      })
    } finally {
      setDownloading(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-500 mx-auto mb-4"></div>
          <p className="text-gray-400">Loading payment details...</p>
        </div>
      </div>
    )
  }

  if (!paymentDetails) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900 flex items-center justify-center">
        <Card className="w-full max-w-md border-red-500/30 bg-black/40 backdrop-blur-sm">
          <CardContent className="p-6 text-center">
            <div className="w-16 h-16 bg-red-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-red-400 text-2xl">⚠️</span>
            </div>
            <h2 className="text-xl font-semibold text-white mb-2">Payment Details Not Found</h2>
            <p className="text-gray-400 mb-6">Unable to retrieve payment information.</p>
            <Link href="/dashboard">
              <Button className="w-full bg-purple-600 hover:bg-purple-700">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back to Dashboard
              </Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    )
  }

  const formatDate = (timestamp: number) => {
    return new Date(timestamp * 1000).toLocaleDateString('en-GB', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  const formatAmount = (amount: number) => {
    return (amount / 100).toFixed(2)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900 py-8 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center mb-8"
        >
          <div className="w-20 h-20 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
            <CheckCircle className="h-10 w-10 text-green-500" />
          </div>
          <h1 className="text-3xl font-bold text-white mb-2">Payment Successful!</h1>
          <p className="text-gray-400 text-lg">Your payment has been processed successfully</p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Receipt Card */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2, duration: 0.5 }}
            className="lg:col-span-2"
          >
            <Card className="border-green-500/30 bg-black/40 backdrop-blur-sm">
              <CardHeader className="pb-4">
                <CardTitle className="flex items-center gap-2 text-xl">
                  <Receipt className="h-5 w-5 text-green-400" />
                  Payment Receipt
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Payment Status */}
                <div className="flex items-center justify-between">
                  <span className="text-gray-400">Status</span>
                  <Badge className="bg-green-500/20 text-green-400 border-green-500/30">
                    {paymentDetails.status}
                  </Badge>
                </div>

                <Separator className="bg-gray-700" />

                {/* Payment Details */}
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-gray-400">Payment ID</span>
                    <span className="text-white font-mono text-sm">{paymentDetails.id}</span>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <span className="text-gray-400">Project</span>
                    <span className="text-white">{paymentDetails.project_name}</span>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="text-gray-400">Date & Time</span>
                    <span className="text-white">{formatDate(paymentDetails.created)}</span>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="text-gray-400">Customer Email</span>
                    <span className="text-white">{paymentDetails.customer_email}</span>
                  </div>
                </div>

                <Separator className="bg-gray-700" />

                {/* Amount Details */}
                <div className="space-y-3">
                  {paymentDetails.original_amount && paymentDetails.discount_percentage && (
                    <>
                      <div className="flex items-center justify-between">
                        <span className="text-gray-400">Original Amount</span>
                        <span className="text-white line-through">£{formatAmount(paymentDetails.original_amount)}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-gray-400">Discount Applied</span>
                        <span className="text-green-400">{paymentDetails.discount_percentage}% off</span>
                      </div>
                    </>
                  )}
                  
                  <div className="flex items-center justify-between text-lg font-semibold">
                    <span className="text-gray-300">Total Paid</span>
                    <span className="text-green-400">£{formatAmount(paymentDetails.amount)}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Actions Card */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.4, duration: 0.5 }}
          >
            <Card className="border-purple-500/30 bg-black/40 backdrop-blur-sm h-fit">
              <CardHeader className="pb-4">
                <CardTitle className="text-lg">Actions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <Button 
                  onClick={handleDownloadInvoice}
                  disabled={downloading}
                  className="w-full bg-purple-600 hover:bg-purple-700"
                >
                  {downloading ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                      Generating...
                    </>
                  ) : (
                    <>
                      <Download className="mr-2 h-4 w-4" />
                      Download Invoice
                    </>
                  )}
                </Button>

                <Link href="/dashboard">
                  <Button variant="outline" className="w-full border-gray-600 text-gray-300 hover:bg-gray-800">
                    <ArrowLeft className="mr-2 h-4 w-4" />
                    Back to Dashboard
                  </Button>
                </Link>

                <Link href={`/dashboard/projects/${paymentDetails.project_id}`}>
                  <Button variant="outline" className="w-full border-blue-600 text-blue-300 hover:bg-blue-900/20">
                    <FileText className="mr-2 h-4 w-4" />
                    View Project
                  </Button>
                </Link>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </div>
    </div>
  )
}

export default function PaymentSuccessPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-500 mx-auto mb-4"></div>
          <p className="text-gray-400">Loading...</p>
        </div>
      </div>
    }>
      <PaymentSuccessContent />
    </Suspense>
  )
}
