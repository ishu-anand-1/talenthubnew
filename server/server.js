// server/server.js
import express from "express";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import cors from "cors";
import connectDB from "./config/db.js";

// ===================== ROUTES =====================
import authRoutes from "./routes/authRoutes.js";
import videoRoutes from "./routes/videoRoutes.js";
import playlistRoutes from "./routes/playlistRoutes.js";
import userRoutes from "./routes/userRoutes.js";
import postRoutes from "./routes/postRoutes.js";

// ===================== CONFIG =====================
dotenv.config();
const app = express();
const PORT = process.env.PORT || 5000;

// ===================== DATABASE =====================
connectDB();

// ===================== TRUST PROXY =====================
app.set("trust proxy", 1);

// ===================== CORS =====================
app.use(
  cors({
    origin: [
      "http://localhost:5173", // local frontend
      process.env.CLIENT_URL,  // production frontend
    ],
    credentials: true,
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    allowedHeaders: [
      "Content-Type",
      "Authorization",
      "X-Requested-With",
    ],
  })
);

// ===================== MIDDLEWARE =====================
app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// ===================== API ROUTES =====================
app.use("/api/auth", authRoutes);
app.use("/api/videos", videoRoutes);
app.use("/api/users", userRoutes);
app.use("/api/posts", postRoutes);
app.use("/api/playlists", playlistRoutes);

// ===================== HEALTH CHECK =====================
app.get("/", (req, res) => {
  res.status(200).json({
    success: true,
    message: "🚀 TalentHub API is running",
  });
});

// ===================== 404 HANDLER =====================
app.use((req, res) => {
  res.status(404).json({
    success: false,
    error: "Route not found",
  });
});

// ===================== GLOBAL ERROR HANDLER =====================
app.use((err, req, res, next) => {
  console.error("🔥 ERROR:", err.stack);

  res.status(err.statusCode || 500).json({
    success: false,
    message: err.message || "Internal Server Error",
  });
});

// ===================== START SERVER =====================
app.listen(PORT, () => {
  console.log(`
🚀 TalentHub Backend Started
📡 Port: ${PORT}
🌍 Mode: ${process.env.NODE_ENV || "development"}
`);
});
