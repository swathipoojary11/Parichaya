# AURA — End-to-End User Journey & Feature Workflows

**Version:** 1.0.0  
**Application Type:** Local-First AI Career Acceleration Suite  
**Data Residency:** 100% Client-Side In-Browser Storage (IndexedDB `aura_db` v1)  

---

## 1. Candidate User Journey Overview

```
                                  [Candidate Landing]
                                          │
                        ┌─────────────────┴─────────────────┐
                        │                                   │
                        ▼                                   ▼
          [No Resume? AI Counselor]           [Has Resume? ATS Audit Engine]
          - 4-Step Guided Q&A                 - In-Browser PDF Text Parse
          - Qwen2.5 3B Synthesis              - Job Description Ingestion
          - Google X-Y-Z Bullet Formatting    - Match Score (0–100%) & Skill Diff
                        │                                   │
                        └─────────────────┬─────────────────┘
                                          │
                                          ▼
                               [Gamified Quest Hub]
                               - Level Tier (Novice -> Slayer)
                               - Unlocked LeetCode DSA Missions
                               - Victory Confetti Celebrations
                                          │
                                          ▼
                         [Video / Voice Mock Interview]
                         - Live Webcam & Mic Feed
                         - Speech-to-Text Transcript Stream
                         - Real-Time WPM Pacing & Filler Word HUD
                                          │
                                          ▼
                           [STAR Feedback Evaluation]
                           - Situation / Task / Action / Result Scores
                           - Actionable Coaching Tips
                                          │
                                          ▼
                        [LeetCode Pattern Recommendations]
                        - Targeted Algorithm Problem Lists
```

---

## 2. Feature Workflows & Operational Specs

### 2.1 Pathway A: Guided AI Counselor (No-Resume Path)
1. **Intake Wizard (`/counselor`):** Candidate answers 4 guided steps covering Personal Info, Academic Background, Raw Project Descriptions, and Skills.
2. **AI Synthesis:** Calls local Ollama service (`qwen2.5:3b`) to format raw text into Google X-Y-Z formula bullets (`"Accomplished [X] as measured by [Y], by doing [Z]"`).
3. **Storage & Preview:** Saves generated resume to IndexedDB (`resumes` & `profiles`) and displays printable ATS resume canvas.

---

### 2.2 Pathway B: Existing-Resume ATS Audit
1. **In-Browser PDF Parsing (`/ats-audit`):** Drag and drop PDF resume. `pdfjs-dist` extracts text 100% client-side with zero remote uploads.
2. **Job Description Ingestion:** Candidate pastes target JD text.
3. **ATS Gap Analysis:** Qwen2.5 3B compares texts and produces Match Score percentage, green matched skill chips, red missing competency diff, and bullet point rewrites.
4. **Quest Generation:** Automatically creates remediation quest records in IndexedDB for missing skills.

---

### 2.3 Pathway C: Video / Voice Mock Interview Arena
1. **Arena Initialization (`/interview`):** Starts webcam preview canvas (`getUserMedia`), microphone audio status indicator, and connects to local WebSocket IPC server (`ws://127.0.0.1:3001`).
2. **Question Generation:** Qwen2.5 3B generates targeted behavioral, technical, or HR questions based on candidate resume/JD gaps.
3. **Live Telemetry HUD:** Streams Web Speech API transcript to WebSocket server. Displays live WPM cadence gauge (130–160 WPM target) and filler-word counters (`um`, `uh`, `like`, `basically`).
4. **STAR Critique (`/interview/feedback`):** Evaluates candidate transcript against STAR methodology, technical depth, clarity, and confidence. Saves feedback to IndexedDB.

---

### 2.4 Pathway D: Gamified Quest Roadmap & Recommendations
1. **Quest Hub (`/roadmap`):** Displays overall Readiness Meter, Level Badge (*Placement Novice*, *Tech Apprentice*, *Job-Ready Slayer*), and active missions.
2. **Quest Completion:** Clicking "Mark Quest Complete" awards +100 XP, updates readiness score, and fires celebratory `canvas-confetti`.
3. **LeetCode Mappings (`/resources`):** Maps identified skill gaps to 10 core algorithm patterns (Two Pointers, Sliding Window, Fast & Slow Pointers, Monotonic Stack, Top K Elements, Binary Search, Graph BFS/DFS, Backtracking, Dynamic Programming, Trie) with direct LeetCode problem links.

---

### 2.5 Companion Chrome Extension
1. **Post-Session Analysis Only:** Extension popup connects to `ws://127.0.0.1:3001` during practice sessions.
2. **Privacy Guardrail:** Displays toolbar badge WPM metrics and session history. Enforces strict rule: **Zero live answer assistance or hints during actual interviews.**
