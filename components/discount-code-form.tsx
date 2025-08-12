"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { useToast } from "@/components/ui/use-toast"
import { Loader2, Tag, Check, AlertCircle } from "lucide-react"
import { getDiscountCode, applyDiscountCode, type DiscountCode } from "@/lib/firebase"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"

const discountCodeSchema = z.object({
  code: z.string()
    .min(1, "Discount code is required")
    .max(20, "Discount code must be 20 characters or less")
    .regex(/^[A-Z0-9]+$/, "Discount code can only contain letters and numbers")
    .transform(val => val.toUpperCase().trim()),
})

interface DiscountCodeFormProps {
  onApplyDiscount: (discount: DiscountCode) => void
  userEmail: string
}

export function DiscountCodeForm({ onApplyDiscount, userEmail }: DiscountCodeFormProps) {
  const [loading, setLoading] = useState(false)
  const [appliedDiscount, setAppliedDiscount] = useState<DiscountCode | null>(null)
  const [error, setError] = useState<string | null>(null)
  const { toast } = useToast()

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    setValue,
  } = useForm<z.infer<typeof discountCodeSchema>>({
    resolver: zodResolver(discountCodeSchema),
  })

  const handleApplyCode = async (data: z.infer<typeof discountCodeSchema>) => {
    const { code } = data

    try {
      setLoading(true)
      setError(null)
      console.log("Applying discount code:", code, "for user:", userEmail)
      
      const discountCode = await getDiscountCode(code, userEmail)
      console.log("Discount code result:", discountCode)

      if (!discountCode) {
        setError("Invalid discount code. Please check the code and try again.")
        toast({
          title: "Invalid Code",
          description: "This discount code is invalid, expired, has reached its usage limit, or is not available for your account.",
          variant: "destructive",
        })
        return
      }

      // Check if discount is expired
      if (new Date(discountCode.expiryDate) < new Date()) {
        setError("This discount code has expired and is no longer valid.")
        toast({
          title: "Expired Code",
          description: "This discount code has expired and can no longer be used.",
          variant: "destructive",
        })
        return
      }

      // Check if discount has reached its usage limit
      if (discountCode.currentUses >= discountCode.maxUses) {
        setError("This discount code has reached its usage limit and can no longer be used.")
        toast({
          title: "Usage Limit Reached",
          description: "This discount code has been used the maximum number of times.",
          variant: "destructive",
        })
        return
      }

      // Check if discount is inactive
      if (!discountCode.isActive) {
        setError("This discount code is currently inactive and cannot be used.")
        toast({
          title: "Inactive Code",
          description: "This discount code is currently inactive and cannot be used.",
          variant: "destructive",
        })
        return
      }

      console.log("Applying discount to database...")
      // Apply the discount and increment usage counter
      await applyDiscountCode(discountCode.id)
      console.log("Discount applied to database")
      
      setAppliedDiscount(discountCode)
      onApplyDiscount(discountCode)
      setError(null)

      toast({
        title: "Discount Applied Successfully!",
        description: `${discountCode.percentage}% discount has been applied to your order.`,
      })
    } catch (error: any) {
      console.error("Error applying discount:", error)
      setError("Failed to apply discount code. Please try again.")
      toast({
        title: "Error",
        description: "Failed to apply discount code. Please try again.",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const handleRemoveDiscount = () => {
    setAppliedDiscount(null)
    setError(null)
    reset()
    onApplyDiscount(null as any)
    toast({
      title: "Discount Removed",
      description: "Discount code has been removed from your order.",
    })
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.toUpperCase().replace(/[^A-Z0-9]/g, '')
    setValue('code', value)
    setError(null)
  }

  return (
    <div className="space-y-4">
      <div>
        <h3 className="text-sm font-medium text-gray-400 mb-2">Discount Code</h3>
        <p className="text-xs text-gray-500 mb-3">Enter a valid discount code to save on your payment</p>
      </div>

      {appliedDiscount ? (
        <div className="space-y-3">
          <div className="flex items-center gap-3 p-4 bg-green-900/20 border border-green-500/30 rounded-lg">
            <div className="flex-shrink-0">
              <Check className="h-5 w-5 text-green-500" />
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-1">
                <span className="font-medium text-green-400">{appliedDiscount.code}</span>
                <span className="text-sm text-green-300">• {appliedDiscount.percentage}% off</span>
              </div>
              <p className="text-sm text-green-300">
                {appliedDiscount.description || "Discount applied successfully"}
              </p>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={handleRemoveDiscount}
              className="border-red-500/30 text-red-400 hover:bg-red-900/20"
            >
              Remove
            </Button>
          </div>
        </div>
      ) : (
        <div className="space-y-3">
          <form onSubmit={handleSubmit(handleApplyCode)} className="space-y-3">
            <div className="relative">
            <Tag className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
                placeholder="Enter discount code (e.g., WELCOME2024)"
              {...register("code")}
                onChange={handleInputChange}
                className={`pl-9 bg-black/50 border-purple-500/30 focus:border-purple-500 h-11 ${
                  errors.code || error ? 'border-red-500/50' : ''
                }`}
              disabled={loading}
                maxLength={20}
            />
          </div>

            {/* Validation Errors */}
            {errors.code && (
              <div className="flex items-center gap-2 p-3 bg-red-900/20 border border-red-500/30 rounded-lg">
                <AlertCircle className="h-4 w-4 text-red-400 flex-shrink-0" />
                <span className="text-sm text-red-400">{errors.code.message}</span>
              </div>
            )}

            {/* Application Errors */}
            {error && (
              <div className="flex items-center gap-2 p-3 bg-red-900/20 border border-red-500/30 rounded-lg">
                <AlertCircle className="h-4 w-4 text-red-400 flex-shrink-0" />
                <span className="text-sm text-red-400">{error}</span>
              </div>
            )}

            <Button 
              type="submit" 
              disabled={loading}
              className="w-full bg-purple-600 hover:bg-purple-700 h-11"
            >
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Applying...
                </>
              ) : (
                "Apply Discount"
              )}
          </Button>
        </form>

          {/* Help Text */}
          <div className="text-xs text-gray-500 space-y-1">
            <p>• Enter the discount code exactly as provided</p>
            <p>• Codes are case-insensitive and will be converted to uppercase</p>
            <p>• Only letters and numbers are allowed</p>
          </div>
        </div>
      )}
    </div>
  )
}
