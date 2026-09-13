/**
 * Interview Controller Service
 * Generates targeted technical, behavioral, and HR questions using Qwen2.5 3B,
 * and handles mock interview session records in IndexedDB.
 */

import { generateStructuredJSON } from "@/lib/ollama";
import { addItem, updateItem } from "@/lib/db";
import interviewRubrics from "@/data/interview_rubrics.json";

function buildQuestionGenPrompt(roleTarget, sessionType, skillGaps = []) {
  return `
Generate 3 targeted ${sessionType} interview questions for a candidate applying for ${roleTarget}.
${skillGaps.length > 0 ? `Target these known skill gaps: ${skillGaps.join(", ")}.` : ""}

Return ONLY a JSON object with this EXACT structure:
{
  "questions": [
    {
      "id": 1,
      "category": "${sessionType}",
      "questionText": "Question 1 text",
      "expectedKeyPoints": ["Point 1", "Point 2"],
      "starFocus": "Action"
    },
    {
      "id": 2,
      "category": "${sessionType}",
      "questionText": "Question 2 text",
      "expectedKeyPoints": ["Point 1", "Point 2"],
      "starFocus": "Result"
    },
    {
      "id": 3,
      "category": "${sessionType}",
      "questionText": "Question 3 text",
      "expectedKeyPoints": ["Point 1", "Point 2"],
      "starFocus": "Situation"
    }
  ]
}
`;
}

/**
 * Generates targeted interview questions via Qwen2.5 3B and creates session in IndexedDB.
 */
export async function createInterviewSession(roleTarget = "Full Stack Engineer", sessionType = "technical", skillGaps = []) {
  const prompt = buildQuestionGenPrompt(roleTarget, sessionType, skillGaps);
  const systemPrompt = "You are a lead tech interviewer. Output strictly valid JSON without markdown tags.";

  let questionsData;
  try {
    questionsData = await generateStructuredJSON(prompt, systemPrompt);
  } catch (err) {
    console.warn("Ollama AI offline fallback active for Interview Questions:", err);
    // Fallback deterministic questions
    questionsData = {
      questions: [
        {
          id: 1,
          category: sessionType,
          questionText: "Can you describe a challenging technical bug you encountered in a recent project and how you resolved it?",
          expectedKeyPoints: ["Root cause analysis", "Debugging tools used", "Performance optimization"],
          starFocus: "Action"
        },
        {
          id: 2,
          category: sessionType,
          questionText: "How do you optimize state management and data fetching in client-heavy applications like Next.js?",
          expectedKeyPoints: ["React state boundaries", "Caching strategies", "Local persistence"],
          starFocus: "Result"
        },
        {
          id: 3,
          category: sessionType,
          questionText: "Tell me about a time when you had to balance feature delivery speed against code quality and testing.",
          expectedKeyPoints: ["Prioritization", "Refactoring", "Test coverage"],
          starFocus: "Situation"
        }
      ]
    };
  }

  const sessionRecord = {
    profileId: 1,
    roleTarget,
    sessionType,
    videoEnabled: true,
    audioEnabled: true,
    durationSeconds: 0,
    questions: questionsData.questions || [],
    transcriptLog: [],
    telemetrySummary: {
      averageWpm: 145,
      totalFillerWords: 0,
      fillerWordsBreakdown: {}
    },
    status: "in_progress",
    createdAt: new Date().toISOString()
  };

  let sessionId;
  try {
    sessionId = await addItem("mock_sessions", sessionRecord);
  } catch (err) {
    sessionId = Date.now();
  }

  return {
    sessionId,
    sessionRecord
  };
}

/**
 * Saves completed interview session transcript and telemetry log to IndexedDB.
 */
export async function saveSessionTranscript(sessionId, transcriptLog, telemetrySummary, durationSeconds) {
  const sessionRecord = {
    id: sessionId,
    profileId: 1,
    durationSeconds,
    transcriptLog,
    telemetrySummary,
    status: "completed",
    updatedAt: new Date().toISOString()
  };

  try {
    await updateItem("mock_sessions", sessionRecord);
  } catch (err) {
    console.warn("Session record save fallback:", err);
  }

  return sessionRecord;
}
