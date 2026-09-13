/**
 * Resource Mapper Service
 * Maps identified candidate skill gaps to curated LeetCode DSA patterns and learning resources.
 */

import dsaPatternsData from "@/data/dsa_patterns.json";
import { getAllItems } from "@/lib/db";

/**
 * Returns personalized LeetCode pattern recommendations mapped to candidate skill gaps.
 */
export async function getPersonalizedRecommendations() {
  let userGaps = [];

  try {
    const jobDescs = await getAllItems("job_descriptions");
    if (jobDescs.length > 0 && jobDescs[0].extractedSkills?.missing) {
      userGaps = jobDescs[0].extractedSkills.missing;
    }
  } catch (err) {
    console.warn("Storage load fallback for resources:", err);
  }

  // Map user gaps to patterns, or return all patterns if no active gaps
  const patterns = dsaPatternsData.patterns.map(pattern => {
    const isTargetedGap = userGaps.some(gap =>
      pattern.mappedSkills.some(s => s.toLowerCase().includes(gap.toLowerCase()) || gap.toLowerCase().includes(s.toLowerCase()))
    );

    return {
      ...pattern,
      isTargetedGap
    };
  });

  // Sort targeted gap patterns first
  patterns.sort((a, b) => (b.isTargetedGap ? 1 : 0) - (a.isTargetedGap ? 1 : 0));

  return {
    userGaps,
    patterns
  };
}
