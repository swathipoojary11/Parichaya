'use client';

export default function ATSScoreGauge({ score = 0, size = 160, label = 'ATS Match' }) {
  const normalizedScore = Math.max(0, Math.min(100, Math.round(score)));
  const radius = 64;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (normalizedScore / 100) * circumference;

  let colorClass = 'text-red-500';
  let badgeColor = 'bg-red-500/10 text-red-400 border-red-500/20';
  let statusText = 'Needs Optimization';

  if (normalizedScore >= 80) {
    colorClass = 'text-emerald-500';
    badgeColor = 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20';
    statusText = 'Interview Ready';
  } else if (normalizedScore >= 60) {
    colorClass = 'text-orange-500';
    badgeColor = 'bg-orange-500/10 text-orange-400 border-orange-500/20';
    statusText = 'Good Foundation';
  }

  return (
    <div className="flex flex-col items-center justify-center p-4">
      <div className="relative" style={{ width: size, height: size }}>
        <svg className="w-full h-full transform -rotate-90" viewBox="0 0 160 160">
          {/* Background circle */}
          <circle
            cx="80"
            cy="80"
            r={radius}
            className="text-zinc-800"
            strokeWidth="12"
            stroke="currentColor"
            fill="transparent"
          />
          {/* Animated score circle */}
          <circle
            cx="80"
            cy="80"
            r={radius}
            className={`${colorClass} transition-all duration-1000 ease-out`}
            strokeWidth="12"
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
            strokeLinecap="round"
            stroke="currentColor"
            fill="transparent"
          />
        </svg>

        {/* Center score readout */}
        <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
          <span className="text-4xl font-extrabold text-zinc-100 tracking-tight">{normalizedScore}%</span>
          <span className="text-[11px] font-semibold text-zinc-400 uppercase tracking-wider mt-0.5">{label}</span>
        </div>
      </div>

      <div className={`mt-3 px-3 py-1 rounded-full text-xs font-semibold border ${badgeColor}`}>
        {statusText}
      </div>
    </div>
  );
}
