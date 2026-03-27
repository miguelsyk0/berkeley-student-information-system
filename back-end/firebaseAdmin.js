const admin = require("firebase-admin");

// Initialize Firebase Admin SDK

try {
  if (process.env.GOOGLE_APPLICATION_CREDENTIALS) {
    admin.initializeApp();
    console.log("Firebase Admin initialized via GOOGLE_APPLICATION_CREDENTIALS.");
  } else {
    try {
      const serviceAccount = require("./service-account.json");
      // Use just the certificate; it already contains the project_id internally
      admin.initializeApp({
        credential: admin.credential.cert(serviceAccount)
      });
      console.log("Firebase Admin initialized via service-account.json.");
    } catch (e) {
      const projectId = process.env.APP_FIREBASE_PROJECT_ID || "berkeley-sis";
      if (process.env.FIREBASE_AUTH_EMULATOR_HOST) {
        admin.initializeApp({ projectId });
        console.log(`Firebase Admin initialized in EMULATOR mode (Project: ${projectId}).`);
      } else {
        console.warn("\x1b[33m%s\x1b[0m", "WARNING: Firebase Admin SDK initialized with NO credentials (fallback mode).");
        console.warn("To fix this, provide 'service-account.json' in the back-end folder.");
        admin.initializeApp({ projectId });
      }
    }
  }
} catch (error) {
  console.error("CRITICAL: Failed to initialize Firebase Admin:", error.message);
}

module.exports = admin;
