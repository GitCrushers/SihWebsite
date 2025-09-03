import { Router } from "express";
import { signIn, signUp, user } from "../controllers/users.controller.js";
import { auth } from "../middlewares/auth.middleware.js";



const router = Router()
router.get("/user",auth,user)
router.post("/signin",signIn);
router.post("/signup",signUp)

export default router