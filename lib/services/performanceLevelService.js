/**
 * Performance Level & Unlocking Service
 * Enforces strict unlock conditions based on actual challenge performance scores.
 * Rule: Candidate must achieve minimum 70% score across at least 2 successful challenge attempts to unlock next level.
 */

import { getAllItems, getItem, updateItem } from "@/lib/db";

export const LEVEL_TIERS = [
  { level: 1, title: "Level 1: Placement Novice", reqScore: 70, minAttempts: 1, description: "Basic communication & basic array/string challenges" },
  { level: 2, title: "Level 2: Tech Apprentice", reqScore: 70, minAttempts: 2, description: "Simple STAR interview answers & debugging challenges" },
  { level: 3, title: "Level 3: Job-Ready Slayer", reqScore: 75, minAttempts: 3, description: "Structured STAR interview responses & medium DSA algorithm missions" },
  { level: 4, title: "Level 4: Senior Placement Candidate", reqScore: 80, minAttempts: 4, description: "Role-specific technical interview & timed coding battles" },
  { level: 5, title: "Level 5: Placement Master", reqScore: 85, minAttempts: 5, description: "Full mock interview mastery & real-world coding missions" }
];

/**
 * Checks whether candidate satisfies unlock criteria for target level.
 */
export function checkLevelUnlockCondition(completedChallenges = [], targetLevelNumber = 2) {
  const tierInfo = LEVEL_TIERS.find(t => t.level === targetLevelNumber) || LEVEL_TIERS[1];

  const successfulAttempts = completedChallenges.filter(c => (c.score || 0) >= tierInfo.reqScore);
  const isUnlocked = successfulAttempts.length >= tierInfo.minAttempts;

  return {
    targetLevelNumber,
    tierTitle: tierInfo.title,
    isUnlocked,
    reqScore: tierInfo.reqScore,
    minAttempts: tierInfo.minAttempts,
    currentSuccessfulAttempts: successfulAttempts.length,
    remainingAttemptsNeeded: Math.max(0, tierInfo.minAttempts - successfulAttempts.length)
  };
}
