## Brain Integration Guide
**How to Use the SoftballProAI Knowledge Base in Your Application**

---

## Quick Start

### 1. Import the Brain
```typescript
// Import specific knowledge bases
import { 
  PITCHING_KNOWLEDGE, 
  MAMBA_MENTALITY,
  getMotivationalQuote 
} from './server/brain';

// Or import everything
import * as Brain from './server/brain';
```

### 2. Analyze Player Video
```typescript
import { analyzeVideo } from './server/brain';

const result = await analyzeVideo({
  videoUrl: "https://storage.../video.mp4",
  skillType: "PITCHING",
  athleteId: 123,
  athleteLevel: "Intermediate"
});

// Result includes:
// - metrics (biomechanical data)
// - issuesDetected (array of problems found)
// - strengths (what player does well)
// - recommendedDrills (corrective exercises)
// - coachingNotes (AI-generated feedback)
```

### 3. Get Personalized Drills
```typescript
import { analyzeMechanics } from './server/brain';

const drills = await analyzeMechanics({
  skillType: "HITTING",
  detectedIssues: ["casting", "no hip rotation"],
  athleteLevel: "Intermediate",
  limit: 5
});

// Returns drills ranked by relevance with match reasons
```

### 4. Deliver Mental Content
```typescript
import { analyzeMental, getMotivationalQuote } from './server/brain';

// Get context-specific mental content
const mentalContent = await analyzeMental({
  context: "after-strikeout",
  limit: 3
});

// Get random motivational quote
const quote = await getMotivationalQuote("resilience");
console.log(quote.content); // "I've missed more than 9,000 shots..."
console.log(quote.author); // "Michael Jordan"
```

---

## Common Use Cases

### Use Case 1: Player Uploads Pitching Video

**Flow:**
1. Player uploads video → ObjectUploader → Replit Object Storage
2. Create assessment record in database
3. Trigger analysis:

```typescript
// In your route handler
import { analyzeVideo } from './server/brain';
import { PITCHING_KNOWLEDGE } from './server/brain';

// Analyze video
const analysis = await analyzeVideo({
  videoUrl: assessmentVideoUrl,
  skillType: "PITCHING",
  athleteId: player.id,
  athleteLevel: player.skillLevel
});

// Generate AI feedback using OpenAI with knowledge context
const prompt = `
You are an expert pitching coach. Analyze this pitcher's mechanics:

Metrics:
${JSON.stringify(analysis.metrics, null, 2)}

Issues Detected:
${analysis.issuesDetected.join(', ')}

Expert Knowledge Context:
${JSON.stringify(PITCHING_KNOWLEDGE.expertInsights, null, 2)}

Provide encouraging feedback with specific corrections.
Focus on ages 8-16. Be positive but actionable.
`;

const feedback = await openai.chat.completions.create({
  model: "gpt-4",
  messages: [{ role: "user", content: prompt }]
});

// Save feedback and recommended drills
await db.insert(assessmentFeedback).values({
  assessmentId: assessment.id,
  overallFeedback: feedback.choices[0].message.content,
  strengths: analysis.strengths,
  areasToImprove: analysis.issuesDetected,
  recommendedDrills: analysis.recommendedDrills.map(d => d.id)
});
```

### Use Case 2: Daily Mamba Feed (Player Dashboard)

```typescript
import { getMambaDailyContent } from './server/brain';

// Route: GET /api/player/daily-motivation
app.get('/api/player/daily-motivation', async (req, res) => {
  const content = await getMambaDailyContent();
  
  res.json({
    principle: content.mambaPrinciple.quote,
    lesson: content.mambaPrinciple.lesson,
    dailyTheme: content.dailyTheme.theme,
    motivation: content.dailyTheme.content[0],
    application: content.randomApplication
  });
});
```

**Frontend Display:**
```tsx
// In PlayerDashboard.tsx
const { data: dailyMotivation } = useQuery({
  queryKey: ['/api/player/daily-motivation'],
});

return (
  <Card className="mamba-feed">
    <h3>{dailyMotivation.dailyTheme}</h3>
    <blockquote>{dailyMotivation.principle}</blockquote>
    <p>{dailyMotivation.motivation}</p>
    <p className="application">{dailyMotivation.application}</p>
  </Card>
);
```

### Use Case 3: Injury Prevention Check-In

```typescript
import { AGE_APPROPRIATE_TRAINING } from './server/brain';

// Route: POST /api/player/check-in
app.post('/api/player/check-in', async (req, res) => {
  const { armSoreness, shoulderSoreness, athleteId } = req.body;
  
  const athlete = await db.query.athletes.findFirst({
    where: eq(athletes.id, athleteId)
  });
  
  // Check if soreness is high (7+ on 10 scale)
  const highSoreness = armSoreness >= 7 || shoulderSoreness >= 7;
  
  if (highSoreness) {
    // BLOCK pitching drills
    const blockedActivities = ['PITCHING', 'THROWING'];
    
    // Save check-in with blocks
    await db.insert(playerCheckins).values({
      athleteId,
      armSoreness,
      shoulderSoreness,
      blockedActivities,
      notes: 'High arm/shoulder soreness detected - pitching restricted'
    });
    
    // Get age-appropriate recovery guidance
    const guidance = await getAgeAppropriateGuidance(athlete.age);
    
    // Alert coach
    await db.insert(notifications).values({
      userId: athlete.coachId,
      type: 'injury_alert',
      title: `${athlete.name} - Arm Soreness Alert`,
      message: `High soreness reported. Pitching has been blocked.`,
      priority: 'high'
    });
    
    res.json({
      blocked: true,
      blockedActivities,
      message: 'Your arm needs rest. Pitching drills are blocked today.',
      recoveryGuidance: guidance.avoid,
      allowedActivities: ['Hitting (lower body focus)', 'Base running', 'Mental training']
    });
  }
});
```

### Use Case 4: Practice Architect (Team Coach)

```typescript
import { generatePracticePlan } from './server/brain';

// Route: POST /api/practice-plans/generate
app.post('/api/practice-plans/generate', async (req, res) => {
  const { teamId, focus, duration } = req.body;
  
  const team = await db.query.teams.findFirst({
    where: eq(teams.id, teamId),
    with: { athletes: true }
  });
  
  // Calculate average age
  const avgAge = team.athletes.reduce((sum, a) => sum + a.age, 0) / team.athletes.length;
  
  // Generate practice plan
  const plan = await generatePracticePlan(Math.round(avgAge), focus);
  
  // Save to database
  const practicePlan = await db.insert(practicePlans).values({
    teamId,
    title: `${focus || 'Standard'} Practice - ${new Date().toLocaleDateString()}`,
    duration,
    structure: plan,
    createdBy: req.user.id
  });
  
  res.json({
    plan,
    saved: true,
    id: practicePlan.id
  });
});
```

### Use Case 5: Tournament Rules Reference

```typescript
import { getTournamentRules } from './server/brain';

// Route: GET /api/tournament-rules/:org
app.get('/api/tournament-rules/:org', async (req, res) => {
  const { org } = req.params;
  
  try {
    const rules = await getTournamentRules(org);
    res.json(rules);
  } catch (error) {
    res.status(404).json({ 
      error: `Rules not found for organization: ${org}`,
      availableOrgs: ['NFHS', 'PGF', 'USSSA', 'GSA', 'TITAN']
    });
  }
});
```

**Frontend Display:**
```tsx
// In TournamentRulesPage.tsx
const { data: rules } = useQuery({
  queryKey: [`/api/tournament-rules/${selectedOrg}`],
});

return (
  <div className="rules-viewer">
    <h2>{selectedOrg} Rules</h2>
    <section>
      <h3>Game Format</h3>
      <p>Innings: {rules.gameFormat.innings}</p>
      <p>Time Limit: {rules.gameFormat.timeLimit}</p>
      <p>Run Rule: {rules.gameFormat.runRule}</p>
    </section>
    <section>
      <h3>Key Rule Changes 2026</h3>
      {Object.entries(rules.majorRuleChanges2026).map(([key, change]) => (
        <div key={key}>
          <h4>{change.rule}</h4>
          <p>{change.newRule || change.clarification}</p>
        </div>
      ))}
    </section>
  </div>
);
```

### Use Case 6: Strength Training Recommendations

```typescript
import { getAgeAppropriateGuidance, CROSSFIT_FOR_SOFTBALL } from './server/brain';

// Route: GET /api/athlete/:id/strength-plan
app.get('/api/athlete/:id/strength-plan', async (req, res) => {
  const athlete = await db.query.athletes.findFirst({
    where: eq(athletes.id, parseInt(req.params.id))
  });
  
  const guidance = await getAgeAppropriateGuidance(athlete.age);
  const exercises = CROSSFIT_FOR_SOFTBALL.keyExercises;
  
  // Filter exercises by age appropriateness
  const ageAppropriateExercises = {
    lowerBody: exercises.lowerBody.filter(ex => 
      ex.ageAppropriate.includes(`${Math.floor(athlete.age / 2) * 2}U+`)
    ),
    upperBody: exercises.upperBody.filter(ex => 
      ex.ageAppropriate.includes(`${Math.floor(athlete.age / 2) * 2}U+`)
    ),
    core: exercises.core.filter(ex => 
      ex.ageAppropriate.includes(`${Math.floor(athlete.age / 2) * 2}U+`)
    )
  };
  
  res.json({
    guidance,
    exercises: ageAppropriateExercises,
    workoutStructure: CROSSFIT_FOR_SOFTBALL.workoutStructures,
    injuryPrevention: guidance.avoid
  });
});
```

---

## Integrating with OpenAI for Enhanced Feedback

### Pattern: Knowledge-Augmented AI Feedback

```typescript
import { PITCHING_KNOWLEDGE, BIOMECHANICS_FRAMEWORK } from './server/brain';

async function generateEnhancedFeedback(assessment, detectedIssues) {
  // Pull relevant knowledge
  const expertInsights = PITCHING_KNOWLEDGE.expertInsights;
  const biomechanics = BIOMECHANICS_FRAMEWORK.videoAnalysisPoints.pitching;
  
  // Build context-rich prompt
  const prompt = `
You are an expert fastpitch softball pitching coach with knowledge from:
- Amanda Scarborough (Olympic player, ESPN analyst)
- Monica Abbott (77 mph record holder)
- Cat Osterman (Olympic medalist)
- Denny Dunn (Biomechanics Lab)

PLAYER CONTEXT:
- Age: ${assessment.athlete.age}
- Skill Level: ${assessment.athlete.skillLevel}
- Primary Focus: Windmill pitching mechanics

BIOMECHANICAL ANALYSIS:
${JSON.stringify(assessment.metrics, null, 2)}

ISSUES DETECTED:
${detectedIssues.join('\n- ')}

EXPERT PHILOSOPHY:
${expertInsights.amandaScarborough.philosophy}

KEY BIOMECHANICAL POINTS:
${biomechanics.join('\n- ')}

ASSIGNMENT:
Provide encouraging, age-appropriate feedback (ages 8-16) that:
1. Acknowledges strengths first
2. Explains WHY each issue matters (connect to performance)
3. Provides 2-3 specific corrective focuses
4. Encourages continued improvement with positive language
5. References expert insights where relevant

Remember: This is for a youth athlete. Be encouraging, not discouraging.
`;

  const response = await openai.chat.completions.create({
    model: "gpt-4",
    messages: [
      {
        role: "system",
        content: "You are a supportive, expert softball coach specializing in youth development (ages 8-16). You prioritize encouragement, safety, and long-term skill building."
      },
      { role: "user", content: prompt }
    ],
    temperature: 0.7
  });
  
  return response.choices[0].message.content;
}
```

---

## Connecting to Frontend Components

### PoseAnalyzer Integration

The `PoseAnalyzer` component extracts real-time metrics using MediaPipe. Connect it to the Brain:

```typescript
// In PoseAnalyzer.tsx
const handleAnalysisComplete = async (extractedMetrics) => {
  // Send metrics to Brain for analysis
  const response = await fetch(`/api/assessments/${assessmentId}/analyze`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      metrics: extractedMetrics,
      skillType: 'PITCHING'
    })
  });
  
  const analysis = await response.json();
  setFeedback(analysis.coachingNotes);
  setRecommendedDrills(analysis.recommendedDrills);
};
```

### TrainBrain Interface for Continuous Learning

The `/train-brain` page allows coaches to add new drills to expand the knowledge base:

```typescript
// Route: POST /api/admin/drills
app.post('/api/admin/drills', async (req, res) => {
  const { name, category, description, mechanicTags, issueAddressed, videoUrl } = req.body;
  
  const drill = await db.insert(drills).values({
    name,
    category,
    skillType: category.toLowerCase(),
    description,
    mechanicTags,
    issueAddressed,
    videoUrl,
    difficulty: req.body.difficulty || 'Intermediate',
    expertSource: req.body.expertSource,
    equipment: req.body.equipment || [],
    ageRange: req.body.ageRange || '10U-18U'
  });
  
  res.json({ success: true, drillId: drill.id });
});
```

---

## Best Practices

### 1. Cache Knowledge Base Queries
Knowledge bases are static and can be cached:

```typescript
import { LRUCache } from 'lru-cache';

const knowledgeCache = new LRUCache({
  max: 50,
  ttl: 1000 * 60 * 60 // 1 hour
});

export async function getCachedKnowledge(topic: string) {
  const cached = knowledgeCache.get(topic);
  if (cached) return cached;
  
  const knowledge = await getKnowledge(topic);
  knowledgeCache.set(topic, knowledge);
  return knowledge;
}
```

### 2. Progressive Enhancement
Start with basic analysis, add advanced features incrementally:

```typescript
// Phase 1: Basic drill recommendations
const drills = await analyzeMechanics({ skillType, detectedIssues });

// Phase 2: Add AI feedback
const feedback = await generateEnhancedFeedback(assessment, detectedIssues);

// Phase 3: Add mental content
const mentalContent = await analyzeMental({ context: 'post-analysis' });

// Phase 4: Add strength training recommendations
const strengthPlan = await getAgeAppropriateGuidance(athlete.age);
```

### 3. Personalization Layers

Build context progressively:

```typescript
interface PlayerContext {
  age: number;
  position: string;
  skillLevel: 'Beginner' | 'Intermediate' | 'Advanced';
  injuryHistory: string[];
  recentSoreness: any;
  goals: string[];
  coachingMode: 'solo' | 'coached';
}

async function getPersonalizedRecommendations(context: PlayerContext) {
  // Layer 1: Age-appropriate content
  const ageGuidance = await getAgeAppropriateGuidance(context.age);
  
  // Layer 2: Position-specific knowledge
  const positionKnowledge = await getKnowledge(context.position.toLowerCase());
  
  // Layer 3: Injury-aware recommendations
  if (context.recentSoreness?.armSoreness >= 7) {
    return {
      ...ageGuidance,
      blockedActivities: ['PITCHING', 'THROWING'],
      alternatives: ['Hitting (lower body focus)', 'Mental training', 'Base running']
    };
  }
  
  // Layer 4: Goal-aligned content
  const goalDrills = await analyzeMechanics({
    skillType: context.position === 'Pitcher' ? 'PITCHING' : 'FIELDING',
    detectedIssues: context.goals
  });
  
  return {
    guidance: ageGuidance,
    knowledge: positionKnowledge,
    drills: goalDrills.recommendations
  };
}
```

### 4. Error Handling with Fallbacks

```typescript
async function getSafeMotivationalContent() {
  try {
    const quote = await getMotivationalQuote();
    return quote;
  } catch (error) {
    console.error('Failed to get motivational quote:', error);
    // Fallback to default Mamba quote
    return {
      quote: "Hard work outweighs talent—every time.",
      author: "Kobe Bryant",
      category: "Work Ethic",
      context: "daily motivation"
    };
  }
}
```

---

## Seeding the Database

Run the seed scripts to populate your database:

```bash
# Seed drill knowledge base
npx tsx scripts/seed_drills.ts

# Seed holistic skills (hitting, catching)
npx tsx scripts/seed_holistic.ts

# Seed mental edge content (NEW!)
npx tsx scripts/seed_mental_edge.ts
```

---

## Testing Integration

```typescript
import { describe, it, expect } from 'vitest';
import { getMotivationalQuote, analyzeMechanics } from './server/brain';

describe('Brain Integration', () => {
  it('should return motivational quote', async () => {
    const quote = await getMotivationalQuote('resilience');
    expect(quote).toHaveProperty('quote');
    expect(quote).toHaveProperty('author');
    expect(quote.category).toBe('Resilience');
  });
  
  it('should analyze pitching mechanics', async () => {
    const result = await analyzeMechanics({
      skillType: 'PITCHING',
      detectedIssues: ['hunched forward', 'weak leg drive'],
      athleteLevel: 'Intermediate'
    });
    
    expect(result.recommendations).toHaveLength(3);
    expect(result.analyzedIssues).toContain('hunched forward');
  });
});
```

---

## Future Enhancements

### 1. Real-time Biomechanics
Connect MediaPipe directly to analysis engine:

```typescript
// Coming soon: Real-time pose analysis
const metrics = await extractBiometricsFromVideo(videoFile);
const analysis = await analyzeVideo({ videoUrl, skillType, ...metrics });
```

### 2. Pro Model Comparisons
Split-screen analysis with elite athletes:

```typescript
// Coming soon: Compare player to pro model
const comparison = await compareToProModel({
  playerVideo: assessment.videoUrl,
  proModel: 'monica-abbott-rise-ball',
  metrics: ['arm-slot', 'hip-shoulder-separation', 'release-point']
});
```

### 3. Voice-Activated Coaching
Audio feedback during practice:

```typescript
// Coming soon: Audio coaching
const audioFeedback = await generateAudioCoaching({
  analysis: result,
  voice: 'encouraging-female-coach'
});
```

---

## Support & Questions

For questions about integrating the Brain knowledge base:
1. Check the README.md in `server/brain/`
2. Review knowledge base TypeScript files for available exports
3. Test with seed data using the seed scripts
4. Reference this integration guide for common patterns

**Remember:** The Brain is designed to continuously learn. Encourage coaches to add new drills and mental content through the TrainBrain interface!

---

*"You have to work hard in the dark to shine in the light."* - Kobe Bryant
