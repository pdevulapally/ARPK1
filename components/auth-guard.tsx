"use client"

import type React from "react"

import { useEffect, useState } from "react"
import { useRouter, usePathname } from "next/navigation"
import { useAuth } from "@/lib/auth"
import { useToast } from "@/components/ui/use-toast"

export default function AuthGuard({ children }: { children: React.ReactNode }) {
  const { user, loading, isAdmin } = useAuth()
  const router = useRouter()
  const pathname = usePathname()
  const { toast } = useToast()
  const [isAuthorized, setIsAuthorized] = useState(false)

  useEffect(() => {
    // Skip during initial loading
    if (loading) return

    // Public routes that don't require authentication
    const publicRoutes = ["/", "/login", "/register", "/about", "/contact", "/pricing"]
    const isPublicRoute = publicRoutes.some((route) => pathname === route || pathname.startsWith("/blog"))

    if (!user && !isPublicRoute) {
      toast({
        title: "Authentication Required",
        description: "🚫 Please sign in to continue. This action requires authentication.",
        variant: "destructive",
      })
      router.push("/login")
      return
    }

    // Check if user is admin for admin routes
    const isAdminRoute = pathname.startsWith("/admin")

    if (isAdminRoute && !isAdmin) {
      toast({
        title: "Access Denied",
        description: "You don't have permission to access this area",
        variant: "destructive",
      })
      router.push("/dashboard")
      return
    }

    setIsAuthorized(true)
  }, [user, loading, pathname, router, toast, isAdmin])

  // Show nothing while checking authorization
  if (loading || !isAuthorized) {
    return null
  }

  return children
}
