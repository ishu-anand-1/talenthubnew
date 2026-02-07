import Video from "../models/Video.model.js";

/* ===================== CREATE VIDEO ===================== */
export const createVideo = async ({
  user_id,
  title,
  description = "",
  category,
  genre,
  level,
  video_url,
  thumbnail_url,
  isPublic = true,
}) => {
  if (!user_id || !title || !category || !genre || !level || !video_url) {
    throw new Error("Missing required video fields");
  }

  const video = await Video.create({
    user_id,
    title,
    description,
    category: category.toLowerCase(),
    genre: genre.toLowerCase(),
    level: level.toLowerCase(),
    video_url,
    thumbnail_url,
    isPublic,
  });

  return video;
};

/* ===================== FETCH ALL VIDEOS ===================== */
export const fetchAllVideos = async () => {
  return await Video.find({ isPublic: true })
    .populate("user_id", "name")
    .sort({ createdAt: -1 })
    .lean();
};

/* ===================== FETCH USER VIDEOS ===================== */
export const fetchUserVideos = async (userId) => {
  if (!userId) {
    throw new Error("User ID is required");
  }

  return await Video.find({ user_id: userId })
    .sort({ createdAt: -1 })
    .lean();
};

/* ===================== FETCH VIDEOS BY CATEGORY ===================== */
export const fetchVideosByCategory = async (category) => {
  if (!category) {
    throw new Error("Category is required");
  }

  return await Video.find({
    category: category.toLowerCase(),
    isPublic: true,
  })
    .populate("user_id", "name")
    .sort({ createdAt: -1 })
    .lean();
};

/* ===================== FETCH FILTERED VIDEOS ===================== */
export const fetchFilteredVideos = async ({ category, genre, level }) => {
  const filters = { isPublic: true };

  if (category && category !== "all") {
    filters.category = category.toLowerCase();
  }

  if (genre && genre !== "all") {
    filters.genre = genre.toLowerCase();
  }

  if (level && level !== "all") {
    filters.level = level.toLowerCase();
  }

  return await Video.find(filters)
    .populate("user_id", "name")
    .sort({ createdAt: -1 })
    .lean();
};

/* ===================== DELETE VIDEO ===================== */
export const removeVideo = async (videoId, userId) => {
  if (!videoId || !userId) {
    throw new Error("Video ID and User ID are required");
  }

  const deletedVideo = await Video.findOneAndDelete({
    _id: videoId,
    user_id: userId,
  });

  if (!deletedVideo) {
    throw new Error("Video not found or unauthorized");
  }

  return deletedVideo;
};
