"use client"

import { useEffect, useRef, useState } from "react"
import { Button } from "@/components/ui/button"
import { useToast } from "@/components/ui/use-toast"
import { Loader2 } from "lucide-react"
import { createCheckoutSession } from "@/app/actions/payment"
import { TurnstileWidget, TurnstileWidgetRef } from "@/components/turnstile-widget"

interface PaymentButtonProps {
  projectId: string
  amount: number
  userEmail: string
  paymentType: "deposit" | "final"
  label: string
  className?: string
}

export function PaymentButton({ projectId, amount, userEmail, paymentType, label, className }: PaymentButtonProps) {
  const [loading, setLoading] = useState(false)
  const { toast } = useToast()
  const turnstileRef = useRef<TurnstileWidgetRef>(null)

  const getCaptchaToken = async (): Promise<string | null> => {
    if (!turnstileRef.current) {
      console.log("turnstileRef.current is null")
      return null
    }

    console.log("Attempting to get reCAPTCHA token...")
    
    try {
      const token = turnstileRef.current.getRecaptchaToken()
      console.log("Token retrieved:", token ? `Length: ${token.length}` : "null")
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
    if (loading) return

    console.log("Payment button clicked, starting payment flow...")
    setLoading(true)
    try {
      // Get CAPTCHA token
      console.log("Getting CAPTCHA token...")
      const captchaToken = await getCaptchaToken()
      console.log("CAPTCHA token result:", captchaToken ? "Token received" : "No token")
      
      if (!captchaToken) {
        console.log("No CAPTCHA token, showing error toast")
        toast({
          title: "Security Check Required",
          description: "Please complete the reCAPTCHA security check by clicking the checkbox above before proceeding.",
          variant: "destructive",
        })
        setLoading(false)
        return
      }

      // Create checkout session
      console.log("Creating checkout session with params:", {
        projectId,
        amount,
        userEmail,
        paymentType,
        tokenLength: captchaToken.length
      })
      
      const result = await createCheckoutSession(
        projectId,
        amount,
        userEmail,
        paymentType,
        captchaToken
      )

      console.log("Checkout session result:", result)

      if (result && result.url) {
        console.log("Redirecting to:", result.url)
        window.location.href = result.url
      } else {
        console.log("No URL in result, showing error")
        toast({
          title: "Payment Error",
          description: "Failed to create payment session",
          variant: "destructive",
        })
        // Reset CAPTCHA on error
        resetCaptcha()
      }
    } catch (error: any) {
      console.error("Payment error:", error)
      toast({
        title: "Payment Error",
        description: error.message || "An unexpected error occurred",
        variant: "destructive",
      })
      // Reset CAPTCHA on error
      resetCaptcha()
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row items-center gap-4">
        {/* reCAPTCHA Security Widget */}
        <div className="flex-1 w-full sm:w-auto">
          <TurnstileWidget ref={turnstileRef} />
        </div>
        
        {/* Payment Button */}
        <div className="flex-shrink-0 w-full sm:w-auto">
          <Button
            onClick={handlePayment}
            disabled={loading}
            className={`w-full sm:w-auto ${className || ''}`}
          >
            {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            {label}
          </Button>
        </div>
      </div>
    </div>
  )
}
