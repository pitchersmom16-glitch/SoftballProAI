/**
 * SoftballProAI Expert System Seed Script
 * 
 * Dynamic Knowledge Base for continuous AI learning
 * Categories: PITCHING, CATCHING, INFIELD, OUTFIELD, CONDITIONING, MENTAL
 * Focus: Full Academy Coverage with Biomechanical Physics
 */

import { db } from "../server/db";
import { drills, mentalEdge } from "../shared/schema";
import { sql } from "drizzle-orm";

// Valid categories for the Academy
export const DRILL_CATEGORIES = [
  "PITCHING",
  "CATCHING", 
  "INFIELD",
  "OUTFIELD",
  "CONDITIONING",
  "MENTAL"
] as const;

export type DrillCategory = typeof DRILL_CATEGORIES[number];

interface DrillSeed {
  name: string;
  category: DrillCategory;
  skillType: string;
  difficulty: "Beginner" | "Intermediate" | "Advanced";
  description: string;
  videoUrl: string;
  equipment: string[];
  ageRange: string;
  expertSource: string;
  mechanicTags: string[];
  issueAddressed: string;
}

interface MentalEdgeSeed {
  title: string;
  contentType: "quote" | "video" | "principle" | "visualization";
  category: "Pre-Game" | "Recovery" | "Focus" | "Confidence" | "Resilience";
  source: string;
  content: string;
  videoUrl?: string;
  tags: string[];
  usageContext: string;
}

// ============================================================================
// PITCHING DRILLS - Internal Rotation & Windmill Biomechanics
// ============================================================================
const PITCHING_DRILLS: DrillSeed[] = [
  {
    name: "Internal Rotation Isolation Drill",
    category: "PITCHING",
    skillType: "pitching",
    difficulty: "Intermediate",
    description: "The shoulder's internal rotation is THE source of velocity. Start with arm at 90 degrees, elbow at shoulder height. Rotate forearm forward explosively while keeping elbow stationary. This isolates the internal rotators that generate 40-60% of pitch velocity.",
    videoUrl: "https://www.youtube.com/watch?v=internal-rotation-pitching",
    equipment: ["Resistance band", "Mirror"],
    ageRange: "12U-College",
    expertSource: "Dr. James Andrews Biomechanics",
    mechanicTags: ["Internal Rotation", "Subscapularis", "Velocity Generation", "Shoulder Mechanics"],
    issueAddressed: "Low velocity, arm-dominant pitching without shoulder rotation"
  },
  {
    name: "Hip-Shoulder Separation Windmill",
    category: "PITCHING",
    skillType: "pitching",
    difficulty: "Advanced",
    description: "The windmill delivery creates power through hip-shoulder separation. Hips must fire first, creating 40-50 degrees of separation between pelvis and trunk. This stretch-shortening cycle loads the core like a rubber band.",
    videoUrl: "https://www.youtube.com/watch?v=hip-shoulder-separation",
    equipment: ["Pitching rubber", "Video camera"],
    ageRange: "14U-College",
    expertSource: "Denny Dunn Pitching Lab",
    mechanicTags: ["Hip-Shoulder Separation", "Kinetic Chain", "Stretch-Shortening Cycle", "Core Transfer"],
    issueAddressed: "Open too early, hips and shoulders rotating together, power leak"
  },
  {
    name: "Drag Foot Proprioception Drill",
    category: "PITCHING",
    skillType: "pitching",
    difficulty: "Intermediate",
    description: "The drag foot isn't passive - it's an active stabilizer. The posterior chain maintains ground contact while the hip drives forward. Feel the drag foot pulling through the dirt, not lifting.",
    videoUrl: "https://www.youtube.com/watch?v=drag-foot-technique",
    equipment: ["Pitching lane", "Tape"],
    ageRange: "10U-College",
    expertSource: "Amanda Scarborough Elite Mechanics",
    mechanicTags: ["Drag Foot", "Proprioception", "Posterior Chain", "Pelvis Stability"],
    issueAddressed: "Drag foot lifting, balance loss, hip rotation leak"
  },
  {
    name: "Rise Ball Backspin Mechanics",
    category: "PITCHING",
    skillType: "pitching",
    difficulty: "Advanced",
    description: "True rise ball requires 1400+ RPM backspin with 12-6 axis. The Magnus effect creates upward force opposing gravity. Focus on aggressive wrist supination through release.",
    videoUrl: "https://www.youtube.com/watch?v=rise-ball-physics",
    equipment: ["Rapsodo or spin tracker", "Softballs"],
    ageRange: "14U-College",
    expertSource: "Pitch Design Physics",
    mechanicTags: ["Rise Ball", "Backspin", "Magnus Effect", "Wrist Supination", "Spin Rate"],
    issueAddressed: "Rise ball flat, no movement, wrong spin axis"
  },
  {
    name: "Drop Ball Topspin Generation",
    category: "PITCHING",
    skillType: "pitching",
    difficulty: "Advanced",
    description: "The drop ball uses topspin creating downward Magnus force. At release, fingers pull DOWN and THROUGH the ball, staying on top. 1200+ RPM creates sharp late break.",
    videoUrl: "https://www.youtube.com/watch?v=drop-ball-topspin",
    equipment: ["Rapsodo or spin tracker", "Softballs"],
    ageRange: "14U-College",
    expertSource: "Pitch Physics Lab",
    mechanicTags: ["Drop Ball", "Topspin", "Forward Spin", "Late Break", "Fingers On Top"],
    issueAddressed: "Drop ball hanging, no sharp break, spinning sideways"
  }
];

// ============================================================================
// CATCHING DRILLS - Framing, Blocking, Pop Time
// ============================================================================
const CATCHING_DRILLS: DrillSeed[] = [
  {
    name: "Framing with Quiet Hands",
    category: "CATCHING",
    skillType: "catching",
    difficulty: "Intermediate",
    description: "Elite framers receive the ball with soft, quiet hands that absorb impact and subtly guide the ball into the zone. Practice catching with minimal glove movement - stick the pitch where you receive it.",
    videoUrl: "https://www.youtube.com/watch?v=framing-technique",
    equipment: ["Catcher's mitt", "Softballs", "Net or pitcher"],
    ageRange: "10U-College",
    expertSource: "Catching Science",
    mechanicTags: ["Framing", "Quiet Hands", "Pitch Presentation", "Strike Zone"],
    issueAddressed: "Stabbing at ball, dropping glove, losing strikes"
  },
  {
    name: "Blocking Reaction Drill",
    category: "CATCHING",
    skillType: "catching",
    difficulty: "Intermediate",
    description: "Blocking is about getting your body in front of the ball, not catching it. Drop to knees, drive chest forward, tuck chin, create a wall. The ball hits your chest protector and stays in front.",
    videoUrl: "https://www.youtube.com/watch?v=blocking-drill",
    equipment: ["Catcher's gear", "Softballs or blocking balls"],
    ageRange: "10U-College",
    expertSource: "Blocking Fundamentals",
    mechanicTags: ["Blocking", "Body Position", "Reaction Time", "Ball in Front"],
    issueAddressed: "Ball getting past, slow reaction, not getting body down"
  },
  {
    name: "Pop Time Explosiveness Training",
    category: "CATCHING",
    skillType: "catching",
    difficulty: "Advanced",
    description: "Pop time = receive + exchange + throw. Elite catchers are under 1.8 seconds. Focus on catching in throwing position, quick exchange, and powerful throw from crouch.",
    videoUrl: "https://www.youtube.com/watch?v=pop-time-training",
    equipment: ["Catcher's gear", "Stopwatch", "Target at second base"],
    ageRange: "12U-College",
    expertSource: "Pop Time Optimization",
    mechanicTags: ["Pop Time", "Quick Exchange", "Throwing Footwork", "Arm Strength"],
    issueAddressed: "Slow pop time, poor exchange, weak arm"
  },
  {
    name: "Throw-Down Footwork Drill",
    category: "CATCHING",
    skillType: "catching",
    difficulty: "Intermediate",
    description: "Quick footwork is essential for throw-downs. Practice the jab step with right foot, clearing hips, and driving toward second base. Feet must work before arm.",
    videoUrl: "https://www.youtube.com/watch?v=throwdown-footwork",
    equipment: ["Catcher's gear", "Stopwatch"],
    ageRange: "10U-College",
    expertSource: "Catching Mechanics Pro",
    mechanicTags: ["Throw-Down", "Footwork", "Hip Clearance", "Quick Feet"],
    issueAddressed: "Slow throw-downs, no footwork, arm-only throws"
  },
  {
    name: "One-Knee Receiving Stance",
    category: "CATCHING",
    skillType: "catching",
    difficulty: "Beginner",
    description: "The one-knee stance improves low pitch framing and reduces strain. Right knee down, left foot forward. Glove presented as relaxed target.",
    videoUrl: "https://www.youtube.com/watch?v=one-knee-catching",
    equipment: ["Catcher's gear"],
    ageRange: "10U-College",
    expertSource: "Modern Catching Mechanics",
    mechanicTags: ["One-Knee Stance", "Receiving Position", "Low Pitch Setup"],
    issueAddressed: "Uncomfortable receiving, missing low pitches"
  }
];

// ============================================================================
// INFIELD DRILLS - Glove Work, Backhands, Double Plays
// ============================================================================
const INFIELD_DRILLS: DrillSeed[] = [
  {
    name: "Forehand/Backhand Reaction Drill",
    category: "INFIELD",
    skillType: "infield",
    difficulty: "Intermediate",
    description: "Quick lateral movement is essential. Practice reading the ball off the bat and taking proper angle. Backhand requires glove-side drop step, forehand requires crossing over. React, don't guess.",
    videoUrl: "https://www.youtube.com/watch?v=backhand-forehand-drill",
    equipment: ["Glove", "Softballs", "Fungo bat"],
    ageRange: "10U-College",
    expertSource: "Infield Fundamentals Pro",
    mechanicTags: ["Backhand", "Forehand", "Lateral Movement", "First Step"],
    issueAddressed: "Slow first step, wrong angle, bobbling backhands"
  },
  {
    name: "Double Play Feed Mechanics",
    category: "INFIELD",
    skillType: "infield",
    difficulty: "Advanced",
    description: "The feed is more important than the arm strength. Shortstop: underhand or backhand feed chest-high. Second base: flip or sidearm. Practice quick exchange and accurate chest-high tosses.",
    videoUrl: "https://www.youtube.com/watch?v=double-play-feeds",
    equipment: ["Glove", "Softballs", "Partner"],
    ageRange: "12U-College",
    expertSource: "Middle Infield Mastery",
    mechanicTags: ["Double Play", "Feed", "Quick Exchange", "Underhand Toss"],
    issueAddressed: "Inaccurate feeds, slow exchange, throwing too hard"
  },
  {
    name: "Short Hop Collection Drill",
    category: "INFIELD",
    skillType: "infield",
    difficulty: "Intermediate",
    description: "Short hops require soft hands and staying low. Get your glove out front, let the ball come up into the glove. Practice catching short hops at various speeds. Stay down through the ball.",
    videoUrl: "https://www.youtube.com/watch?v=short-hop-drill",
    equipment: ["Glove", "Softballs", "Wall or partner"],
    ageRange: "10U-College",
    expertSource: "Glove Work Academy",
    mechanicTags: ["Short Hop", "Soft Hands", "Stay Low", "Ball Collection"],
    issueAddressed: "Bobbling short hops, coming up too early"
  },
  {
    name: "Slow Roller Charge Drill",
    category: "INFIELD",
    skillType: "infield",
    difficulty: "Intermediate",
    description: "Slow rollers require aggressive charge with proper footwork. Approach at angle, field outside right foot, crow hop and throw. Barehand only when absolutely necessary.",
    videoUrl: "https://www.youtube.com/watch?v=slow-roller-charge",
    equipment: ["Glove", "Softballs", "Fungo bat"],
    ageRange: "10U-College",
    expertSource: "Third Base Specialist",
    mechanicTags: ["Slow Roller", "Charge", "Barehand", "Quick Release"],
    issueAddressed: "Waiting on slow rollers, rushed throws"
  },
  {
    name: "Ready Position & First Step",
    category: "INFIELD",
    skillType: "infield",
    difficulty: "Beginner",
    description: "The ready position sets up everything. Feet shoulder-width, weight on balls of feet, glove out front, eyes on pitcher's release. First step is a read step - react to the ball.",
    videoUrl: "https://www.youtube.com/watch?v=ready-position-infield",
    equipment: ["Glove", "Softballs"],
    ageRange: "8U-College",
    expertSource: "Infield Fundamentals",
    mechanicTags: ["Ready Position", "First Step", "Athletic Stance", "Ball Read"],
    issueAddressed: "Flat-footed, slow reaction, caught off guard"
  }
];

// ============================================================================
// OUTFIELD DRILLS - Drop Steps, Crow Hops, Tracking
// ============================================================================
const OUTFIELD_DRILLS: DrillSeed[] = [
  {
    name: "Drop Step Reaction Drill",
    category: "OUTFIELD",
    skillType: "outfield",
    difficulty: "Intermediate",
    description: "The drop step is the outfielder's first move on fly balls. Open hips to the ball side, push off opposite foot, run on an angle. Never backpedal - turn and run. Practice reacting to verbal or visual cues.",
    videoUrl: "https://www.youtube.com/watch?v=drop-step-drill",
    equipment: ["Glove", "Softballs", "Open field"],
    ageRange: "10U-College",
    expertSource: "Outfield Mastery",
    mechanicTags: ["Drop Step", "First Step", "Hip Turn", "Route Running"],
    issueAddressed: "Backpedaling, slow first step, bad angles"
  },
  {
    name: "Crow Hop Power Throwing",
    category: "OUTFIELD",
    skillType: "outfield",
    difficulty: "Intermediate",
    description: "The crow hop transfers ground force into the throw. Push off back leg explosively, hop and land on back leg, then drive forward into throw. This adds 5-10 mph to outfield throws.",
    videoUrl: "https://www.youtube.com/watch?v=crow-hop-throw",
    equipment: ["Softballs", "Field space"],
    ageRange: "10U-College",
    expertSource: "Outfield Throwing Mechanics",
    mechanicTags: ["Crow Hop", "Ground Force", "Momentum", "Outfield Arm"],
    issueAddressed: "Flat-footed throws, weak outfield arm"
  },
  {
    name: "Fly Ball Tracking & Communication",
    category: "OUTFIELD",
    skillType: "outfield",
    difficulty: "Beginner",
    description: "Track the ball from the bat to glove. Call early, call loud, call often. Center fielder has priority. Practice reading ball off bat and taking direct routes, not arcs.",
    videoUrl: "https://www.youtube.com/watch?v=tracking-fly-balls",
    equipment: ["Glove", "Softballs", "Fungo bat"],
    ageRange: "8U-College",
    expertSource: "Outfield Fundamentals",
    mechanicTags: ["Tracking", "Communication", "Route Running", "Priority"],
    issueAddressed: "Misreading balls, collisions, dropping fly balls"
  },
  {
    name: "Gap-to-Gap Range Drill",
    category: "OUTFIELD",
    skillType: "outfield",
    difficulty: "Advanced",
    description: "Covering the gaps requires reading the ball immediately and taking efficient angles. Practice going gap-to-gap with full extension catches. Work on diving technique safely.",
    videoUrl: "https://www.youtube.com/watch?v=gap-coverage-drill",
    equipment: ["Glove", "Softballs", "Open field"],
    ageRange: "12U-College",
    expertSource: "Elite Outfield Training",
    mechanicTags: ["Range", "Diving", "Full Extension", "Gap Coverage"],
    issueAddressed: "Limited range, afraid to dive, poor angles"
  },
  {
    name: "Fence Awareness Drill",
    category: "OUTFIELD",
    skillType: "outfield",
    difficulty: "Intermediate",
    description: "Know where the fence is at all times. Practice tracking balls to the warning track, feeling the dirt/grass change, and making catches at the wall safely.",
    videoUrl: "https://www.youtube.com/watch?v=fence-awareness",
    equipment: ["Glove", "Softballs", "Outfield fence"],
    ageRange: "10U-College",
    expertSource: "Outfield Safety Training",
    mechanicTags: ["Fence Awareness", "Warning Track", "Safety", "Wall Play"],
    issueAddressed: "Running into fence, afraid of wall, misjudging depth"
  }
];

// ============================================================================
// CONDITIONING DRILLS - CrossFit Style, Explosive, Agility
// ============================================================================
const CONDITIONING_DRILLS: DrillSeed[] = [
  {
    name: "Box Jump Explosiveness",
    category: "CONDITIONING",
    skillType: "conditioning",
    difficulty: "Intermediate",
    description: "Explosive lower body power for hitting and throwing. Start with 12-18 inch box, progress higher. Focus on full hip extension and soft landing. 3 sets of 8-10 reps.",
    videoUrl: "https://www.youtube.com/watch?v=box-jump-training",
    equipment: ["Plyo box", "Flat surface"],
    ageRange: "12U-College",
    expertSource: "CrossFit Softball",
    mechanicTags: ["Explosiveness", "Lower Body Power", "Hip Extension", "Plyometrics"],
    issueAddressed: "Slow bat speed, weak leg drive, no explosiveness"
  },
  {
    name: "Agility Ladder Speed Work",
    category: "CONDITIONING",
    skillType: "conditioning",
    difficulty: "Beginner",
    description: "Quick feet are essential for all positions. Practice in-in-out-out, lateral shuffles, and crossover patterns. Focus on light, quick touches - not speed at first, then build up.",
    videoUrl: "https://www.youtube.com/watch?v=agility-ladder-softball",
    equipment: ["Agility ladder", "Flat surface"],
    ageRange: "8U-College",
    expertSource: "Speed & Agility Academy",
    mechanicTags: ["Footwork", "Agility", "Quick Feet", "Coordination"],
    issueAddressed: "Slow feet, clumsy movements, poor coordination"
  },
  {
    name: "Medicine Ball Rotational Throws",
    category: "CONDITIONING",
    skillType: "conditioning",
    difficulty: "Intermediate",
    description: "Core rotation power for hitting and throwing. Stand perpendicular to wall, rotate hips explosively, throw med ball into wall. This builds the rotational power chain. 3 sets of 10 each side.",
    videoUrl: "https://www.youtube.com/watch?v=med-ball-rotation",
    equipment: ["Medicine ball (4-8 lbs)", "Wall"],
    ageRange: "10U-College",
    expertSource: "Rotational Power Training",
    mechanicTags: ["Core Rotation", "Hip Power", "Medicine Ball", "Power Transfer"],
    issueAddressed: "Weak rotation, no hip involvement, arm-only swing"
  },
  {
    name: "Burpee Broad Jump Combo",
    category: "CONDITIONING",
    skillType: "conditioning",
    difficulty: "Advanced",
    description: "Full-body explosive conditioning. Burpee into broad jump for distance. This builds total body power and cardiovascular endurance. Great for game-readiness. 3 sets of 6-8 reps.",
    videoUrl: "https://www.youtube.com/watch?v=burpee-broad-jump",
    equipment: ["Open space"],
    ageRange: "12U-College",
    expertSource: "CrossFit Athlete Training",
    mechanicTags: ["Full Body", "Explosiveness", "Conditioning", "Endurance"],
    issueAddressed: "Poor conditioning, gassing out late in games"
  },
  {
    name: "Lateral Shuffle Cone Drill",
    category: "CONDITIONING",
    skillType: "conditioning",
    difficulty: "Beginner",
    description: "Lateral movement is critical for infielders and catchers. Set cones 10-15 feet apart. Shuffle, touch cone, shuffle back. Stay low, don't cross feet. Time yourself for improvement.",
    videoUrl: "https://www.youtube.com/watch?v=lateral-shuffle-drill",
    equipment: ["Cones", "Flat surface"],
    ageRange: "8U-College",
    expertSource: "Agility Training Pro",
    mechanicTags: ["Lateral Movement", "Shuffle", "Stay Low", "Change of Direction"],
    issueAddressed: "Slow lateral movement, crossing feet, upright shuffle"
  }
];

// ============================================================================
// MENTAL DRILLS - General & Pitcher-Specific
// ============================================================================
const MENTAL_DRILLS: DrillSeed[] = [
  // GENERAL MENTAL
  {
    name: "Pre-Game Visualization Routine",
    category: "MENTAL",
    skillType: "mental",
    difficulty: "Beginner",
    description: "5-10 minutes before games, close eyes and visualize success. See yourself making great plays, getting hits, striking out batters. Engage all senses - feel the ball, hear the crowd. This primes your nervous system for performance.",
    videoUrl: "https://www.youtube.com/watch?v=visualization-athletes",
    equipment: ["Quiet space", "Headphones optional"],
    ageRange: "10U-College",
    expertSource: "Sports Psychology Institute",
    mechanicTags: ["Visualization", "Pre-Game", "Mental Prep", "Focus"],
    issueAddressed: "Nerves before games, not mentally ready, scattered focus"
  },
  {
    name: "Breath Work Reset Technique",
    category: "MENTAL",
    skillType: "mental",
    difficulty: "Beginner",
    description: "When stress hits, use 4-7-8 breathing: Inhale 4 seconds, hold 7 seconds, exhale 8 seconds. This activates the parasympathetic nervous system and calms the body. Use between pitches, at-bats, or after errors.",
    videoUrl: "https://www.youtube.com/watch?v=478-breathing-athletes",
    equipment: ["None"],
    ageRange: "8U-College",
    expertSource: "Performance Psychology",
    mechanicTags: ["Breath Work", "Stress Reset", "Calm Down", "Focus Recovery"],
    issueAddressed: "Anxiety, racing heart, can't calm down after mistake"
  },
  // PITCHER-SPECIFIC MENTAL
  {
    name: "The 0-2 Count Domination Mindset",
    category: "MENTAL",
    skillType: "mental",
    difficulty: "Intermediate",
    description: "At 0-2, YOU are in control. This is where elite pitchers finish batters. The mental script: 'I earned this. One more strike. Expand the zone.' Visualize the out before you throw. Attack with your best pitch - don't nibble.",
    videoUrl: "https://www.youtube.com/watch?v=02-count-mindset",
    equipment: ["None"],
    ageRange: "12U-College",
    expertSource: "Pitching Mental Game",
    mechanicTags: ["Pitcher Mindset", "Count Leverage", "Aggression", "Finish Hitters"],
    issueAddressed: "Can't finish hitters, nibbling 0-2, giving free passes"
  },
  {
    name: "Flush The Previous Pitch",
    category: "MENTAL",
    skillType: "mental",
    difficulty: "Beginner",
    description: "The last pitch is GONE. Whether it was a bomb or a strikeout, it doesn't exist anymore. Physical ritual: wipe the rubber with your foot, take a breath, focus on catcher's mitt. Each pitch is independent. Stay present.",
    videoUrl: "https://www.youtube.com/watch?v=flush-it-pitching",
    equipment: ["None"],
    ageRange: "10U-College",
    expertSource: "Pitching Psychology",
    mechanicTags: ["Pitcher Mindset", "Present Moment", "Reset", "Emotional Control"],
    issueAddressed: "Dwelling on mistakes, snowballing after bad pitch, frustration"
  },
  {
    name: "Mamba Mentality Game Focus",
    category: "MENTAL",
    skillType: "mental",
    difficulty: "Advanced",
    description: "Channel Kobe's obsessive focus. Before the game, decide: 'I will be the hardest worker on this field today. I will out-compete everyone.' Block out everything except the task at hand. No fear, no excuses, only relentless effort.",
    videoUrl: "https://www.youtube.com/watch?v=mamba-mentality-sports",
    equipment: ["None"],
    ageRange: "12U-College",
    expertSource: "Kobe Bryant Mamba Mentality",
    mechanicTags: ["Mamba Mentality", "Focus", "Work Ethic", "Competitive Drive"],
    issueAddressed: "Lacking intensity, going through motions, not competing"
  }
];

// ============================================================================
// MENTAL EDGE CONTENT - Quotes, Principles, Visualization
// ============================================================================
const MENTAL_EDGE_CONTENT: MentalEdgeSeed[] = [
  // Kobe Bryant Mamba Mentality Principles
  {
    title: "The Job's Not Finished",
    contentType: "quote",
    category: "Focus",
    source: "Kobe Bryant",
    content: "Job's not finished. Job finished? I don't think so.",
    tags: ["Mamba Mentality", "Persistence", "Championship Mindset"],
    usageContext: "When team is ahead and might get complacent"
  },
  {
    title: "Rest at the End",
    contentType: "principle",
    category: "Resilience",
    source: "Kobe Bryant",
    content: "Rest at the end, not in the middle. You give everything you have for the duration of the task. That's Mamba Mentality.",
    tags: ["Mamba Mentality", "Work Ethic", "No Shortcuts"],
    usageContext: "During tough practices or when tired"
  },
  {
    title: "Obsession is Natural",
    contentType: "principle",
    category: "Focus",
    source: "Kobe Bryant",
    content: "I don't want to be the next Michael Jordan, I only want to be Kobe Bryant. Your obsession with being the best version of YOU is not weird - it's necessary.",
    tags: ["Mamba Mentality", "Identity", "Self-Improvement"],
    usageContext: "When comparing yourself to others"
  },
  {
    title: "Learn from Everyone",
    contentType: "principle",
    category: "Confidence",
    source: "Kobe Bryant",
    content: "I studied every great player - not to copy them, but to steal something useful from each one. Magic's vision. Jordan's footwork. Hakeem's post moves. Be a student of the game.",
    tags: ["Mamba Mentality", "Learning", "Game Study"],
    usageContext: "During film study or learning new skills"
  },
  // Visualization and Focus
  {
    title: "See It Before You Do It",
    contentType: "visualization",
    category: "Pre-Game",
    source: "Sports Psychology Research",
    content: "Elite athletes visualize success 10-15 minutes before competition. Close your eyes. See the pitch coming. Feel your swing. Hear the crack of the bat. Smell the dirt. The brain doesn't fully distinguish between vivid visualization and reality.",
    tags: ["Visualization", "Mental Rehearsal", "Pre-Game Routine"],
    usageContext: "Before at-bats or before taking the circle"
  },
  {
    title: "The Next Pitch Mentality",
    contentType: "principle",
    category: "Resilience",
    source: "Elite Softball Coaching",
    content: "Errors happen. Strikeouts happen. What separates good from great is the ability to flush it. The only pitch that matters is the NEXT one. Physical reset: touch the dirt, take a breath, lock eyes on target. Mental reset: 'That's done. What's next?'",
    tags: ["Reset", "Present Moment", "Error Recovery"],
    usageContext: "After making an error or striking out"
  },
  // Motivational
  {
    title: "Hard Work Beats Talent",
    contentType: "quote",
    category: "Confidence",
    source: "Tim Notke / Kevin Durant",
    content: "Hard work beats talent when talent doesn't work hard. Your opponent might be more talented, but they can't outwork you unless you let them.",
    tags: ["Work Ethic", "Effort", "Outworking Competition"],
    usageContext: "Before facing a tough opponent"
  },
  {
    title: "Pressure is a Privilege",
    contentType: "quote",
    category: "Pre-Game",
    source: "Billie Jean King",
    content: "Pressure is a privilege. It means you're in a position to make an impact. Embrace it. Champions don't shrink from big moments - they grow into them.",
    tags: ["Pressure", "Big Moments", "Clutch Performance"],
    usageContext: "Before championship games or high-pressure situations"
  },
  {
    title: "Fear as Fuel",
    contentType: "principle",
    category: "Resilience",
    source: "Michael Jordan",
    content: "Fear is an illusion. The only thing real is this moment. Use your fear as fuel. Feel the butterflies? Good. That means you care. Now go compete.",
    tags: ["Fear", "Nerves", "Competition"],
    usageContext: "When feeling nervous or scared"
  },
  {
    title: "Process Over Outcome",
    contentType: "principle",
    category: "Focus",
    source: "Nick Saban Process",
    content: "Don't think about the scoreboard. Don't think about the championship. Think about THIS pitch. THIS at-bat. THIS play. Win the moment. Stack enough moments and you'll win the game.",
    tags: ["Process", "Present Moment", "Focus"],
    usageContext: "During games when overthinking outcome"
  }
];

// ============================================================================
// SEEDING FUNCTION
// ============================================================================
async function seedDrills() {
  console.log("🧹 Clearing existing drills and mental edge content...");
  
  await db.execute(sql`TRUNCATE TABLE drills RESTART IDENTITY CASCADE`);
  await db.execute(sql`TRUNCATE TABLE mental_edge RESTART IDENTITY CASCADE`);

  console.log("🌱 Seeding drills across all categories...");

  const allDrills = [
    ...PITCHING_DRILLS,
    ...CATCHING_DRILLS,
    ...INFIELD_DRILLS,
    ...OUTFIELD_DRILLS,
    ...CONDITIONING_DRILLS,
    ...MENTAL_DRILLS
  ];

  for (const drill of allDrills) {
    await db.insert(drills).values({
      name: drill.name,
      category: drill.category,
      skillType: drill.skillType,
      difficulty: drill.difficulty,
      description: drill.description,
      videoUrl: drill.videoUrl,
      equipment: drill.equipment,
      ageRange: drill.ageRange,
      expertSource: drill.expertSource,
      mechanicTags: drill.mechanicTags,
      issueAddressed: drill.issueAddressed
    });
  }

  console.log(`✅ Seeded ${allDrills.length} drills`);
  console.log(`   - PITCHING: ${PITCHING_DRILLS.length}`);
  console.log(`   - CATCHING: ${CATCHING_DRILLS.length}`);
  console.log(`   - INFIELD: ${INFIELD_DRILLS.length}`);
  console.log(`   - OUTFIELD: ${OUTFIELD_DRILLS.length}`);
  console.log(`   - CONDITIONING: ${CONDITIONING_DRILLS.length}`);
  console.log(`   - MENTAL: ${MENTAL_DRILLS.length}`);

  console.log("\n🧠 Seeding Mental Edge content...");

  for (const content of MENTAL_EDGE_CONTENT) {
    await db.insert(mentalEdge).values({
      title: content.title,
      contentType: content.contentType,
      category: content.category,
      source: content.source,
      content: content.content,
      videoUrl: content.videoUrl || null,
      tags: content.tags,
      usageContext: content.usageContext
    });
  }

  console.log(`✅ Seeded ${MENTAL_EDGE_CONTENT.length} Mental Edge items`);
  console.log("\n🎉 Seeding complete!");
}

// Run if executed directly
seedDrills()
  .then(() => process.exit(0))
  .catch((err) => {
    console.error("Seeding failed:", err);
    process.exit(1);
  });
