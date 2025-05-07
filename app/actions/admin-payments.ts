"use server"

import { getStripeServer } from "@/lib/stripe"
import { db } from "@/lib/firebase"
import { collection, getDocs, query, orderBy, Timestamp } from "firebase/firestore"
import type { Project, PaymentReminder } from "@/lib/firebase-types"

// Fetch payments from Stripe
export async function getStripePayments() {
  try {
    const stripe = getStripeServer()

    // Get payments from the last 100 days (Stripe limits lookback periods)
    const hundredDaysAgo = Math.floor(Date.now() / 1000) - 60 * 60 * 24 * 100

    // Fetch payment intents
    const paymentIntents = await stripe.paymentIntents.list({
      limit: 100,
      created: { gte: hundredDaysAgo },
    })

    // Fetch charges for more details
    const charges = await stripe.charges.list({
      limit: 100,
      created: { gte: hundredDaysAgo },
    })

    // Combine the data
    const payments = paymentIntents.data.map((intent) => {
      const relatedCharge = charges.data.find((charge) => charge.payment_intent === intent.id)

      return {
        id: intent.id,
        amount: intent.amount / 100, // Convert from pence to pounds
        currency: intent.currency,
        status: intent.status,
        created: new Date(intent.created * 1000).toISOString(),
        customer: intent.customer,
        description: intent.description,
        metadata: intent.metadata,
        receipt_email: relatedCharge?.receipt_email || null,
        receipt_url: relatedCharge?.receipt_url || null,
        card: relatedCharge?.payment_method_details?.card
          ? {
              brand: relatedCharge.payment_method_details.card.brand,
              last4: relatedCharge.payment_method_details.card.last4,
              exp_month: relatedCharge.payment_method_details.card.exp_month,
              exp_year: relatedCharge.payment_method_details.card.exp_year,
            }
          : null,
      }
    })

    return { success: true, data: payments }
  } catch (error: any) {
    console.error("Error fetching Stripe payments:", error)
    return {
      success: false,
      error: error.message || "Failed to fetch payments from Stripe",
    }
  }
}

// Fetch projects with payment information from Firebase
export async function getProjectPayments() {
  try {
    const projectsRef = collection(db, "projects")
    const projectsQuery = query(projectsRef, orderBy("createdAt", "desc"))

    const projectsSnapshot = await getDocs(projectsQuery)
    const projects = projectsSnapshot.docs.map((doc) => {
      const data = doc.data() as Project
      return {
        projectId: doc.id,
        ...data,
        createdAt: data.createdAt instanceof Timestamp ? data.createdAt.toDate().toISOString() : data.createdAt,
      }
    })

    // Fetch payment reminders
    const remindersRef = collection(db, "paymentReminders")
    const remindersSnapshot = await getDocs(remindersRef)
    const reminders = remindersSnapshot.docs.map((doc) => {
      const data = doc.data() as PaymentReminder
      return {
        id: doc.id,
        ...data,
        createdAt: data.createdAt instanceof Timestamp ? data.createdAt.toDate().toISOString() : data.createdAt,
        sentAt: data.sentAt instanceof Timestamp ? data.sentAt.toDate().toISOString() : data.sentAt,
        paidAt: data.paidAt instanceof Timestamp ? data.paidAt.toDate().toISOString() : data.paidAt,
      }
    })

    // Combine project data with payment reminders
    const projectsWithPayments = projects.map((project) => {
      const projectReminders = reminders.filter((reminder) => reminder.projectId === project.id)

      return {
        ...project,
        paymentReminders: projectReminders,
      }
    })

    return { success: true, data: projectsWithPayments }
  } catch (error: any) {
    console.error("Error fetching project payments:", error)
    return {
      success: false,
      error: error.message || "Failed to fetch project payments",
    }
  }
}
