"use client"

import { createContext, useContext, useEffect, useState, type ReactNode } from "react"
import { useToast } from "@/components/ui/use-toast"
import { getApp, getAuth, getGoogleProvider, getDb } from "./firebase-client"
import {
  onAuthStateChanged,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signInWithPopup,
  signOut as firebaseSignOut,
} from "firebase/auth"
import { doc, getDoc, setDoc, serverTimestamp } from "firebase/firestore"
import type { User } from "firebase/auth"
import { updateProjectAssociations } from "./firebase"

type AuthContextType = {
  user: User | null
  loading: boolean
  isAdmin: boolean
  userRole: string | null
  signIn: (email: string, password: string) => Promise<User>
  signUp: (email: string, password: string) => Promise<User>
  signInWithGoogle: () => Promise<User>
  signOut: () => Promise<void>
}

// Create a default context value
const defaultContextValue: AuthContextType = {
  user: null,
  loading: true,
  isAdmin: false,
  userRole: null,
  signIn: async () => {
    throw new Error("Auth not initialized")
  },
  signUp: async () => {
    throw new Error("Auth not initialized")
  },
  signInWithGoogle: async () => {
    throw new Error("Auth not initialized")
  },
  signOut: async () => {
    throw new Error("Auth not initialized")
  },
}

const AuthContext = createContext<AuthContextType>(defaultContextValue)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const [isAdmin, setIsAdmin] = useState(false)
  const [userRole, setUserRole] = useState<string | null>(null)
  const { toast } = useToast()

  // Function to check user role from Firestore
  const checkUserRole = async (userId: string) => {
    try {
      const db = getDb()
      if (!db) {
        console.error("Firestore not initialized")
        return "client"
      }

      const userDoc = await getDoc(doc(db, "users", userId))

      if (userDoc.exists()) {
        const userData = userDoc.data()
        const role = userData.role || "client"
        setUserRole(role)
        setIsAdmin(role === "admin")
        return role
      } else {
        // If user document doesn't exist, create it with default role
        const auth = getAuth()
        if (!auth) {
          console.error("Auth not initialized")
          return "client"
        }

        await setDoc(doc(db, "users", userId), {
          email: auth?.currentUser?.email,
          role: "client",
          createdAt: serverTimestamp(),
          lastLogin: serverTimestamp(),
        })
        setUserRole("client")
        setIsAdmin(false)
        return "client"
      }
    } catch (error) {
      console.error("Error checking user role:", error)
      setUserRole("client")
      setIsAdmin(false)
      return "client"
    }
  }

  useEffect(() => {
    // Only run auth state change listener on the client side
    if (typeof window !== "undefined") {
      const initAuth = () => {
        try {
          // Initialize Firebase app first
          const app = getApp()
          if (!app) {
            console.error("Firebase app not initialized")
            setLoading(false)
            return
          }

          // Initialize auth service
          const auth = getAuth()
          if (!auth) {
            console.error("Auth not initialized")
            setLoading(false)
            return
          }

          console.log("Firebase Auth initialized successfully:", auth)

          // Set up auth state listener
          const unsubscribe = onAuthStateChanged(
            auth,
            async (user) => {
              console.log("Auth state changed:", user ? "User logged in" : "No user")
              setUser(user)

              // Check if user is admin
              if (user) {
                await checkUserRole(user.uid)
              } else {
                setIsAdmin(false)
                setUserRole(null)
              }

              setLoading(false)
            },
            (error) => {
              console.error("Auth state change error:", error)
              setLoading(false)
            },
          )

          return () => unsubscribe()
        } catch (error) {
          console.error("Error setting up auth state listener:", error)
          setLoading(false)
        }
      }

      const unsubscribe = initAuth()
      return () => {
        if (typeof unsubscribe === "function") {
          unsubscribe()
        }
      }
    } else {
      // If we're on the server, set loading to false
      setLoading(false)
    }
  }, [])

  const signIn = async (email: string, password: string) => {
    try {
      // Ensure Firebase is initialized
      const app = getApp()
      if (!app) throw new Error("Firebase app not initialized")

      // Get auth instance
      const auth = getAuth()
      if (!auth) throw new Error("Auth not initialized")

      const userCredential = await signInWithEmailAndPassword(auth, email, password)

      // Update last login
      const db = getDb()
      if (db) {
        await setDoc(
          doc(db, "users", userCredential.user.uid),
          {
            lastLogin: serverTimestamp(),
          },
          { merge: true },
        )

        // Add this new code
        await updateProjectAssociations(userCredential.user.uid, email)
      }

      return userCredential.user
    } catch (error: any) {
      console.error("Sign in error:", error)
      toast({
        title: "Error signing in",
        description: error.message,
        variant: "destructive",
      })
      throw error
    }
  }

  const signUp = async (email: string, password: string) => {
    try {
      // Ensure Firebase is initialized
      const app = getApp()
      if (!app) throw new Error("Firebase app not initialized")

      // Get auth instance
      const auth = getAuth()
      if (!auth) throw new Error("Auth not initialized")

      const db = getDb()
      if (!db) throw new Error("Database not initialized")

      const userCredential = await createUserWithEmailAndPassword(auth, email, password)

      // Create user document in Firestore
      await setDoc(doc(db, "users", userCredential.user.uid), {
        email: userCredential.user.email,
        createdAt: serverTimestamp(),
        role: "client", // Default role
        lastLogin: serverTimestamp(),
      })

      return userCredential.user
    } catch (error: any) {
      console.error("Sign up error:", error)
      toast({
        title: "Error signing up",
        description: error.message,
        variant: "destructive",
      })
      throw error
    }
  }

  const signInWithGoogle = async () => {
    try {
      // Ensure Firebase is initialized
      const app = getApp()
      if (!app) throw new Error("Firebase app not initialized")

      // Get auth instance
      const auth = getAuth()
      if (!auth) throw new Error("Auth not initialized")

      const googleProvider = getGoogleProvider()
      if (!googleProvider) throw new Error("Google provider not initialized")

      const db = getDb()
      if (!db) throw new Error("Database not initialized")

      const result = await signInWithPopup(auth, googleProvider)

      // Check if this is a new user and create document if needed
      const userRef = doc(db, "users", result.user.uid)
      const userDoc = await getDoc(userRef)

      if (!userDoc.exists()) {
        // New user - create document
        await setDoc(userRef, {
          email: result.user.email,
          displayName: result.user.displayName,
          photoURL: result.user.photoURL,
          createdAt: serverTimestamp(),
          role: "client", // Default role
          lastLogin: serverTimestamp(),
        })
      } else {
        // Existing user - update last login
        await setDoc(
          userRef,
          {
            lastLogin: serverTimestamp(),
          },
          { merge: true },
        )
      }

      // Add this new code to associate any pending projects
      if (result.user.email) {
        await updateProjectAssociations(result.user.uid, result.user.email)
      }

      return result.user
    } catch (error: any) {
      console.error("Google sign in error:", error)
      toast({
        title: "Error signing in with Google",
        description: error.message,
        variant: "destructive",
      })
      throw error
    }
  }

  const signOut = async () => {
    try {
      // Ensure Firebase is initialized
      const app = getApp()
      if (!app) throw new Error("Firebase app not initialized")

      // Get auth instance
      const auth = getAuth()
      if (!auth) throw new Error("Auth not initialized")

      await firebaseSignOut(auth)
    } catch (error: any) {
      console.error("Sign out error:", error)
      toast({
        title: "Error signing out",
        description: error.message,
        variant: "destructive",
      })
      throw error
    }
  }

  // Create a separate contextValue object to ensure proper typing
  const contextValue: AuthContextType = {
    user,
    loading,
    isAdmin,
    userRole,
    signIn,
    signUp,
    signInWithGoogle,
    signOut,
  }

  return <AuthContext.Provider value={contextValue}>{children}</AuthContext.Provider>
}

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}
