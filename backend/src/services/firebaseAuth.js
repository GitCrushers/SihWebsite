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
        console.error("❌ FIREBASE_SERVICE_ACCOUNT_KEY is missing in env vars");
      }
    } catch (e) {
      console.error("❌ Failed to parse FIREBASE_SERVICE_ACCOUNT_KEY:", e);
    }
    
    if (!admin.apps.length) {
      admin.initializeApp({
        credential: serviceAccount
          ? admin.credential.cert(serviceAccount)
          : admin.credential.applicationDefault(),
        databaseURL: process.env.FIREBASE_DB_URL,
      });
    }
    
}

const db = admin.database();   // Realtime Database reference
const firestore = admin.firestore(); // (optional) Firestore reference

export { db, firestore };
