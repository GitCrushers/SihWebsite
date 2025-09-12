
import MicrogridData from "../models/microgrid.schema.js";

export const saveMicrogridData = async (req, res) => {
  try {
    const data = new MicrogridData(req.body); 
    await data.save();
    res.status(201).json({ message: "Data saved successfully", data });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const getTelemetry = async (req, res) => {
    try {
      const { limit } = req.query;
      const data = await Telemetry.find()
        .sort({ createdAt: -1 })
        .limit(limit ? parseInt(limit) : 20);
  
      res.json({ success: true, data });
    } catch (err) {
      res.status(500).json({ success: false, error: err.message });
    }
  };
  

  export const getLatestTelemetry = async (req, res) => {
    try {
      const latest = await Telemetry.findOne().sort({ createdAt: -1 });
      if (!latest) {
        return res.status(404).json({ success: false, message: "No data found" });
      }
      res.json({ success: true, data: latest });
    } catch (err) {
      res.status(500).json({ success: false, error: err.message });
    }
  };