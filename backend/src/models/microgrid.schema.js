
import mongoose from "mongoose";

const TelemetrySchema = new mongoose.Schema({}, { strict: false }); 


const MicrogridDataSchema = new mongoose.Schema({
  telemetry: [TelemetrySchema], 
}, { timestamps: true });

export default mongoose.model("MicrogridData", MicrogridDataSchema);
