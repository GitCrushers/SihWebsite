import MicrogridData from "../models/microgrid.schema.js";

// ✅ Save telemetry (single or multiple objects)
export const saveMicrogridData = async (req, res) => {
  try {
    let payload = req.body;

    // If single object → wrap into array
    if (!Array.isArray(payload)) {
      payload = [payload];
    }

    // Insert docs directly
    const saved = await MicrogridData.insertMany(payload);

    res.status(201).json({
      message: "Telemetry saved successfully",
      count: saved.length,
      data: saved,
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// ✅ Get latest N docs
export const getTelemetry = async (req, res) => {
  try {
    const limit = parseInt(req.query.limit) || 50;
    const docs = await MicrogridData.find().sort({ createdAt: -1 }).limit(limit);

    if (!docs.length) {
      return res.status(404).json({ success: false, message: "No telemetry data found" });
    }

    res.json({ success: true, count: docs.length, data: docs });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

// ✅ Get latest single doc
export const getLatestTelemetry = async (req, res) => {
  try {
    const latest = await MicrogridData.findOne().sort({ createdAt: -1 });

    if (!latest) {
      return res.status(404).json({ success: false, message: "No data found" });
    }

    res.json({ success: true, data: latest });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};
