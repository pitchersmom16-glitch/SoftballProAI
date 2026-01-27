/**
 * Holistic Athlete Drill Seeder
 * 
 * Seeds the database with essential drills for HITTING and CATCHING
 * to support the full Holistic Athlete model per Master Spec Sheet.
 */

import { db } from "../server/db";
import { drills } from "../shared/schema";

const HITTING_DRILLS = [
  {
    name: "Tee Extension Drill",
    category: "HITTING",
    skillType: "hitting",
    difficulty: "Beginner",
    description: "Place tee at front of plate. Focus on driving through the ball with full extension. Finish with hands high and bat pointing to opposite field. Teaches proper extension and prevents cutting swings short.",
    videoUrl: "https://www.youtube.com/watch?v=hitting-tee-extension",
    equipment: ["Batting tee", "Softballs", "Bat"],
    ageRange: "8U-16U",
    expertSource: "Mike Candrea",
    mechanicTags: ["Extension", "Follow Through", "Contact Point"],
    issueAddressed: "Cutting swing short"
  },
  {
    name: "Soft Toss Inside/Outside",
    category: "HITTING",
    skillType: "hitting",
    difficulty: "Beginner",
    description: "Partner tosses balls to inside and outside zones. Hitter must adjust contact point - pull inside pitches, drive outside pitches to opposite field. Develops plate coverage and pitch recognition.",
    videoUrl: "https://www.youtube.com/watch?v=hitting-soft-toss",
    equipment: ["Softballs", "Bat", "Net"],
    ageRange: "10U-16U",
    expertSource: "Crystl Bustos",
    mechanicTags: ["Plate Coverage", "Contact Point", "Opposite Field"],
    issueAddressed: "Poor plate coverage"
  },
  {
    name: "Load & Stride Separation",
    category: "HITTING",
    skillType: "hitting",
    difficulty: "Intermediate",
    description: "Focus on creating separation between lower and upper body during load. Stride foot lands while hands stay back. Creates torque and stored energy for explosive swing. Key to power generation.",
    videoUrl: "https://www.youtube.com/watch?v=hitting-separation",
    equipment: ["Bat", "Mirror"],
    ageRange: "12U-16U",
    expertSource: "Sue Enquist",
    mechanicTags: ["Separation", "Load", "Coil", "Power Generation"],
    issueAddressed: "No separation between upper and lower body"
  },
  {
    name: "Hip Rotation Power Drill",
    category: "HITTING",
    skillType: "hitting",
    difficulty: "Intermediate",
    description: "Stand with bat behind back, hands on hips. Practice explosive hip rotation leading the swing. Back hip drives through to pitcher. Teaches that power comes from ground up, not arms.",
    videoUrl: "https://www.youtube.com/watch?v=hitting-hip-rotation",
    equipment: ["Bat"],
    ageRange: "10U-16U",
    expertSource: "Jennie Finch",
    mechanicTags: ["Hip Rotation", "Kinetic Chain", "Power Generation"],
    issueAddressed: "Arm-dominant swing with no hip rotation"
  },
  {
    name: "Stay Back Tee Drill",
    category: "HITTING",
    skillType: "hitting",
    difficulty: "Beginner",
    description: "Place cone behind back foot. Hit off tee without knocking cone over. Forces weight to stay back during load and shift forward only at contact. Fixes lunging and reaching.",
    videoUrl: "https://www.youtube.com/watch?v=hitting-stay-back",
    equipment: ["Batting tee", "Cone", "Softballs", "Bat"],
    ageRange: "8U-14U",
    expertSource: "Dot Richardson",
    mechanicTags: ["Stay Back", "Load", "Balance", "Weight Transfer"],
    issueAddressed: "Lunging at pitches"
  }
];

const CATCHING_DRILLS = [
  {
    name: "Framing Low Pitches",
    category: "CATCHING",
    skillType: "catching",
    difficulty: "Intermediate",
    description: "Partner throws pitches just below the zone. Catch with soft hands and 'stick' the ball at bottom of zone. Glove moves slightly up on catch, never down. Quiet body, let glove do the work.",
    videoUrl: "https://www.youtube.com/watch?v=catching-framing-low",
    equipment: ["Catcher's gear", "Softballs"],
    ageRange: "10U-16U",
    expertSource: "Stacey Nuveman",
    mechanicTags: ["Framing", "Soft Hands", "Glove Presentation", "Stick It"],
    issueAddressed: "Poor framing on low pitches"
  },
  {
    name: "Blocking Fundamentals",
    category: "CATCHING",
    skillType: "catching",
    difficulty: "Beginner",
    description: "Drop to knees, tuck chin, glove fills hole between legs. Shoulders rounded forward to create wall. Practice with tennis balls first, then softballs. Goal: keep ball in front, smother it.",
    videoUrl: "https://www.youtube.com/watch?v=catching-blocking",
    equipment: ["Catcher's gear", "Tennis balls", "Softballs"],
    ageRange: "8U-16U",
    expertSource: "Lovie Jung",
    mechanicTags: ["Blocking", "Stay Low", "Centerline", "Smother"],
    issueAddressed: "Balls getting past catcher"
  },
  {
    name: "Quick Feet Pop Time",
    category: "CATCHING",
    skillType: "catching",
    difficulty: "Advanced",
    description: "From receiving stance, practice explosive jab step with right foot while ball is in flight. Right foot replaces left, body squares to second base. Exchange happens during footwork, not after.",
    videoUrl: "https://www.youtube.com/watch?v=catching-pop-time",
    equipment: ["Catcher's gear", "Softballs", "Stopwatch"],
    ageRange: "12U-16U",
    expertSource: "April Goss",
    mechanicTags: ["Pop Time", "Quick Feet", "Exchange", "Footwork"],
    issueAddressed: "Slow pop time on steals"
  },
  {
    name: "Quiet Receiving Drill",
    category: "CATCHING",
    skillType: "catching",
    difficulty: "Beginner",
    description: "Partner throws from 20 feet. Focus on catching the ball silently - no pop in glove. Let ball travel deep into glove pocket. Soft hands absorb impact. Develops touch for framing.",
    videoUrl: "https://www.youtube.com/watch?v=catching-quiet-glove",
    equipment: ["Catcher's mitt", "Softballs"],
    ageRange: "8U-14U",
    expertSource: "Stacey Nuveman",
    mechanicTags: ["Quiet Glove", "Soft Hands", "Receiving"],
    issueAddressed: "Loud, aggressive catching"
  },
  {
    name: "Exchange Speed Drill",
    category: "CATCHING",
    skillType: "catching",
    difficulty: "Intermediate",
    description: "Practice glove-to-hand transfer without throwing. Catch, transfer to throwing hand at ear, back to glove. Repeat 20 times. Goal: sub-0.3 second transfer. Bare hand meets ball, doesn't chase it.",
    videoUrl: "https://www.youtube.com/watch?v=catching-exchange",
    equipment: ["Catcher's mitt", "Softballs"],
    ageRange: "10U-16U",
    expertSource: "April Goss",
    mechanicTags: ["Exchange", "Transfer", "Quick Hands"],
    issueAddressed: "Slow exchange on throw-downs"
  }
];

async function seedHolisticDrills() {
  console.log("🥎 Seeding Holistic Athlete Drills...\n");

  // Seed Hitting Drills
  console.log("⚾ Seeding HITTING drills...");
  for (const drill of HITTING_DRILLS) {
    try {
      await db.insert(drills).values(drill);
      console.log(`  ✓ ${drill.name}`);
    } catch (error: any) {
      if (error.message?.includes("duplicate")) {
        console.log(`  - ${drill.name} (already exists)`);
      } else {
        console.error(`  ✗ ${drill.name}: ${error.message}`);
      }
    }
  }

  // Seed Catching Drills
  console.log("\n🧤 Seeding CATCHING drills...");
  for (const drill of CATCHING_DRILLS) {
    try {
      await db.insert(drills).values(drill);
      console.log(`  ✓ ${drill.name}`);
    } catch (error: any) {
      if (error.message?.includes("duplicate")) {
        console.log(`  - ${drill.name} (already exists)`);
      } else {
        console.error(`  ✗ ${drill.name}: ${error.message}`);
      }
    }
  }

  console.log("\n✅ Holistic drill seeding complete!");
  console.log(`   - ${HITTING_DRILLS.length} Hitting drills`);
  console.log(`   - ${CATCHING_DRILLS.length} Catching drills`);
  
  process.exit(0);
}

seedHolisticDrills().catch(console.error);
