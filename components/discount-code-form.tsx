"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { useToast } from "@/components/ui/use-toast"
import { Loader2, Tag, Check } from "lucide-react"
import { getDiscountCode, type DiscountCode } from "@/lib/firebase"

interface DiscountCodeFormProps {
  onApplyDiscount: (discount: DiscountCode) => void
}

export function DiscountCodeForm({ onApplyDiscount }: DiscountCodeFormProps) {
  const [code, setCode] = useState("")
  const [loading, setLoading] = useState(false)
  const [appliedDiscount, setAppliedDiscount] = useState<DiscountCode | null>(null)
  const { toast } = useToast()

  const handleApplyCode = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!code.trim()) return

    try {
      setLoading(true)
      const discountCode = await getDiscountCode(code.trim())

      if (!discountCode) {
        toast({
          title: "Invalid Code",
          description: "This discount code is invalid, expired, or has reached its usage limit.",
          variant: "destructive",
        })
        return
      }

      setAppliedDiscount(discountCode)
      onApplyDiscount(discountCode)

      toast({
        title: "Discount Applied",
        description: `${discountCode.percentage}% discount has been applied to your order.`,
      })
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to apply discount code",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="space-y-2">
      <p className="text-sm font-medium">Discount Code</p>

      {appliedDiscount ? (
        <div className="flex items-center gap-2 p-2 bg-green-900/20 border border-green-500/30 rounded-md">
          <Check className="h-4 w-4 text-green-500" />
          <span className="text-sm">
            <span className="font-medium">{appliedDiscount.code}</span> - {appliedDiscount.percentage}% discount applied
          </span>
        </div>
      ) : (
        <form onSubmit={handleApplyCode} className="flex gap-2">
          <div className="relative flex-1">
            <Tag className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Enter discount code"
              value={code}
              onChange={(e) => setCode(e.target.value)}
              className="pl-9 bg-black/50 border-purple-500/30 focus:border-purple-500"
              disabled={loading}
            />
          </div>
          <Button type="submit" disabled={loading || !code.trim()}>
            {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : "Apply"}
          </Button>
        </form>
      )}
    </div>
  )
}
