/**
 * SOFTBALLPROAI BRAIN - MASTER INDEX
 * Central export point for all knowledge bases
 * 
 * Import comprehensive softball knowledge, mental training, strength conditioning,
 * tournament rules, and practice planning from a single location.
 * 
 * Usage:
 *   import { PITCHING_KNOWLEDGE, MAMBA_MENTALITY } from './brain';
 *   import * as SoftballBrain from './brain';
 */

// Core analysis engines
import { analyzeMechanics, analyzePitching, analyzeHitting, analyzeCatching, analyzeFielding, analyzeMental, getCorrectiveDrills, getDrillsByTag, getDrillsByExpert, getDailyMindset, getPreGameAudio } from './analyze_mechanics';
export { analyzeMechanics, analyzePitching, analyzeHitting, analyzeCatching, analyzeFielding, analyzeMental, getCorrectiveDrills, getDrillsByTag, getDrillsByExpert, getDailyMindset, getPreGameAudio } from './analyze_mechanics';

import { analyzeVideo, getMentalContent, analyzeWindmillMechanics, analyzeSwingMechanics, analyzePopTime, analyzeFieldingMechanics } from './analysis_engine';
export { analyzeVideo, getMentalContent, analyzeWindmillMechanics, analyzeSwingMechanics, analyzePopTime, analyzeFieldingMechanics } from './analysis_engine';

export type {
  MechanicsAnalysisRequest,
  DrillRecommendation,
  MechanicsAnalysisResult,
  MentalContent,
  MentalAnalysisRequest,
  MentalAnalysisResult
} from './analyze_mechanics';

export {
  analyzeVideo,
  getMentalContent,
  analyzeWindmillMechanics,
  analyzeSwingMechanics,
  analyzePopTime,
  analyzeFieldingMechanics
} from './analysis_engine';

export type {
  VideoAnalysisRequest,
  AnalysisResult,
  DrillRecommendation as EngineDrillRecommendation,
  MentalContentRequest
} from './analysis_engine';

// Comprehensive knowledge bases
export {
  PITCHING_KNOWLEDGE,
  HITTING_KNOWLEDGE,
  CATCHING_KNOWLEDGE,
  INFIELD_KNOWLEDGE,
  OUTFIELD_KNOWLEDGE,
  BIOMECHANICS_FRAMEWORK,
  EXPERT_SOURCES
} from './softball_knowledge_base';

export {
  CHAMPIONSHIP_MINDSET,
  MOTIVATIONAL_QUOTES,
  SPORTS_PSYCHOLOGY,
  DAILY_MINDSET_THEMES,
  CONTEXTUAL_MENTAL_STRATEGIES
} from './mental_training_knowledge';

export {
  CROSSFIT_FOR_SOFTBALL,
  AGE_APPROPRIATE_TRAINING,
  SOFTBALL_TRAINING_PRIORITIES,
  INJURY_PREVENTION,
  PERIODIZATION
} from './strength_training_knowledge';

export {
  NFHS_RULES,
  PGF_RULES,
  USSSA_RULES,
  GSA_RULES,
  TITAN_RULES,
  METROBALL_RULES,
  INTERNATIONAL_TIEBREAKER,
  RULE_COMPARISONS,
  RULES_EDUCATION
} from './tournament_rules_knowledge';

export {
  PRACTICE_FRAMEWORK,
  STATION_PLANS,
  AGE_SPECIFIC_PLANS,
  SPECIALIZED_PRACTICES,
  SEASONAL_PLANNING,
  EFFICIENCY_TIPS,
  PRACTICE_TEMPLATES
} from './practice_planning_knowledge';

export {
  PITCHING_BIOMECHANICS,
  HITTING_BIOMECHANICS,
  CATCHING_BIOMECHANICS,
  FIELDING_BIOMECHANICS,
  MEDIAPIPE_ANALYSIS_POINTS,
  BIOMECHANICS_COACHING_CONTEXT
} from './biomechanics_analysis';

// Convenience access to full knowledge base
export const SoftballKnowledge = {
  pitching: () => import('./softball_knowledge_base').then(m => m.PITCHING_KNOWLEDGE),
  hitting: () => import('./softball_knowledge_base').then(m => m.HITTING_KNOWLEDGE),
  catching: () => import('./softball_knowledge_base').then(m => m.CATCHING_KNOWLEDGE),
  infield: () => import('./softball_knowledge_base').then(m => m.INFIELD_KNOWLEDGE),
  outfield: () => import('./softball_knowledge_base').then(m => m.OUTFIELD_KNOWLEDGE),
  biomechanics: () => import('./softball_knowledge_base').then(m => m.BIOMECHANICS_FRAMEWORK),
  experts: () => import('./softball_knowledge_base').then(m => m.EXPERT_SOURCES)
};

export const MentalTraining = {
  championship: () => import('./mental_training_knowledge').then(m => m.CHAMPIONSHIP_MINDSET),
  quotes: () => import('./mental_training_knowledge').then(m => m.MOTIVATIONAL_QUOTES),
  psychology: () => import('./mental_training_knowledge').then(m => m.SPORTS_PSYCHOLOGY),
  daily: () => import('./mental_training_knowledge').then(m => m.DAILY_MINDSET_THEMES),
  contextual: () => import('./mental_training_knowledge').then(m => m.CONTEXTUAL_MENTAL_STRATEGIES)
};

export const StrengthTraining = {
  crossfit: () => import('./strength_training_knowledge').then(m => m.CROSSFIT_FOR_SOFTBALL),
  ageAppropriate: () => import('./strength_training_knowledge').then(m => m.AGE_APPROPRIATE_TRAINING),
  priorities: () => import('./strength_training_knowledge').then(m => m.SOFTBALL_TRAINING_PRIORITIES),
  injury: () => import('./strength_training_knowledge').then(m => m.INJURY_PREVENTION),
  periodization: () => import('./strength_training_knowledge').then(m => m.PERIODIZATION)
};

export const TournamentRules = {
  nfhs: () => import('./tournament_rules_knowledge').then(m => m.NFHS_RULES),
  pgf: () => import('./tournament_rules_knowledge').then(m => m.PGF_RULES),
  usssa: () => import('./tournament_rules_knowledge').then(m => m.USSSA_RULES),
  gsa: () => import('./tournament_rules_knowledge').then(m => m.GSA_RULES),
  titan: () => import('./tournament_rules_knowledge').then(m => m.TITAN_RULES),
  itb: () => import('./tournament_rules_knowledge').then(m => m.INTERNATIONAL_TIEBREAKER),
  comparisons: () => import('./tournament_rules_knowledge').then(m => m.RULE_COMPARISONS),
  education: () => import('./tournament_rules_knowledge').then(m => m.RULES_EDUCATION)
};

export const PracticePlanning = {
  framework: () => import('./practice_planning_knowledge').then(m => m.PRACTICE_FRAMEWORK),
  stations: () => import('./practice_planning_knowledge').then(m => m.STATION_PLANS),
  ageSpecific: () => import('./practice_planning_knowledge').then(m => m.AGE_SPECIFIC_PLANS),
  specialized: () => import('./practice_planning_knowledge').then(m => m.SPECIALIZED_PRACTICES),
  seasonal: () => import('./practice_planning_knowledge').then(m => m.SEASONAL_PLANNING),
  efficiency: () => import('./practice_planning_knowledge').then(m => m.EFFICIENCY_TIPS),
  templates: () => import('./practice_planning_knowledge').then(m => m.PRACTICE_TEMPLATES)
};

/**
 * Helper function to get knowledge by topic
 */
export async function getKnowledge(topic: string) {
  const topicMap: Record<string, any> = {
    'pitching': SoftballKnowledge.pitching,
    'hitting': SoftballKnowledge.hitting,
    'catching': SoftballKnowledge.catching,
    'infield': SoftballKnowledge.infield,
    'outfield': SoftballKnowledge.outfield,
    'biomechanics': SoftballKnowledge.biomechanics,
    'experts': SoftballKnowledge.experts,
    'championship': MentalTraining.championship,
    'quotes': MentalTraining.quotes,
    'psychology': MentalTraining.psychology,
    'mental-daily': MentalTraining.daily,
    'mental-contextual': MentalTraining.contextual,
    'crossfit': StrengthTraining.crossfit,
    'strength-age': StrengthTraining.ageAppropriate,
    'strength-priorities': StrengthTraining.priorities,
    'injury-prevention': StrengthTraining.injury,
    'periodization': StrengthTraining.periodization,
    'rules-nfhs': TournamentRules.nfhs,
    'rules-pgf': TournamentRules.pgf,
    'rules-usssa': TournamentRules.usssa,
    'rules-gsa': TournamentRules.gsa,
    'rules-titan': TournamentRules.titan,
    'rules-itb': TournamentRules.itb,
    'rules-compare': TournamentRules.comparisons,
    'practice-framework': PracticePlanning.framework,
    'practice-stations': PracticePlanning.stations,
    'practice-age': PracticePlanning.ageSpecific,
    'practice-specialized': PracticePlanning.specialized,
    'practice-seasonal': PracticePlanning.seasonal
  };

  const loader = topicMap[topic.toLowerCase()];
  if (!loader) {
    throw new Error(`Unknown knowledge topic: ${topic}`);
  }

  return await loader();
}

/**
 * Helper to get motivational quote by category
 */
export async function getMotivationalQuote(category?: string) {
  const quotes = await MentalTraining.quotes();
  
  if (!category) {
    // Return random quote from all categories
    const allCategories = Object.keys(quotes);
    const randomCategory = allCategories[Math.floor(Math.random() * allCategories.length)];
    const categoryQuotes = quotes[randomCategory as keyof typeof quotes];
    return categoryQuotes[Math.floor(Math.random() * categoryQuotes.length)];
  }

  const categoryKey = category.toLowerCase().replace(/\s+/g, '') as keyof typeof quotes;
  if (categoryKey in quotes) {
    const categoryQuotes = quotes[categoryKey];
    return categoryQuotes[Math.floor(Math.random() * categoryQuotes.length)];
  }

  throw new Error(`Unknown quote category: ${category}`);
}

/**
 * Helper to get daily Championship Mindset content
 */
export async function getChampionshipDailyContent() {
  const championship = await MentalTraining.championship();
  const days = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'];
  const today = days[new Date().getDay()];
  
  const dailyThemes = await MentalTraining.daily();
  return {
    const kpKeys = Object.keys(championship.keyPrinciples) as Array<keyof typeof championship.keyPrinciples>;
    const kpKey = kpKeys[Math.floor(Math.random() * kpKeys.length)];
    championshipPrinciple: championship.keyPrinciples[kpKey],
    dailyTheme: dailyThemes[today as keyof typeof dailyThemes],
    randomApplication: championship.dailyApplications.morningMindset[Math.floor(Math.random() * championship.dailyApplications.morningMindset.length)]
  };
}

// Legacy alias for backward compatibility
export const getMambaDailyContent = getChampionshipDailyContent;

/**
 * Helper to get age-appropriate training guidance
 */
export async function getAgeAppropriateGuidance(age: number) {
  const strength = await StrengthTraining.ageAppropriate();
  
  if (age >= 8 && age <= 10) {
    return strength.ages8to10;
  } else if (age >= 11 && age <= 13) {
    return strength.ages11to13;
  } else if (age >= 14 && age <= 16) {
    return strength.ages14to16;
  }
  
  throw new Error('Age must be between 8 and 16');
}

/**
 * Helper to get tournament rules by organization
 */
export async function getTournamentRules(organization: string) {
  const org = organization.toUpperCase();
  
  switch (org) {
    case 'NFHS':
    case 'HIGH SCHOOL':
      return await TournamentRules.nfhs();
    case 'PGF':
      return await TournamentRules.pgf();
    case 'USSSA':
      return await TournamentRules.usssa();
    case 'GSA':
      return await TournamentRules.gsa();
    case 'TITAN':
      return await TournamentRules.titan();
    default:
      throw new Error(`Unknown tournament organization: ${organization}`);
  }
}

/**
 * Helper to generate practice plan by age and focus
 */
export async function generatePracticePlan(age: number, focus?: string) {
  const ageSpecific = await PracticePlanning.ageSpecific();
  const specialized = await PracticePlanning.specialized();
  
  let ageGroup: string;
  if (age >= 8 && age <= 10) {
    ageGroup = '8U-10U';
  } else if (age >= 11 && age <= 13) {
    ageGroup = '12U-14U';
  } else if (age >= 14 && age <= 16) {
    ageGroup = '16U-18U';
  } else {
    throw new Error('Age must be between 8 and 16');
  }
  
  const basePlan = ageSpecific[ageGroup as keyof typeof ageSpecific];
  
  if (focus) {
    const focusKey = focus.toLowerCase().replace(/\s+/g, '');
    if (focusKey.includes('defense')) {
      return { ...basePlan, specialized: specialized.defensiveFocus };
    } else if (focusKey.includes('offense') || focusKey.includes('hitting')) {
      return { ...basePlan, specialized: specialized.offensiveFocus };
    } else if (focusKey.includes('pitching') || focusKey.includes('catching')) {
      return { ...basePlan, specialized: specialized.pitchingCatchingClinic };
    }
  }
  
  return basePlan;
}

// Default export for convenience
export default {
  // Core engines
  analyzeMechanics,
  analyzePitching,
  analyzeHitting,
  analyzeCatching,
  analyzeFielding,
  analyzeMental,
  analyzeVideo,
  
  // Knowledge bases
  SoftballKnowledge,
  MentalTraining,
  StrengthTraining,
  TournamentRules,
  PracticePlanning,
  
  // Helper functions
  getKnowledge,
  getMotivationalQuote,
  getChampionshipDailyContent,
  getMambaDailyContent, // legacy alias
  getAgeAppropriateGuidance,
  getTournamentRules,
  generatePracticePlan
};
