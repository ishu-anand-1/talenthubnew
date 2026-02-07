import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import api from "../../services/api";

/* ===================== CONSTANTS ===================== */
const CATEGORIES = ["All", "Dance", "Singing", "Instrument"];
const GENRES = ["All", "Hip-hop", "Classical", "Jazz", "Pop"];
const LEVELS = ["All", "Beginner", "Intermediate", "Advanced"];

/* ===================== HELPERS ===================== */
const normalize = (value = "") => value.toString().toLowerCase().trim();

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
const Talent = () => {
  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [search, setSearch] = useState("");
  const [filters, setFilters] = useState({
    category: "All",
    genre: "All",
    level: "All",
  });

  /* ===================== FETCH TALENT ===================== */
  useEffect(() => {
    let mounted = true;

    const fetchVideos = async () => {
      try {
        setLoading(true);
        setError("");

        const { data } = await api.get("/videos/get-all-video");

        if (!mounted) return;

        const normalized = Array.isArray(data)
          ? data.map((v) => ({
              ...v,
              title: v.title || "",
              description: v.description || "",
              category: v.category || "All",
              genre: normalize(v.genre),
              level: normalize(v.level),
            }))
          : [];

        setVideos(normalized);
      } catch (err) {
        console.error("❌ Failed to fetch talent:", err);
        mounted && setError("Failed to load talent.");
      } finally {
        mounted && setLoading(false);
      }
    };

    fetchVideos();

    return () => {
      mounted = false;
    };
  }, []);

  /* ===================== FILTER LOGIC ===================== */
  const filteredVideos = useMemo(() => {
    const term = normalize(search);

    return videos.filter((v) => {
      const matchCategory =
        filters.category === "All" ||
        normalize(v.category) === normalize(filters.category);

      const matchGenre =
        filters.genre === "All" ||
        v.genre === normalize(filters.genre);

      const matchLevel =
        filters.level === "All" ||
        v.level === normalize(filters.level);

      const matchSearch =
        v.title.toLowerCase().includes(term) ||
        v.description.toLowerCase().includes(term);

      return (
        matchCategory &&
        matchGenre &&
        matchLevel &&
        matchSearch
      );
    });
  }, [videos, filters, search]);

  /* ===================== UI ===================== */
  return (
    <div className="max-w-7xl mx-auto px-6 py-10 min-h-screen">
      {/* HEADER */}
      <div className="text-center mb-8">
        <h1 className="text-4xl font-extrabold">
          🎭 Discover Talent
        </h1>
        <p className="text-gray-500 mt-2">
          The world’s most talented creators in one place
        </p>
      </div>

      {!loading && !error && (
        <p className="text-center text-sm text-gray-400 mb-6">
          Showing {filteredVideos.length} result
          {filteredVideos.length !== 1 && "s"}
        </p>
      )}

      {/* SEARCH */}
      <div className="max-w-4xl mx-auto mb-6">
        <input
          type="text"
          placeholder="🔍 Search artists, skills, performances..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full px-4 py-3 rounded-xl border bg-white dark:bg-gray-900 focus:outline-none focus:ring-2 focus:ring-indigo-500"
        />
      </div>

      {/* FILTERS */}
      <div className="flex flex-wrap justify-center gap-4 mb-10">
        {[CATEGORIES, GENRES, LEVELS].map((list, i) => {
          const key = ["category", "genre", "level"][i];

          return (
            <select
              key={key}
              value={filters[key]}
              onChange={(e) =>
                setFilters((p) => ({
                  ...p,
                  [key]: e.target.value,
                }))
              }
              className="px-4 py-2 rounded-lg border bg-white dark:bg-gray-900"
            >
              {list.map((item) => (
                <option key={item}>{item}</option>
              ))}
            </select>
          );
        })}
      </div>

      {/* CONTENT */}
      {loading ? (
        <p className="text-center text-gray-400 mt-20">
          Loading talent...
        </p>
      ) : error ? (
        <p className="text-center text-red-500 mt-20">
          {error}
        </p>
      ) : filteredVideos.length === 0 ? (
        <p className="text-center text-gray-500 mt-20">
          No talent found matching your filters.
        </p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {filteredVideos.map((video) => (
            <div
              key={video._id}
              className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg overflow-hidden hover:-translate-y-1 hover:shadow-2xl transition"
            >
              {/* VIDEO */}
              <div className="relative pb-[56.25%] bg-black">
                {isYouTube(video.video_url) ? (
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
                )}
              </div>

              {/* INFO */}
              <div className="p-4 space-y-2">
                <h2 className="font-bold truncate">
                  {video.title}
                </h2>

                <p className="text-sm text-gray-600 dark:text-gray-300 line-clamp-2">
                  {video.description || "No description provided."}
                </p>

                <div className="flex justify-between text-xs text-gray-500">
                  <span>🎵 {video.genre}</span>
                  <span>📈 {video.level}</span>
                </div>

                {video.user_id?._id && (
                  <Link
                    to={`/profile/${video.user_id._id}`}
                    className="inline-block mt-2 text-indigo-600 text-sm font-medium hover:underline"
                  >
                    View Profile →
                  </Link>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Talent;
