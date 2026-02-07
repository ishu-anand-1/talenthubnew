// controllers/userController.js
import mongoose from "mongoose";
import User from "../models/User.model.js";

/* ===================== GET LOGGED-IN USER PROFILE ===================== */
export const getProfile = async (req, res) => {
  try {
    const userId = req.user.id;

    // Validate ObjectId (extra safety)
    if (!mongoose.Types.ObjectId.isValid(userId)) {
      return res.status(400).json({ error: "Invalid user ID" });
    }

    const user = await User.findById(userId).select("-password -__v");

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    res.status(200).json(user);
  } catch (error) {
    console.error("❌ Get profile error:", error);
    res.status(500).json({ error: "Failed to fetch profile" });
  }
};

/* ===================== GET USER BY ID (PUBLIC PROFILE) ===================== */
export const getUserById = async (req, res) => {
  try {
    const { id } = req.params;

    // Validate MongoDB ObjectId
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ error: "Invalid user ID" });
    }

    const user = await User.findById(id).select("-password -__v");

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    res.status(200).json(user);
  } catch (error) {
    console.error("❌ Get user by ID error:", error);
    res.status(500).json({ error: "Failed to fetch user profile" });
  }
};
