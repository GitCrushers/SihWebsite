import Telemetry from "../models/telemetry.schema.js";

// Save a single telemetry reading
export const saveTelemetry = async (req, res) => {
  try {
    const telemetry = req.body;

    // Validate required fields
    if (!telemetry.device_id || !telemetry.timestamp) {
      return res.status(400).json({
        error: "Telemetry object must include device_id and timestamp",
      });
    }

    const newTelemetry = new Telemetry(telemetry);
    await newTelemetry.save();

    res.status(201).json({
      message: "Telemetry saved successfully",
      data: newTelemetry,
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Get all telemetry readings (optionally with a limit)
export const getTelemetry = async (req, res) => {
  try {
    const { limit } = req.query;
    const telemetryData = await Telemetry.find()
      .sort({ createdAt: -1 })
      .limit(limit ? parseInt(limit) : 100); // default limit 100

    if (!telemetryData || telemetryData.length === 0) {
      return res
        .status(404)
        .json({ success: false, message: "No telemetry data found" });
    }

    res.json({ success: true, count: telemetryData.length, data: telemetryData });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

// Get the latest telemetry reading
export const getLatestTelemetry = async (req, res) => {
  try {
    const latestTelemetry = await Telemetry.findOne().sort({ createdAt: -1 });

    if (!latestTelemetry) {
      return res
        .status(404)
        .json({ success: false, message: "No telemetry data found" });
    }

    res.json({ success: true, data: latestTelemetry });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};
