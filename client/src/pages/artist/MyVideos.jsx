import { useEffect, useState, useCallback } from "react";
import api from "../../services/api";

/* ===================== HELPERS ===================== */
const getEmbedUrl = (url = "") => {
  if (!url) return "";
  if (url.includes("watch?v=")) return url.replace("watch?v=", "embed/");
  if (url.includes("youtu.be/"))
    return url.replace("youtu.be/", "youtube.com/embed/");
  return url;
};

const MyVideos = () => {
  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  /* ===================== FETCH MY VIDEOS ===================== */
  const fetchMyVideos = useCallback(async () => {
    try {
      setLoading(true);
      setError("");
      const { data } = await api.get("/videos/my-video");
      setVideos(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error("❌ Failed to fetch my videos:", err);
      setError("Failed to load your uploaded videos.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchMyVideos();
  }, [fetchMyVideos]);

  /* ===================== UI ===================== */
  return (
    <div className="max-w-7xl mx-auto px-6 py-10 text-gray-900 dark:text-gray-100">
      {/* ================= HEADER ================= */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">
          🎬 My Uploaded Videos
        </h1>
        <p className="text-gray-500">
          Manage and review all your published performances.
        </p>
      </div>

      {/* ================= STATES ================= */}
      {loading ? (
        <p className="text-gray-400">Loading your videos...</p>
      ) : error ? (
        <div className="bg-red-100 text-red-600 p-4 rounded-lg">
          {error}
        </div>
      ) : videos.length === 0 ? (
        <div className="bg-white dark:bg-gray-900 rounded-xl shadow p-8 text-center">
          <p className="text-gray-500 mb-4">
            You haven’t uploaded any videos yet.
          </p>
          <p className="text-sm text-gray-400">
            Upload your talent to get discovered by recruiters 🚀
          </p>
        </div>
      ) : (
        /* ================= VIDEOS GRID ================= */
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {videos.map((v) => (
            <div
              key={v._id}
              className="
                bg-white dark:bg-gray-900
                rounded-2xl shadow
                hover:shadow-lg
                transition overflow-hidden
              "
            >
              {/* ================= VIDEO ================= */}
              <div className="relative pb-[56.25%] bg-black">
                {v.video_url?.includes("youtube") ? (
                  <iframe
                    src={getEmbedUrl(v.video_url)}
                    className="absolute inset-0 w-full h-full"
                    allowFullScreen
                    title={v.title}
                  />
                ) : (
                  <video
                    src={v.video_url}
                    controls
                    className="absolute inset-0 w-full h-full object-cover"
                  />
                )}
              </div>

              {/* ================= INFO ================= */}
              <div className="p-4 space-y-1">
                <h3 className="font-semibold truncate">
                  {v.title || "Untitled Video"}
                </h3>

                <p className="text-xs text-gray-500">
                  🎭 {v.category} · 🎵 {v.genre} · 📈 {v.level}
                </p>

                {/* FUTURE ACTIONS */}
                {/* 
                <div className="flex gap-3 mt-3 text-sm">
                  <button className="text-indigo-600 hover:underline">
                    Edit
                  </button>
                  <button className="text-red-500 hover:underline">
                    Delete
                  </button>
                </div>
                */}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default MyVideos;
