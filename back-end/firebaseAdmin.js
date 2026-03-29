const admin = require("firebase-admin");

// Initialize Firebase Admin SDK

try {
  if (admin.apps.length === 0) {
    const isDevelopment = process.env.NODE_ENV === "development";
    
    if (isDevelopment) {
      // Prioritize service-account.json for local development
      try {
        const serviceAccount = require("./service-account.json");
        admin.initializeApp({
          credential: admin.credential.cert(serviceAccount),
          projectId: process.env.APP_FIREBASE_PROJECT_ID
        });
        console.log("Firebase Admin initialized via service-account.json (Development).");
      } catch (err) {
        console.warn("Could not find service-account.json, falling back to default initialization.");
        admin.initializeApp();
      }
    } else if (process.env.FIREBASE_AUTH_EMULATOR_HOST) {
      // Firebase Emulator support
      admin.initializeApp({
        projectId: process.env.APP_FIREBASE_PROJECT_ID || "berkeley-sis"
      });
      console.log("Firebase Admin (Emulator) initialized.");
    } else {
      // Standard Cloud Functions initialization
      admin.initializeApp();
      console.log("Firebase Admin initialized (Production/Cloud Function).");
    }
  }
} catch (error) {
  console.error("Firebase Admin initialization error:", error.message);
}

module.exports = admin;
