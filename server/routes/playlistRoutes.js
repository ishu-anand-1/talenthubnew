import express from "express";
import {
  createPlaylist,
  getAllPlaylists,
  getPlaylistById,
  updatePlaylist,
  deletePlaylist,
} from "../controllers/playlistController.js";
import { verifyToken } from "../middleware/authMiddleware.js";

const router = express.Router();

/* ===================== PLAYLIST ROUTES ===================== */

/**
 * @route   POST /api/playlist
 * @desc    Create a new playlist
 * @access  Private (Authenticated user)
 */
router.post("/", verifyToken, createPlaylist);

/**
 * @route   GET /api/playlist
 * @desc    Get all playlists
 * @access  Public
 */
router.get("/", getAllPlaylists);

/**
 * @route   GET /api/playlist/:id
 * @desc    Get playlist by ID
 * @access  Public
 */
router.get("/:id", getPlaylistById);

/**
 * @route   PUT /api/playlist/:id
 * @desc    Update playlist
 * @access  Private (Authenticated user)
 */
router.put("/:id", verifyToken, updatePlaylist);

/**
 * @route   DELETE /api/playlist/:id
 * @desc    Delete playlist
 * @access  Private (Authenticated user)
 */
router.delete("/:id", verifyToken, deletePlaylist);

export default router;
