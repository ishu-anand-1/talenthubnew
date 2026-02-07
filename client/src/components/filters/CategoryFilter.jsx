import { memo } from "react";

/* ===================== BACKEND-SYNCED CATEGORIES ===================== */
const CATEGORIES = [
  { label: "All", value: "all" },
  { label: "Dance", value: "dance" },
  { label: "Singing", value: "singing" },
  { label: "Instrument", value: "instruments" },
];

const CategoryFilter = ({ value = "all", onChange }) => {
  const handleChange = (e) => {
    onChange?.(e.target.value);
  };

  return (
    <div className="flex flex-col gap-1 min-w-[160px]">
      {/* ================= LABEL ================= */}
      <label
        htmlFor="category-filter"
        className="text-xs font-semibold text-gray-500 dark:text-gray-400"
      >
        Category
      </label>

      {/* ================= SELECT ================= */}
      <select
        id="category-filter"
        value={value}
        onChange={handleChange}
        className="
          w-full
          px-4 py-2
          rounded-lg
          border border-gray-300 dark:border-gray-700
          bg-white dark:bg-gray-900
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
        {CATEGORIES.map(({ label, value }) => (
          <option
            key={value}
            value={value}
            className="bg-white dark:bg-gray-900"
          >
            {label}
          </option>
        ))}
      </select>
    </div>
  );
};

export default memo(CategoryFilter);
