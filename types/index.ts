export type RankTier = 'Novice' | 'Apprentice' | 'Job-Ready';

export interface RankInfo {
  tier: RankTier;
  minXp: number;
  maxXp: number;
  badgeColor: string;
}

export interface SkillGap {
  id: string;
  name: string;
  category: 'Matched' | 'Missing';
  importance: 'High' | 'Medium' | 'Critical';
  recommendation: string;
  leetCodePattern?: string;
  addedToQuests?: boolean;
}

export interface Quest {
  id: string;
  title: string;
  category: 'Skill Gap' | 'LeetCode Pattern' | 'Resume Enhancement' | 'Interview Prep';
  patternName?: string;
  xpReward: number;
  isCompleted: boolean;
  description: string;
  targetSkill?: string;
  actionText?: string;
}

export interface ProjectItem {
  id: string;
  title: string;
  descriptionXYZ: string; // Google X-Y-Z formula format: Accomplished [X] measured by [Y] by doing [Z]
  techStack: string[];
}

export interface ExperienceItem {
  id: string;
  role: string;
  company: string;
  duration: string;
  highlights: string[];
}

export interface UserProfile {
  targetRole: string;
  targetIndustry: string;
  degree: string;
  institution: string;
  gpa: string;
  graduationYear: string;
  projects: ProjectItem[];
  experiences: ExperienceItem[];
  techSkills: string[];
  softSkills: string[];
}

export interface CounselorChatMessage {
  id: string;
  sender: 'ai' | 'user';
  text: string;
  timestamp: string;
  stepId?: number;
}

export interface AtsMetrics {
  score: number; // 0 to 100
  rankTier: RankTier;
  matchedCount: number;
  missingCount: number;
  xyzFormulaAlignmentScore: number; // 0 to 100
  keywordDensityScore: number; // 0 to 100
  formattingScore: number; // 0 to 100
  skillGaps: SkillGap[];
  xyzChecklist: {
    rule: string;
    passed: boolean;
    feedback: string;
  }[];
}
