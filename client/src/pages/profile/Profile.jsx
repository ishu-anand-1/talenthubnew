import { useEffect, useState, useMemo } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../../services/api";
import { MessageCircle, UserPlus } from "lucide-react";

/* ===================== HELPERS ===================== */
const getEmbedUrl = (url = "") => {
  if (!url) return "";
  if (url.includes("watch?v=")) return url.replace("watch?v=", "embed/");
  if (url.includes("youtu.be/"))
    return url.replace("youtu.be/", "youtube.com/embed/");
  return url;
};

const Profile = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [userInfo, setUserInfo] = useState(null);
  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("videos");

  /* ===================== FETCH PROFILE ===================== */
  useEffect(() => {
    let mounted = true;

    const fetchProfile = async () => {
      try {
        setLoading(true);

        const [userRes, videosRes] = await Promise.all([
          api.get(`/users/${id}`),
          api.get("/posts/videos"), // ✅ corrected endpoint
        ]);

        if (!mounted) return;

        const userData = userRes.data || null;
        setUserInfo(userData);

        const filteredVideos = Array.isArray(videosRes.data)
          ? videosRes.data.filter(
              (v) =>
                v.user_id &&
                (v.user_id._id === id || v.user_id === id)
            )
          : [];

        setVideos(filteredVideos);
      } catch (err) {
        console.error("❌ Error loading profile:", err);
        setUserInfo(null);
        setVideos([]);
      } finally {
        mounted && setLoading(false);
      }
    };

    fetchProfile();

    return () => {
      mounted = false;
    };
  }, [id]);

  /* ===================== MEMOS ===================== */
  const initials = useMemo(() => {
    if (!userInfo?.name) return "U";
    return userInfo.name.charAt(0).toUpperCase();
  }, [userInfo]);

  /* ===================== STATES ===================== */
  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[60vh] text-gray-500">
        Loading profile...
      </div>
    );
  }

  if (!userInfo) {
    return (
      <div className="flex justify-center items-center min-h-[60vh] text-red-500">
        User not found.
      </div>
    );
  }

  /* ===================== UI ===================== */
  return (
    <div className="max-w-7xl mx-auto px-4 py-10">
      {/* COVER */}
      <div className="relative h-48 rounded-2xl bg-gradient-to-r from-indigo-500 to-purple-600" />

      {/* HEADER */}
      <div className="relative -mt-16 flex flex-col md:flex-row md:items-end md:justify-between gap-6">
        <div className="flex items-center gap-6">
          <div className="w-32 h-32 rounded-full bg-indigo-600 text-white flex items-center justify-center text-4xl font-bold border-4 border-white">
            {initials}
          </div>

          <div>
            <h1 className="text-3xl font-bold">
              {userInfo.name} {userInfo.lastname || ""}
            </h1>
            <p className="text-gray-500">{userInfo.email}</p>
            <p className="text-sm text-gray-400 mt-1">
              TalentHub Artist
            </p>
          </div>
        </div>

        {/* ACTIONS */}
        <div className="flex gap-3">
          <button className="px-5 py-2 rounded-full bg-indigo-600 text-white flex items-center gap-2 hover:bg-indigo-700">
            <UserPlus size={16} />
            Follow
          </button>

          <button
            onClick={() => navigate(`/chat/${id}`)}
            className="px-5 py-2 rounded-full border flex items-center gap-2 hover:bg-gray-100 dark:hover:bg-gray-800"
          >
            <MessageCircle size={16} />
            Message
          </button>
        </div>
      </div>

      {/* STATS */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-6 mt-10">
        <Stat label="Followers" value="—" />
        <Stat label="Views" value="—" />
        <Stat label="Uploads" value={videos.length} />
        <Stat label="Rank" value="—" />
      </div>

      {/* TABS */}
      <div className="flex gap-6 border-b mt-12">
        {["videos", "about", "reviews"].map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`pb-3 font-medium capitalize ${
              activeTab === tab
                ? "border-b-2 border-indigo-600 text-indigo-600"
                : "text-gray-500"
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* VIDEOS TAB */}
      {activeTab === "videos" && (
        <div className="mt-8">
          {videos.length === 0 ? (
            <p className="text-gray-500">No videos uploaded yet.</p>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
              {videos.map((video) => (
                <div
                  key={video._id}
                  className="bg-white dark:bg-gray-800 rounded-xl shadow overflow-hidden"
                >
                  <div className="relative pb-[56.25%] bg-black">
                    {video.video_url?.includes("youtube") ? (
                      <iframe
                        src={getEmbedUrl(video.video_url)}
                        className="absolute inset-0 w-full h-full"
                        title={video.title}
                      />
                    ) : (
                      <video
                        src={video.video_url}
                        controls
                        className="absolute inset-0 w-full h-full object-cover"
                      />
                    )}
                  </div>

                  <div className="p-4">
                    <h3 className="font-semibold truncate">
                      {video.title}
                    </h3>
                    <p className="text-sm text-gray-500">
                      {video.genre} • {video.level}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

/* ===================== STAT ===================== */
const Stat = ({ label, value }) => (
  <div className="bg-white dark:bg-gray-800 rounded-xl p-5 shadow text-center">
    <p className="text-gray-500 text-sm">{label}</p>
    <p className="text-2xl font-bold mt-1">{value}</p>
  </div>
);

export default Profile;
