"use client"

import { useEffect, useState, Suspense } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { CheckCircle, ArrowRight } from "lucide-react"
import { useToast } from "@/components/ui/use-toast"
import { handlePaymentSuccess } from "@/app/actions/payment"

// Success content component that uses useSearchParams
function SuccessPageContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const { toast } = useToast()
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
        toast({
          title: "Payment Successful",
          description: "Your payment has been processed successfully.",
        })
      } catch (error) {
        console.error("Error updating payment status:", error)
        toast({
          title: "Error",
          description: "There was an issue confirming your payment.",
          variant: "destructive",
        })
      } finally {
        setLoading(false)
      }
    }

    updatePaymentStatus()
  }, [sessionId, router, toast])

  return (
    <Card className="max-w-md w-full border border-green-500/30 bg-black/60 backdrop-blur-xl">
      <CardHeader className="text-center pb-2">
        <CheckCircle className="h-12 w-12 text-green-500 mx-auto mb-4" />
        <CardTitle className="text-2xl text-white">Payment Successful!</CardTitle>
        <CardDescription className="text-white/60">
          Thank you for your payment. Your transaction has been completed successfully.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <Button 
          onClick={() => router.push("/dashboard")}
          className="w-full bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700"
        >
          Return to Dashboard
          <ArrowRight className="ml-2 h-4 w-4" />
        </Button>

        <p className="text-xs text-center text-white/40">
          We will work on your Project and get back to you if there are any information needed from you.
        </p>
      </CardContent>
    </Card>
  )
}

// Loading fallback component
function LoadingCard() {
  return (
    <Card className="max-w-md w-full border border-green-500/30 bg-black/60 backdrop-blur-xl">
      <CardHeader className="text-center pb-2">
        <div className="h-12 w-12 rounded-full bg-green-500/20 animate-pulse mx-auto mb-4" />
        <div className="h-8 w-3/4 bg-white/10 animate-pulse mx-auto rounded" />
        <div className="h-4 w-1/2 bg-white/10 animate-pulse mx-auto mt-2 rounded" />
      </CardHeader>
      <CardContent className="space-y-4 pt-4">
        <div className="h-10 bg-white/10 animate-pulse rounded" />
      </CardContent>
    </Card>
  )
}

// Main component with Suspense
export default function PaymentSuccessPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center p-4">
      <Suspense fallback={<LoadingCard />}>
        <SuccessPageContent />
      </Suspense>
    </div>
  )
}
