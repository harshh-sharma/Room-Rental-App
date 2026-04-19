import {Router} from "express";
import { getCurrentUser, login, register, verifyEmail } from "../controllers/auth.js";
import { loginSchema, registerSchema } from "../validators/auth.validate.js";
import { validate } from "../middlewares/validate.js";
import { protect } from "../middlewares/auth.middleware.js";

const router = Router();

router.post("/register", validate(registerSchema), register);
router.get("/verify-email", verifyEmail);
router.post("/login", validate(loginSchema), login);
router.get("/me", protect, getCurrentUser);


export default router;