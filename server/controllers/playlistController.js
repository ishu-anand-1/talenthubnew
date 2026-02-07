// controllers/playlistController.js

import mongoose from "mongoose";
import Playlist from "../models/Playlist.model.js";

/* ===================== CREATE PLAYLIST ===================== */
export const createPlaylist = async (req, res) => {
  try {
    const { name, description, occasion, song_list, isPublic } = req.body;

    if (!name) {
      return res.status(400).json({
        error: "Playlist name is required",
      });
    }

    const playlist = await Playlist.create({
      user_id: req.user.id,              // ✅ correct field
      name: name.trim(),
      description: description?.trim() || "",
      occasion: occasion?.trim() || "",
      song_list: Array.isArray(song_list) ? song_list : [],
      isPublic: isPublic ?? true,
    });

    res.status(201).json({
      message: "Playlist created successfully",
      playlist,
    });
  } catch (error) {
    console.error("❌ Create playlist error:", error);
    res.status(500).json({
      error: "Failed to create playlist",
    });
  }
};

/* ===================== GET ALL PLAYLISTS (PUBLIC) ===================== */
export const getAllPlaylists = async (req, res) => {
  try {
    const playlists = await Playlist.find({ isPublic: true })
      .sort({ createdAt: -1 })
      .populate("user_id", "name");

    res.status(200).json(playlists);
  } catch (error) {
    console.error("❌ Fetch playlists error:", error);
    res.status(500).json({
      error: "Failed to fetch playlists",
    });
  }
};

/* ===================== GET PLAYLIST BY ID ===================== */
export const getPlaylistById = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        error: "Invalid playlist ID",
      });
    }

    const playlist = await Playlist.findById(id).populate(
      "user_id",
      "name"
    );

    if (!playlist) {
      return res.status(404).json({
        error: "Playlist not found",
      });
    }

    res.status(200).json(playlist);
  } catch (error) {
    console.error("❌ Fetch playlist error:", error);
    res.status(500).json({
      error: "Failed to fetch playlist",
    });
  }
};

/* ===================== UPDATE PLAYLIST ===================== */
export const updatePlaylist = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        error: "Invalid playlist ID",
      });
    }

    const playlist = await Playlist.findById(id);

    if (!playlist) {
      return res.status(404).json({
        error: "Playlist not found",
      });
    }

    // 🔐 Ownership check
    if (playlist.user_id.toString() !== req.user.id) {
      return res.status(403).json({
        error: "You are not allowed to update this playlist",
      });
    }

    const allowedUpdates = [
      "name",
      "description",
      "occasion",
      "song_list",
      "isPublic",
    ];

    allowedUpdates.forEach((field) => {
      if (req.body[field] !== undefined) {
        playlist[field] = req.body[field];
      }
    });

    await playlist.save();

    res.status(200).json({
      message: "Playlist updated successfully",
      playlist,
    });
  } catch (error) {
    console.error("❌ Update playlist error:", error);
    res.status(500).json({
      error: "Failed to update playlist",
    });
  }
};

/* ===================== DELETE PLAYLIST ===================== */
export const deletePlaylist = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        error: "Invalid playlist ID",
      });
    }

    const playlist = await Playlist.findById(id);

    if (!playlist) {
      return res.status(404).json({
        error: "Playlist not found",
      });
    }

    // 🔐 Ownership check
    if (playlist.user_id.toString() !== req.user.id) {
      return res.status(403).json({
        error: "You are not allowed to delete this playlist",
      });
    }

    await playlist.deleteOne();

    res.status(200).json({
      message: "Playlist deleted successfully",
    });
  } catch (error) {
    console.error("❌ Delete playlist error:", error);
    res.status(500).json({
      error: "Failed to delete playlist",
    });
  }
};
