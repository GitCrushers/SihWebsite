// backend/services/syncService.js
import { initializeApp } from "firebase/app";
import { getDatabase, ref, onChildAdded } from "firebase/database";
import { getFirestore, collection, addDoc } from "firebase/firestore";

const firebaseConfig = {
    apiKey: "AIzaSyA8ZOP9vZJJT1zR90C8LrAO6mZo-5KJGmE",
    authDomain: "sunshare-78ba8.firebaseapp.com",
    databaseURL: "https://sunshare-78ba8-default-rtdb.asia-southeast1.firebasedatabase.app",
    projectId: "sunshare-78ba8",
    storageBucket: "sunshare-78ba8.firebasestorage.app",
    messagingSenderId: "590587896650",
    appId: "1:590587896650:web:d0a35bb543cc2b7fdc57b3"
  };
const app = initializeApp(firebaseConfig);

// RTDB
const rtdb = getDatabase(app);
// Firestore
const db = getFirestore(app);

export function startSync() {
  // Listen at /microgrid/data
  const telemetryRef = ref(rtdb, "microgrid/data");

  onChildAdded(telemetryRef, async (snapshot) => {
    const data = snapshot.val();
    try {
      // Push each record into Firestore under microgrid/data
      await addDoc(collection(db, "microgrid", "devices", "data"), data);

      console.log("✅ Synced to Firestore:", data.device_id || snapshot.key);
    } catch (err) {
      console.error("❌ Error syncing to Firestore:", err);
    }
  });
}
