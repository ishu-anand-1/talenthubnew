import { useEffect, useRef, useState, useCallback } from "react";
import ChatInput from "../../components/chat/ChatInput";
import MessageBubble from "../../components/chat/MessageBubble";

const ChatRoom = () => {
  const [messages, setMessages] = useState([]);
  const [sending, setSending] = useState(false);
  const bottomRef = useRef(null);

  /* ================= AUTO SCROLL ================= */
  const scrollToBottom = () => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  /* ================= SEND MESSAGE ================= */
  const sendMessage = useCallback((text) => {
    if (!text.trim()) return;

    setSending(true);

    const newMessage = {
      id: crypto.randomUUID(),
      text: text.trim(),
      own: true,
      time: new Date().toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      }),
      status: "sent",
    };

    setMessages((prev) => [...prev, newMessage]);

    /* ===== Simulate delivery + seen (replace with socket later) ===== */
    setTimeout(() => {
      setMessages((prev) =>
        prev.map((msg) =>
          msg.id === newMessage.id
            ? { ...msg, status: "delivered" }
            : msg
        )
      );
    }, 700);

    setTimeout(() => {
      setMessages((prev) =>
        prev.map((msg) =>
          msg.id === newMessage.id
            ? { ...msg, status: "seen" }
            : msg
        )
      );
      setSending(false);
    }, 1400);
  }, []);

  /* ================= UI ================= */
  return (
    <div className="flex flex-col h-full bg-white dark:bg-gray-900 rounded-xl shadow-md overflow-hidden">
      {/* ================= HEADER ================= */}
      <div className="px-4 py-3 border-b dark:border-gray-700">
        <h2 className="font-semibold text-gray-800 dark:text-gray-100">
          Chat
        </h2>
        <p className="text-xs text-gray-400">
          Private conversation
        </p>
      </div>

      {/* ================= MESSAGES ================= */}
      <div
        className="
          flex-1
          p-4
          space-y-3
          overflow-y-auto
        "
      >
        {messages.length === 0 ? (
          <p className="text-center text-sm text-gray-400 mt-10">
            Start the conversation 💬
          </p>
        ) : (
          messages.map((msg) => (
            <MessageBubble
              key={msg.id}
              message={msg}
              own={msg.own}
            />
          ))
        )}

        <div ref={bottomRef} />
      </div>

      {/* ================= INPUT ================= */}
      <ChatInput onSend={sendMessage} disabled={sending} />
    </div>
  );
};

export default ChatRoom;
