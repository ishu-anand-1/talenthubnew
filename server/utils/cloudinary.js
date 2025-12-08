// utils/cloudinary.js
import { v2 as cloudinary } from "cloudinary";
import pkg from "multer-storage-cloudinary";

const { CloudinaryStorage } = pkg; // <-- correct import for CommonJS module

// Cloudinary configuration
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Multer storage configuration
export const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: async (req, file) => ({
    folder: "talenthub_videos",
    resource_type: "video",
    allowed_formats: ["mp4", "mov", "avi"],
    public_id: `${Date.now()}-${file.originalname}`,
  }),
});

export default cloudinary;
