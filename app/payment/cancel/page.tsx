"use client"

import { useEffect, useState } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { AlertCircle, ArrowLeft, RefreshCw } from "lucide-react"
import { useToast } from "@/components/ui/use-toast"

export default function PaymentCancelPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const { toast } = useToast()
  const [retryCount, setRetryCount] = useState(0)
  const [isRetrying, setIsRetrying] = useState(false)
  const projectId = searchParams.get("projectId")

  useEffect(() => {
    // Show toast when page loads
    toast({
      title: "Payment Incomplete",
      description: "Your payment wasn't completed. You can try again or return to dashboard.",
      variant: "destructive",
    })
  }, [toast])

  const handleRetry = async () => {
    try {
      setIsRetrying(true)
      
      if (retryCount >= 2) {
        toast({
          title: "Payment Cancelled",
          description: "Your payment has been cancelled. No charges have been made.",
          variant: "destructive",
        })
        router.push("/dashboard")
        return
      }

      // Increment retry count before navigation
      const newRetryCount = retryCount + 1
      setRetryCount(newRetryCount)
      
      // Store retry count in localStorage to persist across navigation
      localStorage.setItem('paymentRetryCount', String(newRetryCount))

      // Navigate back to payment page
      if (projectId) {
        router.push(`/dashboard/projects/${projectId}`)
      } else {
        router.push("/dashboard")
      }
    } catch (error) {
      console.error('Retry error:', error)
      toast({
        title: "Error",
        description: "Failed to retry payment. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsRetrying(false)
    }
  }

  // Load retry count from localStorage on mount
  useEffect(() => {
    const savedRetryCount = localStorage.getItem('paymentRetryCount')
    if (savedRetryCount) {
      setRetryCount(Number(savedRetryCount))
    }
  }, [])

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center p-4">
      <Card className="max-w-md w-full border border-orange-500/30 bg-black/60 backdrop-blur-xl">
        <CardHeader className="text-center pb-2">
          <AlertCircle className="h-12 w-12 text-orange-500 mx-auto mb-4" />
          <CardTitle className="text-2xl text-white">Payment Incomplete</CardTitle>
          <CardDescription className="text-white/60">
            {retryCount < 2 
              ? "Your payment wasn't completed. Would you like to try again?"
              : "Your payment has been cancelled. No charges have been made."}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4 pt-4">
          {retryCount < 2 ? (
            <div className="grid gap-4">
              <Button 
                onClick={handleRetry}
                disabled={isRetrying}
                className="bg-gradient-to-r from-orange-600 to-red-600 hover:from-orange-700 hover:to-red-700"
              >
                {isRetrying ? (
                  <>
                    <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                    Retrying...
                  </>
                ) : (
                  <>
                    <RefreshCw className="mr-2 h-4 w-4" />
                    Try Payment Again
                  </>
                )}
              </Button>
              <Button 
                variant="outline" 
                onClick={() => {
                  localStorage.removeItem('paymentRetryCount')
                  router.push("/dashboard")
                }}
                disabled={isRetrying}
                className="border-white/20 text-white/60 hover:bg-white/10"
              >
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back to Dashboard
              </Button>
            </div>
          ) : (
            <Button 
              onClick={() => {
                localStorage.removeItem('paymentRetryCount')
                router.push("/dashboard")
              }}
              className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"
            >
              <ArrowLeft className="mr-2 h-4 w-4" />
              Return to Dashboard
            </Button>
          )}
        </CardContent>
      </Card>
    </div>
  )
}