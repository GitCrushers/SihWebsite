import MicrogridData from "../models/microgrid.schema.js";

export const saveMicrogridData = async (req, res) => {
  try {
    const { telemetry } = req.body;

    if (!telemetry || !Array.isArray(telemetry) || telemetry.length === 0) {
      return res.status(400).json({ error: "Telemetry array is required" });
    }

    // Validate each telemetry object has device_id
    for (const t of telemetry) {
      if (!t.device_id) {
        return res.status(400).json({ 
          error: "Each telemetry object must have device_id" 
        });
      }
    }

    // Save each telemetry as a new document
    const savedTelemetry = [];
    for (const t of telemetry) {
      const doc = new MicrogridData(t); // createdAt auto-generated
      await doc.save();
      savedTelemetry.push(doc);
    }

    res.status(201).json({
      message: "Telemetry saved successfully",
      data: savedTelemetry,
    });

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Fetch latest N telemetry entries
export const getTelemetry = async (req, res) => {
  try {
    const allTelemetry = await MicrogridData.find().sort({ createdAt: -1 }).limit(50);
    if (!allTelemetry.length) {
      return res.status(404).json({ success: false, message: "No telemetry data found" });
    }
    res.json({ success: true, count: allTelemetry.length, data: allTelemetry });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

// Get single latest telemetry object
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
