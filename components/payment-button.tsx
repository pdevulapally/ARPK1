"use client"

import { useEffect, useRef, useState } from "react"
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

declare global {
  interface Window {
    turnstile?: {
      render: (element: HTMLElement, options: any) => string
      getResponse: (widgetId: string) => string
      reset: (widgetId: string) => void
      execute: (widgetId: string) => void
    }
  }
}

export function PaymentButton({ projectId, amount, userEmail, paymentType, label, className }: PaymentButtonProps) {
  const [loading, setLoading] = useState(false)
  const { toast } = useToast()
  const widgetRef = useRef<HTMLDivElement | null>(null)
  const widgetIdRef = useRef<string | null>(null)

  useEffect(() => {
    // Inject Turnstile script
    const siteKey = process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY
    if (!siteKey) return

    const script = document.createElement("script")
    script.src = "https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit"
    script.async = true
    script.defer = true
    script.onload = () => {
      if (window.turnstile && widgetRef.current) {
        widgetIdRef.current = window.turnstile.render(widgetRef.current, {
          sitekey: siteKey,
          size: "invisible",
          callback: () => {},
        })
      }
    }
    document.body.appendChild(script)

    return () => {
      if (script.parentNode) script.parentNode.removeChild(script)
    }
  }, [])

  const getCaptchaToken = async (): Promise<string | null> => {
    const siteKey = process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY
    if (!siteKey) return null

    if (window.turnstile && widgetIdRef.current) {
      return new Promise((resolve) => {
        const tempId = widgetIdRef.current as string
        const interval = setInterval(() => {
          try {
            window.turnstile!.execute(tempId)
            const token = window.turnstile!.getResponse(tempId)
            if (token) {
              clearInterval(interval)
              resolve(token)
            }
          } catch (_) {}
        }, 200)
      })
    }
    return null
  }

  const handlePayment = async () => {
    try {
      setLoading(true)

      const captchaToken = await getCaptchaToken()

      const { url } = await createCheckoutSession(projectId, amount, userEmail, paymentType, captchaToken || undefined)

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
    <>
      <div ref={widgetRef} style={{ display: "inline" }} />
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
    </>
  )
}
