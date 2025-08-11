"use client"

import { useEffect, useRef, useState, useCallback, forwardRef, useImperativeHandle } from "react"

declare global {
  interface Window {
    grecaptcha?: {
      ready: (callback: () => void) => void
      render: (element: HTMLElement | string, options: any) => number
      getResponse: (widgetId: number) => string
      reset: (widgetId: number) => void
    }
  }
}

export interface TurnstileWidgetRef {
  getRecaptchaToken: () => string | null
  resetRecaptchaWidget: () => void
}

export const TurnstileWidget = forwardRef<TurnstileWidgetRef>((props, ref) => {
  const widgetRef = useRef<HTMLDivElement | null>(null)
  const widgetIdRef = useRef<number | null>(null)
  const [isCompleted, setIsCompleted] = useState(false)

  const loadRecaptchaScript = useCallback(() => {
    return new Promise<void>((resolve) => {
      if (window.grecaptcha) {
        resolve()
        return
      }

      const script = document.createElement("script")
      script.src = "https://www.google.com/recaptcha/api.js?render=explicit"
      script.async = true
      script.defer = true
      script.onload = () => resolve()
      document.head.appendChild(script)
    })
  }, [])

  const renderWidget = useCallback(async () => {
    try {
      const siteKey = process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY
      if (!siteKey) {
        console.error("reCAPTCHA site key not configured")
        return
      }

      // Don't render if already rendered
      if (widgetIdRef.current !== null) {
        return
      }

      await loadRecaptchaScript()

      if (window.grecaptcha && widgetRef.current) {
        // Clear the container first
        widgetRef.current.innerHTML = ''
        
        window.grecaptcha.ready(() => {
          widgetIdRef.current = window.grecaptcha!.render(widgetRef.current!, {
            sitekey: siteKey,
            size: "normal",
            theme: "dark",
            callback: (token: string) => {
              setIsCompleted(true)
            },
            "expired-callback": () => {
              setIsCompleted(false)
            }
          })
        })
      }
    } catch (error) {
      console.error("reCAPTCHA error:", error)
    }
  }, [loadRecaptchaScript])

  useEffect(() => {
    renderWidget()
  }, [renderWidget])

  const getToken = useCallback(() => {
    if (!window.grecaptcha || widgetIdRef.current === null) {
      return null
    }
    
    try {
      const token = window.grecaptcha.getResponse(widgetIdRef.current)
      return token || null
    } catch (error) {
      console.error("Error getting reCAPTCHA token:", error)
      return null
    }
  }, [])

  const resetWidget = useCallback(() => {
    if (window.grecaptcha && widgetIdRef.current !== null) {
      window.grecaptcha.reset(widgetIdRef.current)
      setIsCompleted(false)
    }
  }, [])

  useImperativeHandle(ref, () => ({
    getRecaptchaToken: getToken,
    resetRecaptchaWidget: resetWidget
  }))

  return (
    <div className="flex flex-col items-center gap-2">
      <div ref={widgetRef} className="flex justify-center" style={{ minHeight: '78px', minWidth: '302px' }} />
      <div className="text-xs text-gray-400 text-center">
        {isCompleted ? (
          <span className="text-green-400">✓ Security check completed</span>
        ) : (
          "Complete the security check"
        )}
      </div>
    </div>
  )
})
