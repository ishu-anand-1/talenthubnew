import { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import ConversationItem from "../../components/chat/ConversationItem";
import api from "../../services/api";

const Inbox = () => {
  const navigate = useNavigate();

  const [conversations, setConversations] = useState([]);
  const [activeId, setActiveId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  /* ================= FETCH CONVERSATIONS ================= */
  const fetchConversations = useCallback(async () => {
    try {
      setLoading(true);
      setError("");

      /*
        Expected backend response format example:
        [
          {
            _id,
            partnerName,
            lastMessage,
            lastMessageTime,
            unreadCount
          }
        ]
      */

      const { data } = await api.get("/chat/conversations");

      setConversations(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error("❌ Failed to fetch conversations:", err);
      setError("Failed to load conversations.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchConversations();
  }, [fetchConversations]);

  /* ================= SELECT CONVERSATION ================= */
  const handleSelect = useCallback(
    (id) => {
      setActiveId(id);

      // mark as read locally
      setConversations((prev) =>
        prev.map((c) =>
          c._id === id ? { ...c, unreadCount: 0 } : c
        )
      );

      navigate(`/chat/${id}`);
    },
    [navigate]
  );

  /* ================= UI ================= */
  return (
    <div className="w-full max-w-sm h-full border-r bg-white dark:bg-gray-900">
      {/* HEADER */}
      <div className="p-4 border-b dark:border-gray-700">
        <h2 className="font-bold text-lg text-gray-800 dark:text-gray-100">
          💬 Inbox
        </h2>
        <p className="text-xs text-gray-500">
          Your recent conversations
        </p>
      </div>

      {/* STATES */}
      {loading ? (
        <p className="text-center text-sm text-gray-400 py-10">
          Loading conversations...
        </p>
      ) : error ? (
        <p className="text-center text-sm text-red-500 py-10">
          {error}
        </p>
      ) : conversations.length === 0 ? (
        <p className="text-center text-sm text-gray-400 py-10">
          No conversations yet
        </p>
      ) : (
        <div className="divide-y dark:divide-gray-700 overflow-y-auto h-[calc(100%-72px)]">
          {conversations.map((convo) => (
            <ConversationItem
              key={convo._id}
              convo={{
                partnerName: convo.partnerName,
                lastMessage: convo.lastMessage,
                lastMessageTime: convo.lastMessageTime,
                unreadCount: convo.unreadCount,
              }}
              active={activeId === convo._id}
              onClick={() => handleSelect(convo._id)}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default Inbox;
