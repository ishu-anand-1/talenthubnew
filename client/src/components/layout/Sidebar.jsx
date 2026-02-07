import { NavLink } from "react-router-dom";
import { LayoutDashboard, UploadCloud, MessageSquare } from "lucide-react";

const Sidebar = () => {
  return (
    <aside className="hidden md:flex w-64 min-h-screen bg-gray-900 text-white px-6 py-8">
      <nav className="w-full space-y-2">
        <SidebarLink
          to="/dashboard"
          icon={<LayoutDashboard size={18} />}
          label="Dashboard"
        />

        <SidebarLink
          to="/upload"
          icon={<UploadCloud size={18} />}
          label="Upload"
        />

        <SidebarLink
          to="/chat"
          icon={<MessageSquare size={18} />}
          label="Messages"
        />
      </nav>
    </aside>
  );
};

/* ===================== LINK ITEM ===================== */
const SidebarLink = ({ to, icon, label }) => (
  <NavLink
    to={to}
    className={({ isActive }) =>
      `
      flex items-center gap-3
      px-4 py-2 rounded-lg
      transition
      ${
        isActive
          ? "bg-indigo-600 text-white"
          : "text-gray-300 hover:bg-gray-800 hover:text-indigo-400"
      }
    `
    }
  >
    {icon}
    <span className="font-medium">{label}</span>
  </NavLink>
);

export default Sidebar;
