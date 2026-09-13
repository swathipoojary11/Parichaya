# CareerForge AI — On-Device Career Guidance & Edge Interview Coach

> **Private, Fast, and 100% On-Device Placement Preparation Suite**  
> Running local quantized Small Language Models (SLMs) over persistent WebSockets with zero cloud latency and total data residency.

---

## 1. Project Overview & Problem Statement

### The Problem
College students and early-career job seekers face significant hurdles during placement drives:
- **Generic & Expensive Guidance:** Commercial platforms lock tailored career coaching behind costly subscriptions.
- **Privacy & Data Security Risks:** Traditional AI career tools upload private student resumes, transcripts, and personal contact info to external third-party cloud servers.
- **The "Blank Page" Dilemma:** A significant majority of students lack a baseline resume and don't know how to translate coursework into industry-standard language.
- **Disconnected Preparation:** Standard ATS checkers identify missing keywords but fail to provide structured, gamified practice (such as LeetCode problem patterns) to fix those gaps.
- **High Interview Anxiety:** Students lack real-time feedback on speaking cadence, filler words (*"um"*, *"like"*), and technical structure (STAR method) during interviews.

### What We Are Building
**PARICHAYA** is an all-in-one, edge-computed career acceleration engine that operates completely offline on consumer hardware. It delivers:
1. **Interactive AI Career Counselor:** A conversational intake assistant that interviews students without resumes and synthesizes their answers into an ATS-compliant resume.
2. **Deterministic ATS Match Engine:** An audit pipeline comparing uploaded resumes against target Job Descriptions (JDs), highlighting matched keywords, missing competencies, and rewritten impact bullets (Google X-Y-Z formula).
3. **Real-Time Voice Interview Arena & Chrome Extension:** A companion system that captures candidate audio via the Web Speech API and streams it over a local WebSocket to analyze speaking pace (WPM), track filler words, and critique answer quality.
4. **Gamified Remediation Quests:** Automatic translation of identified skill gaps into unlockable missions with XP rewards, level badges (*Novice* → *Job-Ready*), and curated LeetCode coding patterns.

---

## 2. Core Workflow & User Journey
[START]
                                     │
               Does the student have an existing resume?
                              /            \
                       NO   /                \   YES
                          /                    \
                         ▼                      ▼
             [1. AI Counselor Mode]      [2. ATS Audit Mode]
             - 4-Step Guided Q&A         - PDF Dropzone (Client Parse)
             - Captures Bio & Skills     - Ingests Target Job Description
             - Outputs Structured JSON   - Calculates 0-100 Readiness Score
             - Generates Clean Resume    - Computes Missing Skills & Diff
                         │                      │
                         └──────────┬───────────┘
                                    │
                                    ▼
                         [3. Gamified Quest Hub]
                         - Level 1: Placement Novice (0-49%)
                         - Level 2: Tech Apprentice (50-74%)
                         - Level 3: Job-Ready Slayer (75-100%)
                         - Quests map to Curated LeetCode Patterns
                         - Interactive Checkboxes trigger Confetti
                                    │
                                    ▼
                    [4. Real-Time Interview Arena]
                    (Via Web App OR Companion Chrome Extension)
                    - Microphone taps audio via Web Speech API
                    - Streams transcript chunks over ws://127.0.0.1:3001
                    - Live HUD: WPM Speed + Filler-Word Counter
                    - Evaluates Technical Depth & STAR Methodology
                                    │
                                  [END]

                                  ---

## 3. Technology Stack & Runtime Architecture

| Layer | Technology | Version / Configuration | Role in Project |
| :--- | :--- | :--- | :--- |
| **Frontend Framework** | **Next.js (App Router)** |Java Script | Full-stack application UI, client-side routing, and static assets. |
| **Styling & UI Tokens** | **Tailwind CSS** | `v3.4+` | Utility-first styling implementing the unified dark/orange theme. |
| **Icons & Micro-Interactions** | **Lucide React & Canvas-Confetti** | Latest | Minimalist iconography and gamification victory triggers. |
| **Real-Time Transport** | **WebSockets (`ws`)** | `Port 3001` | Full-duplex streaming for transcript chunks, pacing stats, and evaluation. |
| **Document Parsing** | **`pdfjs-dist`** | Client-side worker | In-browser PDF text extraction (avoids sending raw files to servers). |
| **Speech Processing** | **Web Speech API** | Chromium Native | Free, zero-latency Speech-to-Text (`webkitSpeechRecognition`). |
| **Browser Extension** | **Chrome Manifest V3** | Manifest `v3` | Live microphone tap with offscreen audio routing to local WebSocket. |
| **Edge SLM Engine** | **Ollama** | Local daemon (`Port 11434`) | High-performance C++ execution engine for local language models. |
| **Primary Evaluator Model** | **`qwen2.5:3b`** | Q4_K_M Quantized (~2.2 GB RAM) | Primary model for strict JSON formatting, code analysis, and interview evaluation. |
| **Lightweight Fallback Model** | **`llama3.2:1b`** | Q4_K_M Quantized (~1.3 GB RAM) | Fast model for low-resource environments and high-speed chat parsing. |
| **Development Platform** | **Google Antigravity** | Agentic IDE | Workspace orchestration, automated scaffolding, and agent task runs. |

---

## 4. Hardware Baseline & Operational Bounds

All software is configured to operate smoothly within the following physical hardware profile:
- **Host System:** HP Victus Laptop
- **Host Memory:** 16 GB Unified RAM
- **Operating System:** Windows 11 / WSL2
- **Network Dependency:** **Zero (100% Offline Capable).** No external API keys or cloud connections allowed during evaluation.

---

## 5. Unified Design System: High-Contrast Industrial Orange

To maintain a cohesive look, all team members must adhere strictly to these UI styling tokens. Do not use random blues, purples, or unapproved palettes.

### 5.1 Color Palette & Token Reference

| Role | Color Name | Hex Code | Tailwind Utility Class | Application |
| :--- | :--- | :--- | :--- | :--- |
| **Primary Brand** | Electric Orange | `#F97316` | `bg-orange-500` / `text-orange-500` | Primary buttons, active tabs, level badges, focus borders. |
| **Accent & Glow** | Bright Amber | `#FB923C` | `bg-orange-400` / `text-orange-400` | Hover states, glowing rings, circular progress strokes. |
| **Base Background** | Pitch Black | `#09090B` | `bg-zinc-950` | Global page canvas background. |
| **Card Surface** | Deep Charcoal | `#18181B` | `bg-zinc-900` | Form cards, dialog modals, interactive containers. |
| **Dividers & Borders** | Slate Zinc | `#27272A` | `border-zinc-800` | Subtle structural rules, input field borders. |
| **Text Primary** | Pure White | `#FAFAFA` | `text-zinc-50` | Main titles, user input text, score values. |
| **Text Secondary** | Muted Slate | `#A1A1AA` | `text-zinc-400` | Descriptions, labels, timestamps, metadata. |
| **Success / XP** | Emerald / Gold | `#10B981` / `#F59E0B` | `text-emerald-400` / `text-amber-400` | Completed quests, XP counters, passing indicators. |

### 5.2 Standard UI Component Rules

- **Buttons:**
  - *Primary Button:* `bg-orange-500 hover:bg-orange-600 text-zinc-950 font-semibold px-5 py-2.5 rounded-lg transition active:scale-95 flex items-center gap-2 shadow-lg shadow-orange-500/20` (Always pure black text on bright orange).
  - *Secondary Button:* `bg-zinc-800 hover:bg-zinc-700 text-zinc-200 font-medium px-4 py-2 rounded-lg border border-zinc-700 transition`
- **Cards & Panels:**
  - `bg-zinc-900/80 border border-zinc-800 rounded-xl p-5 backdrop-blur-sm`
- **Quest Cards:**
  - *Pending:* `border border-zinc-800 bg-zinc-900/50 p-4 rounded-lg flex items-start gap-3 hover:border-orange-500/40 transition cursor-pointer`
  - *Completed:* `border border-emerald-500/30 bg-emerald-950/10 p-4 rounded-lg flex items-start gap-3 opacity-80`
- **Typography:**
  - Headings: `font-bold tracking-tight text-zinc-50`
  - Metrics / Code: `font-mono text-orange-400`
- **Zero-Guide UX Principle:**
  - Buttons and interactive elements must describe their explicit action. Never use vague labels like *"Submit"* or *"Process"*. Use *"Audit Resume (Zero Cloud Upload)"*, *"Start Voice Session"*, or *"Generate Tailored Resume"*.

---

Local Setup & Startup Protocol

### Prerequisites
1. **Node.js (v18+ LTS)** installed.
2. **Ollama for Windows** installed and running in the background.

### Step 1: Model Pull
Open PowerShell and download the designated models:
```bash
# Primary Model: Technical depth and strict JSON adherence
ollama pull qwen2.5:3b

# Fallback Model: Ultra-lightweight execution
ollama pull llama3.2:1b

