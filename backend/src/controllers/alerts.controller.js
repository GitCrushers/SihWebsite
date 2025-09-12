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

router.post("/send-alert", async (req, res) => {
  try {
    const { to, message, device_id } = req.body;

    if (!to || !message || !device_id) {
      return res
        .status(400)
        .json({ error: "Missing 'to', 'message', or 'device_id'" });
    }

    // Find the microgrid data for this device
    let microgrid = await MicrogridData.findOne({ device_id });

    if (!microgrid) {
      microgrid = new MicrogridData({
        device_id,
        alerts: [],
      });
    }

    // Send SMS via Twilio
    const msg = await client.messages.create({
      body: message,
      from: fromNumber,
      to,
    });

    // Store alert in DB
    microgrid.alerts.push({ message, sentAt: new Date() });
    await microgrid.save();

    res.json({ success: true, sid: msg.sid });
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
