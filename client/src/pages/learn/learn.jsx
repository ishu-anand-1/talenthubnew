import { useEffect, useMemo, useState } from "react";
import api from "../../services/api";

/* ===================== CONSTANTS ===================== */
const GENRES = ["all", "dance", "singing", "instruments", "acting"];
const LEVELS = ["all", "beginner", "intermediate", "advanced"];
const PAGE_SIZE = 6;

/* ===================== HELPERS ===================== */
const getEmbedUrl = (url = "") => {
  if (!url) return "";
  if (url.includes("watch?v=")) return url.replace("watch?v=", "embed/");
  if (url.includes("youtu.be/"))
    return url.replace("youtu.be/", "youtube.com/embed/");
  return url;
};

const Learn = () => {
  const [videos, setVideos] = useState([]);
  const [search, setSearch] = useState("");
  const [genre, setGenre] = useState("all");
  const [level, setLevel] = useState("all");
  const [visibleCount, setVisibleCount] = useState(PAGE_SIZE);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [activeVideo, setActiveVideo] = useState(null);

  /* ===================== FETCH VIDEOS ===================== */
  useEffect(() => {
    const fetchVideos = async () => {
      try {
        setLoading(true);
        setError("");

        // ✅ Correct backend route
        const { data } = await api.get("/posts/videos");

        const normalized = Array.isArray(data)
          ? data.map((v) => ({
              ...v,
              title: v.title || "Untitled Lesson",
              description: v.description || "",
              genre: v.genre?.toLowerCase() || "all",
              level: v.level?.toLowerCase() || "all",
              video_url: v.video_url || "",
            }))
          : [];

        setVideos(normalized);
      } catch (err) {
        console.error("❌ Error fetching learning videos:", err);
        setError("Failed to load learning content.");
      } finally {
        setLoading(false);
      }
    };

    fetchVideos();
  }, []);

  /* ===================== FILTER ===================== */
  const filteredVideos = useMemo(() => {
    const q = search.toLowerCase().trim();

    return videos.filter((v) => {
      const matchGenre = genre === "all" || v.genre === genre;
      const matchLevel = level === "all" || v.level === level;

      const matchSearch =
        v.title.toLowerCase().includes(q) ||
        v.description.toLowerCase().includes(q);

      return matchGenre && matchLevel && matchSearch;
    });
  }, [videos, genre, level, search]);

  /* ===================== UI ===================== */
  return (
    <main className="min-h-screen bg-gray-50 dark:bg-gray-950 text-gray-900 dark:text-gray-100">

      {/* HERO */}
      <section className="pt-24 pb-14 px-6 text-center max-w-5xl mx-auto">
        <h1 className="text-4xl md:text-5xl font-extrabold mb-3">
          Learning
        </h1>
        <p className="text-lg text-gray-600 dark:text-gray-400">
          Upgrade your skills with industry professionals
        </p>
      </section>

      {/* FILTER BAR */}
      <section className="sticky top-16 z-30 bg-gray-50 dark:bg-gray-950 border-b border-gray-200 dark:border-gray-800">
        <div className="max-w-7xl mx-auto px-6 py-4 flex flex-col md:flex-row gap-4 justify-between">
          <input
            type="text"
            placeholder="Search lessons..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="px-4 py-2 rounded-lg border bg-white dark:bg-gray-900"
          />

          <div className="flex gap-3">
            <select
              value={genre}
              onChange={(e) => setGenre(e.target.value)}
              className="px-4 py-2 rounded-lg border bg-white dark:bg-gray-900"
            >
              {GENRES.map((g) => (
                <option key={g} value={g}>
                  {g}
                </option>
              ))}
            </select>

            <select
              value={level}
              onChange={(e) => setLevel(e.target.value)}
              className="px-4 py-2 rounded-lg border bg-white dark:bg-gray-900"
            >
              {LEVELS.map((l) => (
                <option key={l} value={l}>
                  {l}
                </option>
              ))}
            </select>
          </div>
        </div>
      </section>

      {/* GRID */}
      <section className="max-w-7xl mx-auto px-6 py-12">
        {loading ? (
          <p className="text-center text-gray-400">Loading lessons...</p>
        ) : error ? (
          <p className="text-center text-red-500">{error}</p>
        ) : filteredVideos.length === 0 ? (
          <p className="text-center text-gray-500">No lessons found.</p>
        ) : (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
              {filteredVideos.slice(0, visibleCount).map((video) => (
                <div
                  key={video._id}
                  onClick={() => setActiveVideo(video)}
                  className="bg-white dark:bg-gray-900 rounded-2xl shadow hover:shadow-lg cursor-pointer overflow-hidden"
                >
                  <div className="relative pb-[56.25%] bg-black">
                    {video.video_url?.includes("youtube") ? (
                      <iframe
                        src={getEmbedUrl(video.video_url)}
                        className="absolute inset-0 w-full h-full"
                        title={video.title}
                      />
                    ) : (
                      <video
                        src={video.video_url}
                        className="absolute inset-0 w-full h-full object-cover"
                      />
                    )}
                  </div>

                  <div className="p-4">
                    <h3 className="font-bold">{video.title}</h3>
                    <p className="text-sm text-gray-500 line-clamp-2">
                      {video.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            {visibleCount < filteredVideos.length && (
              <div className="text-center mt-10">
                <button
                  onClick={() => setVisibleCount((p) => p + PAGE_SIZE)}
                  className="px-6 py-2 bg-indigo-600 text-white rounded-lg"
                >
                  Load More
                </button>
              </div>
            )}
          </>
        )}
      </section>

      {/* MODAL */}
      {activeVideo && (
        <div
          className="fixed inset-0 bg-black/70 flex items-center justify-center z-50"
          onClick={() => setActiveVideo(null)}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="bg-white dark:bg-gray-900 rounded-xl max-w-3xl w-full"
          >
            <div className="relative pb-[56.25%] bg-black">
              <iframe
                src={getEmbedUrl(activeVideo.video_url)}
                className="absolute inset-0 w-full h-full"
                title={activeVideo.title}
              />
            </div>

            <div className="p-6">
              <h2 className="text-xl font-bold">{activeVideo.title}</h2>
              <p className="text-gray-500 mt-2">
                {activeVideo.description}
              </p>
            </div>
          </div>
        </div>
      )}
    </main>
  );
};

export default Learn;
