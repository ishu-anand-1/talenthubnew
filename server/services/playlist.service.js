import Playlist from "../models/Playlist.js";

/* ===================== CREATE PLAYLIST ===================== */
export const createPlaylistService = async ({
  name,
  description = "",
  occasion = "",
  song_list = [],
}) => {
  if (!name) {
    throw new Error("Playlist name is required");
  }

  const playlist = await Playlist.create({
    name: name.trim(),
    description,
    occasion,
    song_list,
  });

  return playlist;
};

/* ===================== GET ALL PLAYLISTS ===================== */
export const getPlaylistsService = async () => {
  return await Playlist.find()
    .sort({ created_at: -1 })
    .lean();
};

/* ===================== GET PLAYLIST BY ID ===================== */
export const getPlaylistByIdService = async (playlistId) => {
  if (!playlistId) {
    throw new Error("Playlist ID is required");
  }

  const playlist = await Playlist.findById(playlistId).lean();

  if (!playlist) {
    throw new Error("Playlist not found");
  }

  return playlist;
};

/* ===================== UPDATE PLAYLIST ===================== */
export const updatePlaylistService = async (playlistId, updateData) => {
  if (!playlistId) {
    throw new Error("Playlist ID is required");
  }

  const updated = await Playlist.findByIdAndUpdate(
    playlistId,
    updateData,
    { new: true, runValidators: true }
  );

  if (!updated) {
    throw new Error("Playlist not found");
  }

  return updated;
};

/* ===================== DELETE PLAYLIST ===================== */
export const deletePlaylistService = async (playlistId) => {
  if (!playlistId) {
    throw new Error("Playlist ID is required");
  }

  const deleted = await Playlist.findByIdAndDelete(playlistId);

  if (!deleted) {
    throw new Error("Playlist not found");
  }

  return deleted;
};
