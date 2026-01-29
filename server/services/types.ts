/**
 * TYPES FOR VIDEO ANALYSIS SERVICE
 */

export interface BiomechanicsMetrics {
  armSlotAngle: number | null;
  kneeFlexion: number | null;
  torqueSeparation: number | null;
  strideLength?: number | null;
  hipRotation?: number | null;
  backLegDrive?: number | null;
  headPosition?: string | null;
}

export interface DetectedIssue {
  type: string;
  severity: 'critical' | 'moderate' | 'minor';
  description: string;
}

export interface DrillRecommendation {
  id: number;
  name: string;
  category: string;
  difficulty: string;
  relevanceScore: number;
  matchReason: string;
}
