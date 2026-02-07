import multer from "multer";
import { cloudinaryStorage } from "../config/cloudinary.js";

/* ===================== FILE FILTER ===================== */
const fileFilter = (req, file, cb) => {
  const allowedVideoTypes = [
    "video/mp4",
    "video/mov",
    "video/quicktime",
    "video/x-msvideo",
    "video/x-matroska",
  ];

  const allowedImageTypes = [
    "image/jpeg",
    "image/png",
    "image/jpg",
    "image/webp",
  ];

  if (
    allowedVideoTypes.includes(file.mimetype) ||
    allowedImageTypes.includes(file.mimetype)
  ) {
    cb(null, true);
  } else {
    cb(
      new Error(
        "Invalid file type. Only videos (mp4, mov, avi, mkv) and images (jpg, png, webp) are allowed."
      ),
      false
    );
  }
};

/* ===================== MULTER INSTANCE ===================== */
const upload = multer({
  storage: cloudinaryStorage,
  fileFilter,
  limits: {
    fileSize: 1024 * 1024 * 200, // 200MB max
  },
});

/* ===================== EXPORTS ===================== */

// Single video upload (most common)
export const uploadSingleVideo = upload.single("video");

// Single image upload (profile, thumbnail, etc.)
export const uploadSingleImage = upload.single("image");

// Mixed uploads (example: video + thumbnail)
export const uploadVideoWithThumbnail = upload.fields([
  { name: "video", maxCount: 1 },
  { name: "thumbnail", maxCount: 1 },
]);

export default upload;
