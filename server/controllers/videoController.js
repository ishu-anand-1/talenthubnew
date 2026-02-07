import mongoose from "mongoose";
import Video from "../models/Video.model.js";
import cloudinary from "../config/cloudinary.js";

/* ===================== UPLOAD VIDEO (CLOUDINARY FILE) ===================== */
export const uploadVideoToCloudinary = async (req, res) => {
  try {
    const userId = req.user.id;
    const { title, description, category, genre, level } = req.body;

    if (!req.file) {
      return res.status(400).json({ error: "Video file is required" });
    }

    if (!title || !category || !genre || !level) {
      return res.status(400).json({
        error: "Title, category, genre and level are required",
      });
    }

    const video = await Video.create({
      user_id: userId,
      title: title.trim(),
      description: description?.trim() || "",
      category: category.toLowerCase(),
      genre,
      level,
      video_url: req.file.path,
      cloudinary_id: req.file.filename || null,
      isLearnVideo: false,
    });

    res.status(201).json({
      message: "Video uploaded successfully",
      video,
    });
  } catch (error) {
    console.error("❌ Cloudinary upload error:", error);
    res.status(500).json({
      error: "Failed to upload video",
    });
  }
};

/* ===================== UPLOAD YOUTUBE VIDEO ===================== */
export const uploadYouTubeVideo = async (req, res) => {
  try {
    const userId = req.user.id;
    const { title, description, category, genre, level, video_url } = req.body;

    if (!title || !video_url || !category || !genre || !level) {
      return res.status(400).json({
        error: "All fields are required",
      });
    }

    const video = await Video.create({
      user_id: userId,
      title: title.trim(),
      description: description?.trim() || "",
      category: category.toLowerCase(),
      genre,
      level,
      video_url,
      isLearnVideo: false,
    });

    res.status(201).json({
      message: "YouTube video added successfully",
      video,
    });
  } catch (error) {
    console.error("❌ YouTube upload error:", error);
    res.status(500).json({
      error: "Failed to save YouTube video",
    });
  }
};

/* ===================== GET ALL VIDEOS ===================== */
export const getAllVideos = async (req, res) => {
  try {
    const videos = await Video.find()
      .populate("user_id", "name email")
      .sort({ createdAt: -1 });

    res.status(200).json(videos);
  } catch (error) {
    console.error("❌ Fetch all videos error:", error);
    res.status(500).json({
      error: "Failed to fetch videos",
    });
  }
};

/* ===================== GET MY VIDEOS ===================== */
export const getMyVideos = async (req, res) => {
  try {
    const videos = await Video.find({ user_id: req.user.id })
      .populate("user_id", "name email")
      .sort({ createdAt: -1 });

    res.status(200).json(videos);
  } catch (error) {
    console.error("❌ Fetch my videos error:", error);
    res.status(500).json({
      error: "Failed to fetch your videos",
    });
  }
};

/* ===================== DELETE VIDEO ===================== */
export const deleteVideo = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ error: "Invalid video ID" });
    }

    const video = await Video.findOne({
      _id: id,
      user_id: req.user.id,
    });

    if (!video) {
      return res.status(404).json({
        error: "Video not found or unauthorized",
      });
    }

    // 🔥 Delete from Cloudinary if exists
    if (video.cloudinary_id) {
      await cloudinary.uploader.destroy(video.cloudinary_id, {
        resource_type: "video",
      });
    }

    await video.deleteOne();

    res.status(200).json({
      message: "Video deleted successfully",
    });
  } catch (error) {
    console.error("❌ Delete video error:", error);
    res.status(500).json({
      error: "Failed to delete video",
    });
  }
};

/* ===================== FILTER VIDEOS ===================== */
export const getFilteredVideos = async (req, res) => {
  try {
    const { category, genre, level } = req.query;
    const filters = {};

    if (category && category !== "All") {
      filters.category = category.toLowerCase();
    }

    if (genre && genre !== "All") {
      filters.genre = genre;
    }

    if (level && level !== "All") {
      filters.level = level;
    }

    const videos = await Video.find(filters)
      .populate("user_id", "name")
      .sort({ createdAt: -1 });

    res.status(200).json(videos);
  } catch (error) {
    console.error("❌ Filter videos error:", error);
    res.status(500).json({
      error: "Failed to fetch filtered videos",
    });
  }
};

/* ===================== VIDEOS BY CATEGORY (RANDOM) ===================== */
export const getVideosByCategory = async (req, res) => {
  try {
    const category = req.params.category.toLowerCase();

    const videos = await Video.aggregate([
      { $match: { category } },
      { $sample: { size: 100 } },
      {
        $lookup: {
          from: "users",
          localField: "user_id",
          foreignField: "_id",
          as: "author",
        },
      },
      { $unwind: "$author" },
      {
        $project: {
          title: 1,
          description: 1,
          category: 1,
          genre: 1,
          level: 1,
          video_url: 1,
          createdAt: 1,
          author: "$author.name",
        },
      },
    ]);

    res.status(200).json(videos);
  } catch (error) {
    console.error("❌ Category videos error:", error);
    res.status(500).json({
      error: "Failed to fetch category videos",
    });
  }
};
 