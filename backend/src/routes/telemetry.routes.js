// backend/routes/telemetry.js
import express from "express";
import { getLatestTelemetry } from "../services/firebaseService.js";

const router = express.Router();

router.get("/:deviceId", async (req, res) => {
  try {
    const { deviceId } = req.params;
    const data = await getLatestTelemetry(deviceId);

    if (!data) {
      return res.status(404).json({ message: "No telemetry found" });
    }

    res.json(data);
  } catch (err) {
    console.error("Error fetching telemetry:", err);
    res.status(500).json({ message: "Error fetching telemetry" });
  }
});

export default router;
