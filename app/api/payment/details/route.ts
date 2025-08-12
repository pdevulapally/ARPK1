import { NextRequest, NextResponse } from 'next/server'
import Stripe from 'stripe'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2025-03-31.basil',
})

export async function POST(request: NextRequest) {
  try {
    const { sessionId, paymentIntentId } = await request.json()

    let paymentDetails: any = null

    if (sessionId) {
      // Fetch checkout session details
      const session = await stripe.checkout.sessions.retrieve(sessionId)
      paymentDetails = {
        id: session.payment_intent as string,
        amount: session.amount_total || 0,
        currency: session.currency || 'gbp',
        status: session.payment_status || 'unknown',
        created: session.created,
        customer_email: session.customer_details?.email || '',
        project_id: session.metadata?.projectId || '',
        project_name: session.metadata?.projectName || '',
        discount_code: session.metadata?.discountCode || undefined,
        discount_percentage: session.metadata?.discountPercentage ? parseInt(session.metadata.discountPercentage) : undefined,
        original_amount: session.metadata?.originalAmount ? parseInt(session.metadata.originalAmount) : undefined,
      }
    } else if (paymentIntentId) {
      // Fetch payment intent details
      const paymentIntent = await stripe.paymentIntents.retrieve(paymentIntentId)
      paymentDetails = {
        id: paymentIntent.id,
        amount: paymentIntent.amount,
        currency: paymentIntent.currency,
        status: paymentIntent.status,
        created: paymentIntent.created,
        customer_email: paymentIntent.receipt_email || '',
        project_id: paymentIntent.metadata?.projectId || '',
        project_name: paymentIntent.metadata?.projectName || '',
        discount_code: paymentIntent.metadata?.discountCode || undefined,
        discount_percentage: paymentIntent.metadata?.discountPercentage ? parseInt(paymentIntent.metadata.discountPercentage) : undefined,
        original_amount: paymentIntent.metadata?.originalAmount ? parseInt(paymentIntent.metadata.originalAmount) : undefined,
      }
    }

    if (!paymentDetails) {
      return NextResponse.json(
        { error: 'Payment details not found' },
        { status: 404 }
      )
    }

    return NextResponse.json(paymentDetails)
  } catch (error) {
    console.error('Error fetching payment details:', error)
    return NextResponse.json(
      { error: 'Failed to fetch payment details' },
      { status: 500 }
    )
  }
}
