# PARICHAYA (AURA) — Product Requirements Document

## Product Vision
An AI-powered, 100% on-device career development platform that helps candidates build resumes, pass ATS screening, sharpen skills through games, practice interviews, and follow adaptive learning roadmaps — all without sending a single byte to the cloud.

## Target User
Indian professionals: career changers, career returners, and new entrants preparing for tech roles (Full Stack, Frontend, Backend, AI/ML, Data Analyst, Product Manager).

## Core Principles
1. **Privacy First**: All AI runs locally. PII is masked before LLM processing.
2. **Zero Cloud Dependency**: Works fully offline once Ollama model is pulled.
3. **Gamification**: XP, levels, and badges keep users engaged.
4. **Accessibility**: Voice + text input, dark/light mode, responsive design.

---

## Module Requirements

### M1: No-Resume AI Counselor & PDF Generator
| Req ID | Requirement | Priority |
|--------|------------|----------|
| M1-01 | 5-step voice/text questionnaire (career, education, skills, project, story) | P0 |
| M1-02 | Live Cat Coach SVG avatar with expressive states | P1 |
| M1-03 | Ollama-powered resume synthesis from transcript | P0 |
| M1-04 | 2-column modern resume renderer (HTML) | P0 |
| M1-05 | 1-click PDF download via `html2pdf.js` | P0 |

### M2: ATS Scoring & Resume Auditor
| Req ID | Requirement | Priority |
|--------|------------|----------|
| M2-01 | Upload resume + paste JD for scoring | P0 |
| M2-02 | 4-criteria weighted scoring (Skills 30%, X-Y-Z 30%, Verbs 20%, Structure 20%) | P0 |
| M2-03 | Animated circular score gauge (0-100%) | P0 |
| M2-04 | Matched/Missing skill pills | P0 |
| M2-05 | Detailed analysis modal with rewrite suggestions | P1 |
| M2-06 | Auto-generated learning roadmap cards | P1 |

### M3: Gamified Skill & Logic Arena
| Req ID | Requirement | Priority |
|--------|------------|----------|
| M3-01 | X-Y-Z Formula Builder (drag-chip sentence builder) | P0 |
| M3-02 | Professional Sentence Upgrade (MCQ) | P0 |
| M3-03 | Fill-in-Blanks & Word Correction | P1 |
| M3-04 | Email Repair & 30s Rapid Fire | P1 |
| M3-05 | Water Jug SVG puzzle (4L/3L, animated) | P0 |
| M3-06 | River Crossing SVG puzzle | P1 |
| M3-07 | Tower of Hanoi puzzle | P1 |
| M3-08 | Client-side JS code sandbox (safe execution) | P0 |
| M3-09 | DSA tiers mapped to ATS gap (< 60%, 60-80%, > 80%) | P0 |

### M4: Mock Interview Arena & Speech Analysis
| Req ID | Requirement | Priority |
|--------|------------|----------|
| M4-01 | Guarded mic init (no `RuntimeReferenceError`) | P0 |
| M4-02 | WPM pacing analyzer (120-150 WPM optimal) | P0 |
| M4-03 | Filler word counter ("um", "uh", "like", "basically", "actually") | P0 |
| M4-04 | WebSocket speech transcript streaming (port 3001) | P0 |
| M4-05 | Post-interview Ollama evaluation (STAR, correctness, clarity) | P0 |
| M4-06 | Attempt 1 vs Attempt 2 comparison cards with % gains | P1 |

### M5: Adaptive Roadmap & Placement Resources
| Req ID | Requirement | Priority |
|--------|------------|----------|
| M5-01 | Role-specific roadmaps (6 roles) | P0 |
| M5-02 | Weekly progress nodes (W1-W4) | P0 |
| M5-03 | Curated resource links (roadmap.sh, LeetCode, docs) | P1 |

---

## Non-Functional Requirements
- **Performance**: LLM responses < 10s on 8 GB RAM machine
- **Storage**: IndexedDB with structured stores, no localStorage for data
- **Theme**: Electric Orange industrial design, dark/light adaptive
- **Browser Support**: Chrome 90+, Edge 90+ (Web Speech API dependency)
