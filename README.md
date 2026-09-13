# AURA — AI-Powered Resume & Interview Coach

> **Local-First, Privacy-Focused Career Acceleration Platform**  
> Operating 100% on-device with zero cloud AI calls, local quantized Qwen2.5 3B inference via Ollama, client-side IndexedDB storage, and real-time speech telemetry over local WebSockets.

---

## 1. Executive Summary & Core Value Proposition

College students and job seekers face major hurdles during placement preparation:
- **Privacy & Security Risks:** Commercial AI tools upload private candidate resumes, contact details, and transcripts to third-party cloud servers.
- **The "Blank Page" Dilemma:** Students without prior resumes struggle to translate coursework into industry-standard language.
- **Disconnected Remediation:** Standard ATS checkers highlight missing keywords but fail to provide structured, gamified practice (such as LeetCode algorithm patterns) to fix those gaps.
- **Interview Cadence & Anxiety:** Candidates lack feedback on speaking pace (WPM), filler words (*"um"*, *"like"*), and STAR methodology structure during live technical interviews.

**AURA** solves this with an edge-computed career suite running entirely on consumer laptops (16 GB RAM baseline):
1. **Guided AI Counselor:** Step-by-step Q&A intake for candidates without resumes, synthesizing raw input into Google X-Y-Z bullet points (`"Accomplished [X] as measured by [Y], by doing [Z]"`).
2. **ATS Match & Gap Analysis Engine:** Client-side PDF parser (`pdfjs-dist`) comparing resumes against target Job Descriptions, returning match score gauges, keyword diffs, and bullet rewrites.
3. **Gamified Quest Hub:** Translates identified skill gaps into unlockable missions with XP rewards, level badges (*Placement Novice* -> *Job-Ready Slayer*), and confetti triggers.
4. **Video / Voice Mock Interview Arena:** Live webcam canvas + Web Speech API audio stream connected over local WebSockets (`ws://127.0.0.1:3001`) for real-time WPM speed pacing and filler-word detection.
5. **Post-Session STAR Feedback:** Multi-dimensional critique evaluating Situation, Task, Action, and Result methodology with actionable coaching tips.
6. **LeetCode Pattern Recommendations:** Direct mapping of ATS gaps to 10 core algorithm patterns (Two Pointers, Sliding Window, Fast & Slow Pointers, Monotonic Stack, Top K Elements, Binary Search, Graph BFS/DFS, Backtracking, Dynamic Programming, Trie).
7. **Chrome Companion Extension (MV3):** Post-session speech cadence console with strict guardrails: **Zero live answer assistance during actual interviews**.

---

## 2. Technology Stack

| Layer | Choice | Configuration | Role in Project |
| :--- | :--- | :--- | :--- |
| **Frontend** | **Next.js (App Router)** | JavaScript ES6+ (No TS/TSX) | Full-stack application UI, client routing, static pages. |
| **Styling** | **Tailwind CSS** | `v3.4+` | Electric Orange (`#F97316`) & Pitch Black (`#09090B`) theme design tokens. |
| **Local AI Engine** | **Ollama** | Local daemon (`http://127.0.0.1:11434`) | High-performance C++ execution engine for local SLMs. |
| **Local Model** | **`qwen2.5:3b`** | Quantized Q4_K_M (~2.2 GB RAM footprint) | Single-purpose structured JSON prompt execution. |
| **Storage Layer** | **IndexedDB (`aura_db`)** | Client-Side Browser Storage (v1) | 7 Object stores: `profiles`, `resumes`, `job_descriptions`, `mock_sessions`, `session_feedback`, `quests`, `user_stats`. |
| **Real-Time Comms** | **WebSockets (`ws`)** | `Port 3001` | Full-duplex audio transcript streaming & WPM telemetry. |
| **Document Parsing** | **`pdfjs-dist`** | Client-side worker | In-browser PDF text extraction (zero remote server upload). |
| **Browser Extension** | **Chrome Manifest V3** | Manifest `v3` | Post-session speech metrics (pace, filler words). |

---

## 3. Quick Start & Local Execution Guide

### Prerequisites
1. **Node.js:** `v18.0.0` or higher installed.
2. **Ollama:** Installed locally with model `qwen2.5:3b`:
   ```bash
   ollama pull qwen2.5:3b
   ```

### Installation Steps

1. **Clone Repository & Navigate to Workspace:**
   ```bash
   cd Parichaya
   ```

2. **Install Dependencies:**
   ```bash
   npm install
   ```

3. **Start Local Telemetry WebSocket Server:**
   ```bash
   node mock-server/server.js
   ```
   *(Listening on `ws://127.0.0.1:3001`)*

4. **Launch Next.js Application:**
   ```bash
   npm run dev
   ```
   *(Application running on `http://localhost:3000`)*

5. **Production Build Verification:**
   ```bash
   npm run build
   ```

---

## 4. Repository Structure

```
Parichaya
 ├── app/                      # Next.js App Router Pages
 │    ├── page.js              # Home Dashboard & Local System Health Status
 │    ├── counselor/           # AI Resume Counselor Intake Wizard
 │    ├── ats-audit/           # Client-Side PDF Upload & ATS Gap Audit
 │    ├── roadmap/             # Gamified Quest Hub & Readiness Score
 │    ├── interview/           # Video / Voice Mock Interview Arena
 │    │    └── feedback/       # Post-Session STAR Feedback Report
 │    └── resources/           # LeetCode DSA Pattern Recommendations
 ├── components/               # Reusable UI & Feature Components
 │    ├── ui/                  # Button, Card, QuestCard, ReadinessMeter
 │    ├── counselor/           # IntakeWizard, ResumePreview
 │    ├── ats/                 # PdfDropzone, AtsReportView
 │    ├── roadmap/             # LevelBadge, QuestHub
 │    ├── interview/           # VideoArena, LiveHudTelemetry, FeedbackReportView
 │    └── resources/           # PatternCard, ResourceGrid
 ├── lib/                      # Core Logic & Infrastructure Services
 │    ├── db.js                # IndexedDB aura_db v1 CRUD Helpers
 │    ├── ollama.js            # Ollama Qwen2.5 3B Local AI Client
 │    └── services/            # Counselor, ATS, Interview, Feedback, Gamification, Resource Services
 ├── data/                     # Static Datasets (dsa_patterns, rubrics, role_skill_maps)
 ├── extension/                # Chrome Manifest V3 Companion Extension Package
 ├── mock-server/              # WebSocket Telemetry Server (Port 3001)
 ├── ARCHITECTURE.md           # Detailed 7-Layer Architecture Blueprint
 ├── DATA_MODEL.md             # IndexedDB Stores & JSON Schemas
 ├── RESOURCE_GUIDE.md         # Static Datasets & Quest Mapping Rules
 ├── WORKFLOW.md               # User Journeys & Feature Workflows
 ├── AI_INTEGRATION.md         # Ollama Qwen2.5 3B Prompt Specifications
 ├── PROGRESS.md               # Master Task Completion Log
 └── IMPLEMENTATION_PLAN.md    # Scope Freeze & Milestone Tracker
```

---

## 5. Security & Privacy Guardrails

1. **100% Data Residency:** Resumes, transcripts, candidate profiles, and evaluation feedback strictly reside inside browser IndexedDB.
2. **Zero External Network Dependencies:** No feature connects to remote cloud LLMs or tracking services.
3. **Chrome Extension Mandate:** Post-session analytics only (pacing, filler words). Live answer assistance is strictly prohibited.
