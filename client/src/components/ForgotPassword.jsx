import React, { useState } from "react";
import api from "../services/api";
import { useNavigate } from "react-router-dom";
import "./FloatingShapes.css";

const ForgotPassword = () => {
  const [step, setStep] = useState(1);
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  /* ===================== SEND OTP ===================== */
  const handleSendOTP = async () => {
    if (!email.trim()) {
      alert("Please enter your email");
      return;
    }

    try {
      setLoading(true);
      const res = await api.post("/auth/forgot-password", {
        email: email.trim(),
      });
      alert(res.data.message);
      setStep(2);
    } catch (error) {
      alert(error.response?.data?.error || "Failed to send OTP");
    } finally {
      setLoading(false);
    }
  };

  /* ===================== VERIFY OTP ===================== */
  const handleVerifyOTP = async () => {
    if (!otp.trim()) {
      alert("Please enter OTP");
      return;
    }

    try {
      setLoading(true);
      const res = await api.post("/auth/verify-otp", {
        email: email.trim(),
        otp: otp.trim(),
      });
      alert(res.data.message);
      setStep(3);
    } catch (error) {
      alert(error.response?.data?.error || "OTP verification failed");
    } finally {
      setLoading(false);
    }
  };

  /* ===================== RESET PASSWORD ===================== */
  const handleResetPassword = async () => {
    if (!newPassword || !confirmPassword) {
      alert("Please fill both password fields");
      return;
    }

    if (newPassword !== confirmPassword) {
      alert("Passwords do not match");
      return;
    }

    try {
      setLoading(true);
      const res = await api.post("/auth/reset-password", {
        email: email.trim(),
        newPassword,
        confirmPassword,
      });
      alert(res.data.message);
      navigate("/login");
    } catch (error) {
      alert(error.response?.data?.error || "Password reset failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative min-h-screen w-full">
      <div className="floating-shape-bg">
        <div className="shape shape-1"></div>
        <div className="shape shape-2"></div>
        <div className="shape shape-3"></div>
      </div>

      <div className="flex justify-center items-center min-h-screen relative z-10">
        <div className="bg-white rounded-xl shadow-2xl p-8 w-full max-w-md">
          {/* ===== STEP 1 ===== */}
          {step === 1 && (
            <>
              <h2 className="text-2xl font-semibold mb-6 text-center text-black">
                Forgot Password
              </h2>
              <input
                type="email"
                placeholder="Enter your registered email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full p-2 mb-4 border rounded text-black"
              />
              <button
                disabled={loading}
                onClick={handleSendOTP}
                className="w-full bg-indigo-600 text-white p-2 rounded hover:bg-indigo-700"
              >
                {loading ? "Sending..." : "Send OTP"}
              </button>
            </>
          )}

          {/* ===== STEP 2 ===== */}
          {step === 2 && (
            <>
              <h2 className="text-2xl font-semibold mb-4 text-center text-black">
                Enter OTP
              </h2>
              <input
                type="text"
                placeholder="Enter OTP"
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
                className="w-full p-2 mb-4 border rounded text-black"
              />
              <button
                disabled={loading}
                onClick={handleVerifyOTP}
                className="w-full bg-indigo-600 text-white p-2 rounded hover:bg-indigo-700"
              >
                {loading ? "Verifying..." : "Verify OTP"}
              </button>
            </>
          )}

          {/* ===== STEP 3 ===== */}
          {step === 3 && (
            <>
              <h2 className="text-2xl font-bold mb-4 text-center text-black">
                Create New Password
              </h2>
              <input
                type="password"
                placeholder="New Password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                className="w-full p-2 mb-4 border rounded text-black"
              />
              <input
                type="password"
                placeholder="Confirm Password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="w-full p-2 mb-4 border rounded text-black"
              />

              {newPassword &&
                confirmPassword &&
                newPassword !== confirmPassword && (
                  <p className="text-red-500 text-sm mb-2">
                    Passwords do not match
                  </p>
                )}

              <button
                disabled={
                  loading ||
                  !newPassword ||
                  !confirmPassword ||
                  newPassword !== confirmPassword
                }
                onClick={handleResetPassword}
                className="w-full bg-green-600 text-white py-2 rounded hover:bg-green-700"
              >
                {loading ? "Updating..." : "Update Password"}
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;
