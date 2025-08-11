import { NextRequest, NextResponse } from "next/server"
import { confirmPaymentIntent } from "@/app/actions/payment"

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { paymentIntentId } = body

    if (!paymentIntentId) {
      return NextResponse.json(
        { error: "Missing payment intent ID" },
        { status: 400 }
      )
    }

    const result = await confirmPaymentIntent(paymentIntentId)

    return NextResponse.json(result)
  } catch (error: any) {
    console.error("Error confirming payment intent:", error)
    return NextResponse.json(
      { error: error.message || "Failed to confirm payment intent" },
      { status: 500 }
    )
  }
}
