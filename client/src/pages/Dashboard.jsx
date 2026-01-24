import { useState, useEffect } from "react";
import api from "../services/api";

const Dashboard = () => {
  const [title, setTitle] = useState("");
  const [category, setCategory] = useState("Dance");
  const [videoUrl, setVideoUrl] = useState("");
  const [genre, setGenre] = useState("Hip-hop");
  const [level, setLevel] = useState("Beginner");
  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(false);

  /* ===================== UPLOAD ===================== */
  const handleUpload = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      await api.post("/videos/youtube", {
        title,
        category,
        genre,
        level,
        video_url: videoUrl,
      });

      alert("✅ Video uploaded successfully");

      setTitle("");
      setVideoUrl("");
      setGenre("Hip-hop");
      setLevel("Beginner");

      fetchVideos();
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.error || "❌ Upload failed");
    } finally {
      setLoading(false);
    }
  };

  /* ===================== FETCH MY VIDEOS ===================== */
  const fetchVideos = async () => {
    try {
      const res = await api.get("/videos/my-video");
      setVideos(res.data);
    } catch (err) {
      console.error("❌ Failed to fetch videos", err);
    }
  };

  useEffect(() => {
    fetchVideos();
  }, []);

  return (
    <div className="max-w-3xl mx-auto mt-10 px-4 text-black dark:text-white">
      <h2 className="text-2xl font-bold mb-6 text-center text-red-100">
        📤 Upload Your Performance
      </h2>

      {/* ===================== FORM ===================== */}
      <form onSubmit={handleUpload} className="flex flex-col gap-4 mb-10">
        <input
          type="text"
          placeholder="Video Title"
          className="border p-2 rounded bg-white dark:bg-gray-800"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
        />

        <select
          className="border p-2 rounded bg-white dark:bg-gray-800"
          value={category}
          onChange={(e) => setCategory(e.target.value)}
        >
          <option>Dance</option>
          <option>Singing</option>
          <option>Instrument</option>
        </select>

        <select
          className="border p-2 rounded bg-white dark:bg-gray-800"
          value={genre}
          onChange={(e) => setGenre(e.target.value)}
        >
          <option>Hip-hop</option>
          <option>Jazz</option>
          <option>Classical</option>
          <option>Pop</option>
          <option>Rock</option>
        </select>

        <select
          className="border p-2 rounded bg-white dark:bg-gray-800"
          value={level}
          onChange={(e) => setLevel(e.target.value)}
        >
          <option>Beginner</option>
          <option>Intermediate</option>
          <option>Advanced</option>
        </select>

        <input
          type="url"
          placeholder="YouTube / Cloudinary video URL"
          className="border p-2 rounded bg-white dark:bg-gray-800"
          value={videoUrl}
          onChange={(e) => setVideoUrl(e.target.value)}
          required
        />

        <button
          disabled={loading}
          className="bg-blue-600 hover:bg-blue-700 text-white py-2 rounded font-semibold disabled:opacity-60"
        >
          {loading ? "Uploading..." : "Upload Video"}
        </button>
      </form>

      {/* ===================== MY VIDEOS ===================== */}
      <h3 className="text-xl font-bold mb-4 text-red-100">🎬 My Videos</h3>

      {videos.length === 0 ? (
        <p className="text-gray-500">No videos uploaded yet.</p>
      ) : (
        <div className="grid gap-4">
          {videos.map((v) => (
            <div
              key={v._id}
              className="border p-4 rounded bg-white dark:bg-gray-800 shadow"
            >
              <h4 className="font-semibold">{v.title}</h4>
              <p className="text-sm text-gray-600">Category: {v.category}</p>
              <p className="text-sm text-gray-600">Genre: {v.genre}</p>
              <p className="text-sm text-gray-600">Level: {v.level}</p>

              <video
                className="w-full mt-2 rounded"
                controls
                src={v.video_url}
              />
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Dashboard;
