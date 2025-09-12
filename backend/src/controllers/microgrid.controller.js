import MicrogridData from "../models/microgrid.schema.js";

export const saveMicrogridData = async (req, res) => {
    try {
      const telemetryObj = req.body; // should be an object
  
      // Find latest microgrid document (or create if none exists)
      let latestDoc = await MicrogridData.findOne().sort({ createdAt: -1 });
  
      if (!latestDoc) {
        // Create new doc if none exists
        latestDoc = new MicrogridData({
          telemetry: [telemetryObj],
        });
      } else {
        // Push new telemetry entry
        latestDoc.telemetry.push(telemetryObj);
      }
  
      await latestDoc.save();
  
      res.status(201).json({
        message: "Telemetry saved successfully",
        data: telemetryObj,
      });
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  };
  
// ✅ Get latest N telemetry entries
export const getTelemetry = async (req, res) => {
  try {
    const { limit } = req.query;
    const latestDoc = await MicrogridData.findOne().sort({ createdAt: -1 });
    if (!latestDoc || !latestDoc.telemetry) {
      return res.status(404).json({ success: false, message: "No telemetry found" });
    }

    const telemetryData = latestDoc.telemetry.slice(-(limit ? parseInt(limit) : 20));
    res.json({ success: true, data: telemetryData });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

// ✅ Get single latest telemetry object
export const getLatestTelemetry = async (req, res) => {
  try {
    const latestDoc = await MicrogridData.findOne().sort({ createdAt: -1 });
    if (!latestDoc || !latestDoc.telemetry || latestDoc.telemetry.length === 0) {
      return res.status(404).json({ success: false, message: "No data found" });
    }

    const latestTelemetry = latestDoc.telemetry[latestDoc.telemetry.length - 1];
    res.json({ success: true, data: latestTelemetry });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};
