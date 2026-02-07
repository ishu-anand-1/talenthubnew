import jwt from "jsonwebtoken";

/* ===================== ENV VALIDATION ===================== */
if (!process.env.JWT_SECRET) {
  throw new Error("❌ JWT_SECRET is not defined in environment variables");
}

/* ===================== GENERATE TOKEN ===================== */
/**
 * Generates a signed JWT token
 *
 * @param {Object} payload - Data to encode in token (e.g. user id, role)
 * @param {String} expiresIn - Token expiry (default: 7d)
 * @returns {String} JWT token
 */
const generateToken = (payload, expiresIn = "7d") => {
  if (!payload || typeof payload !== "object") {
    throw new Error("❌ JWT payload must be an object");
  }

  return jwt.sign(payload, process.env.JWT_SECRET, {
    expiresIn,
    issuer: "TalentHub",
  });
};

export default generateToken;
