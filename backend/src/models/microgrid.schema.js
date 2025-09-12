import mongoose from "mongoose";

const TelemetrySchema = new mongoose.Schema(
  {
    device_id: { type: String, required: true },
    timestamp: { type: String, required: true },

    solar: {
      current_a: Number,
      voltage_v: Number,
      power_w: Number,
    },
    battery: {
      soc_percent: Number,
      voltage_v: Number,
    },
    load: {
      power_w: Number,
    },
    metadata: {
      firmware_version: String,
      location: String,
    },
  },
  { _id: false }
);

const MicrogridDataSchema = new mongoose.Schema(
  {
    telemetry: [TelemetrySchema],
  },
  { timestamps: true }
);

export default mongoose.model("MicrogridData", MicrogridDataSchema);
