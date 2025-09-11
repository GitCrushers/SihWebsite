import admin from "firebase-admin";
import path from "path";
import { fileURLToPath } from "url";

// Get __dirname in ES Modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Initialize Firebase Admin SDK
if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert(
      JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT_KEY) // safer for Render
    ),
    databaseURL: process.env.FIREBASE_DB_URL, // e.g. https://your-app.firebaseio.com
  });
}

const db = admin.database();   // Realtime Database reference
const firestore = admin.firestore(); // (optional) Firestore reference

export { db, firestore };
