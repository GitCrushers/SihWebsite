// backend/services/fetchTelemetry.js
import { firestore } from "./firebaseAuth.js";

// backend/services/fetchTelemetryRealtime.js
import admin from "firebase-admin";
db = admin.database()

export async function fetchTelemetry() {
  try {
    const snapshot = await db.ref("microgrid/data").once("value");
    const data = snapshot.val();

    if (!data) return [];

    // Convert object with random IDs into array
    return Object.entries(data).map(([id, value]) => ({
      id,
      ...value,
    }));
  } catch (err) {
    console.error("Error fetching telemetry from RTDB:", err);
    return [];
  }
}


export async function fetchLatestTelemetry() {
  try {
    const latestSnapshot = await firestore
      .collection("microgrid")
      .doc("devices")
      .collection("data")      // where your randomId docs live
      .orderBy("timestamp", "desc") // sort by latest
      .limit(1)                     // only take one
      .get();

    if (latestSnapshot.empty) {
      console.log("No telemetry data found.");
      return null;
    }

    const latestDoc = latestSnapshot.docs[0];
    const telemetry = {
      id: latestDoc.id,
      ...latestDoc.data(),
    };

    console.log("Fetched latest telemetry:", telemetry);
    return telemetry;
  } catch (err) {
    console.error("Error fetching latest telemetry:", err);
    return null;
  }
}
