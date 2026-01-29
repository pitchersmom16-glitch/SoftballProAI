/**
 * VIDEO ANALYSIS SERVICE
 * 
 * Automated pipeline for processing uploaded videos:
 * 1. Extract biomechanics using MediaPipe pose detection
 * 2. Analyze mechanics with Brain AI
 * 3. Generate personalized feedback
 * 4. Recommend corrective drills
 * 5. Suggest SMART goals based on detected issues
 * 
 * Built for Shannon and every athlete who dreams of improving their game.
 */

import { analyzeVideo, analyzeMechanics } from '../brain/analysis_engine';
import { storage } from '../storage';
import type { BiomechanicsMetrics, DetectedIssue } from './types';

interface VideoAnalysisRequest {
  assessmentId: number;
  videoUrl: string;
  skillType: string;
  athleteId: number;
  athleteLevel?: string;
  videoCategory: string;
}

interface VideoAnalysisResult {
  success: boolean;
  assessmentId: number;
  biomechanics: BiomechanicsMetrics | null;
  issues: DetectedIssue[];
  strengths: string[];
  recommendedDrills: any[];
  aiGeneratedFeedback: string;
  suggestedGoals: SmartGoal[];
}

interface SmartGoal {
  metric: string;
  metricLabel: string;
  currentValue: number | null;
  targetValue: number;
  targetDate: string;
  unit: string;
  measurable: boolean;
  attainable: boolean;
  description: string;
}

/**
 * CLIENT-SIDE ANALYSIS BRIDGE
 * 
 * Since MediaPipe Pose runs in the browser, this service receives
 * the extracted biomechanics from the PoseAnalyzer component and
 * processes it through the AI Brain for feedback generation.
 */
export async function processVideoAnalysis(request: VideoAnalysisRequest): Promise<VideoAnalysisResult> {
  const { assessmentId, videoUrl, skillType, athleteId, athleteLevel = "Intermediate", videoCategory } = request;

  try {
    console.log(`[VideoAnalysis] Starting analysis for assessment ${assessmentId}`);

    // Step 1: Analyze video with Brain (gets issues and drill recommendations)
    const brainAnalysis = await analyzeVideo({
      videoUrl,
      skillType: skillType as any,
      athleteLevel,
      athleteId
    });

    console.log(`[VideoAnalysis] Brain detected ${brainAnalysis.issuesDetected.length} issues`);

    // Step 2: Get specific drill recommendations
    const drillAnalysis = await analyzeMechanics({
      skillType: skillType as any,
      detectedIssues: brainAnalysis.issuesDetected,
      athleteLevel,
      limit: 5
    });

    console.log(`[VideoAnalysis] Generated ${drillAnalysis.recommendations.length} drill recommendations`);

    // Step 3: Generate SMART goals based on detected issues
    const goals = generateSmartGoals(brainAnalysis.issuesDetected, skillType, videoCategory);

    console.log(`[VideoAnalysis] Created ${goals.length} SMART goals`);

    // Step 4: Generate AI feedback summary
    const feedback = generateAIFeedback(brainAnalysis, videoCategory);

    // Step 5: Save SMART goals to database
    const athlete = await storage.getAthlete(athleteId);
    if (athlete && athlete.userId) {
      for (const goal of goals) {
        try {
          await storage.createPlayerGoal({
            userId: athlete.userId,
            athleteId,
            metric: goal.metric,
            metricLabel: goal.metricLabel,
            currentValue: goal.currentValue?.toString() || null,
            targetValue: goal.targetValue.toString(),
            unit: goal.unit,
            targetDate: goal.targetDate,
            description: goal.description,
            progress: 0,
            status: "active",
            generatedBy: "ai",
          });
        } catch (err) {
          // Ignore duplicate goal errors
          console.log(`[VideoAnalysis] Goal already exists or error: ${goal.metric}`);
        }
      }
      console.log(`[VideoAnalysis] Saved ${goals.length} SMART goals for athlete ${athleteId}`);
    }

    // Step 6: Update assessment with results
    await storage.updateAssessment(assessmentId, {
      status: "completed",
      overallScore: calculateOverallScore(brainAnalysis.issuesDetected.length),
    });

    console.log(`[VideoAnalysis] Analysis complete for assessment ${assessmentId}`);

    return {
      success: true,
      assessmentId,
      biomechanics: null, // Will be populated by client-side MediaPipe
      issues: brainAnalysis.issuesDetected.map(issue => ({
        type: issue,
        severity: classifyIssueSeverity(issue),
        description: getIssueDescription(issue, skillType)
      })),
      strengths: brainAnalysis.strengths,
      recommendedDrills: drillAnalysis.recommendations,
      aiGeneratedFeedback: feedback,
      suggestedGoals: goals
    };

  } catch (error) {
    console.error(`[VideoAnalysis] Error processing assessment ${assessmentId}:`, error);
    
    // Update assessment status to error
    await storage.updateAssessment(assessmentId, {
      status: "error",
    });

    throw error;
  }
}

/**
 * Generate SMART goals based on detected biomechanical issues
 */
function generateSmartGoals(issues: string[], skillType: string, videoCategory: string): SmartGoal[] {
  const goals: SmartGoal[] = [];
  const sixMonthsFromNow = new Date();
  sixMonthsFromNow.setMonth(sixMonthsFromNow.getMonth() + 6);
  const targetDate = sixMonthsFromNow.toISOString().split('T')[0];

  // Map issues to specific, measurable goals
  if (skillType === "PITCHING") {
    if (issues.some(i => i.toLowerCase().includes("velocity") || i.toLowerCase().includes("speed"))) {
      goals.push({
        metric: "velocity",
        metricLabel: "Increase Fastball Velocity",
        currentValue: null, // Will be populated from first video
        targetValue: 5, // +5 mph improvement
        targetDate,
        unit: "mph",
        measurable: true,
        attainable: true,
        description: "Improve fastball velocity through improved hip-shoulder separation and leg drive"
      });
    }

    if (issues.some(i => i.toLowerCase().includes("spin") || i.toLowerCase().includes("rotation"))) {
      goals.push({
        metric: "spin_rate",
        metricLabel: "Improve Spin Rate",
        currentValue: null,
        targetValue: 200, // +200 rpm
        targetDate,
        unit: "rpm",
        measurable: true,
        attainable: true,
        description: "Increase ball spin through better wrist snap and finger pressure"
      });
    }

    if (issues.some(i => i.toLowerCase().includes("arm") || i.toLowerCase().includes("drag"))) {
      goals.push({
        metric: "arm_slot_consistency",
        metricLabel: "Improve Arm Slot Consistency",
        currentValue: null,
        targetValue: 90, // 90% consistency
        targetDate,
        unit: "%",
        measurable: true,
        attainable: true,
        description: "Maintain consistent arm slot angle (165-180°) across all pitches"
      });
    }

    if (issues.some(i => i.toLowerCase().includes("strike") || i.toLowerCase().includes("control"))) {
      goals.push({
        metric: "first_pitch_strike",
        metricLabel: "First Pitch Strike Percentage",
        currentValue: null,
        targetValue: 70,
        targetDate,
        unit: "%",
        measurable: true,
        attainable: true,
        description: "Achieve 70% first-pitch strike rate through improved mechanics and release point"
      });
    }

    // Always add stride length goal for pitchers
    goals.push({
      metric: "stride_length",
      metricLabel: "Optimize Stride Length",
      currentValue: null,
      targetValue: 85, // 85% of height
      targetDate,
      unit: "% of height",
      measurable: true,
      attainable: true,
      description: "Achieve optimal stride length (80-90% of height) for maximum power transfer"
    });
  }

  if (skillType === "HITTING") {
    if (issues.some(i => i.toLowerCase().includes("power") || i.toLowerCase().includes("contact"))) {
      goals.push({
        metric: "exit_velocity",
        metricLabel: "Increase Exit Velocity",
        currentValue: null,
        targetValue: 5, // +5 mph
        targetDate,
        unit: "mph",
        measurable: true,
        attainable: true,
        description: "Improve bat speed and contact quality through better hip rotation and weight transfer"
      });
    }

    if (issues.some(i => i.toLowerCase().includes("hip") || i.toLowerCase().includes("rotation"))) {
      goals.push({
        metric: "hip_rotation",
        metricLabel: "Improve Hip Rotation Angle",
        currentValue: null,
        targetValue: 45, // 45 degrees
        targetDate,
        unit: "degrees",
        measurable: true,
        attainable: true,
        description: "Generate more power through full hip rotation during swing"
      });
    }
  }

  if (skillType === "CATCHING") {
    if (issues.some(i => i.toLowerCase().includes("transfer") || i.toLowerCase().includes("pop"))) {
      goals.push({
        metric: "pop_time",
        metricLabel: "Improve Pop Time",
        currentValue: null,
        targetValue: -0.15, // Reduce by 0.15 seconds
        targetDate,
        unit: "seconds",
        measurable: true,
        attainable: true,
        description: "Achieve sub-2.0 second pop time through faster transfer and footwork"
      });
    }
  }

  // Ensure we always have at least 3 goals
  if (goals.length < 3) {
    // Add general improvement goals
    goals.push({
      metric: "consistency",
      metricLabel: "Improve Mechanical Consistency",
      currentValue: null,
      targetValue: 85,
      targetDate,
      unit: "%",
      measurable: true,
      attainable: true,
      description: "Maintain consistent mechanics across all repetitions"
    });
  }

  return goals.slice(0, 5); // Return max 5 goals
}

/**
 * Generate AI-powered coaching feedback
 */
function generateAIFeedback(analysis: any, videoCategory: string): string {
  const { issuesDetected, strengths, coachingNotes } = analysis;

  let feedback = `Great job uploading your ${videoCategory} video! Here's what I observed:\n\n`;

  // Strengths
  if (strengths && strengths.length > 0) {
    feedback += `**Strengths:**\n`;
    strengths.forEach((strength: string) => {
      feedback += `✅ ${strength}\n`;
    });
    feedback += `\n`;
  }

  // Areas for improvement
  if (issuesDetected && issuesDetected.length > 0) {
    feedback += `**Areas for Improvement:**\n`;
    issuesDetected.forEach((issue: string) => {
      feedback += `⚠️ ${issue}\n`;
    });
    feedback += `\n`;
  }

  // Coaching notes
  if (coachingNotes) {
    feedback += `**Coaching Insight:**\n${coachingNotes}\n\n`;
  }

  feedback += `Keep working hard! I've recommended specific drills below to help you improve these areas. Remember: every rep counts toward your goals! 🥎💪`;

  return feedback;
}

/**
 * Calculate overall performance score
 */
function calculateOverallScore(issueCount: number): number {
  // Start at 100, subtract 10 points per major issue
  const baseScore = 100 - (issueCount * 10);
  return Math.max(40, Math.min(100, baseScore)); // Clamp between 40-100
}

/**
 * Classify issue severity
 */
function classifyIssueSeverity(issue: string): 'critical' | 'moderate' | 'minor' {
  const criticalKeywords = ['injury', 'danger', 'severe', 'major'];
  const moderateKeywords = ['incorrect', 'poor', 'weak', 'inefficient'];
  
  const lowerIssue = issue.toLowerCase();
  
  if (criticalKeywords.some(keyword => lowerIssue.includes(keyword))) {
    return 'critical';
  }
  if (moderateKeywords.some(keyword => lowerIssue.includes(keyword))) {
    return 'moderate';
  }
  return 'minor';
}

/**
 * Get detailed description for an issue
 */
function getIssueDescription(issue: string, skillType: string): string {
  // Map common issues to detailed descriptions
  const issueDescriptions: Record<string, string> = {
    "arm drag": "Your throwing arm is lagging behind your body rotation, reducing velocity and increasing injury risk.",
    "no hip rotation": "Your hips aren't rotating fully, limiting power generation in your swing.",
    "casting": "You're releasing the bat too early, losing bat speed and power through the zone.",
    "pulling off": "You're stepping away from the plate instead of toward it, reducing power and contact quality.",
    "early break": "Your hands are breaking too early in the pitch, disrupting timing and velocity.",
    "poor weight transfer": "Weight isn't shifting properly from back to front, limiting power generation."
  };

  const lowerIssue = issue.toLowerCase();
  for (const [key, description] of Object.entries(issueDescriptions)) {
    if (lowerIssue.includes(key)) {
      return description;
    }
  }

  return issue; // Return original if no match
}

/**
 * Store biomechanics data in database (called from client after MediaPipe processing)
 */
export async function storeBiomechanicsData(
  assessmentId: number,
  metrics: BiomechanicsMetrics
): Promise<void> {
  try {
    // Validate biomechanics ranges before storage
    const validatedMetrics = validateBiomechanics(metrics);
    
    await storage.createSkeletalAnalysis({
      assessmentId,
      skillType: "PITCHING",
      metrics: {
        armSlotAngle: validatedMetrics.armSlotAngle,
        kneeFlexion: validatedMetrics.kneeFlexion,
        hipShoulderSeparation: validatedMetrics.torqueSeparation,
        strideLength: null, // Not calculated in current PoseAnalyzer
        backLegDrive: null,
        headPosition: null,
        analyzedAt: new Date().toISOString(),
        analysisVersion: "1.0"
      }
    });

    console.log(`[VideoAnalysis] Stored biomechanics for assessment ${assessmentId}`);
  } catch (error) {
    console.error(`[VideoAnalysis] Error storing biomechanics:`, error);
    throw error;
  }
}

// Validate biomechanics metrics against physically possible ranges
function validateBiomechanics(metrics: BiomechanicsMetrics): BiomechanicsMetrics {
  const validated = { ...metrics };
  
  // Arm slot angle: 140-180° (high 3/4 to over the top)
  if (metrics.armSlotAngle !== null) {
    if (metrics.armSlotAngle < 0 || metrics.armSlotAngle > 360) {
      console.warn(`[Validation] Invalid arm slot angle: ${metrics.armSlotAngle}° - setting to null`);
      validated.armSlotAngle = null;
    } else if (metrics.armSlotAngle < 120 || metrics.armSlotAngle > 190) {
      console.warn(`[Validation] Unusual arm slot angle: ${metrics.armSlotAngle}° (expected 140-180°)`);
    }
  }
  
  // Knee flexion: 70-130° (90-110° optimal)
  if (metrics.kneeFlexion !== null) {
    if (metrics.kneeFlexion < 0 || metrics.kneeFlexion > 180) {
      console.warn(`[Validation] Invalid knee flexion: ${metrics.kneeFlexion}° - setting to null`);
      validated.kneeFlexion = null;
    } else if (metrics.kneeFlexion < 60 || metrics.kneeFlexion > 140) {
      console.warn(`[Validation] Unusual knee flexion: ${metrics.kneeFlexion}° (expected 90-110°)`);
    }
  }
  
  // Torque/hip-shoulder separation: 30-60° (40-50° optimal)
  if (metrics.torqueSeparation !== null) {
    if (metrics.torqueSeparation < 0 || metrics.torqueSeparation > 180) {
      console.warn(`[Validation] Invalid torque separation: ${metrics.torqueSeparation}° - setting to null`);
      validated.torqueSeparation = null;
    } else if (metrics.torqueSeparation < 20 || metrics.torqueSeparation > 70) {
      console.warn(`[Validation] Unusual torque separation: ${metrics.torqueSeparation}° (expected 40-50°)`);
    }
  }
  
  return validated;
}
