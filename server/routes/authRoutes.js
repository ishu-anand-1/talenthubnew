import express from "express";
import {
  register,
  login,
  forgotPassword,
  verifyOTP,
  resetPassword,
} from "../controllers/authController.js";

const router = express.Router();

/* ===================== AUTH ===================== */
// Register new user
router.post("/register", register);

// Login user
router.post("/login", login);

/* ===================== PASSWORD RESET ===================== */
// Send OTP to email
router.post("/forgot-password", forgotPassword);

// Verify OTP
router.post("/verify-otp", verifyOTP);

// Reset password
router.post("/reset-password", resetPassword);

export default router;
