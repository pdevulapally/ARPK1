import type { Timestamp } from "firebase/firestore"

export interface Request {
  id: string
  userId: string
  userEmail: string
  websiteType: string
  features: string[]
  deadline: string
  budget: string
  status: string
  createdAt: Timestamp | string
  designPreferences?: string
  additionalNotes?: string
  quotedBudget?: string
  rejectionReason?: string
  holdReason?: string
}

export interface Project {
  id: string
  requestId: string
  userId: string
  userEmail: string
  websiteType: string
  features: string[]
  deadline: string
  budget: string
  status: string
  createdAt: Timestamp | string
  completedAt?: Timestamp | string
  paymentStatus?: string
  depositPaid?: boolean
  finalPaid?: boolean
  stripeInvoiceId?: string
  stripeInvoiceUrl?: string
}

export interface User {
  id: string
  email: string
  displayName?: string
  photoURL?: string
  role: string
  createdAt: Timestamp
  lastLogin?: Timestamp
}

export interface DiscountCode {
  id: string
  code: string
  percentage: number
  maxUses: number
  currentUses: number
  expiryDate: string
  createdAt: Timestamp | string
  isActive: boolean
  description?: string
}

export interface SubscriptionPlan {
  id: string
  name: string
  description: string
  features: string[]
  monthlyPrice: number
  yearlyPrice: number
  isActive: boolean
  createdAt: Timestamp | string
}

export interface UserSubscription {
  id: string
  userId: string
  userEmail: string
  planId: string
  planName: string
  price: number
  billingCycle: "monthly" | "yearly"
  startDate: string
  endDate: string
  status: "active" | "cancelled" | "expired"
  stripeSubscriptionId?: string
  createdAt: Timestamp | string
  updatedAt: Timestamp | string
}

export interface PaymentReminder {
  id: string
  projectId: string
  userId: string
  userEmail: string
  paymentType: "deposit" | "final"
  amount: number
  dueDate: string
  status: "pending" | "sent" | "paid"
  createdAt: Timestamp | string
  sentAt?: Timestamp | string
  paidAt?: Timestamp | string
}
