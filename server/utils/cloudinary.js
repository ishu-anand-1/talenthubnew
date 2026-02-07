import { v2 as cloudinary } from "cloudinary";
import { CloudinaryStorage } from "multer-storage-cloudinary";

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export const cloudinaryStorage = new CloudinaryStorage({
  cloudinary,
  params: async (req, file) => {
    const isVideo = file.mimetype.startsWith("video");
    return {
      folder: isVideo ? "talenthub/videos" : "talenthub/images",
      resource_type: isVideo ? "video" : "image",
      public_id: `${Date.now()}-${file.originalname
        .split(".")[0]
        .replace(/\s+/g, "_")}`,
    };
  },
});

export default cloudinary;
