import { Link } from "react-router-dom";

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
  typeof url === "string" &&
  (url.includes("youtube.com") || url.includes("youtu.be"));

/* ===================== COMPONENT ===================== */
const VideoCard = ({
  video,
  showProfile = true,
  onClick,
}) => {
  if (!video) return null;

  const {
    title,
    description,
    video_url,
    genre,
    level,
    user_id,
  } = video;

  const artist = user_id || {};

  return (
    <div
      onClick={onClick}
      role={onClick ? "button" : undefined}
      tabIndex={onClick ? 0 : undefined}
      className="
        bg-white dark:bg-gray-900
        rounded-2xl shadow-md
        overflow-hidden
        transition-all duration-300
        hover:-translate-y-1 hover:shadow-xl
        cursor-pointer
      "
    >
      {/* ================= VIDEO THUMBNAIL ================= */}
      <div className="relative pb-[56.25%] bg-black">
        {isYouTube(video_url) ? (
          <iframe
            src={getEmbedUrl(video_url)}
            title={title || "Talent video"}
            loading="lazy"
            allowFullScreen
            className="absolute inset-0 w-full h-full pointer-events-none"
          />
        ) : video_url ? (
          <video
            src={video_url}
            preload="metadata"
            className="absolute inset-0 w-full h-full object-cover pointer-events-none"
          />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center text-gray-400 text-sm">
            No video available
          </div>
        )}
      </div>

      {/* ================= CONTENT ================= */}
      <div className="p-4 space-y-2">
        {/* Title */}
        <h3 className="font-semibold text-gray-900 dark:text-white truncate">
          {title || "Untitled Performance"}
        </h3>

        {/* Description */}
        {description && (
          <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-2">
            {description}
          </p>
        )}

        {/* Meta */}
        <div className="flex justify-between text-xs text-gray-500 dark:text-gray-400">
          <span>🎵 {genre || "N/A"}</span>
          <span>📈 {level || "N/A"}</span>
        </div>

        {/* Artist */}
        {showProfile && artist?._id && (
          <Link
            to={`/profile/${artist._id}`}
            onClick={(e) => e.stopPropagation()}
            className="
              inline-block pt-2
              text-sm font-medium
              text-indigo-600 dark:text-indigo-400
              hover:underline
            "
          >
            {artist.name || "View Profile"} →
          </Link>
        )}
      </div>
    </div>
  );
};

export default VideoCard;
