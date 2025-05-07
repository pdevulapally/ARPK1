"use client"

import { useEffect, useState, type ReactNode } from "react"

interface NoSSRProps {
  children: ReactNode
  fallback?: ReactNode
}

export function NoSSR({ children, fallback = null }: NoSSRProps) {
  const [isClient, setIsClient] = useState(false)

  useEffect(() => {
    setIsClient(true)
  }, [])

  return isClient ? <>{children}</> : <>{fallback}</>
}
