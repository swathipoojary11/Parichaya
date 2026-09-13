"use client";

export default function Button({
  children,
  onClick,
  variant = "primary", // "primary" (orange) | "black" | "secondary" | "outline" | "ghost"
  size = "md", // "sm" | "md" | "lg"
  disabled = false,
  loading = false,
  className = "",
  type = "button"
}) {
  const baseStyles = "inline-flex items-center justify-center font-bold rounded-xl transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-orange-500/30 disabled:opacity-50 disabled:cursor-not-allowed";

  const sizeStyles = {
    sm: "px-3 py-1.5 text-xs space-x-1.5",
    md: "px-4.5 py-2.5 text-sm space-x-2",
    lg: "px-6 py-3.5 text-base space-x-3"
  };

  const variantStyles = {
    primary: "bg-orange-500 hover:bg-orange-600 text-white shadow-md shadow-orange-500/20 active:scale-[0.98]",
    orange: "bg-orange-500 hover:bg-orange-600 text-white shadow-md shadow-orange-500/20 active:scale-[0.98]",
    black: "bg-slate-900 hover:bg-slate-800 text-white shadow-md active:scale-[0.98]",
    secondary: "bg-slate-100 hover:bg-slate-200 text-slate-900 border border-slate-200 active:scale-[0.98]",
    outline: "border-2 border-orange-500 text-orange-600 hover:bg-orange-50 active:scale-[0.98]",
    ghost: "text-slate-600 hover:text-slate-900 hover:bg-slate-100"
  };

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled || loading}
      className={`${baseStyles} ${sizeStyles[size]} ${variantStyles[variant] || variantStyles.primary} ${className}`}
    >
      {loading && (
        <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-current" fill="none" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
        </svg>
      )}
      <span>{children}</span>
    </button>
  );
}
