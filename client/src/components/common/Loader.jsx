import { memo } from "react";

const Loader = ({
  size = "md",
  color = "indigo",
  className = "",
  label = "Loading...",
}) => {
  const sizes = {
    sm: "h-6 w-6 border-2",
    md: "h-10 w-10 border-4",
    lg: "h-14 w-14 border-4",
  };

  const colors = {
    indigo: "border-indigo-600 border-t-transparent",
    white: "border-white border-t-transparent",
    gray: "border-gray-400 border-t-transparent",
  };

  return (
    <div
      role="status"
      aria-live="polite"
      className={`flex flex-col items-center justify-center py-20 ${className}`}
    >
      <div
        className={`
          animate-spin
          rounded-full
          ${sizes[size] || sizes.md}
          ${colors[color] || colors.indigo}
        `}
        aria-hidden
      />

      {/* Accessible text (screen readers) */}
      <span className="sr-only">{label}</span>
    </div>
  );
};

export default memo(Loader);
