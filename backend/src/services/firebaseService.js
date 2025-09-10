
import { initializeApp } from "firebase/app";
import {
  getFirestore,
  collection,
  query,
  where,
  orderBy,
  limit,
  getDocs
} from "firebase/firestore";

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
const db = getFirestore(app);

// Fetch latest telemetry by device_id
export async function getLatestTelemetry(deviceId) {
  const dataRef = collection(db, "microgrid", "data"); 
  // ⬆ points to microgrid/data subcollection

  const q = query(
    dataRef,
    where("device_id", "==", deviceId),
    orderBy("timestamp", "desc"),
    limit(1)
  );

  const snapshot = await getDocs(q);
  if (!snapshot.empty) {
    return snapshot.docs[0].data();
  }
  return null;
}
