import admin from "firebase-admin";
import path from "path";
import { fileURLToPath } from "url";

// Get __dirname in ES Modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Initialize Firebase Admin SDK
if (!admin.apps.length) {
  let serviceAccount;

  try {
    if (process.env.FIREBASE_SERVICE_ACCOUNT) {
      serviceAccount = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT);
    } else {
      console.error("❌ FIREBASE_SERVICE_ACCOUNT is missing in env vars");
    }
  } catch (e) {
    console.error("❌ Failed to parse FIREBASE_SERVICE_ACCOUNT:", e);
  }

  admin.initializeApp({
    credential: serviceAccount
      ? admin.credential.cert(serviceAccount)
      : admin.credential.applicationDefault(),
    ...(process.env.FIREBASE_DB_URL && { databaseURL: process.env.FIREBASE_DB_URL }), // only set if provided
  });
}

// ✅ Firestore (always available)
const firestore = admin.firestore();

// ✅ Realtime Database (optional, only if env var exists)
let db = null;
if (process.env.FIREBASE_DB_URL) {
  db = admin.database();
}

export { db, firestore };
