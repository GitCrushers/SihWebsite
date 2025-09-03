import express from "express"
import cors from "cors"
import userRoutes from "./routes/users.routes.js"

export const app = express();
app.use(express.json());
app.use("/api/v1",userRoutes);
app.use(cors({
    origin: "*",
    credentials: true
}));
app.use(express.urlencoded({extended: true, limit: "16kb"}));


