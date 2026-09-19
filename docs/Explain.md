# PARICHAYA AURA 2.0 — Architecture & Local LLM Working Guide

This document details the inner workings of **PARICHAYA AURA 2.0**, explaining how local LLM models (`qwen2.5:3b` and `llama3.2`) operate, how ATS scores are calculated, and how on-device AI handles career counseling, speech-to-speech mock interviews, and skill assessments.

---

## 1. Local LLMs Used & Model Assignment Matrix

The application operates **100% on-device** using local inference via [Ollama](https://ollama.com) running at `http://127.0.0.1:11434`. No resume data or interview transcripts leave your machine.

| Local Model | Primary Role | Features Handled | Rationale |
| :--- | :--- | :--- | :--- |
| **`qwen2.5:3b`** | **Conversational & Speech LLM** | • AI Career Counselor 7-Question Interview<br/>• Real-Time Speech-to-Speech Mock Interview<br/>• Resume Extraction JSON Synthesis<br/>• Soft Skills Assessment Feedback | Exceptional low-latency response times, high conversational fluency, sub-second TTFT (Time To First Token) for voice notes. |
| **`llama3.2`** | **Analytical ATS & Roadmap LLM** | • Strict ATS Resume Threat Audit<br/>• Skill Gap Identification<br/>• Role-Specific 4-Week Roadmap Synthesis<br/>• Google X-Y-Z Bullet Point Rewrites | Outstanding structured logic, strict adherence to scoring criteria, and deep technical role domain knowledge. |

---

## 2. How the Local LLM Engine Works (On-Device Pipeline)

```
[ User Input / Voice / PDF ]
          │
          ▼
┌───────────────────────────┐
│  Client-Side PDF Parser   │ (Extracts plain text via pdf-parse)
└─────────────┬─────────────┘
              │
              ▼
┌───────────────────────────┐
│   On-Device PII Masker    │ (Masks sensitive data locally)
└─────────────┬─────────────┘
              │
              ▼
┌───────────────────────────┐
│ Local Ollama REST Engine  │ (POST http://127.0.0.1:11434/api/generate or /api/chat)
│  (qwen2.5:3b / llama3.2)  │ (Enforces format: 'json')
└─────────────┬─────────────┘
              │
              ▼
┌───────────────────────────┐
│ Structured JSON Response  │ ➔ Populates UI Scorecard, Skill Gaps & PDF Resume
└───────────────────────────┘
```

1. **Local REST Communication**: The frontend calls Ollama endpoints directly via fetch:
   - `/api/generate`: Used for single-turn JSON extraction, ATS scoring, and roadmap generation.
   - `/api/chat`: Used for multi-turn conversational speech-to-speech mock interviews.
2. **On-Device JSON Schema Enforcement**: Requests pass `format: "json"` to guarantee deterministic, parseable data structures.
3. **Privacy Layer (`piiMasker.js`)**: Filters email addresses, phone numbers, and sensitive personal identifiers before feeding text to the model prompt.

---

## 3. How the ATS Score & Audit Works (Scoring Criteria)

The **ATS Threat Auditor** evaluates your resume against target job requirements using a **Strict 4-Criteria Weighted Scoring Algorithm**:

$$\text{ATS Score} = (0.30 \times S_{\text{keyword}}) + (0.30 \times S_{\text{xyz}}) + (0.20 \times S_{\text{verb}}) + (0.20 \times S_{\text{struct}})$$

### Criteria Breakdown:

1. **Keyword & Technical Skill Coverage (30% Weight)**:
   - Compares the required tools, languages, and frameworks in the Job Description against the resume text.
   - **Penalty**: Missing critical job requirements subtracts 15-20 points directly.

2. **Google X-Y-Z Impact Formula (30% Weight)**:
   - Evaluates whether resume achievements adhere to Google's gold standard:
     $$\text{"Accomplished [X], as measured by [Y], by doing [Z]"}$$
   - **Example**: *"Accelerated API response throughput [X] by 45% [Y] by implementing Redis multi-tier caching and query indexes [Z]"*.
   - **Penalty**: Vague bullet points lacking metrics (e.g., *"Worked on API optimization"*) deduct up to 25 points.

3. **Action Verb Density (20% Weight)**:
   - Scans for high-leverage technical and leadership action verbs (*Architected, Spearheaded, Engineered, Optimized, Containerized* vs *Helped, Responsible for*).

4. **Structural & Role Alignment (20% Weight)**:
   - Validates presence of essential sections: Professional Summary, Experience, Education, Projects, and Technical Skills.

---

## 4. Feature Workflows & LLM Execution

### A. AI Career Counselor (`/counselor/interview` ➔ `/counselor/results`)
- Conducts a 7-question interactive voice/text interview.
- Collects name, location, contact links, education, experience, projects, technical skills, and achievements.
- `qwen2.5:3b` synthesizes transcript into a clean JSON structure, which is rendered directly into a standard 1-page PDF layout and downloaded via `html2pdf.js`.

### B. Speech-to-Speech Mock Interview (`/interview`)
- **Phase 1**: `llama3.2` analyzes the resume against target role requirements and outputs score, 3 critical skill gaps, and 3 actionable learning steps.
- **Phase 2**: `qwen2.5:3b` conducts a voice mock interview focusing aggressively on detected skill gaps. Web Speech API transcribes candidate voice notes; SpeechSynthesis plays back AI responses in real-time.

### C. Gamified Skill Arena (`/arena`)
- **Soft Skills Battle Arena**: Evaluates communication scenarios across Workplace Decisions, Email Tone, Sentence Construction, and Executive Phrasing. Option positions are randomized dynamically per round.
- **Mind Matrix & Visual Logic**: Uses SVG visual diagrams (3x3 numerical matrices, pipeline latency graphs, call tree traces) combined with timed logic deduction.
- **Spatial SVG Puzzles**: Interactive Tower of Hanoi, Logic Gate Circuit Networks, and Water Jug puzzles.
- **Google X-Y-Z Builder**: Drag-and-drop phrase chip puzzle spanning 7 tech domains.

---

## 5. File & Source Code Directory Reference

- **Ollama Local Service**: [`src/lib/ollamaService.js`](file:///c:/Users/ashit.ASUS/Desktop/Parichaya-2.0/career-catalyst/src/lib/ollamaService.js)
- **ATS Auditor Page**: [`src/app/ats/page.js`](file:///c:/Users/ashit.ASUS/Desktop/Parichaya-2.0/career-catalyst/src/app/ats/page.js)
- **Conversational Mock Interview**: [`src/app/interview/page.js`](file:///c:/Users/ashit.ASUS/Desktop/Parichaya-2.0/career-catalyst/src/app/interview/page.js)
- **AI Counselor Interview**: [`src/app/counselor/interview/page.js`](file:///c:/Users/ashit.ASUS/Desktop/Parichaya-2.0/career-catalyst/src/app/counselor/interview/page.js)
- **Resume PDF Generator**: [`src/app/counselor/results/page.js`](file:///c:/Users/ashit.ASUS/Desktop/Parichaya-2.0/career-catalyst/src/app/counselor/results/page.js)
- **Skill Arena Hub**: [`src/app/arena/page.js`](file:///c:/Users/ashit.ASUS/Desktop/Parichaya-2.0/career-catalyst/src/app/arena/page.js)
