import mongoose from "mongoose";

const microgridSchema = new mongoose.Schema(
    {
      device_id: { type: String, required: true },
      solar_current_a: Number,
      solar_voltage_v: Number,
      solar_power_w: Number,
      battery_soc_percent: Number,
      battery_voltage_v: Number,
      load_power_w: Number,
      firmware_version: String,
      location: String,
      alerts: [
        {
          message: String,
          language: String,
          timestamp: { type: Date, default: Date.now },
        },
      ],
    },
    { timestamps: true }
  );
export default mongoose.model("MicrogridData", microgridSchema);
