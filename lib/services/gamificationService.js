/**
 * Gamification Service
 * Handles XP calculations, Level progression, Streak counts, Quest completion,
 * Confetti triggers, and IndexedDB state updates.
 */

import confetti from "canvas-confetti";
import { getAllItems, getItem, updateItem } from "@/lib/db";

export const LEVELS = [
  { level: 1, title: "Placement Novice", minXP: 0, maxXP: 499, badgeColor: "border-orange-500/30 text-orange-400" },
  { level: 2, title: "Tech Apprentice", minXP: 500, maxXP: 999, badgeColor: "border-amber-500/30 text-amber-400" },
  { level: 3, title: "Job-Ready Slayer", minXP: 1000, maxXP: Infinity, badgeColor: "border-emerald-500/30 text-emerald-400" }
];

/**
 * Calculates current level details based on candidate total XP.
 */
export function getLevelInfo(xp = 0) {
  const currentLevel = LEVELS.find(l => xp >= l.minXP && xp <= l.maxXP) || LEVELS[0];
  const nextLevel = LEVELS.find(l => l.level === currentLevel.level + 1);

  const levelProgressXP = xp - currentLevel.minXP;
  const levelTargetXP = nextLevel ? nextLevel.minXP - currentLevel.minXP : 500;
  const progressPercent = Math.min(100, Math.round((levelProgressXP / levelTargetXP) * 100));

  return {
    levelNumber: currentLevel.level,
    levelTitle: currentLevel.title,
    badgeColor: currentLevel.badgeColor,
    currentXP: xp,
    progressPercent,
    nextLevelTitle: nextLevel ? nextLevel.title : "Max Level Reached",
    xpToNextLevel: nextLevel ? nextLevel.minXP - xp : 0
  };
}

/**
 * Triggers victory confetti burst.
 */
export function triggerConfetti() {
  if (typeof window !== "undefined") {
    confetti({
      particleCount: 80,
      spread: 70,
      origin: { y: 0.6 },
      colors: ["#F97316", "#FB923C", "#10B981", "#F59E0B"]
    });
  }
}

/**
 * Marks a quest completed in IndexedDB, awards XP, updates candidate profile & stats,
 * and fires victory confetti.
 */
export async function completeQuest(questId) {
  // 1. Fetch quest item
  const quest = await getItem("quests", questId);
  if (!quest || quest.status === "completed") return null;

  const xpReward = quest.xpReward || 100;

  // 2. Update quest status in IndexedDB
  quest.status = "completed";
  quest.completedAt = new Date().toISOString();
  await updateItem("quests", quest);

  // 3. Fetch & update user profile in IndexedDB
  const profiles = await getAllItems("profiles");
  let profile = profiles[0] || {
    id: 1,
    fullName: "Candidate",
    xp: 0,
    readinessScore: 50,
    streakCount: 1
  };

  const newXP = (profile.xp || 0) + xpReward;
  const newReadinessScore = Math.min(100, (profile.readinessScore || 50) + 5);

  const levelInfo = getLevelInfo(newXP);

  profile.xp = newXP;
  profile.level = levelInfo.levelTitle;
  profile.readinessScore = newReadinessScore;
  profile.updatedAt = new Date().toISOString();

  await updateItem("profiles", profile);

  // 4. Trigger celebration confetti
  triggerConfetti();

  return {
    quest,
    profile,
    levelInfo,
    xpGained: xpReward
  };
}
