import User from "../models/User.js";

/* ===================== ROLE AUTHORIZATION ===================== */
/**
 * @param {...string} allowedRoles - roles allowed to access route
 * Example: roleMiddleware("recruiter")
 * Example: roleMiddleware("artist", "admin")
 */
const roleMiddleware = (...allowedRoles) => {
  return async (req, res, next) => {
    try {
      // req.user is injected by auth middleware (verifyToken)
      const userId = req.user?.id;

      if (!userId) {
        return res.status(401).json({
          success: false,
          message: "Unauthorized. User not authenticated.",
        });
      }

      const user = await User.findById(userId).select("role");

      if (!user) {
        return res.status(401).json({
          success: false,
          message: "User not found.",
        });
      }

      if (!allowedRoles.includes(user.role)) {
        return res.status(403).json({
          success: false,
          message: "Access denied. Insufficient permissions.",
        });
      }

      // attach role for later use
      req.user.role = user.role;

      next();
    } catch (error) {
      next(error); // handled by errorMiddleware
    }
  };
};

export default roleMiddleware;
