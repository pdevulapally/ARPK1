import { doc, updateDoc, getFirestore } from "firebase/firestore"
import { getApps, initializeApp } from "firebase/app"

// Initialize Firebase if needed
const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
}

const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0]
const db = getFirestore(app)

/**
 * Sets a user's role to admin
 * This function would typically be protected by admin-only access
 */
export async function setUserAsAdmin(userId: string) {
  try {
    const userRef = doc(db, "users", userId)
    await updateDoc(userRef, {
      role: "admin",
    })
    return true
  } catch (error) {
    console.error("Error setting user as admin:", error)
    throw error
  }
}

/**
 * Removes admin role from a user
 * This function would typically be protected by admin-only access
 */
export async function removeAdminRole(userId: string) {
  try {
    const userRef = doc(db, "users", userId)
    await updateDoc(userRef, {
      role: "client",
    })
    return true
  } catch (error) {
    console.error("Error removing admin role:", error)
    throw error
  }
}
