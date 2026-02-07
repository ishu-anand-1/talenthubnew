import { memo } from "react";

/* ===================== BACKEND-SYNCED CONFIG ===================== */
const FILTER_CONFIG = [
  {
    name: "category",
    label: "Category",
    options: [
      { label: "All", value: "all" },
      { label: "Dance", value: "dance" },
      { label: "Singing", value: "singing" },
      { label: "Instrument", value: "instruments" },
    ],
  },
  {
    name: "genre",
    label: "Genre",
    options: [
      { label: "All", value: "all" },
      { label: "Hip-hop", value: "hip-hop" },
      { label: "Classical", value: "classical" },
      { label: "Bollywood", value: "bollywood" },
      { label: "Rock", value: "rock" },
      { label: "Pop", value: "pop" },
    ],
  },
  {
    name: "level",
    label: "Level",
    options: [
      { label: "All", value: "all" },
      { label: "Beginner", value: "beginner" },
      { label: "Intermediate", value: "intermediate" },
      { label: "Advanced", value: "advanced" },
    ],
  },
];

/* ===================== COMPONENT ===================== */
const FilterBar = ({ filters, setFilters }) => {
  const handleChange = (e) => {
    const { name, value } = e.target;

    setFilters((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  return (
    <div
      className="
        w-full max-w-6xl mx-auto
        px-6 py-4
        bg-white dark:bg-gray-900
        border border-gray-200 dark:border-gray-700
        rounded-2xl
        shadow-md
        flex flex-col md:flex-row
        gap-4 md:gap-6
      "
    >
      {FILTER_CONFIG.map(({ name, label, options }) => (
        <div key={name} className="flex-1 min-w-[160px]">
          {/* ================= LABEL ================= */}
          <label
            htmlFor={name}
            className="block mb-1 text-xs font-semibold text-gray-500 dark:text-gray-400"
          >
            {label}
          </label>

          {/* ================= SELECT ================= */}
          <select
            id={name}
            name={name}
            value={filters[name] || "all"}
            onChange={handleChange}
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
            {options.map(({ label, value }) => (
              <option
                key={value}
                value={value}
                className="bg-white dark:bg-gray-950"
              >
                {label}
              </option>
            ))}
          </select>
        </div>
      ))}
    </div>
  );
};

export default memo(FilterBar);
