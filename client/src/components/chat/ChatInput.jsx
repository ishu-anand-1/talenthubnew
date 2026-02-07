import { useState, useRef, useEffect, useCallback } from "react";

const ChatInput = ({
  onSend,
  disabled = false,
  placeholder = "Type a message…",
  maxLength = 2000, // backend-safe default
}) => {
  const [text, setText] = useState("");
  const textareaRef = useRef(null);
  const isComposingRef = useRef(false);

  /* ===================== AUTO RESIZE ===================== */
  useEffect(() => {
    if (!textareaRef.current) return;

    textareaRef.current.style.height = "auto";
    textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
  }, [text]);

  /* ===================== SEND ===================== */
  const handleSend = useCallback(() => {
    const message = text.trim();

    if (!message || disabled) return;
    if (typeof onSend !== "function") return;

    onSend(message);
    setText("");
  }, [text, disabled, onSend]);

  /* ===================== KEY HANDLING ===================== */
  const handleKeyDown = (e) => {
    // Prevent sending while using IME (Hindi, Japanese, Chinese)
    if (isComposingRef.current) return;

    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  /* ===================== UI ===================== */
  return (
    <div
      className="
        flex items-end gap-3
        px-4 py-3
        border-t border-gray-200 dark:border-gray-800
        bg-white dark:bg-gray-900
      "
    >
      {/* ================= TEXTAREA ================= */}
      <textarea
        ref={textareaRef}
        value={text}
        onChange={(e) => {
          if (e.target.value.length <= maxLength) {
            setText(e.target.value);
          }
        }}
        onKeyDown={handleKeyDown}
        onCompositionStart={() => (isComposingRef.current = true)}
        onCompositionEnd={() => (isComposingRef.current = false)}
        placeholder={placeholder}
        rows={1}
        disabled={disabled}
        aria-label="Chat message input"
        className="
          flex-1 resize-none
          max-h-40
          px-4 py-2
          rounded-xl
          border border-gray-300 dark:border-gray-700
          bg-white dark:bg-gray-800
          text-gray-900 dark:text-white
          placeholder-gray-400
          focus:outline-none focus:ring-2 focus:ring-indigo-500
          disabled:opacity-60 disabled:cursor-not-allowed
        "
      />

      {/* ================= SEND BUTTON ================= */}
      <button
        type="button"
        onClick={handleSend}
        disabled={disabled || !text.trim()}
        aria-label="Send message"
        className="
          shrink-0
          px-5 py-2
          rounded-xl
          bg-indigo-600 text-white font-medium
          hover:bg-indigo-700
          transition
          disabled:opacity-50 disabled:cursor-not-allowed
        "
      >
        Send
      </button>
    </div>
  );
};

export default ChatInput;
