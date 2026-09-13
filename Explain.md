# PARICHAYA - Comprehensive System Architecture & Technical Explanation

## Executive Summary
PARICHAYA is an AI-powered, closed-loop career readiness, skill assessment, resume intelligence, mock interview, and adaptive gamified learning platform engineered for students and early-career professionals.

Unlike traditional static learning management systems or generic resume analyzers, PARICHAYA operates on an **adaptive evidence-based feedback cycle**:
```
Resume / Intake Analysis → Skill Gap Identification → Evidence Confidence Mapping → 
Playable Gamified Missions (TechQuest & SoftSkill Quest) → Dynamic Real-Time Evaluation → 
Skill Score & XP Updates → Simulated Mock Interview → Progress Re-assessment
```

---

## 1. Complete User Flow & Architecture Overview

### User Lifecycle Flow
1. **Authentication & Local Greeting (`/login`, `/signup`)**:
   - User registers or logs in with validated credentials.
   - User profile & authentication metadata are securely cached in IndexedDB (`parichaya_db`) for zero-latency dashboard greeting (`"Hello, {username}"`) while synchronized with the backend.
2. **Dashboard Command Center (`/dashboard`)**:
   - Displays real-time Career Readiness Index (0-100), Current Level, total XP, recent assessment activities, skill radar, and actionable top recommendations.
3. **AI Counsellor Intake (`/counselor`)**:
   - **Path A (Has Resume)**: PDF/DOCX file upload, real-time AI section parsing, structural audit, ATS compatibility check, bullet point enhancement.
   - **Path B (No Resume)**: Interactive WebSocket-driven step-by-step interview collecting degree, technical skills, projects, internships, achievements, and target roles to auto-generate a structured ATS-friendly resume.
4. **ATS Match My Job (`/ats-match`)**:
   - Multi-factor job description analysis producing an explainable match score based on Keyword Alignment, Required Skills, Missing Skills, Weak Evidence, and Role Relevance.
5. **Evidence Graph Engine (`/evidence-graph`)**:
   - Visualizes `Skill → Evidence → Source → Confidence` triples. Prevents blind trust in unverified resume claims by correlating skills with project code, assessment scores, and interview performance.
6. **Adaptive Gamified Learning Quests (`/quests`)**:
   - **TechQuest**: Real coding challenges, output predictions, and SQL query builders with automated test case evaluation.
   - **SoftSkill Quest**: AI companion mentor evaluating answer structure (STAR method), filler word density, clarity, and communication fluency.
7. **Dynamic Mock Interview Engine (`/mock-interview`)**:
   - Real-time WebSocket audio/text interview simulation tailored to job descriptions, target roles, and detected weaknesses with live feedback streaming.
8. **Progress & Rewards (`/progress`, `/rewards`)**:
   - Historical readiness trajectory, before-and-after score comparisons, streak tracking, and backend-validated achievement badges.

---

## 2. Separate Frontend & Backend Architecture

### Why Frontend and Backend Are Strictly Separated
- **Modularity & Scalability**: Allows independent deployment of the client web application (Next.js) and the backend analytical engine (Express WebSocket server).
- **Security & Key Isolation**: Sensitive AI service configurations, prompt templates, and security validation routines remain strictly on the backend.
- **Resource Optimization**: The frontend handles UI rendering and low-latency client-side caching (IndexedDB), while the backend handles heavy computational analysis, WebSocket broadcasting, and local LLM inference.

---

## 3. Communication Protocol: WebSockets vs. REST APIs

| Protocol | Usage in PARICHAYA | Rationale / Benefits |
|---|---|---|
| **REST API** | Auth (`/api/auth/login`, `/api/auth/signup`), File Uploads (`/api/resume/upload`), Profile fetching | Stateless, idempotent operations, standard HTTP caching & status codes |
| **WebSockets** | AI Counsellor, Streaming Resume Analysis, ATS Progress, Live Mock Interview, Audio Chunking, Gamified Evaluation events | Full-duplex, low-latency bi-directional communication required for real-time interactive feedback |

---

## 4. On-Device AI Architecture & Local Inference

### What On-Device / Local AI Means
On-device inference means running pre-trained, open-weight artificial intelligence models directly on local hardware without sending user payload data to third-party proprietary APIs (such as OpenAI or Google Gemini APIs).

### Core Concepts Clarified

1. **Training**: The process of learning model weights from massive datasets across billions of parameters using high-performance compute clusters.
2. **Fine-Tuning**: Adapting an already-trained base model on task-specific domain datasets to specialize performance (e.g., career counselling data).
3. **Inference**: Executing a trained model on new inputs to generate predictions or natural language responses.
4. **Local Inference**: Running model inference locally via an engine like **Ollama** using quantized model weights (`qwen2.5:3b`).
5. **Tokenization**: Converting raw text strings into numeric tokens processed by neural network layers. *Tokenization is NOT anonymization.*
6. **Anonymization**: Irreversibly scrubbing or substituting personally identifiable information (PII) like names, phone numbers, and addresses.
7. **Encryption**: Transforming plaintext into ciphertext using cryptographic algorithms (AES-256 in transit and at rest).

### Our Approach: Local Ollama with Qwen2.5 3B
- PARICHAYA uses an **AI Provider Abstraction Layer** (`OllamaProvider`).
- During local development, the backend sends requests to local Ollama running `http://127.0.0.1:11434` loaded with `qwen2.5:3b`.
- **Zero API Dependency**: No external API keys required; user resumes and private data remain strictly on local infrastructure.

### Privacy & Development vs Production Modes

- **Development Mode**: `Frontend → Backend (Port 3001) → Local Ollama Server (Port 11434)`
- **Production Mode**: `Frontend → Secure API Gateway → Private Inference Cluster / Encrypted Model Service`

#### Privacy Limitations & Mitigation
- Local models are not immune to data leaks if application logs capture raw prompts.
- PARICHAYA applies **PII masking** (replacing names, emails, phone numbers with pseudonymous tokens) prior to passing text to the LLM prompt context.
- System logs never record raw audio data or unmasked resumes.

---

## 5. Gamified Adaptive Learning Engine

The core innovation of PARICHAYA is converting detected weaknesses into interactive practice:

```
[Weakness Identified: e.g., SQL Joins / STAR Method]
                      ↓
[Quest Generator constructs playable mission]
                      ↓
[User submits code / audio response]
                      ↓
[Backend Evaluator checks constraints & test cases]
                      ↓
[Score calculated -> XP awarded -> Level unlocked -> Skill profile updated]
```

---

## 6. Chrome Extension Architecture

The `chrome-extension` directory contains a Manifest V3 extension providing authorized speech-to-text practice during mock interview simulations:
- **Explicit Consent**: Requires manual user toggle before activating microphone recording.
- **Visual Recording Indicator**: Displays active status badge on UI.
- **WebSocket Streaming**: Streams audio transcripts to the PARICHAYA backend WebSocket endpoint for live clarity and filler-word evaluation.
- **No Secret Surveillance**: Restricts capture exclusively to active practice sessions.

---

## 7. Database Design & IndexedDB Caching

PARICHAYA uses a dual-layer data architecture:
1. **Client-Side IndexedDB (`parichaya_db`)**: Caches non-sensitive profile state, level/XP metrics, and current session identifiers for instantaneous offline UI loading.
2. **Backend Persistent Data Layer**: Maintains authoritative records for users, resumes, evidence triples, assessment attempts, and badge unlocks.

---

## 8. Summary of Setup & Execution Commands

```bash
# 1. Start Backend Server
cd backend
npm install
npm run dev

# 2. Start Frontend Next.js Application
cd frontend
npm install
npm run dev

# 3. Load Chrome Extension
# Open chrome://extensions -> Enable Developer Mode -> Load unpacked -> Select chrome-extension folder
```
