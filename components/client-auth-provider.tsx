"use client"

import { useEffect, useState } from "react"
import { AuthProvider } from "@/lib/auth"
import type { ReactNode } from "react"

export function ClientAuthProvider({ children }: { children: ReactNode }) {
  const [isClient, setIsClient] = useState(false)

  // This ensures we only render the AuthProvider on the client
  useEffect(() => {
    setIsClient(true)
  }, [])

  // During server-side rendering or hydration, we still need to provide a context
  // but we'll make it clear that it's not fully initialized yet
  if (!isClient) {
    return <div className="min-h-screen bg-gradient-to-b from-black to-purple-950">{children}</div>
  }

  return <AuthProvider>{children}</AuthProvider>
}
