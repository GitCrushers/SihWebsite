import express from "express"
import twilio from "twilio"
const accountSid = process.env.TWILIO_ACCOUNT_SID; // from Twilio
const authToken = process.env.TWILIO_AUTH_TOKEN;   // from Twilio
const client = twilio(accountSid, authToken);
const fromNumber = process.env.TWILIO_PHONE_NUMBER; // Twilio number

const router = express.Router()
// Endpoint to send SMS
router.post("/send-alert", async (req, res) => {
  try {
    const { to, message } = req.body;

    if (!to || !message) {
      return res.status(400).json({ error: "Missing 'to' or 'message'" });
    }

    const msg = await client.messages.create({
      body: message,
      from: fromNumber,
      to,
    });

    res.json({ success: true, sid: msg.sid });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to send SMS" });
  }
});


export default router