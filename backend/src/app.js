import express from "express";
import userRoutes from "./routes/users.routes.js";
import telemetryRoutes from "./routes/telemetry.routes.js"
import cors from "cors";

export const app = express();

const frontend_url = process.env.FRONTEND_URL || 'http://localhost:5173'

app.use(express.json());
app.use(cors({
  origin: {frontend_url},
  credentials: true,
}));

app.use("/api/v1", userRoutes);  
app.use("/api/v2",telemetryRoutes);
