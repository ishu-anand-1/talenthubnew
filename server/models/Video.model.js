import mongoose from "mongoose";

const videoSchema = new mongoose.Schema(
  {
    user_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },

    title: {
      type: String,
      required: true,
      trim: true,
      maxlength: 150,
    },

    description: {
      type: String,
      trim: true,
      default: "",
    },

    category: {
      type: String,
      required: true,
      lowercase: true,
      index: true,
    },

    genre: {
      type: String,
      required: true,
      lowercase: true,
      index: true,
    },

    level: {
      type: String,
      required: true,
      lowercase: true,
      index: true,
    },

    video_url: {
      type: String,
      required: true,
    },

    thumbnail_url: {
      type: String,
      default: "",
    },

    views: {
      type: Number,
      default: 0,
    },

    isPublic: {
      type: Boolean,
      default: true,
    },

    isLearnVideo: {
      type: Boolean,
      default: false,
      index: true,
    },
    cloudinary_id: {
      type: String,
      default: "",
}

  },
  { timestamps: true }
);

/* 🔍 Compound index for fast filtering */
videoSchema.index({ category: 1, genre: 1, level: 1 });

export default mongoose.model("Video", videoSchema);
