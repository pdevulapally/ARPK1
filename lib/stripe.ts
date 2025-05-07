import { loadStripe } from "@stripe/stripe-js"
import { Stripe } from "stripe"

// Initialize Stripe on the client side
export const getStripe = async () => {
  const stripePublicKey = process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY as string

  if (!stripePublicKey) {
    throw new Error("Stripe publishable key is not set")
  }

  const stripePromise = loadStripe(stripePublicKey)
  return stripePromise
}

// Initialize Stripe on the server side
let stripeInstance: Stripe | null = null

export const getStripeServer = () => {
  if (!stripeInstance) {
    const stripeSecretKey = process.env.STRIPE_SECRET_KEY

    if (!stripeSecretKey) {
      throw new Error("Stripe secret key is not set")
    }

    stripeInstance = new Stripe(stripeSecretKey, {
      apiVersion: "2025-03-31.basil",
    })
  }

  return stripeInstance
}
