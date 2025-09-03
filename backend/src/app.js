import express from "express";
import userRoutes from "./routes/users.routes.js";
import cors from "cors";

export const app = express();

app.use(express.json());
app.use(cors({
  origin: "https://grid-powers.vercel.app",
  credentials: true,
}));

app.use("/api/v1", userRoutes);  
