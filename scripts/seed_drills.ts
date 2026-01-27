/**
 * SoftballProAI Knowledge Base Seed Script
 * 
 * Populates the database with expert-curated fastpitch softball drills
 * for the AI Brain's correction and recommendation engine.
 * 
 * Categories: Pitching, Hitting
 * Sources: Amanda Scarborough, Denny Dunn, High Level Patterns
 */

import { db } from "../server/db";
import { drills } from "../shared/schema";

interface DrillSeed {
  name: string;
  category: "Pitching" | "Hitting";
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

const PITCHING_DRILLS: DrillSeed[] = [
  // === INTERNAL ROTATION DRILLS ===
  {
    name: "Wrist Snap Drill",
    category: "Pitching",
    skillType: "pitching",
    difficulty: "Beginner",
    description: "Focus on proper wrist snap at release point. Start with arm at 6 o'clock position, snap wrist forward while keeping elbow locked. Develops the critical internal rotation that creates spin and velocity.",
    videoUrl: "https://www.youtube.com/results?search_query=softball+wrist+snap+drill",
    equipment: ["Softball", "Glove"],
    ageRange: "8U-18U",
    expertSource: "Amanda Scarborough",
    mechanicTags: ["Internal Rotation", "Wrist Snap", "Release Point", "Spin"],
    issueAddressed: "Weak wrist action, lack of spin on pitches"
  },
  {
    name: "Towel Drill for Arm Circle",
    category: "Pitching",
    skillType: "pitching",
    difficulty: "Beginner",
    description: "Use a towel to practice full arm circle without a ball. Focus on brushing the towel against your hip at the bottom of the circle. Builds muscle memory for proper arm path and internal rotation timing.",
    videoUrl: "https://www.youtube.com/results?search_query=softball+towel+drill+pitching",
    equipment: ["Hand towel"],
    ageRange: "8U-18U",
    expertSource: "Denny Dunn",
    mechanicTags: ["Arm Circle", "Internal Rotation", "Hip Brush"],
    issueAddressed: "Inconsistent arm circle, arm not brushing hip"
  },
  {
    name: "Figure 8 Arm Circle",
    category: "Pitching",
    skillType: "pitching",
    difficulty: "Intermediate",
    description: "Practice continuous figure-8 arm circles to develop fluid motion and internal rotation. Keep shoulder loose and relaxed while maintaining proper plane. Excellent for warming up and building arm speed.",
    videoUrl: "https://www.youtube.com/results?search_query=softball+figure+8+arm+circle",
    equipment: ["Softball"],
    ageRange: "10U-18U",
    expertSource: "Amanda Scarborough",
    mechanicTags: ["Arm Circle", "Internal Rotation", "Arm Speed", "Fluidity"],
    issueAddressed: "Stiff arm circle, slow arm speed"
  },

  // === K-DRILLS (KINETIC CHAIN) ===
  {
    name: "K-Drill: Walk Through",
    category: "Pitching",
    skillType: "pitching",
    difficulty: "Beginner",
    description: "Step-by-step breakdown of the windmill motion. Walk through each phase: load, drive, arm circle, release, and follow-through. Focus on connecting each body segment in sequence for maximum power transfer.",
    videoUrl: "https://www.youtube.com/results?search_query=softball+k+drill+pitching",
    equipment: ["Softball", "Glove"],
    ageRange: "8U-18U",
    expertSource: "Denny Dunn",
    mechanicTags: ["Kinetic Chain", "Mechanics Breakdown", "Power Transfer"],
    issueAddressed: "Disconnected mechanics, loss of power in delivery"
  },
  {
    name: "K-Drill: Power Line",
    category: "Pitching",
    skillType: "pitching",
    difficulty: "Intermediate",
    description: "Pitch along a straight line on the ground (power line). Focus on keeping hips, shoulders, and stride foot aligned toward the target. Teaches proper body alignment for maximum velocity and accuracy.",
    videoUrl: "https://www.youtube.com/results?search_query=softball+power+line+drill",
    equipment: ["Softball", "Glove", "Tape or chalk for line"],
    ageRange: "10U-18U",
    expertSource: "Denny Dunn",
    mechanicTags: ["Power Line", "Hip Alignment", "Stride Direction"],
    issueAddressed: "Open hips, stepping across body, loss of velocity"
  },
  {
    name: "K-Drill: Load and Explode",
    category: "Pitching",
    skillType: "pitching",
    difficulty: "Intermediate",
    description: "Practice loading onto back leg then explosively driving forward. Focus on driving off the rubber with power leg while keeping upper body back. Develops explosive leg drive essential for velocity.",
    videoUrl: "https://www.youtube.com/results?search_query=softball+load+explode+pitching+drill",
    equipment: ["Softball", "Glove", "Pitching rubber"],
    ageRange: "10U-18U",
    expertSource: "Amanda Scarborough",
    mechanicTags: ["Leg Drive", "Explosive Power", "Load Position"],
    issueAddressed: "Weak leg drive, arm-dominant pitching"
  },

  // === DRAG FOOT DRILLS ===
  {
    name: "Drag Foot Balance Drill",
    category: "Pitching",
    skillType: "pitching",
    difficulty: "Beginner",
    description: "Practice keeping drag foot in contact with ground through entire delivery. Place a piece of tape or towel under drag foot and ensure it stays connected throughout pitch. Develops stability and balance.",
    videoUrl: "https://www.youtube.com/results?search_query=softball+drag+foot+drill",
    equipment: ["Softball", "Glove", "Tape or towel"],
    ageRange: "8U-18U",
    expertSource: "Amanda Scarborough",
    mechanicTags: ["Drag Foot", "Balance", "Stability", "Ground Contact"],
    issueAddressed: "Lifting drag foot, loss of balance in delivery"
  },
  {
    name: "Wall Drag Drill",
    category: "Pitching",
    skillType: "pitching",
    difficulty: "Intermediate",
    description: "Stand with back to a wall, practice pitching motion with drag foot sliding along wall. Ensures proper drag foot path and prevents early lift. Builds muscle memory for consistent drag.",
    videoUrl: "https://www.youtube.com/results?search_query=softball+wall+drag+foot+drill",
    equipment: ["Wall or fence"],
    ageRange: "10U-18U",
    expertSource: "Denny Dunn",
    mechanicTags: ["Drag Foot", "Foot Path", "Consistency"],
    issueAddressed: "Inconsistent drag foot, foot lifting early"
  },

  // === RELEASE POINT DRILLS ===
  {
    name: "Bucket Drill for Release",
    category: "Pitching",
    skillType: "pitching",
    difficulty: "Beginner",
    description: "Place a bucket at the release point location. Practice releasing the ball over the bucket to develop consistent release point timing. Teaches proper release height and location.",
    videoUrl: "https://www.youtube.com/results?search_query=softball+bucket+release+drill",
    equipment: ["Softball", "Bucket or chair"],
    ageRange: "8U-18U",
    expertSource: "Amanda Scarborough",
    mechanicTags: ["Release Point", "Timing", "Consistency"],
    issueAddressed: "Inconsistent release point, high/low misses"
  },
  {
    name: "Target Release Drill",
    category: "Pitching",
    skillType: "pitching",
    difficulty: "Intermediate",
    description: "Use a small target (glove, spot on wall) at different heights. Practice hitting each target to develop command of release point adjustments. Builds pitch location awareness.",
    videoUrl: "https://www.youtube.com/results?search_query=softball+target+release+drill",
    equipment: ["Softball", "Target or tape marks"],
    ageRange: "10U-18U",
    expertSource: "Denny Dunn",
    mechanicTags: ["Release Point", "Location", "Command"],
    issueAddressed: "Poor pitch location, can't hit spots"
  },

  // === POSTURE CORRECTION DRILLS ===
  {
    name: "Tall and Fall Drill",
    category: "Pitching",
    skillType: "pitching",
    difficulty: "Beginner",
    description: "Start in tall posture, then fall forward into pitch while maintaining upright spine. Corrects hunching or leaning forward too early. Teaches proper posture throughout delivery.",
    videoUrl: "https://www.youtube.com/results?search_query=softball+tall+fall+pitching+drill",
    equipment: ["Softball", "Glove"],
    ageRange: "8U-18U",
    expertSource: "Amanda Scarborough",
    mechanicTags: ["Posture", "Spine Angle", "Balance"],
    issueAddressed: "Hunching forward, bent over at waist"
  },
  {
    name: "Head Still Drill",
    category: "Pitching",
    skillType: "pitching",
    difficulty: "Intermediate",
    description: "Practice full pitch while keeping head completely still and eyes locked on target. Partner watches from side to check for head movement. Develops stability and balance in delivery.",
    videoUrl: "https://www.youtube.com/results?search_query=softball+head+still+pitching+drill",
    equipment: ["Softball", "Glove", "Partner"],
    ageRange: "10U-18U",
    expertSource: "Denny Dunn",
    mechanicTags: ["Head Position", "Stability", "Focus"],
    issueAddressed: "Head moving during delivery, loss of accuracy"
  },

  // === PITCH-SPECIFIC DRILLS ===
  {
    name: "Rise Ball Spin Drill",
    category: "Pitching",
    skillType: "pitching",
    difficulty: "Advanced",
    description: "Focus on 12-6 backspin for rise ball. Practice snapping wrist up and through while maintaining arm speed. Use a striped ball to verify spin axis. Develops the signature rise ball movement.",
    videoUrl: "https://www.youtube.com/results?search_query=softball+rise+ball+spin+drill",
    equipment: ["Softball", "Striped ball optional"],
    ageRange: "12U-18U",
    expertSource: "Amanda Scarborough",
    mechanicTags: ["Rise Ball", "Backspin", "Wrist Snap", "Spin Axis"],
    issueAddressed: "Rise ball not moving, wrong spin direction"
  },
  {
    name: "Drop Ball Mechanics Drill",
    category: "Pitching",
    skillType: "pitching",
    difficulty: "Advanced",
    description: "Practice top-spin release for drop ball. Focus on pulling down and through at release, keeping fingers on top of ball. Creates the downward break that fools hitters.",
    videoUrl: "https://www.youtube.com/results?search_query=softball+drop+ball+drill",
    equipment: ["Softball"],
    ageRange: "12U-18U",
    expertSource: "Denny Dunn",
    mechanicTags: ["Drop Ball", "Topspin", "Release", "Break"],
    issueAddressed: "Drop ball not breaking, flat drop"
  },
  {
    name: "Change-Up Circle Change Grip",
    category: "Pitching",
    skillType: "pitching",
    difficulty: "Intermediate",
    description: "Practice the circle change grip and release. Focus on maintaining arm speed while using grip to reduce velocity. The deception comes from matching fastball arm action.",
    videoUrl: "https://www.youtube.com/results?search_query=softball+changeup+circle+change+drill",
    equipment: ["Softball"],
    ageRange: "10U-18U",
    expertSource: "Amanda Scarborough",
    mechanicTags: ["Change-Up", "Grip", "Arm Speed", "Deception"],
    issueAddressed: "Change-up too fast, arm speed slowing down"
  }
];

const HITTING_DRILLS: DrillSeed[] = [
  // === TEE WORK DRILLS ===
  {
    name: "High Tee Drill",
    category: "Hitting",
    skillType: "hitting",
    difficulty: "Beginner",
    description: "Set tee at chest height and practice driving ball with level to slightly downward swing path. Focus on keeping hands inside the ball and staying through contact zone. Teaches proper swing plane for high strikes.",
    videoUrl: "https://www.youtube.com/results?search_query=softball+high+tee+drill",
    equipment: ["Batting tee", "Softballs", "Bat", "Net or cage"],
    ageRange: "8U-18U",
    expertSource: "High Level Pattern",
    mechanicTags: ["Swing Plane", "High Strike", "Hands Inside", "Contact"],
    issueAddressed: "Uppercut swing, popping up high pitches"
  },
  {
    name: "Low Tee Extension Drill",
    category: "Hitting",
    skillType: "hitting",
    difficulty: "Beginner",
    description: "Set tee at knee height. Practice staying low through the ball and extending through contact. Focus on driving ball to opposite field with backspin. Develops ability to handle low pitches.",
    videoUrl: "https://www.youtube.com/results?search_query=softball+low+tee+drill",
    equipment: ["Batting tee", "Softballs", "Bat", "Net or cage"],
    ageRange: "8U-18U",
    expertSource: "High Level Pattern",
    mechanicTags: ["Low Pitch", "Extension", "Stay Low", "Opposite Field"],
    issueAddressed: "Rolling over on low pitches, weak grounders"
  },
  {
    name: "Inside Tee Drill",
    category: "Hitting",
    skillType: "hitting",
    difficulty: "Intermediate",
    description: "Set tee on inside corner of plate. Practice pulling hands in tight and rotating through the ball. Focus on quick hip rotation and driving ball to pull side. Teaches inside pitch mechanics.",
    videoUrl: "https://www.youtube.com/results?search_query=softball+inside+pitch+tee+drill",
    equipment: ["Batting tee", "Softballs", "Bat", "Net or cage"],
    ageRange: "10U-18U",
    expertSource: "High Level Pattern",
    mechanicTags: ["Inside Pitch", "Hip Rotation", "Pull Side", "Quick Hands"],
    issueAddressed: "Getting jammed on inside pitches"
  },
  {
    name: "Outside Tee Stay Back Drill",
    category: "Hitting",
    skillType: "hitting",
    difficulty: "Intermediate",
    description: "Set tee on outside corner. Practice keeping weight back and letting ball travel deep. Focus on driving ball to opposite field with extension. Teaches plate coverage on outside pitches.",
    videoUrl: "https://www.youtube.com/results?search_query=softball+outside+pitch+tee+drill",
    equipment: ["Batting tee", "Softballs", "Bat", "Net or cage"],
    ageRange: "10U-18U",
    expertSource: "High Level Pattern",
    mechanicTags: ["Outside Pitch", "Stay Back", "Opposite Field", "Extension"],
    issueAddressed: "Reaching for outside pitches, rolling over"
  },
  {
    name: "Two-Tee Separation Drill",
    category: "Hitting",
    skillType: "hitting",
    difficulty: "Advanced",
    description: "Place two tees 6 inches apart (front/back). Practice swinging through both balls in one swing. Develops proper swing path and barrel control through the zone. Creates line drive contact.",
    videoUrl: "https://www.youtube.com/results?search_query=softball+two+tee+drill",
    equipment: ["Two batting tees", "Softballs", "Bat", "Net or cage"],
    ageRange: "12U-18U",
    expertSource: "High Level Pattern",
    mechanicTags: ["Swing Path", "Barrel Control", "Zone Coverage", "Line Drives"],
    issueAddressed: "Cutting swing short, not staying through zone"
  },

  // === FRONT TOSS DRILLS ===
  {
    name: "Front Toss Timing Drill",
    category: "Hitting",
    skillType: "hitting",
    difficulty: "Beginner",
    description: "Partner tosses from 15-20 feet in front. Focus on timing stride with toss and loading properly. Practice seeing ball into contact zone. Develops rhythm and timing fundamentals.",
    videoUrl: "https://www.youtube.com/results?search_query=softball+front+toss+drill",
    equipment: ["Softballs", "Bat", "Net or cage", "L-screen for tosser"],
    ageRange: "8U-18U",
    expertSource: "High Level Pattern",
    mechanicTags: ["Timing", "Stride", "Load", "Rhythm"],
    issueAddressed: "Timing issues, lunging at ball"
  },
  {
    name: "Front Toss Location Work",
    category: "Hitting",
    skillType: "hitting",
    difficulty: "Intermediate",
    description: "Partner varies toss location (inside/outside/up/down). React and adjust to different pitch locations. Focus on recognizing location early and adjusting swing. Builds pitch recognition.",
    videoUrl: "https://www.youtube.com/results?search_query=softball+front+toss+location+drill",
    equipment: ["Softballs", "Bat", "Net or cage", "L-screen"],
    ageRange: "10U-18U",
    expertSource: "High Level Pattern",
    mechanicTags: ["Pitch Recognition", "Adjustment", "Location", "Reaction"],
    issueAddressed: "Can't adjust to pitch location"
  },
  {
    name: "Front Toss Power Drive",
    category: "Hitting",
    skillType: "hitting",
    difficulty: "Advanced",
    description: "Focus on driving through ball with full power on each swing. Track ball deep, explode through contact, complete full follow-through. Develops game-speed power swing.",
    videoUrl: "https://www.youtube.com/results?search_query=softball+power+hitting+drill",
    equipment: ["Softballs", "Bat", "Net or cage", "L-screen"],
    ageRange: "12U-18U",
    expertSource: "High Level Pattern",
    mechanicTags: ["Power", "Drive Through", "Follow Through", "Bat Speed"],
    issueAddressed: "Weak contact, lack of power"
  },

  // === SEPARATION & LOAD DRILLS ===
  {
    name: "Separation Drill",
    category: "Hitting",
    skillType: "hitting",
    difficulty: "Intermediate",
    description: "Practice creating separation between upper and lower body during load. Stride forward while keeping hands back. Creates the coil tension that generates power. Critical for power hitting.",
    videoUrl: "https://www.youtube.com/results?search_query=softball+separation+hitting+drill",
    equipment: ["Bat", "Mirror or video"],
    ageRange: "10U-18U",
    expertSource: "High Level Pattern",
    mechanicTags: ["Separation", "Load", "Coil", "Power Generation"],
    issueAddressed: "No separation, hands moving forward with stride"
  },
  {
    name: "Load and Fire Drill",
    category: "Hitting",
    skillType: "hitting",
    difficulty: "Intermediate",
    description: "Practice loading weight onto back hip, then explosively rotating through swing. Focus on hip-led rotation with hands following. Develops proper kinetic chain for powerful swings.",
    videoUrl: "https://www.youtube.com/results?search_query=softball+load+fire+hitting+drill",
    equipment: ["Bat", "Tee optional"],
    ageRange: "10U-18U",
    expertSource: "High Level Pattern",
    mechanicTags: ["Load", "Hip Rotation", "Kinetic Chain", "Explosive"],
    issueAddressed: "Arm-dominant swing, no hip involvement"
  },
  {
    name: "Stride and Hold Drill",
    category: "Hitting",
    skillType: "hitting",
    difficulty: "Beginner",
    description: "Practice striding to proper position and holding balance. Check foot position, weight distribution, and posture at contact position. Builds consistent foundation for swing.",
    videoUrl: "https://www.youtube.com/results?search_query=softball+stride+hold+drill",
    equipment: ["Bat"],
    ageRange: "8U-18U",
    expertSource: "High Level Pattern",
    mechanicTags: ["Stride", "Balance", "Foundation", "Weight Transfer"],
    issueAddressed: "Unbalanced swing, inconsistent stride"
  },

  // === HAND PATH DRILLS ===
  {
    name: "Hands to the Ball Drill",
    category: "Hitting",
    skillType: "hitting",
    difficulty: "Beginner",
    description: "Practice short, direct hand path to contact point. Focus on keeping hands inside the ball and driving knob to the ball first. Eliminates long, loopy swings.",
    videoUrl: "https://www.youtube.com/results?search_query=softball+hands+inside+drill",
    equipment: ["Bat", "Tee", "Softballs"],
    ageRange: "8U-18U",
    expertSource: "High Level Pattern",
    mechanicTags: ["Hand Path", "Hands Inside", "Direct Path", "Short Swing"],
    issueAddressed: "Long swing, casting hands"
  },
  {
    name: "Fence Drill for Swing Path",
    category: "Hitting",
    skillType: "hitting",
    difficulty: "Intermediate",
    description: "Stand with back elbow close to fence/wall. Practice swinging without hitting fence. Forces compact swing and proper hand path. Eliminates casting and long swings.",
    videoUrl: "https://www.youtube.com/results?search_query=softball+fence+drill+hitting",
    equipment: ["Bat", "Fence or wall"],
    ageRange: "10U-18U",
    expertSource: "High Level Pattern",
    mechanicTags: ["Swing Path", "Compact Swing", "Elbow Position", "Casting Fix"],
    issueAddressed: "Casting hands, long swing, pulling off ball"
  },

  // === BALANCE & POSTURE DRILLS ===
  {
    name: "One-Leg Balance Tee Drill",
    category: "Hitting",
    skillType: "hitting",
    difficulty: "Advanced",
    description: "Hit off tee while standing on front leg only. Develops balance and core strength through contact. Forces proper weight transfer and finish position.",
    videoUrl: "https://www.youtube.com/results?search_query=softball+one+leg+hitting+drill",
    equipment: ["Batting tee", "Softballs", "Bat"],
    ageRange: "12U-18U",
    expertSource: "High Level Pattern",
    mechanicTags: ["Balance", "Core Strength", "Weight Transfer", "Finish"],
    issueAddressed: "Falling off balance, poor finish"
  },
  {
    name: "Stay Back Load Drill",
    category: "Hitting",
    skillType: "hitting",
    difficulty: "Beginner",
    description: "Practice keeping weight on back side during load. Use a wall or partner resistance to feel proper load position. Prevents lunging and maintains balance through swing.",
    videoUrl: "https://www.youtube.com/results?search_query=softball+stay+back+drill",
    equipment: ["Bat", "Wall or partner"],
    ageRange: "8U-18U",
    expertSource: "High Level Pattern",
    mechanicTags: ["Stay Back", "Load", "Balance", "Weight Distribution"],
    issueAddressed: "Lunging forward, weight shift too early"
  }
];

async function seedDrills() {
  console.log("🥎 SoftballProAI Knowledge Base Seeding Started...\n");
  
  const allDrills = [...PITCHING_DRILLS, ...HITTING_DRILLS];
  
  console.log(`📚 Preparing to seed ${allDrills.length} expert drills:`);
  console.log(`   - Pitching drills: ${PITCHING_DRILLS.length}`);
  console.log(`   - Hitting drills: ${HITTING_DRILLS.length}\n`);

  let inserted = 0;
  let skipped = 0;

  for (const drill of allDrills) {
    try {
      // Check if drill already exists by name
      const existing = await db.query.drills.findFirst({
        where: (drills, { eq }) => eq(drills.name, drill.name)
      });

      if (existing) {
        console.log(`⏭️  Skipping existing drill: ${drill.name}`);
        skipped++;
        continue;
      }

      await db.insert(drills).values(drill);
      console.log(`✅ Inserted: ${drill.name} (${drill.category})`);
      inserted++;
    } catch (error) {
      console.error(`❌ Error inserting ${drill.name}:`, error);
    }
  }

  console.log("\n" + "=".repeat(50));
  console.log(`🎉 Seeding Complete!`);
  console.log(`   ✅ Inserted: ${inserted} drills`);
  console.log(`   ⏭️  Skipped: ${skipped} existing drills`);
  console.log(`   📊 Total in database: ${inserted + skipped} drills`);
  console.log("=".repeat(50));
  
  process.exit(0);
}

seedDrills().catch((err) => {
  console.error("Fatal error during seeding:", err);
  process.exit(1);
});
