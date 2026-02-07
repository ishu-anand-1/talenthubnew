// routes/postRoutes.js

import express from "express";
import {
  createPost,
  getMyPosts,
  getAllVideos,
  deletePost,
} from "../controllers/postController.js";
import { verifyToken } from "../middleware/authMiddleware.js";

const router = express.Router();

/* ===================== POST / VIDEO ROUTES ===================== */

/**
 * @route   POST /api/posts
 * @desc    Create a new video post
 * @access  Private
 */
router.post("/", verifyToken, createPost);

/**
 * @route   GET /api/posts
 * @desc    Get posts uploaded by logged-in user
 * @access  Private
 */
router.get("/", verifyToken, getMyPosts);

/**
 * @route   GET /api/posts/videos
 * @desc    Get all video posts (public feed / explore)
 * @access  Public
 */
router.get("/videos", getAllVideos);

/**
 * @route   DELETE /api/posts/:id
 * @desc    Delete a post by ID
 * @access  Private (Owner only)
 */
router.delete("/:id", verifyToken, deletePost);

export default router;
