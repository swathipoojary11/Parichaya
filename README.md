# PARICHAYA - AI Career Readiness & Gamified Skill Platform

PARICHAYA is a complete working AI-powered career readiness, skill assessment, resume intelligence, mock interview, and adaptive gamified learning platform for students and early-career professionals.

## Features
- **Intelligent AI Counsellor**: Dual intake flow ("I Have a Resume" vs "I Do Not Have a Resume") with interactive WebSocket-driven resume builder.
- **ATS Match My Job**: Multi-factor ATS job description parser with explainable scoring (Keyword Alignment, Required/Missing Skills, Weak Evidence).
- **Evidence Graph Engine**: Maps `Skill → Evidence → Source → Confidence` to prevent unverified resume claims.
- **TechQuest & SoftSkill Quest**: Adaptive gamified missions with automated JavaScript/Python code execution and AI mentor audio clarity evaluations.
- **Dynamic Mock Interview**: WebSocket live audio/text interview simulation tailored to job roles with streaming feedback.
- **Chrome Extension**: Authorized speech-to-text practice simulation with clear consent controls.

## Prerequisites
- Node.js (v18.x or higher)
- Ollama (Local AI daemon running `qwen2.5:3b` at `http://127.0.0.1:11434`)

## Folder Structure
```
PARICHAYA/
├── frontend/          # Next.js 14 App Router client application
├── backend/           # Node.js Express & WebSocket server
├── chrome-extension/ # Chrome Manifest V3 extension
├── docs/              # Technical documentation & architecture schemas
├── Explain.md         # Detailed hackathon presentation guide
└── README.md
```

## Quick Start Instructions

### 1. Start Backend Server
```bash
cd backend
npm install
npm run dev
```

### 2. Start Frontend Application
```bash
cd frontend
npm install
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser.

### 3. Chrome Extension Installation
1. Navigate to `chrome://extensions/` in Google Chrome.
2. Enable **Developer mode** in the top right corner.
3. Click **Load unpacked** and select the `chrome-extension` directory.
