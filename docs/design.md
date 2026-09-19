# PARICHAYA (AURA) — Design System

## Theme: Industrial Electric Orange

### Color Tokens

| Token | Hex | Tailwind | Usage |
|-------|-----|----------|-------|
| Primary | `#F97316` | `orange-500` | Buttons, links, active states, brand accent |
| Glow | `#FB923C` | `orange-400` | Hover states, borders, secondary highlights |
| Canvas Dark | `#09090B` | `zinc-950` | Dark mode background |
| Surface Dark | `#18181B` | `zinc-900` | Dark mode cards |
| Border Dark | `#27272A` | `zinc-800` | Dark mode borders |
| Canvas Light | `#FAFAFA` | `zinc-50` | Light mode background |
| Surface Light | `#FFFFFF` | `white` | Light mode cards |
| Heading (dark) | `#FAFAFA` | `zinc-50` | Headings in dark mode |
| Body (dark) | `#A1A1AA` | `zinc-400` | Body text in dark mode |
| Heading (light) | `#18181B` | `zinc-900` | Headings in light mode |
| Body (light) | `#52525B` | `zinc-600` | Body text in light mode |
| Success | `#34D399` | `emerald-400` | Positive states, matched skills |
| Error | `#F87171` | `red-400` | Error states |

### Typography
- **Font**: `Inter` (Google Fonts) — fallback: `system-ui, sans-serif`
- **Headings**: `font-bold`, sizes: `text-4xl` (h1), `text-2xl` (h2), `text-xl` (h3)
- **Body**: `text-base` (16px), `leading-relaxed`
- **Mono**: `JetBrains Mono` for code blocks

### Spacing & Radius
- Cards: `rounded-2xl` or `rounded-3xl`
- Buttons: `rounded-xl`
- Inputs: `rounded-lg`
- Padding: Cards `p-6`, Sections `py-8 px-4`

### Transitions & Animations
- **Global**: `transition-all duration-300 ease-in-out`
- **Hover**: `hover:scale-[1.02]` on cards, `hover:brightness-110` on buttons
- **Score Gauge**: CSS `conic-gradient` animation with `transition: stroke-dasharray 1.5s ease`
- **Water Level**: CSS `height` transition on SVG rects (`transition: height 0.5s ease`)
- **Page Enter**: `animate-fadeIn` (opacity 0→1, translateY 10px→0)

### Visual Badges
```
┌─────────────────────────────────────────┐
│ 🔒 100% On-Device AI │ Private · Secure │
└─────────────────────────────────────────┘

┌──────────────────┐  ┌──────────────────┐
│ ⚡ +750 XP       │  │ 🏅 Lvl 2         │
└──────────────────┘  └──────────────────┘
```

### Component Inventory

| Component | Description |
|-----------|------------|
| `CatCoach` | Animated SVG cat avatar (4 states: Idle, Listening, Thinking, Celebrating) |
| `ATSScoreGauge` | Circular SVG gauge, 0-100%, animated fill |
| `SkillPills` | Green (matched) / Orange (missing) badge pills |
| `XPBadge` | Floating XP gain notification |
| `LevelBadge` | Header badge showing current level |
| `PrivacyBadge` | "100% On-Device AI" trust indicator |
| `DBInspector` | Dev-mode IndexedDB browser panel |
| `ResumeRenderer` | 2-column resume (dark sidebar + white body) |
| `WaterJug` | Interactive SVG with animated water levels |

### Dark Mode Strategy
- Toggle via `class` strategy on `<html>` element
- Persist preference in IndexedDB
- System preference detection as fallback
- All components use `dark:` prefix variants
