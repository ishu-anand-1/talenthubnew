import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import api from "../services/api";

export default function CategoryPage() {
  const { category } = useParams();
  const [items, setItems] = useState([]);
  const [playingIndex, setPlayingIndex] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await api.get("/videos/get-all-video");

        const normalizedCategory = category.toLowerCase();

        const filtered =
          normalizedCategory === "playlist"
            ? res.data.filter(
                (v) => v.category?.toLowerCase() === "playlist"
              )
            : res.data.filter(
                (v) => v.category?.toLowerCase() === normalizedCategory
              );

        setItems(filtered);
      } catch (err) {
        console.error("❌ Failed to fetch category videos:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [category]);

  const getEmbedUrl = (url) => {
    if (!url) return "";
    if (url.includes("watch?v=")) {
      return url.replace("watch?v=", "embed/");
    }
    if (url.includes("youtu.be/")) {
      return url.replace("youtu.be/", "youtube.com/embed/");
    }
    return url;
  };

  if (loading) {
    return <p className="text-center mt-10 text-gray-500">Loading...</p>;
  }

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-6 text-center capitalize">
        {category} Gallery
      </h1>

      {items.length === 0 ? (
        <p className="text-center text-gray-500">
          No {category} videos found.
        </p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {items.map((item, i) => (
            <div
              key={item._id}
              className="bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden hover:scale-105 transition-all duration-300"
              onClick={() =>
                category.toLowerCase() === "playlist" && setPlayingIndex(i)
              }
            >
              {/* ===== PLAYLIST ===== */}
              {category.toLowerCase() === "playlist" ? (
                <>
                  <img
                    src={
                      item.thumbnail_url ||
                      `https://source.unsplash.com/random/400x300?music&sig=${i}`
                    }
                    alt="playlist"
                    className="w-full h-48 object-cover"
                  />
                  <div className="p-4">
                    <h2 className="text-lg font-bold truncate">
                      {item.title}
                    </h2>
                    <p className="text-sm text-gray-600 dark:text-gray-300">
                      {item.description}
                    </p>

                    {playingIndex === i && (
                      <audio
                        src={item.video_url}
                        controls
                        autoPlay
                        className="w-full mt-2"
                      />
                    )}
                  </div>
                </>
              ) : (
                <>
                  {/* ===== VIDEO ===== */}
                  <div className="relative pb-[56.25%]">
                    {item.video_url?.includes("youtube") ? (
                      <iframe
                        className="absolute top-0 left-0 w-full h-full"
                        src={getEmbedUrl(item.video_url)}
                        frameBorder="0"
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                        allowFullScreen
                        title={item.title}
                      />
                    ) : (
                      <video
                        src={item.video_url}
                        controls
                        className="absolute top-0 left-0 w-full h-full object-cover"
                      />
                    )}
                  </div>

                  <div className="p-4">
                    <h2 className="text-lg font-bold truncate">
                      {item.title}
                    </h2>
                    <p className="text-sm text-gray-600 dark:text-gray-300">
                      {item.description}
                    </p>
                    <p className="text-sm">🎵 Genre: {item.genre || "N/A"}</p>
                    <p className="text-sm">📈 Level: {item.level || "N/A"}</p>
                  </div>
                </>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
