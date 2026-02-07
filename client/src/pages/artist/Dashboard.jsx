import { useEffect, useCallback, useState } from "react";
import api from "../../services/api";

/* ===================== CONSTANTS ===================== */
const CATEGORIES = ["Dance", "Singing", "Instrument"];
const GENRES = ["Hip-hop", "Jazz", "Classical", "Pop", "Rock"];
const LEVELS = ["Beginner", "Intermediate", "Advanced"];

/* ===================== HELPERS ===================== */
const getEmbedUrl = (url = "") => {
  if (!url) return "";
  if (url.includes("watch?v=")) return url.replace("watch?v=", "embed/");
  if (url.includes("youtu.be/"))
    return url.replace("youtu.be/", "youtube.com/embed/");
  return url;
};

const Dashboard = () => {
  const [form, setForm] = useState({
    title: "",
    description: "",
    category: "Dance",
    genre: "Hip-hop",
    level: "Beginner",
    video_url: "",
  });

  const [videos, setVideos] = useState([]);
  const [uploading, setUploading] = useState(false);
  const [fetching, setFetching] = useState(true);
  const [error, setError] = useState("");

  /* ===================== FETCH POSTS ===================== */
  const fetchVideos = useCallback(async () => {
    try {
      setFetching(true);

      // Backend route: GET /api/posts
      const { data } = await api.get("/posts");

      setVideos(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error("❌ Failed to fetch videos:", err);
    } finally {
      setFetching(false);
    }
  }, []);

  useEffect(() => {
    fetchVideos();
  }, [fetchVideos]);

  /* ===================== FORM HANDLERS ===================== */
  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const resetForm = () => {
    setForm({
      title: "",
      description: "",
      category: "Dance",
      genre: "Hip-hop",
      level: "Beginner",
      video_url: "",
    });
  };

  /* ===================== CREATE POST ===================== */
  const handleUpload = async (e) => {
    e.preventDefault();
    setError("");
    setUploading(true);

    try {
      // Backend route: POST /api/posts
      await api.post("/posts", form);

      resetForm();
      fetchVideos();
    } catch (err) {
      setError(err.message || "Upload failed");
    } finally {
      setUploading(false);
    }
  };

  /* ===================== UI ===================== */
  return (
    <div className="max-w-7xl mx-auto px-6 py-10 text-gray-900 dark:text-gray-100">
      <div className="mb-10">
        <h1 className="text-3xl font-bold mb-2">Welcome back 👋</h1>
        <p className="text-gray-500">
          Upload performances and get discovered by recruiters.
        </p>
      </div>

      {/* ================= STATS ================= */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-12">
        <StatCard label="Uploads" value={videos.length} />
        <StatCard label="Profile Views" value="—" />
        <StatCard label="Followers" value="—" />
        <StatCard label="Rank" value="—" />
      </div>

      {/* ================= UPLOAD FORM ================= */}
      <section className="bg-white dark:bg-gray-900 rounded-2xl shadow-lg p-6 mb-14">
        <h2 className="text-xl font-semibold mb-4">📤 Upload New Talent</h2>

        {error && (
          <div className="mb-4 bg-red-100 text-red-600 text-sm p-3 rounded">
            {error}
          </div>
        )}

        <form onSubmit={handleUpload} className="space-y-4">
          <input
            name="title"
            placeholder="Performance title"
            value={form.title}
            onChange={handleChange}
            required
            className="w-full px-4 py-2 rounded-lg border"
          />

          <textarea
            name="description"
            placeholder="Description"
            value={form.description}
            onChange={handleChange}
            className="w-full px-4 py-2 rounded-lg border"
          />

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <select name="category" value={form.category} onChange={handleChange}>
              {CATEGORIES.map((c) => <option key={c}>{c}</option>)}
            </select>

            <select name="genre" value={form.genre} onChange={handleChange}>
              {GENRES.map((g) => <option key={g}>{g}</option>)}
            </select>

            <select name="level" value={form.level} onChange={handleChange}>
              {LEVELS.map((l) => <option key={l}>{l}</option>)}
            </select>
          </div>

          <input
            name="video_url"
            placeholder="Video URL"
            value={form.video_url}
            onChange={handleChange}
            required
            className="w-full px-4 py-2 rounded-lg border"
          />

          <button
            disabled={uploading}
            className="w-full bg-indigo-600 text-white py-2 rounded-lg"
          >
            {uploading ? "Uploading..." : "Publish Video"}
          </button>
        </form>
      </section>

      {/* ================= VIDEOS ================= */}
      <section>
        <h2 className="text-2xl font-bold mb-6">🎬 My Uploads</h2>

        {fetching ? (
          <p>Loading videos...</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {videos.map((v) => (
              <div key={v._id} className="bg-white rounded-xl shadow overflow-hidden">
                <div className="relative pb-[56.25%] bg-black">
                  <iframe
                    src={getEmbedUrl(v.video_url)}
                    className="absolute inset-0 w-full h-full"
                    allowFullScreen
                    title={v.title}
                  />
                </div>
                <div className="p-4">
                  <h3 className="font-semibold">{v.title}</h3>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
};

const StatCard = ({ label, value }) => (
  <div className="bg-white dark:bg-gray-900 rounded-xl shadow p-5">
    <p className="text-sm text-gray-500">{label}</p>
    <p className="text-2xl font-bold mt-1">{value}</p>
  </div>
);

export default Dashboard;
