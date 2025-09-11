// backend/services/fetchTelemetry.js
import { firestore } from "./firebaseAuth.js";

export async function fetchTelemetry() {
  try {
    // Go into "microgrid" (collection) → "data" (document) → randomId collection
    const dataCollection = firestore
    .collection("microgrid")
    .doc("data")
    .collection("randomIds"); // or whatever that auto-generated collection is
  

    const snapshot = await dataCollection.get();
    const telemetryArray = [];

    snapshot.forEach((doc) => {
      telemetryArray.push({
        id: doc.id,
        ...doc.data(),
      });
    });

    console.log("Fetched telemetry:", telemetryArray.length);
    return telemetryArray;
  } catch (err) {
    console.error("Error fetching telemetry:", err);
    return [];
  }
}
