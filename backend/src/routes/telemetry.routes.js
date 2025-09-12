// backend/routes/telemetry.js
import express from "express";
import { fetchLatestTelemetry, fetchTelemetry } from "../services/firebaseService.js";
import { getLatestTelemetry, getTelemetry,  saveTelemetry } from "../controllers/microgrid.controller.js";


const router = express.Router();

router.get("/telemetry", async (req, res) => {
    const telemetry = await fetchTelemetry();
    res.json({ telemetry });
  });
  router.get("/latestTelemetry", async (req, res) => {
    const telemetry = await fetchLatestTelemetry();
    res.json({ telemetry });
  });
  router.post("/data", saveTelemetry);
 
router.get("/data", getTelemetry);       
router.get("/data/latest", getLatestTelemetry); 
export default router;
