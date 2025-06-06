"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { getAllDiscountCodes, createDiscountCode, type DiscountCode } from "@/lib/firebase"
import { Loader2, Plus, Percent } from "lucide-react"

export default function DiscountsPage() {
  const router = useRouter()
  const [discounts, setDiscounts] = useState<DiscountCode[]>([])
  const [loading, setLoading] = useState(true)
  const [showCreateForm, setShowCreateForm] = useState(false)
  const [newDiscount, setNewDiscount] = useState({
    code: "",
    percentage: 0,
    maxUses: 0,
    description: "",
    expiryDate: "",
    isActive: true,
    isPublic: false,
    allowedUsers: [] as string[]
  })

  const [userEmail, setUserEmail] = useState("")

  useEffect(() => {
    fetchDiscounts()
  }, [])

  const fetchDiscounts = async () => {
    try {
      setLoading(true)
      const discountData = await getAllDiscountCodes()
      setDiscounts(discountData)
    } catch (error) {
      console.error("Error fetching discounts:", error)
    } finally {
      setLoading(false)
    }
  }

  const handleCreateDiscount = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      await createDiscountCode(newDiscount)
      setShowCreateForm(false)
      setNewDiscount({
        code: "",
        percentage: 0,
        maxUses: 0,
        description: "",
        expiryDate: "",
        isActive: true,
        isPublic: false,
        allowedUsers: [] as string[]
      })
      fetchDiscounts()
    } catch (error) {
      console.error("Error creating discount:", error)
    }
  }

  // Add function to handle adding users
  const handleAddUser = () => {
    if (userEmail && !newDiscount.allowedUsers.includes(userEmail)) {
      setNewDiscount({
        ...newDiscount,
        allowedUsers: [...newDiscount.allowedUsers, userEmail.toLowerCase()]
      })
      setUserEmail("")
    }
  }

  // Add function to remove user
  const handleRemoveUser = (email: string) => {
    setNewDiscount({
      ...newDiscount,
      allowedUsers: newDiscount.allowedUsers.filter(u => u !== email)
    })
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center h-full">
        <Loader2 className="h-8 w-8 animate-spin text-purple-500" />
      </div>
    )
  }

  return (
    <div className="space-y-6 pt-20 px-4">
      <div className="flex items-center justify-between gap-4">
        <h1 className="text-2xl font-bold">Discount Codes</h1>
        <Button
          className="bg-purple-600 hover:bg-purple-700"
          onClick={() => setShowCreateForm(true)}
        >
          <Plus className="h-4 w-4 mr-2" />
          Create Discount
        </Button>
      </div>

      {showCreateForm && (
        <Card className="border border-purple-500/30 bg-black/60 backdrop-blur-md">
          <CardHeader>
            <CardTitle>Create New Discount</CardTitle>
            <CardDescription>Create a new discount code for clients</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleCreateDiscount} className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Discount Code</label>
                <Input
                  required
                  placeholder="e.g. SUMMER2025"
                  value={newDiscount.code}
                  onChange={(e) => setNewDiscount({ ...newDiscount, code: e.target.value.toUpperCase() })}
                  className="bg-black/50 border-purple-500/30 focus:border-purple-500"
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Discount Percentage</label>
                <div className="relative">
                  <Input
                    required
                    type="number"
                    min="1"
                    max="100"
                    placeholder="Enter percentage"
                    value={newDiscount.percentage || ''}
                    onChange={(e) => setNewDiscount({ ...newDiscount, percentage: parseInt(e.target.value) })}
                    className="pr-8 bg-black/50 border-purple-500/30 focus:border-purple-500"
                  />
                  <Percent className="h-4 w-4 absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Maximum Uses</label>
                <Input
                  required
                  type="number"
                  min="1"
                  placeholder="Number of times code can be used"
                  value={newDiscount.maxUses || ''}
                  onChange={(e) => setNewDiscount({ ...newDiscount, maxUses: parseInt(e.target.value) })}
                  className="bg-black/50 border-purple-500/30 focus:border-purple-500"
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Description</label>
                <Input
                  placeholder="Description of the discount"
                  value={newDiscount.description}
                  onChange={(e) => setNewDiscount({ ...newDiscount, description: e.target.value })}
                  className="bg-black/50 border-purple-500/30 focus:border-purple-500"
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Expiry Date</label>
                <Input
                  required
                  type="date"
                  value={newDiscount.expiryDate}
                  onChange={(e) => setNewDiscount({ ...newDiscount, expiryDate: e.target.value })}
                  className="bg-black/50 border-purple-500/30 focus:border-purple-500"
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Discount Type</label>
                <div className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    id="isPublic"
                    checked={newDiscount.isPublic}
                    onChange={(e) => setNewDiscount({ ...newDiscount, isPublic: e.target.checked })}
                    className="rounded border-purple-500/30 bg-black/50"
                  />
                  <label htmlFor="isPublic" className="text-sm">Make this discount public (available to all users)</label>
                </div>
              </div>

              {!newDiscount.isPublic && (
                <div className="space-y-2">
                  <label className="text-sm font-medium">Allowed Users</label>
                  <div className="flex gap-2">
                    <div className="relative flex-1">
                      <Input
                        type="email"
                        placeholder="Enter user email"
                        value={userEmail}
                        onChange={(e) => setUserEmail(e.target.value)}
                        className="bg-black/50 border-purple-500/30 focus:border-purple-500"
                      />
                    </div>
                    <Button 
                      type="button" 
                      onClick={handleAddUser}
                      variant="outline"
                      disabled={!userEmail}
                    >
                      Add User
                    </Button>
                  </div>
                  {newDiscount.allowedUsers.length > 0 && (
                    <div className="flex flex-wrap gap-2 mt-2">
                      {newDiscount.allowedUsers.map((email) => (
                        <Badge 
                          key={email}
                          variant="secondary" 
                          className="bg-purple-500/20 text-purple-400"
                        >
                          {email}
                          <button
                            type="button"
                            className="ml-2 hover:text-purple-200"
                            onClick={() => handleRemoveUser(email)}
                          >
                            ×
                          </button>
                        </Badge>
                      ))}
                    </div>
                  )}
                </div>
              )}

              <div className="flex gap-4">
                <Button type="submit" className="bg-purple-600 hover:bg-purple-700">
                  Create Discount
                </Button>
                <Button type="button" variant="outline" onClick={() => setShowCreateForm(false)}>
                  Cancel
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}

      <Card className="border border-purple-500/30 bg-black/60 backdrop-blur-md">
        <CardHeader>
          <CardTitle>All Discounts</CardTitle>
          <CardDescription>Manage your discount codes</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {discounts.length === 0 ? (
              <div className="text-center py-8 text-gray-400">No discount codes found</div>
            ) : (
              discounts.map((discount) => (
                <div
                  key={discount.id}
                  className="border border-purple-500/20 rounded-lg p-4 bg-black/40"
                >
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className="font-medium">{discount.code}</h3>
                        <Badge className={discount.isActive ? "bg-green-500/20" : "bg-red-500/20"}>
                          {discount.isActive ? "Active" : "Inactive"}
                        </Badge>
                        <Badge className={discount.isPublic ? "bg-blue-500/20" : "bg-purple-500/20"}>
                          {discount.isPublic ? "Public" : "Restricted"}
                        </Badge>
                      </div>
                      <p className="text-sm text-gray-400 mt-1">{discount.description}</p>
                      {!discount.isPublic && discount.allowedUsers.length > 0 && (
                        <div className="flex flex-wrap gap-2 mt-2">
                          <span className="text-sm text-gray-400">Allowed users:</span>
                          {discount.allowedUsers.map((email) => (
                            <Badge key={email} variant="outline" className="text-xs">
                              {email}
                            </Badge>
                          ))}
                        </div>
                      )}
                    </div>
                    <div className="flex items-center gap-4">
                      <div className="text-sm">
                        <p>{discount.percentage}% off</p>
                        <p className="text-gray-400">{discount.currentUses}/{discount.maxUses} uses</p>
                      </div>
                      <div className="text-sm text-gray-400">
                        Expires: {new Date(discount.expiryDate).toLocaleDateString()}
                      </div>
                    </div>
                  </div>
                </div>
              )))
            }
          </div>
        </CardContent>
      </Card>
    </div>
  )
}