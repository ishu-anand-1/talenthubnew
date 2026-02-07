import { Link } from "react-router-dom";
import { User } from "lucide-react";

/* ===================== HELPERS ===================== */
const getEmbedUrl = (url = "") => {
  if (!url) return "";
  if (url.includes("watch?v=")) {
    return url.replace("watch?v=", "embed/");
  }
  if (url.includes("youtu.be/")) {
    return url.replace("youtu.be/", "youtube.com/embed/");
  }
  return url;
};

const isYouTube = (url = "") =>
  url.includes("youtube.com") || url.includes("youtu.be");

/* ===================== COMPONENT ===================== */
const TalentCard = ({ video }) => {
  if (!video) return null;

  const artist = video.user_id || {};

  return (
    <div
      className="
        bg-white dark:bg-gray-900
        rounded-2xl shadow-lg
        overflow-hidden
        transition-all duration-300
        hover:-translate-y-1 hover:shadow-xl
      "
    >
      {/* ================= VIDEO ================= */}
      <div className="relative pb-[56.25%] bg-black">
        {isYouTube(video.video_url) ? (
          <iframe
            src={getEmbedUrl(video.video_url)}
            title={video.title || "Talent Video"}
            allowFullScreen
            loading="lazy"
            className="absolute inset-0 w-full h-full"
          />
        ) : (
          <video
            src={video.video_url}
            controls
            preload="metadata"
            className="absolute inset-0 w-full h-full object-cover"
          />
        )}
      </div>

      {/* ================= CONTENT ================= */}
      <div className="p-4 space-y-2">
        {/* Title */}
        <h3 className="font-semibold text-gray-900 dark:text-white truncate">
          {video.title || "Untitled Performance"}
        </h3>

        {/* Description */}
        <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-2">
          {video.description || "No description provided."}
        </p>

        {/* Meta */}
        <div className="flex justify-between text-xs text-gray-500 dark:text-gray-400">
          <span>🎵 {video.genre || "N/A"}</span>
          <span>📈 {video.level || "N/A"}</span>
        </div>

        {/* Artist */}
        {artist._id && (
          <Link
            to={`/profile/${artist._id}`}
            className="
              inline-flex items-center gap-1
              text-indigo-600 dark:text-indigo-400
              text-sm font-medium
              hover:underline pt-2
            "
          >
            <User size={14} />
            {artist.name || "View Artist"}
          </Link>
        )}
      </div>
    </div>
  );
};

export default TalentCard;
