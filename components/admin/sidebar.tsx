"use client"

import { useState } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import {
  LayoutDashboard,
  Users,
  FileText,
  Settings,
  Menu,
  X,
  BarChart3,
  CreditCard,
  Tag,
  ChevronDown,
  User2,
  ChevronUp,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu"
import { Collapsible, CollapsibleTrigger, CollapsibleContent } from "@/components/ui/collapsible"

const SIDEBAR_WIDTH = "16rem"
const SIDEBAR_WIDTH_MOBILE = "18rem"

// Define menuItems once
export const menuItems = [
  {
    title: "Dashboard",
    href: "/admin",
    icon: BarChart3,
  },
  {
    title: "Users",
    href: "/admin/users",
    icon: Users,
  },
  {
    title: "Projects",
    href: "/admin/projects",
    icon: FileText,
  },
  {
    title: "Analytics",
    href: "/admin/analytics",
    icon: LayoutDashboard,
  },
  {
    title: "Payments",
    href: "/admin/payments",
    icon: CreditCard,
  },
  {
    title: "Discounts",
    href: "/admin/discounts",
    icon: Tag,
  },
  {
    title: "Settings",
    href: "/admin/settings",
    icon: Settings,
  },
]

interface SidebarProps {
  children: React.ReactNode
}

export function AdminSidebar({ children }: SidebarProps) {
  const [isOpen, setIsOpen] = useState(false)
  const pathname = usePathname()

  return (
    <div className="min-h-screen bg-black">
      {/* Mobile menu button */}
      <Button
        variant="ghost"
        className="fixed top-4 right-4 lg:hidden z-50"
        onClick={() => setIsOpen(!isOpen)}
      >
        {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
      </Button>

      {/* Sidebar */}
      <div
        className={cn(
          "fixed inset-y-0 left-0 z-40 w-64 bg-black/60 backdrop-blur-xl border-r border-purple-500/20 transform transition-transform duration-200 ease-in-out lg:translate-x-0",
          isOpen ? "translate-x-0" : "-translate-x-full"
        )}
      >
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="flex items-center justify-between h-16 px-4 border-b border-purple-500/20">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem>
                  <span>ARPK Web Development</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>

          {/* Content */}
          <div className="flex-1 overflow-y-auto px-4 py-2">
            <Collapsible defaultOpen className="space-y-2">
              <CollapsibleTrigger className="flex items-center justify-between w-full">
                <span className="text-sm font-medium text-gray-400">Navigation</span>
                <ChevronDown className="h-4 w-4" />
              </CollapsibleTrigger>
              <CollapsibleContent>
                <nav className="space-y-1">
                  {menuItems.map((item) => {
                    const isActive = pathname === item.href
                    return (
                      <Link
                        key={item.title}
                        href={item.href}
                        className={cn(
                          "flex items-center gap-3 px-3 py-2 rounded-lg transition-colors",
                          isActive
                            ? "bg-purple-500/20 text-purple-500"
                            : "hover:bg-purple-500/10 text-gray-400 hover:text-white"
                        )}
                      >
                        <item.icon className="h-5 w-5" />
                        {item.title}
                      </Link>
                    )
                  })}
                </nav>
              </CollapsibleContent>
            </Collapsible>
          </div>

          {/* Footer */}
          <div className="border-t border-purple-500/20 p-4">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="w-full justify-start">
                  <User2 className="mr-2 h-4 w-4" />
                  <span>Admin</span>
                  <ChevronUp className="ml-auto h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" side="top">
                <DropdownMenuItem>Account</DropdownMenuItem>
                <DropdownMenuItem>Settings</DropdownMenuItem>
                <DropdownMenuItem>Sign out</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </div>

      {/* Main content */}
      <div className="lg:pl-64">
        <main className="min-h-screen">{children}</main>
      </div>
    </div>
  )
}