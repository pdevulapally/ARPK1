"use client"

import { createContext, useContext, useEffect, useState, type ReactNode } from "react"
import dynamic from "next/dynamic"

// Create a context to hold the Firebase client
const FirebaseContext = createContext<any>(null)

// Dynamic import of Firebase client
const FirebaseClient = dynamic(() => import("@/lib/firebase-client"), {
  ssr: false,
})

export function FirebaseProvider({ children }: { children: ReactNode }) {
  const [isClient, setIsClient] = useState(false)

  useEffect(() => {
    setIsClient(true)
  }, [])

  if (!isClient) {
    return <>{children}</>
  }

  return <FirebaseContext.Provider value={FirebaseClient}>{children}</FirebaseContext.Provider>
}

export const useFirebase = () => {
  const context = useContext(FirebaseContext)
  if (!context) {
    throw new Error("useFirebase must be used within a FirebaseProvider")
  }
  return context
}
