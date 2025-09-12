import mongoose from "mongoose";

// Single telemetry entry schema
const TelemetrySchema = new mongoose.Schema({
  id: { type: String, required: true },
  device_id: { type: String, required: true },
  timestamp: { type: Date, required: true },
  solar_current_a: { type: Number },
  solar_voltage_v: { type: Number },
  solar_power_w: { type: Number },
  battery_soc_percent: { type: Number },
  battery_voltage_v: { type: Number },
  load_power_w: { type: Number },
  firmware_version: { type: String },
  location: { type: String }
}, { _id: false }); // optional: disable separate _id for each telemetry

// MicrogridData document schema
const MicrogridDataSchema = new mongoose.Schema({
  telemetry: { type: [TelemetrySchema], default: [] }
}, { timestamps: true });

export default mongoose.model("MicrogridData", MicrogridDataSchema);
