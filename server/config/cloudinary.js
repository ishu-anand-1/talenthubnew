// config/cloudinary.js
import { v2 as cloudinary } from "cloudinary";
import { CloudinaryStorage } from "multer-storage-cloudinary";

/* ===================== VALIDATE ENV ===================== */
if (
  !process.env.CLOUDINARY_CLOUD_NAME ||
  !process.env.CLOUDINARY_API_KEY ||
  !process.env.CLOUDINARY_API_SECRET
) {
  throw new Error("❌ Cloudinary environment variables are missing");
}

/* ===================== CLOUDINARY CONFIG ===================== */
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

/* ===================== MULTER CLOUDINARY STORAGE ===================== */
export const cloudinaryStorage = new CloudinaryStorage({
  cloudinary,
  params: async (req, file) => {
    const isVideo = file.mimetype.startsWith("video");

    return {
      folder: isVideo ? "talenthub/videos" : "talenthub/images",
      resource_type: isVideo ? "video" : "image",

      // clean & unique public id
      public_id: `${Date.now()}-${file.originalname
        .replace(/\.[^/.]+$/, "")
        .replace(/\s+/g, "-")
        .toLowerCase()}`,

      allowed_formats: isVideo
        ? ["mp4", "mov", "avi", "mkv"]
        : ["jpg", "jpeg", "png", "webp"],
    };
  },
});

/* ===================== EXPORT CLOUDINARY ===================== */
export default cloudinary;
