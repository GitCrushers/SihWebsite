import { app } from "./app.js";
import dotenv from "dotenv";
import { connectDB } from "./db/index.js";

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