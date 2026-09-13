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
      className={`bg-zinc-900 border border-zinc-800 rounded-xl p-6 transition-all duration-200 ${
        glow ? "glow-orange border-orange-500/30" : "hover:border-zinc-700"
      } ${className}`}
    >
      {(title || action) && (
        <div className="flex items-center justify-between mb-4 pb-3 border-b border-zinc-800/60">
          <div>
            {title && <h3 className="text-lg font-bold text-zinc-100">{title}</h3>}
            {subtitle && <p className="text-xs text-zinc-400 mt-0.5">{subtitle}</p>}
          </div>
          {action && <div>{action}</div>}
        </div>
      )}
      <div>{children}</div>
    </div>
  );
}
