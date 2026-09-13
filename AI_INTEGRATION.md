# AURA — Local AI Integration & Prompt Engineering Guide

**Model:** Qwen2.5 3B (Quantized Q4_K_M)  
**Runtime Engine:** Ollama Local Daemon (`http://127.0.0.1:11434`)  
**Context Window:** Capped at 2048 tokens per request  
**Hardware Footprint:** ~2.2 GB VRAM / RAM  

---

## 1. Local AI Architecture Principles

Qwen2.5 3B is a compact, high-efficiency small language model (SLM) capable of executing rapid inference on consumer hardware (8 GB – 16 GB RAM laptops).

To maintain 100% reliable execution:
1. **Single-Purpose Operations:** AI tasks are broken into narrow, focused prompts returning strictly structured JSON.
2. **Deterministic System Instructions:** System prompts enforce `"Return ONLY valid JSON without markdown code blocks or conversational text"`.
3. **Resilient Fallbacks:** Service modules wrap all AI requests in fallback handlers so the application remains fully usable even if the local Ollama service is temporarily busy.

---

## 2. AI Service Modules & Prompt Schemas

### 2.1 Counselor Service (`/lib/services/counselorService.js`)
Synthesizes candidate Q&A intake into an ATS-compliant resume JSON using the Google X-Y-Z formula (`"Accomplished [X] as measured by [Y], by doing [Z]"`).

```javascript
// Sample Output Schema
{
  "contact": { "fullName": "String", "email": "String", "phone": "String" },
  "summary": "Impactful career summary...",
  "education": [{ "institution": "String", "degree": "String", "gradYear": "String" }],
  "experience": [{ "company": "String", "role": "String", "bullets": ["Bullet 1"] }],
  "projects": [{ "title": "String", "techStack": ["Tech1"], "bullets": ["Bullet 1"] }],
  "skills": { "languages": [], "frameworks": [], "tools": [] }
}
```

---

### 2.2 ATS Audit Service (`/lib/services/atsAuditService.js`)
Performs keyword matching, skill gap diff extraction, and bullet rewrites between uploaded resume text and target Job Description text.

```javascript
// Sample Output Schema
{
  "matchScore": 75,
  "roleTitle": "Full Stack Engineer",
  "matchedSkills": ["React", "Node.js", "SQL"],
  "missingSkills": ["WebSockets", "Docker"],
  "bulletRewrites": [
    { "original": "Weak bullet text", "improved": "X-Y-Z formula improved bullet" }
  ]
}
```

---

### 2.3 Interview Service (`/lib/services/interviewService.js`)
Generates targeted behavioral, technical, and HR interview questions based on candidate target role and identified skill gaps.

---

### 2.4 Feedback Service (`/lib/services/feedbackService.js`)
Evaluates candidate interview response transcripts against STAR methodology rubrics (Situation 20%, Task 20%, Action 35%, Result 25%), technical depth, clarity, and confidence.

---

## 3. Ollama Connectivity Verification

To test connectivity to local Ollama service:

```bash
curl http://127.0.0.1:11434/api/tags
```

To run a manual CLI test with Qwen2.5 3B:

```bash
ollama run qwen2.5:3b "Formulate a STAR interview question for a Full Stack Engineer."
```
