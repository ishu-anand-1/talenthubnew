import React, { useState } from "react";
import api from "../services/api";
import { useNavigate, Link } from "react-router-dom";
import { FaEnvelope, FaLock } from "react-icons/fa";

const Login = () => {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    email: "",
    password: "",
  });

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  /* ===================== HANDLE CHANGE ===================== */
  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  /* ===================== HANDLE SUBMIT ===================== */
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!form.email || !form.password) {
      setError("Please enter email and password");
      return;
    }

    try {
      setLoading(true);

      const res = await api.post("/auth/login", {
        email: form.email.trim(),
        password: form.password,
      });

      // ✅ Save JWT token
      localStorage.setItem("token", res.data.token);

      // ✅ Redirect
      navigate("/dashboard");
    } catch (err) {
      setError(
        err.response?.data?.error ||
          err.response?.data?.message ||
          "Invalid email or password"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-indigo-100 via-white to-purple-100 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 px-4">
      <div className="max-w-6xl w-full bg-white dark:bg-gray-800 rounded-3xl shadow-2xl overflow-hidden flex flex-col md:flex-row">
        
        {/* ================= LEFT SECTION ================= */}
        <div className="md:w-1/2 p-10 flex flex-col justify-center">
          <img src="/logo.png" alt="Logo" className="h-10 mb-4" />
          <h2 className="text-4xl font-bold mb-2 text-gray-800 dark:text-white">
            Welcome Back to TalentHub
          </h2>
          <p className="text-gray-600 dark:text-gray-300 mb-6">
            Sign in to continue your creative journey with{" "}
            <span className="font-semibold text-indigo-600">TalentHub</span>.
          </p>
          <ul className="text-gray-600 dark:text-gray-400 text-sm space-y-2">
            <li>🎵 Learn from expert creators</li>
            <li>🚀 Showcase your talent</li>
            <li>👥 Connect with artists worldwide</li>
          </ul>
        </div>

        {/* ================= RIGHT SECTION ================= */}
        <div className="md:w-1/2 bg-gray-50 dark:bg-gray-900 px-10 py-8">
          <h3 className="text-2xl font-bold text-center mb-2 text-gray-800 dark:text-white">
            Log In
          </h3>
          <p className="text-center text-sm text-gray-500 dark:text-gray-400 mb-6">
            Access lessons & upload your talent
          </p>

          {error && (
            <div className="bg-red-100 text-red-600 text-sm p-2 rounded mb-4">
              {error}
            </div>
          )}

          <form className="space-y-4" onSubmit={handleSubmit}>
            {/* Email */}
            <div>
              <label className="text-sm font-medium text-gray-700 dark:text-gray-200">
                Email
              </label>
              <div className="flex items-center border rounded-md px-3 bg-white dark:bg-gray-800 focus-within:ring-2 focus-within:ring-indigo-400">
                <FaEnvelope className="text-gray-400 mr-2" />
                <input
                  type="email"
                  name="email"
                  value={form.email}
                  onChange={handleChange}
                  placeholder="you@example.com"
                  className="w-full py-2 outline-none bg-transparent text-black dark:text-white"
                  required
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <label className="text-sm font-medium text-gray-700 dark:text-gray-200">
                Password
              </label>
              <div className="flex items-center border rounded-md px-3 bg-white dark:bg-gray-800 focus-within:ring-2 focus-within:ring-indigo-400">
                <FaLock className="text-gray-400 mr-2" />
                <input
                  type="password"
                  name="password"
                  value={form.password}
                  onChange={handleChange}
                  placeholder="Enter your password"
                  className="w-full py-2 outline-none bg-transparent text-black dark:text-white"
                  required
                />
              </div>
              <p className="text-right text-sm mt-1">
                <Link to="/forgot-password" className="text-indigo-500 hover:underline">
                  Forgot Password?
                </Link>
              </p>
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={loading}
              className={`w-full py-2 mt-2 bg-gradient-to-r from-indigo-500 to-purple-500 text-white font-semibold rounded-lg transition shadow-md ${
                loading ? "opacity-70 cursor-not-allowed" : "hover:scale-105"
              }`}
            >
              {loading ? "Logging in..." : "Log In"}
            </button>

            {/* Register */}
            <p className="text-center text-sm text-gray-600 dark:text-gray-300 mt-4">
              Don’t have an account?{" "}
              <Link to="/register" className="text-indigo-600 font-medium hover:underline">
                Register
              </Link>
            </p>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Login;
