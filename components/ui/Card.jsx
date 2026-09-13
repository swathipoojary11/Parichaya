"use client";

export default function Card({
  children,
  title,
  subtitle,
  action,
  glow = false,
  className = ""
}) {
  return (
    <div
      className={`bg-white border border-slate-200/90 rounded-2xl p-6 shadow-soft transition-all duration-200 ${
        glow ? "ring-2 ring-orange-500/20 border-orange-400 shadow-panel" : "hover:border-slate-300 hover:shadow-md"
      } ${className}`}
    >
      {(title || action) && (
        <div className="flex items-center justify-between mb-4 pb-3 border-b border-slate-100">
          <div>
            {title && <h3 className="text-base sm:text-lg font-bold text-slate-900">{title}</h3>}
            {subtitle && <p className="text-xs text-slate-500 mt-0.5">{subtitle}</p>}
          </div>
          {action && <div>{action}</div>}
        </div>
      )}
      <div>{children}</div>
    </div>
  );
}
