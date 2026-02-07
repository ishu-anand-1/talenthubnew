import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

/* ===================== LAYOUT ===================== */
import Navbar from "./components/layout/Navbar";
import Footer from "./components/layout/Footer";

/* ===================== ROUTE GUARDS ===================== */
import ProtectedRoute from "./routes/ProtectedRoute";
import RoleRoute from "./routes/RoleRoute";

/* ===================== PAGES ===================== */
/* Public */
import Home from "./pages/home/Home";
import Login from "./pages/auth/Login";
import Register from "./pages/auth/Register";
import ForgotPassword from "./pages/auth/ForgotPassword";
import VerifiedPage from "./pages/auth/VerifiedPage";
import Learn from "./pages/learn/learn";
import Talent from "./pages/talent/Talent";
import CategoryPage from "./pages/talent/CategoryPage";
import DanceVideos from "./pages/talent/DanceVideos";
import VideoCategoryPage from "./pages/talent/VideoCategoryPage";
import PlaylistPage from "./pages/talent/PlaylistPage";

/* Artist */
import Dashboard from "./pages/artist/Dashboard";
import Upload from "./pages/artist/Upload";

/* Recruiter */
import RecruiterDashboard from "./pages/recruiter/RecruiterDashboard";
import DiscoverTalent from "./pages/recruiter/DiscoverTalent";
import Shortlist from "./pages/recruiter/Shortlist";
import Hiring from "./pages/recruiter/Hiring";

/* Chat */
import Inbox from "./pages/chat/Inbox";
import ChatRoom from "./pages/chat/ChatRoom";

/* Profile */
import Profile from "./pages/profile/Profile";

/* Errors */
import NotFound from "./pages/errors/NotFound";

const App = () => {
  return (
    <Router>
      <div className="min-h-screen flex flex-col bg-gray-50 dark:bg-gray-950 text-gray-900 dark:text-gray-100">
        
        {/* ================= NAVBAR ================= */}
        <Navbar />

        {/* ================= MAIN ================= */}
        <main className="flex-1 pt-20 px-4">
          <Routes>
            {/* ================= PUBLIC ================= */}
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/forgot-password" element={<ForgotPassword />} />
            <Route path="/verified" element={<VerifiedPage />} />

            <Route path="/learn" element={<Learn />} />
            <Route path="/talent" element={<Talent />} />
            <Route path="/category/:category" element={<CategoryPage />} />
            <Route path="/videos/dance" element={<DanceVideos />} />
            <Route path="/videos/:category" element={<VideoCategoryPage />} />
            <Route path="/playlist" element={<PlaylistPage />} />

            {/* ================= AUTHENTICATED ================= */}
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
              path="/profile/:id"
              element={
                <ProtectedRoute>
                  <Profile />
                </ProtectedRoute>
              }
            />

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

            {/* ================= CHAT ================= */}
            <Route
              path="/chat"
              element={
                <ProtectedRoute>
                  <Inbox />
                </ProtectedRoute>
              }
            />

            <Route
              path="/chat/:id"
              element={
                <ProtectedRoute>
                  <ChatRoom />
                </ProtectedRoute>
              }
            />

            {/* ================= 404 ================= */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </main>

        {/* ================= FOOTER ================= */}
        <Footer />
      </div>
    </Router>
  );
};

export default App;
