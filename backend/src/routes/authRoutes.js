import { Router } from "express";
import * as auth from "../controllers/authController.js";
import { authenticate } from "../middlewares/auth.js";
import { validateRequest } from "../middlewares/errorHandler.js";
import { changePasswordValidator, forgotValidator, loginValidator, resetValidator, signupValidator, tokenValidator } from "../validators/authValidators.js";

const router = Router();

router.post("/signup", signupValidator, validateRequest, auth.signup);
router.post("/login", loginValidator, validateRequest, auth.login);
router.post("/refresh", auth.refresh);
router.post("/logout", auth.logout);
router.get("/me", authenticate, auth.me);
router.post("/verify-email", tokenValidator, validateRequest, auth.verifyEmail);
router.post("/forgot-password", forgotValidator, validateRequest, auth.forgotPassword);
router.post("/reset-password", resetValidator, validateRequest, auth.resetPassword);
router.patch("/change-password", authenticate, changePasswordValidator, validateRequest, auth.changePassword);
router.patch("/profile", authenticate, auth.updateProfile);

export default router;
