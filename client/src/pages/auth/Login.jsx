import { useState, useCallback } from "react";
import { useNavigate, Link } from "react-router-dom";
import { FaEnvelope, FaLock, FaUserTie } from "react-icons/fa";
import api from "../../services/api";

const Login = () => {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    email: "",
    password: "",
    role: "artist", // NEW
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  /* ================= INPUT CHANGE ================= */
  const handleChange = useCallback((e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  }, []);

  /* ================= LOGIN SUBMIT ================= */
  const handleSubmit = useCallback(
    async (e) => {
      e.preventDefault();
      if (loading) return;

      setError("");

      if (!form.email.trim() || !form.password) {
        setError("Email and password are required.");
        return;
      }

      try {
        setLoading(true);

        const res = await api.post("/auth/login", form);

        const { token, user } = res.data || {};

        if (!token || !user) {
          throw new Error("Invalid login response");
        }

        /* ================= STORE AUTH ================= */
        localStorage.setItem("token", token);
        localStorage.setItem("user", JSON.stringify(user));
        localStorage.setItem("role", user.role);

        /* ================= REDIRECT ================= */
        navigate(
          user.role === "recruiter"
            ? "/recruiter/dashboard"
            : "/dashboard",
          { replace: true }
        );
      } catch (err) {
        console.error("Login error:", err);

        setError(
          err?.response?.data?.error ||
          err?.response?.data?.message ||
          err?.message ||
          "Invalid email or password"
        );
      } finally {
        setLoading(false);
      }
    },
    [form, loading, navigate]
  );

  /* ================= UI ================= */
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-indigo-100 via-white to-purple-100 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 px-4">
      <div className="max-w-6xl w-full bg-white dark:bg-gray-800 rounded-3xl shadow-2xl overflow-hidden flex flex-col md:flex-row">

        {/* LEFT SIDE */}
        <div className="md:w-1/2 p-10 flex flex-col justify-center">
          <img src="/logo.png" alt="TalentHub" className="h-10 mb-6" />

          <h2 className="text-4xl font-bold mb-3 text-gray-800 dark:text-white">
            Welcome Back 👋
          </h2>

          <p className="text-gray-600 dark:text-gray-300 mb-6">
            Sign in to continue your journey with{" "}
            <span className="font-semibold text-indigo-600">
              TalentHub
            </span>
          </p>
        </div>

        {/* FORM */}
        <div className="md:w-1/2 bg-gray-50 dark:bg-gray-900 px-10 py-8">
          <h3 className="text-2xl font-bold text-center mb-2 text-gray-800 dark:text-white">
            Log In
          </h3>

          {error && (
            <div className="bg-red-100 text-red-600 text-sm p-2 rounded mb-4">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">

            {/* ROLE SELECT */}
            <div>
              <label className="text-sm font-medium text-gray-700 dark:text-gray-200">
                Login As
              </label>
              <div className="flex items-center border rounded-lg px-3 bg-white dark:bg-gray-800">
                <FaUserTie className="text-gray-400 mr-2" />
                <select
                  name="role"
                  value={form.role}
                  onChange={handleChange}
                  className="w-full py-2 outline-none bg-transparent"
                >
                  <option value="artist">Artist</option>
                  <option value="recruiter">Recruiter</option>
                </select>
              </div>
            </div>

            {/* EMAIL */}
            <div>
              <label className="text-sm font-medium text-gray-700 dark:text-gray-200">
                Email
              </label>
              <div className="flex items-center border rounded-lg px-3 bg-white dark:bg-gray-800">
                <FaEnvelope className="text-gray-400 mr-2" />
                <input
                  type="email"
                  name="email"
                  value={form.email}
                  onChange={handleChange}
                  placeholder="you@example.com"
                  className="w-full py-2 outline-none bg-transparent"
                />
              </div>
            </div>

            {/* PASSWORD */}
            <div>
              <label className="text-sm font-medium text-gray-700 dark:text-gray-200">
                Password
              </label>
              <div className="flex items-center border rounded-lg px-3 bg-white dark:bg-gray-800">
                <FaLock className="text-gray-400 mr-2" />
                <input
                  type="password"
                  name="password"
                  value={form.password}
                  onChange={handleChange}
                  placeholder="Enter password"
                  className="w-full py-2 outline-none bg-transparent"
                />
              </div>

              <p className="text-right text-sm mt-1">
                <Link to="/forgot-password" className="text-indigo-500 hover:underline">
                  Forgot Password?
                </Link>
              </p>
            </div>

            {/* BUTTON */}
            <button
              type="submit"
              disabled={loading}
              className="w-full py-2 bg-indigo-600 text-white rounded-lg font-semibold"
            >
              {loading ? "Logging in..." : "Log In"}
            </button>

            <p className="text-center text-sm text-gray-600 dark:text-gray-300">
              Don’t have an account?{" "}
              <Link to="/register" className="text-indigo-600 hover:underline">
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
