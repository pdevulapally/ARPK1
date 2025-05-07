"use client"

import { getAuth, GoogleAuthProvider } from "firebase/auth"
import { firebaseApp } from "./firebase"

// We'll initialize auth only when this module is imported
// This ensures it only happens on the client side
let _auth: ReturnType<typeof getAuth> | null = null
let _googleProvider: GoogleAuthProvider | null = null

// Lazy initialization functions
export function getFirebaseAuth() {
  if (!_auth) {
    _auth = getAuth(firebaseApp)
  }
  return _auth
}

export function getGoogleProvider() {
  if (!_googleProvider) {
    _googleProvider = new GoogleAuthProvider()
  }
  return _googleProvider
}
