import { memo } from "react";

const Button = ({
  children,
  variant = "primary",
  size = "md",
  loading = false,
  disabled = false,
  type = "button",
  className = "",
  ...props
}) => {
  const base =
    "inline-flex items-center justify-center font-medium rounded-lg transition-all " +
    "focus:outline-none focus:ring-2 focus:ring-indigo-500 " +
    "disabled:opacity-60 disabled:cursor-not-allowed";

  const variants = {
    primary: "bg-indigo-600 text-white hover:bg-indigo-700",
    secondary:
      "bg-white border border-indigo-600 text-indigo-600 hover:bg-indigo-50",
    danger: "bg-red-600 text-white hover:bg-red-700",
    ghost: "bg-transparent text-indigo-600 hover:bg-indigo-50",
  };

  const sizes = {
    sm: "px-3 py-1.5 text-sm",
    md: "px-4 py-2 text-sm",
    lg: "px-6 py-3 text-base",
  };

  const isDisabled = disabled || loading;

  return (
    <button
      {...props}
      type={type}
      disabled={isDisabled}
      aria-disabled={isDisabled}
      aria-busy={loading}
      className={`
        ${base}
        ${variants[variant] || variants.primary}
        ${sizes[size] || sizes.md}
        ${className}
      `}
    >
      {loading ? (
        <span className="flex items-center gap-2">
          <span
            className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"
            aria-hidden
          />
          <span>Loading</span>
        </span>
      ) : (
        children
      )}
    </button>
  );
};

export default memo(Button);
