import Stripe from 'stripe'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2025-03-31.basil',
})

export function getStripeServer() {
  return stripe
}

// Client-side Stripe initialization
export const getStripe = async () => {
  const { loadStripe } = await import('@stripe/stripe-js')
  return loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!)
}

export async function createCheckoutSession({
  projectId,
  amount,
  projectName,
  customerEmail,
  discountCode,
  discountPercentage,
  successUrl,
  cancelUrl,
}: {
  projectId: string
  amount: number
  projectName: string
  customerEmail: string
  discountCode?: string
  discountPercentage?: number
  successUrl: string
  cancelUrl: string
}) {
  const session = await stripe.checkout.sessions.create({
    payment_method_types: ['card'],
    line_items: [
      {
        price_data: {
          currency: 'gbp',
          product_data: {
            name: `Payment for ${projectName}`,
            description: `Project ID: ${projectId}`,
          },
          unit_amount: Math.round(amount * 100), // Convert to cents
        },
        quantity: 1,
      },
    ],
    mode: 'payment',
    success_url: successUrl,
    cancel_url: cancelUrl,
    customer_email: customerEmail,
    client_reference_id: projectId,
    metadata: {
      projectId,
      projectName,
      discountCode: discountCode || '',
      discountPercentage: discountPercentage?.toString() || '',
      originalAmount: discountCode ? (amount / (1 - (discountPercentage || 0) / 100) * 100).toString() : '',
    },
    allow_promotion_codes: false,
    billing_address_collection: 'required',
    phone_number_collection: { enabled: true },
  })

  return session
}

export async function createPaymentIntent({
  projectId,
  amount,
  projectName,
  customerEmail,
  discountCode,
  discountPercentage,
}: {
  projectId: string
  amount: number
  projectName: string
  customerEmail: string
  discountCode?: string
  discountPercentage?: number
}) {
  const paymentIntent = await stripe.paymentIntents.create({
    amount: Math.round(amount * 100), // Convert to cents
    currency: 'gbp',
    metadata: {
      projectId,
      projectName,
      discountCode: discountCode || '',
      discountPercentage: discountPercentage?.toString() || '',
      originalAmount: discountCode ? (amount / (1 - (discountPercentage || 0) / 100) * 100).toString() : '',
    },
    description: `Payment for ${projectName}`,
    receipt_email: customerEmail,
  })

  return paymentIntent
}
