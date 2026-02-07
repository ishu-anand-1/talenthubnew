import { useState, useCallback, useEffect, useRef } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import {
  Menu,
  X,
  Bell,
  MessageSquare,
  LogOut,
  User,
} from "lucide-react";
import DarkModeToggle from "./DarkModeToggle";

const Navbar = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const [menuOpen, setMenuOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);

  const profileRef = useRef(null);

  const token = localStorage.getItem("token");
  const user = JSON.parse(localStorage.getItem("user") || "{}");

  /* ===================== ACTIVE LINK ===================== */
  const isActive = useCallback(
    (path) =>
      location.pathname === path ||
      location.pathname.startsWith(path + "/"),
    [location.pathname]
  );

  /* ===================== LOGOUT ===================== */
  const handleLogout = () => {
    localStorage.clear();
    navigate("/login");
  };

  /* ===================== CLOSE PROFILE ON OUTSIDE CLICK ===================== */
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (profileRef.current && !profileRef.current.contains(e.target)) {
        setProfileOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () =>
      document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  /* ===================== NAV LINKS ===================== */
  const navLinks = [
    { label: "Home", to: "/" },
    { label: "Learn", to: "/learn" },
    { label: "Talents", to: "/talent" },
  ];

  return (
    <nav className="fixed top-0 z-50 w-full bg-white dark:bg-gray-950 border-b border-gray-200 dark:border-gray-800">
      <div className="max-w-7xl mx-auto h-16 px-6 flex items-center justify-between">

        {/* ================= LOGO ================= */}
        <Link to="/" className="flex items-center gap-2 text-xl font-extrabold">
          <span className="text-indigo-600">TalentHub</span>
        </Link>

        {/* ================= DESKTOP NAV ================= */}
        <div className="hidden md:flex items-center gap-6">
          {navLinks.map(({ label, to }) => (
            <Link
              key={to}
              to={to}
              className={`font-medium transition ${
                isActive(to)
                  ? "text-indigo-600"
                  : "text-gray-600 dark:text-gray-300 hover:text-indigo-600"
              }`}
            >
              {label}
            </Link>
          ))}
        </div>

        {/* ================= RIGHT ACTIONS ================= */}
        <div className="flex items-center gap-4">

          {!token ? (
            <>
              <Link
                to="/login"
                className="text-sm font-medium text-gray-700 dark:text-gray-300 hover:text-indigo-600"
              >
                Login
              </Link>

              <Link
                to="/register"
                className="bg-indigo-600 text-white px-4 py-2 rounded-full text-sm font-semibold hover:bg-indigo-700 transition"
              >
                Join Now
              </Link>
            </>
          ) : (
            <>
              {/* Notifications */}
              <button className="relative text-gray-600 dark:text-gray-300 hover:text-indigo-600">
                <Bell size={20} />
                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-[10px] rounded-full px-1">
                  3
                </span>
              </button>

              {/* Messages */}
              <button
                onClick={() => navigate("/chat")}
                className="relative text-gray-600 dark:text-gray-300 hover:text-indigo-600"
              >
                <MessageSquare size={20} />
                <span className="absolute -top-1 -right-1 bg-indigo-600 text-white text-[10px] rounded-full px-1">
                  5
                </span>
              </button>

              {/* Profile Dropdown */}
              <div ref={profileRef} className="relative">
                <button
                  onClick={() => setProfileOpen((p) => !p)}
                  className="w-9 h-9 rounded-full bg-indigo-600 text-white flex items-center justify-center font-bold uppercase"
                >
                  {user?.name?.charAt(0) || "U"}
                </button>

                {profileOpen && (
                  <div className="absolute right-0 mt-3 w-52 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl shadow-xl overflow-hidden">
                    <button
                      onClick={() => {
                        setProfileOpen(false);
                        navigate(`/profile/${user?.id}`);
                      }}
                      className="flex items-center gap-2 w-full px-4 py-3 hover:bg-gray-100 dark:hover:bg-gray-800"
                    >
                      <User size={16} /> View Profile
                    </button>

                    <button
                      onClick={handleLogout}
                      className="flex items-center gap-2 w-full px-4 py-3 text-red-500 hover:bg-gray-100 dark:hover:bg-gray-800"
                    >
                      <LogOut size={16} /> Logout
                    </button>
                  </div>
                )}
              </div>
            </>
          )}

          <DarkModeToggle />

          {/* ================= MOBILE MENU TOGGLE ================= */}
          <button
            className="md:hidden text-gray-700 dark:text-gray-300"
            onClick={() => setMenuOpen(!menuOpen)}
          >
            {menuOpen ? <X size={28} /> : <Menu size={28} />}
          </button>
        </div>
      </div>

      {/* ================= MOBILE MENU ================= */}
      {menuOpen && (
        <div className="md:hidden bg-white dark:bg-gray-950 border-t border-gray-200 dark:border-gray-800">
          <div className="flex flex-col px-6 py-4 gap-4">
            {navLinks.map(({ label, to }) => (
              <Link
                key={to}
                to={to}
                onClick={() => setMenuOpen(false)}
                className={`${
                  isActive(to)
                    ? "text-indigo-600 font-semibold"
                    : "text-gray-700 dark:text-gray-300"
                }`}
              >
                {label}
              </Link>
            ))}

            {!token ? (
              <>
                <Link to="/login">Login</Link>
                <Link to="/register">Join Now</Link>
              </>
            ) : (
              <button onClick={handleLogout} className="text-red-500 text-left">
                Logout
              </button>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
