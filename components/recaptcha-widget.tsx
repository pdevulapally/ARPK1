"use client"

import { useEffect, useRef, useState, useCallback } from "react"

declare global {
  interface Window {
    grecaptcha?: {
      ready: (callback: () => void) => void
      render: (element: HTMLElement | string, options: any) => number
      getResponse: (widgetId: number) => string
      reset: (widgetId: number) => void
      execute: (widgetId: number) => void
    }
  }
}

// Global script loading state
let scriptLoading = false
let scriptLoaded = false
let scriptError = false

export function RecaptchaWidget() {
  const widgetRef = useRef<HTMLDivElement | null>(null)
  const widgetIdRef = useRef<number | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [hasError, setHasError] = useState(false)
  const [errorMessage, setErrorMessage] = useState("")
  const [debugInfo, setDebugInfo] = useState<string>("")

  // Debug mode - set to true to see detailed information
  const isDebugMode = process.env.NODE_ENV === 'development'

  const loadRecaptchaScript = useCallback(() => {
    return new Promise<void>((resolve, reject) => {
      // If script is already loaded, resolve immediately
      if (scriptLoaded && window.grecaptcha) {
        resolve()
        return
      }

      // If script failed to load previously, reject
      if (scriptError) {
        reject(new Error("reCAPTCHA script failed to load previously"))
        return
      }

      // If script is currently loading, wait for it
      if (scriptLoading) {
        const checkLoading = () => {
          if (scriptLoaded && window.grecaptcha) {
            resolve()
          } else if (scriptError) {
            reject(new Error("reCAPTCHA script failed to load"))
          } else {
            setTimeout(checkLoading, 100)
          }
        }
        checkLoading()
        return
      }

      // Start loading the script
      scriptLoading = true

      const script = document.createElement("script")
      script.src = "https://www.google.com/recaptcha/api.js?render=explicit"
      script.async = true
      script.defer = true

      script.onload = () => {
        scriptLoading = false
        scriptLoaded = true
        // Give the script a moment to initialize
        setTimeout(() => {
          if (window.grecaptcha) {
            resolve()
          } else {
            scriptError = true
            reject(new Error("reCAPTCHA not available after script load"))
          }
        }, 200)
      }

      script.onerror = () => {
        scriptLoading = false
        scriptError = true
        reject(new Error("Failed to load reCAPTCHA script"))
      }

      document.head.appendChild(script)
    })
  }, [])

  const renderWidget = useCallback(async () => {
    try {
      const siteKey = process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY
      
      if (!siteKey) {
        throw new Error("reCAPTCHA site key not configured")
      }

      const debugData = {
        siteKey: siteKey.substring(0, 10) + "...",
        domain: window.location.hostname,
        protocol: window.location.protocol,
        userAgent: navigator.userAgent.substring(0, 50) + "...",
        timestamp: new Date().toISOString(),
        environment: process.env.NODE_ENV,
        isLocalhost: window.location.hostname === 'localhost' || window.location.hostname.includes('127.0.0.1')
      }

      console.log("reCAPTCHA debug info:", debugData)
      setDebugInfo(JSON.stringify(debugData, null, 2))

      if (!widgetRef.current) {
        throw new Error("Widget container not available")
      }

      // Load script if needed
      await loadRecaptchaScript()

      // Render the widget
      if (window.grecaptcha && widgetRef.current) {
        console.log("Rendering reCAPTCHA widget...")
        
        // Clear any existing content
        widgetRef.current.innerHTML = ''
        
        // Wait for reCAPTCHA to be ready
        window.grecaptcha.ready(() => {
          try {
            widgetIdRef.current = window.grecaptcha!.render(widgetRef.current!, {
              sitekey: siteKey,
              size: "compact",
              theme: "dark",
              callback: (token: string) => {
                console.log("reCAPTCHA callback received, token length:", token.length)
              },
              "expired-callback": () => {
                console.log("reCAPTCHA token expired")
              },
              "error-callback": () => {
                console.error("reCAPTCHA error occurred")
                setErrorMessage("Security check failed. Please try again.")
                setHasError(true)
              }
            })
            
            console.log("reCAPTCHA widget rendered successfully with ID:", widgetIdRef.current)
            setIsLoading(false)
            setHasError(false)
          } catch (error: any) {
            console.error("reCAPTCHA render error:", error)
            setErrorMessage("Failed to load security check")
            setHasError(true)
            setIsLoading(false)
          }
        })
      }
    } catch (error: any) {
      console.error("reCAPTCHA widget error:", error)
      setErrorMessage(error.message || "Failed to load security check")
      setHasError(true)
      setIsLoading(false)
    }
  }, [loadRecaptchaScript])

  useEffect(() => {
    // Set a timeout to prevent hanging
    const timeoutId = setTimeout(() => {
      if (isLoading) {
        setErrorMessage("Security check timed out. Please refresh the page.")
        setHasError(true)
        setIsLoading(false)
      }
    }, 15000)

    renderWidget()

    return () => {
      clearTimeout(timeoutId)
      // Reset widget ID on unmount
      widgetIdRef.current = null
    }
  }, [renderWidget])

  // Function to get the current token
  const getToken = useCallback(() => {
    if (!window.grecaptcha || widgetIdRef.current === null) {
      console.log("reCAPTCHA not available or widget not rendered")
      return null
    }
    const token = window.grecaptcha.getResponse(widgetIdRef.current)
    console.log("Getting reCAPTCHA token, length:", token ? token.length : 0)
    return token
  }, [])

  // Function to reset the widget
  const resetWidget = useCallback(() => {
    if (window.grecaptcha && widgetIdRef.current !== null) {
      console.log("Resetting reCAPTCHA widget")
      window.grecaptcha.reset(widgetIdRef.current)
      setHasError(false)
      setErrorMessage("")
      setIsLoading(true)
      // Re-render after a short delay
      setTimeout(() => {
        renderWidget()
      }, 500)
    }
  }, [renderWidget])

  // Expose functions to parent component
  useEffect(() => {
    if (widgetRef.current) {
      ;(widgetRef.current as any).getRecaptchaToken = getToken
      ;(widgetRef.current as any).resetRecaptchaWidget = resetWidget
    }
  }, [getToken, resetWidget])

  if (hasError) {
    return (
      <div className="flex flex-col items-center gap-2">
        <div className="text-xs text-red-400 text-center">
          {errorMessage || "Security check temporarily unavailable"}
        </div>
        {isDebugMode && debugInfo && (
          <details className="text-xs text-gray-400 max-w-md">
            <summary className="cursor-pointer hover:text-gray-300">Debug Info</summary>
            <pre className="mt-2 text-left bg-gray-800 p-2 rounded text-xs overflow-auto">
              {debugInfo}
            </pre>
            <div className="mt-2 text-left bg-yellow-900/20 p-2 rounded text-xs">
              <strong>reCAPTCHA Troubleshooting:</strong>
              <ul className="list-disc pl-4 mt-1 space-y-1">
                <li>Check if site key is configured for domain: {window.location.hostname}</li>
                <li>Verify site key is valid and not expired</li>
                <li>Ensure only one reCAPTCHA widget per page</li>
                <li>Check if running in iframe (not supported)</li>
                <li>Verify HTTPS protocol in production</li>
              </ul>
            </div>
          </details>
        )}
        <button
          onClick={resetWidget}
          className="text-xs text-purple-400 hover:text-purple-300 underline"
        >
          Retry
        </button>
      </div>
    )
  }

  return (
    <div className="flex flex-col items-center gap-2">
      {isLoading && (
        <div className="flex items-center gap-2 text-gray-400">
          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-purple-500"></div>
          <span className="text-xs">Loading security check...</span>
        </div>
      )}
      <div ref={widgetRef} />
      <div className="text-xs text-gray-400 text-center">
        This site is protected by reCAPTCHA. Complete the check if prompted.
      </div>
    </div>
  )
}
