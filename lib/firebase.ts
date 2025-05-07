import { initializeApp, getApps, getApp } from "firebase/app"
import {
  collection,
  query,
  where,
  getDocs,
  orderBy,
  doc,
  updateDoc,
  serverTimestamp,
  type Timestamp,
  addDoc,
  limit,
  increment,
  getFirestore,
} from "firebase/firestore"

// Firebase configuration
const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
}

// Initialize Firebase app (but not services yet)
export const getFirebaseApp = () => {
  return getApps().length === 0 ? initializeApp(firebaseConfig) : getApp()
}

// Initialize Firebase
export const firebaseApp = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp()

// Initialize Firestore
export const db = getFirestore(firebaseApp)

// This file exports the correct Firebase implementation based on the environment
export * from "./firebase-types"

// Re-export the client-side implementation
export * from "./firebase-client"

// Re-export types
// Export a dummy function to prevent tree-shaking
export function __dummy() {}

// Types
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

// Request functions
export async function createRequest(requestData: Omit<Request, "id" | "createdAt">) {
  try {
    const docRef = await addDoc(collection(db, "requests"), {
      ...requestData,
      createdAt: serverTimestamp(),
    })
    return docRef.id
  } catch (error) {
    console.error("Error creating request:", error)
    throw error
  }
}

export async function getUserRequests(userId: string) {
  try {
    const q = query(collection(db, "requests"), where("userId", "==", userId), orderBy("createdAt", "desc"))
    const querySnapshot = await getDocs(q)
    return querySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    })) as Request[]
  } catch (error) {
    console.error("Error getting user requests:", error)
    throw error
  }
}

export async function getAllRequests() {
  try {
    const q = query(collection(db, "requests"), orderBy("createdAt", "desc"))
    const querySnapshot = await getDocs(q)
    return querySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    })) as Request[]
  } catch (error) {
    console.error("Error getting all requests:", error)
    throw error
  }
}

export async function updateRequestStatus(requestId: string, status: string, additionalData: Record<string, any> = {}) {
  try {
    const requestRef = doc(db, "requests", requestId)
    await updateDoc(requestRef, {
      status,
      ...additionalData,
      updatedAt: serverTimestamp(),
    })
    return true
  } catch (error) {
    console.error("Error updating request status:", error)
    throw error
  }
}

// Project functions
export async function createProject(projectData: Omit<Project, "id" | "createdAt">) {
  try {
    const docRef = await addDoc(collection(db, "projects"), {
      ...projectData,
      createdAt: serverTimestamp(),
      paymentStatus: "awaiting_deposit",
      depositPaid: false,
      finalPaid: false,
    })
    return docRef.id
  } catch (error) {
    console.error("Error creating project:", error)
    throw error
  }
}

export async function getUserProjects(userId: string) {
  try {
    const q = query(collection(db, "projects"), where("userId", "==", userId), orderBy("createdAt", "desc"))
    const querySnapshot = await getDocs(q)
    return querySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    })) as Project[]
  } catch (error) {
    console.error("Error getting user projects:", error)
    throw error
  }
}

export async function getAllProjects() {
  try {
    const q = query(collection(db, "projects"), orderBy("createdAt", "desc"))
    const querySnapshot = await getDocs(q)
    return querySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    })) as Project[]
  } catch (error) {
    console.error("Error getting all projects:", error)
    throw error
  }
}

export async function updateProjectStatus(projectId: string, status: string, additionalData: Record<string, any> = {}) {
  try {
    const projectRef = doc(db, "projects", projectId)
    await updateDoc(projectRef, {
      status,
      ...additionalData,
      updatedAt: serverTimestamp(),
    })
    return true
  } catch (error) {
    console.error("Error updating project status:", error)
    throw error
  }
}

// Payment Reminder functions
export async function createPaymentReminder(reminderData: Omit<PaymentReminder, "id" | "createdAt" | "status">) {
  try {
    const docRef = await addDoc(collection(db, "paymentReminders"), {
      ...reminderData,
      status: "pending",
      createdAt: serverTimestamp(),
    })
    return docRef.id
  } catch (error) {
    console.error("Error creating payment reminder:", error)
    throw error
  }
}

export async function updatePaymentReminderStatus(
  reminderId: string,
  status: "pending" | "sent" | "paid",
  additionalData: Record<string, any> = {},
) {
  try {
    const reminderRef = doc(db, "paymentReminders", reminderId)
    await updateDoc(reminderRef, {
      status,
      ...additionalData,
      updatedAt: serverTimestamp(),
    })
    return true
  } catch (error) {
    console.error("Error updating payment reminder status:", error)
    throw error
  }
}

export async function getProjectPaymentReminders(projectId: string) {
  try {
    const q = query(
      collection(db, "paymentReminders"),
      where("projectId", "==", projectId),
      orderBy("createdAt", "desc"),
    )
    const querySnapshot = await getDocs(q)
    return querySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    })) as PaymentReminder[]
  } catch (error) {
    console.error("Error getting project payment reminders:", error)
    throw error
  }
}

export async function getUserPaymentReminders(userId: string) {
  try {
    const q = query(collection(db, "paymentReminders"), where("userId", "==", userId), orderBy("createdAt", "desc"))
    const querySnapshot = await getDocs(q)
    return querySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    })) as PaymentReminder[]
  } catch (error) {
    console.error("Error getting user payment reminders:", error)
    throw error
  }
}

export async function getDiscountCode(code: string) {
  try {
    const q = query(collection(db, "discountCodes"), where("code", "==", code), where("isActive", "==", true), limit(1))
    const querySnapshot = await getDocs(q)

    if (querySnapshot.empty) {
      return null
    }

    const discountDoc = querySnapshot.docs[0]
    const discountData = discountDoc.data() as DiscountCode

    // Check if code has expired
    if (new Date(discountData.expiryDate) < new Date()) {
      return null
    }

    // Check if code has reached max uses
    if (discountData.currentUses >= discountData.maxUses) {
      return null
    }

    return {
      docId: discountDoc.id,
      ...discountData,
    } as DiscountCode
  } catch (error) {
    console.error("Error getting discount code:", error)
    throw error
  }
}

export async function applyDiscountCode(discountId: string) {
  try {
    const discountRef = doc(db, "discountCodes", discountId)
    await updateDoc(discountRef, {
      currentUses: increment(1),
    })
    return true
  } catch (error) {
    console.error("Error applying discount code:", error)
    throw error
  }
}

export async function createDiscountCode(discountData: Omit<DiscountCode, "id" | "createdAt" | "currentUses">) {
  try {
    const docRef = await addDoc(collection(db, "discountCodes"), {
      ...discountData,
      currentUses: 0,
      createdAt: serverTimestamp(),
    })
    return docRef.id
  } catch (error) {
    console.error("Error creating discount code:", error)
    throw error
  }
}

export async function getAllDiscountCodes() {
  try {
    const q = query(collection(db, "discountCodes"), orderBy("createdAt", "desc"))
    const querySnapshot = await getDocs(q)
    return querySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    })) as DiscountCode[]
  } catch (error) {
    console.error("Error getting all discount codes:", error)
    throw error
  }
}

export async function getAllSubscriptionPlans() {
  try {
    const q = query(collection(db, "subscriptionPlans"), where("isActive", "==", true), orderBy("monthlyPrice", "asc"))
    const querySnapshot = await getDocs(q)
    return querySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    })) as SubscriptionPlan[]
  } catch (error) {
    console.error("Error getting subscription plans:", error)
    throw error
  }
}

export async function getUserSubscriptions(userId: string) {
  try {
    const q = query(collection(db, "userSubscriptions"), where("userId", "==", userId), orderBy("createdAt", "desc"))
    const querySnapshot = await getDocs(q)
    return querySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    })) as UserSubscription[]
  } catch (error) {
    console.error("Error getting user subscriptions:", error)
    throw error
  }
}

export async function createUserSubscription(
  subscriptionData: Omit<UserSubscription, "id" | "createdAt" | "updatedAt">,
) {
  try {
    const docRef = await addDoc(collection(db, "userSubscriptions"), {
      ...subscriptionData,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    })
    return docRef.id
  } catch (error) {
    console.error("Error creating user subscription:", error)
    throw error
  }
}
