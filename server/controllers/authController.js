// controllers/authController.js

import crypto from "crypto";
import nodemailer from "nodemailer";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

import User from "../models/User.model.js";
import PasswordReset from "../models/PasswordReset.model.js";

/* ===================== ENV VALIDATION ===================== */
const {
  JWT_SECRET,
  EMAIL_HOST,
  EMAIL_PORT,
  EMAIL_USER,
  EMAIL_PASS,
} = process.env;

if (!JWT_SECRET) {
  throw new Error("❌ JWT_SECRET not defined in environment variables");
}

/* ===================== EMAIL TRANSPORTER ===================== */
const transporter = nodemailer.createTransport({
  host: EMAIL_HOST,
  port: Number(EMAIL_PORT),
  secure: Number(EMAIL_PORT) === 465, // true only for SSL
  auth: {
    user: EMAIL_USER,
    pass: EMAIL_PASS,
  },
});

/* ===================== REGISTER ===================== */
export const register = async (req, res) => {
  try {
    const { name, lastname, email, password } = req.body;

    if (!name || !lastname || !email || !password) {
      return res.status(400).json({ error: "All fields are required" });
    }

    if (password.length < 6) {
      return res.status(400).json({
        error: "Password must be at least 6 characters",
      });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(409).json({ error: "Email already registered" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await User.create({
      name,
      lastname,
      email,
      password: hashedPassword,
      role: "artist", // default role
    });

    const token = jwt.sign(
      { id: user._id, role: user.role },
      JWT_SECRET,
      { expiresIn: "2h" }
    );

    res.status(201).json({
      message: "Registration successful",
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error) {
    console.error("❌ Register error:", error);
    res.status(500).json({ error: "Registration failed" });
  }
};

/* ===================== LOGIN ===================== */
export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        error: "Email and password are required",
      });
    }

    // 🔥 IMPORTANT FIX: explicitly select password
    const user = await User.findOne({ email }).select("+password");
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ error: "Invalid credentials" });
    }

    const token = jwt.sign(
      { id: user._id, role: user.role },
      JWT_SECRET,
      { expiresIn: "2h" }
    );

    res.status(200).json({
      message: "Login successful",
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error) {
    console.error("❌ Login error:", error);
    res.status(500).json({ error: "Login failed" });
  }
};

/* ===================== FORGOT PASSWORD ===================== */
export const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({ error: "Email is required" });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    const otp = crypto.randomInt(100000, 999999).toString();
    const hashedOtp = crypto
      .createHash("sha256")
      .update(otp)
      .digest("hex");

    // Remove old OTPs
    await PasswordReset.deleteMany({ email });

    await PasswordReset.create({
      email,
      otp: hashedOtp,
      expiresAt: new Date(Date.now() + 15 * 60 * 1000), // 15 min
    });

    await transporter.sendMail({
      from: `"TalentHub" <${EMAIL_USER}>`,
      to: email,
      subject: "Password Reset OTP",
      html: `
        <p>Your OTP is <strong>${otp}</strong></p>
        <p>This OTP is valid for <b>15 minutes</b>.</p>
      `,
    });

    res.status(200).json({ message: "OTP sent successfully" });
  } catch (error) {
    console.error("❌ Forgot password error:", error);
    res.status(500).json({ error: "Failed to send OTP" });
  }
};

/* ===================== VERIFY OTP ===================== */
export const verifyOTP = async (req, res) => {
  try {
    const { email, otp } = req.body;

    if (!email || !otp) {
      return res.status(400).json({
        error: "Email and OTP are required",
      });
    }

    const hashedOtp = crypto
      .createHash("sha256")
      .update(otp)
      .digest("hex");

    const record = await PasswordReset.findOne({
      email,
      otp: hashedOtp,
      expiresAt: { $gt: new Date() },
    });

    if (!record) {
      return res.status(400).json({
        error: "Invalid or expired OTP",
      });
    }

    res.status(200).json({ message: "OTP verified" });
  } catch (error) {
    console.error("❌ Verify OTP error:", error);
    res.status(500).json({ error: "OTP verification failed" });
  }
};

/* ===================== RESET PASSWORD ===================== */
export const resetPassword = async (req, res) => {
  try {
    const { email, newPassword } = req.body;

    if (!email || !newPassword) {
      return res.status(400).json({
        error: "Email and new password required",
      });
    }

    if (newPassword.length < 6) {
      return res.status(400).json({
        error: "Password must be at least 6 characters",
      });
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);

    await User.updateOne(
      { email },
      { $set: { password: hashedPassword } }
    );

    // cleanup OTPs
    await PasswordReset.deleteMany({ email });

    res.status(200).json({
      message: "Password reset successful",
    });
  } catch (error) {
    console.error("❌ Reset password error:", error);
    res.status(500).json({ error: "Password reset failed" });
  }
};
