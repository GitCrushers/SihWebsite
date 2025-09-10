// backend/routes/telemetry.js
import express from "express";
import { fetchTelemetry } from "../services/firebaseService.js";


const router = express.Router();

router.get("/telemetry", async (req, res) => {
    const telemetry = await fetchTelemetry();
    res.json({ telemetry });
  });
export default router;
