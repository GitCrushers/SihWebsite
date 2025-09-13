import express from "express";
import twilio from "twilio";
import dotenv from "dotenv";
import MicrogridData from "../models/microgrid.schema.js";

dotenv.config();

const router = express.Router();
const client = twilio(
  process.env.TWILIO_ACCOUNT_SID,
  process.env.TWILIO_AUTH_TOKEN
);
const fromNumber = process.env.TWILIO_PHONE_NUMBER;
router.post("/send-alert-batch", async (req, res) => {
  try {
    const { to, device_id, messages } = req.body;

    if (!to || !device_id || !Array.isArray(messages) || messages.length === 0) {
      return res.status(400).json({ error: "Missing required fields or empty messages" });
    }

    // Find or create device in DB
    let microgrid = await MicrogridData.findOne({ device_id });
    if (!microgrid) microgrid = new MicrogridData({ device_id, alerts: [] });

    const now = new Date();
    const sentResults = [];

    for (let msgText of messages) {
      // Check recent duplicate (within 5 minutes)
      const recentDuplicate = microgrid.alerts.find(
        (a) => a.message === msgText && now - new Date(a.sentAt) < 5 * 60 * 1000
      );

      if (!recentDuplicate) {
        try {
          const msg = await client.messages.create({ body: msgText, from: fromNumber, to });
          microgrid.alerts.push({ message: msgText, sentAt: now });
          sentResults.push({ message: msgText, status: "sent", sid: msg.sid });
        } catch (err) {
          console.error("Failed to send alert:", err);
          sentResults.push({ message: msgText, status: "failed" });
        }
      } else {
        sentResults.push({ message: msgText, status: "duplicate" });
      }
    }

    await microgrid.save();
    res.json({ success: true, results: sentResults });

  } catch (err) {
    console.error("Batch alert sending failed:", err);
    res.status(500).json({ error: "Failed to send batch alerts" });
  }
});

// Get all alerts for a device
router.get("/devices/:device_id/alerts", async (req, res) => {
  try {
    const { device_id } = req.params;
    const microgrid = await MicrogridData.findOne({ device_id });

    if (!microgrid) return res.status(404).json({ error: "Device not found" });

    res.json({ alerts: microgrid.alerts });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to fetch alerts" });
  }
});

export const cleanupOldAlerts = async () => {
  try {
    const twentyMinutesAgo = new Date(Date.now() - 20 * 60 * 1000); // 20 min
    const devices = await MicrogridData.find({});

    for (let device of devices) {
      device.alerts = device.alerts.filter(alert => {
        if (!alert.sentAt) return true; // keep alerts without timestamp
        return new Date(alert.sentAt) > twentyMinutesAgo;
      });
      await device.save();
    }

    console.log("Old alerts cleaned up successfully.");
  } catch (err) {
    console.error("Failed to clean up old alerts:", err);
  }
};

export default router;
