import { NextResponse } from "next/server"
import { getStripeServer } from "@/lib/stripe"
import * as admin from "firebase-admin"

// Initialize Firebase Admin if not already initialized
if (admin.apps.length === 0) {
  admin.initializeApp({
    credential: admin.credential.cert({
      projectId: process.env.FIREBASE_PROJECT_ID,
      clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
      privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
    }),
  })
}

const db = admin.firestore()

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
      
      // Handle payment intent events for 3D Secure
      case "payment_intent.succeeded": {
        const paymentIntent = event.data.object as any
        const projectId = paymentIntent?.metadata?.projectId
        const paymentType = paymentIntent?.metadata?.paymentType

        if (projectId && paymentType) {
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
      
      case "payment_intent.payment_failed": {
        const paymentIntent = event.data.object as any
        console.log("Payment failed:", paymentIntent.id, paymentIntent.last_payment_error)
        break
      }
      
      case "payment_intent.requires_action": {
        const paymentIntent = event.data.object as any
        console.log("Payment requires action (3D Secure):", paymentIntent.id)
        break
      }
      
      case "payment_intent.canceled": {
        const paymentIntent = event.data.object as any
        console.log("Payment canceled:", paymentIntent.id)
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
