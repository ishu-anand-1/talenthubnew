import { useEffect, useMemo, useState } from "react";
import { useParams } from "react-router-dom";
import api from "../../services/api";

/* ===================== HELPERS ===================== */
const getEmbedUrl = (url = "") => {
  if (!url) return "";

  if (url.includes("watch?v="))
    return url.replace("watch?v=", "embed/");

  if (url.includes("youtu.be/"))
    return url.replace("youtu.be/", "youtube.com/embed/");

  return url;
};

const normalize = (value = "") =>
  value?.toString().toLowerCase().trim();

/* ===================== COMPONENT ===================== */
const CategoryPage = () => {
  const { category } = useParams();

  const normalizedCategory = useMemo(
    () => normalize(category),
    [category]
  );

  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [activeVideo, setActiveVideo] = useState(null);

  /* ===================== FETCH CATEGORY VIDEOS ===================== */
  useEffect(() => {
    let mounted = true;

    const fetchCategoryVideos = async () => {
      try {
        setLoading(true);
        setError("");

        const { data } = await api.get("/videos/get-all-video");

        if (!mounted) return;

        const filtered = Array.isArray(data)
          ? data.filter(
              (v) =>
                normalize(v.category) === normalizedCategory
            )
          : [];

        setVideos(filtered);
      } catch (err) {
        console.error("❌ Category fetch failed:", err);
        setError("Failed to load category videos.");
        setVideos([]);
      } finally {
        mounted && setLoading(false);
      }
    };

    if (normalizedCategory) fetchCategoryVideos();

    return () => {
      mounted = false;
    };
  }, [normalizedCategory]);

  /* ===================== UI ===================== */
  return (
    <div className="max-w-7xl mx-auto px-6 py-10">
      {/* HEADER */}
      <div className="mb-10 text-center">
        <h1 className="text-4xl font-extrabold capitalize">
          {category} Talent
        </h1>
        <p className="text-gray-500 mt-2">
          Explore top {category} performances from creators worldwide.
        </p>
      </div>

      {/* STATES */}
      {loading ? (
        <p className="text-center text-gray-500">
          Loading {category} videos...
        </p>
      ) : error ? (
        <p className="text-center text-red-500">{error}</p>
      ) : videos.length === 0 ? (
        <div className="text-center py-20 bg-white dark:bg-gray-900 rounded-2xl shadow">
          <h3 className="text-lg font-semibold mb-2">
            No {category} videos found
          </h3>
          <p className="text-gray-500">
            Be the first to upload talent in this category.
          </p>
        </div>
      ) : (
        /* GRID */
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {videos.map((video) => (
            <div
              key={video._id}
              onClick={() => setActiveVideo(video)}
              className="
                cursor-pointer
                bg-white dark:bg-gray-800
                rounded-xl shadow-lg
                overflow-hidden
                hover:-translate-y-1 hover:shadow-2xl
                transition
              "
            >
              {/* VIDEO PREVIEW */}
              <div className="relative pb-[56.25%] bg-black">
                {video.video_url?.includes("youtube") ? (
                  <iframe
                    src={getEmbedUrl(video.video_url)}
                    className="absolute inset-0 w-full h-full pointer-events-none"
                    title={video.title || "Talent video"}
                  />
                ) : (
                  <video
                    src={video.video_url}
                    className="absolute inset-0 w-full h-full object-cover pointer-events-none"
                  />
                )}
              </div>

              {/* INFO */}
              <div className="p-4 space-y-2">
                <h3 className="font-bold truncate">
                  {video.title || "Untitled Performance"}
                </h3>

                <p className="text-sm text-gray-500 line-clamp-2">
                  {video.description || "No description provided."}
                </p>

                <div className="flex justify-between text-xs text-gray-500">
                  <span>🎵 {video.genre || "N/A"}</span>
                  <span>📈 {video.level || "N/A"}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* ================= VIDEO MODAL ================= */}
      {activeVideo && (
        <div
          className="fixed inset-0 z-50 bg-black/70 flex items-center justify-center px-4"
          onClick={() => setActiveVideo(null)}
        >
          <div
            className="bg-white dark:bg-gray-900 rounded-xl max-w-4xl w-full overflow-hidden shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="relative pb-[56.25%] bg-black">
              {activeVideo.video_url?.includes("youtube") ? (
                <iframe
                  src={getEmbedUrl(activeVideo.video_url)}
                  className="absolute inset-0 w-full h-full"
                  allowFullScreen
                  title={activeVideo.title}
                />
              ) : (
                <video
                  src={activeVideo.video_url}
                  controls
                  className="absolute inset-0 w-full h-full object-cover"
                />
              )}
            </div>

            <div className="p-6 space-y-3">
              <h2 className="text-xl font-bold">
                {activeVideo.title}
              </h2>

              <p className="text-gray-500">
                {activeVideo.description}
              </p>

              <div className="flex flex-wrap gap-4 text-sm text-gray-600">
                <span>🎭 {activeVideo.category}</span>
                <span>🎵 {activeVideo.genre}</span>
                <span>📈 {activeVideo.level}</span>
              </div>

              <button
                onClick={() => setActiveVideo(null)}
                className="mt-4 px-5 py-2 rounded-lg bg-red-600 text-white hover:bg-red-700 transition"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CategoryPage;
