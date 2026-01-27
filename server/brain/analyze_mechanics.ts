/**
 * SoftballProAI Brain - Holistic Analysis Engine
 * 
 * Supports ALL 4 Core Skills as defined in Spec Sheet:
 * - PITCHING: Windmill mechanics, arm circle, drag foot, release
 * - HITTING: Bat speed, launch angle, hip rotation, timing
 * - CATCHING: Framing, blocking, pop-time, throw-downs
 * - THROWING: Fielding mechanics, arm slot, footwork
 * 
 * Plus: Mental Module for Championship Mindset
 */

import { db } from "../db";
import { drills, mentalEdge } from "@shared/schema";
import { ilike, or, eq, sql, and } from "drizzle-orm";
import type { SkillType } from "@shared/schema";

// Known biomechanical issues and their associated mechanic tags
const ISSUE_TAG_MAPPING: Record<string, string[]> = {
  // === PITCHING ISSUES ===
  "hunched forward": ["Posture", "Spine Angle", "Balance", "Tall and Fall"],
  "bent over": ["Posture", "Spine Angle", "Head Position"],
  "leaning forward": ["Posture", "Stay Back", "Balance"],
  "arm not brushing hip": ["Arm Circle", "Hip Brush", "Internal Rotation"],
  "short arm circle": ["Arm Circle", "Full Extension", "Fluidity"],
  "slow arm speed": ["Arm Speed", "Arm Circle", "Internal Rotation"],
  "lifting drag foot": ["Drag Foot", "Balance", "Stability", "Ground Contact"],
  "drag foot early": ["Drag Foot", "Foot Path", "Timing"],
  "inconsistent release": ["Release Point", "Timing", "Consistency"],
  "high release": ["Release Point", "Location", "Command"],
  "late release": ["Release Point", "Timing", "Wrist Snap"],
  "weak leg drive": ["Leg Drive", "Explosive Power", "Load Position"],
  "not using legs": ["Leg Drive", "Power Transfer", "Kinetic Chain"],
  "arm dominant": ["Leg Drive", "Kinetic Chain", "Power Generation"],
  "open hips": ["Hip Alignment", "Power Line", "Stride Direction"],
  "closed hips": ["Hip Rotation", "Power Line", "Kinetic Chain"],
  "no spin": ["Spin", "Wrist Snap", "Internal Rotation"],
  "wrong spin": ["Spin Axis", "Release", "Wrist Snap"],
  "rise ball flat": ["Rise Ball", "Backspin", "Wrist Snap"],
  "drop ball flat": ["Drop Ball", "Topspin", "Release"],
  
  // === HITTING ISSUES ===
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
  "off balance": ["Balance", "Weight Transfer", "Finish"],
  "slow bat speed": ["Bat Speed", "Hand Speed", "Torque", "Hip Rotation"],
  "bad launch angle": ["Launch Angle", "Swing Plane", "Barrel Path"],

  // === CATCHING ISSUES ===
  "poor framing": ["Framing", "Glove Presentation", "Soft Hands", "Stick It"],
  "loud glove": ["Quiet Glove", "Soft Hands", "Receiving"],
  "stabbing at ball": ["Framing", "Funnel", "Smooth Receiving"],
  "slow pop time": ["Pop Time", "Quick Feet", "Exchange", "Transfer"],
  "poor blocking": ["Blocking", "Stay Low", "Centerline", "Smother"],
  "ball gets by": ["Blocking", "Reaction", "Stay Center"],
  "slow exchange": ["Exchange", "Transfer", "Quick Hands"],
  "weak throw to second": ["Arm Strength", "Footwork", "Pop Time"],
  "off target throws": ["Accuracy", "Footwork", "Follow Through"],
  "late on steal": ["Pop Time", "Quick Feet", "Anticipation"],

  // === THROWING/FIELDING ISSUES ===
  "side arm": ["Arm Slot", "Over the Top", "Arm Path"],
  "short arming": ["Arm Path", "Full Extension", "Follow Through"],
  "no follow through": ["Follow Through", "Finish", "Arm Path"],
  "poor footwork": ["Footwork", "Quick Feet", "Transition"],
  "slow release": ["Quick Release", "Exchange", "Footwork"],
  "weak arm": ["Arm Strength", "Long Toss", "Conditioning"],
  "inaccurate throws": ["Accuracy", "Target", "Follow Through"],
  "charging too fast": ["Approach", "Under Control", "Balance"],
  "fielding off center": ["Centerline", "Glove Position", "Stay Low"],
  "bobbling ball": ["Soft Hands", "Watch Into Glove", "Concentration"]
};

// Priority weights for different match types
const WEIGHTS = {
  issueAddressedMatch: 100,
  tagExactMatch: 30,
  tagPartialMatch: 15,
  categoryMatch: 10,
  difficultyPreference: 5
};

// Map skill type to drill categories
const SKILL_TO_CATEGORY: Record<string, string[]> = {
  "PITCHING": ["PITCHING", "Pitching"],
  "HITTING": ["HITTING", "Hitting"],
  "CATCHING": ["CATCHING", "Catching"],
  "THROWING": ["THROWING", "Throwing", "INFIELD", "OUTFIELD", "Infield", "Outfield"]
};

export interface MechanicsAnalysisRequest {
  skillType: SkillType;
  detectedIssues?: string[];
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
 * PITCHING ANALYSIS
 * Analyzes windmill pitching mechanics including arm circle, drag foot, release point
 */
export async function analyzePitching(request: Omit<MechanicsAnalysisRequest, 'skillType'>): Promise<MechanicsAnalysisResult> {
  return analyzeMechanics({ ...request, skillType: "PITCHING" });
}

/**
 * HITTING ANALYSIS
 * Analyzes bat speed, launch angle, hip rotation, timing, and swing mechanics
 */
export async function analyzeHitting(request: Omit<MechanicsAnalysisRequest, 'skillType'>): Promise<MechanicsAnalysisResult> {
  return analyzeMechanics({ ...request, skillType: "HITTING" });
}

/**
 * CATCHING ANALYSIS
 * Analyzes framing, blocking, pop-time, throw-downs, and receiving mechanics
 */
export async function analyzeCatching(request: Omit<MechanicsAnalysisRequest, 'skillType'>): Promise<MechanicsAnalysisResult> {
  return analyzeMechanics({ ...request, skillType: "CATCHING" });
}

/**
 * THROWING/FIELDING ANALYSIS
 * Analyzes arm slot, footwork, exchange, accuracy, and fielding mechanics
 */
export async function analyzeThrowing(request: Omit<MechanicsAnalysisRequest, 'skillType'>): Promise<MechanicsAnalysisResult> {
  return analyzeMechanics({ ...request, skillType: "THROWING" });
}

/**
 * Core mechanics analyzer - handles all 4 skill types
 */
export async function analyzeMechanics(request: MechanicsAnalysisRequest): Promise<MechanicsAnalysisResult> {
  const { 
    skillType, 
    detectedIssues = [], 
    athleteLevel = "Intermediate",
    limit = 3 
  } = request;

  // Get valid categories for this skill type
  const validCategories = SKILL_TO_CATEGORY[skillType] || [skillType];
  
  // Get all drills matching any valid category
  const allDrills = await db.select().from(drills);
  const categoryDrills = allDrills.filter(d => 
    validCategories.some(cat => 
      d.category.toUpperCase() === cat.toUpperCase() ||
      d.skillType?.toUpperCase() === cat.toUpperCase()
    )
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
  const scoredDrills = categoryDrills.map(drill => {
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
    score += WEIGHTS.categoryMatch;

    // Prefer matching difficulty level
    if (drill.difficulty === athleteLevel) {
      score += WEIGHTS.difficultyPreference;
    } else if (drill.difficulty === "Intermediate") {
      score += WEIGHTS.difficultyPreference / 2;
    }

    // If no issues specified, give base score to all drills in category
    if (detectedIssues.length === 0 && score <= WEIGHTS.categoryMatch) {
      matchReasons.push(`Recommended ${skillType} drill`);
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
    totalDrillsSearched: categoryDrills.length
  };
}

// === MENTAL MODULE ===

export interface MentalContent {
  id: number;
  title: string;
  contentType: string;
  category: string;
  source: string | null;
  content: string;
  videoUrl: string | null;
  tags: string[] | null;
  usageContext: string | null;
}

export interface MentalAnalysisRequest {
  context: "pre-game" | "post-game" | "pre-at-bat" | "after-strikeout" | "daily-mindset" | "recovery";
  category?: string;
  limit?: number;
}

export interface MentalAnalysisResult {
  context: string;
  recommendations: MentalContent[];
  totalSearched: number;
}

/**
 * MENTAL ANALYSIS
 * Serves Championship Mindset audio/content based on game situation context
 */
export async function analyzeMental(request: MentalAnalysisRequest): Promise<MentalAnalysisResult> {
  const { context, category, limit = 3 } = request;

  // Context to usage mapping
  const contextMapping: Record<string, string[]> = {
    "pre-game": ["pre-game", "before game", "warmup", "focus"],
    "post-game": ["post-game", "after game", "recovery", "reflection"],
    "pre-at-bat": ["before at-bat", "at bat", "focus", "confidence"],
    "after-strikeout": ["after strikeout", "bounce back", "resilience", "flush"],
    "daily-mindset": ["daily", "morning", "mindset", "motivation"],
    "recovery": ["recovery", "rest", "off-day", "mental reset"]
  };

  const relevantContexts = contextMapping[context] || [context];

  // Get all mental edge content
  const allMental = await db.select().from(mentalEdge);

  // Score based on context match
  const scored = allMental.map(item => {
    let score = 0;
    
    // Usage context match
    if (item.usageContext) {
      for (const ctx of relevantContexts) {
        if (item.usageContext.toLowerCase().includes(ctx)) {
          score += 50;
        }
      }
    }

    // Category match
    if (category && item.category.toLowerCase().includes(category.toLowerCase())) {
      score += 30;
    }

    // Tag match
    if (item.tags) {
      for (const tag of item.tags) {
        for (const ctx of relevantContexts) {
          if (tag.toLowerCase().includes(ctx)) {
            score += 20;
          }
        }
      }
    }

    // Base score for all content
    score += 5;

    return {
      id: item.id,
      title: item.title,
      contentType: item.contentType,
      category: item.category,
      source: item.source,
      content: item.content,
      videoUrl: item.videoUrl,
      tags: item.tags,
      usageContext: item.usageContext,
      score
    };
  });

  // Sort and limit
  const top = scored
    .sort((a, b) => b.score - a.score)
    .slice(0, limit)
    .map(({ score, ...rest }) => rest);

  return {
    context,
    recommendations: top,
    totalSearched: allMental.length
  };
}

// === HELPER FUNCTIONS ===

/**
 * Quick helper to get correction drills for a simple tag/issue search.
 */
export async function getCorrectiveDrills(
  skillType: SkillType,
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

/**
 * Get daily championship mindset content
 */
export async function getDailyMindset(): Promise<MentalContent | null> {
  const result = await analyzeMental({ context: "daily-mindset", limit: 1 });
  return result.recommendations[0] || null;
}

/**
 * Get pre-game visualization audio content
 */
export async function getPreGameAudio(): Promise<MentalContent[]> {
  return (await analyzeMental({ context: "pre-game", limit: 3 })).recommendations;
}
