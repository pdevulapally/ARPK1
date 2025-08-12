"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { getAllDiscountCodes, createDiscountCode, updateDiscountCode, deleteDiscountCode, type DiscountCode } from "@/lib/firebase"
import { Loader2, Plus, Percent, Eye, Edit, Trash2, Users, Calendar, Lock, Globe, MoreHorizontal, Tag } from "lucide-react"
import { useToast } from "@/components/ui/use-toast"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

export default function DiscountsPage() {
  const [discounts, setDiscounts] = useState<DiscountCode[]>([])
  const [loading, setLoading] = useState(true)
  const [showCreateForm, setShowCreateForm] = useState(false)
  const [editingDiscount, setEditingDiscount] = useState<DiscountCode | null>(null)
  const [selectedDiscount, setSelectedDiscount] = useState<DiscountCode | null>(null)
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
  const { toast } = useToast()

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
      toast({
        title: "Error",
        description: "Failed to fetch discount codes",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const handleCreateDiscount = async (e: React.FormEvent) => {
    e.preventDefault()
    
    // Validation
    if (!newDiscount.code.trim()) {
      toast({
        title: "Validation Error",
        description: "Discount code is required",
        variant: "destructive",
      })
      return
    }

    if (newDiscount.code.length < 3) {
      toast({
        title: "Validation Error",
        description: "Discount code must be at least 3 characters long",
        variant: "destructive",
      })
      return
    }

    if (newDiscount.code.length > 20) {
      toast({
        title: "Validation Error",
        description: "Discount code must be 20 characters or less",
        variant: "destructive",
      })
      return
    }

    if (!/^[A-Z0-9]+$/.test(newDiscount.code)) {
      toast({
        title: "Validation Error",
        description: "Discount code can only contain letters and numbers",
        variant: "destructive",
      })
      return
    }

    if (newDiscount.percentage < 1 || newDiscount.percentage > 100) {
      toast({
        title: "Validation Error",
        description: "Discount percentage must be between 1% and 100%",
        variant: "destructive",
      })
      return
    }

    if (newDiscount.maxUses < 1) {
      toast({
        title: "Validation Error",
        description: "Maximum uses must be at least 1",
        variant: "destructive",
      })
      return
    }

    if (!newDiscount.expiryDate) {
      toast({
        title: "Validation Error",
        description: "Expiry date is required",
        variant: "destructive",
      })
      return
    }

    const expiryDate = new Date(newDiscount.expiryDate)
    if (expiryDate <= new Date()) {
      toast({
        title: "Validation Error",
        description: "Expiry date must be in the future",
        variant: "destructive",
      })
      return
    }

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
      toast({
        title: "Success",
        description: "Discount code created successfully",
      })
    } catch (error) {
      console.error("Error creating discount:", error)
      toast({
        title: "Error",
        description: "Failed to create discount code",
        variant: "destructive",
      })
    }
  }

  const handleUpdateDiscount = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!editingDiscount) return

    // Validation
    if (!editingDiscount.code.trim()) {
      toast({
        title: "Validation Error",
        description: "Discount code is required",
        variant: "destructive",
      })
      return
    }

    if (editingDiscount.code.length < 3) {
      toast({
        title: "Validation Error",
        description: "Discount code must be at least 3 characters long",
        variant: "destructive",
      })
      return
    }

    if (editingDiscount.code.length > 20) {
      toast({
        title: "Validation Error",
        description: "Discount code must be 20 characters or less",
        variant: "destructive",
      })
      return
    }

    if (!/^[A-Z0-9]+$/.test(editingDiscount.code)) {
      toast({
        title: "Validation Error",
        description: "Discount code can only contain letters and numbers",
        variant: "destructive",
      })
      return
    }

    if (editingDiscount.percentage < 1 || editingDiscount.percentage > 100) {
      toast({
        title: "Validation Error",
        description: "Discount percentage must be between 1% and 100%",
        variant: "destructive",
      })
      return
    }

    if (editingDiscount.maxUses < 1) {
      toast({
        title: "Validation Error",
        description: "Maximum uses must be at least 1",
        variant: "destructive",
      })
      return
    }

    if (!editingDiscount.expiryDate) {
      toast({
        title: "Validation Error",
        description: "Expiry date is required",
        variant: "destructive",
      })
      return
    }

    const expiryDate = new Date(editingDiscount.expiryDate)
    if (expiryDate <= new Date()) {
      toast({
        title: "Validation Error",
        description: "Expiry date must be in the future",
        variant: "destructive",
      })
      return
    }

    try {
      await updateDiscountCode(editingDiscount.id, {
        code: editingDiscount.code,
        percentage: editingDiscount.percentage,
        maxUses: editingDiscount.maxUses,
        description: editingDiscount.description,
        expiryDate: editingDiscount.expiryDate,
        isActive: editingDiscount.isActive,
        isPublic: editingDiscount.isPublic,
        allowedUsers: editingDiscount.allowedUsers
      })
      setEditingDiscount(null)
      fetchDiscounts()
      toast({
        title: "Success",
        description: "Discount code updated successfully",
      })
    } catch (error) {
      console.error("Error updating discount:", error)
      toast({
        title: "Error",
        description: "Failed to update discount code",
        variant: "destructive",
      })
    }
  }

  const handleDeleteDiscount = async (discountId: string) => {
    if (!confirm("Are you sure you want to delete this discount code?")) return

    try {
      await deleteDiscountCode(discountId)
      fetchDiscounts()
      toast({
        title: "Success",
        description: "Discount code deleted successfully",
      })
    } catch (error) {
      console.error("Error deleting discount:", error)
      toast({
        title: "Error",
        description: "Failed to delete discount code",
        variant: "destructive",
      })
    }
  }

  const handleToggleStatus = async (discount: DiscountCode) => {
    try {
      await updateDiscountCode(discount.id, {
        ...discount,
        isActive: !discount.isActive
      })
      fetchDiscounts()
      toast({
        title: "Success",
        description: `Discount ${discount.isActive ? 'deactivated' : 'activated'} successfully`,
      })
    } catch (error) {
      console.error("Error toggling discount status:", error)
      toast({
        title: "Error",
        description: "Failed to update discount status",
        variant: "destructive",
      })
    }
  }

  const handleTogglePublic = async (discount: DiscountCode) => {
    try {
      await updateDiscountCode(discount.id, {
        ...discount,
        isPublic: !discount.isPublic
      })
      fetchDiscounts()
      toast({
        title: "Success",
        description: `Discount made ${discount.isPublic ? 'private' : 'public'} successfully`,
      })
    } catch (error) {
      console.error("Error toggling discount visibility:", error)
      toast({
        title: "Error",
        description: "Failed to update discount visibility",
        variant: "destructive",
      })
    }
  }

  const handleAddUser = () => {
    if (userEmail && !newDiscount.allowedUsers.includes(userEmail)) {
      setNewDiscount({
        ...newDiscount,
        allowedUsers: [...newDiscount.allowedUsers, userEmail.toLowerCase()]
      })
      setUserEmail("")
    }
  }

  const handleRemoveUser = (email: string) => {
    setNewDiscount({
      ...newDiscount,
      allowedUsers: newDiscount.allowedUsers.filter(u => u !== email)
    })
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString()
  }

  const getStatusColor = (discount: DiscountCode) => {
    if (!discount.isActive) return "bg-gray-500"
    if (new Date(discount.expiryDate) < new Date()) return "bg-red-500"
    if (discount.currentUses >= discount.maxUses) return "bg-orange-500"
    return "bg-green-500"
  }

  const getStatusText = (discount: DiscountCode) => {
    if (!discount.isActive) return "Inactive"
    if (new Date(discount.expiryDate) < new Date()) return "Expired"
    if (discount.currentUses >= discount.maxUses) return "Maxed Out"
    return "Active"
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin text-purple-500" />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h1 className="text-3xl font-bold text-white mb-2">Discount Codes</h1>
              <p className="text-gray-400">Manage all discount codes and their settings</p>
            </div>
            <Button
              className="bg-purple-600 hover:bg-purple-700 w-full sm:w-auto"
              onClick={() => setShowCreateForm(true)}
            >
              <Plus className="h-4 w-4 mr-2" />
              Create Discount
            </Button>
          </div>
        </div>

        {/* Stats Summary */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <Card className="bg-black/40 backdrop-blur-sm border-purple-500/20">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-400">Total Codes</p>
                  <p className="text-2xl font-bold text-white">{discounts.length}</p>
                </div>
                <Tag className="h-8 w-8 text-purple-400" />
              </div>
            </CardContent>
          </Card>
          
          <Card className="bg-black/40 backdrop-blur-sm border-green-500/20">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-400">Active</p>
                  <p className="text-2xl font-bold text-white">
                    {discounts.filter(d => getStatusText(d) === "Active").length}
                  </p>
                </div>
                <div className="h-8 w-8 bg-green-500/20 rounded-lg flex items-center justify-center">
                  <div className="h-3 w-3 bg-green-500 rounded-full"></div>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card className="bg-black/40 backdrop-blur-sm border-red-500/20">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-400">Expired</p>
                  <p className="text-2xl font-bold text-white">
                    {discounts.filter(d => getStatusText(d) === "Expired").length}
                  </p>
                </div>
                <div className="h-8 w-8 bg-red-500/20 rounded-lg flex items-center justify-center">
                  <div className="h-3 w-3 bg-red-500 rounded-full"></div>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card className="bg-black/40 backdrop-blur-sm border-blue-500/20">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-400">Public</p>
                  <p className="text-2xl font-bold text-white">
                    {discounts.filter(d => d.isPublic).length}
                  </p>
                </div>
                <Globe className="h-8 w-8 text-blue-400" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Discount Codes Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {discounts.map((discount) => (
            <Card key={discount.id} className="bg-black/40 backdrop-blur-sm border-purple-500/20 hover:border-purple-500/40 transition-all duration-200">
              <CardHeader className="pb-4">
                <div className="flex items-start justify-between">
                  <div className="flex-1 min-w-0">
                    <CardTitle className="text-white text-lg font-mono truncate">{discount.code}</CardTitle>
                    <CardDescription className="text-gray-400 mt-1 line-clamp-2">
                      {discount.description || "No description"}
                    </CardDescription>
                  </div>
                  <div className="flex items-center gap-2 ml-4">
                    <Badge className={`${getStatusColor(discount)} text-xs`}>
                      {getStatusText(discount)}
                    </Badge>
                    {discount.isPublic ? (
                      <Globe className="h-4 w-4 text-blue-400" />
                    ) : (
                      <Lock className="h-4 w-4 text-orange-400" />
                    )}
                  </div>
                </div>
              </CardHeader>
              
              <CardContent className="space-y-4">
                {/* Key Info */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="text-center p-3 bg-purple-500/10 rounded-lg border border-purple-500/20">
                    <p className="text-2xl font-bold text-purple-400">{discount.percentage}%</p>
                    <p className="text-xs text-gray-400">Discount</p>
                  </div>
                  <div className="text-center p-3 bg-blue-500/10 rounded-lg border border-blue-500/20">
                    <p className="text-2xl font-bold text-blue-400">{discount.currentUses}/{discount.maxUses}</p>
                    <p className="text-xs text-gray-400">Usage</p>
                  </div>
                </div>
                
                {/* Expiry Date */}
                <div className="flex items-center gap-2 text-sm">
                  <Calendar className="h-4 w-4 text-gray-400" />
                  <span className="text-gray-300">Expires:</span>
                  <span className="text-white">{formatDate(discount.expiryDate)}</span>
                </div>
                
                {/* Actions */}
                <div className="flex items-center justify-between pt-2 border-t border-gray-700/50">
                  <Button
                    variant="outline"
                    size="sm"
                    className="border-blue-500/30 text-blue-400 hover:bg-blue-900/20"
                    onClick={() => setSelectedDiscount(discount)}
                  >
                    <Eye className="h-4 w-4 mr-1" />
                    View
                  </Button>
                  
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="outline" size="sm" className="border-gray-500/30 text-gray-400 hover:bg-gray-900/20">
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="bg-black/90 backdrop-blur-md border-purple-500/30">
                      <DropdownMenuItem onClick={() => setEditingDiscount(discount)}>
                        <Edit className="h-4 w-4 mr-2" />
                        Edit
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => handleToggleStatus(discount)}>
                        {discount.isActive ? "Deactivate" : "Activate"}
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => handleTogglePublic(discount)}>
                        {discount.isPublic ? "Make Private" : "Make Public"}
                      </DropdownMenuItem>
                      <DropdownMenuItem 
                        onClick={() => handleDeleteDiscount(discount.id)}
                        className="text-red-400 focus:text-red-400"
                      >
                        <Trash2 className="h-4 w-4 mr-2" />
                        Delete
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Empty State */}
        {discounts.length === 0 && !loading && (
          <Card className="bg-black/40 backdrop-blur-sm border-purple-500/20">
            <CardContent className="p-12 text-center">
              <Tag className="h-12 w-12 text-purple-400 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-white mb-2">No Discount Codes</h3>
              <p className="text-gray-400 mb-6">Create your first discount code to get started</p>
              <Button
                className="bg-purple-600 hover:bg-purple-700"
                onClick={() => setShowCreateForm(true)}
              >
                <Plus className="h-4 w-4 mr-2" />
                Create First Discount
              </Button>
            </CardContent>
          </Card>
        )}

        {/* Create Discount Form */}
        {showCreateForm && (
          <Dialog open={showCreateForm} onOpenChange={setShowCreateForm}>
            <DialogContent className="bg-black/90 backdrop-blur-md border-purple-500/30 max-w-md">
              <DialogHeader>
                <DialogTitle className="text-white">Create New Discount</DialogTitle>
                <DialogDescription className="text-gray-400">
                  Create a new discount code for clients
                </DialogDescription>
              </DialogHeader>
              <form onSubmit={handleCreateDiscount} className="space-y-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-300">Discount Code</label>
                  <Input
                    required
                    placeholder="e.g. SUMMER2025"
                    value={newDiscount.code}
                    onChange={(e) => {
                      const value = e.target.value.toUpperCase().replace(/[^A-Z0-9]/g, '')
                      setNewDiscount({ ...newDiscount, code: value })
                    }}
                    className="bg-black/50 border-purple-500/30 focus:border-purple-500 font-mono"
                    maxLength={20}
                  />
                  <p className="text-xs text-gray-500">
                    {newDiscount.code.length}/20 characters • Letters and numbers only
                  </p>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-300">Discount Percentage</label>
                  <div className="relative">
                    <Input
                      required
                      type="number"
                      min="1"
                      max="100"
                      placeholder="Enter percentage"
                      value={newDiscount.percentage || ''}
                      onChange={(e) => {
                        const value = parseInt(e.target.value) || 0
                        if (value >= 0 && value <= 100) {
                          setNewDiscount({ ...newDiscount, percentage: value })
                        }
                      }}
                      className="pr-8 bg-black/50 border-purple-500/30 focus:border-purple-500"
                    />
                    <Percent className="h-4 w-4 absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                  </div>
                  <p className="text-xs text-gray-500">
                    Must be between 1% and 100%
                  </p>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-300">Maximum Uses</label>
                  <Input
                    required
                    type="number"
                    min="1"
                    placeholder="Enter max uses"
                    value={newDiscount.maxUses || ''}
                    onChange={(e) => {
                      const value = parseInt(e.target.value) || 0
                      if (value >= 1) {
                        setNewDiscount({ ...newDiscount, maxUses: value })
                      }
                    }}
                    className="bg-black/50 border-purple-500/30 focus:border-purple-500"
                  />
                  <p className="text-xs text-gray-500">
                    Must be at least 1
                  </p>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-300">Description</label>
                  <Input
                    placeholder="Enter description"
                    value={newDiscount.description}
                    onChange={(e) => setNewDiscount({ ...newDiscount, description: e.target.value })}
                    className="bg-black/50 border-purple-500/30 focus:border-purple-500"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-300">Expiry Date</label>
                  <Input
                    required
                    type="date"
                    value={newDiscount.expiryDate}
                    onChange={(e) => setNewDiscount({ ...newDiscount, expiryDate: e.target.value })}
                    className="bg-black/50 border-purple-500/30 focus:border-purple-500"
                  />
                </div>

                <div className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    id="isPublic"
                    checked={newDiscount.isPublic}
                    onChange={(e) => setNewDiscount({ ...newDiscount, isPublic: e.target.checked })}
                    className="rounded border-purple-500/30 bg-black/50"
                  />
                  <label htmlFor="isPublic" className="text-sm text-gray-300">
                    Public (available to everyone)
                  </label>
                </div>

                {!newDiscount.isPublic && (
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-300">Allowed Users</label>
                    <div className="flex gap-2">
                      <Input
                        placeholder="Enter user email"
                        value={userEmail}
                        onChange={(e) => setUserEmail(e.target.value)}
                        className="bg-black/50 border-purple-500/30 focus:border-purple-500"
                      />
                      <Button
                        type="button"
                        onClick={handleAddUser}
                        className="bg-purple-600 hover:bg-purple-700"
                      >
                        Add
                      </Button>
                    </div>
                    {newDiscount.allowedUsers.length > 0 && (
                      <div className="space-y-1">
                        {newDiscount.allowedUsers.map((email) => (
                          <div key={email} className="flex items-center justify-between bg-gray-800/50 p-2 rounded">
                            <span className="text-sm text-gray-300">{email}</span>
                            <Button
                              type="button"
                              variant="outline"
                              size="sm"
                              onClick={() => handleRemoveUser(email)}
                              className="border-red-500/30 text-red-400 hover:bg-red-900/20"
                            >
                              Remove
                            </Button>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                )}

                <div className="flex gap-2">
                  <Button type="submit" className="bg-purple-600 hover:bg-purple-700">
                    Create Discount
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setShowCreateForm(false)}
                    className="border-gray-500/30 text-gray-400 hover:bg-gray-900/20"
                  >
                    Cancel
                  </Button>
                </div>
              </form>
            </DialogContent>
          </Dialog>
        )}

        {/* Edit Discount Form */}
        {editingDiscount && (
          <Dialog open={!!editingDiscount} onOpenChange={() => setEditingDiscount(null)}>
            <DialogContent className="bg-black/90 backdrop-blur-md border-purple-500/30 max-w-md">
              <DialogHeader>
                <DialogTitle className="text-white">Edit Discount</DialogTitle>
                <DialogDescription className="text-gray-400">
                  Update discount code settings
                </DialogDescription>
              </DialogHeader>
              <form onSubmit={handleUpdateDiscount} className="space-y-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-300">Discount Code</label>
                  <Input
                    required
                    value={editingDiscount.code}
                    onChange={(e) => {
                      const value = e.target.value.toUpperCase().replace(/[^A-Z0-9]/g, '')
                      setEditingDiscount({ ...editingDiscount, code: value })
                    }}
                    className="bg-black/50 border-purple-500/30 focus:border-purple-500 font-mono"
                    maxLength={20}
                  />
                  <p className="text-xs text-gray-500">
                    {editingDiscount.code.length}/20 characters • Letters and numbers only
                  </p>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-300">Discount Percentage</label>
                  <div className="relative">
                    <Input
                      required
                      type="number"
                      min="1"
                      max="100"
                      value={editingDiscount.percentage}
                      onChange={(e) => {
                        const value = parseInt(e.target.value) || 0
                        if (value >= 0 && value <= 100) {
                          setEditingDiscount({ ...editingDiscount, percentage: value })
                        }
                      }}
                      className="pr-8 bg-black/50 border-purple-500/30 focus:border-purple-500"
                    />
                    <Percent className="h-4 w-4 absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                  </div>
                  <p className="text-xs text-gray-500">
                    Must be between 1% and 100%
                  </p>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-300">Maximum Uses</label>
                  <Input
                    required
                    type="number"
                    min="1"
                    value={editingDiscount.maxUses}
                    onChange={(e) => {
                      const value = parseInt(e.target.value) || 0
                      if (value >= 1) {
                        setEditingDiscount({ ...editingDiscount, maxUses: value })
                      }
                    }}
                    className="bg-black/50 border-purple-500/30 focus:border-purple-500"
                  />
                  <p className="text-xs text-gray-500">
                    Must be at least 1
                  </p>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-300">Description</label>
                  <Input
                    value={editingDiscount.description || ''}
                    onChange={(e) => setEditingDiscount({ ...editingDiscount, description: e.target.value })}
                    className="bg-black/50 border-purple-500/30 focus:border-purple-500"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-300">Expiry Date</label>
                  <Input
                    required
                    type="date"
                    value={editingDiscount.expiryDate.split('T')[0]}
                    onChange={(e) => setEditingDiscount({ ...editingDiscount, expiryDate: e.target.value })}
                    className="bg-black/50 border-purple-500/30 focus:border-purple-500"
                  />
                </div>

                <div className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    id="editIsActive"
                    checked={editingDiscount.isActive}
                    onChange={(e) => setEditingDiscount({ ...editingDiscount, isActive: e.target.checked })}
                    className="rounded border-purple-500/30 bg-black/50"
                  />
                  <label htmlFor="editIsActive" className="text-sm text-gray-300">
                    Active
                  </label>
                </div>

                <div className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    id="editIsPublic"
                    checked={editingDiscount.isPublic}
                    onChange={(e) => setEditingDiscount({ ...editingDiscount, isPublic: e.target.checked })}
                    className="rounded border-purple-500/30 bg-black/50"
                  />
                  <label htmlFor="editIsPublic" className="text-sm text-gray-300">
                    Public (available to everyone)
                  </label>
                </div>

                <div className="flex gap-2">
                  <Button type="submit" className="bg-purple-600 hover:bg-purple-700">
                    Update Discount
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setEditingDiscount(null)}
                    className="border-gray-500/30 text-gray-400 hover:bg-gray-900/20"
                  >
                    Cancel
                  </Button>
                </div>
              </form>
            </DialogContent>
          </Dialog>
        )}

        {/* View Discount Details */}
        {selectedDiscount && (
          <Dialog open={!!selectedDiscount} onOpenChange={() => setSelectedDiscount(null)}>
            <DialogContent className="bg-black/90 backdrop-blur-md border-purple-500/30 max-w-md">
              <DialogHeader>
                <DialogTitle className="text-white">Discount Details</DialogTitle>
                <DialogDescription className="text-gray-400">
                  Complete information about this discount code
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium text-gray-400">Code</label>
                    <p className="text-white font-mono">{selectedDiscount.code}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-400">Discount</label>
                    <p className="text-white">{selectedDiscount.percentage}%</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-400">Current Uses</label>
                    <p className="text-white">{selectedDiscount.currentUses}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-400">Max Uses</label>
                    <p className="text-white">{selectedDiscount.maxUses}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-400">Status</label>
                    <Badge className={getStatusColor(selectedDiscount)}>
                      {getStatusText(selectedDiscount)}
                    </Badge>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-400">Visibility</label>
                    <div className="flex items-center gap-1">
                      {selectedDiscount.isPublic ? (
                        <>
                          <Globe className="h-4 w-4 text-blue-400" />
                          <span className="text-white">Public</span>
                        </>
                      ) : (
                        <>
                          <Lock className="h-4 w-4 text-orange-400" />
                          <span className="text-white">Private</span>
                        </>
                      )}
                    </div>
                  </div>
                </div>
                
                <div>
                  <label className="text-sm font-medium text-gray-400">Description</label>
                  <p className="text-white">{selectedDiscount.description || "No description"}</p>
                </div>
                
                <div>
                  <label className="text-sm font-medium text-gray-400">Expiry Date</label>
                  <p className="text-white">{formatDate(selectedDiscount.expiryDate)}</p>
                </div>
                
                {!selectedDiscount.isPublic && selectedDiscount.allowedUsers && selectedDiscount.allowedUsers.length > 0 && (
                  <div>
                    <label className="text-sm font-medium text-gray-400">Allowed Users</label>
                    <div className="space-y-1">
                      {selectedDiscount.allowedUsers.map((email) => (
                        <div key={email} className="bg-gray-800/50 p-2 rounded">
                          <span className="text-white text-sm">{email}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
                
                <div>
                  <label className="text-sm font-medium text-gray-400">Created</label>
                  <p className="text-white">{formatDate(selectedDiscount.createdAt as string)}</p>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        )}
      </div>
    </div>
  )
}
