/**
 * SoftballProAI Brain - Mechanics Analysis Engine
 * 
 * This module provides the AI Brain's logic for analyzing biomechanical issues
 * and recommending correction drills from the Knowledge Base.
 */

import { db } from "../db";
import { drills } from "@shared/schema";
import { ilike, or, eq, sql, and } from "drizzle-orm";

// Known biomechanical issues and their associated mechanic tags
const ISSUE_TAG_MAPPING: Record<string, string[]> = {
  // Pitching posture issues
  "hunched forward": ["Posture", "Spine Angle", "Balance", "Tall and Fall"],
  "bent over": ["Posture", "Spine Angle", "Head Position"],
  "leaning forward": ["Posture", "Stay Back", "Balance"],
  
  // Arm circle issues
  "arm not brushing hip": ["Arm Circle", "Hip Brush", "Internal Rotation"],
  "short arm circle": ["Arm Circle", "Full Extension", "Fluidity"],
  "slow arm speed": ["Arm Speed", "Arm Circle", "Internal Rotation"],
  
  // Drag foot issues
  "lifting drag foot": ["Drag Foot", "Balance", "Stability", "Ground Contact"],
  "drag foot early": ["Drag Foot", "Foot Path", "Timing"],
  
  // Release issues
  "inconsistent release": ["Release Point", "Timing", "Consistency"],
  "high release": ["Release Point", "Location", "Command"],
  "late release": ["Release Point", "Timing", "Wrist Snap"],
  
  // Leg drive issues
  "weak leg drive": ["Leg Drive", "Explosive Power", "Load Position"],
  "not using legs": ["Leg Drive", "Power Transfer", "Kinetic Chain"],
  "arm dominant": ["Leg Drive", "Kinetic Chain", "Power Generation"],
  
  // Hip issues
  "open hips": ["Hip Alignment", "Power Line", "Stride Direction"],
  "closed hips": ["Hip Rotation", "Power Line", "Kinetic Chain"],
  
  // Spin issues  
  "no spin": ["Spin", "Wrist Snap", "Internal Rotation"],
  "wrong spin": ["Spin Axis", "Release", "Wrist Snap"],
  "rise ball flat": ["Rise Ball", "Backspin", "Wrist Snap"],
  "drop ball flat": ["Drop Ball", "Topspin", "Release"],
  
  // Hitting issues
  "uppercut swing": ["Swing Plane", "Level Swing", "High Strike"],
  "long swing": ["Hand Path", "Compact Swing", "Hands Inside", "Casting Fix"],
  "casting": ["Casting Fix", "Hands Inside", "Elbow Position", "Short Swing"],
  "lunging": ["Stay Back", "Load", "Balance", "Weight Distribution"],
  "no hip rotation": ["Hip Rotation", "Kinetic Chain", "Power Generation"],
  "no separation": ["Separation", "Load", "Coil", "Power Generation"],
  "pulling off ball": ["Stay Back", "Opposite Field", "Extension"],
  "rolling over": ["Stay Low", "Extension", "Opposite Field"],
  "weak contact": ["Power", "Drive Through", "Bat Speed"],
  "popping up": ["Swing Plane", "High Strike", "Barrel Control"],
  "getting jammed": ["Inside Pitch", "Quick Hands", "Hip Rotation"],
  "reaching": ["Outside Pitch", "Stay Back", "Extension"],
  "timing off": ["Timing", "Stride", "Load", "Rhythm"],
  "off balance": ["Balance", "Weight Transfer", "Finish"]
};

// Priority weights for different match types
const WEIGHTS = {
  issueAddressedMatch: 100,  // Direct issue match is most important
  tagExactMatch: 30,         // Exact tag match
  tagPartialMatch: 15,       // Partial tag match (contains)
  categoryMatch: 10,         // Category matches skill type
  difficultyPreference: 5    // Prefer intermediate for corrections
};

export interface MechanicsAnalysisRequest {
  skillType: "pitching" | "hitting";
  detectedIssues?: string[];  // e.g., ["hunched forward", "weak leg drive"]
  athleteLevel?: "Beginner" | "Intermediate" | "Advanced";
  limit?: number;
}

export interface DrillRecommendation {
  id: number;
  name: string;
  category: string;
  difficulty: string | null;
  description: string;
  videoUrl: string | null;
  expertSource: string | null;
  mechanicTags: string[] | null;
  issueAddressed: string | null;
  relevanceScore: number;
  matchReason: string;
}

export interface MechanicsAnalysisResult {
  skillType: string;
  analyzedIssues: string[];
  recommendations: DrillRecommendation[];
  totalDrillsSearched: number;
}

/**
 * Analyzes mechanics issues and returns top correction drills from the Knowledge Base.
 * 
 * Example usage:
 *   const result = await analyzeMechanics({ 
 *     skillType: "pitching", 
 *     detectedIssues: ["hunched forward", "weak leg drive"] 
 *   });
 */
export async function analyzeMechanics(request: MechanicsAnalysisRequest): Promise<MechanicsAnalysisResult> {
  const { 
    skillType, 
    detectedIssues = [], 
    athleteLevel = "Intermediate",
    limit = 3 
  } = request;

  // Get all drills matching the skill type/category
  const category = skillType === "pitching" ? "Pitching" : "Hitting";
  
  const allDrills = await db.select().from(drills).where(
    eq(drills.category, category)
  );

  // Build list of relevant tags from detected issues
  const relevantTags: Set<string> = new Set();
  for (const issue of detectedIssues) {
    const normalizedIssue = issue.toLowerCase().trim();
    for (const [knownIssue, tags] of Object.entries(ISSUE_TAG_MAPPING)) {
      if (normalizedIssue.includes(knownIssue) || knownIssue.includes(normalizedIssue)) {
        tags.forEach(tag => relevantTags.add(tag.toLowerCase()));
      }
    }
  }

  // Score each drill based on relevance
  const scoredDrills = allDrills.map(drill => {
    let score = 0;
    const matchReasons: string[] = [];

    // Check if drill directly addresses any detected issue
    if (drill.issueAddressed) {
      for (const issue of detectedIssues) {
        if (drill.issueAddressed.toLowerCase().includes(issue.toLowerCase()) ||
            issue.toLowerCase().includes(drill.issueAddressed.toLowerCase())) {
          score += WEIGHTS.issueAddressedMatch;
          matchReasons.push(`Directly addresses: ${issue}`);
        }
      }
    }

    // Score based on mechanic tags
    if (drill.mechanicTags && drill.mechanicTags.length > 0) {
      for (const tag of drill.mechanicTags) {
        const tagLower = tag.toLowerCase();
        if (relevantTags.has(tagLower)) {
          score += WEIGHTS.tagExactMatch;
          matchReasons.push(`Tag match: ${tag}`);
        } else {
          // Partial match check
          for (const relevantTag of Array.from(relevantTags)) {
            if (tagLower.includes(relevantTag) || relevantTag.includes(tagLower)) {
              score += WEIGHTS.tagPartialMatch;
              matchReasons.push(`Related to: ${tag}`);
              break;
            }
          }
        }
      }
    }

    // Category match bonus
    if (drill.skillType?.toLowerCase() === skillType.toLowerCase()) {
      score += WEIGHTS.categoryMatch;
    }

    // Prefer intermediate drills for corrections (most versatile)
    if (drill.difficulty === athleteLevel) {
      score += WEIGHTS.difficultyPreference;
    } else if (drill.difficulty === "Intermediate") {
      score += WEIGHTS.difficultyPreference / 2;
    }

    // If no issues specified, give base score to all drills in category
    if (detectedIssues.length === 0 && score === 0) {
      score = WEIGHTS.categoryMatch;
      matchReasons.push(`Recommended ${category} drill`);
    }

    return {
      id: drill.id,
      name: drill.name,
      category: drill.category,
      difficulty: drill.difficulty,
      description: drill.description,
      videoUrl: drill.videoUrl,
      expertSource: drill.expertSource,
      mechanicTags: drill.mechanicTags,
      issueAddressed: drill.issueAddressed,
      relevanceScore: score,
      matchReason: matchReasons.length > 0 ? matchReasons.join("; ") : "General recommendation"
    };
  });

  // Sort by score descending and take top N
  const topDrills = scoredDrills
    .filter(d => d.relevanceScore > 0)
    .sort((a, b) => b.relevanceScore - a.relevanceScore)
    .slice(0, limit);

  return {
    skillType,
    analyzedIssues: detectedIssues,
    recommendations: topDrills,
    totalDrillsSearched: allDrills.length
  };
}

/**
 * Quick helper to get correction drills for a simple tag/issue search.
 * 
 * Example: getCorrectiveDrills("pitching", "hunched forward")
 */
export async function getCorrectiveDrills(
  skillType: "pitching" | "hitting",
  issue: string,
  limit: number = 3
): Promise<DrillRecommendation[]> {
  const result = await analyzeMechanics({
    skillType,
    detectedIssues: [issue],
    limit
  });
  return result.recommendations;
}

/**
 * Get all drills for a specific mechanic tag.
 * 
 * Example: getDrillsByTag("Internal Rotation")
 */
export async function getDrillsByTag(tag: string, limit: number = 10): Promise<DrillRecommendation[]> {
  const allDrills = await db.select().from(drills);
  
  const matchingDrills = allDrills
    .filter(drill => 
      drill.mechanicTags?.some(t => 
        t.toLowerCase().includes(tag.toLowerCase()) ||
        tag.toLowerCase().includes(t.toLowerCase())
      )
    )
    .slice(0, limit)
    .map(drill => ({
      id: drill.id,
      name: drill.name,
      category: drill.category,
      difficulty: drill.difficulty,
      description: drill.description,
      videoUrl: drill.videoUrl,
      expertSource: drill.expertSource,
      mechanicTags: drill.mechanicTags,
      issueAddressed: drill.issueAddressed,
      relevanceScore: 100,
      matchReason: `Matches tag: ${tag}`
    }));

  return matchingDrills;
}

/**
 * Get drills by expert source.
 * 
 * Example: getDrillsByExpert("Amanda Scarborough")
 */
export async function getDrillsByExpert(expertName: string): Promise<DrillRecommendation[]> {
  const expertDrills = await db.select().from(drills).where(
    ilike(drills.expertSource, `%${expertName}%`)
  );

  return expertDrills.map(drill => ({
    id: drill.id,
    name: drill.name,
    category: drill.category,
    difficulty: drill.difficulty,
    description: drill.description,
    videoUrl: drill.videoUrl,
    expertSource: drill.expertSource,
    mechanicTags: drill.mechanicTags,
    issueAddressed: drill.issueAddressed,
    relevanceScore: 100,
    matchReason: `From expert: ${expertName}`
  }));
}
