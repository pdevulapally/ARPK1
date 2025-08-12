"use server"

import { createCheckoutSession, createPaymentIntent } from "@/lib/stripe"
import { getProject } from "@/lib/firebase-server"

export async function createCheckoutSessionAction(
  projectId: string,
  amount: number,
  discountCode?: string,
  discountPercentage?: number
) {
  try {
    const project = await getProject(projectId)
    if (!project) {
      throw new Error("Project not found")
    }

    // Generate proper URLs with fallbacks
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 
                   process.env.NEXT_PUBLIC_APP_URL || 
                   process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` :
                   (() => {
                     throw new Error('NEXT_PUBLIC_BASE_URL or NEXT_PUBLIC_APP_URL environment variable is required')
                   })()
    
    // Ensure the URL has a proper scheme
    const normalizedBaseUrl = baseUrl.startsWith('http') ? baseUrl : `https://${baseUrl}`
    
    const successUrl = `${normalizedBaseUrl}/payment/success?session_id={CHECKOUT_SESSION_ID}`
    const cancelUrl = `${normalizedBaseUrl}/dashboard/projects/${projectId}`

    const session = await createCheckoutSession({
      projectId,
      amount,
      projectName: `${project.websiteType} Website`,
      customerEmail: project.userEmail,
      discountCode,
      discountPercentage,
      successUrl,
      cancelUrl,
    })

    return { sessionId: session.id }
  } catch (error) {
    console.error("Error creating checkout session:", error)
    throw error
  }
}

export async function createPaymentIntentAction(
  projectId: string,
  amount: number,
  discountCode?: string,
  discountPercentage?: number
) {
  try {
    const project = await getProject(projectId)
    if (!project) {
      throw new Error("Project not found")
    }

    const paymentIntent = await createPaymentIntent({
      projectId,
      amount,
      projectName: `${project.websiteType} Website`,
      customerEmail: project.userEmail,
      discountCode,
      discountPercentage,
    })

    return { clientSecret: paymentIntent.client_secret }
  } catch (error) {
    console.error("Error creating payment intent:", error)
    throw error
  }
}
