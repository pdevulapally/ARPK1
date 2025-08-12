"use server"

import { createCheckoutSession } from "@/lib/stripe"
import { getProject } from "@/lib/firebase"

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

    const session = await createCheckoutSession({
          projectId,
      amount,
      projectName: project.name,
      customerEmail: project.userEmail,
      discountCode,
      discountPercentage,
      successUrl: `${process.env.NEXT_PUBLIC_BASE_URL}/payment/success?session_id={CHECKOUT_SESSION_ID}`,
      cancelUrl: `${process.env.NEXT_PUBLIC_BASE_URL}/dashboard/projects/${projectId}`,
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
      projectName: project.name,
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
