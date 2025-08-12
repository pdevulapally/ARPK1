import { NextResponse } from "next/server"
import { createDiscountCode } from "@/lib/firebase"

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { code, percentage, maxUses, description, isPublic = true } = body

    // Validate required fields
    if (!code || !percentage || !maxUses) {
      return NextResponse.json(
        { error: "Missing required fields: code, percentage, maxUses" },
        { status: 400 }
      )
    }

    // Create the discount code
    const discountData = {
      code: code.toUpperCase(),
      percentage: parseInt(percentage),
      maxUses: parseInt(maxUses),
      description: description || `Discount code: ${code}`,
      expiryDate: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString(), // 1 year from now
      isActive: true,
      isPublic: isPublic,
      allowedUsers: []
    }

    const discountId = await createDiscountCode(discountData)
    
    return NextResponse.json({ 
      success: true, 
      discountId,
      discount: discountData,
      message: `Discount code '${code}' created successfully with ${percentage}% discount`
    })
  } catch (error: any) {
    console.error("Error creating discount:", error)
    return NextResponse.json(
      { error: error.message },
      { status: 500 }
    )
  }
}
