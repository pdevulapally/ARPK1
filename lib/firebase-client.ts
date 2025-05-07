"use client"

import { initializeApp, getApps, type FirebaseApp } from "firebase/app"
import { getAuth as getFirebaseAuth, GoogleAuthProvider, type Auth } from "firebase/auth"
import { getFirestore, type Firestore } from "firebase/firestore"
import { getStorage as getFirebaseStorage, type FirebaseStorage } from "firebase/storage"
import type {
  Request,
  Project,
  DiscountCode,
  UserSubscription,
  PaymentReminder,
  SubscriptionPlan,
} from "./firebase-types"

// Firebase configuration
const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
}

// Initialize Firebase only on the client side
let app: FirebaseApp | null = null
let auth: Auth | null = null
let db: Firestore | null = null
let storage: FirebaseStorage | null = null
let googleProvider: GoogleAuthProvider | null = null

// Initialize Firebase app
export function getApp() {
  if (typeof window === "undefined") return null

  if (!app) {
    try {
      if (!getApps().length) {
        app = initializeApp(firebaseConfig)
      } else {
        app = getApps()[0]
      }
    } catch (error) {
      console.error("Error initializing Firebase app:", error)
    }
  }

  return app
}

// Initialize Firebase Auth - synchronous version
export function getAuth() {
  if (typeof window === "undefined") return null

  if (!auth) {
    const firebaseApp = getApp()
    if (!firebaseApp) return null

    try {
      // Use synchronous import since we're importing at the top level now
      auth = getFirebaseAuth(firebaseApp)
    } catch (error) {
      console.error("Error initializing Firebase Auth:", error)
    }
  }

  return auth
}

// Initialize Firestore - synchronous version
export function getDb() {
  if (typeof window === "undefined") return null

  if (!db) {
    const firebaseApp = getApp()
    if (!firebaseApp) return null

    try {
      // Use synchronous import since we're importing at the top level now
      db = getFirestore(firebaseApp)
    } catch (error) {
      console.error("Error initializing Firestore:", error)
    }
  }

  return db
}

// Initialize Storage - synchronous version
export function getStorage() {
  if (typeof window === "undefined") return null

  if (!storage) {
    const firebaseApp = getApp()
    if (!firebaseApp) return null

    try {
      // Use synchronous import since we're importing at the top level now
      storage = getFirebaseStorage(firebaseApp)
    } catch (error) {
      console.error("Error initializing Firebase Storage:", error)
    }
  }

  return storage
}

// Initialize Google Provider - synchronous version
export function getGoogleProvider() {
  if (typeof window === "undefined") return null

  if (!googleProvider) {
    try {
      googleProvider = new GoogleAuthProvider()
    } catch (error) {
      console.error("Error initializing Google Provider:", error)
    }
  }

  return googleProvider
}

// Initialize Firebase services on module load
if (typeof window !== "undefined") {
  // Initialize Firebase app first
  const firebaseApp = getApp()

  // Then initialize services
  if (firebaseApp) {
    // Pre-initialize auth to ensure it's ready when needed
    const authInstance = getAuth()
    if (!authInstance) {
      console.error("Failed to pre-initialize auth")
    }

    // Pre-initialize other services
    const dbInstance = getDb()
    if (!dbInstance) {
      console.error("Failed to pre-initialize Firestore")
    }

    const storageInstance = getStorage()
    if (!storageInstance) {
      console.error("Failed to pre-initialize Storage")
    }

    const googleProviderInstance = getGoogleProvider()
    if (!googleProviderInstance) {
      console.error("Failed to pre-initialize Google Provider")
    }
  }
}

// Request functions
export async function createRequest(requestData: Omit<Request, "id" | "createdAt">) {
  try {
    const database = getDb()
    if (!database) throw new Error("Firestore not initialized")

    // Dynamically import to avoid SSR issues
    const { collection, addDoc, serverTimestamp } = await import("firebase/firestore")

    const docRef = await addDoc(collection(database, "requests"), {
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
    const database = getDb()
    if (!database) throw new Error("Firestore not initialized")

    // Dynamically import to avoid SSR issues
    const { collection, query, where, orderBy, getDocs } = await import("firebase/firestore")

    const q = query(collection(database, "requests"), where("userId", "==", userId), orderBy("createdAt", "desc"))
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
    const database = getDb()
    if (!database) throw new Error("Firestore not initialized")

    // Dynamically import to avoid SSR issues
    const { collection, query, orderBy, getDocs } = await import("firebase/firestore")

    const q = query(collection(database, "requests"), orderBy("createdAt", "desc"))
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
    const database = getDb()
    if (!database) throw new Error("Firestore not initialized")

    // Dynamically import to avoid SSR issues
    const { doc, updateDoc, serverTimestamp } = await import("firebase/firestore")

    const requestRef = doc(database, "requests", requestId)
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
    const database = getDb()
    if (!database) throw new Error("Firestore not initialized")

    // Dynamically import to avoid SSR issues
    const { collection, addDoc, serverTimestamp } = await import("firebase/firestore")

    const docRef = await addDoc(collection(database, "projects"), {
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
    const database = getDb()
    if (!database) throw new Error("Firestore not initialized")

    // Dynamically import to avoid SSR issues
    const { collection, query, where, orderBy, getDocs } = await import("firebase/firestore")

    const q = query(collection(database, "projects"), where("userId", "==", userId), orderBy("createdAt", "desc"))
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
    const database = getDb()
    if (!database) throw new Error("Firestore not initialized")

    // Dynamically import to avoid SSR issues
    const { collection, query, orderBy, getDocs } = await import("firebase/firestore")

    const q = query(collection(database, "projects"), orderBy("createdAt", "desc"))
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
    const database = getDb()
    if (!database) throw new Error("Firestore not initialized")

    // Dynamically import to avoid SSR issues
    const { doc, updateDoc, serverTimestamp } = await import("firebase/firestore")

    const projectRef = doc(database, "projects", projectId)
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
    const database = getDb()
    if (!database) throw new Error("Firestore not initialized")

    // Dynamically import to avoid SSR issues
    const { collection, addDoc, serverTimestamp } = await import("firebase/firestore")

    const docRef = await addDoc(collection(database, "paymentReminders"), {
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
    const database = getDb()
    if (!database) throw new Error("Firestore not initialized")

    // Dynamically import to avoid SSR issues
    const { doc, updateDoc, serverTimestamp } = await import("firebase/firestore")

    const reminderRef = doc(database, "paymentReminders", reminderId)
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
    const database = getDb()
    if (!database) throw new Error("Firestore not initialized")

    // Dynamically import to avoid SSR issues
    const { collection, query, where, orderBy, getDocs } = await import("firebase/firestore")

    const q = query(
      collection(database, "paymentReminders"),
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
    const database = getDb()
    if (!database) throw new Error("Firestore not initialized")

    // Dynamically import to avoid SSR issues
    const { collection, query, where, orderBy, getDocs } = await import("firebase/firestore")

    const q = query(
      collection(database, "paymentReminders"),
      where("userId", "==", userId),
      orderBy("createdAt", "desc"),
    )
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
    const database = getDb()
    if (!database) throw new Error("Firestore not initialized")

    // Dynamically import to avoid SSR issues
    const { collection, query, where, limit, getDocs } = await import("firebase/firestore")

    const q = query(
      collection(database, "discountCodes"),
      where("code", "==", code),
      where("isActive", "==", true),
      limit(1),
    )
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
    const database = getDb()
    if (!database) throw new Error("Firestore not initialized")

    // Dynamically import to avoid SSR issues
    const { doc, updateDoc, increment } = await import("firebase/firestore")

    const discountRef = doc(database, "discountCodes", discountId)
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
    const database = getDb()
    if (!database) throw new Error("Firestore not initialized")

    // Dynamically import to avoid SSR issues
    const { collection, addDoc, serverTimestamp } = await import("firebase/firestore")

    const docRef = await addDoc(collection(database, "discountCodes"), {
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
    const database = getDb()
    if (!database) throw new Error("Firestore not initialized")

    // Dynamically import to avoid SSR issues
    const { collection, query, orderBy, getDocs } = await import("firebase/firestore")

    const q = query(collection(database, "discountCodes"), orderBy("createdAt", "desc"))
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
    const database = getDb()
    if (!database) throw new Error("Firestore not initialized")

    // Dynamically import to avoid SSR issues
    const { collection, query, where, orderBy, getDocs } = await import("firebase/firestore")

    const q = query(
      collection(database, "subscriptionPlans"),
      where("isActive", "==", true),
      orderBy("monthlyPrice", "asc"),
    )
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
    const database = getDb()
    if (!database) throw new Error("Firestore not initialized")

    // Dynamically import to avoid SSR issues
    const { collection, query, where, orderBy, getDocs } = await import("firebase/firestore")

    const q = query(
      collection(database, "userSubscriptions"),
      where("userId", "==", userId),
      orderBy("createdAt", "desc"),
    )
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
    const database = getDb()
    if (!database) throw new Error("Firestore not initialized")

    // Dynamically import to avoid SSR issues
    const { collection, addDoc, serverTimestamp } = await import("firebase/firestore")

    const docRef = await addDoc(collection(database, "userSubscriptions"), {
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
