import { Navigate, useLocation } from "react-router-dom";

/**
 * ProtectedRoute
 * Ensures only authenticated users can access a route.
 */
const ProtectedRoute = ({ children }) => {
  const location = useLocation();

  /* ================= AUTH CHECK ================= */
  const token = localStorage.getItem("token");
  let user = null;

  try {
    const storedUser = localStorage.getItem("user");
    user = storedUser ? JSON.parse(storedUser) : null;
  } catch {
    user = null;
  }

  const isAuthenticated = Boolean(token && user);

  /* ================= REDIRECT IF NOT AUTH ================= */
  if (!isAuthenticated) {
    return (
      <Navigate
        to="/login"
        replace
        state={{ from: location.pathname }}
      />
    );
  }

  /* ================= ALLOW ACCESS ================= */
  return children;
};

export default ProtectedRoute;
