"use client"

import { useState, useEffect } from "react"
import { useSearchParams, useRouter } from "next/navigation"
import { Elements } from "@stripe/react-stripe-js"
import { getStripe } from "@/lib/stripe"
import { ThreeDSecurePayment } from "@/components/3d-secure-payment"
import { useToast } from "@/hooks/use-toast"
import { Loader2, ArrowLeft } from "lucide-react"
import { Button } from "@/components/ui/button"

export default function SecurePaymentPage() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const { toast } = useToast()
  const [stripePromise, setStripePromise] = useState<any>(null)
  const [clientSecret, setClientSecret] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const projectId = searchParams.get("projectId")
  const amount = searchParams.get("amount")
  const paymentType = searchParams.get("paymentType") as "deposit" | "final"
  const userEmail = searchParams.get("userEmail")

  useEffect(() => {
    // Initialize Stripe
    const initStripe = async () => {
      const stripe = await getStripe()
      setStripePromise(stripe)
    }
    initStripe()
  }, [])

  useEffect(() => {
    const createPaymentIntent = async () => {
      if (!projectId || !amount || !paymentType || !userEmail) {
        setError("Missing required payment information")
        setLoading(false)
        return
      }

      try {
        const response = await fetch("/api/stripe/create-payment-intent", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            projectId,
            amount: parseFloat(amount),
            userEmail,
            paymentType,
          }),
        })

        const data = await response.json()

        if (!response.ok) {
          throw new Error(data.error || "Failed to create payment intent")
        }

        setClientSecret(data.clientSecret)
      } catch (error: any) {
        console.error("Error creating payment intent:", error)
        setError(error.message || "Failed to initialize payment")
        toast({
          title: "Payment Error",
          description: error.message || "Failed to initialize payment",
          variant: "destructive",
        })
      } finally {
        setLoading(false)
      }
    }

    if (stripePromise) {
      createPaymentIntent()
    }
  }, [stripePromise, projectId, amount, paymentType, userEmail, toast])

  const handleSuccess = () => {
    toast({
      title: "Payment Successful",
      description: "Your payment has been processed successfully",
    })
    router.push(`/payment/success?projectId=${projectId}`)
  }

  const handleCancel = () => {
    router.push(`/payment/cancel?projectId=${projectId}`)
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4" />
          <p>Initializing secure payment...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center max-w-md mx-auto p-6">
          <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-red-800">{error}</p>
          </div>
          <Button onClick={() => router.back()}>
            <ArrowLeft className="mr-2 h-4 w-4" />
            Go Back
          </Button>
        </div>
      </div>
    )
  }

  if (!clientSecret) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p>Unable to initialize payment</p>
          <Button onClick={() => router.back()} className="mt-4">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Go Back
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="mb-6 text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Secure Payment</h1>
          <p className="text-gray-600">
            Your payment is protected by 3D Secure authentication
          </p>
        </div>

        <Elements
          stripe={stripePromise}
          options={{
            clientSecret,
            appearance: {
              theme: "stripe",
              variables: {
                colorPrimary: "#7c3aed",
              },
            },
          }}
        >
          <ThreeDSecurePayment
            clientSecret={clientSecret}
            amount={parseFloat(amount || "0")}
            projectId={projectId || ""}
            paymentType={paymentType}
            onSuccess={handleSuccess}
            onCancel={handleCancel}
          />
        </Elements>
      </div>
    </div>
  )
}
