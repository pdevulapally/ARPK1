"use client"

import { useState, useEffect } from "react"
import { useSearchParams, useRouter } from "next/navigation"
import { useStripe } from "@stripe/react-stripe-js"
import { useToast } from "@/hooks/use-toast"
import { Loader2, CheckCircle, XCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

export default function PaymentConfirmPage() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const stripe = useStripe()
  const { toast } = useToast()
  const [status, setStatus] = useState<"processing" | "success" | "error">("processing")
  const [message, setMessage] = useState<string>("Processing payment...")

  const projectId = searchParams.get("projectId")
  const paymentIntentId = searchParams.get("payment_intent")
  const paymentIntentClientSecret = searchParams.get("payment_intent_client_secret")

  useEffect(() => {
    if (!stripe) {
      return
    }

    // Retrieve the "payment_intent_client_secret" query parameter
    const clientSecret = paymentIntentClientSecret

    if (!clientSecret) {
      setStatus("error")
      setMessage("Missing payment information")
      return
    }

    stripe
      .retrievePaymentIntent(clientSecret)
      .then(({ paymentIntent }) => {
        switch (paymentIntent?.status) {
          case "succeeded":
            setStatus("success")
            setMessage("Payment successful!")
            toast({
              title: "Payment Successful",
              description: "Your payment has been processed successfully",
            })
            // Redirect to success page after a short delay
            setTimeout(() => {
              router.push(`/payment/success?projectId=${projectId}`)
            }, 2000)
            break
          case "processing":
            setStatus("processing")
            setMessage("Your payment is processing.")
            break
          case "requires_payment_method":
            setStatus("error")
            setMessage("Your payment was not successful, please try again.")
            break
          default:
            setStatus("error")
            setMessage("Something went wrong.")
            break
        }
      })
      .catch((error) => {
        console.error("Error retrieving payment intent:", error)
        setStatus("error")
        setMessage("An error occurred while processing your payment.")
        toast({
          title: "Payment Error",
          description: "An error occurred while processing your payment",
          variant: "destructive",
        })
      })
  }, [stripe, paymentIntentClientSecret, projectId, router, toast])

  const handleRetry = () => {
    router.push(`/payment/secure?projectId=${projectId}`)
  }

  const handleBack = () => {
    router.push(`/payment/cancel?projectId=${projectId}`)
  }

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          {status === "processing" && (
            <div className="mx-auto mb-4">
              <Loader2 className="h-12 w-12 animate-spin text-blue-600" />
            </div>
          )}
          {status === "success" && (
            <div className="mx-auto mb-4">
              <CheckCircle className="h-12 w-12 text-green-600" />
            </div>
          )}
          {status === "error" && (
            <div className="mx-auto mb-4">
              <XCircle className="h-12 w-12 text-red-600" />
            </div>
          )}
          <CardTitle>
            {status === "processing" && "Processing Payment"}
            {status === "success" && "Payment Successful"}
            {status === "error" && "Payment Failed"}
          </CardTitle>
          <CardDescription>{message}</CardDescription>
        </CardHeader>
        <CardContent className="text-center">
          {status === "processing" && (
            <div className="space-y-4">
              <p className="text-sm text-gray-600">
                Please wait while we confirm your payment...
              </p>
              <div className="flex justify-center">
                <Loader2 className="h-6 w-6 animate-spin text-blue-600" />
              </div>
            </div>
          )}

          {status === "success" && (
            <div className="space-y-4">
              <p className="text-sm text-gray-600">
                Your payment has been processed successfully. You will be redirected shortly.
              </p>
              <Button onClick={() => router.push(`/payment/success?projectId=${projectId}`)}>
                Continue
              </Button>
            </div>
          )}

          {status === "error" && (
            <div className="space-y-4">
              <p className="text-sm text-gray-600">
                There was an issue processing your payment. Please try again.
              </p>
              <div className="flex gap-3">
                <Button onClick={handleRetry} className="flex-1">
                  Try Again
                </Button>
                <Button onClick={handleBack} variant="outline" className="flex-1">
                  Go Back
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
