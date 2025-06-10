"use server"

import { getStripeServer } from "@/lib/stripe"
import * as admin from 'firebase-admin'

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

export async function createCheckoutSession(
  projectId: string,
  amount: number,
  userEmail: string,
  paymentType: "deposit" | "final",
) {
  try {
    const stripe = getStripeServer()
    const baseUrl = process.env.NEXT_PUBLIC_APP_URL?.startsWith('http') 
      ? process.env.NEXT_PUBLIC_APP_URL 
      : `https://${process.env.NEXT_PUBLIC_APP_URL}`

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      payment_intent_data: {
        application_fee_amount: Math.floor(amount * 50), // 50% of the amount
        transfer_data: {
          destination: process.env.STRIPE_CONNECTED_ACCOUNT_ID!, // Your friend's connected account
        },
        metadata: {
          projectId,
          paymentType,
        }
      },
      line_items: [
        {
          price_data: {
            currency: "gbp",
            product_data: {
              name: `${paymentType === "deposit" ? "Deposit" : "Final"} Payment for Project`,
              description: `Project ID: ${projectId}`,
            },
            unit_amount: amount * 100,
          },
          quantity: 1,
        },
      ],
      mode: "payment",
      success_url: `${baseUrl}/payment/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${baseUrl}/payment/cancel?projectId=${projectId}`,
      customer_email: userEmail,
      metadata: {
        projectId,
        paymentType,
      },
    })

    return { url: session.url }
  } catch (error) {
    console.error("Error creating checkout session:", error)
    throw new Error("Failed to create checkout session")
  }
}

export async function handlePaymentSuccess(sessionId: string) {
  try {
    const stripe = getStripeServer()

    // Retrieve the session to get metadata
    const session = await stripe.checkout.sessions.retrieve(sessionId)

    if (!session.metadata?.projectId || !session.metadata?.paymentType) {
      throw new Error("Missing metadata in session")
    }

    const { projectId, paymentType } = session.metadata

    // Update project payment status in Firestore using Admin SDK
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

    return { success: true }
  } catch (error) {
    console.error("Error handling payment success:", error)
    throw new Error("Failed to process payment confirmation")
  }
}
