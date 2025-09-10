// backend/services/fetchTelemetry.js
import { firestore } from "../firebase.js";

export async function fetchTelemetry() {
  try {
    const dataCollection = firestore
      .collection("microgrid")
      .doc("devices")
      .collection("data");

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
