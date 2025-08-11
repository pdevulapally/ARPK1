"use server"

import { getStripeServer } from "@/lib/stripe"
import * as admin from 'firebase-admin'
import { get3DSecureConfig } from "@/lib/3d-secure-config"

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

import { headers } from "next/headers"
import { verifyRecaptchaToken } from "@/lib/captcha"
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
    const hdrs = await headers()
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
    if (process.env.RECAPTCHA_SECRET_KEY && captchaToken) {
      const captcha = await verifyRecaptchaToken({ token: captchaToken, remoteIp: ip })
      if (!captcha.success) {
        throw new Error(`CAPTCHA verification failed: ${captcha.error || "Unknown error"}`)
      }
    }

    const baseUrl = process.env.NEXT_PUBLIC_APP_URL?.startsWith('http') 
      ? process.env.NEXT_PUBLIC_APP_URL 
      : `https://${process.env.NEXT_PUBLIC_APP_URL}`

    const threeDS = get3DSecureConfig(amount * 100, "gbp")

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
        // For Checkout Session, setup_future_usage belongs under payment_intent_data
        setup_future_usage: threeDS.payment_method_options.card.setup_future_usage,
      },
      // For Checkout Session, these belong at the top level
      payment_method_options: {
        card: {
          request_three_d_secure: threeDS.payment_method_options.card.request_three_d_secure,
        },
      },
      // Note: automatic_payment_methods is not supported on Checkout Sessions
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
    if (error instanceof Error) {
      throw new Error(`Failed to create checkout session: ${error.message}`)
    }
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

// Create a payment intent with enhanced 3D Secure support
export async function createPaymentIntent(
  projectId: string,
  amount: number,
  userEmail: string,
  paymentType: "deposit" | "final",
  captchaToken?: string,
) {
  try {
    const stripe = getStripeServer()
    const hdrs = await headers()
    const userAgent = hdrs.get("user-agent") || ""
    const ip = getClientIpFromHeaders(hdrs as unknown as Headers) || "unknown"

    if (isBlockedUserAgent(userAgent)) {
      throw new Error("Blocked user agent")
    }

    // Rate limit per IP
    const limiter = new RateLimiter({ windowSeconds: 60, maxRequests: 10, prefix: "payment_intent" })
    const rl = await limiter.check(ip)
    if (!rl.allowed) {
      throw new Error("Too many requests. Please try again later.")
    }

    // Verify CAPTCHA (if configured)
    const captcha = await verifyRecaptchaToken({ token: captchaToken, remoteIp: ip })
    if (!captcha.success) {
      console.error("CAPTCHA verification failed:", captcha.error)
      // Only throw error if CAPTCHA is actually configured
      if (process.env.RECAPTCHA_SECRET_KEY) {
        throw new Error(`CAPTCHA verification failed: ${captcha.error || "Unknown error"}`)
      } else {
        console.warn("CAPTCHA not configured, proceeding without verification")
      }
    }

    const paymentIntent = await stripe.paymentIntents.create({
      amount: amount * 100, // Convert to cents
      currency: "gbp",
      application_fee_amount: Math.floor(amount * 50),
      transfer_data: {
        destination: process.env.STRIPE_CONNECTED_ACCOUNT_ID!,
      },
      metadata: {
        projectId,
        paymentType,
        userEmail,
      },
      description: `${paymentType === "deposit" ? "Deposit" : "Final"} for project ${projectId}`,
      // Enhanced 3D Secure configuration
      ...get3DSecureConfig(amount * 100, "gbp"),
      // Customer email for receipt
      receipt_email: userEmail,
      // Return URL for 3D Secure authentication
      return_url: `${process.env.NEXT_PUBLIC_APP_URL}/payment/confirm?projectId=${projectId}`,
    })

    return {
      clientSecret: paymentIntent.client_secret,
      paymentIntentId: paymentIntent.id,
      requiresAction: paymentIntent.status === "requires_action",
      nextAction: paymentIntent.next_action,
    }
  } catch (error) {
    console.error("Error creating payment intent:", error)
    if (error instanceof Error) {
      throw new Error(`Failed to create payment intent: ${error.message}`)
    }
    throw new Error("Failed to create payment intent")
  }
}

// Confirm a payment intent after 3D Secure authentication
export async function confirmPaymentIntent(paymentIntentId: string) {
  try {
    const stripe = getStripeServer()
    
    const paymentIntent = await stripe.paymentIntents.retrieve(paymentIntentId)
    
    if (paymentIntent.status === "succeeded") {
      // Payment already succeeded, update project status
      const { projectId, paymentType } = paymentIntent.metadata
      
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
      
      return { success: true, status: "succeeded" }
    }
    
    return { success: true, status: paymentIntent.status }
  } catch (error) {
    console.error("Error confirming payment intent:", error)
    throw new Error("Failed to confirm payment intent")
  }
}
