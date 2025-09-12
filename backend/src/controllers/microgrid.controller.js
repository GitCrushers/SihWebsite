
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
