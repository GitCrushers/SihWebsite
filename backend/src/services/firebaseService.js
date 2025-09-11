// backend/services/fetchTelemetry.js
import admin from "firebase-admin";
import { db } from "./firebaseAuth.js"; 

// Fetch all telemetry data
export async function fetchTelemetry() {
  try {
    const snapshot = await db.ref("microgrid/data").once("value");
    const data = snapshot.val();

    if (!data) return [];

    return Object.entries(data).map(([id, value]) => ({
      id,
      ...value,
    }));
  } catch (err) {
    console.error("Error fetching telemetry from RTDB:", err);
    return [];
  }
}

// Fetch only the latest telemetry (based on timestamp)
export async function fetchLatestTelemetry() {
  try {
    const snapshot = await db
      .ref("microgrid/data")
      .orderByChild("timestamp")
      .limitToLast(1)
      .once("value");

    const data = snapshot.val();
    if (!data) return null;

    const [id, value] = Object.entries(data)[0];
    return { id, ...value };
  } catch (err) {
    console.error("Error fetching latest telemetry from RTDB:", err);
    return null;
  }
}
