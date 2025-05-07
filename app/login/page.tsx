"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { useAuth } from "@/lib/auth"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { useToast } from "@/components/ui/use-toast"
import { Loader2 } from "lucide-react"
import { FaGoogle } from "react-icons/fa"
import { initializeFirebase } from "@/lib/firebase-init"

export default function LoginPage() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [firebaseInitialized, setFirebaseInitialized] = useState(false)
  const router = useRouter()
  const { toast } = useToast()

  // Initialize Firebase when component mounts
  useEffect(() => {
    const initialize = () => {
      try {
        const firebase = initializeFirebase()
        setFirebaseInitialized(!!firebase?.auth)
      } catch (error) {
        console.error("Failed to initialize Firebase:", error)
      }
    }

    initialize()
  }, [])

  // Call useAuth at the top level of the component
  const { user, loading, signIn, signInWithGoogle } = useAuth()

  // Replace the direct router.push with useEffect
  useEffect(() => {
    if (user && !loading && typeof window !== "undefined") {
      router.push("/dashboard")
    }
  }, [user, loading, router])

  // Remove the direct redirect code
  // if (user && !loading && typeof window !== "undefined") {
  //   router.push("/dashboard")
  //   return null
  // }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!firebaseInitialized) {
      toast({
        title: "Firebase not initialized",
        description: "Please wait while Firebase initializes or try refreshing the page.",
        variant: "destructive",
      })
      return
    }

    setIsLoading(true)

    try {
      await signIn(email, password)
      toast({
        title: "Success",
        description: "You have been logged in successfully",
      })
      router.push("/dashboard")
    } catch (error: any) {
      console.error("Login error:", error)
      toast({
        title: "Login Failed",
        description: error.message || "Failed to sign in. Please check your credentials.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleGoogleSignIn = async () => {
    if (!firebaseInitialized) {
      toast({
        title: "Firebase not initialized",
        description: "Please wait while Firebase initializes or try refreshing the page.",
        variant: "destructive",
      })
      return
    }

    setIsLoading(true)

    try {
      await signInWithGoogle()
      toast({
        title: "Success",
        description: "You have been logged in successfully",
      })
      router.push("/dashboard")
    } catch (error: any) {
      console.error("Google login error:", error)
      toast({
        title: "Google Login Failed",
        description: error.message || "Failed to sign in with Google.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  // Show loading state while auth is initializing
  if (loading || !firebaseInitialized) {
    return (
      <div className="container flex items-center justify-center min-h-screen py-20">
        <Card className="w-full max-w-md border border-purple-500/30 bg-black/60 backdrop-blur-md">
          <CardHeader className="space-y-1">
            <CardTitle className="text-2xl font-bold text-center">Loading...</CardTitle>
            <CardDescription className="text-center">Please wait while we initialize authentication</CardDescription>
          </CardHeader>
          <CardContent className="flex justify-center p-6">
            <Loader2 className="h-8 w-8 animate-spin text-purple-600" />
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="container flex items-center justify-center min-h-screen py-20">
      <Card className="w-full max-w-md border border-purple-500/30 bg-black/60 backdrop-blur-md">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl font-bold text-center">Login</CardTitle>
          <CardDescription className="text-center">
            Enter your email and password to access your account
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="name@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="bg-black/50 border-purple-500/30 focus:border-purple-500"
              />
            </div>
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="password">Password</Label>
                <Link href="/forgot-password" className="text-xs text-purple-400 hover:text-purple-300">
                  Forgot password?
                </Link>
              </div>
              <Input
                id="password"
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="bg-black/50 border-purple-500/30 focus:border-purple-500"
              />
            </div>
            <Button type="submit" className="w-full bg-purple-600 hover:bg-purple-700" disabled={isLoading}>
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Logging in...
                </>
              ) : (
                "Login"
              )}
            </Button>
          </form>
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t border-purple-500/30" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-black px-2 text-muted-foreground">Or continue with</span>
            </div>
          </div>
          <Button
            variant="outline"
            type="button"
            className="w-full border-purple-500/30 hover:bg-purple-900/20 hover:text-white flex items-center justify-center"
            onClick={handleGoogleSignIn}
            disabled={isLoading}
          >
            {isLoading ? (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            ) : (
              <svg viewBox="0 0 48 48" className="mr-2 h-4 w-4">
                <title>Google Logo</title>
                <clipPath id="g">
                  <path d="M44.5 20H24v8.5h11.8C34.7 33.9 30.1 37 24 37c-7.2 0-13-5.8-13-13s5.8-13 13-13c3.1 0 5.9 1.1 8.1 2.9l6.4-6.4C34.6 4.1 29.6 2 24 2 11.8 2 2 11.8 2 24s9.8 22 22 22c11 0 21-8 21-22 0-1.3-.2-2.7-.5-4z" />
                </clipPath>
                <g clipPath="url(#g)">
                  <path fill="#FBBC05" d="M0 37V11l17 13z" />
                  <path fill="#EA4335" d="M0 11l17 13 7-6.1L48 14V0H0z" />
                  <path fill="#34A853" d="M0 37l30-23 7.9 1L48 0v48H0z" />
                  <path fill="#4285F4" d="M48 48L17 24l-4-3 35-10z" />
                </g>
              </svg>
            )}
            Sign in with Google
          </Button>
        </CardContent>
        <CardFooter className="flex flex-col space-y-4">
          <div className="text-center text-sm">
            Don&apos;t have an account?{" "}
            <Link href="/register" className="text-purple-400 hover:text-purple-300 font-medium">
              Register
            </Link>
          </div>
        </CardFooter>
      </Card>
    </div>
  )
}
