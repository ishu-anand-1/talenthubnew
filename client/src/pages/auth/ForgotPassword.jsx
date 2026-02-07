import { useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../services/api";
import "./FloatingShapes.css";

const MIN_PASSWORD_LENGTH = 6;

const ForgotPassword = () => {
  const navigate = useNavigate();

  const [step, setStep] = useState(1);

  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const resetMessages = () => {
    setError("");
    setSuccess("");
  };

  /* ================= SEND OTP ================= */
  const handleSendOTP = useCallback(async () => {
    if (!email.trim()) {
      setError("Please enter your email.");
      return;
    }

    try {
      resetMessages();
      setLoading(true);

      const { data } = await api.post("/auth/forgot-password", {
        email: email.trim(),
      });

      setSuccess(data?.message || "OTP sent successfully.");
      setStep(2);
    } catch (err) {
      setError(err?.message || "Failed to send OTP");
    } finally {
      setLoading(false);
    }
  }, [email]);

  /* ================= VERIFY OTP ================= */
  const handleVerifyOTP = useCallback(async () => {
    if (!otp.trim()) {
      setError("Please enter OTP.");
      return;
    }

    try {
      resetMessages();
      setLoading(true);

      const { data } = await api.post("/auth/verify-otp", {
        email: email.trim(),
        otp: otp.trim(),
      });

      setSuccess(data?.message || "OTP verified.");
      setStep(3);
    } catch (err) {
      setError(err?.message || "Invalid OTP");
    } finally {
      setLoading(false);
    }
  }, [email, otp]);

  /* ================= RESET PASSWORD ================= */
  const handleResetPassword = useCallback(async () => {
    if (!newPassword || !confirmPassword) {
      setError("Please fill in both password fields.");
      return;
    }

    if (newPassword.length < MIN_PASSWORD_LENGTH) {
      setError(`Password must be at least ${MIN_PASSWORD_LENGTH} characters.`);
      return;
    }

    if (newPassword !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    try {
      resetMessages();
      setLoading(true);

      const { data } = await api.post("/auth/reset-password", {
        email: email.trim(),
        newPassword,
      });

      setSuccess(data?.message || "Password updated successfully.");

      setTimeout(() => navigate("/login"), 1200);
    } catch (err) {
      setError(err?.message || "Password reset failed");
    } finally {
      setLoading(false);
    }
  }, [email, newPassword, confirmPassword, navigate]);

  /* ================= INPUT STYLE ================= */
  const inputStyle =
    "w-full mb-4 px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500";

  /* ================= UI ================= */
  return (
    <div className="relative min-h-screen flex items-center justify-center px-4 bg-gray-50">
      {/* Floating background */}
      <div className="floating-shape-bg">
        <div className="shape shape-1" />
        <div className="shape shape-2" />
        <div className="shape shape-3" />
      </div>

      {/* Card */}
      <div className="relative z-10 bg-white rounded-2xl shadow-2xl w-full max-w-md p-8 transition-all">
        <h2 className="text-2xl font-bold text-center mb-1">
          Reset Password
        </h2>

        <p className="text-center text-sm text-gray-500 mb-6">
          Step {step} of 3
        </p>

        {error && (
          <div className="bg-red-100 text-red-600 text-sm p-2 rounded mb-4">
            {error}
          </div>
        )}

        {success && (
          <div className="bg-green-100 text-green-700 text-sm p-2 rounded mb-4">
            {success}
          </div>
        )}

        {/* STEP 1 */}
        {step === 1 && (
          <>
            <input
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className={inputStyle}
            />

            <button
              onClick={handleSendOTP}
              disabled={loading}
              className="w-full bg-indigo-600 text-white py-2 rounded-lg font-semibold hover:bg-indigo-700 transition"
            >
              {loading ? "Sending..." : "Send OTP"}
            </button>
          </>
        )}

        {/* STEP 2 */}
        {step === 2 && (
          <>
            <input
              type="text"
              placeholder="Enter OTP"
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
              className={inputStyle}
            />

            <button
              onClick={handleVerifyOTP}
              disabled={loading}
              className="w-full bg-indigo-600 text-white py-2 rounded-lg font-semibold hover:bg-indigo-700 transition"
            >
              {loading ? "Verifying..." : "Verify OTP"}
            </button>
          </>
        )}

        {/* STEP 3 */}
        {step === 3 && (
          <>
            <input
              type="password"
              placeholder="New password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              className={inputStyle}
            />

            <input
              type="password"
              placeholder="Confirm password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className={inputStyle}
            />

            <button
              onClick={handleResetPassword}
              disabled={loading}
              className="w-full bg-green-600 text-white py-2 rounded-lg font-semibold hover:bg-green-700 transition"
            >
              {loading ? "Updating..." : "Update Password"}
            </button>
          </>
        )}
      </div>
    </div>
  );
};

export default ForgotPassword;
