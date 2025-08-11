import { NextRequest, NextResponse } from "next/server"
import { createPaymentIntent } from "@/app/actions/payment"

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { projectId, amount, userEmail, paymentType, captchaToken } = body

    if (!projectId || !amount || !userEmail || !paymentType) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      )
    }

    const result = await createPaymentIntent(
      projectId,
      amount,
      userEmail,
      paymentType,
      captchaToken
    )

    return NextResponse.json(result)
  } catch (error: any) {
    console.error("Error creating payment intent:", error)
    return NextResponse.json(
      { error: error.message || "Failed to create payment intent" },
      { status: 500 }
    )
  }
}
