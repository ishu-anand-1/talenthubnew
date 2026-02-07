import { Moon, Sun } from "lucide-react";
import { useEffect, useState } from "react";

const THEME_KEY = "theme";

const getInitialTheme = () => {
  // 1️⃣ Stored preference
  const stored = localStorage.getItem(THEME_KEY);
  if (stored === "dark" || stored === "light") return stored;

  // 2️⃣ System preference
  return window.matchMedia("(prefers-color-scheme: dark)").matches
    ? "dark"
    : "light";
};

const DarkModeToggle = () => {
  const [theme, setTheme] = useState(getInitialTheme);

  /* ================= APPLY THEME ================= */
  useEffect(() => {
    const root = document.documentElement;

    if (theme === "dark") {
      root.classList.add("dark");
    } else {
      root.classList.remove("dark");
    }

    localStorage.setItem(THEME_KEY, theme);
  }, [theme]);

  /* ================= TOGGLE ================= */
  const toggleTheme = () => {
    setTheme((prev) => (prev === "dark" ? "light" : "dark"));
  };

  /* ================= UI ================= */
  return (
    <button
      onClick={toggleTheme}
      aria-label="Toggle dark mode"
      className="
        ml-4 p-2
        rounded-full
        bg-gray-200 dark:bg-gray-700
        hover:bg-gray-300 dark:hover:bg-gray-600
        transition-colors duration-200
        flex items-center justify-center
      "
    >
      {theme === "dark" ? (
        <Sun className="w-5 h-5 text-yellow-400" />
      ) : (
        <Moon className="w-5 h-5 text-gray-800 dark:text-gray-200" />
      )}
    </button>
  );
};

export default DarkModeToggle;
