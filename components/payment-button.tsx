"use client"

import { useState, useRef } from "react"
import { Button } from "@/components/ui/button"
import { useToast } from "@/components/ui/use-toast"
import { Loader2, CreditCard } from "lucide-react"
import { createCheckoutSessionAction, createPaymentIntentAction } from "@/app/actions/payment"
import { TurnstileWidget, type TurnstileWidgetRef } from "./turnstile-widget"

interface PaymentButtonProps {
  projectId: string
  amount: number
  paymentType: "deposit" | "final"
  disabled?: boolean
  discountCode?: string
  discountPercentage?: number
}

export function PaymentButton({
  projectId,
  amount,
  paymentType,
  disabled = false,
  discountCode,
  discountPercentage
}: PaymentButtonProps) {
  const [loading, setLoading] = useState(false)
  const [captchaToken, setCaptchaToken] = useState<string | null>(null)
  const { toast } = useToast()
  const turnstileRef = useRef<TurnstileWidgetRef>(null)

  const getCaptchaToken = async (): Promise<string | null> => {
    if (!turnstileRef.current) {
      return null
    }
    
    try {
      const token = turnstileRef.current.getRecaptchaToken()
      return token
    } catch (error) {
      console.error("Error getting reCAPTCHA token:", error)
      return null
    }
  }

  const resetCaptcha = () => {
    if (turnstileRef.current) {
      turnstileRef.current.resetRecaptchaWidget()
    }
  }

  const handlePayment = async () => {
    const token = await getCaptchaToken()
    if (!token) {
      toast({
        title: "Verification Required",
        description: "Please complete the verification",
        variant: "destructive",
      })
      return
    }

    setLoading(true)
    try {
      const result = await createCheckoutSessionAction(
        projectId,
        amount,
        discountCode,
        discountPercentage
      )

      if (result.sessionId) {
        // Redirect to Stripe Checkout
        const stripe = await import('@stripe/stripe-js').then(m => m.loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!))
        if (stripe) {
          const { error } = await stripe.redirectToCheckout({
            sessionId: result.sessionId
          })
          if (error) {
            throw error
          }
        }
      }
    } catch (error: any) {
      console.error("Payment error:", error)
      toast({
        title: "Payment Failed",
        description: error.message || "Failed to process payment",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-center">
        <TurnstileWidget ref={turnstileRef} />
      </div>
      
      <div className="flex justify-center">
        <Button
          onClick={handlePayment}
          disabled={disabled || loading}
          className="w-full max-w-xs sm:max-w-none bg-purple-600 hover:bg-purple-700 h-12 text-lg"
        >
        {loading ? (
          <>
            <Loader2 className="mr-2 h-5 w-5 animate-spin" />
            Processing...
          </>
        ) : (
          <>
            <CreditCard className="mr-2 h-5 w-5" />
            Pay £{amount.toFixed(2)}
          </>
        )}
        </Button>
      </div>
    </div>
  )
}
