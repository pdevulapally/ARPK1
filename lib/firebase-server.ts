// This file provides placeholder functions for server components
// These functions will be replaced by the client-side implementations at runtime

import type {
  Request,
  Project,
  DiscountCode,
  UserSubscription,
  PaymentReminder,
  SubscriptionPlan,
} from "./firebase-types"

// Placeholder functions that will be replaced by client-side implementations
export async function createRequest(): Promise<string> {
  console.error("Firebase functions should not be called on the server")
  return ""
}

export async function getUserRequests(): Promise<Request[]> {
  console.error("Firebase functions should not be called on the server")
  return []
}

export async function getAllRequests(): Promise<Request[]> {
  console.error("Firebase functions should not be called on the server")
  return []
}

export async function updateRequestStatus(): Promise<boolean> {
  console.error("Firebase functions should not be called on the server")
  return false
}

export async function createProject(): Promise<string> {
  console.error("Firebase functions should not be called on the server")
  return ""
}

export async function getUserProjects(): Promise<Project[]> {
  console.error("Firebase functions should not be called on the server")
  return []
}

export async function getAllProjects(): Promise<Project[]> {
  console.error("Firebase functions should not be called on the server")
  return []
}

export async function updateProjectStatus(): Promise<boolean> {
  console.error("Firebase functions should not be called on the server")
  return false
}

export async function createPaymentReminder(): Promise<string> {
  console.error("Firebase functions should not be called on the server")
  return ""
}

export async function updatePaymentReminderStatus(): Promise<boolean> {
  console.error("Firebase functions should not be called on the server")
  return false
}

export async function getProjectPaymentReminders(): Promise<PaymentReminder[]> {
  console.error("Firebase functions should not be called on the server")
  return []
}

export async function getUserPaymentReminders(): Promise<PaymentReminder[]> {
  console.error("Firebase functions should not be called on the server")
  return []
}

export async function getDiscountCode(): Promise<DiscountCode | null> {
  console.error("Firebase functions should not be called on the server")
  return null
}

export async function applyDiscountCode(): Promise<boolean> {
  console.error("Firebase functions should not be called on the server")
  return false
}

export async function createDiscountCode(): Promise<string> {
  console.error("Firebase functions should not be called on the server")
  return ""
}

export async function getAllDiscountCodes(): Promise<DiscountCode[]> {
  console.error("Firebase functions should not be called on the server")
  return []
}

export async function getAllSubscriptionPlans(): Promise<SubscriptionPlan[]> {
  console.error("Firebase functions should not be called on the server")
  return []
}

export async function getUserSubscriptions(): Promise<UserSubscription[]> {
  console.error("Firebase functions should not be called on the server")
  return []
}

export async function createUserSubscription(): Promise<string> {
  console.error("Firebase functions should not be called on the server")
  return ""
}

// Export null values for Firebase services
export const db = null
export const auth = null
export const storage = null
export const googleProvider = null
