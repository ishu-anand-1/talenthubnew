import { Routes, Route, Navigate } from "react-router-dom";
import { Suspense, lazy } from "react";

/* ===================== ROUTE GUARDS ===================== */
import ProtectedRoute from "./ProtectedRoute";
import RoleRoute from "./RoleRoute";

/* ===================== LAZY PAGES ===================== */
/* ---------- Public ---------- */
const Home = lazy(() => import("../pages/home/Home"));
const Login = lazy(() => import("../pages/auth/Login"));
const Register = lazy(() => import("../pages/auth/Register"));
const ForgotPassword = lazy(() =>
  import("../pages/auth/ForgotPassword")
);

/* ---------- Artist ---------- */
const Dashboard = lazy(() => import("../pages/artist/Dashboard"));
const Upload = lazy(() => import("../pages/artist/Upload"));
const MyVideos = lazy(() => import("../pages/artist/MyVideos"));
const Learn = lazy(() => import("../pages/artist/Learn"));
const Profile = lazy(() => import("../pages/artist/Profile"));
const PlaylistPage = lazy(() => import("../pages/artist/PlaylistPage"));

/* ---------- Recruiter ---------- */
const RecruiterDashboard = lazy(() =>
  import("../pages/recruiter/RecruiterDashboard")
);
const DiscoverTalent = lazy(() =>
  import("../pages/recruiter/DiscoverTalent")
);
const Shortlist = lazy(() =>
  import("../pages/recruiter/Shortlist")
);
const Hiring = lazy(() => import("../pages/recruiter/Hiring"));
const Following = lazy(() =>
  import("../pages/recruiter/Following")
);

/* ---------- Shared ---------- */
const CategoryPage = lazy(() =>
  import("../pages/common/CategoryPage")
);
const Talent = lazy(() => import("../pages/common/Talent"));

/* ---------- Error ---------- */
const NotFound = lazy(() => import("../pages/errors/NotFound"));

/* ===================== LOADER ===================== */
const PageLoader = () => (
  <div className="min-h-screen flex items-center justify-center text-gray-400">
    Loading...
  </div>
);

/* ===================== ROUTES ===================== */
const AppRoutes = () => {
  return (
    <Suspense fallback={<PageLoader />}>
      <Routes>
        {/* ================= PUBLIC ================= */}
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />

        {/* ================= ARTIST ================= */}
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        />

        <Route
          path="/upload"
          element={
            <ProtectedRoute>
              <Upload />
            </ProtectedRoute>
          }
        />

        <Route
          path="/my-videos"
          element={
            <ProtectedRoute>
              <MyVideos />
            </ProtectedRoute>
          }
        />

        <Route
          path="/learn"
          element={
            <ProtectedRoute>
              <Learn />
            </ProtectedRoute>
          }
        />

        <Route
          path="/playlist"
          element={
            <ProtectedRoute>
              <PlaylistPage />
            </ProtectedRoute>
          }
        />

        <Route
          path="/profile/:id"
          element={
            <ProtectedRoute>
              <Profile />
            </ProtectedRoute>
          }
        />

        {/* ================= TALENT ================= */}
        <Route path="/talent" element={<Talent />} />
        <Route path="/category/:category" element={<CategoryPage />} />

        {/* ================= RECRUITER ================= */}
        <Route
          path="/recruiter/dashboard"
          element={
            <ProtectedRoute>
              <RoleRoute role="recruiter">
                <RecruiterDashboard />
              </RoleRoute>
            </ProtectedRoute>
          }
        />

        <Route
          path="/recruiter/discover"
          element={
            <ProtectedRoute>
              <RoleRoute role="recruiter">
                <DiscoverTalent />
              </RoleRoute>
            </ProtectedRoute>
          }
        />

        <Route
          path="/recruiter/shortlist"
          element={
            <ProtectedRoute>
              <RoleRoute role="recruiter">
                <Shortlist />
              </RoleRoute>
            </ProtectedRoute>
          }
        />

        <Route
          path="/recruiter/hiring"
          element={
            <ProtectedRoute>
              <RoleRoute role="recruiter">
                <Hiring />
              </RoleRoute>
            </ProtectedRoute>
          }
        />

        <Route
          path="/recruiter/following"
          element={
            <ProtectedRoute>
              <RoleRoute role="recruiter">
                <Following />
              </RoleRoute>
            </ProtectedRoute>
          }
        />

        {/* ================= REDIRECTS ================= */}
        <Route
          path="/recruiter"
          element={<Navigate to="/recruiter/dashboard" replace />}
        />

        {/* ================= 404 ================= */}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </Suspense>
  );
};

export default AppRoutes;
