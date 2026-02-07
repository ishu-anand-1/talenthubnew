import { useEffect, useState } from "react";
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

const isYouTube = (url = "") =>
  url.includes("youtube.com") || url.includes("youtu.be");

/* ===================== COMPONENT ===================== */
const PlaylistPage = () => {
  const [playlists, setPlaylists] = useState([]);
  const [activePlaylist, setActivePlaylist] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  /* ===================== FETCH PLAYLISTS ===================== */
  useEffect(() => {
    let mounted = true;

    const fetchPlaylists = async () => {
      try {
        setLoading(true);
        setError("");

        const { data } = await api.get("/playlist");

        if (!mounted) return;

        setPlaylists(Array.isArray(data) ? data : []);
      } catch (err) {
        console.error("❌ Failed to fetch playlists:", err);
        mounted && setError("Failed to load playlists.");
      } finally {
        mounted && setLoading(false);
      }
    };

    fetchPlaylists();

    return () => {
      mounted = false;
    };
  }, []);

  /* Prevent background scroll when modal open */
  useEffect(() => {
    document.body.style.overflow = activePlaylist ? "hidden" : "auto";
  }, [activePlaylist]);

  /* ===================== UI ===================== */
  return (
    <div className="max-w-7xl mx-auto px-6 py-10">
      {/* HEADER */}
      <div className="mb-10 text-center">
        <h1 className="text-4xl font-extrabold">
          🎧 Curated Playlists
        </h1>
        <p className="text-gray-500 mt-2">
          Handpicked playlists to inspire creativity & learning.
        </p>
      </div>

      {/* STATES */}
      {loading ? (
        <p className="text-center text-gray-400">
          Loading playlists...
        </p>
      ) : error ? (
        <p className="text-center text-red-500">{error}</p>
      ) : playlists.length === 0 ? (
        <div className="text-center py-20 bg-white dark:bg-gray-900 rounded-2xl shadow">
          <h3 className="text-lg font-semibold mb-2">
            No playlists available
          </h3>
          <p className="text-gray-500">
            Playlists will appear here once created.
          </p>
        </div>
      ) : (
        /* GRID */
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {playlists.map((playlist, index) => (
            <div
              key={playlist._id}
              onClick={() => setActivePlaylist(playlist)}
              className="
                cursor-pointer
                bg-gradient-to-br from-purple-600 to-pink-500
                text-white
                rounded-2xl shadow-lg
                p-5
                hover:-translate-y-1 hover:shadow-2xl
                transition
              "
            >
              <img
                src={
                  playlist.thumbnail_url ||
                  `https://source.unsplash.com/400x300/?music&sig=${index}`
                }
                alt={playlist.name}
                loading="lazy"
                className="rounded-xl mb-4 w-full h-44 object-cover"
              />

              <h3 className="text-lg font-bold truncate">
                {playlist.name}
              </h3>

              <p className="text-sm opacity-90 line-clamp-2">
                {playlist.description || "No description provided."}
              </p>

              <p className="text-xs mt-3 opacity-80">
                🎶 {playlist.song_list?.length || 0} tracks
              </p>
            </div>
          ))}
        </div>
      )}

      {/* ================= MODAL PLAYER ================= */}
      {activePlaylist && (
        <div
          className="fixed inset-0 z-50 bg-black/70 flex items-center justify-center px-4"
          onClick={() => setActivePlaylist(null)}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="bg-white dark:bg-gray-900 rounded-xl max-w-3xl w-full shadow-2xl overflow-hidden"
          >
            <div className="p-6 space-y-4 max-h-[80vh] overflow-y-auto">
              <h2 className="text-2xl font-bold">
                {activePlaylist.name}
              </h2>

              <p className="text-gray-500">
                {activePlaylist.description}
              </p>

              {/* TRACK LIST */}
              <div className="space-y-4 mt-4">
                {activePlaylist.song_list?.length > 0 ? (
                  activePlaylist.song_list.map((song, i) => (
                    <div
                      key={i}
                      className="rounded-lg overflow-hidden bg-black"
                    >
                      {isYouTube(song) ? (
                        <iframe
                          src={getEmbedUrl(song)}
                          className="w-full h-56"
                          allowFullScreen
                          loading="lazy"
                          title={`Track ${i + 1}`}
                        />
                      ) : (
                        <audio
                          src={song}
                          controls
                          className="w-full"
                        />
                      )}
                    </div>
                  ))
                ) : (
                  <p className="text-sm text-gray-500">
                    No tracks available in this playlist.
                  </p>
                )}
              </div>

              <button
                onClick={() => setActivePlaylist(null)}
                className="mt-6 px-6 py-2 rounded-lg bg-red-600 text-white hover:bg-red-700 transition"
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

export default PlaylistPage;
