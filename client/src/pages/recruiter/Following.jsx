import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { UserPlus, MessageCircle } from "lucide-react";
import api from "../../services/api";

const Following = () => {
  const navigate = useNavigate();

  const [artists, setArtists] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  /* ===================== FETCH FOLLOWING ===================== */
  useEffect(() => {
    let mounted = true;

    const fetchFollowing = async () => {
      try {
        setLoading(true);
        setError("");

        // Recruiter following list
        const { data } = await api.get("/recruiter/following");

        if (!mounted) return;

        const normalized = Array.isArray(data)
          ? data.map((a) => ({
              ...a,
              name: a.name || "Artist",
              email: a.email || "",
            }))
          : [];

        setArtists(normalized);
      } catch (err) {
        console.error("❌ Failed to load following:", err);
        setError("Unable to load followed artists.");
        setArtists([]);
      } finally {
        mounted && setLoading(false);
      }
    };

    fetchFollowing();

    return () => {
      mounted = false;
    };
  }, []);

  /* ===================== UI ===================== */
  return (
    <div className="max-w-7xl mx-auto px-6 py-10">
      {/* HEADER */}
      <div className="mb-10">
        <h1 className="text-3xl font-bold">⭐ Following</h1>
        <p className="text-gray-500 mt-2">
          Artists you follow to stay updated with their latest work.
        </p>
      </div>

      {/* LOADING */}
      {loading && (
        <p className="text-gray-500">Loading followed artists...</p>
      )}

      {/* ERROR */}
      {!loading && error && (
        <div className="bg-red-100 text-red-600 p-4 rounded-lg">
          {error}
        </div>
      )}

      {/* EMPTY STATE */}
      {!loading && !error && artists.length === 0 && (
        <div className="text-center py-20 bg-white dark:bg-gray-900 rounded-2xl shadow">
          <UserPlus
            className="mx-auto mb-4 text-indigo-600"
            size={42}
          />

          <h3 className="text-lg font-semibold mb-2">
            No followed artists yet
          </h3>

          <p className="text-gray-500 mb-6">
            Follow talented creators to track their journey.
          </p>

          <Link
            to="/talent"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-indigo-600 text-white hover:bg-indigo-700 transition"
          >
            Discover Talent
          </Link>
        </div>
      )}

      {/* GRID */}
      {!loading && !error && artists.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {artists.map((artist) => (
            <div
              key={artist._id}
              className="bg-white dark:bg-gray-900 rounded-2xl shadow-lg p-6 hover:-translate-y-1 hover:shadow-xl transition"
            >
              {/* AVATAR */}
              <div className="w-12 h-12 rounded-full bg-indigo-600 text-white flex items-center justify-center font-bold text-lg mb-4">
                {artist.name?.charAt(0).toUpperCase()}
              </div>

              {/* INFO */}
              <h3 className="font-bold text-lg truncate">
                {artist.name}
              </h3>

              <p className="text-sm text-gray-500 mb-4 truncate">
                {artist.email || "No email available"}
              </p>

              {/* ACTIONS */}
              <div className="flex gap-3">
                <Link
                  to={`/profile/${artist._id}`}
                  className="flex-1 text-center px-4 py-2 rounded-lg bg-indigo-600 text-white text-sm hover:bg-indigo-700 transition"
                >
                  View Profile
                </Link>

                <button
                  onClick={() => navigate(`/chat/${artist._id}`)}
                  className="flex-1 px-4 py-2 rounded-lg border text-sm flex items-center justify-center gap-1 hover:bg-gray-100 dark:hover:bg-gray-800 transition"
                >
                  <MessageCircle size={14} />
                  Message
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Following;
