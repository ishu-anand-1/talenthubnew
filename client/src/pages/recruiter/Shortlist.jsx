import { useEffect, useState, useCallback } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Star, MessageSquare, Trash2 } from "lucide-react";
import RecruiterTalentCard from "../../components/cards/RecruiterTalentCard";
import api from "../../services/api";

const Shortlist = () => {
  const navigate = useNavigate();

  const [shortlisted, setShortlisted] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  /* ===================== FETCH SHORTLIST ===================== */
  useEffect(() => {
    let mounted = true;

    const fetchShortlist = async () => {
      try {
        setLoading(true);
        setError("");

        const { data } = await api.get("/recruiter/shortlist");

        if (!mounted) return;

        const normalized = Array.isArray(data)
          ? data.map((v) => ({
              ...v,
              title: v.title || "Untitled",
              user_id: v.user_id || {},
            }))
          : [];

        setShortlisted(normalized);
      } catch (err) {
        console.error("❌ Failed to load shortlist:", err);
        setError("Failed to load shortlist.");
        setShortlisted([]);
      } finally {
        mounted && setLoading(false);
      }
    };

    fetchShortlist();

    return () => {
      mounted = false;
    };
  }, []);

  /* ===================== REMOVE SHORTLIST ===================== */
  const removeFromShortlist = useCallback(async (id) => {
    try {
      // optimistic UI
      setShortlisted((prev) =>
        prev.filter((item) => item._id !== id)
      );

      await api.delete(`/recruiter/shortlist/${id}`);
    } catch (err) {
      console.error("❌ Remove shortlist failed:", err);
    }
  }, []);

  /* ===================== MESSAGE ===================== */
  const handleMessage = (video) => {
    if (!video?.user_id?._id) return;
    navigate(`/chat/${video.user_id._id}`);
  };

  /* ===================== UI ===================== */
  return (
    <div className="max-w-7xl mx-auto px-6 py-10">
      {/* HEADER */}
      <div className="mb-10">
        <h1 className="text-3xl font-bold">
          📌 Shortlisted Talent
        </h1>
        <p className="text-gray-500 mt-2">
          Artists you’ve saved for potential collaboration or hiring.
        </p>
      </div>

      {/* STATES */}
      {loading ? (
        <p className="text-gray-500">Loading shortlist...</p>
      ) : error ? (
        <p className="text-red-500">{error}</p>
      ) : shortlisted.length === 0 ? (
        <div className="text-center py-20 bg-white dark:bg-gray-900 rounded-2xl shadow">
          <Star size={42} className="mx-auto text-indigo-600 mb-4" />

          <h3 className="text-lg font-semibold mb-2">
            No shortlisted artists yet
          </h3>

          <p className="text-gray-500 mb-6">
            Start discovering talent and shortlist your favorites.
          </p>

          <Link
            to="/recruiter/discover"
            className="inline-flex px-6 py-3 rounded-full bg-indigo-600 text-white font-medium hover:bg-indigo-700 transition"
          >
            Discover Talent
          </Link>
        </div>
      ) : (
        /* SHORTLIST GRID */
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {shortlisted.map((video) => (
            <div key={video._id} className="relative group">
              <RecruiterTalentCard
                video={video}
                onShortlist={() => {}}
                onMessage={() => handleMessage(video)}
              />

              {/* ACTION BAR */}
              <div
                className="
                  absolute top-3 right-3
                  flex gap-2
                  opacity-0 group-hover:opacity-100
                  transition
                "
              >
                <Link
                  to={`/profile/${video.user_id?._id}`}
                  className="
                    bg-white dark:bg-gray-800
                    p-2 rounded-full shadow
                    hover:scale-105 transition
                  "
                >
                  <MessageSquare size={16} />
                </Link>

                <button
                  onClick={() => removeFromShortlist(video._id)}
                  className="
                    bg-red-600 text-white
                    p-2 rounded-full shadow
                    hover:scale-105 transition
                  "
                >
                  <Trash2 size={16} />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Shortlist;
