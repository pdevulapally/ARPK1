"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { createProject, createNotification } from "@/lib/firebase"

export default function CreateProjectPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    userEmail: "",
    websiteType: "",
    description: "",
    requirements: "",
    status: "pending",
    requestId: "",
    userId: "",
    features: [],
    deadline: "",
    budget: 0
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      setLoading(true)
      await createProject({
        ...formData,
        createdAt: new Date().toISOString(),
      })
      router.push("/admin/projects")
      router.refresh()
    } catch (error) {
      console.error("Error creating project:", error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="space-y-6 pt-20 px-4">
      <div className="flex items-center justify-between gap-4">
        <h1 className="text-2xl font-bold">Create New Project</h1>
      </div>

      <Card className="border border-purple-500/30 bg-black/60 backdrop-blur-md">
        <CardHeader>
          <CardTitle>Project Details</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Client Email</label>
              <Input
                required
                type="email"
                placeholder="client@example.com"
                value={formData.userEmail}
                onChange={(e) => setFormData({ ...formData, userEmail: e.target.value })}
                className="bg-black/50 border-purple-500/30 focus:border-purple-500"
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Website Type</label>
              <Select
                required
                value={formData.websiteType}
                onValueChange={(value) => setFormData({ ...formData, websiteType: value })}
              >
                <SelectTrigger className="bg-black/50 border-purple-500/30 focus:border-purple-500">
                  <SelectValue placeholder="Select website type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="portfolio">Portfolio</SelectItem>
                  <SelectItem value="e-commerce">E-Commerce</SelectItem>
                  <SelectItem value="blog">Blog</SelectItem>
                  <SelectItem value="business">Business</SelectItem>
                  <SelectItem value="landing">Landing Page</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Features</label>
              <Select
                required
                value={formData.features.join(',')}
                onValueChange={(value) => setFormData({ 
                  ...formData, 
                  features: value.split(',').filter(Boolean)
                })}
              >
                <SelectTrigger className="bg-black/50 border-purple-500/30 focus:border-purple-500">
                  <SelectValue placeholder="Select features" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="authentication">User Authentication</SelectItem>
                  <SelectItem value="payment">Payment Integration</SelectItem>
                  <SelectItem value="cms">Content Management</SelectItem>
                  <SelectItem value="seo">SEO Optimization</SelectItem>
                  <SelectItem value="analytics">Analytics Integration</SelectItem>
                  <SelectItem value="responsive">Responsive Design</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Description</label>
              <Textarea
                required
                placeholder="Project description..."
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                className="bg-black/50 border-purple-500/30 focus:border-purple-500 min-h-[100px]"
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Requirements</label>
              <Textarea
                required
                placeholder="Project requirements..."
                value={formData.requirements}
                onChange={(e) => setFormData({ ...formData, requirements: e.target.value })}
                className="bg-black/50 border-purple-500/30 focus:border-purple-500 min-h-[100px]"
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Project Budget ($)</label>
              <Input
                required
                type="number"
                min="0"
                step="100"
                placeholder="Enter project budget..."
                value={formData.budget || ''}
                onChange={(e) => setFormData({ ...formData, budget: parseFloat(e.target.value) || 0 })}
                className="bg-black/50 border-purple-500/30 focus:border-purple-500"
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Project Deadline</label>
              <Input
                required
                type="date"
                value={formData.deadline}
                onChange={(e) => setFormData({ ...formData, deadline: e.target.value })}
                className="bg-black/50 border-purple-500/30 focus:border-purple-500"
              />
            </div>

            <div className="flex gap-4">
              <Button
                type="submit"
                className="bg-purple-600 hover:bg-purple-700"
                disabled={loading}
              >
                {loading ? "Creating..." : "Create Project"}
              </Button>
              <Button
                type="button"
                variant="outline"
                onClick={() => router.back()}
              >
                Cancel
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}