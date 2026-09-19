# System Design

## 1. Overview
Parichaya AURA is an on-device AI career preparation companion. The system relies entirely on local browser technologies (IndexedDB, Web Speech API) and a locally running Ollama instance (`qwen2.5:3b`) to ensure 100% privacy and zero cloud API calls.

## 2. Frontend Architecture
- **Framework**: Next.js App Router
- **Language**: JavaScript (JSX)
- **Styling**: Tailwind CSS with custom variables for Electric Orange and deep dark theme
- **State Management**: React Context (`AuthContext`, `ThemeContext`) and React Hooks
- **Data Persistence**: `idb` for IndexedDB (AuraDB)

## 3. Key Components
### A. AI Counsellor
Dynamic 1-on-1 interview intake component (`/counselor`). Parses resumes if available, or conducts an adaptive interview utilizing the local LLM.

### B. Arena & DSA Sandbox
Browser-based execution of algorithms using `new Function()` safely restricted, tracking success in IndexedDB.

### C. Voice Integration
Web Speech API for STT and TTS, tracking WPM and filler words locally.

## 4. Hardware Constraints
Targeting 8GB RAM host machines. The architecture relies on the local Ollama instance running in the background, communicating via standard `fetch` to `localhost:11434`.
