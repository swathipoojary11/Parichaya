// Ollama local AI service — all inference via http://127.0.0.1:11434
// Model: qwen2.5:3b (Chat/General) | llama3.2 (ATS/Roadmap)

const isClient = typeof window !== 'undefined';
const OLLAMA_BASE_URL = isClient ? '/api/ollama' : 'http://127.0.0.1:11434/api';
const OLLAMA_GENERATE_URL = `${OLLAMA_BASE_URL}/generate`;
const OLLAMA_CHAT_URL = `${OLLAMA_BASE_URL}/chat`;
const MODEL_DEFAULT = 'qwen2.5:3b';
const MODEL_ATS = 'llama3.2';

import { maskPII } from './piiMasker';

/**
 * Core Ollama generate call with JSON enforcement
 */
async function ollamaGenerate(prompt, { model = MODEL_DEFAULT, stream = false } = {}) {
  const maskedPrompt = maskPII(prompt);
  
  const res = await fetch(OLLAMA_GENERATE_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      model: model,
      prompt: maskedPrompt,
      format: 'json',
      stream,
      options: { temperature: 0.1 },
    }),
  });

  if (!res.ok) {
    const errText = await res.text().catch(() => 'Unknown error');
    throw new Error(`Ollama error (${res.status}): ${errText}`);
  }

  const data = await res.json();
  try {
    return JSON.parse(data.response);
  } catch {
    throw new Error('Failed to parse LLM JSON response');
  }
}

/**
 * Core Ollama Chat call for conversational state
 */
async function ollamaChat(messages, { model = MODEL_DEFAULT, stream = false, num_predict = 120, temperature = 0.7 } = {}) {
  // Mask PII in messages if needed (simplified here)
  const res = await fetch(OLLAMA_CHAT_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      model: model,
      messages: messages,
      stream,
      options: { num_predict, temperature },
    }),
  });

  if (!res.ok) {
    const errText = await res.text().catch(() => 'Unknown error');
    throw new Error(`Ollama Chat error (${res.status}): ${errText}`);
  }

  const data = await res.json();
  return data.message;
}

/**
 * Check Ollama connectivity
 */
export async function checkOllamaHealth() {
  try {
    const res = await fetch(`${OLLAMA_BASE_URL}/tags`);
    if (!res.ok) return { ok: false, error: 'Ollama not responding' };
    const data = await res.json();
    const hasModel = data.models?.some(m => m.name?.includes('qwen2.5'));
    return { ok: true, hasModel, models: data.models?.map(m => m.name) || [] };
  } catch (e) {
    return { ok: false, error: e.message };
  }
}

/**
 * Module 1: Synthesize resume from counselor Q&A transcript
 */
export async function synthesizeResume(answers) {
  const prompt = `You are a professional resume writer. Given the following interview answers from a job candidate, generate a structured resume in JSON format.

Candidate Answers:
- Target Role: ${answers.targetRole}
- Education: ${answers.education}
- Technical Skills: ${answers.skills}
- Standout Project: ${answers.project}
- Collaboration Story: ${answers.collaboration}

Generate a JSON resume with these exact keys:
{
  "name": "Candidate",
  "role": "target role title",
  "summary": "2-3 sentence professional summary",
  "contact": { "email": "", "linkedin": "", "github": "" },
  "skills": { "languages": [], "frameworks": [], "tools": [] },
  "education": [{ "degree": "", "institution": "", "year": "" }],
  "experience": [{ "title": "", "company": "", "duration": "", "bullets": [] }],
  "projects": [{ "name": "", "description": "", "metrics": "", "tech": [] }],
  "achievements": []
}

Use the Google X-Y-Z formula for bullet points: "Accomplished [X], as measured by [Y], by doing [Z]".
Infer reasonable details. Return ONLY valid JSON.`;

  return ollamaGenerate(prompt, { model: MODEL_DEFAULT });
}

/**
 * Module 2: ATS score a resume against a job description
 */
export async function scoreATS(resumeText, jobDescription, targetRole = 'Software Engineer') {
  const prompt = `You are a strict ATS (Applicant Tracking System) scoring engine. Perform a rigorous evaluation of the following resume against the job description for the target role "${targetRole}".

STRICT EVALUATION CRITERIA:
1. Keyword & Technical Skill Coverage (30%): Are essential role tools explicitly present? If missing, penalize heavily.
2. Google X-Y-Z Formula Bullet Points (30%): Bullet points MUST state "Accomplished [X], as measured by [Y], by doing [Z]". Deduct 20+ points if achievements lack metrics.
3. Action Verb Density (20%): High-impact technical verbs.
4. Structural & Role Alignment (20%): Must include clear Summary, Experience, Skills, Education.

Resume Text:
---
${resumeText}
---

Job Description / Role Requirements:
---
${jobDescription}
---

Return JSON strictly:
{
  "overallScore": 0-100 (Be strict, score under 65 if key role pointers or metrics are missing),
  "skillMatchScore": 0-100,
  "xyzScore": 0-100,
  "actionVerbScore": 0-100,
  "structureScore": 0-100,
  "matchedSkills": ["matched_skill1", "matched_skill2"],
  "missingSkills": ["missing_skill1", "missing_skill2"],
  "missingPointers": ["Critical bullet/metric 1 missing for this role", "Essential tool requirement missing"],
  "suggestions": [
    { "original": "Weak/vague resume bullet", "rewrite": "Strict Google X-Y-Z formula rewrite for ${targetRole}" }
  ],
  "roadmapRoleId": "frontend_developer|backend_developer|fullstack_developer|data_scientist|devops_engineer|cloud_architect|product_manager|mobile_developer|ml_engineer|cybersecurity_analyst"
}`;

  return ollamaGenerate(prompt, { model: MODEL_DEFAULT });
}

/**
 * Module 4: Evaluate interview transcript with Llama 3.2 (Filler words, confidence & STAR evaluation)
 */
export async function evaluateInterview(transcript, role, fillerStats = {}, cameraStats = {}) {
  const prompt = `You are an executive hiring manager and expert speech coach evaluating a candidate's voice mock interview for the role of "${role}".

Candidate Speech & Spoken Transcript:
---
${transcript}
---

Filler Word & Speech Metrics (Recorded during voice dictation):
- Total Filler Words Detected: ${fillerStats.totalFillers || 0}
- Detected Filler Words Breakdown: ${JSON.stringify(fillerStats.detectedWords || {})}

Camera Presentation Metrics (Recorded during video feed):
- Camera Warnings Issued: ${cameraStats.warningCount || 0}
- Obstruction Events: ${JSON.stringify(cameraStats.events || [])}

Perform a rigorous evaluation. Return JSON strictly:
{
  "technicalScore": 0-100,
  "starScore": 0-100,
  "clarityScore": 0-100,
  "confidenceScore": 0-100,
  "overallScore": 0-100,
  "fillerWordCount": ${fillerStats.totalFillers || 0},
  "fillerAnalysis": "Detailed 1-2 sentence speech critique analyzing filler word frequency (um, uh, like, basically), hesitations, and vocal confidence.",
  "feedback": "Comprehensive hiring manager summary evaluating speech delivery, technical depth, and overall candidate fit.",
  "strengths": ["Clear voice articulation & technical clarity", "Good responsiveness to interviewer follow-ups"],
  "improvements": ["Reduce filler word usage ('um', 'like', 'you know')", "Quantify measurable business impact using Google X-Y-Z formula"],
  "roadmapPointers": ["Practice timed speech drills without filler words", "Refine STAR behavioral responses"],
  "videoReview": {
    "cameraWarningsIssued": ${cameraStats.warningCount || 0},
    "presentationFeedback": "Constructive 'Real Interview' pointer about camera presence and face visibility based on the warning count (e.g. if >0 mention maintaining face framing, if 0 mention good presentation). Do not claim they were lying or nervous."
  }
}`;

  try {
    return await ollamaGenerate(prompt, { model: MODEL_ATS });
  } catch {
    return await ollamaGenerate(prompt, { model: MODEL_DEFAULT });
  }
}

/**
 * Module 5: Generate adaptive roadmap
 */
export async function generateRoadmap(profile) {
  const prompt = `You are a career mentor. Generate a 4-week learning roadmap for someone targeting the role of "${profile.targetRole}" with current skills: ${profile.skills?.join(', ') || 'not specified'}.

Return JSON:
{
  "role": "target role",
  "weeks": [
    {
      "week": 1,
      "title": "Week title",
      "focus": "Main focus area",
      "tasks": ["task1", "task2", "task3"],
      "resources": [{ "title": "Resource name", "type": "video|article|course", "source": "platform name" }]
    }
  ]
}

Make it progressive: W1 fundamentals, W2 core skills, W3 system design/advanced, W4 mock interviews & portfolio.`;

  return ollamaGenerate(prompt, { model: MODEL_DEFAULT });
}

/**
 * General chat/feedback generation
 */
export async function generateFeedback(context, question) {
  const prompt = `${context}\n\nQuestion: ${question}\n\nProvide your response as JSON: { "feedback": "your detailed response" }`;
  return ollamaGenerate(prompt, { model: MODEL_DEFAULT });
}

/**
 * MOCK INTERVIEW MODE 1: ATS Analysis & Roadmap (using Llama model)
 */
export async function analyzeATSMode1(resumeText, role) {
  const prompt = `You are an advanced AI Career Coach and Executive Technical Recruiter.

MODE 1: RESUME & ATS ANALYSIS
Target Job Role: ${role}
Resume: ${resumeText}

1. Provide an ATS Match Score out of 100 based on the target job role requirements.
2. List the 3 most critical "Skill Gaps" or missing high-impact technical keywords found in the resume.
3. Provide a detailed, 6 to 8 step Actionable Learning Roadmap covering core fundamentals, system architecture, database caching, CI/CD deployment, live project drills, and behavioral interview drills.

Respond ONLY in JSON format:
{
  "score": 0-100,
  "skillGaps": ["Most Critical Skill Gap 1", "Most Critical Skill Gap 2", "Most Critical Skill Gap 3"],
  "roadmap": [
    "Step 1: Foundational Deep Dive",
    "Step 2: Core Architecture & Design Patterns",
    "Step 3: High-Throughput Caching & Database Optimization",
    "Step 4: Microservices Containerization & CI/CD Pipeline",
    "Step 5: End-to-End Hands-on Project Implementation",
    "Step 6: Live Coding & Algorithm Optimization Drills",
    "Step 7: STAR Behavioral & System Design Interview Drills"
  ],
  "message": "ATS Analysis Complete."
}`;

  return ollamaGenerate(prompt, { model: MODEL_ATS });
}


/**
 * MOCK INTERVIEW MODE 2: Conversational Speech-to-Speech Interview (using Llama 3.2)
 */
export async function chatMockInterviewMode2(messages) {
  try {
    return await ollamaChat(messages, { 
      model: MODEL_ATS, // llama3.2
      num_predict: 120, 
      temperature: 0.7 
    });
  } catch {
    return await ollamaChat(messages, { 
      model: MODEL_DEFAULT, 
      num_predict: 120, 
      temperature: 0.7 
    });
  }
}

