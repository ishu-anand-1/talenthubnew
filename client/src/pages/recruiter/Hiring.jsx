import { useEffect, useState, useCallback } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  Briefcase,
  CheckCircle,
  XCircle,
  MessageSquare,
} from "lucide-react";
import api from "../../services/api";

/* ===================== STATUS STYLES ===================== */
const STATUS_STYLES = {
  pending: "bg-yellow-100 text-yellow-700",
  accepted: "bg-green-100 text-green-700",
  rejected: "bg-red-100 text-red-700",
};

const Hiring = () => {
  const navigate = useNavigate();

  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  /* ===================== FETCH HIRING REQUESTS ===================== */
  useEffect(() => {
    let mounted = true;

    const fetchHiringRequests = async () => {
      try {
        setLoading(true);
        setError("");

        const { data } = await api.get("/recruiter/hiring");

        if (!mounted) return;

        const normalized = Array.isArray(data)
          ? data.map((r) => ({
              ...r,
              status: (r.status || "pending").toLowerCase(),
              artist: r.artist || {},
            }))
          : [];

        setRequests(normalized);
      } catch (err) {
        console.error("❌ Failed to load hiring requests:", err);
        setError("Unable to load hiring requests.");
        setRequests([]);
      } finally {
        mounted && setLoading(false);
      }
    };

    fetchHiringRequests();

    return () => {
      mounted = false;
    };
  }, []);

  /* ===================== UPDATE STATUS ===================== */
  const updateStatus = useCallback(async (id, status) => {
    try {
      await api.patch(`/recruiter/hiring/${id}`, { status });

      setRequests((prev) =>
        prev.map((req) =>
          req._id === id ? { ...req, status } : req
        )
      );
    } catch (err) {
      console.error("❌ Failed to update status:", err);
    }
  }, []);

  const handleMessage = (artistId) => {
    if (!artistId) return;
    navigate(`/chat/${artistId}`);
  };

  /* ===================== UI ===================== */
  return (
    <div className="max-w-7xl mx-auto px-6 py-10">
      {/* HEADER */}
      <div className="mb-10">
        <h1 className="text-3xl font-bold">🤝 Hiring Requests</h1>
        <p className="text-gray-500 mt-2">
          Manage collaboration and hiring conversations.
        </p>
      </div>

      {/* LOADING */}
      {loading && (
        <p className="text-gray-500">Loading requests...</p>
      )}

      {/* ERROR */}
      {!loading && error && (
        <div className="bg-red-100 text-red-600 p-4 rounded-lg">
          {error}
        </div>
      )}

      {/* EMPTY */}
      {!loading && !error && requests.length === 0 && (
        <div className="text-center py-20 bg-white dark:bg-gray-900 rounded-2xl shadow">
          <Briefcase className="mx-auto mb-4 text-indigo-600" size={42} />
          <h3 className="text-lg font-semibold mb-2">
            No hiring requests yet
          </h3>
          <p className="text-gray-500 mb-6">
            Discover artists and start hiring today.
          </p>

          <Link
            to="/talent"
            className="px-6 py-3 rounded-full bg-indigo-600 text-white hover:bg-indigo-700 transition"
          >
            Discover Talent
          </Link>
        </div>
      )}

      {/* GRID */}
      {!loading && !error && requests.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {requests.map((req) => {
            const status = req.status || "pending";

            return (
              <div
                key={req._id}
                className="bg-white dark:bg-gray-900 rounded-2xl shadow-lg p-6 space-y-4 hover:-translate-y-1 hover:shadow-xl transition"
              >
                {/* ARTIST */}
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-full bg-indigo-600 text-white flex items-center justify-center font-bold">
                    {req.artist?.name?.charAt(0)?.toUpperCase() || "A"}
                  </div>

                  <div>
                    <h3 className="font-bold text-lg">
                      {req.artist?.name || "Artist"}
                    </h3>
                    <p className="text-sm text-gray-500">
                      {req.role || "Creative Role"}
                    </p>
                  </div>
                </div>

                {/* STATUS */}
                <span
                  className={`inline-block px-3 py-1 rounded-full text-xs font-semibold ${
                    STATUS_STYLES[status]
                  }`}
                >
                  {status.toUpperCase()}
                </span>

                {/* ACTIONS */}
                <div className="flex flex-wrap gap-3 pt-2">
                  <Link
                    to={`/profile/${req.artist?._id}`}
                    className="px-4 py-2 rounded-lg border text-sm hover:bg-gray-100 dark:hover:bg-gray-800 transition"
                  >
                    View Profile
                  </Link>

                  {status === "pending" && (
                    <>
                      <button
                        onClick={() =>
                          updateStatus(req._id, "accepted")
                        }
                        className="flex items-center gap-1 px-4 py-2 rounded-lg bg-green-600 text-white text-sm hover:bg-green-700 transition"
                      >
                        <CheckCircle size={16} />
                        Accept
                      </button>

                      <button
                        onClick={() =>
                          updateStatus(req._id, "rejected")
                        }
                        className="flex items-center gap-1 px-4 py-2 rounded-lg bg-red-600 text-white text-sm hover:bg-red-700 transition"
                      >
                        <XCircle size={16} />
                        Reject
                      </button>
                    </>
                  )}

                  <button
                    onClick={() =>
                      handleMessage(req.artist?._id)
                    }
                    className="flex items-center gap-1 px-4 py-2 rounded-lg bg-indigo-600 text-white text-sm hover:bg-indigo-700 transition"
                  >
                    <MessageSquare size={16} />
                    Message
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default Hiring;
