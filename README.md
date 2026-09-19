# Parichaya AURA 2.0 🚀

**Parichaya AURA** is an advanced, fully local AI Career Companion and ATS Auditor. It leverages on-device Large Language Models (LLMs) to provide hyper-personalized mock interviews, rigorous resume ATS auditing, and gamified career roadmaps—all without sending a single byte of your personal data to the cloud.

---

## 🌟 Key Features

### 1. 🤖 Local On-Device AI
Powered entirely by local Ollama instances (`qwen2.5:3b` for fast text generation and `llama3.2` for deep ATS and interview analysis). 100% privacy-first—your career data never leaves your machine.

### 2. 🎤 Real-Time Mock Interview Engine
Experience high-fidelity, speech-to-speech mock interviews.
- **Speech Metrics**: Tracks your speaking pace (WPM) and detects filler words ("um", "like", "you know") using browser-native Web Speech API.
- **Camera Presentation Warnings**: Uses local computer vision to detect if your camera is blocked or poorly lit during the interview, simulating real remote-interview conditions.
- **STAR Method Coaching**: AI grades your responses against the STAR (Situation, Task, Action, Result) method.

### 3. 📊 ATS Resume Auditor
Upload your PDF resume and paste a target Job Description. The system parses the PDF and scores it against strict industry criteria, analyzing keyword density, Google X-Y-Z formula metrics, and structural integrity.

### 4. 🗺️ Gamified Career Quest Roadmap
Select from 15 target roles (e.g., Full-Stack Engineer, AI Researcher, Product Manager) and get a gamified, RPG-style skill progression tree. Earn XP as you check off technical and behavioral learning milestones.

### 5. 🧩 Browser Companion Extension
Includes a companion Manifest V3 Chrome Extension that tracks real-time speech analytics and seamlessly syncs interview metrics back to the Parichaya dashboard.

---

## 🏗️ Architecture & Tech Stack

### Frontend & UI
- **Framework**: Next.js 16 (App Router)
- **Core Library**: React 19
- **Styling**: Tailwind CSS v4 & Framer Motion (for smooth SaaS micro-animations)
- **Design System**: Custom "Atmospheric" dark/light glassmorphism UI

### Backend & Local Storage
- **Database**: IndexedDB (via `idb` library) — fully local in-browser persistence.
- **API**: Next.js API Routes (acting as a secure bridge to local resources).
- **Document Processing**: `pdf-parse` (PDF extraction) and `html2pdf.js` (clean PDF generation).

### AI & Machine Learning
- **Inference Engine**: Ollama (Running locally on `http://localhost:11434`)
- **Primary Model (`qwen2.5:3b`)**: Used for rapid text generation, resume synthesis, and feedback.
- **Secondary Model (`llama3.2`)**: Used for complex analytical tasks (ATS scoring, transcription analysis).
- **Speech-to-Text**: `webkitSpeechRecognition`
- **Vision/Camera**: Browser-native `FaceDetector` API (with brightness fallbacks).

---

## 🛠️ Installation & Setup Workflow

Because Parichaya AURA relies heavily on local AI inference, you must have Ollama installed and running on your machine before starting the web application.

### 1. Install & Configure Ollama
1. Download and install [Ollama](https://ollama.com/).
2. Open your terminal and pull the required models:
   ```bash
   ollama pull qwen2.5:3b
   ollama pull llama3.2
   ```
3. Keep Ollama running in the background (by default, it runs on `http://localhost:11434`). *Note: Parichaya uses Next.js Proxy Rewrites to seamlessly connect to Ollama and bypass browser CORS restrictions.*

### 2. Install Web Application Dependencies
Ensure you have Node.js (v18 or higher) installed.
```bash
# Navigate to the project directory
cd parichaya

# Install NPM packages
npm install
```

### 3. Run the Development Server
Start the Next.js development server:
```bash
npm run dev
# Or, to specify a custom port (e.g., 5000):
# npx next dev -p 5000
```
Open [http://localhost:3000](http://localhost:3000) (or your designated port) in your browser to start using Parichaya AURA.

---

## 🧩 Installing the Chrome Extension

To use the live interview speech tracking companion:
1. Open Google Chrome or any Chromium-based browser.
2. Navigate to `chrome://extensions/`.
3. Toggle **"Developer mode"** ON (usually in the top right corner).
4. Click **"Load unpacked"**.
5. Select the `extension/` folder located at the root of this project repository.
6. The Parichaya extension will now appear in your browser toolbar!

---

## 🔒 Privacy Guarantee
Parichaya is designed to be the ultimate safe space for career development. 
- **No Cloud Databases**: There is no remote PostgreSQL or MongoDB. All your profiles, resumes, and interview histories are stored in your browser's IndexedDB.
- **No API Telemetry**: AI inference happens strictly via your local hardware through Ollama.
- **No Remote Audio/Video Processing**: Camera feeds and microphone audio are analyzed locally in-browser and immediately discarded.

---

## 📄 License
This project is open-source and available for individual career development and educational purposes.
