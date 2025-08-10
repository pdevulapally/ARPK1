import * as admin from "firebase-admin"

let initializedApp: admin.app.App | null = null

export function getAdminDb() {
  if (!initializedApp) {
    const projectId = process.env.FIREBASE_PROJECT_ID
    const clientEmail = process.env.FIREBASE_CLIENT_EMAIL
    const privateKey = process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, "\n")

    if (!projectId || !clientEmail || !privateKey) {
      throw new Error("Firebase Admin environment is not configured")
    }

    initializedApp = admin.initializeApp({
      credential: admin.credential.cert({
        projectId,
        clientEmail,
        privateKey,
      }),
    })
  }

  return admin.firestore()
}