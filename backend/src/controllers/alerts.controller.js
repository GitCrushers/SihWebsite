import express from "express";
import twilio from "twilio";
import dotenv from "dotenv";
import MicrogridData from "../models/microgrid.schema.js";


dotenv.config();
const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const client = twilio(accountSid, authToken);
const fromNumber = process.env.TWILIO_PHONE_NUMBER;

const router = express.Router();

router.post("/send-alert", async (req, res) => {
  try {
    const { to, message, device_id } = req.body;

    if (!to || !message || !device_id) {
      return res.status(400).json({ error: "Missing 'to', 'message', or 'device_id'" });
    }

    // Check if alert already exists for this device
    const device = await Device.findOne({ device_id });
    if (!device) {
      return res.status(404).json({ error: "Device not found" });
    }

    const alreadySent = device.alerts.some(a => a.message === message);
    if (alreadySent) {
      return res.status(200).json({ success: false, message: "Alert already sent" });
    }

    // Send SMS
    const msg = await client.messages.create({
      body: message,
      from: fromNumber,
      to,
    });

    // Save alert in DB
    device.alerts.push({ message });
    await device.save();

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
