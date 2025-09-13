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

// Send alert and store in MicrogridData
// Send alert and store in MicrogridData
router.post("/send-alert", async (req, res) => {
  try {
    let { to, message, device_id, language } = req.body;
    if (!to || !message || !device_id || !language)
      return res.status(400).json({ error: "Missing fields" });

    // message is already translated by frontend, so no need to translate here
    const translatedText = message;

    // Find device in DB
    let microgrid = await MicrogridData.findOne({ device_id });
    if (!microgrid) microgrid = new MicrogridData({ device_id, alerts: [] });

    // Check recent duplicates (5 min)
    const now = new Date();
    const recentDuplicate = microgrid.alerts.find(
      (a) =>
        a.message === translatedText &&
        now - new Date(a.sentAt) < 5 * 60 * 1000
    );

    if (!recentDuplicate) {
      const msg = await client.messages.create({
        body: translatedText,
        from: fromNumber,
        to,
      });

      microgrid.alerts.push({ message: translatedText, sentAt: new Date() });
      await microgrid.save();

      return res.json({ success: true, sid: msg.sid });
    }

    return res.json({ success: false, message: "Duplicate within 5 min" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to send alert" });
  }
});


// Get all alerts for a device
router.get("/devices/:device_id/alerts", async (req, res) => {
  try {
    const { device_id } = req.params;
    const microgrid = await MicrogridData.findOne({ device_id });

    if (!microgrid) {
      return res.status(404).json({ error: "Device not found" });
    }

    res.json({ alerts: microgrid.alerts });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to fetch alerts" });
  }
});

export default router;