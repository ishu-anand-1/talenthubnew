// controllers/postController.js

import mongoose from "mongoose";
import Post from "../models/Post.model.js";

/* ===================== CREATE POST (UPLOAD VIDEO) ===================== */
export const createPost = async (req, res) => {
  try {
    const userId = req.user.id;
    const { title, description, category, genre, level, video_url } = req.body;

    if (!title || !video_url || !category || !genre || !level) {
      return res.status(400).json({
        error: "Title, category, genre, level and video are required",
      });
    }

    const post = await Post.create({
      user: userId,
      title: title.trim(),
      description: description?.trim() || "",
      category: category.toLowerCase(),
      genre: genre.toLowerCase(),
      level: level.toLowerCase(),
      video_url,
    });

    res.status(201).json({
      message: "Video uploaded successfully",
      post,
    });
  } catch (error) {
    console.error("❌ Create post error:", error);
    res.status(500).json({ error: "Failed to upload video" });
  }
};

/* ===================== GET LOGGED-IN USER POSTS ===================== */
export const getMyPosts = async (req, res) => {
  try {
    const userId = req.user.id;

    const posts = await Post.find({ user: userId })
      .sort({ createdAt: -1 })
      .populate("user", "name email role");

    res.status(200).json(posts);
  } catch (error) {
    console.error("❌ Fetch user posts error:", error);
    res.status(500).json({ error: "Failed to fetch your posts" });
  }
};

/* ===================== DELETE POST ===================== */
export const deletePost = async (req, res) => {
  try {
    const userId = req.user.id;
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ error: "Invalid post ID" });
    }

    const post = await Post.findOne({ _id: id, user: userId });

    if (!post) {
      return res.status(404).json({
        error: "Post not found or unauthorized",
      });
    }

    await post.deleteOne();

    res.status(200).json({
      message: "Post deleted successfully",
    });
  } catch (error) {
    console.error("❌ Delete post error:", error);
    res.status(500).json({ error: "Failed to delete post" });
  }
};

/* ===================== GET ALL VIDEOS (PUBLIC / RECRUITER) ===================== */
export const getAllVideos = async (req, res) => {
  try {
    const videos = await Post.find()
      .sort({ createdAt: -1 })
      .populate("user", "name email role");

    res.status(200).json(videos);
  } catch (error) {
    console.error("❌ Fetch videos error:", error);
    res.status(500).json({ error: "Failed to fetch videos" });
  }
};

/* ===================== GET VIDEOS BY CATEGORY ===================== */
export const getVideosByCategory = async (req, res) => {
  try {
    const { category } = req.params;

    const videos = await Post.find({
      category: category.toLowerCase(),
    })
      .sort({ createdAt: -1 })
      .populate("user", "name email");

    res.status(200).json(videos);
  } catch (error) {
    console.error("❌ Fetch category videos error:", error);
    res.status(500).json({ error: "Failed to fetch category videos" });
  }
};
