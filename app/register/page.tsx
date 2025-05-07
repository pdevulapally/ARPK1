"use client"

import type React from "react"

import { useState } from "react"
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

export default function RegisterPage() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()
  const { toast } = useToast()

  // Call useAuth at the top level of the component
  const { user, loading, signUp, signInWithGoogle } = useAuth()

  // If already logged in, redirect to dashboard
  if (user && !loading && typeof window !== "undefined") {
    router.push("/dashboard")
    return null
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (password !== confirmPassword) {
      toast({
        title: "Passwords do not match",
        description: "Please make sure your passwords match",
        variant: "destructive",
      })
      return
    }

    setIsLoading(true)

    try {
      await signUp(email, password)
      toast({
        title: "Account created",
        description: "Your account has been created successfully",
      })
      router.push("/dashboard")
    } catch (error) {
      // Error is handled in the auth provider
    } finally {
      setIsLoading(false)
    }
  }

  const handleGoogleSignIn = async () => {
    setIsLoading(true)

    try {
      await signInWithGoogle()
      toast({
        title: "Success",
        description: "You have been registered successfully",
      })
      router.push("/dashboard")
    } catch (error) {
      // Error is handled in the auth provider
    } finally {
      setIsLoading(false)
    }
  }

  // Show loading state while auth is initializing
  if (loading) {
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
          <div className="flex justify-center">
            <span className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-purple-600">
              ARPK
            </span>
          </div>
          <CardTitle className="text-2xl font-bold text-center">Create an account</CardTitle>
          <CardDescription className="text-center">
            Enter your email and password to create your account
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
              <Label htmlFor="password">Password</Label>
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
            <div className="space-y-2">
              <Label htmlFor="confirm-password">Confirm Password</Label>
              <Input
                id="confirm-password"
                type="password"
                placeholder="••••••••"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
                className="bg-black/50 border-purple-500/30 focus:border-purple-500"
              />
            </div>
            <Button type="submit" className="w-full bg-purple-600 hover:bg-purple-700" disabled={isLoading}>
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Creating account...
                </>
              ) : (
                "Register"
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
            Sign up with Google
          </Button>
        </CardContent>
        <CardFooter className="flex flex-col space-y-4">
          <div className="text-center text-sm">
            Already have an account?{" "}
            <Link href="/login" className="text-purple-400 hover:text-purple-300 font-medium">
              Login
            </Link>
          </div>
        </CardFooter>
      </Card>
    </div>
  )
}
