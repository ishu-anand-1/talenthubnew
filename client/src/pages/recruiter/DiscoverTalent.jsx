import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../services/api";
import RecruiterTalentCard from "../../components/cards/RecruiterTalentCard";

/* ===================== CONSTANTS ===================== */
const CATEGORIES = [
  "All",
  "Dance",
  "Singing",
  "Instruments",
  "Acting",
  "Photography",
];

const DiscoverTalent = () => {
  const navigate = useNavigate();

  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(true);

  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("All");

  /* ===================== FETCH TALENT ===================== */
  useEffect(() => {
    let mounted = true;

    const fetchTalent = async () => {
      try {
        setLoading(true);

        const { data } = await api.get("/posts/videos"); // ✅ corrected endpoint

        if (!mounted) return;

        const normalized = Array.isArray(data)
          ? data.map((v) => ({
              ...v,
              title: v.title || "",
              category: v.category || "All",
              artistName:
                v.user_id?.name ||
                `${v.user_id?.name || ""} ${v.user_id?.lastname || ""}`,
            }))
          : [];

        setVideos(normalized);
      } catch (err) {
        console.error("❌ Failed to fetch talent:", err);
        setVideos([]);
      } finally {
        mounted && setLoading(false);
      }
    };

    fetchTalent();

    return () => {
      mounted = false;
    };
  }, []);

  /* ===================== FILTER LOGIC ===================== */
  const filteredVideos = useMemo(() => {
    const q = search.toLowerCase();

    return videos.filter((video) => {
      const matchCategory =
        category === "All" ||
        video.category?.toLowerCase() === category.toLowerCase();

      const matchSearch =
        video.title?.toLowerCase().includes(q) ||
        video.artistName?.toLowerCase().includes(q);

      return matchCategory && matchSearch;
    });
  }, [videos, category, search]);

  /* ===================== ACTIONS ===================== */
  const handleShortlist = async (video) => {
    try {
      console.log("⭐ Shortlisted:", video._id);

      // Example future API
      // await api.post("/recruiter/shortlist", { videoId: video._id });

    } catch (err) {
      console.error("Shortlist failed:", err);
    }
  };

  const handleMessage = (video) => {
    if (!video.user_id?._id) return;
    navigate(`/chat/${video.user_id._id}`);
  };

  /* ===================== UI ===================== */
  return (
    <div className="max-w-7xl mx-auto px-6 py-10">
      {/* HEADER */}
      <div className="mb-10">
        <h1 className="text-3xl font-bold">Discover Talent</h1>
        <p className="text-gray-500 mt-2">
          The world’s most talented creators in one place.
        </p>
      </div>

      {/* SEARCH */}
      <div className="flex flex-col md:flex-row md:items-center gap-4 mb-8">
        <input
          type="text"
          placeholder="Search artists or titles..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full md:w-80 px-4 py-2 rounded-lg border bg-white dark:bg-gray-900 focus:ring-2 focus:ring-indigo-500"
        />
      </div>

      {/* CATEGORY FILTER */}
      <div className="flex gap-3 flex-wrap mb-10">
        {CATEGORIES.map((cat) => (
          <button
            key={cat}
            onClick={() => setCategory(cat)}
            className={`px-4 py-2 rounded-full text-sm font-medium transition ${
              category === cat
                ? "bg-indigo-600 text-white"
                : "bg-gray-100 dark:bg-gray-800 text-gray-600"
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* CONTENT */}
      {loading ? (
        <p className="text-gray-500">Loading talent...</p>
      ) : filteredVideos.length === 0 ? (
        <p className="text-gray-500">
          No talent found. Try another filter.
        </p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {filteredVideos.map((video) => (
            <RecruiterTalentCard
              key={video._id}
              video={video}
              onShortlist={() => handleShortlist(video)}
              onMessage={() => handleMessage(video)}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default DiscoverTalent;
