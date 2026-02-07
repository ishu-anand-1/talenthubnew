import bcrypt from "bcrypt";
import crypto from "crypto";
import User from "../models/User.js";
import PasswordReset from "../models/PasswordReset.js";
import generateToken from "../utils/generateToken.js";
import sendEmail from "../utils/sendEmail.js";

export const registerUser = async (data) => {
  const exists = await User.findOne({ email: data.email });
  if (exists) throw new Error("Email already registered");

  const hashed = await bcrypt.hash(data.password, 10);
  const user = await User.create({ ...data, password: hashed });

  return {
    token: generateToken({ id: user._id }),
    user,
  };
};

export const loginUser = async ({ email, password }) => {
  const user = await User.findOne({ email });
  if (!user) throw new Error("User not found");

  const match = await bcrypt.compare(password, user.password);
  if (!match) throw new Error("Invalid credentials");

  return {
    token: generateToken({ id: user._id }),
    user,
  };
};

export const sendResetOTP = async (email) => {
  const otp = Math.floor(100000 + Math.random() * 900000).toString();
  const hashedOtp = crypto.createHash("sha256").update(otp).digest("hex");

  await PasswordReset.deleteMany({ email });
  await PasswordReset.create({
    email,
    otp: hashedOtp,
    expiresAt: Date.now() + 15 * 60 * 1000,
  });

  await sendEmail({
    to: email,
    subject: "Password Reset OTP",
    text: `Your OTP is ${otp}. Valid for 15 minutes.`,
  });
};
