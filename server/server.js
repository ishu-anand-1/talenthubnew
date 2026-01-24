import express from "express";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import connectDB from "./config/db.js";

// Routes
import authRoutes from "./routes/authRoutes.js";
import videoRoutes from "./routes/videoRoutes.js";
import playlistRoutes from "./routes/playlistRoutes.js";
import userRoutes from "./routes/userRoutes.js";
import postRoutes from "./routes/postRoutes.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// ===================== DB =====================
connectDB();

// ===================== TRUST PROXY =====================
app.set("trust proxy", 1);

// ===================== CORS (LOCALHOST FIRST – MANUAL) =====================
app.use((req, res, next) => {
  const origin = req.headers.origin;

  // Allow localhost frontend
  if (origin === "http://localhost:5173") {
    res.header("Access-Control-Allow-Origin", origin);
  }

  res.header("Access-Control-Allow-Credentials", "true");
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept, Authorization"
  );
  res.header(
    "Access-Control-Allow-Methods",
    "GET, POST, PUT, PATCH, DELETE, OPTIONS"
  );

  // Handle preflight requests
  if (req.method === "OPTIONS") {
    return res.sendStatus(200);
  }

  next();
});

// ===================== MIDDLEWARE =====================
app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// ===================== ROUTES =====================
app.use("/api/auth", authRoutes);
app.use("/api/videos", videoRoutes);
app.use("/api/users", userRoutes);
app.use("/api/posts", postRoutes);
app.use("/api/playlists", playlistRoutes);

// ===================== HEALTH =====================
app.get("/", (req, res) => {
  res.status(200).send("✅ API is running...");
});

// ===================== 404 =====================
app.use((req, res) => {
  res.status(404).json({ error: "Route not found" });
});

// ===================== ERROR =====================
app.use((err, req, res, next) => {
  console.error("🔥 Error:", err.message);
  res.status(500).json({ error: "Server error" });
});

// ===================== START =====================
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
