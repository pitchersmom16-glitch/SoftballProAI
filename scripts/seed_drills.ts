/**
 * SoftballProAI Expert System Seed Script
 * 
 * Dynamic Knowledge Base for continuous AI learning
 * Categories: Pitching, Hitting, Catching, Throwing
 * Focus: Biomechanical Physics, Internal Rotation, Rotational Mechanics
 */

import { db } from "../server/db";
import { drills, mentalEdge } from "../shared/schema";
import { sql } from "drizzle-orm";

interface DrillSeed {
  name: string;
  category: "Pitching" | "Hitting" | "Catching" | "Throwing";
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
  // INTERNAL ROTATION - The Core of Windmill Power
  {
    name: "Internal Rotation Isolation Drill",
    category: "Pitching",
    skillType: "pitching",
    difficulty: "Intermediate",
    description: "The shoulder's internal rotation is THE source of velocity. Start with arm at 90 degrees, elbow at shoulder height. Rotate forearm forward explosively while keeping elbow stationary. This isolates the internal rotators (subscapularis, pec major, lats) that generate 40-60% of pitch velocity.",
    videoUrl: "https://www.youtube.com/watch?v=internal-rotation-pitching",
    equipment: ["Resistance band", "Mirror"],
    ageRange: "12U-College",
    expertSource: "Dr. James Andrews Biomechanics",
    mechanicTags: ["Internal Rotation", "Subscapularis", "Velocity Generation", "Shoulder Mechanics"],
    issueAddressed: "Low velocity, arm-dominant pitching without shoulder rotation"
  },
  {
    name: "Hip-Shoulder Separation Windmill",
    category: "Pitching",
    skillType: "pitching",
    difficulty: "Advanced",
    description: "The windmill delivery creates power through hip-shoulder separation. Hips must fire first, creating 40-50 degrees of separation between pelvis and trunk. This stretch-shortening cycle loads the core like a rubber band, transferring ground force through the kinetic chain to the arm.",
    videoUrl: "https://www.youtube.com/watch?v=hip-shoulder-separation",
    equipment: ["Pitching rubber", "Video camera"],
    ageRange: "14U-College",
    expertSource: "Denny Dunn Pitching Lab",
    mechanicTags: ["Hip-Shoulder Separation", "Kinetic Chain", "Stretch-Shortening Cycle", "Core Transfer"],
    issueAddressed: "Open too early, hips and shoulders rotating together, power leak"
  },
  {
    name: "Drag Foot Proprioception Drill",
    category: "Pitching",
    skillType: "pitching",
    difficulty: "Intermediate",
    description: "The drag foot isn't passive - it's an active stabilizer. The posterior chain (glute, hamstring) maintains ground contact while the hip drives forward. Feel the drag foot pulling through the dirt, not lifting. This stabilizes the pelvis for maximal hip rotation velocity.",
    videoUrl: "https://www.youtube.com/watch?v=drag-foot-technique",
    equipment: ["Pitching lane", "Tape"],
    ageRange: "10U-College",
    expertSource: "Amanda Scarborough Elite Mechanics",
    mechanicTags: ["Drag Foot", "Proprioception", "Posterior Chain", "Pelvis Stability"],
    issueAddressed: "Drag foot lifting, balance loss, hip rotation leak"
  },
  {
    name: "Scapular Loading Pattern",
    category: "Pitching",
    skillType: "pitching",
    difficulty: "Advanced",
    description: "Before internal rotation fires, the scapula must retract and depress. This 'loads' the shoulder for explosive acceleration. Practice pulling shoulder blade down and back at top of arm circle, then feel it release as arm accelerates. This is the biomechanical 'trigger' for power.",
    videoUrl: "https://www.youtube.com/watch?v=scapular-loading",
    equipment: ["Resistance band", "Wall"],
    ageRange: "14U-College",
    expertSource: "ASMI Biomechanics Research",
    mechanicTags: ["Scapular Retraction", "Shoulder Loading", "Acceleration Phase", "Biomechanical Trigger"],
    issueAddressed: "Arm circle feels disconnected, shoulder flying open"
  },
  {
    name: "Ground Reaction Force Transfer",
    category: "Pitching",
    skillType: "pitching",
    difficulty: "Advanced",
    description: "Elite pitchers generate 1.5-2x bodyweight in ground reaction force. This force travels from drive leg through pelvis, core, shoulder, arm, hand, to ball. Practice explosive drive off rubber while feeling force transfer up through body. Every link must be connected.",
    videoUrl: "https://www.youtube.com/watch?v=ground-force-pitching",
    equipment: ["Pitching rubber", "Force plate optional"],
    ageRange: "14U-College",
    expertSource: "Dr. Glenn Fleisig Biomechanics",
    mechanicTags: ["Ground Reaction Force", "Leg Drive", "Force Transfer", "Kinetic Chain"],
    issueAddressed: "Weak pitches despite effort, force leaking, all arm"
  },
  // RISE BALL PHYSICS
  {
    name: "Rise Ball Backspin Mechanics",
    category: "Pitching",
    skillType: "pitching",
    difficulty: "Advanced",
    description: "True rise ball requires 1400+ RPM backspin with 12-6 axis. The Magnus effect creates upward force opposing gravity. Focus on aggressive wrist supination through release - palm facing sky at finish. The ball doesn't 'rise' but the late break fools hitters' timing.",
    videoUrl: "https://www.youtube.com/watch?v=rise-ball-physics",
    equipment: ["Rapsodo or spin tracker", "Softballs"],
    ageRange: "14U-College",
    expertSource: "Pitch Design Physics",
    mechanicTags: ["Rise Ball", "Backspin", "Magnus Effect", "Wrist Supination", "Spin Rate"],
    issueAddressed: "Rise ball flat, no movement, wrong spin axis"
  },
  // DROP BALL PHYSICS
  {
    name: "Drop Ball Topspin Generation",
    category: "Pitching",
    skillType: "pitching",
    difficulty: "Advanced",
    description: "The drop ball uses topspin (12-6 axis pointing forward) creating downward Magnus force. At release, fingers pull DOWN and THROUGH the ball, staying on top. The seams should rotate toward the batter like a forward-rolling wheel. 1200+ RPM creates sharp late break.",
    videoUrl: "https://www.youtube.com/watch?v=drop-ball-topspin",
    equipment: ["Rapsodo or spin tracker", "Softballs"],
    ageRange: "14U-College",
    expertSource: "Pitch Physics Lab",
    mechanicTags: ["Drop Ball", "Topspin", "Forward Spin", "Late Break", "Fingers On Top"],
    issueAddressed: "Drop ball hanging, no sharp break, spinning sideways"
  },
  // CHANGE-UP DECEPTION
  {
    name: "Change-Up Arm Speed Deception",
    category: "Pitching",
    skillType: "pitching",
    difficulty: "Intermediate",
    description: "The change-up is about DECEPTION not slow arm. Arm speed stays identical to fastball - velocity reduction comes from grip and wrist angle only. The circle change grip kills backspin while maintaining arm speed. Hitter's timing is off by 8-10 mph.",
    videoUrl: "https://www.youtube.com/watch?v=changeup-deception",
    equipment: ["Softballs", "Video for arm speed comparison"],
    ageRange: "12U-College",
    expertSource: "Cat Osterman Pitch Analysis",
    mechanicTags: ["Change-Up", "Arm Speed", "Deception", "Grip Mechanics", "Timing Disruption"],
    issueAddressed: "Slowing arm on changeup, hitters recognizing it"
  },
  {
    name: "Curveball Spin Axis Training",
    category: "Pitching",
    skillType: "pitching",
    difficulty: "Advanced",
    description: "The curveball requires sidespin (3-9 axis). At release, fingers sweep across the ball laterally. The key is maintaining tight spin and consistent axis. Magnus force creates lateral movement - the more spin, the more break.",
    videoUrl: "https://www.youtube.com/watch?v=curveball-axis",
    equipment: ["Rapsodo", "Softballs"],
    ageRange: "14U-College",
    expertSource: "Pitch Design Lab",
    mechanicTags: ["Curveball", "Sidespin", "Spin Axis", "Magnus Effect", "Lateral Movement"],
    issueAddressed: "Curveball spinning wrong, no horizontal break"
  },
  {
    name: "Wrist Pronation/Supination Timing",
    category: "Pitching",
    skillType: "pitching",
    difficulty: "Intermediate",
    description: "Different pitches require different wrist positions at release. Fastball: neutral. Rise: supination (palm up). Drop: pronation (palm down). Curve: lateral. This must be trained until automatic. The wrist action at release determines pitch type.",
    videoUrl: "https://www.youtube.com/watch?v=wrist-positions",
    equipment: ["Softballs", "Slow-motion video"],
    ageRange: "12U-College",
    expertSource: "Amanda Scarborough",
    mechanicTags: ["Wrist Pronation", "Wrist Supination", "Release Point", "Pitch Selection"],
    issueAddressed: "All pitches look the same, can't vary movement"
  }
];

// ============================================================================
// HITTING DRILLS - Rotational Mechanics & Kinetic Chain
// ============================================================================
const HITTING_DRILLS: DrillSeed[] = [
  // ROTATIONAL POWER - The Physics of Hitting
  {
    name: "Hip-Lead Rotation Drill",
    category: "Hitting",
    skillType: "hitting",
    difficulty: "Intermediate",
    description: "The swing is initiated by the HIPS, not hands. The lead hip opens first, pulling the torso, then shoulders, then hands in sequence. This creates a whip effect through the kinetic chain. Practice rotating hips while keeping hands back - feel the stretch across your core.",
    videoUrl: "https://www.youtube.com/watch?v=hip-lead-rotation",
    equipment: ["Bat", "Mirror or video"],
    ageRange: "10U-College",
    expertSource: "Rotational Hitting Mechanics",
    mechanicTags: ["Hip Rotation", "Kinetic Chain", "Whip Effect", "Sequencing"],
    issueAddressed: "Hands-first swing, no hip involvement, weak power"
  },
  {
    name: "Separation Load Training",
    category: "Hitting",
    skillType: "hitting",
    difficulty: "Advanced",
    description: "Hip-shoulder separation creates the 'rubber band' effect that generates power. As stride foot lands, hips are 30-45 degrees open while shoulders remain closed. This stores elastic energy in the core. Elite hitters create 40+ degrees of separation.",
    videoUrl: "https://www.youtube.com/watch?v=separation-loading",
    equipment: ["Bat", "Video analysis"],
    ageRange: "12U-College",
    expertSource: "Biomechanical Hitting Analysis",
    mechanicTags: ["Separation", "Elastic Energy", "Core Loading", "Hip-Shoulder Differential"],
    issueAddressed: "No separation, hips and shoulders turning together"
  },
  {
    name: "Barrel Path Optimization",
    category: "Hitting",
    skillType: "hitting",
    difficulty: "Intermediate",
    description: "The optimal bat path is slightly upward (8-15 degrees) to match pitch plane. A level swing meets a downward pitch at only one point. An upward path stays in the zone longer. Practice getting on plane early and driving through the ball with loft.",
    videoUrl: "https://www.youtube.com/watch?v=barrel-path-swing",
    equipment: ["Tee", "Bat", "Video"],
    ageRange: "12U-College",
    expertSource: "Launch Angle Science",
    mechanicTags: ["Barrel Path", "Launch Angle", "Swing Plane", "Zone Time"],
    issueAddressed: "Groundball tendency, chopping down at ball"
  },
  {
    name: "Connection Ball Training",
    category: "Hitting",
    skillType: "hitting",
    difficulty: "Beginner",
    description: "Place a small ball or towel between back arm and torso. Keep it pinched during load and early swing. This ensures the back elbow stays connected to the hip rotation, transferring rotational energy to the hands. The hands don't generate power - they receive it.",
    videoUrl: "https://www.youtube.com/watch?v=connection-drill",
    equipment: ["Bat", "Small ball or towel", "Tee"],
    ageRange: "8U-College",
    expertSource: "Connected Swing Mechanics",
    mechanicTags: ["Connection", "Back Elbow", "Energy Transfer", "Rotational Link"],
    issueAddressed: "Disconnected hands, casting, barring lead arm"
  },
  {
    name: "Front Leg Brace Drill",
    category: "Hitting",
    skillType: "hitting",
    difficulty: "Advanced",
    description: "The front leg must BRACE (straighten) at contact, not bend. This creates an axis for rotation and prevents energy from leaking into forward momentum. Think of it as a pole vault - plant firm and rotate around it. Elite hitters have 170+ degree front knee extension.",
    videoUrl: "https://www.youtube.com/watch?v=front-leg-brace",
    equipment: ["Bat", "Tee", "Video"],
    ageRange: "12U-College",
    expertSource: "Axis Rotation Science",
    mechanicTags: ["Front Leg Brace", "Axis Rotation", "Energy Block", "Extension"],
    issueAddressed: "Collapsing front side, lunging, no firm post"
  },
  {
    name: "Bat Speed Training Protocol",
    category: "Hitting",
    skillType: "hitting",
    difficulty: "Advanced",
    description: "Bat speed comes from SEQUENCING not strength. Hip velocity peaks first, then shoulder velocity, then bat velocity. Use overload/underload training: heavy bats for strength, light bats for speed. Track improvement with a bat speed sensor.",
    videoUrl: "https://www.youtube.com/watch?v=bat-speed-training",
    equipment: ["Multiple weighted bats", "Bat speed sensor"],
    ageRange: "14U-College",
    expertSource: "Driveline Baseball Adapted",
    mechanicTags: ["Bat Speed", "Overload Training", "Underload Training", "Velocity Development"],
    issueAddressed: "Slow bat speed despite strength, timing issues"
  },
  {
    name: "Vision Training for Pitch Recognition",
    category: "Hitting",
    skillType: "hitting",
    difficulty: "Intermediate",
    description: "The eyes are the first link in hitting. Track the ball from pitcher's hand through release. Identify spin axis within first 10 feet to recognize pitch type. Use colored balls or numbered balls during soft toss to train visual processing speed.",
    videoUrl: "https://www.youtube.com/watch?v=vision-hitting",
    equipment: ["Colored softballs", "Number marked balls"],
    ageRange: "10U-College",
    expertSource: "Vision Training for Athletes",
    mechanicTags: ["Pitch Recognition", "Visual Processing", "Spin Identification", "Eye Training"],
    issueAddressed: "Can't recognize pitches, late on fastball, fooled by offspeed"
  },
  {
    name: "Contact Point Mapping",
    category: "Hitting",
    skillType: "hitting",
    difficulty: "Intermediate",
    description: "Every pitch location has an optimal contact point. Inside: out front, pull. Middle: in front of plate, center. Outside: deeper, opposite field. Practice hitting to specific fields based on tee placement. Great hitters adjust contact point, not swing.",
    videoUrl: "https://www.youtube.com/watch?v=contact-point-drill",
    equipment: ["Tee", "Bat", "Field markers"],
    ageRange: "10U-College",
    expertSource: "Directional Hitting",
    mechanicTags: ["Contact Point", "Opposite Field", "Pull Side", "Adjustability"],
    issueAddressed: "Pulling everything, can't use whole field"
  },
  {
    name: "Weight Transfer Timing",
    category: "Hitting",
    skillType: "hitting",
    difficulty: "Beginner",
    description: "Weight starts 60% back, transfers forward during stride, then BACK into rotation. Common mistake: drifting forward. Weight must get behind rotation for power. Feel like you're sitting on your back hip as you rotate, not falling forward.",
    videoUrl: "https://www.youtube.com/watch?v=weight-transfer",
    equipment: ["Bat", "Tee or soft toss"],
    ageRange: "8U-College",
    expertSource: "Balance Point Hitting",
    mechanicTags: ["Weight Transfer", "Load", "Balance", "Stay Back"],
    issueAddressed: "Lunging, drifting forward, no power"
  },
  {
    name: "Hand Path to the Ball",
    category: "Hitting",
    skillType: "hitting",
    difficulty: "Intermediate",
    description: "Hands take a short, direct path. Knob of bat leads toward the ball, then barrel accelerates through. Think 'knob to ball, barrel through ball'. Long, loopy swings add distance hands must travel and reduce bat speed.",
    videoUrl: "https://www.youtube.com/watch?v=hand-path-drill",
    equipment: ["Bat", "Tee"],
    ageRange: "10U-College",
    expertSource: "Efficient Swing Mechanics",
    mechanicTags: ["Hand Path", "Knob to Ball", "Short Swing", "Direct Path"],
    issueAddressed: "Casting hands, long swing, slow to contact"
  }
];

// ============================================================================
// CATCHING DRILLS - Framing, Blocking, Pop Time
// ============================================================================
const CATCHING_DRILLS: DrillSeed[] = [
  {
    name: "Framing with Quiet Hands",
    category: "Catching",
    skillType: "catching",
    difficulty: "Intermediate",
    description: "Elite framers receive the ball with soft, quiet hands that absorb impact and subtly guide the ball into the zone. Practice catching with minimal glove movement - stick the pitch where you receive it. Strong wrist, soft elbow. Every pitch should look like a strike.",
    videoUrl: "https://www.youtube.com/watch?v=framing-technique",
    equipment: ["Catcher's mitt", "Softballs", "Net or pitcher"],
    ageRange: "10U-College",
    expertSource: "Catching Science",
    mechanicTags: ["Framing", "Quiet Hands", "Pitch Presentation", "Strike Zone"],
    issueAddressed: "Stabbing at ball, dropping glove, losing strikes"
  },
  {
    name: "Low Ball Framing Tilt",
    category: "Catching",
    skillType: "catching",
    difficulty: "Advanced",
    description: "Low pitches require specific technique: receive with glove tilted UP, fingers pointing down and out. This 'sticks' the low pitch in the zone visually. Practice catching low strikes and holding the glove position for 1-2 seconds.",
    videoUrl: "https://www.youtube.com/watch?v=low-pitch-framing",
    equipment: ["Catcher's mitt", "Softballs"],
    ageRange: "12U-College",
    expertSource: "Advanced Framing Mechanics",
    mechanicTags: ["Low Pitch Framing", "Glove Tilt", "Strike Presentation"],
    issueAddressed: "Pulling glove down on low pitches, losing low strikes"
  },
  {
    name: "Blocking Reaction Drill",
    category: "Catching",
    skillType: "catching",
    difficulty: "Intermediate",
    description: "Blocking is about getting your body in front of the ball, not catching it. Drop to knees, drive chest forward, tuck chin, create a wall. The ball hits your chest protector and stays in front. Practice random drops - left, right, center.",
    videoUrl: "https://www.youtube.com/watch?v=blocking-drill",
    equipment: ["Catcher's gear", "Softballs or blocking balls"],
    ageRange: "10U-College",
    expertSource: "Blocking Fundamentals",
    mechanicTags: ["Blocking", "Body Position", "Reaction Time", "Ball in Front"],
    issueAddressed: "Ball getting past, slow reaction, not getting body down"
  },
  {
    name: "Pop Time Explosiveness Training",
    category: "Catching",
    skillType: "catching",
    difficulty: "Advanced",
    description: "Pop time = receive + exchange + throw. Elite catchers are under 1.8 seconds. Focus on catching in throwing position, quick exchange (ball to throwing hand in one motion), and powerful throw from crouch. Practice with stopwatch feedback.",
    videoUrl: "https://www.youtube.com/watch?v=pop-time-training",
    equipment: ["Catcher's gear", "Stopwatch", "Target at second base"],
    ageRange: "12U-College",
    expertSource: "Pop Time Optimization",
    mechanicTags: ["Pop Time", "Quick Exchange", "Throwing Footwork", "Arm Strength"],
    issueAddressed: "Slow pop time, poor exchange, weak arm"
  },
  {
    name: "One-Knee Receiving Stance",
    category: "Catching",
    skillType: "catching",
    difficulty: "Beginner",
    description: "The one-knee stance is becoming standard - it improves low pitch framing and reduces strain. Right knee down, left foot forward. Glove presented as relaxed target. Practice receiving in this stance until it feels natural.",
    videoUrl: "https://www.youtube.com/watch?v=one-knee-catching",
    equipment: ["Catcher's gear"],
    ageRange: "10U-College",
    expertSource: "Modern Catching Mechanics",
    mechanicTags: ["One-Knee Stance", "Receiving Position", "Low Pitch Setup"],
    issueAddressed: "Uncomfortable receiving, missing low pitches"
  }
];

// ============================================================================
// THROWING DRILLS - Arm Care, Long Toss, Mechanics
// ============================================================================
const THROWING_DRILLS: DrillSeed[] = [
  {
    name: "Long Toss Progression Protocol",
    category: "Throwing",
    skillType: "throwing",
    difficulty: "Intermediate",
    description: "Long toss builds arm strength and improves throwing mechanics. Start at 60 feet, work back to 120-150 feet, then compress back. Focus on arc throws going out (strength), line drives coming in (accuracy). 2-3 times per week maximum.",
    videoUrl: "https://www.youtube.com/watch?v=long-toss-program",
    equipment: ["Softballs", "Open field"],
    ageRange: "12U-College",
    expertSource: "Arm Care Protocol",
    mechanicTags: ["Long Toss", "Arm Strength", "Arc Throws", "Arm Care"],
    issueAddressed: "Weak arm, lack of throwing distance"
  },
  {
    name: "Crow Hop Power Throwing",
    category: "Throwing",
    skillType: "throwing",
    difficulty: "Intermediate",
    description: "The crow hop transfers ground force into the throw. Push off back leg explosively, hop and land on back leg, then drive forward into throw. This adds 5-10 mph to outfield throws. Practice the footwork rhythm before adding ball.",
    videoUrl: "https://www.youtube.com/watch?v=crow-hop-throw",
    equipment: ["Softballs", "Field space"],
    ageRange: "10U-College",
    expertSource: "Outfield Throwing Mechanics",
    mechanicTags: ["Crow Hop", "Ground Force", "Momentum", "Outfield Arm"],
    issueAddressed: "Flat-footed throws, weak outfield arm"
  },
  {
    name: "Quick Release Infield Drill",
    category: "Throwing",
    skillType: "throwing",
    difficulty: "Intermediate",
    description: "Infielders need quick feet-to-release time. Practice fielding and throwing in one fluid motion. Catch, small shuffle, throw - no extra steps. Focus on catching in throwing position and quick transfer. Time yourself from catch to release.",
    videoUrl: "https://www.youtube.com/watch?v=quick-release-infield",
    equipment: ["Glove", "Softballs", "Target"],
    ageRange: "10U-College",
    expertSource: "Infield Fundamentals",
    mechanicTags: ["Quick Release", "Transfer", "Footwork", "Infield Throwing"],
    issueAddressed: "Slow release, extra steps, rushed throws"
  },
  {
    name: "Throwing Arm Path Drill",
    category: "Throwing",
    skillType: "throwing",
    difficulty: "Beginner",
    description: "Proper arm path is down-back-up in a circular motion, not straight back. The ball should reach highest point at maximum external rotation. Practice throwing with focus on smooth arm circle, elbow leading, and fingers on top at release.",
    videoUrl: "https://www.youtube.com/watch?v=throwing-arm-path",
    equipment: ["Softballs", "Partner or net"],
    ageRange: "8U-College",
    expertSource: "Throwing Mechanics 101",
    mechanicTags: ["Arm Path", "Arm Circle", "External Rotation", "Elbow Lead"],
    issueAddressed: "Short-arming, throwing sidearm, elbow pain"
  },
  {
    name: "Rotational Throwing Power",
    category: "Throwing",
    skillType: "throwing",
    difficulty: "Advanced",
    description: "Throwing velocity comes from hip and trunk rotation, not arm. Focus on driving back hip through the throw while keeping chest closed as long as possible. The arm accelerates AFTER the trunk rotates. Feel your core coil and uncoil.",
    videoUrl: "https://www.youtube.com/watch?v=rotational-throwing",
    equipment: ["Softballs", "Video analysis"],
    ageRange: "12U-College",
    expertSource: "Rotational Power System",
    mechanicTags: ["Hip Rotation", "Trunk Rotation", "Delayed Arm Action", "Core Power"],
    issueAddressed: "All-arm thrower, lack of velocity"
  }
];

// ============================================================================
// MENTAL EDGE - Mamba Mentality & Elite Mindset
// ============================================================================
const MENTAL_EDGE_CONTENT: MentalEdgeSeed[] = [
  // KOBE BRYANT - MAMBA MENTALITY PRINCIPLES
  {
    title: "Mamba Mentality - Obsessive Preparation",
    contentType: "principle",
    category: "Pre-Game",
    source: "Kobe Bryant",
    content: "I have nothing in common with lazy people who blame others for their lack of success. Great things come from hard work and perseverance. No excuses. The moment you start making excuses is the moment you stop winning.",
    tags: ["Mamba Mentality", "Work Ethic", "No Excuses", "Preparation"],
    usageContext: "Before practice when you don't feel like working hard"
  },
  {
    title: "Mamba Mentality - Fear of Failure",
    contentType: "quote",
    category: "Confidence",
    source: "Kobe Bryant",
    content: "I'm not afraid to fail. I'm afraid to not try. The moment you give up is the moment you let someone else win. Everything negative - pressure, challenges - is all an opportunity for me to rise.",
    tags: ["Mamba Mentality", "Fearless", "Pressure", "Competition"],
    usageContext: "Before big games, tournament situations"
  },
  {
    title: "Mamba Mentality - Relentless Focus",
    contentType: "principle",
    category: "Focus",
    source: "Kobe Bryant",
    content: "I don't focus on what I'm up against. I focus on my goals and try to ignore the rest. The most important thing is to try and inspire people so they can be great in whatever they want to do. Be willing to sacrifice what you are for what you will become.",
    tags: ["Mamba Mentality", "Focus", "Goals", "Sacrifice"],
    usageContext: "When distractions are affecting performance"
  },
  {
    title: "Mamba Mentality - Response to Adversity",
    contentType: "quote",
    category: "Resilience",
    source: "Kobe Bryant",
    content: "I never tried to prove anything to someone else. I wanted to prove something to myself. Use your success, your failures, your heartache, your joy as fuel. You have to be able to look back at your pain and learn from it.",
    tags: ["Mamba Mentality", "Resilience", "Self-Motivation", "Growth"],
    usageContext: "After a tough loss or failure"
  },
  {
    title: "Mamba Mentality - Detail Obsession",
    contentType: "principle",
    category: "Pre-Game",
    source: "Kobe Bryant",
    content: "I'll do whatever it takes to win games, whether it's sitting on a bench waving a towel, handing a cup of water to a teammate, or hitting the game-winning shot. There's nothing truly to be afraid of, when you think about it, because I've failed before, and I woke up the next morning, and I'm okay.",
    tags: ["Mamba Mentality", "Team Player", "Winning", "Perspective"],
    usageContext: "When ego is getting in the way of team success"
  },
  {
    title: "Mamba Mentality - Work When Others Sleep",
    contentType: "quote",
    category: "Confidence",
    source: "Kobe Bryant",
    content: "I can't relate to lazy people. We don't speak the same language. I don't understand you. I don't want to understand you. The mindset isn't about seeking a result—it's more about the process of getting to that result.",
    tags: ["Mamba Mentality", "Work Ethic", "Process", "Excellence"],
    usageContext: "When you need motivation to put in extra work"
  },
  // BEST OF 2021 MOTIVATIONAL - Pre-Game Content
  {
    title: "Best of 2021 Motivational Compilation",
    contentType: "video",
    category: "Pre-Game",
    source: "Best of 2021 Motivational Videos",
    content: "A powerful compilation of the year's most inspiring speeches and moments. Features elite athletes discussing mindset, preparation, and the pursuit of excellence. Perfect for team pre-game viewing to elevate mental state.",
    videoUrl: "https://www.youtube.com/watch?v=best-2021-motivation",
    tags: ["Motivational", "Pre-Game", "Elite Mindset", "Team Building"],
    usageContext: "Team pre-game in locker room, 30 minutes before first pitch"
  },
  // ADDITIONAL MENTAL EDGE CONTENT
  {
    title: "Visualization: Perfect At-Bat",
    contentType: "visualization",
    category: "Pre-Game",
    source: "Sports Psychology",
    content: "Close your eyes. See yourself walking to the plate with confidence. Feel the bat in your hands. Watch the pitcher's release point. See the ball, track the spin, time your stride. Feel the solid contact. Hear the crack of the bat. See the ball flying into the gap.",
    tags: ["Visualization", "At-Bat Prep", "Mental Rehearsal"],
    usageContext: "Before at-bat, in on-deck circle"
  },
  {
    title: "Reset After Strikeout",
    contentType: "principle",
    category: "Recovery",
    source: "Elite Mindset Training",
    content: "The best hitters fail 7 out of 10 times. One at-bat doesn't define you. Take three deep breaths. Flush it. The next at-bat is a new opportunity. Stay aggressive, stay confident. Trust your training.",
    tags: ["Recovery", "Resilience", "Next Pitch Mentality"],
    usageContext: "Immediately after a strikeout or poor at-bat"
  },
  {
    title: "Pitcher's Mound Dominance",
    contentType: "visualization",
    category: "Confidence",
    source: "Pitching Psychology",
    content: "The circle is YOUR territory. Every batter who steps in is entering YOUR space. You control the tempo. You dictate the at-bat. Breathe. Feel the ball. Trust your mechanics. Attack the zone with confidence. This is your game.",
    tags: ["Pitcher Mindset", "Dominance", "Confidence", "Control"],
    usageContext: "Before taking the mound, between innings"
  }
];

async function seedDatabase() {
  console.log("🧠 SoftballProAI Expert System Seeding Started...\n");
  console.log("⚠️  This will REPLACE existing drills and mental edge content\n");
  
  // Clear existing data
  console.log("🗑️  Clearing existing drills...");
  await db.delete(drills);
  console.log("🗑️  Clearing existing mental edge content...");
  await db.delete(mentalEdge);
  
  const allDrills = [...PITCHING_DRILLS, ...HITTING_DRILLS, ...CATCHING_DRILLS, ...THROWING_DRILLS];
  
  console.log(`\n📚 Seeding ${allDrills.length} expert drills:`);
  console.log(`   - Pitching: ${PITCHING_DRILLS.length}`);
  console.log(`   - Hitting: ${HITTING_DRILLS.length}`);
  console.log(`   - Catching: ${CATCHING_DRILLS.length}`);
  console.log(`   - Throwing: ${THROWING_DRILLS.length}`);
  
  // Insert drills
  for (const drill of allDrills) {
    try {
      await db.insert(drills).values(drill);
      console.log(`✅ ${drill.category}: ${drill.name}`);
    } catch (error) {
      console.error(`❌ Error inserting ${drill.name}:`, error);
    }
  }
  
  console.log(`\n🧠 Seeding ${MENTAL_EDGE_CONTENT.length} mental edge items:`);
  
  // Insert mental edge content
  for (const content of MENTAL_EDGE_CONTENT) {
    try {
      await db.insert(mentalEdge).values(content);
      console.log(`✅ ${content.category}: ${content.title}`);
    } catch (error) {
      console.error(`❌ Error inserting ${content.title}:`, error);
    }
  }
  
  console.log("\n" + "=".repeat(60));
  console.log("🎉 Expert System Seeding Complete!");
  console.log(`   📊 Drills: ${allDrills.length}`);
  console.log(`   🧠 Mental Edge: ${MENTAL_EDGE_CONTENT.length}`);
  console.log(`   📁 Categories: Pitching, Hitting, Catching, Throwing, Mental`);
  console.log("=".repeat(60));
  
  process.exit(0);
}

seedDatabase().catch((err) => {
  console.error("Fatal error during seeding:", err);
  process.exit(1);
});
