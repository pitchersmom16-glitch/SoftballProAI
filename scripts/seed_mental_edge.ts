/**
 * MENTAL EDGE SEED SCRIPT
 * Populates database with Mamba Mentality, motivational quotes,
 * and sports psychology content for championship mindset development
 * 
 * Run: npx tsx scripts/seed_mental_edge.ts
 */

import { db } from "../server/db";
import { mentalEdge } from "../shared/schema";
import { sql } from "drizzle-orm";

interface MentalEdgeSeed {
  title: string;
  contentType: "quote" | "video" | "principle" | "visualization";
  category: "Pre-Game" | "Recovery" | "Focus" | "Confidence" | "Resilience" | "Work-Ethic" | "Teamwork" | "Mamba-Mentality";
  source: string;
  content: string;
  videoUrl?: string;
  tags: string[];
  usageContext: string;
}

const MENTAL_EDGE_CONTENT: MentalEdgeSeed[] = [
  // ============================================================================
  // MAMBA MENTALITY - Kobe Bryant
  // ============================================================================
  {
    title: "The Mamba Mentality Definition",
    contentType: "principle",
    category: "Mamba-Mentality",
    source: "Kobe Bryant",
    content: "Constantly striving to be the best version of yourself. It's a constant quest to be better today than you were yesterday. Focus on the process, not just the outcome.",
    tags: ["mamba", "excellence", "process", "improvement"],
    usageContext: "daily-mindset, pre-game, motivation"
  },
  {
    title: "Sacrifice for Greatness",
    contentType: "quote",
    category: "Mamba-Mentality",
    source: "Kobe Bryant",
    content: "A lot of people say they want to be great, but they're not willing to make the sacrifices necessary to achieve greatness.",
    tags: ["sacrifice", "commitment", "greatness", "dedication"],
    usageContext: "daily-mindset, when facing difficulty, motivation"
  },
  {
    title: "Obsession with Your Craft",
    contentType: "quote",
    category: "Mamba-Mentality",
    source: "Kobe Bryant",
    content: "If you really want to be great at something you have to truly care about it. If you want to be great in a particular area, you have to obsess over it.",
    tags: ["obsession", "passion", "dedication", "greatness"],
    usageContext: "daily-mindset, practice, motivation"
  },
  {
    title: "Hard Work Beats Talent",
    contentType: "quote",
    category: "Mamba-Mentality",
    source: "Kobe Bryant",
    content: "Hard work outweighs talent—every time. You have to work hard in the dark to shine in the light.",
    tags: ["hard-work", "effort", "work-ethic", "dedication"],
    usageContext: "daily-mindset, practice, facing talented opponents"
  },
  {
    title: "Internal Motivation",
    contentType: "quote",
    category: "Mamba-Mentality",
    source: "Kobe Bryant",
    content: "I never tried to prove anything to someone else. I wanted to prove something to myself.",
    tags: ["self-motivation", "internal-drive", "personal-standards"],
    usageContext: "daily-mindset, pre-game, confidence"
  },

  // ============================================================================
  // WORK ETHIC & DEDICATION
  // ============================================================================
  {
    title: "Outwork Everyone",
    contentType: "quote",
    category: "Work-Ethic",
    source: "Derek Jeter",
    content: "There may be people that have more talent than you, but there's no excuse for anyone to work harder than you do.",
    tags: ["work-ethic", "effort", "dedication", "no-excuses"],
    usageContext: "daily-mindset, practice, facing challenges"
  },
  {
    title: "Suffer Now, Champion Forever",
    contentType: "quote",
    category: "Work-Ethic",
    source: "Muhammad Ali",
    content: "I hated every minute of training, but I said, 'Don't quit. Suffer now and live the rest of your life as a champion.'",
    tags: ["perseverance", "training", "discipline", "champion-mindset"],
    usageContext: "practice, difficult-training, pushing-through"
  },
  {
    title: "Discipline Over Regret",
    contentType: "quote",
    category: "Work-Ethic",
    source: "Sarah Bombell",
    content: "The pain of discipline is far less than the pain of regret.",
    tags: ["discipline", "commitment", "no-regrets", "dedication"],
    usageContext: "daily-mindset, when-tempted-to-skip, motivation"
  },
  {
    title: "Talent Requires Hard Work",
    contentType: "quote",
    category: "Work-Ethic",
    source: "Michael Jordan",
    content: "Everybody has talent, but ability takes hard work.",
    tags: ["talent", "hard-work", "development", "growth"],
    usageContext: "daily-mindset, practice, long-term-development"
  },

  // ============================================================================
  // RESILIENCE & OVERCOMING FAILURE
  // ============================================================================
  {
    title: "Failure Leads to Success",
    contentType: "quote",
    category: "Resilience",
    source: "Michael Jordan",
    content: "I've missed more than 9,000 shots in my career. I've lost almost 300 games...I've failed over and over and over again in my life. And that is why I succeed.",
    tags: ["failure", "resilience", "perseverance", "success-through-failure"],
    usageContext: "after-strikeout, after-error, post-loss, bounce-back"
  },
  {
    title: "Get Back Up",
    contentType: "quote",
    category: "Resilience",
    source: "Vince Lombardi",
    content: "It's not whether you get knocked down; it's whether you get up.",
    tags: ["resilience", "bounce-back", "perseverance", "toughness"],
    usageContext: "after-setback, after-error, post-loss"
  },
  {
    title: "Grateful for Losses",
    contentType: "quote",
    category: "Resilience",
    source: "Muhammad Ali",
    content: "I am grateful for all my victories, but I am especially grateful for my losses, because they only made me work harder.",
    tags: ["learning", "growth", "losses", "motivation"],
    usageContext: "post-loss, reflection, learning"
  },
  {
    title: "Can't Accept Not Trying",
    contentType: "quote",
    category: "Resilience",
    source: "Michael Jordan",
    content: "I can accept failure, everyone fails at something. But I can't accept not trying.",
    tags: ["effort", "trying", "no-regrets", "courage"],
    usageContext: "pre-game, encouraging-aggression, facing-fear"
  },
  {
    title: "Climb the Wall",
    contentType: "quote",
    category: "Resilience",
    source: "Michael Jordan",
    content: "Obstacles don't have to stop you. If you run into a wall, don't turn around and give up. Figure out how to climb it, go through it, or work around it.",
    tags: ["problem-solving", "obstacles", "perseverance", "creativity"],
    usageContext: "facing-challenges, overcoming-obstacles, adversity"
  },

  // ============================================================================
  // CONFIDENCE & SELF-BELIEF
  // ============================================================================
  {
    title: "Only You Can Stop You",
    contentType: "quote",
    category: "Confidence",
    source: "Anonymous",
    content: "The only person who can stop you is you.",
    tags: ["self-belief", "confidence", "mental-barriers", "empowerment"],
    usageContext: "pre-game, overcoming-doubt, confidence-building"
  },
  {
    title: "Pressure is a Privilege",
    contentType: "quote",
    category: "Confidence",
    source: "Billie Jean King",
    content: "Pressure is a privilege - it only comes to those who earn it.",
    tags: ["pressure", "privilege", "high-stakes", "confidence"],
    usageContext: "pre-game, pressure-situations, championship-games"
  },
  {
    title: "Take the Shot",
    contentType: "quote",
    category: "Confidence",
    source: "Wayne Gretzky",
    content: "You miss 100% of the shots you don't take.",
    tags: ["confidence", "aggression", "taking-chances", "courage"],
    usageContext: "pre-at-bat, encouraging-aggression, risk-taking"
  },
  {
    title: "Champions Come from Within",
    contentType: "quote",
    category: "Confidence",
    source: "Muhammad Ali",
    content: "Champions aren't made in gyms. Champions are made from something they have deep inside them—a desire, a dream, a vision.",
    tags: ["inner-drive", "vision", "purpose", "champion-mindset"],
    usageContext: "daily-mindset, motivation, finding-purpose"
  },

  // ============================================================================
  // TEAMWORK & LEADERSHIP
  // ============================================================================
  {
    title: "Teamwork Wins Championships",
    contentType: "quote",
    category: "Teamwork",
    source: "Michael Jordan",
    content: "Talent wins games, but teamwork and intelligence win championships.",
    tags: ["teamwork", "collaboration", "championships", "team-success"],
    usageContext: "pre-game, team-meeting, building-culture"
  },
  {
    title: "Team Effort Creates Success",
    contentType: "quote",
    category: "Teamwork",
    source: "Vince Lombardi",
    content: "Individual commitment to a group effort—that is what makes a team work.",
    tags: ["commitment", "team-effort", "unity", "collaboration"],
    usageContext: "team-meeting, building-culture, group-motivation"
  },
  {
    title: "Strength in Unity",
    contentType: "quote",
    category: "Teamwork",
    source: "Phil Jackson",
    content: "The strength of the team is each individual member. The strength of each member is the team.",
    tags: ["unity", "mutual-support", "team-strength", "interdependence"],
    usageContext: "pre-game, team-huddle, building-unity"
  },

  // ============================================================================
  // EXCELLENCE & DETERMINATION
  // ============================================================================
  {
    title: "Determination Makes the Impossible Possible",
    contentType: "quote",
    category: "Confidence",
    source: "Tommy Lasorda",
    content: "The difference between the impossible and the possible lies in a person's determination.",
    tags: ["determination", "persistence", "possibility", "willpower"],
    usageContext: "daily-mindset, setting-goals, facing-challenges"
  },
  {
    title: "Success is No Accident",
    contentType: "quote",
    category: "Work-Ethic",
    source: "Pelé",
    content: "Success is no accident. It is hard work, perseverance, learning, studying, sacrifice and most of all, love of what you are doing.",
    tags: ["success", "hard-work", "perseverance", "passion"],
    usageContext: "daily-mindset, long-term-development, motivation"
  },

  // ============================================================================
  // PRE-GAME VISUALIZATION
  // ============================================================================
  {
    title: "Pre-Game Visualization Practice",
    contentType: "visualization",
    category: "Pre-Game",
    source: "Sports Psychology Research",
    content: "Close your eyes. See yourself succeeding. Visualize perfect mechanics leading to successful outcomes. Feel the confidence building. You are prepared. You are ready. Trust your training.",
    tags: ["visualization", "mental-prep", "confidence", "imagery"],
    usageContext: "pre-game, warmup, locker-room"
  },
  {
    title: "Championship Breathing Exercise",
    contentType: "visualization",
    category: "Pre-Game",
    source: "Sports Psychology",
    content: "Take a deep breath in for 4 counts. Hold for 2. Exhale for 6 counts. Feel your nerves transform into excitement. Your body is preparing for excellence. You've practiced for this moment.",
    tags: ["breathing", "nerves", "calm", "preparation"],
    usageContext: "pre-game, nervous, manage-anxiety"
  },

  // ============================================================================
  // RECOVERY & REFLECTION
  // ============================================================================
  {
    title: "Learn and Move Forward",
    contentType: "principle",
    category: "Recovery",
    source: "Championship Mindset Coaching",
    content: "Review what happened, learn the lessons, then move forward. You have 24 hours to think about this game, then it's time to focus on the next opportunity.",
    tags: ["recovery", "learning", "moving-forward", "resilience"],
    usageContext: "post-loss, post-game, reflection"
  },
  {
    title: "Rest is Part of Training",
    contentType: "principle",
    category: "Recovery",
    source: "Athletic Performance Science",
    content: "Your body grows stronger during rest, not just during training. Sleep 8-9 hours. Hydrate. Eat well. Recover mentally. You'll come back stronger.",
    tags: ["recovery", "rest", "sleep", "self-care"],
    usageContext: "rest-day, recovery, off-day"
  },

  // ============================================================================
  // DAILY MOTIVATION BY DAY
  // ============================================================================
  {
    title: "Monday: Start Strong",
    contentType: "quote",
    category: "Mamba-Mentality",
    source: "Kobe Bryant Philosophy",
    content: "This week is a fresh start. Make every rep count. Champions are made on Monday mornings when no one is watching. Your competition is sleeping. Get to work.",
    tags: ["monday", "fresh-start", "week-start", "early-work"],
    usageContext: "daily-mindset, monday-morning"
  },
  {
    title: "Tuesday: Trust the Process",
    contentType: "principle",
    category: "Focus",
    source: "Championship Mindset",
    content: "Focus on what you can control: effort, attitude, preparation. Trust the process. Results will follow. Get 1% better today than you were yesterday.",
    tags: ["tuesday", "process", "control", "improvement"],
    usageContext: "daily-mindset, tuesday-motivation"
  },
  {
    title: "Wednesday: Mid-Week Grind",
    contentType: "quote",
    category: "Work-Ethic",
    source: "Championship Culture",
    content: "When everyone else gets tired, that's when you separate yourself. The pain of discipline is far less than the pain of regret. Champions show up every day, not just game day.",
    tags: ["wednesday", "grind", "consistency", "separation"],
    usageContext: "daily-mindset, wednesday-motivation"
  },
  {
    title: "Thursday: Finish Strong",
    contentType: "principle",
    category: "Work-Ethic",
    source: "Championship Mindset",
    content: "How you finish the week shows your character. Don't coast into the weekend - finish what you started. Make today your best practice of the week.",
    tags: ["thursday", "finish-strong", "character", "excellence"],
    usageContext: "daily-mindset, thursday-motivation"
  },
  {
    title: "Friday: Game Day Ready",
    contentType: "quote",
    category: "Pre-Game",
    source: "Athletic Performance",
    content: "You've prepared all week for this moment. Trust your training. Play with confidence and aggression. Pressure is a privilege. Embrace it.",
    tags: ["friday", "game-day", "preparation", "confidence"],
    usageContext: "daily-mindset, friday-motivation, pre-game"
  },
  {
    title: "Saturday: Tournament Mentality",
    contentType: "principle",
    category: "Pre-Game",
    source: "Competitive Mindset",
    content: "Every game is an opportunity to prove yourself. Play your game. Don't let opponents dictate your approach. Stay in the moment. Next pitch, next play.",
    tags: ["saturday", "tournament", "competition", "focus"],
    usageContext: "daily-mindset, saturday-motivation, game-day"
  },
  {
    title: "Sunday: Recover and Reflect",
    contentType: "principle",
    category: "Recovery",
    source: "Performance Psychology",
    content: "Rest is part of training. Recover well. Reflect on this week: What went well? What will you improve? Prepare your mind and body for the week ahead.",
    tags: ["sunday", "recovery", "reflection", "preparation"],
    usageContext: "daily-mindset, sunday-motivation, rest-day"
  },

  // ============================================================================
  // CONTEXTUAL STRATEGIES
  // ============================================================================
  {
    title: "After Strikeout: Bounce Back",
    contentType: "principle",
    category: "Resilience",
    source: "Sports Psychology",
    content: "Take a breath. Next at-bat is a new opportunity. Even the best hitters fail 70% of the time. Review what you learned. Adjust. Move forward.",
    tags: ["strikeout", "bounce-back", "next-ab", "resilience"],
    usageContext: "after-strikeout, after-failure, bounce-back"
  },
  {
    title: "After Error: Flush and Refocus",
    contentType: "principle",
    category: "Resilience",
    source: "Mental Performance Coaching",
    content: "Physical reset - adjust your glove, take a breath, positive self-talk. Next play is your opportunity to make a great play. Your team will pick you up. What will you do different next time? Then move on.",
    tags: ["error", "flush", "next-play", "recovery"],
    usageContext: "after-error, defensive-mistake, move-forward"
  },
  {
    title: "Closing Inning Mindset",
    contentType: "principle",
    category: "Pre-Game",
    source: "Clutch Performance",
    content: "This is why you play. These moments define you. Don't overthink - trust your fundamentals. Attack the moment. Don't play scared. One pitch at a time. Stay present.",
    tags: ["closing", "clutch", "pressure", "high-stakes"],
    usageContext: "closing-inning, pressure-situation, high-stakes"
  },
  {
    title: "Before At-Bat Focus",
    contentType: "principle",
    category: "Focus",
    source: "Hitting Psychology",
    content: "See ball, hit ball. Nothing else matters right now. Same approach every time creates confidence. Know what you're looking for and where you want to hit it. Two deep breaths. You're ready.",
    tags: ["at-bat", "focus", "hitting", "preparation"],
    usageContext: "pre-at-bat", "on-deck", "batting"
  }
];

async function seedMentalEdge() {
  console.log("🧠 Seeding Mental Edge content...");
  
  try {
    // Clear existing mental edge content
    await db.delete(mentalEdge);
    console.log("✓ Cleared existing content");

    // Insert all mental edge content
    for (const content of MENTAL_EDGE_CONTENT) {
      await db.insert(mentalEdge).values(content);
    }

    console.log(`✓ Added ${MENTAL_EDGE_CONTENT.length} mental edge items`);
    console.log("\n📊 Content breakdown:");
    
    // Count by category
    const categories = MENTAL_EDGE_CONTENT.reduce((acc, item) => {
      acc[item.category] = (acc[item.category] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);
    
    Object.entries(categories).forEach(([category, count]) => {
      console.log(`   ${category}: ${count} items`);
    });

    console.log("\n✅ Mental Edge seeding complete!");
    console.log("\n💪 Mamba Mentality, motivational quotes, and sports psychology loaded!");
    console.log("🎯 Players now have access to championship mindset content.");
    
  } catch (error) {
    console.error("❌ Error seeding mental edge:", error);
    throw error;
  }
}

// Run if called directly
if (require.main === module) {
  seedMentalEdge()
    .then(() => process.exit(0))
    .catch((error) => {
      console.error(error);
      process.exit(1);
    });
}

export { seedMentalEdge, MENTAL_EDGE_CONTENT };
