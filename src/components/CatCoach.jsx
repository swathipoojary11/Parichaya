'use client';

/**
 * AURA-Bot — Super cute & modern AI companion mascot with 7 expressive states:
 * States: idle, listening, thinking, speaking, celebrating, happy, confused, encouraging
 */
export default function CatCoach({ state = 'idle', size = 120 }) {
  const isSquint = state === 'celebrating' || state === 'happy';

  const pupilOffsets = {
    idle: { x: 0, y: 0, r: 4.5 },
    listening: { x: -2, y: 0, r: 5.5 },
    thinking: { x: 3, y: -2, r: 4.5 },
    speaking: { x: 0, y: 0, r: 4.5 },
    confused: { x: -3, y: 2, r: 4 },
    encouraging: { x: 0, y: -1, r: 5 }
  };

  const offset = pupilOffsets[state] || pupilOffsets.idle;

  return (
    <div
      className={`inline-flex items-center justify-center transition-transform duration-300 ${
        isSquint ? 'animate-bounce' : ''
      } ${state === 'thinking' ? 'animate-pulse' : ''} ${state === 'confused' ? 'rotate-[-4deg]' : ''}`}
      style={{ width: size, height: size }}
    >
      <svg viewBox="0 0 100 100" width={size} height={size} xmlns="http://www.w3.org/2000/svg">
        
        {/* Outer Holographic Glow */}
        <circle cx="50" cy="52" r="42" fill="#2EC4B6" opacity="0.15" className="animate-pulse" />
        <circle cx="50" cy="52" r="36" fill="#FF7A18" opacity="0.12" />

        {/* Floating Antennas / Robot Ears */}
        {/* Left Antenna */}
        <g transform={state === 'listening' ? 'rotate(-6 30 20)' : 'rotate(0)'} className="transition-transform">
          <line x1="30" y1="28" x2="22" y2="12" stroke="#18181B" strokeWidth="3" strokeLinecap="round" />
          <circle cx="20" cy="10" r="5" fill="#FF7A18" stroke="#18181B" strokeWidth="2" />
          {state === 'listening' && <circle cx="20" cy="10" r="8" fill="none" stroke="#2EC4B6" strokeWidth="1.5" className="animate-ping" />}
        </g>

        {/* Right Antenna */}
        <g transform={state === 'thinking' ? 'rotate(6 70 20)' : 'rotate(0)'} className="transition-transform">
          <line x1="70" y1="28" x2="78" y2="12" stroke="#18181B" strokeWidth="3" strokeLinecap="round" />
          <circle cx="80" cy="10" r="5" fill="#2EC4B6" stroke="#18181B" strokeWidth="2" />
          {state === 'thinking' && <circle cx="80" cy="10" r="8" fill="none" stroke="#FF7A18" strokeWidth="1.5" className="animate-ping" />}
        </g>

        {/* Robot Head Outer Shell */}
        <rect x="18" y="24" width="64" height="52" rx="26" fill="#FFFFFF" stroke="#18181B" strokeWidth="3.5" />
        <rect x="22" y="28" width="56" height="44" rx="22" fill="#F4F4F5" />

        {/* Cute OLED Face Visor Screen */}
        <rect x="25" y="32" width="50" height="36" rx="18" fill="#18181B" stroke="#2EC4B6" strokeWidth="2" />

        {/* Blush Cheeks */}
        <circle cx="31" cy="54" r="4.5" fill="#FF7A18" opacity="0.75" />
        <circle cx="69" cy="54" r="4.5" fill="#FF7A18" opacity="0.75" />

        {/* EYES */}
        {isSquint ? (
          // Super Happy "^ ^" Anime Eyes
          <g stroke="#2EC4B6" strokeWidth="3.5" strokeLinecap="round" fill="none">
            <path d="M 33 46 Q 39 39 45 46" />
            <path d="M 55 46 Q 61 39 67 46" />
          </g>
        ) : (
          // Expressive Round Glowing Eyes
          <g>
            {/* Left Eye */}
            <circle cx="39" cy="46" r="7.5" fill="#2EC4B6" />
            <circle cx={39 + offset.x} cy={46 + offset.y} r={offset.r} fill="#FFFFFF" />
            <circle cx={37 + offset.x} cy={44 + offset.y} r="1.8" fill="#18181B" />

            {/* Right Eye */}
            <circle cx="61" cy="46" r="7.5" fill="#2EC4B6" />
            <circle cx={61 + offset.x} cy={46 + offset.y} r={offset.r} fill="#FFFFFF" />
            <circle cx={59 + offset.x} cy={44 + offset.y} r="1.8" fill="#18181B" />
          </g>
        )}

        {/* MOUTH & EXPRESSIONS */}
        {state === 'speaking' ? (
          <ellipse cx="50" cy="58" rx="4.5" ry="3.5" fill="#FF7A18" stroke="#FFFFFF" strokeWidth="1" />
        ) : isSquint ? (
          <path d="M 44 56 Q 50 62 56 56" fill="none" stroke="#2EC4B6" strokeWidth="2.5" strokeLinecap="round" />
        ) : state === 'confused' ? (
          <path d="M 45 59 Q 50 56 55 59" fill="none" stroke="#FF7A18" strokeWidth="2" strokeLinecap="round" />
        ) : state === 'encouraging' ? (
          <path d="M 43 56 Q 50 63 57 56" fill="none" stroke="#2EC4B6" strokeWidth="2.5" strokeLinecap="round" />
        ) : (
          <path d="M 44 57 Q 50 61 56 57" fill="none" stroke="#2EC4B6" strokeWidth="2" strokeLinecap="round" />
        )}

        {/* CUTE ROBOT BODY & HANDS */}
        <path d="M 32 75 Q 50 82 68 75 L 72 90 Q 50 96 28 90 Z" fill="#FFFFFF" stroke="#18181B" strokeWidth="3" />
        {/* Core Heart Gem */}
        <circle cx="50" cy="84" r="4.5" fill="#FF7A18" stroke="#18181B" strokeWidth="1.5" className="animate-pulse" />
        
        {/* Cute Paws/Hands */}
        <circle cx="28" cy="80" r="5.5" fill="#F4F4F5" stroke="#18181B" strokeWidth="2" />
        <circle cx="72" cy="80" r="5.5" fill="#F4F4F5" stroke="#18181B" strokeWidth="2" />

        {/* STATE SPECIAL EFFECTS */}
        {isSquint && (
          <g>
            <text x="14" y="24" fill="#FBBF24" fontSize="14" className="animate-ping">✨</text>
            <text x="76" y="22" fill="#2EC4B6" fontSize="14" className="animate-ping" style={{ animationDelay: '0.4s' }}>⭐</text>
          </g>
        )}

        {state === 'thinking' && (
          <g>
            <circle cx="74" cy="26" r="2" fill="#2EC4B6" className="animate-ping" />
            <circle cx="82" cy="18" r="3" fill="#FF7A18" className="animate-ping" style={{ animationDelay: '0.3s' }} />
            <text x="82" y="14" fill="#FBBF24" fontSize="12" fontWeight="bold">💭</text>
          </g>
        )}

        {state === 'confused' && (
          <text x="76" y="26" fill="#FF7A18" fontSize="18" fontWeight="black" fontFamily="Outfit, sans-serif">
            ?
          </text>
        )}

      </svg>
    </div>
  );
}
