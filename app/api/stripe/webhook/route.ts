import { NextResponse } from "next/server"
import { getStripeServer } from "@/lib/stripe"
import { getAdminDb } from "@/lib/firebase-admin"

export async function POST(request: Request) {
  const stripe = getStripeServer()
  const payload = await request.text()
  const sig = request.headers.get("stripe-signature") as string
  const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET

  let event
  try {
    if (!endpointSecret) {
      throw new Error("Missing STRIPE_WEBHOOK_SECRET")
    }
    event = stripe.webhooks.constructEvent(payload, sig, endpointSecret)
  } catch (err: any) {
    return new NextResponse(`Webhook Error: ${err.message}`, { status: 400 })
  }

  try {
    switch (event.type) {
      case "checkout.session.completed": {
        const session = event.data.object as any
        const projectId = session?.metadata?.projectId
        const paymentType = session?.metadata?.paymentType

        if (projectId && paymentType) {
          const db = getAdminDb()
          const projectRef = db.collection("projects").doc(projectId)
          if (paymentType === "deposit") {
            await projectRef.update({
              depositPaid: true,
              paymentStatus: "deposit_paid",
              updatedAt: new Date(),
            })
          } else if (paymentType === "final") {
            await projectRef.update({
              finalPaid: true,
              paymentStatus: "completed",
              updatedAt: new Date(),
            })
          }
        }
        break
      }
      default:
        break
    }
  } catch (err) {
    return NextResponse.json({ received: true, error: (err as any).message }, { status: 500 })
  }

  return NextResponse.json({ received: true })
}