import { app } from "./app.js";
import dotenv from "dotenv";
import { connectDB } from "./db/index.js";
import { startSync } from "./services/syncService.js";
import { cleanupOldAlerts } from "./controllers/alerts.controller.js";

// Run cleanup every 20 minutes



dotenv.config();
const PORT = 8000 || process.env.PORT;
connectDB()
.then(()=>{
    app.listen(PORT,()=>{
        console.log(`Server is listening at ${PORT}`)
    })
})
.catch((err)=>{
    console.log(`MongoDB Connection failed : ${err}`)
})

startSync();
setInterval(cleanupOldAlerts, 20 * 60 * 1000);
