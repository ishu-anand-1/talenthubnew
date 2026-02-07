import { useState, useCallback } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FaEnvelope, FaLock, FaUser, FaUserTie } from "react-icons/fa";
import api from "../../services/api";

/* ================= CONSTANTS ================= */
const INITIAL_FORM = {
  name: "",
  lastname: "",
  email: "",
  password: "",
  role: "artist", // NEW
};

const MIN_PASSWORD_LENGTH = 6;

const Register = () => {
  const navigate = useNavigate();

  const [form, setForm] = useState(INITIAL_FORM);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  /* ================= INPUT CHANGE ================= */
  const handleChange = useCallback((e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  }, []);

  /* ================= SUBMIT ================= */
  const handleSubmit = useCallback(
    async (e) => {
      e.preventDefault();
      if (loading) return;

      setError("");
      setSuccess("");

      if (
        !form.name.trim() ||
        !form.lastname.trim() ||
        !form.email.trim() ||
        !form.password
      ) {
        setError("All fields are required.");
        return;
      }

      if (form.password.length < MIN_PASSWORD_LENGTH) {
        setError(
          `Password must be at least ${MIN_PASSWORD_LENGTH} characters.`
        );
        return;
      }

      try {
        setLoading(true);

        const res = await api.post("/auth/register", form);

        setSuccess(res.data?.message || "Registration successful!");
        setForm(INITIAL_FORM);

        setTimeout(() => {
          navigate("/login", { replace: true });
        }, 1200);
      } catch (err) {
        console.error("Register error:", err);

        setError(
          err?.response?.data?.error ||
            err?.response?.data?.message ||
            err?.message ||
            "Registration failed"
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
      <div className="max-w-6xl w-full bg-white dark:bg-gray-900 shadow-2xl rounded-3xl overflow-hidden flex flex-col md:flex-row">

        {/* LEFT SIDE */}
        <div className="md:w-1/2 p-10 flex flex-col justify-center text-gray-800 dark:text-white">
          <h2 className="text-4xl font-extrabold mb-4">
            Start Your Creative Journey 🎭
          </h2>

          <p className="mb-6 text-gray-600 dark:text-gray-300">
            Join{" "}
            <span className="font-semibold text-indigo-600">
              TalentHub
            </span>{" "}
            and showcase your talent to the world.
          </p>
        </div>

        {/* FORM */}
        <div className="md:w-1/2 bg-gray-50 dark:bg-gray-800 px-10 py-8">
          <h3 className="text-2xl font-bold text-center mb-2 text-gray-900 dark:text-white">
            Create Your Account
          </h3>

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

          <form onSubmit={handleSubmit} className="space-y-4">

            {/* ROLE SELECT */}
            <div>
              <label className="text-sm font-medium text-gray-700 dark:text-gray-200">
                Register As
              </label>
              <div className="flex items-center border rounded-lg px-3 bg-white dark:bg-gray-700">
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

            {/* NAME */}
            <div className="flex gap-4">
              <InputField
                icon={<FaUser />}
                name="name"
                value={form.name}
                onChange={handleChange}
                placeholder="First Name"
              />
              <InputField
                icon={<FaUser />}
                name="lastname"
                value={form.lastname}
                onChange={handleChange}
                placeholder="Last Name"
              />
            </div>

            {/* EMAIL */}
            <InputField
              icon={<FaEnvelope />}
              name="email"
              type="email"
              value={form.email}
              onChange={handleChange}
              placeholder="you@example.com"
            />

            {/* PASSWORD */}
            <InputField
              icon={<FaLock />}
              name="password"
              type="password"
              value={form.password}
              onChange={handleChange}
              placeholder="Minimum 6 characters"
            />

            <button
              type="submit"
              disabled={loading}
              className="w-full py-2 mt-4 bg-indigo-600 text-white font-semibold rounded-lg"
            >
              {loading ? "Creating account..." : "Create Account"}
            </button>

            <p className="text-center text-sm text-gray-600 dark:text-gray-400 mt-4">
              Already have an account?{" "}
              <Link to="/login" className="text-indigo-600 hover:underline">
                Sign In
              </Link>
            </p>
          </form>
        </div>
      </div>
    </div>
  );
};

/* ================= SMALL INPUT COMPONENT ================= */
const InputField = ({
  icon,
  name,
  value,
  onChange,
  placeholder,
  type = "text",
}) => (
  <div className="flex items-center border rounded-lg px-3 bg-white dark:bg-gray-700 w-full">
    <span className="text-gray-400 mr-2">{icon}</span>
    <input
      type={type}
      name={name}
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      className="w-full py-2 outline-none bg-transparent"
      required
    />
  </div>
);

export default Register;
