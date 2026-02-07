import mongoose from "mongoose";

const passwordResetSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: true,
      lowercase: true,
      index: true,
    },

    otp: {
      type: String,
      required: true, // hashed OTP
    },

    expiresAt: {
      type: Date,
      required: true,
      index: { expires: 0 }, // 🔥 auto-delete after expiry
    },
  },
  { timestamps: true }
);

export default mongoose.model("PasswordReset", passwordResetSchema);
