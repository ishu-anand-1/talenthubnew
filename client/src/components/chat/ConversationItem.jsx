import { memo, useCallback } from "react";

const ConversationItem = ({
  convo,
  active = false,
  onClick,
}) => {
  if (!convo) return null;

  const {
    partnerName = "Unknown User",
    lastMessage = "No messages yet",
    lastMessageTime,
    unreadCount = 0,
  } = convo;

  /* ===================== HANDLERS ===================== */
  const handleActivate = useCallback(() => {
    if (typeof onClick === "function") {
      onClick(convo);
    }
  }, [onClick, convo]);

  const handleKeyDown = (e) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      handleActivate();
    }
  };

  /* ===================== UI ===================== */
  return (
    <div
      role="button"
      tabIndex={0}
      aria-pressed={active}
      aria-label={`Conversation with ${partnerName}`}
      onClick={handleActivate}
      onKeyDown={handleKeyDown}
      className={`
        relative
        flex gap-3 items-start
        px-4 py-3
        cursor-pointer
        border-b border-gray-200 dark:border-gray-800
        transition-colors duration-200
        focus:outline-none focus:ring-2 focus:ring-indigo-500
        ${
          active
            ? "bg-indigo-50 dark:bg-gray-800"
            : "hover:bg-gray-100 dark:hover:bg-gray-900"
        }
      `}
    >
      {/* ================= ACTIVE INDICATOR ================= */}
      {active && (
        <span
          aria-hidden
          className="absolute left-0 top-0 h-full w-1 bg-indigo-600 rounded-r"
        />
      )}

      {/* ================= AVATAR ================= */}
      <div
        aria-hidden
        className="
          w-10 h-10 shrink-0
          rounded-full
          bg-indigo-600 text-white
          flex items-center justify-center
          font-bold uppercase
        "
      >
        {partnerName.charAt(0)}
      </div>

      {/* ================= CONTENT ================= */}
      <div className="flex-1 min-w-0">
        {/* ================= TOP ================= */}
        <div className="flex justify-between items-center mb-1 gap-2">
          <p className="font-semibold text-gray-800 dark:text-gray-100 truncate">
            {partnerName}
          </p>

          {lastMessageTime && (
            <span className="text-xs text-gray-400 shrink-0">
              {lastMessageTime}
            </span>
          )}
        </div>

        {/* ================= LAST MESSAGE ================= */}
        <div className="flex justify-between items-center gap-2">
          <p className="text-sm text-gray-500 dark:text-gray-400 truncate">
            {lastMessage}
          </p>

          {/* ================= UNREAD BADGE ================= */}
          {unreadCount > 0 && (
            <span
              aria-label={`${unreadCount} unread messages`}
              className="
                ml-2 shrink-0
                bg-indigo-600 text-white
                text-xs font-semibold
                px-2 py-0.5
                rounded-full
              "
            >
              {unreadCount}
            </span>
          )}
        </div>
      </div>
    </div>
  );
};

export default memo(ConversationItem);
