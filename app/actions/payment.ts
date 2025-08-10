"use server"

import { getStripeServer } from "@/lib/stripe"
import { getAdminDb } from "@/lib/firebase-admin"

import { headers } from "next/headers"
import { verifyTurnstileToken } from "@/lib/captcha"
import { RateLimiter } from "@/lib/rate-limit"
import { getClientIpFromHeaders, isBlockedUserAgent } from "@/lib/security"

export async function createCheckoutSession(
  projectId: string,
  amount: number,
  userEmail: string,
  paymentType: "deposit" | "final",
  captchaToken?: string,
) {
  try {
    const stripe = getStripeServer()
    const hdrs = headers()
    const userAgent = hdrs.get("user-agent") || ""
    const ip = getClientIpFromHeaders(hdrs as unknown as Headers) || "unknown"

    if (isBlockedUserAgent(userAgent)) {
      throw new Error("Blocked user agent")
    }

    // Rate limit per IP
    const limiter = new RateLimiter({ windowSeconds: 60, maxRequests: 10, prefix: "checkout" })
    const rl = await limiter.check(ip)
    if (!rl.allowed) {
      throw new Error("Too many requests. Please try again later.")
    }

    // Verify CAPTCHA (if configured)
    const captcha = await verifyTurnstileToken({ token: captchaToken, remoteIp: ip })
    if (!captcha.success) {
      throw new Error("CAPTCHA verification failed")
    }

    const baseUrl = process.env.NEXT_PUBLIC_APP_URL?.startsWith('http') 
      ? process.env.NEXT_PUBLIC_APP_URL 
      : `https://${process.env.NEXT_PUBLIC_APP_URL}`

    const db = getAdminDb()

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      payment_intent_data: {
        application_fee_amount: Math.floor(amount * 50),
        transfer_data: {
          destination: process.env.STRIPE_CONNECTED_ACCOUNT_ID!,
        },
        metadata: {
          projectId,
          paymentType,
        },
        description: `${paymentType === "deposit" ? "Deposit" : "Final"} for project ${projectId}`,
        payment_method_options: {
          card: {
            request_three_d_secure: "any",
          },
        },
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
      client_reference_id: projectId,
      metadata: {
        projectId,
        paymentType,
      },
      allow_promotion_codes: false,
      billing_address_collection: "required",
      phone_number_collection: { enabled: true },
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

    return { success: true }
  } catch (error) {
    console.error("Error handling payment success:", error)
    throw new Error("Failed to process payment confirmation")
  }
}
