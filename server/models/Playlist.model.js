import mongoose from "mongoose";

const playlistSchema = new mongoose.Schema(
  {
    /* ===================== OWNER ===================== */
    user_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },

    /* ===================== BASIC INFO ===================== */
    name: {
      type: String,
      required: [true, "Playlist name is required"],
      trim: true,
      minlength: 2,
      maxlength: 120,
    },

    description: {
      type: String,
      trim: true,
      maxlength: 1000,
      default: "",
    },

    occasion: {
      type: String,
      trim: true,
      maxlength: 100,
      default: "",
    },

    /* ===================== SONGS ===================== */
    song_list: {
      type: [String], // YouTube / Cloudinary / Audio URLs
      validate: {
        validator: function (arr) {
          return arr.every(
            (url) => typeof url === "string" && url.length > 0
          );
        },
        message: "Song list must contain valid URLs",
      },
      default: [],
    },

    /* ===================== VISIBILITY ===================== */
    isPublic: {
      type: Boolean,
      default: true,
      index: true,
    },
  },
  {
    timestamps: true, // createdAt & updatedAt
    versionKey: false,
  }
);

/* ===================== INDEXES ===================== */
// Fast lookup for user playlists
playlistSchema.index({ user_id: 1, createdAt: -1 });

// Public playlists browsing
playlistSchema.index({ isPublic: 1 });

export default mongoose.model("Playlist", playlistSchema);
