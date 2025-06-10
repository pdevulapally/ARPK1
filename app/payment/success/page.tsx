"use client"

import { useEffect, useState } from "react"
import { useSearchParams, useRouter } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Loader2, CheckCircle, ArrowRight } from "lucide-react"
import { handlePaymentSuccess } from "@/app/actions/payment"

export default function PaymentSuccessPage() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const [loading, setLoading] = useState(true)
  const sessionId = searchParams.get("session_id")

  useEffect(() => {
    const updatePaymentStatus = async () => {
      if (!sessionId) {
        router.push("/dashboard")
        return
      }

      try {
        await handlePaymentSuccess(sessionId)
      } catch (error) {
        console.error("Error updating payment status:", error)
      } finally {
        setLoading(false)
      }
    }

    updatePaymentStatus()
  }, [sessionId, router])

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center">
        <div className="text-center space-y-4">
          <Loader2 className="h-8 w-8 animate-spin text-purple-500 mx-auto" />
          <p className="text-white/80">Processing your payment...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center p-4">
      <Card className="max-w-md w-full border border-purple-500/30 bg-black/60 backdrop-blur-xl">
        <CardHeader className="text-center pb-2">
          <CheckCircle className="h-12 w-12 text-green-500 mx-auto mb-4" />
          <CardTitle className="text-2xl text-white">Payment Successful!</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <p className="text-white/60 text-center">
            Thank you for your payment. Your transaction has been completed successfully.
          </p>
          
          <div className="grid gap-4">
            <Button 
              onClick={() => router.push("/dashboard")}
              className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"
            >
              Return to Dashboard
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </div>

          <div className="text-center">
            <p className="text-xs text-white/40">
              A confirmation email will be sent to your registered email address.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}