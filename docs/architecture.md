# PARICHAYA (AURA) — System Architecture

## Overview
PARICHAYA (AURA) is a 100% on-device, privacy-first career development platform.
All AI inference runs locally via Ollama (`qwen2.5:3b`). Zero cloud API calls.

## Architecture Diagram

```
┌─────────────────────────────────────────────────────────────┐
│                    CLIENT (Browser)                         │
│  ┌──────────────────────────────────────────────────────┐   │
│  │  Next.js App Router (JavaScript / JSX)               │   │
│  │  ┌────────────┐ ┌────────────┐ ┌──────────────────┐  │   │
│  │  │ Auth Pages │ │ Counselor  │ │ ATS Auditor      │  │   │
│  │  │ (Login/    │ │ (5-Step    │ │ (Score Gauge,    │  │   │
│  │  │  Register) │ │  Wizard)   │ │  Skill Pills)    │  │   │
│  │  └────────────┘ └────────────┘ └──────────────────┘  │   │
│  │  ┌────────────┐ ┌────────────┐ ┌──────────────────┐  │   │
│  │  │ Game Arena │ │ Interview  │ │ Adaptive         │  │   │
│  │  │ (SVG Puzzl │ │ Room       │ │ Roadmap          │  │   │
│  │  │  es, DSA)  │ │ (Speech)   │ │ (Timeline)       │  │   │
│  │  └────────────┘ └────────────┘ └──────────────────┘  │   │
│  │  ┌──────────────────────────────────────────────────┐ │   │
│  │  │ Shared: CatCoach SVG │ XP/Level │ Theme Toggle  │ │   │
│  │  └──────────────────────────────────────────────────┘ │   │
│  └──────────────────────────────────────────────────────┘   │
│           │              │              │                    │
│     ┌─────▼─────┐  ┌────▼────┐   ┌─────▼──────┐           │
│     │ IndexedDB │  │ Web     │   │ html2pdf.js│           │
│     │ (AuraDB)  │  │ Speech  │   │ (PDF Gen)  │           │
│     │ via `idb` │  │ API     │   │            │           │
│     └───────────┘  └────┬────┘   └────────────┘           │
└──────────────────────────┼──────────────────────────────────┘
                           │ WebSocket (ws://127.0.0.1:3001)
                     ┌─────▼─────┐
                     │ WS Server │ (Node.js, port 3001)
                     │ Speech    │
                     │ Streaming │
                     └───────────┘
                           │
┌──────────────────────────┼──────────────────────────────────┐
│             LOCAL AI INFERENCE ENGINE                        │
│  ┌───────────────────────▼──────────────────────────────┐   │
│  │  Ollama Server (http://127.0.0.1:11434)              │   │
│  │  Model: qwen2.5:3b                                   │   │
│  │  ┌─────────────────────────────────────────────────┐  │   │
│  │  │ Endpoints Used:                                 │  │   │
│  │  │  POST /api/generate  (JSON mode, temp: 0.1)    │  │   │
│  │  │                                                 │  │   │
│  │  │ Use Cases:                                      │  │   │
│  │  │  • Resume synthesis from Q&A transcript         │  │   │
│  │  │  • ATS scoring against job descriptions         │  │   │
│  │  │  • Interview transcript evaluation              │  │   │
│  │  │  • Speech feedback generation                   │  │   │
│  │  │  • Roadmap generation                           │  │   │
│  │  └─────────────────────────────────────────────────┘  │   │
│  └──────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────┘
```

## Data Flow Per Module

### 1. No-Resume Counselor
```
User Voice/Text → 5-Step Wizard → PII Masker → Ollama (Resume Synthesis)
    → Structured JSON Resume → 2-Column HTML Renderer → html2pdf.js → PDF Download
```

### 2. ATS Auditor
```
Upload Resume (PDF) + Paste JD → pdf.js (text extract) → PII Masker
    → Ollama (4-Criteria Weighted Scoring) → ATS Score JSON
    → Score Gauge UI + Skill Pills + Detailed Analysis Modal
```

### 3. Gamified Arena
```
ATS Score → Tier Mapping (Beginner/Intermediate/Advanced)
    → Game Selection → Client-Side Game Engine (React State + SVG)
    → XP/Level Updates → IndexedDB (gameProgress store)
```

### 4. Mock Interview
```
Mic Init (Web Speech API, guarded) → Speech-to-Text Transcript
    → WebSocket (port 3001) → Real-Time Metrics (WPM, Fillers)
    → Session End → Ollama (STAR/Technical Evaluation)
    → Before-vs-After Comparison Cards
```

### 5. Adaptive Roadmap
```
User Profile + ATS Results → Ollama (Role-Specific Blueprint)
    → Weekly Progress Nodes (W1-W4) → Curated Resource Links
    → Progress Tracking → IndexedDB
```

## Security & Privacy
- **PII Masking**: All text is stripped of emails, phone numbers, and addresses before being sent to Ollama.
- **Zero Network Calls**: Ollama runs at `127.0.0.1`; no data leaves the machine.
- **IndexedDB Encryption**: User credentials are hashed before storage.

## Hardware Target
- **OS**: Windows 11
- **RAM**: 8 GB minimum
- **Model**: `qwen2.5:3b` (~2 GB VRAM/RAM)
- **Ports**: Next.js dev (3000), WebSocket (3001), Ollama (11434)
