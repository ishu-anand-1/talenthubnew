import { Link } from "react-router-dom";
import { Star, MessageSquare } from "lucide-react";

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
const RecruiterTalentCard = ({
  video,
  onShortlist = () => {},
  onMessage = () => {},
}) => {
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

        {/* Artist */}
        {artist._id && (
          <Link
            to={`/profile/${artist._id}`}
            className="text-sm text-indigo-600 dark:text-indigo-400 hover:underline font-medium"
          >
            {artist.name || "Unknown Artist"}
          </Link>
        )}

        {/* Meta */}
        <p className="text-xs text-gray-500 dark:text-gray-400">
          🎵 {video.genre || "Genre"} • 📈 {video.level || "Level"}
        </p>

        {/* ================= ACTIONS ================= */}
        <div className="flex gap-2 pt-3">
          <button
            type="button"
            onClick={() => onShortlist(video)}
            className="
              flex-1 flex items-center justify-center gap-1
              bg-indigo-600 text-white
              py-1.5 rounded-lg text-sm font-medium
              hover:bg-indigo-700
              transition
            "
          >
            <Star size={14} />
            Shortlist
          </button>

          <button
            type="button"
            onClick={() => onMessage(video)}
            className="
              flex-1 flex items-center justify-center gap-1
              border border-indigo-600
              text-indigo-600 dark:text-indigo-400
              py-1.5 rounded-lg text-sm font-medium
              hover:bg-indigo-50 dark:hover:bg-gray-800
              transition
            "
          >
            <MessageSquare size={14} />
            Message
          </button>
        </div>
      </div>
    </div>
  );
};

export default RecruiterTalentCard;
