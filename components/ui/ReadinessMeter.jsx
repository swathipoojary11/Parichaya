"use client";

export default function ReadinessMeter({
  score = 0, // 0 - 100
  level = "Placement Novice",
  size = 180,
  strokeWidth = 14
}) {
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const normalizedScore = Math.min(100, Math.max(0, score));
  const strokeDashoffset = circumference - (normalizedScore / 100) * circumference;

  return (
    <div className="flex flex-col items-center justify-center space-y-3">
      <div className="relative flex items-center justify-center" style={{ width: size, height: size }}>
        <svg width={size} height={size} className="transform -rotate-90">
          {/* Background Ring */}
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            stroke="#E2E8F0"
            strokeWidth={strokeWidth}
            fill="transparent"
          />
          {/* Animated Score Progress Ring */}
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            stroke="#F97316"
            strokeWidth={strokeWidth}
            fill="transparent"
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
            strokeLinecap="round"
            className="transition-all duration-1000 ease-out"
          />
        </svg>

        {/* Center Score Readout */}
        <div className="absolute flex flex-col items-center justify-center text-center space-y-0.5">
          <span className="text-4xl font-extrabold text-slate-900 font-mono tracking-tight">
            {normalizedScore}%
          </span>
          <span className="text-[11px] font-mono uppercase tracking-wider text-slate-400 font-bold">
            Readiness
          </span>
        </div>
      </div>

      {/* Level Label Badge Below Meter */}
      <div className="inline-flex items-center space-x-2 px-3.5 py-1 rounded-full bg-orange-50 text-orange-700 text-xs font-mono font-bold border border-orange-200">
        <span>★ Level: {level}</span>
      </div>
    </div>
  );
}
