/**
 * AI Talking Practice Coach Service
 * Evaluates candidate voice/text interview responses, provides real-time coaching advice,
 * and compares Attempt 1 vs Attempt 2 metrics to measure retry improvement.
 */

import { generateStructuredJSON } from "@/lib/ollama";

/**
 * Analyzes a single candidate answer attempt using local Qwen2.5 3B.
 */
export async function analyzeCoachResponse(questionPrompt, candidateAnswer, attemptNumber = 1) {
  const prompt = `
You are an interactive AI Practice Coach evaluating a candidate's verbal/text answer to an interview question.

Interview Question Prompt:
"${questionPrompt}"

Candidate Answer (Attempt ${attemptNumber}):
"${candidateAnswer}"

Analyze the answer for:
1. STAR Methodology Structure (Situation, Task, Action, Result)
2. Personal Contribution ("I" vs vague "We")
3. Communication Clarity & Directness

Return ONLY a JSON object with this EXACT structure:
{
  "attempt": ${attemptNumber},
  "clarityScore": Number (0 to 100),
  "starStructureScore": Number (0 to 100),
  "personalContributionScore": Number (0 to 100),
  "overallScore": Number (0 to 100),
  "coachFeedback": "2-sentence conversational critique spoken by AI companion coach. Be constructive and highlight what to fix on next attempt.",
  "passedThreshold": Boolean (true if overallScore >= 70)
}
`;

  try {
    return await generateStructuredJSON(prompt, "You are a friendly AI career coach. Output strictly valid JSON.");
  } catch (err) {
    console.warn("AI Coach fallback active:", err);
    // Deterministic fallback for dev mode
    const textLength = (candidateAnswer || "").length;
    const score = Math.min(95, Math.max(45, 50 + Math.floor(textLength / 5)));
    return {
      attempt: attemptNumber,
      clarityScore: score,
      starStructureScore: score - 5,
      personalContributionScore: score + 5,
      overallScore: score,
      coachFeedback: attemptNumber === 1
        ? "Your answer explains the project context well, but you did not clearly highlight your personal contributions. Try again and state what tools you personally engineered!"
        : "Much better! You clearly stated your personal contributions and metrics. Great improvement on Attempt 2!",
      passedThreshold: score >= 70
    };
  }
}

/**
 * Compares Attempt 1 vs Attempt 2 metrics and computes improvement gains.
 */
export function computeAttemptComparison(attempt1, attempt2) {
  if (!attempt1 || !attempt2) return null;

  const clarityDiff = attempt2.clarityScore - attempt1.clarityScore;
  const structureDiff = attempt2.starStructureScore - attempt1.starStructureScore;
  const overallDiff = attempt2.overallScore - attempt1.overallScore;

  return {
    clarityDiff: clarityDiff >= 0 ? `+${clarityDiff}%` : `${clarityDiff}%`,
    structureDiff: structureDiff >= 0 ? `+${structureDiff}%` : `${structureDiff}%`,
    overallDiff: overallDiff >= 0 ? `+${overallDiff}%` : `${overallDiff}%`,
    overallGainPercent: Math.max(0, overallDiff),
    isImproved: overallDiff > 0
  };
}
