// backend/routes/telemetry.js
import express from "express";
import { fetchLatestTelemetry, fetchTelemetry } from "../services/firebaseService.js";


const router = express.Router();

router.get("/telemetry", async (req, res) => {
    const telemetry = await fetchTelemetry();
    res.json({ telemetry });
  });
  router.get("/latestTelemetry", async (req, res) => {
    const telemetry = await fetchLatestTelemetry();
    res.json({ telemetry });
  });
export default router;
