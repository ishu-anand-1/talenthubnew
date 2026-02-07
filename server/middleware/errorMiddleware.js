/* ===================== GLOBAL ERROR HANDLER ===================== */
/* eslint-disable no-unused-vars */

const errorMiddleware = (err, req, res, next) => {
  console.error("🔥 Error:", {
    message: err.message,
    stack: process.env.NODE_ENV === "development" ? err.stack : undefined,
  });

  let statusCode = err.statusCode || 500;
  let message = err.message || "Internal Server Error";

  /* ===================== MONGOOSE ERRORS ===================== */

  // ❌ Invalid MongoDB ObjectId
  if (err.name === "CastError") {
    statusCode = 400;
    message = "Invalid ID format";
  }

  // ❌ Duplicate key error (unique fields)
  if (err.code === 11000) {
    statusCode = 409;
    const field = Object.keys(err.keyValue)[0];
    message = `${field} already exists`;
  }

  // ❌ Validation error
  if (err.name === "ValidationError") {
    statusCode = 400;
    message = Object.values(err.errors)
      .map((e) => e.message)
      .join(", ");
  }

  /* ===================== JWT ERRORS ===================== */

  if (err.name === "JsonWebTokenError") {
    statusCode = 401;
    message = "Invalid token. Please login again.";
  }

  if (err.name === "TokenExpiredError") {
    statusCode = 401;
    message = "Session expired. Please login again.";
  }

  /* ===================== FILE UPLOAD ERRORS ===================== */

  if (err.name === "MulterError") {
    statusCode = 400;
    message = err.message || "File upload error";
  }

  /* ===================== DEFAULT RESPONSE ===================== */

  res.status(statusCode).json({
    success: false,
    statusCode,
    message,
    ...(process.env.NODE_ENV === "development" && { stack: err.stack }),
  });
};

export default errorMiddleware;
