"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/lib/auth"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { useToast } from "@/components/ui/use-toast"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import AuthGuard from "@/components/auth-guard"
import { createRequest } from "@/lib/firebase"

const websiteTypes = [
  { value: "portfolio", label: "Portfolio" },
  { value: "ecommerce", label: "E-Commerce" },
  { value: "blog", label: "Blog" },
  { value: "business", label: "Business Website" },
  { value: "landing", label: "Landing Page" },
  { value: "web-app", label: "Web Application" },
  { value: "other", label: "Other" },
]

const features = [
  { id: "login", label: "User Authentication" },
  { id: "payments", label: "Payment Processing" },
  { id: "animations", label: "Advanced Animations" },
  { id: "admin", label: "Admin Panel" },
  { id: "blog", label: "Blog/Content Management" },
  { id: "seo", label: "SEO Optimization" },
  { id: "responsive", label: "Responsive Design" },
  { id: "analytics", label: "Analytics Integration" },
]

export default function RequestPage() {
  const { user } = useAuth()
  const router = useRouter()
  const { toast } = useToast()

  const [formData, setFormData] = useState({
    websiteType: "",
    otherWebsiteType: "",
    features: [] as string[],
    deadline: "",
    budget: "",
    designPreferences: "",
    additionalNotes: "",
    // Auto-filled user details
    name: user?.displayName || "",
    email: user?.email || "",
    uid: user?.uid || "",
  })
  const [isSubmitting, setIsSubmitting] = useState(false)

  // Redirect if not logged in
  useEffect(() => {
    if (!user) {
      toast({
        title: "Authentication Required",
        description: "Please sign in to submit a request",
        variant: "destructive",
      })
      router.push("/login")
    } else {
      // Auto-fill user details when logged in
      setFormData(prev => ({
        ...prev,
        name: user.displayName || "",
        email: user.email || "",
        uid: user.uid
      }))
    }
  }, [user, router, toast])

  const handleFeatureChange = (featureId: string, checked: boolean) => {
    setFormData((prev) => ({
      ...prev,
      features: checked ? [...prev.features, featureId] : prev.features.filter((id) => id !== featureId),
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!user) {
      toast({
        title: "Authentication Required",
        description: "Please sign in to submit a request",
        variant: "destructive",
      })
      router.push("/login")
      return
    }

    setIsSubmitting(true)

    try {
      const requestData = {
        userId: user.uid,
        userEmail: user.email || "unknown@email.com",
        status: "pending",
        ...formData,
      }

      await createRequest(requestData)

      toast({
        title: "Request Submitted",
        description: "Your website request has been submitted successfully. We'll review it shortly.",
      })

      router.push("/dashboard")
    } catch (error: any) {
      toast({
        title: "Error",
        description: `Failed to submit request: ${error.message}`,
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <AuthGuard>
      <div className="container max-w-4xl mx-auto px-4 py-24">
        <Card className="border border-purple-500/30 bg-black/60 backdrop-blur-md">
          <CardHeader>
            <CardTitle className="text-2xl font-bold">Request a Website</CardTitle>
            <CardDescription>
              Fill out the form below to request a custom website. We'll review your request and get back to you with a
              quote.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* User Details Section - Auto-filled and read-only */}
              <div className="space-y-4">
                <div>
                  <Label htmlFor="name">Your Name</Label>
                  <Input
                    id="name"
                    value={formData.name}
                    readOnly
                    className="bg-black/50 border-purple-500/30"
                  />
                </div>
                <div>
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    value={formData.email}
                    readOnly
                    className="bg-black/50 border-purple-500/30"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="websiteType">Website Type</Label>
                <Select
                  value={formData.websiteType}
                  onValueChange={(value) => setFormData({ ...formData, websiteType: value })}
                  required
                >
                  <SelectTrigger className="bg-black/50 border-purple-500/30 focus:border-purple-500">
                    <SelectValue placeholder="Select website type" />
                  </SelectTrigger>
                  <SelectContent>
                    {websiteTypes.map((type) => (
                      <SelectItem key={type.value} value={type.value}>
                        {type.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                {/* Other Website Type Input */}
                {formData.websiteType === "other" && (
                  <div className="mt-2">
                    <Label htmlFor="otherWebsiteType">Please specify website type</Label>
                    <Input
                      id="otherWebsiteType"
                      value={formData.otherWebsiteType}
                      onChange={(e) => setFormData({ ...formData, otherWebsiteType: e.target.value })}
                      placeholder="Enter website type"
                      className="bg-black/50 border-purple-500/30 focus:border-purple-500"
                      required
                    />
                  </div>
                )}
              </div>

              <div className="space-y-3">
                <Label>Required Features</Label>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {features.map((feature) => (
                    <div key={feature.id} className="flex items-center space-x-2">
                      <Checkbox
                        id={feature.id}
                        checked={formData.features.includes(feature.id)}
                        onCheckedChange={(checked) => handleFeatureChange(feature.id, checked as boolean)}
                      />
                      <Label htmlFor={feature.id} className="cursor-pointer">
                        {feature.label}
                      </Label>
                    </div>
                  ))}
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="deadline">Deadline</Label>
                <Input
                  id="deadline"
                  type="date"
                  value={formData.deadline}
                  onChange={(e) => setFormData({ ...formData, deadline: e.target.value })}
                  className="bg-black/50 border-purple-500/30 focus:border-purple-500"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="budget">Budget (GBP £)</Label>
                <Input
                  id="budget"
                  type="number"
                  placeholder="Enter your budget"
                  value={formData.budget}
                  onChange={(e) => setFormData({ ...formData, budget: e.target.value })}
                  className="bg-black/50 border-purple-500/30 focus:border-purple-500"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="designPreferences">Design Preferences (links or examples)</Label>
                <Textarea
                  id="designPreferences"
                  placeholder="Share links to websites you like or describe your design preferences"
                  value={formData.designPreferences}
                  onChange={(e) => setFormData({ ...formData, designPreferences: e.target.value })}
                  className="min-h-[100px] bg-black/50 border-purple-500/30 focus:border-purple-500"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="additionalNotes">Additional Notes</Label>
                <Textarea
                  id="additionalNotes"
                  placeholder="Any additional information you'd like to share"
                  value={formData.additionalNotes}
                  onChange={(e) => setFormData({ ...formData, additionalNotes: e.target.value })}
                  className="min-h-[100px] bg-black/50 border-purple-500/30 focus:border-purple-500"
                />
              </div>
            </form>
          </CardContent>
          <CardFooter>
            <Button onClick={handleSubmit} className="w-full bg-purple-600 hover:bg-purple-700" disabled={isSubmitting}>
              {isSubmitting ? "Submitting..." : "Submit Request"}
            </Button>
          </CardFooter>
        </Card>
      </div>
    </AuthGuard>
  )
}
