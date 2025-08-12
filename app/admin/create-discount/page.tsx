"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { useToast } from "@/components/ui/use-toast"
import { Loader2, Percent, Users, Calendar } from "lucide-react"

export default function CreateDiscountPage() {
  const [loading, setLoading] = useState(false)
  const [discountData, setDiscountData] = useState({
    code: "",
    percentage: "",
    maxUses: "",
    description: "",
    isPublic: true
  })
  const { toast } = useToast()

  const handleCreateDiscount = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!discountData.code || !discountData.percentage || !discountData.maxUses) {
      toast({
        title: "Missing Fields",
        description: "Please fill in all required fields",
        variant: "destructive",
      })
      return
    }

    try {
      setLoading(true)
      
      const response = await fetch('/api/admin/create-discount', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(discountData),
      })

      const result = await response.json()

      if (result.success) {
        toast({
          title: "Success!",
          description: result.message,
        })
        
        // Reset form
        setDiscountData({
          code: "",
          percentage: "",
          maxUses: "",
          description: "",
          isPublic: true
        })
      } else {
        toast({
          title: "Error",
          description: result.error,
          variant: "destructive",
        })
      }
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900 py-20">
      <div className="container mx-auto px-4">
        <Card className="max-w-md mx-auto bg-black/60 backdrop-blur-md border-purple-500/30">
          <CardHeader>
            <CardTitle className="text-white flex items-center gap-2">
              <Percent className="h-5 w-5 text-purple-400" />
              Create Discount Code
            </CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleCreateDiscount} className="space-y-4">
              <div>
                <label className="text-sm text-gray-300 mb-2 block">Discount Code *</label>
                <Input
                  value={discountData.code}
                  onChange={(e) => setDiscountData({...discountData, code: e.target.value.toUpperCase()})}
                  className="bg-black/50 border-purple-500/30 focus:border-purple-500"
                  placeholder="WELCOME2024"
                  required
                />
              </div>

              <div>
                <label className="text-sm text-gray-300 mb-2 block">Discount Percentage *</label>
                <div className="relative">
                  <Input
                    type="number"
                    min="1"
                    max="100"
                    value={discountData.percentage}
                    onChange={(e) => setDiscountData({...discountData, percentage: e.target.value})}
                    className="pr-8 bg-black/50 border-purple-500/30 focus:border-purple-500"
                    placeholder="15"
                    required
                  />
                  <Percent className="h-4 w-4 absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                </div>
              </div>

              <div>
                <label className="text-sm text-gray-300 mb-2 block">Maximum Uses *</label>
                <div className="relative">
                  <Input
                    type="number"
                    min="1"
                    value={discountData.maxUses}
                    onChange={(e) => setDiscountData({...discountData, maxUses: e.target.value})}
                    className="pr-8 bg-black/50 border-purple-500/30 focus:border-purple-500"
                    placeholder="50"
                    required
                  />
                  <Users className="h-4 w-4 absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                </div>
              </div>

              <div>
                <label className="text-sm text-gray-300 mb-2 block">Description</label>
                <Input
                  value={discountData.description}
                  onChange={(e) => setDiscountData({...discountData, description: e.target.value})}
                  className="bg-black/50 border-purple-500/30 focus:border-purple-500"
                  placeholder="Welcome discount for new customers"
                />
              </div>

              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id="isPublic"
                  checked={discountData.isPublic}
                  onChange={(e) => setDiscountData({...discountData, isPublic: e.target.checked})}
                  className="rounded border-purple-500/30 bg-black/50"
                />
                <label htmlFor="isPublic" className="text-sm text-gray-300">
                  Public (available to everyone)
                </label>
              </div>

              <Button
                type="submit"
                disabled={loading}
                className="w-full bg-purple-600 hover:bg-purple-700"
              >
                {loading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Creating...
                  </>
                ) : (
                  "Create Discount Code"
                )}
              </Button>
            </form>

            <div className="text-xs text-gray-500 mt-4 space-y-1">
              <p>• Code will be valid for 1 year</p>
              <p>• Public codes can be used by anyone</p>
              <p>• Private codes require specific user emails</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
