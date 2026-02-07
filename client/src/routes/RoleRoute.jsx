import { Navigate, useLocation } from "react-router-dom";

/**
 * RoleRoute
 * Restricts access based on user role.
 *
 * Example:
 * <RoleRoute role="recruiter">
 *   <RecruiterDashboard />
 * </RoleRoute>
 */
const RoleRoute = ({ children, role }) => {
  const location = useLocation();

  /* ================= READ AUTH DATA ================= */
  const token = localStorage.getItem("token");
  let storedRole = localStorage.getItem("role");

  /* ================= FALLBACK USER ROLE ================= */
  if (!storedRole) {
    try {
      const storedUser = localStorage.getItem("user");
      const user = storedUser ? JSON.parse(storedUser) : null;
      storedRole = user?.role || null;
    } catch {
      storedRole = null;
    }
  }

  /* ================= NOT LOGGED IN ================= */
  if (!token) {
    return (
      <Navigate
        to="/login"
        replace
        state={{ from: location.pathname }}
      />
    );
  }

  /* ================= WRONG ROLE ================= */
  if (!storedRole || storedRole !== role) {
    return (
      <Navigate
        to="/"
        replace
        state={{ from: location.pathname }}
      />
    );
  }

  /* ================= AUTHORIZED ================= */
  return children;
};

export default RoleRoute;
