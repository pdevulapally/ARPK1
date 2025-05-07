import type React from "react"
import { Inter } from "next/font/google"
import "./globals.css"
import { ThemeProvider } from "@/components/theme-provider"
import Navbar from "@/components/navbar"
import { Toaster } from "@/components/ui/toaster"
import { ClientAuthProvider } from "@/components/client-auth-provider"

const inter = Inter({ subsets: ["latin"] })

export const metadata = {
  title: "ARPK Web Development",
  description: "Premium web development services by ARPK",
  generator: 'PreethamDevulapally'
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" className="dark" suppressHydrationWarning>
      <body className={`${inter.className} dark:bg-background`}>
        <ThemeProvider attribute="class" forcedTheme="dark">
          <ClientAuthProvider>
            <div className="min-h-screen bg-background dark:bg-gradient-to-b dark:from-black dark:to-purple-950">
              <Navbar />
              <main>{children}</main>
              <Toaster />
            </div>
          </ClientAuthProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}

export async function AdminLayout({ children }: { children: React.ReactNode }) {
  const cookieStore = await cookies()
  const defaultOpen = (await cookieStore).get("sidebar_state")?.value === "true"

  return (
    <AdminSidebar>
      {children}
    </AdminSidebar>
  )
}

import { AdminSidebar } from "@/components/admin/sidebar"

function cookies() {
  throw new Error("Function not implemented.")
}
