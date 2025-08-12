import { NextRequest, NextResponse } from "next/server"
import Stripe from "stripe"
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
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2023-10-16',
})

export async function POST(request: NextRequest) {
  const body = await request.text()
  const signature = request.headers.get('stripe-signature')!

  let event: Stripe.Event

  try {
    event = stripe.webhooks.constructEvent(
      body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET!
    )
  } catch (err) {
    console.error('Webhook signature verification failed:', err)
    return NextResponse.json({ error: 'Invalid signature' }, { status: 400 })
  }

  try {
    switch (event.type) {
      case 'checkout.session.completed':
        const session = event.data.object as Stripe.Checkout.Session
        await handleCheckoutSessionCompleted(session)
        break

      case 'payment_intent.succeeded':
        const paymentIntent = event.data.object as Stripe.PaymentIntent
        await handlePaymentIntentSucceeded(paymentIntent)
        break

      default:
        console.log(`Unhandled event type: ${event.type}`)
    }

    return NextResponse.json({ received: true })
  } catch (error) {
    console.error('Webhook error:', error)
    return NextResponse.json(
      { error: 'Webhook handler failed' },
      { status: 500 }
    )
  }
}

async function handleCheckoutSessionCompleted(session: Stripe.Checkout.Session) {
  const projectId = session.metadata?.projectId
  const discountCode = session.metadata?.discountCode
  const discountPercentage = session.metadata?.discountPercentage

  if (!projectId) {
    console.error('No project ID in session metadata')
    return
  }

  const projectRef = db.collection('projects').doc(projectId)
  
  // Determine payment type based on amount or other logic
  const amount = session.amount_total || 0
  const projectDoc = await projectRef.get()
  const projectData = projectDoc.data()

  if (!projectData) {
    console.error('Project not found:', projectId)
    return
  }

  // Determine if this is deposit or final payment
  const isDeposit = !projectData.depositPaid
  const paymentType = isDeposit ? 'deposit' : 'final'

  const updateData: any = {
    updatedAt: admin.firestore.FieldValue.serverTimestamp(),
  }

  if (isDeposit) {
    updateData.depositPaid = true
    updateData.paymentStatus = 'deposit_paid'
  } else {
    updateData.finalPaid = true
    updateData.paymentStatus = 'completed'
  }

  // Store discount information if applied
  if (discountCode && discountPercentage) {
    updateData.appliedDiscount = {
      code: discountCode,
      percentage: parseInt(discountPercentage),
      appliedAt: admin.firestore.FieldValue.serverTimestamp(),
    }
  }

  await projectRef.update(updateData)
  console.log(`Payment completed for project ${projectId}: ${paymentType}`)
}

async function handlePaymentIntentSucceeded(paymentIntent: Stripe.PaymentIntent) {
  const projectId = paymentIntent.metadata?.projectId
  const discountCode = paymentIntent.metadata?.discountCode
  const discountPercentage = paymentIntent.metadata?.discountPercentage

  if (!projectId) {
    console.error('No project ID in payment intent metadata')
    return
  }

  const projectRef = db.collection('projects').doc(projectId)
  
  const projectDoc = await projectRef.get()
  const projectData = projectDoc.data()

  if (!projectData) {
    console.error('Project not found:', projectId)
    return
  }

  // Determine if this is deposit or final payment
  const isDeposit = !projectData.depositPaid
  const paymentType = isDeposit ? 'deposit' : 'final'

  const updateData: any = {
    updatedAt: admin.firestore.FieldValue.serverTimestamp(),
  }

  if (isDeposit) {
    updateData.depositPaid = true
    updateData.paymentStatus = 'deposit_paid'
  } else {
    updateData.finalPaid = true
    updateData.paymentStatus = 'completed'
  }

  // Store discount information if applied
  if (discountCode && discountPercentage) {
    updateData.appliedDiscount = {
      code: discountCode,
      percentage: parseInt(discountPercentage),
      appliedAt: admin.firestore.FieldValue.serverTimestamp(),
    }
  }

  await projectRef.update(updateData)
  console.log(`Payment intent succeeded for project ${projectId}: ${paymentType}`)
}
