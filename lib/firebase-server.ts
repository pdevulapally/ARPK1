import * as admin from 'firebase-admin'
import type {
  Request,
  Project,
  DiscountCode,
  UserSubscription,
  PaymentReminder,
  SubscriptionPlan,
} from "./firebase-types"

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

// Server-side Firebase functions
export async function getProject(projectId: string): Promise<Project | null> {
  try {
    const projectRef = db.collection('projects').doc(projectId)
    const projectDoc = await projectRef.get()
    
    if (!projectDoc.exists) {
      return null
    }
    
    return {
      id: projectDoc.id,
      ...projectDoc.data()
    } as Project
  } catch (error) {
    console.error('Error fetching project:', error)
    throw error
  }
}

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
