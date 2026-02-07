import { useEffect, useMemo, useState } from "react";
import { useParams } from "react-router-dom";
import api from "../../services/api";

/* ===================== HELPERS ===================== */
const normalize = (value = "") =>
  value.toString().toLowerCase().trim();

const getEmbedUrl = (url = "") => {
  if (!url) return "";

  if (url.includes("watch?v="))
    return url.replace("watch?v=", "embed/");

  if (url.includes("youtu.be/"))
    return url.replace("youtu.be/", "youtube.com/embed/");

  return url;
};

const isYouTube = (url = "") =>
  url.includes("youtube.com") || url.includes("youtu.be");

/* ===================== COMPONENT ===================== */
const VideoCategoryPage = () => {
  const { category } = useParams();

  const normalizedCategory = useMemo(
    () => normalize(category),
    [category]
  );

  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  /* ===================== FETCH VIDEOS ===================== */
  useEffect(() => {
    let mounted = true;

    const fetchVideos = async () => {
      try {
        setLoading(true);
        setError("");

        const { data } = await api.get(
          `/videos/category/${normalizedCategory}`
        );

        if (!mounted) return;

        const normalized = Array.isArray(data)
          ? data.map((v) => ({
              ...v,
              title: v.title || "Untitled Video",
              description: v.description || "",
              genre: v.genre || "N/A",
              level: v.level || "N/A",
            }))
          : [];

        setVideos(normalized);
      } catch (err) {
        console.error("❌ Error fetching category videos:", err);
        mounted && setError("Failed to load videos.");
      } finally {
        mounted && setLoading(false);
      }
    };

    if (normalizedCategory) fetchVideos();

    return () => {
      mounted = false;
    };
  }, [normalizedCategory]);

  /* ===================== UI ===================== */
  return (
    <div className="max-w-7xl mx-auto px-6 py-10 min-h-screen">
      {/* HEADER */}
      <div className="text-center mb-8">
        <h1 className="text-4xl font-extrabold capitalize">
          {category} Videos
        </h1>

        {!loading && !error && (
          <p className="text-sm text-gray-400 mt-2">
            Showing {videos.length} video
            {videos.length !== 1 && "s"}
          </p>
        )}
      </div>

      {/* STATES */}
      {loading ? (
        <p className="text-center text-gray-400 mt-20">
          Loading {category} videos...
        </p>
      ) : error ? (
        <p className="text-center text-red-500 mt-20">
          {error}
        </p>
      ) : videos.length === 0 ? (
        <p className="text-center text-gray-500 mt-20">
          No {category} videos found.
        </p>
      ) : (
        /* GRID */
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {videos.map((video) => (
            <div
              key={video._id}
              className="bg-white dark:bg-gray-900 rounded-2xl shadow-lg overflow-hidden hover:-translate-y-1 hover:shadow-2xl transition"
            >
              {/* VIDEO */}
              <div className="relative pb-[56.25%] bg-black">
                {video.video_url ? (
                  isYouTube(video.video_url) ? (
                    <iframe
                      src={getEmbedUrl(video.video_url)}
                      className="absolute inset-0 w-full h-full"
                      allowFullScreen
                      loading="lazy"
                      title={video.title}
                    />
                  ) : (
                    <video
                      src={video.video_url}
                      controls
                      className="absolute inset-0 w-full h-full object-cover"
                    />
                  )
                ) : (
                  <div className="absolute inset-0 flex items-center justify-center text-gray-400 text-sm">
                    No video available
                  </div>
                )}
              </div>

              {/* INFO */}
              <div className="p-4 space-y-2">
                <h2 className="font-semibold truncate">
                  {video.title}
                </h2>

                <p className="text-xs text-gray-500 line-clamp-2">
                  {video.description || "No description available."}
                </p>

                <div className="flex justify-between text-xs text-gray-400">
                  <span>🎵 {video.genre}</span>
                  <span>📈 {video.level}</span>
                </div>

                {video.user_id?.name && (
                  <p className="text-xs italic text-gray-400">
                    By {video.user_id.name}
                  </p>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default VideoCategoryPage;
