import express from "express";
import multer from "multer";

import {
  uploadVideoToCloudinary,
  uploadYouTubeVideo,
  getAllVideos,
  getMyVideos,
  deleteVideo,
  getFilteredVideos,
  getVideosByCategory,
} from "../controllers/videoController.js";

import { verifyToken } from "../middleware/authMiddleware.js";
import { cloudinaryStorage } from "../config/cloudinary.js";

const router = express.Router();
const upload = multer({ storage: cloudinaryStorage });

/* =====================================================
   📤 UPLOAD ROUTES
===================================================== */

/**
 * @route   POST /api/videos
 * @desc    Upload video file to Cloudinary
 * @access  Private
 */
router.post(
  "/",
  verifyToken,
  upload.single("video"),
  (req, res, next) => {
    if (!req.file) {
      return res.status(400).json({
        error: "Video file is required",
      });
    }
    next();
  },
  uploadVideoToCloudinary
);

/**
 * @route   POST /api/videos/youtube
 * @desc    Save YouTube video link
 * @access  Private
 */
router.post("/youtube", verifyToken, uploadYouTubeVideo);

/* =====================================================
   📥 FETCH ROUTES (PUBLIC)
===================================================== */

/**
 * @route   GET /api/videos
 * @desc    Get all public videos (Learn / Talent pages)
 * @access  Public
 */
router.get("/", getAllVideos);

/**
 * @route   GET /api/videos/category/:category
 * @desc    Get videos by category (random 100)
 * @access  Public
 */
router.get("/category/:category", getVideosByCategory);

/**
 * @route   GET /api/videos/filter
 * @desc    Filter videos by category / genre / level
 * @access  Public
 * @example /api/videos/filter?category=dance&genre=hip-hop&level=beginner
 */
router.get("/filter", getFilteredVideos);

/* =====================================================
   👤 USER-SPECIFIC ROUTES
===================================================== */

/**
 * @route   GET /api/videos/my
 * @desc    Get logged-in user's videos
 * @access  Private
 */
router.get("/my", verifyToken, getMyVideos);

/**
 * @route   DELETE /api/videos/:id
 * @desc    Delete a video owned by user
 * @access  Private
 */
router.delete("/:id", verifyToken, deleteVideo);

/* =====================================================
   🧪 HEALTH CHECK
===================================================== */
router.get("/health", (req, res) => {
  res.status(200).json({
    status: "OK",
    message: "Video routes working correctly",
  });
});

export default router;
