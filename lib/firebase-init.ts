"use client"

import { getApp, getAuth, getDb, getStorage, getGoogleProvider } from "./firebase-client"

// This file is used to explicitly initialize Firebase services
// to ensure they're ready when needed

export function initializeFirebase() {
  if (typeof window === "undefined") return null

  try {
    // Initialize Firebase app first
    const app = getApp()
    if (!app) {
      console.error("Failed to initialize Firebase app")
      return null
    }

    // Initialize Firebase services
    const auth = getAuth()
    if (!auth) {
      console.error("Failed to initialize Firebase Auth")
    } else {
      console.log("Firebase Auth initialized successfully")
    }

    const db = getDb()
    if (!db) {
      console.error("Failed to initialize Firestore")
    }

    const storage = getStorage()
    if (!storage) {
      console.error("Failed to initialize Storage")
    }

    const googleProvider = getGoogleProvider()
    if (!googleProvider) {
      console.error("Failed to initialize Google Provider")
    }

    return {
      app,
      auth,
      db,
      storage,
      googleProvider,
    }
  } catch (error) {
    console.error("Error initializing Firebase:", error)
    return null
  }
}

// Initialize Firebase when this module is imported
if (typeof window !== "undefined") {
  const firebase = initializeFirebase()
  if (!firebase) {
    console.error("Failed to initialize Firebase")
  }
}

export default initializeFirebase
