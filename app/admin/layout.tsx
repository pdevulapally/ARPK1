import type React from "react"
import { cookies } from "next/headers"
import { AdminSidebar } from "@/components/admin/sidebar"
import AuthGuard from "@/components/auth-guard"

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const cookieStore = cookies()
  const defaultOpen = await cookieStore.get("sidebar_state")?.value === "true"

  return (
    <AuthGuard>
      <AdminSidebar>
        {children}
      </AdminSidebar>
    </AuthGuard>
  )
}