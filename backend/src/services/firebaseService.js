// backend/services/fetchTelemetry.js
import { firestore } from "./firebaseAuth.js";

export async function fetchTelemetry() {
  try {
    // Go into "microgrid" (collection) → "data" (document) → randomId collection
    const dataCollection = firestore
      .collection("microgrid")
      .doc("devices")          // this is a document
      .collection("data");  // the actual randomId collection name

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
