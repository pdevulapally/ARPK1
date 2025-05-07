"use client"

import type React from "react"

import { useEffect, useState } from "react"
import { NoSSR } from "@/components/no-ssr"
import dynamic from "next/dynamic"

// Dynamically import Firebase client
const FirebaseClient = dynamic(() => import("@/lib/firebase-client"), {
  ssr: false,
})

export function ClientPage({ children }: { children: React.ReactNode }) {
  const [isClient, setIsClient] = useState(false)

  useEffect(() => {
    setIsClient(true)
  }, [])

  return <NoSSR>{children}</NoSSR>
}

export default ClientPage
