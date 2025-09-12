import mongoose from "mongoose";

const MicrogridSchema = new mongoose.Schema(
  {
    device_id: { type: String, required: true },

    // Solar measurements
    solar_current_a: { type: Number, default: 0 },
    solar_voltage_v: { type: Number, default: 0 },
    solar_power_w: { type: Number, default: 0 },

    // Battery measurements
    battery_soc_percent: { type: Number, default: 0 },
    battery_voltage_v: { type: Number, default: 0 },

    // Load measurements
    load_power_w: { type: Number, default: 0 },

    // Metadata
    firmware_version: { type: String, default: "v1.0.0" },
    location: { type: String, default: "" },
  },
  {
    timestamps: true, // Adds createdAt and updatedAt automatically
  }
);

export default mongoose.model("MicrogridData", MicrogridSchema);
