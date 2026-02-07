import { memo } from "react";

/* ===================== BACKEND-SAFE LEVELS ===================== */
const LEVELS = [
  { label: "All", value: "all" },
  { label: "Beginner", value: "beginner" },
  { label: "Intermediate", value: "intermediate" },
  { label: "Advanced", value: "advanced" },
];

/* ===================== COMPONENT ===================== */
const LevelFilter = ({ value = "all", onChange }) => {
  return (
    <div className="flex flex-col min-w-[160px]">
      {/* ================= LABEL ================= */}
      <label
        htmlFor="level-filter"
        className="mb-1 text-xs font-semibold text-gray-500 dark:text-gray-400"
      >
        Level
      </label>

      {/* ================= SELECT ================= */}
      <select
        id="level-filter"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="
          w-full
          px-4 py-2
          rounded-lg
          border border-gray-300 dark:border-gray-700
          bg-white dark:bg-gray-950
          text-sm font-medium
          text-gray-800 dark:text-gray-100
          shadow-sm
          focus:outline-none
          focus:ring-2 focus:ring-indigo-500
          focus:border-indigo-500
          hover:border-indigo-400 dark:hover:border-indigo-500
          transition-all duration-200
        "
      >
        {LEVELS.map(({ label, value }) => (
          <option key={value} value={value}>
            {label}
          </option>
        ))}
      </select>
    </div>
  );
};

export default memo(LevelFilter);
