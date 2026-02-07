import express from "express";
import { getUserById, getProfile } from "../controllers/userController.js";
import { verifyToken } from "../middleware/authMiddleware.js";

const router = express.Router();

/* ===================== USER ROUTES ===================== */

// Logged-in user's profile
router.get("/profile", verifyToken, getProfile);

// Public user profile by ID
router.get("/:id", verifyToken, getUserById);

export default router;
