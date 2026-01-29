# 🧠 SoftballProAI Brain - Quick Reference Guide

## File Structure
```
server/brain/
├── README.md                          # Complete overview
├── INTEGRATION_GUIDE.md               # How to use in your code
├── QUICK_REFERENCE.md                 # This file
│
├── index.ts                           # Master export (import from here!)
├── analyze_mechanics.ts               # Core analysis engine
├── analysis_engine.ts                 # Video routing & processing
│
├── softball_knowledge_base.ts         # 🥎 All positions & skills
├── mental_training_knowledge.ts       # 💪 Mamba Mentality & psychology
├── strength_training_knowledge.ts     # 🏋️ CrossFit & conditioning
├── tournament_rules_knowledge.ts      # 📜 NFHS, PGF, USSSA, GSA, Titan
├── practice_planning_knowledge.ts     # 📋 Practice structures
└── biomechanics_analysis.ts          # 🔬 Deep biomechanical analysis
```

---

## 🚀 Quick Start Examples

### Get Motivational Quote
```typescript
import { getMotivationalQuote } from './server/brain';

const quote = await getMotivationalQuote('resilience');
// { quote: "I've missed 9,000 shots...", author: "Michael Jordan", ... }
```

### Analyze Video
```typescript
import { analyzeVideo } from './server/brain';

const result = await analyzeVideo({
  videoUrl: "https://...",
  skillType: "PITCHING",
  athleteLevel: "Intermediate"
});
// { metrics, issuesDetected, strengths, recommendedDrills, coachingNotes }
```

### Generate Practice Plan
```typescript
import { generatePracticePlan } from './server/brain';

const plan = await generatePracticePlan(12, "defensive focus");
// Complete 2-hour practice plan for 12-year-olds
```

### Get Tournament Rules
```typescript
import { getTournamentRules } from './server/brain';

const rules = await getTournamentRules('PGF');
// { gameFormat, tournamentProcedures, conductRules, ... }
```

### Get Age-Appropriate Training
```typescript
import { getAgeAppropriateGuidance } from './server/brain';

const guidance = await getAgeAppropriateGuidance(14);
// { focus, appropriate, avoid, volume, emphasis }
```

---

## 📚 Knowledge Base Quick Reference

### Softball Knowledge (`softball_knowledge_base.ts`)
```typescript
import { 
  PITCHING_KNOWLEDGE,
  HITTING_KNOWLEDGE,
  CATCHING_KNOWLEDGE,
  INFIELD_KNOWLEDGE,
  OUTFIELD_KNOWLEDGE,
  BIOMECHANICS_FRAMEWORK,
  EXPERT_SOURCES 
} from './server/brain';

// Example: Get velocity benchmarks
const velocityByAge = PITCHING_KNOWLEDGE.velocityGeneration.benchmarks;
// { "10U": "42-50 mph", "12U": "42-50 mph", ... }

// Example: Get expert insight
const scarbrough = EXPERT_SOURCES.pitchingExperts.find(e => 
  e.name === 'Amanda Scarborough'
);
```

### Mental Training (`mental_training_knowledge.ts`)
```typescript
import { 
  MAMBA_MENTALITY,
  MOTIVATIONAL_QUOTES,
  SPORTS_PSYCHOLOGY,
  DAILY_MINDSET_THEMES,
  CONTEXTUAL_MENTAL_STRATEGIES 
} from './server/brain';

// Example: Get Mamba principle
const workEthic = MAMBA_MENTALITY.keyPrinciples.workEthic;
// { quote: "Hard work outweighs talent...", lesson: "...", application: "..." }

// Example: Get resilience quotes
const resilienceQuotes = MOTIVATIONAL_QUOTES.resilience;
// Array of quotes from MJ, Ali, etc.

// Example: Get daily theme
const mondayTheme = DAILY_MINDSET_THEMES.monday;
// { theme: "Start Strong", content: [...] }
```

### Strength Training (`strength_training_knowledge.ts`)
```typescript
import { 
  CROSSFIT_FOR_SOFTBALL,
  AGE_APPROPRIATE_TRAINING,
  SOFTBALL_TRAINING_PRIORITIES,
  INJURY_PREVENTION,
  PERIODIZATION 
} from './server/brain';

// Example: Get exercises
const lowerBodyExercises = CROSSFIT_FOR_SOFTBALL.keyExercises.lowerBody;
// [{ name, purpose, softballApplication, technique, ageAppropriate }, ...]

// Example: Get age guidance
const ages14to16 = AGE_APPROPRIATE_TRAINING.ages14to16;
// { focus, appropriate, guidelines, volume, emphasis }

// Example: Get injury prevention
const shoulderCare = INJURY_PREVENTION.shoulderCareProgram;
// { frequency, preThrow: [...], postThrow: [...] }
```

### Tournament Rules (`tournament_rules_knowledge.ts`)
```typescript
import { 
  NFHS_RULES,
  PGF_RULES,
  USSSA_RULES,
  GSA_RULES,
  TITAN_RULES,
  INTERNATIONAL_TIEBREAKER,
  RULE_COMPARISONS 
} from './server/brain';

// Example: Get NFHS changes
const changes2026 = NFHS_RULES.majorRuleChanges2026;
// { pitchingDelivery, electronicDevices, uniforms, ... }

// Example: Get PGF format
const pgfPoolPlay = PGF_RULES.gameFormat.poolPlay;
// { time, runRule, ties, lineups, courtesyRunners }

// Example: Compare rules
const subRules = RULE_COMPARISONS.substitutions;
// { NFHS: "...", PGF_Pool: "...", PGF_Bracket: "...", USSSA: "..." }
```

### Practice Planning (`practice_planning_knowledge.ts`)
```typescript
import { 
  PRACTICE_FRAMEWORK,
  STATION_PLANS,
  AGE_SPECIFIC_PLANS,
  SPECIALIZED_PRACTICES,
  SEASONAL_PLANNING,
  EFFICIENCY_TIPS,
  PRACTICE_TEMPLATES 
} from './server/brain';

// Example: Get 4-station plan
const fourStations = STATION_PLANS.fourStationRotation;
// { description, totalTime, station1_Hitting, station2_Infield, ... }

// Example: Get age-specific plan
const plan12U = AGE_SPECIFIC_PLANS["12U-14U"];
// { focus, intensity, samplePractice, coachingTips }

// Example: Get defensive practice
const defensivePractice = SPECIALIZED_PRACTICES.defensiveFocus;
// { duration, emphasis, plan, situations }
```

### Advanced Biomechanics (`biomechanics_analysis.ts`)
```typescript
import { 
  PITCHING_BIOMECHANICS,
  HITTING_BIOMECHANICS,
  CATCHING_BIOMECHANICS,
  FIELDING_BIOMECHANICS,
  MEDIAPIPE_ANALYSIS_POINTS,
  BIOMECHANICS_COACHING_CONTEXT 
} from './server/brain';

// Example: Get kinetic chain sequence
const sequence = PITCHING_BIOMECHANICS.kineticChainSequence;
// { description, optimalSequence: [phase1, phase2, ...] }

// Example: Get velocity contributors
const contributors = PITCHING_BIOMECHANICS.velocityGeneration.contributors;
// [{ source: "Lower Body", contribution: "35-45%", ... }, ...]

// Example: Get MediaPipe points
const pitchingPoints = MEDIAPIPE_ANALYSIS_POINTS.pitching;
// { keyLandmarks: [...], calculatedMetrics: { hipShoulderSeparation, ... } }

// Example: Get coaching template
const promptTemplate = BIOMECHANICS_COACHING_CONTEXT.promptTemplate;
// Use for OpenAI prompts with biomechanical context
```

---

## 🔧 Common Integration Patterns

### Pattern 1: Player Video Analysis
```typescript
// 1. Upload video
const videoUrl = await uploadToObjectStorage(file);

// 2. Create assessment
const assessment = await db.insert(assessments).values({
  athleteId: player.id,
  videoUrl,
  skillType: 'PITCHING',
  status: 'analyzing'
});

// 3. Extract MediaPipe metrics
const poseData = await extractPoseFromVideo(videoUrl);
const metrics = calculateBiomechanics(poseData);

// 4. Analyze with Brain
const analysis = await analyzeVideo({
  videoUrl,
  skillType: 'PITCHING',
  athleteLevel: player.skillLevel
});

// 5. Generate AI feedback with context
import { PITCHING_BIOMECHANICS, BIOMECHANICS_COACHING_CONTEXT } from './server/brain';

const prompt = BIOMECHANICS_COACHING_CONTEXT.promptTemplate
  .replace('{metrics}', JSON.stringify(metrics))
  .replace('{age}', player.age);

const feedback = await openai.chat.completions.create({
  model: "gpt-4",
  messages: [{ role: "user", content: prompt }]
});

// 6. Save feedback and drills
await db.insert(assessmentFeedback).values({
  assessmentId: assessment.id,
  overallFeedback: feedback.choices[0].message.content,
  recommendedDrills: analysis.recommendedDrills.map(d => d.id)
});
```

### Pattern 2: Daily Player Dashboard
```typescript
// Route: GET /api/player/dashboard
import { getMambaDailyContent, getMotivationalQuote } from './server/brain';

app.get('/api/player/dashboard', async (req, res) => {
  const player = req.user;
  
  // Get daily motivation
  const mambaContent = await getMambaDailyContent();
  const randomQuote = await getMotivationalQuote();
  
  // Check recent check-in for injury alerts
  const latestCheckIn = await db.query.playerCheckins.findFirst({
    where: eq(playerCheckins.athleteId, player.id),
    orderBy: desc(playerCheckins.createdAt)
  });
  
  const blocked = latestCheckIn?.blockedActivities || [];
  
  res.json({
    welcome: `Good morning, ${player.name}!`,
    mambaQuote: mambaContent.mambaPrinciple.quote,
    dailyTheme: mambaContent.dailyTheme,
    motivationalQuote: randomQuote,
    blockedActivities: blocked,
    injuryAlert: blocked.length > 0
  });
});
```

### Pattern 3: Coach Practice Generator
```typescript
// Route: POST /api/practice-plans/generate
import { generatePracticePlan } from './server/brain';

app.post('/api/practice-plans/generate', async (req, res) => {
  const { teamId, focus, duration } = req.body;
  
  const team = await db.query.teams.findFirst({
    where: eq(teams.id, teamId),
    with: { athletes: true }
  });
  
  // Calculate average age
  const avgAge = Math.round(
    team.athletes.reduce((sum, a) => sum + a.age, 0) / team.athletes.length
  );
  
  // Generate plan
  const plan = await generatePracticePlan(avgAge, focus);
  
  // Save to database
  await db.insert(practicePlans).values({
    teamId,
    title: `${focus || 'Standard'} Practice`,
    duration,
    structure: plan,
    createdBy: req.user.id
  });
  
  res.json({ plan });
});
```

### Pattern 4: Injury Prevention Check-In
```typescript
// Route: POST /api/player/check-in
import { AGE_APPROPRIATE_TRAINING } from './server/brain';

app.post('/api/player/check-in', async (req, res) => {
  const { athleteId, armSoreness, shoulderSoreness } = req.body;
  
  const athlete = await db.query.athletes.findFirst({
    where: eq(athletes.id, athleteId)
  });
  
  // Check for high soreness
  const highSoreness = armSoreness >= 7 || shoulderSoreness >= 7;
  
  if (highSoreness) {
    // BLOCK risky activities
    const blockedActivities = ['PITCHING', 'THROWING'];
    
    // Save check-in
    await db.insert(playerCheckins).values({
      athleteId,
      armSoreness,
      shoulderSoreness,
      blockedActivities
    });
    
    // Get age-appropriate guidance
    const guidance = await getAgeAppropriateGuidance(athlete.age);
    
    // Alert coach
    await db.insert(notifications).values({
      userId: athlete.coachId,
      type: 'injury_alert',
      title: `${athlete.name} - High Arm Soreness`,
      message: 'Pitching activities have been blocked.',
      priority: 'high'
    });
    
    res.json({
      blocked: true,
      message: 'Your arm needs rest. Pitching drills blocked today.',
      allowedActivities: ['Hitting', 'Base running', 'Mental training'],
      recoveryGuidance: guidance.avoid
    });
  }
});
```

---

## 📊 Key Benchmarks Quick Reference

### Pitching Velocity by Age
| Age | Average | Advanced | Elite |
|-----|---------|----------|-------|
| 10U | 38-44 mph | 45-50 mph | 51-55 mph |
| 12U | 45-52 mph | 53-58 mph | 59-63 mph |
| 14U | 52-58 mph | 59-63 mph | 64-67 mph |
| 16U | 56-62 mph | 63-66 mph | 67-70 mph |
| 18U | 58-64 mph | 65-68 mph | 69-72 mph |
| College | 62-67 mph | 68-71 mph | 72-77 mph |

### Exit Velocity by Age
| Age | Range |
|-----|-------|
| 10U-12U | 45-55 mph |
| 14U | 55-65 mph |
| 16U-18U | 65-75 mph |
| College | 75-85 mph |

### Pop Time by Age
| Age | Range |
|-----|-------|
| 12U | 2.5-3.0s |
| 14U | 2.3-2.6s |
| 16U-18U | 2.0-2.3s |
| College | 1.9-2.1s |
| Elite | 1.8-2.0s |

### Pitch Counts by Age
| Age | Max/Game | Max/Week |
|-----|----------|----------|
| 10U | 50-60 | 100 |
| 12U | 60-75 | 125 |
| 14U | 75-90 | 150 |
| 16U+ | 90-110 | 175 |

---

## 🎯 Most Common Use Cases

### 1. Get Daily Motivation
```typescript
import { getMambaDailyContent } from './server/brain';
const content = await getMambaDailyContent();
```

### 2. Analyze Pitching Video
```typescript
import { analyzeVideo } from './server/brain';
const analysis = await analyzeVideo({ videoUrl, skillType: "PITCHING" });
```

### 3. Get Corrective Drills
```typescript
import { analyzeMechanics } from './server/brain';
const drills = await analyzeMechanics({ 
  skillType: "HITTING", 
  detectedIssues: ["casting", "no hip rotation"] 
});
```

### 4. Generate Practice Plan
```typescript
import { generatePracticePlan } from './server/brain';
const plan = await generatePracticePlan(12, "defensive focus");
```

### 5. Get Tournament Rules
```typescript
import { getTournamentRules } from './server/brain';
const rules = await getTournamentRules('NFHS');
```

### 6. Get Mental Content for Context
```typescript
import { analyzeMental } from './server/brain';
const mental = await analyzeMental({ context: "after-strikeout" });
```

### 7. Get Age-Appropriate Training
```typescript
import { getAgeAppropriateGuidance } from './server/brain';
const guidance = await getAgeAppropriateGuidance(14);
```

### 8. Check Biomechanical Benchmarks
```typescript
import { PITCHING_BIOMECHANICS } from './server/brain';
const velocityData = PITCHING_BIOMECHANICS.velocityByAge["14U"];
```

---

## 💡 Pro Tips

1. **Cache Knowledge Queries**: Knowledge bases are static, cache them
2. **Batch Tool Calls**: Get related data in parallel
3. **Use Context**: Always include age, position, skill level for personalized results
4. **Safety First**: Check injury status before recommending activities
5. **Encourage, Don't Discourage**: Frame feedback positively for youth athletes

---

## 🆘 Need Help?

- **Full Documentation**: See `README.md`
- **Integration Examples**: See `INTEGRATION_GUIDE.md`
- **Implementation Summary**: See `BRAIN_IMPLEMENTATION_SUMMARY.md`
- **Code Location**: `server/brain/`

---

*"Hard work outweighs talent—every time."* - Kobe Bryant, Mamba Mentality
