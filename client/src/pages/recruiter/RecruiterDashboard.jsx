import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  Users,
  Star,
  Briefcase,
  MessageSquare,
} from "lucide-react";
import api from "../../services/api";

const RecruiterDashboard = () => {
  const navigate = useNavigate();

  const [stats, setStats] = useState(null);
  const [recommendedTalent, setRecommendedTalent] = useState([]);
  const [recentShortlist, setRecentShortlist] = useState([]);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  /* ================= FETCH DASHBOARD DATA ================= */
  useEffect(() => {
    let mounted = true;

    const fetchDashboard = async () => {
      try {
        setLoading(true);
        setError("");

        const [statsRes, talentRes, shortlistRes] =
          await Promise.all([
            api.get("/recruiter/dashboard-stats"),
            api.get("/videos/get-all-video"),
            api.get("/recruiter/shortlist"),
          ]);

        if (!mounted) return;

        /* -------- Stats -------- */
        setStats(statsRes.data || {});

        /* -------- Recommended Talent -------- */
        const talent = Array.isArray(talentRes.data)
          ? talentRes.data.slice(0, 4).map((v) => ({
              id: v._id,
              name: v.user_id?.name || "Artist",
              role: v.category || "Performer",
              skills: [v.genre, v.level].filter(Boolean),
              artistId: v.user_id?._id,
            }))
          : [];

        setRecommendedTalent(talent);

        /* -------- Shortlist -------- */
        const shortlist = Array.isArray(shortlistRes.data)
          ? shortlistRes.data.slice(0, 5)
          : [];

        setRecentShortlist(shortlist);
      } catch (err) {
        console.error("❌ Dashboard load failed:", err);
        setError("Failed to load recruiter dashboard.");
      } finally {
        mounted && setLoading(false);
      }
    };

    fetchDashboard();

    return () => {
      mounted = false;
    };
  }, []);

  /* ================= ACTIONS ================= */
  const handleShortlist = async (artistId) => {
    try {
      await api.post("/recruiter/shortlist", { artistId });
    } catch (err) {
      console.error("❌ Shortlist failed:", err);
    }
  };

  const handleMessage = (artistId) => {
    navigate(`/chat/${artistId}`);
  };

  /* ================= LOADING ================= */
  if (loading) {
    return (
      <div className="p-10 text-gray-500">
        Loading recruiter dashboard...
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-10 text-red-500">{error}</div>
    );
  }

  /* ================= STATS CONFIG ================= */
  const STATS = [
    {
      title: "Discovered Talent",
      value: stats?.discoveredTalent || "0",
      sub: "+ this week",
      icon: Users,
      color: "text-indigo-600",
    },
    {
      title: "Shortlisted Artists",
      value: stats?.shortlisted || "0",
      sub: "Saved",
      icon: Star,
      color: "text-yellow-500",
    },
    {
      title: "Active Requests",
      value: stats?.requests || "0",
      sub: "Hiring",
      icon: Briefcase,
      color: "text-green-600",
    },
    {
      title: "New Messages",
      value: stats?.messages || "0",
      sub: "Unread",
      icon: MessageSquare,
      color: "text-purple-600",
    },
  ];

  return (
    <div className="max-w-7xl mx-auto px-6 py-10 space-y-10">
      {/* HEADER */}
      <div>
        <h1 className="text-3xl font-bold">Recruiter Hub</h1>
        <p className="text-gray-500 mt-2">
          Find the perfect talent for your next project.
        </p>

        <div className="flex gap-4 mt-6">
          <button className="bg-indigo-600 text-white px-5 py-2 rounded-lg font-semibold hover:bg-indigo-700 transition">
            Post New Job
          </button>

          <Link
            to="/recruiter/discover"
            className="border border-indigo-600 text-indigo-600 px-5 py-2 rounded-lg font-semibold hover:bg-indigo-50 transition"
          >
            Find Talent
          </Link>
        </div>
      </div>

      {/* STATS */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {STATS.map(({ title, value, sub, icon: Icon, color }) => (
          <div
            key={title}
            className="bg-white dark:bg-gray-900 rounded-xl p-5 shadow"
          >
            <div className="flex justify-between items-center">
              <div>
                <p className="text-sm text-gray-500">{title}</p>
                <h2 className="text-2xl font-bold">{value}</h2>
                <p className="text-xs text-green-500 mt-1">{sub}</p>
              </div>
              <Icon className={color} />
            </div>
          </div>
        ))}
      </div>

      {/* MAIN GRID */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* RECOMMENDED */}
        <div className="lg:col-span-2 space-y-4">
          <h2 className="text-xl font-bold">Recommended for You</h2>

          <div className="grid sm:grid-cols-2 gap-6">
            {recommendedTalent.map((talent) => (
              <div
                key={talent.id}
                className="bg-white dark:bg-gray-900 p-5 rounded-xl shadow"
              >
                <h3 className="font-bold">{talent.name}</h3>
                <p className="text-sm text-gray-500">{talent.role}</p>

                <div className="flex flex-wrap gap-2 mt-3">
                  {talent.skills.map((skill) => (
                    <span
                      key={skill}
                      className="text-xs bg-indigo-100 text-indigo-700 px-2 py-1 rounded-full"
                    >
                      {skill}
                    </span>
                  ))}
                </div>

                <div className="flex gap-3 mt-4">
                  <button
                    onClick={() =>
                      handleShortlist(talent.artistId)
                    }
                    className="flex-1 bg-yellow-500 text-white py-2 rounded-lg text-sm"
                  >
                    Shortlist
                  </button>

                  <button
                    onClick={() =>
                      handleMessage(talent.artistId)
                    }
                    className="flex-1 border border-indigo-600 text-indigo-600 py-2 rounded-lg text-sm"
                  >
                    Message
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* SIDEBAR */}
        <div className="space-y-6">
          <div className="bg-white dark:bg-gray-900 rounded-xl p-5 shadow">
            <h3 className="font-bold mb-4">Recent Shortlists</h3>

            {recentShortlist.map((item) => (
              <div key={item._id}>
                <p className="font-medium">
                  {item.artist?.name}
                </p>
                <p className="text-xs text-gray-500">
                  Recently added
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default RecruiterDashboard;
