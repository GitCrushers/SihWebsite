import mongoose from "mongoose";

// Generic telemetry object
const TelemetrySchema = new mongoose.Schema(
  {
    id: { type: String, required: true }, // e.g. "battery", "solar", "load", "timestamp"
    soc_percent: Number,
    voltage_v: Number,
    power_w: Number,
    current_a: Number,
    value: mongoose.Schema.Types.Mixed, // for timestamp or device_id string
    firmware_version: String,
    location: String,
  },
  { _id: false } // don’t create _id for each telemetry item
);

const MicrogridDataSchema = new mongoose.Schema(
  {
    telemetry: [TelemetrySchema],
  },
  { timestamps: true }
);

export default mongoose.model("MicrogridData", MicrogridDataSchema);
