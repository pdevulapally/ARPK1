"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { useToast } from "@/components/ui/use-toast"
import { Loader2 } from "lucide-react"
import { createCheckoutSession } from "@/app/actions/payment"

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

  const handlePayment = async () => {
    try {
      setLoading(true)

      const { url } = await createCheckoutSession(projectId, amount, userEmail, paymentType)

      if (url) {
        window.location.href = url
      } else {
        throw new Error("Failed to create checkout session")
      }
    } catch (error: any) {
      toast({
        title: "Payment Error",
        description: error.message || "Failed to initiate payment",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <Button onClick={handlePayment} disabled={loading} className={className}>
      {loading ? (
        <>
          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          Processing...
        </>
      ) : (
        label
      )}
    </Button>
  )
}
