// server/config/db.js
import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config();

/* ===================== ENV VALIDATION ===================== */
const MONGO_URI = process.env.MONGO_URI;

if (!MONGO_URI) {
  console.error("❌ MONGO_URI is missing in environment variables");
  process.exit(1);
}

/* ===================== CONNECT DATABASE ===================== */
const connectDB = async () => {
  try {
    const conn = await mongoose.connect(MONGO_URI, {
      autoIndex: true,               // useful in development
      serverSelectionTimeoutMS: 5000 // fail fast if DB is unreachable
    });

    console.log(
      `✅ MongoDB Connected Successfully
🔗 Host: ${conn.connection.host}
📦 Database: ${conn.connection.name}`
    );
  } catch (error) {
    console.error("❌ MongoDB Connection Failed");
    console.error(error.message);
    process.exit(1);
  }
};

/* ===================== GRACEFUL SHUTDOWN ===================== */
const gracefulShutdown = async (signal) => {
  try {
    await mongoose.connection.close();
    console.log(`🔌 MongoDB disconnected (${signal})`);
    process.exit(0);
  } catch (err) {
    console.error("❌ Error during MongoDB shutdown", err);
    process.exit(1);
  }
};

process.on("SIGINT", gracefulShutdown);
process.on("SIGTERM", gracefulShutdown);

export default connectDB;
