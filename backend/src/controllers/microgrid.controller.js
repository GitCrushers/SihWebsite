import MicrogridData from "../models/microgrid.schema.js";


export const saveMicrogridData = async (req, res) => {
    try {
      const { telemetry } = req.body;
  
      if (!telemetry || !Array.isArray(telemetry) || telemetry.length === 0) {
        return res.status(400).json({ error: "Telemetry array is required" });
      }
  
      // Validate each telemetry object has required fields
      for (const t of telemetry) {
        if (!t.id || !t.device_id || !t.timestamp) {
          return res.status(400).json({ 
            error: "Each telemetry object must have id, device_id, and timestamp" 
          });
        }
      }
  
      // Find latest microgrid document (or create new if none)
      let latestDoc = await MicrogridData.findOne().sort({ createdAt: -1 });
  
      if (!latestDoc) {
        latestDoc = new MicrogridData({ telemetry });
      } else {
        latestDoc.telemetry.push(...telemetry); // Append all telemetry objects
      }
  
      await latestDoc.save();
  
      res.status(201).json({
        message: "Telemetry saved successfully",
        data: telemetry,
      });
  
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  };
  
  
// ✅ Get latest N telemetry entries
export const getTelemetry = async (req, res) => {
    try {
      // Fetch all docs, project only telemetry field
      const allDocs = await MicrogridData.find({}, { telemetry: 1, _id: 0 });
  
      // Flatten telemetry arrays from all documents
      const allTelemetry = allDocs.flatMap(doc => doc.telemetry);
  
      if (!allTelemetry || allTelemetry.length === 0) {
        return res.status(404).json({ success: false, message: "No telemetry data found" });
      }
  
      res.json({ success: true, count: allTelemetry.length, data: allTelemetry });
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
