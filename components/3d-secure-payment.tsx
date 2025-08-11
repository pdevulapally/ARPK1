"use client"

import { useState, useEffect } from "react"
import { useStripe, useElements, PaymentElement } from "@stripe/react-stripe-js"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Loader2, Shield, CreditCard } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

interface ThreeDSecurePaymentProps {
  clientSecret: string
  amount: number
  projectId: string
  paymentType: "deposit" | "final"
  onSuccess: () => void
  onCancel: () => void
}

export function ThreeDSecurePayment({
  clientSecret,
  amount,
  projectId,
  paymentType,
  onSuccess,
  onCancel,
}: ThreeDSecurePaymentProps) {
  const stripe = useStripe()
  const elements = useElements()
  const { toast } = useToast()
  const [isProcessing, setIsProcessing] = useState(false)
  const [message, setMessage] = useState<string | null>(null)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!stripe || !elements) {
      return
    }

    setIsProcessing(true)
    setMessage(null)

    try {
      const { error, paymentIntent } = await stripe.confirmPayment({
        elements,
        confirmParams: {
          return_url: `${window.location.origin}/payment/success?projectId=${projectId}`,
        },
        redirect: "if_required",
      })

      if (error) {
        if (error.type === "card_error" || error.type === "validation_error") {
          setMessage(error.message || "An error occurred")
        } else {
          setMessage("An unexpected error occurred")
        }
        toast({
          title: "Payment Error",
          description: error.message || "Payment failed",
          variant: "destructive",
        })
      } else if (paymentIntent && paymentIntent.status === "succeeded") {
        setMessage("Payment successful!")
        toast({
          title: "Payment Successful",
          description: "Your payment has been processed successfully",
        })
        onSuccess()
      } else if (paymentIntent && paymentIntent.status === "requires_action") {
        // Handle 3D Secure authentication
        const { error: confirmError } = await stripe.confirmPayment({
          elements,
          confirmParams: {
            return_url: `${window.location.origin}/payment/success?projectId=${projectId}`,
          },
        })

        if (confirmError) {
          setMessage(confirmError.message || "3D Secure authentication failed")
          toast({
            title: "Authentication Failed",
            description: confirmError.message || "3D Secure authentication failed",
            variant: "destructive",
          })
        }
      }
    } catch (error: any) {
      console.error("Payment error:", error)
      setMessage("An unexpected error occurred")
      toast({
        title: "Payment Error",
        description: "An unexpected error occurred during payment",
        variant: "destructive",
      })
    } finally {
      setIsProcessing(false)
    }
  }

  const formatAmount = (amount: number) => {
    return new Intl.NumberFormat("en-GB", {
      style: "currency",
      currency: "GBP",
    }).format(amount)
  }

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <div className="flex items-center gap-2">
          <Shield className="h-5 w-5 text-green-600" />
          <CardTitle>Secure Payment</CardTitle>
        </div>
        <CardDescription>
          {paymentType === "deposit" ? "Deposit" : "Final"} payment for project {projectId}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="mb-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
          <div className="flex items-center gap-2 text-sm text-blue-800">
            <CreditCard className="h-4 w-4" />
            <span>Amount: {formatAmount(amount)}</span>
          </div>
        </div>

        <form onSubmit={handleSubmit}>
          <PaymentElement />
          
          {message && (
            <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-sm text-red-800">{message}</p>
            </div>
          )}

          <div className="mt-6 flex gap-3">
            <Button
              type="button"
              variant="outline"
              onClick={onCancel}
              disabled={isProcessing}
              className="flex-1"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={!stripe || isProcessing}
              className="flex-1"
            >
              {isProcessing ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Processing...
                </>
              ) : (
                `Pay ${formatAmount(amount)}`
              )}
            </Button>
          </div>
        </form>

        <div className="mt-4 text-xs text-gray-500 text-center">
          <p>Your payment is protected by 3D Secure authentication</p>
          <p>Powered by Stripe</p>
        </div>
      </CardContent>
    </Card>
  )
}
