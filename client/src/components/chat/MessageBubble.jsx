import { memo } from "react";

const MessageBubble = ({ message, own = false }) => {
  if (!message) return null;

  const {
    text = "",
    time,
    status,
  } = message;

  const isSeen = status === "seen";
  const isDelivered = status === "delivered";
  const isSent = status === "sent";

  return (
    <div
      className={`
        flex mb-3
        ${own ? "justify-end" : "justify-start"}
      `}
      aria-live="polite"
    >
      <div
        className={`
          relative
          max-w-[75%] md:max-w-[60%]
          px-4 py-2
          rounded-2xl
          text-sm leading-relaxed
          shadow-sm
          transition-all duration-200
          ${
            own
              ? "bg-indigo-600 text-white rounded-br-md"
              : "bg-gray-200 dark:bg-gray-700 text-gray-900 dark:text-gray-100 rounded-bl-md"
          }
        `}
      >
        {/* ================= MESSAGE TEXT ================= */}
        <p className="whitespace-pre-wrap break-words">
          {text}
        </p>

        {/* ================= META ================= */}
        {(time || status) && (
          <div
            className={`
              mt-1 flex items-center justify-end gap-1
              text-[11px]
              ${
                own
                  ? "text-indigo-200"
                  : "text-gray-400 dark:text-gray-300"
              }
            `}
          >
            {time && (
              <span aria-label={`Sent at ${time}`}>
                {time}
              </span>
            )}

            {own && status && (
              <span
                aria-label={`Message ${status}`}
                className="tracking-tight"
              >
                {isSeen && "✓✓"}
                {isDelivered && "✓"}
                {isSent && "✓"}
              </span>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default memo(MessageBubble);
