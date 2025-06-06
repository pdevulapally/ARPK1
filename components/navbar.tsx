"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { useAuth } from "@/lib/auth"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Menu, X, User, LogOut, Settings, Users, BarChart3 } from "lucide-react"
import { NoSSR } from "./no-ssr"

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false)
  const [isScrolled, setIsScrolled] = useState(false)
  const { user, isAdmin, signOut } = useAuth()

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 10) {
        setIsScrolled(true)
      } else {
        setIsScrolled(false)
      }
    }

    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  const navLinks = [
    { name: "Home", href: "/" },
    { name: "About", href: "/about" },
    { name: "Pricing", href: "/pricing" },
    { name: "Request Website", href: "/request" },
  ]

  return (
    <nav
      className={`fixed w-full z-50 transition-all duration-300 ${
        isScrolled ? "bg-black/70 backdrop-blur-lg border-b border-purple-500/20" : "bg-transparent"
      }`}
    >
      <div className="max-w-full mx-auto px-2 sm:px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center">
            <img
              src="/Images/ARPK_Logo.png"
              alt="ARPK Logo"
              className="h-12 w-auto" // Adjust height as needed
              style={{
                filter: isScrolled ? 'brightness(1)' : 'brightness(1.2)', // Optional: adjust logo brightness based on scroll
                transition: 'filter 0.3s ease'
              }}
            />
            <span className="sr-only">ARPK</span> {/* For accessibility */}
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-4 px-6 py-2 rounded-full bg-black/40 backdrop-blur-md border border-purple-500/20">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                href={link.href}
                className="text-gray-300 hover:text-purple-400 px-3 py-1 rounded-md text-sm font-medium transition-colors"
              >
                {link.name}
              </Link>
            ))}
            <NoSSR>
              <AuthNavLinks />
            </NoSSR>
          </div>

          {/* Authentication Area - Desktop */}
          <div className="hidden md:flex items-center">
            <NoSSR fallback={<LoginButtons />}>
              <AuthButtons />
            </NoSSR>
          </div>

          {/* Mobile menu button and user profile */}
          <div className="md:hidden flex items-center gap-2">
            {/* Show login/register buttons if user is not logged in */}
            <NoSSR>
              {!user && (
                <div className="flex gap-2">
                  <Button asChild variant="ghost" size="sm" className="text-gray-300 hover:text-white">
                    <Link href="/login">Log in</Link>
                  </Button>
                  <Button asChild size="sm" className="bg-purple-600 hover:bg-purple-700">
                    <Link href="/register">Register</Link>
                  </Button>
                </div>
              )}
              {/* User profile dropdown */}
              {user && (
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="relative h-8 w-8 rounded-full p-0">
                      {user.photoURL ? (
                        <img
                          src={user.photoURL}
                          alt={user.displayName || user.email || "User"}
                          className="h-8 w-8 rounded-full object-cover"
                        />
                      ) : (
                        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-purple-600 text-white">
                          {user.displayName
                            ? user.displayName.charAt(0).toUpperCase()
                            : user.email?.charAt(0).toUpperCase()}
                        </div>
                      )}
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-56">
                    <div className="flex items-center justify-start gap-2 p-2">
                      {user.photoURL ? (
                        <img
                          src={user.photoURL}
                          alt={user.displayName || user.email || "User"}
                          className="h-8 w-8 rounded-full object-cover"
                        />
                      ) : (
                        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-purple-600 text-white">
                          {user.displayName
                            ? user.displayName.charAt(0).toUpperCase()
                            : user.email?.charAt(0).toUpperCase()}
                        </div>
                      )}
                      <div className="flex flex-col space-y-0.5">
                        <p className="text-sm font-medium">{user.displayName || user.email}</p>
                        <p className="text-xs text-muted-foreground">{user.email}</p>
                      </div>
                    </div>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem asChild>
                      <Link href="/dashboard" className="cursor-pointer">
                        <User className="mr-2 h-4 w-4" />
                        <span>Dashboard</span>
                      </Link>
                    </DropdownMenuItem>
                    {isAdmin && (
                      <>
                        <DropdownMenuItem asChild>
                          <Link href="/admin" className="cursor-pointer">
                            <Settings className="mr-2 h-4 w-4" />
                            <span>Admin Panel</span>
                          </Link>
                        </DropdownMenuItem>
                        <DropdownMenuItem asChild>
                          <Link href="/admin/users" className="cursor-pointer">
                            <Users className="mr-2 h-4 w-4" />
                            <span>User Management</span>
                          </Link>
                        </DropdownMenuItem>
                        <DropdownMenuItem asChild>
                          <Link href="/admin/analytics" className="cursor-pointer">
                            <BarChart3 className="mr-2 h-4 w-4" />
                            <span>Analytics</span>
                          </Link>
                        </DropdownMenuItem>
                      </>
                    )}
                    <DropdownMenuItem asChild>
                      <Link href="/profile" className="cursor-pointer">
                        <Settings className="mr-2 h-4 w-4" />
                        <span>Profile</span>
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={() => signOut()} className="cursor-pointer">
                      <LogOut className="mr-2 h-4 w-4" />
                      <span>Log out</span>
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              )}
            </NoSSR>

            {/* Burger menu button */}
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="inline-flex items-center justify-center p-2 rounded-md text-gray-300 hover:text-white focus:outline-none"
            >
              <span className="sr-only">Open main menu</span>
              {isOpen ? (
                <X className="block h-6 w-6" aria-hidden="true" />
              ) : (
                <Menu className="block h-6 w-6" aria-hidden="true" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      <div
        className={`md:hidden ${isOpen ? "block" : "hidden"} bg-black/90 backdrop-blur-lg border-b border-purple-500/20`}
      >
        <div className="px-2 pt-2 pb-3 space-y-1">
          {navLinks.map((link) => (
            <Link
              key={link.name}
              href={link.href}
              className="text-gray-300 hover:text-purple-400 block px-2 py-2 rounded-md text-base font-medium"
              onClick={() => setIsOpen(false)}
            >
              {link.name}
            </Link>
          ))}
          {user && (
            <>
              <Link
                href="/dashboard"
                className="text-gray-300 hover:text-purple-400 block px-2 py-2 rounded-md text-base font-medium"
                onClick={() => setIsOpen(false)}
              >
                Dashboard
              </Link>
              {isAdmin && (
                <>
                  <Link
                    href="/admin"
                    className="text-gray-300 hover:text-purple-400 block px-2 py-2 rounded-md text-base font-medium"
                    onClick={() => setIsOpen(false)}
                  >
                    Admin Panel
                  </Link>
                  <Link
                    href="/admin/users"
                    className="text-gray-300 hover:text-purple-400 block px-2 py-2 rounded-md text-base font-medium"
                    onClick={() => setIsOpen(false)}
                  >
                    User Management
                  </Link>
                </>
              )}
              <button
                onClick={() => {
                  signOut()
                  setIsOpen(false)
                }}
                className="block w-full text-left px-2 py-2 rounded-md text-base font-medium text-gray-300 hover:text-white"
              >
                Sign out
              </button>
            </>
          )}
          {!user && (
            <div className="pt-2 space-y-1">
              <Button asChild variant="outline" className="w-full justify-center">
                <Link href="/login" onClick={() => setIsOpen(false)}>
                  Log in
                </Link>
              </Button>
              <Button asChild className="w-full bg-purple-600 hover:bg-purple-700 justify-center">
                <Link href="/register" onClick={() => setIsOpen(false)}>
                  Register
                </Link>
              </Button>
            </div>
          )}
        </div>
      </div>
    </nav>
  )
}

// Auth-dependent navigation links
function AuthNavLinks() {
  const { user, isAdmin } = useAuth()

  if (!user) return null

  return (
    <>
      <Link
        href="/dashboard"
        className="text-gray-300 hover:text-purple-400 px-3 py-2 rounded-md text-sm font-medium transition-colors"
      >
        Dashboard
      </Link>
      {isAdmin && (
        <Link
          href="/admin"
          className="text-gray-300 hover:text-purple-400 px-3 py-2 rounded-md text-sm font-medium transition-colors"
        >
          Admin
        </Link>
      )}
    </>
  )
}

// Mobile auth-dependent navigation links
function MobileAuthNavLinks({ setIsOpen }: { setIsOpen: (isOpen: boolean) => void }) {
  const { user, isAdmin } = useAuth()

  if (!user) return null

  return (
    <>
      <Link
        href="/dashboard"
        className="text-gray-300 hover:text-purple-400 block px-3 py-2 rounded-md text-base font-medium"
        onClick={() => setIsOpen(false)}
      >
        Dashboard
      </Link>
      {isAdmin && (
        <Link
          href="/admin"
          className="text-gray-300 hover:text-purple-400 block px-3 py-2 rounded-md text-base font-medium"
          onClick={() => setIsOpen(false)}
        >
          Admin
        </Link>
      )}
    </>
  )
}

// Default login buttons
function LoginButtons() {
  return (
    <div className="flex space-x-2">
      <Button asChild variant="ghost" className="text-gray-300 hover:text-white">
        <Link href="/login">Log in</Link>
      </Button>
      <Button asChild className="bg-purple-600 hover:bg-purple-700">
        <Link href="/register">Register</Link>
      </Button>
    </div>
  )
}

// Mobile login buttons
function MobileLoginButtons({ setIsOpen }: { setIsOpen: (isOpen: boolean) => void }) {
  return (
    <div className="pt-4 pb-3 border-t border-purple-500/20">
      <div className="px-4 flex flex-col space-y-2">
        <Button asChild variant="outline" className="justify-center">
          <Link href="/login" onClick={() => setIsOpen(false)}>
            Log in
          </Link>
        </Button>
        <Button asChild className="bg-purple-600 hover:bg-purple-700 justify-center">
          <Link href="/register" onClick={() => setIsOpen(false)}>
            Register
          </Link>
        </Button>
      </div>
    </div>
  )
}

// Auth buttons for desktop
function AuthButtons() {
  const { user, signOut, isAdmin } = useAuth()

  if (!user) {
    return <LoginButtons />
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="relative h-10 w-10 rounded-full">
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-purple-600 text-white">
            {user.displayName ? user.displayName.charAt(0).toUpperCase() : user.email?.charAt(0).toUpperCase()}
          </div>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-56">
        <div className="flex items-center justify-start gap-2 p-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-purple-600 text-white">
            {user.displayName ? user.displayName.charAt(0).toUpperCase() : user.email?.charAt(0).toUpperCase()}
          </div>
          <div className="flex flex-col space-y-0.5">
            <p className="text-sm font-medium">{user.displayName || user.email}</p>
            <p className="text-xs text-muted-foreground">{user.email}</p>
          </div>
        </div>
        <DropdownMenuSeparator />
        <DropdownMenuItem asChild>
          <Link href="/dashboard" className="cursor-pointer">
            <User className="mr-2 h-4 w-4" />
            <span>Dashboard</span>
          </Link>
        </DropdownMenuItem>
        {isAdmin && (
          <>
            <DropdownMenuItem asChild>
              <Link href="/admin" className="cursor-pointer">
                <Settings className="mr-2 h-4 w-4" />
                <span>Admin Panel</span>
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem asChild>
              <Link href="/admin/users" className="cursor-pointer">
                <Users className="mr-2 h-4 w-4" />
                <span>User Management</span>
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem asChild>
              <Link href="/admin/analytics" className="cursor-pointer">
                <BarChart3 className="mr-2 h-4 w-4" />
                <span>Analytics</span>
              </Link>
            </DropdownMenuItem>
          </>
        )}
        <DropdownMenuItem asChild>
          <Link href="/profile" className="cursor-pointer">
            <Settings className="mr-2 h-4 w-4" />
            <span>Profile</span>
          </Link>
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={() => signOut()} className="cursor-pointer">
          <LogOut className="mr-2 h-4 w-4" />
          <span>Log out</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

// Mobile auth buttons
function MobileAuthButtons({ setIsOpen }: { setIsOpen: (isOpen: boolean) => void }) {
  const { user, signOut, isAdmin } = useAuth()

  if (!user) {
    return <MobileLoginButtons setIsOpen={setIsOpen} />
  }

  return (
    <div className="pt-4 pb-3 border-t border-purple-500/20">
      <div className="px-4 space-y-2">
        {/* Remove the user profile section that was here */}
        <div className="space-y-1">
          <Link
            href="/dashboard"
            className="block px-3 py-2 rounded-md text-base font-medium text-gray-300 hover:text-white"
            onClick={() => setIsOpen(false)}
          >
            Dashboard
          </Link>
          {isAdmin && (
            <>
              <Link
                href="/admin"
                className="block px-3 py-2 rounded-md text-base font-medium text-gray-300 hover:text-white"
                onClick={() => setIsOpen(false)}
              >
                Admin Panel
              </Link>
              <Link
                href="/admin/users"
                className="block px-3 py-2 rounded-md text-base font-medium text-gray-300 hover:text-white"
                onClick={() => setIsOpen(false)}
              >
                User Management
              </Link>
            </>
          )}
          <Link
            href="/profile"
            className="block px-3 py-2 rounded-md text-base font-medium text-gray-300 hover:text-white"
            onClick={() => setIsOpen(false)}
          >
            Profile
          </Link>
          <button
            onClick={() => {
              signOut()
              setIsOpen(false)
            }}
            className="block w-full text-left px-3 py-2 rounded-md text-base font-medium text-gray-300 hover:text-white"
          >
            Sign out
          </button>
        </div>
      </div>
    </div>
  )
}
