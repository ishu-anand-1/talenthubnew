import { useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../services/api";

/* ===================== CONSTANTS ===================== */
const CATEGORIES = ["Dance", "Singing", "Instrument"];
const GENRES = ["Hip-hop", "Classical", "Jazz", "Pop"];
const LEVELS = ["Beginner", "Intermediate", "Advanced"];

const INITIAL_FORM = {
  title: "",
  description: "",
  category: "Dance",
  genre: "Hip-hop",
  level: "Beginner",
  video_url: "",
};

const Upload = () => {
  const navigate = useNavigate();

  const [form, setForm] = useState(INITIAL_FORM);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");

  /* ===================== HANDLERS ===================== */
  const handleChange = useCallback((e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!form.title.trim() || !form.video_url.trim()) {
      setError("Video title and video URL are required.");
      return;
    }

    try {
      setLoading(true);

      // ✅ Correct backend route
      await api.post("/posts", {
        ...form,
        title: form.title.trim(),
        description: form.description.trim(),
      });

      setSuccess(true);
      setForm(INITIAL_FORM);

      setTimeout(() => {
        navigate("/dashboard");
      }, 1200);
    } catch (err) {
      console.error("❌ Upload failed:", err);
      setError(
        err?.response?.data?.error ||
        err?.message ||
        "Upload failed. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  /* ===================== UI ===================== */
  return (
    <div className="max-w-3xl mx-auto px-6 py-12 text-gray-900 dark:text-gray-100">
      <div className="bg-white dark:bg-gray-900 rounded-3xl shadow-xl p-8">
        <h1 className="text-3xl font-bold mb-2 text-center">
          Upload Your Talent
        </h1>

        <p className="text-center text-gray-500 mb-8">
          Showcase your best work to recruiters.
        </p>

        {success && (
          <div className="mb-6 bg-green-100 text-green-700 p-4 rounded-lg text-center">
            🎉 Upload successful! Your video is now live.
          </div>
        )}

        {error && (
          <div className="mb-6 bg-red-100 text-red-600 p-4 rounded-lg">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <input
            type="url"
            name="video_url"
            placeholder="YouTube / Cloudinary video URL"
            value={form.video_url}
            onChange={handleChange}
            className="w-full px-4 py-2 rounded-lg border bg-white dark:bg-gray-800"
            required
          />

          <input
            type="text"
            name="title"
            placeholder="Video title"
            value={form.title}
            onChange={handleChange}
            className="w-full px-4 py-2 rounded-lg border bg-white dark:bg-gray-800"
            required
          />

          <textarea
            name="description"
            placeholder="Description"
            value={form.description}
            onChange={handleChange}
            rows={3}
            className="w-full px-4 py-2 rounded-lg border bg-white dark:bg-gray-800"
          />

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <select
              name="category"
              value={form.category}
              onChange={handleChange}
              className="px-3 py-2 rounded-lg border bg-white dark:bg-gray-800"
            >
              {CATEGORIES.map((c) => (
                <option key={c}>{c}</option>
              ))}
            </select>

            <select
              name="genre"
              value={form.genre}
              onChange={handleChange}
              className="px-3 py-2 rounded-lg border bg-white dark:bg-gray-800"
            >
              {GENRES.map((g) => (
                <option key={g}>{g}</option>
              ))}
            </select>

            <select
              name="level"
              value={form.level}
              onChange={handleChange}
              className="px-3 py-2 rounded-lg border bg-white dark:bg-gray-800"
            >
              {LEVELS.map((l) => (
                <option key={l}>{l}</option>
              ))}
            </select>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 rounded-xl bg-indigo-600 text-white font-semibold hover:bg-indigo-700 transition disabled:opacity-60"
          >
            {loading ? "Publishing..." : "Publish Video"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Upload;
