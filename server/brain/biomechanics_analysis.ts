/**
 * ADVANCED BIOMECHANICS ANALYSIS ENGINE
 *
 * This module provides detailed biomechanical analysis frameworks that work
 * with MediaPipe pose detection to deliver expert-level coaching insights.
 * Based on sports science research and biomechanics literature (2025-2026).
 */

import fs from "fs";
import path from "path";
import OpenAI from "openai";

const llm = new OpenAI({
  apiKey: process.env.AI_INTEGRATIONS_OPENAI_API_KEY,
  baseURL: process.env.AI_INTEGRATIONS_OPENAI_BASE_URL,
});

/**
 * analyzeMechanics
 * ----------------
 * This function sends biomechanics metrics to the LLM using:
 * - A global system prompt (identity + rules)
 * - A task-specific prompt (ROLE / TASK / FORMAT)
 * - A strict JSON output contract
 * - A rule-based-first hybrid approach
 */

export async function analyzeMechanics(metrics: any) {
  // Load the global system prompt (the "constitution")
  const systemPrompt = fs.readFileSync(
    path.join(__dirname, "system_prompts/base_system_prompt.md"),
    "utf8"
  );

  // Task-specific instructions for mechanics analysis
  const analysisPrompt = `
ROLE: Act as a biomechanics coach specializing in fastpitch softball.

TASK: Analyze the provided metrics and return issues, strengths, and recommended drills.

FORMAT:
{
  "issues": [...],
  "strengths": [...],
  "recommendedDrills": [...],
  "priorityFocus": [...]
}

RULES:
- Return your answer in valid JSON only.
- Do not include commentary outside the JSON block.
- If required information is missing, ask one clarifying question before continuing.
- Apply rule-based logic first. Only use the LLM to expand or contextualize.
- Never override rule-based results unless explicitly instructed.

METRICS:
${JSON.stringify(metrics, null, 2)}
`;

  // LLM call (using OpenAI client)
  const response = await llm.chat.completions.create({
    model: process.env.DEFAULT_LLM_MODEL || "gpt-5.1",
    messages: [
      { role: "system", content: systemPrompt },
      { role: "user", content: analysisPrompt }
    ],
    max_completion_tokens: 1500,
  });

  return response;
}


// ============================================================================
// PITCHING BIOMECHANICS - Detailed Analysis Framework
// ============================================================================

export const PITCHING_BIOMECHANICS = {
  kineticChainSequence: {
    description: "Proper sequential activation maximizes velocity and reduces injury risk",
    optimalSequence: [
      {
        phase: "1. Drive Leg Loading",
        timing: "0.00-0.15s",
        keyPoints: [
          "Weight shifts to push leg (70-80% weight distribution)",
          "Knee flexion 90-110 degrees",
          "Hip internally rotated",
          "Core engaged, slight forward lean"
        ],
        commonErrors: [
          "Insufficient leg bend (reduces power generation)",
          "Weight distribution too even (power leak)",
          "Upper body tilting too far forward"
        ]
      },
      {
        phase: "2. Hip Drive and Stride",
        timing: "0.15-0.30s",
        keyPoints: [
          "Hips fire FIRST (lead the movement)",
          "Stride length 80-90% of pitcher's height",
          "Stride foot lands closed (toes toward 1B for RHP)",
          "Front knee soft (15-20 degree flexion)",
          "Hips create 40-50 degrees separation from shoulders"
        ],
        commonErrors: [
          "Hips and shoulders rotating together (power leak)",
          "Stride too short (<70% height) or too long (>100%)",
          "Stride foot opens early (energy leak)",
          "Landing on stiff leg (injury risk, reduced control)"
        ],
        biomechanicalBenchmarks: {
          hipSeparation: "40-50 degrees (elite), 30-40 (advanced), <30 (needs work)",
          strideLength: "Optimal = 85% of height in inches",
          hipRotationVelocity: "600-700 degrees/second (elite)"
        }
      },
      {
        phase: "3. Torso Rotation",
        timing: "0.30-0.40s",
        keyPoints: [
          "Torso follows hips (not simultaneous)",
          "Obliques and core transfer energy",
          "Spine angle stays consistent (no excessive lean)",
          "Shoulders reach peak velocity just before arm",
          "Non-throwing shoulder pulls back (creates separation)"
        ],
        commonErrors: [
          "Early rotation (shoulders fire with hips)",
          "Insufficient core engagement",
          "Collapsing or excessive lean",
          "Throwing shoulder leading (should be non-throwing)"
        ],
        biomechanicalBenchmarks: {
          torsoRotationVelocity: "800-900 degrees/second (elite)",
          spineAngle: "10-15 degrees forward lean at release"
        }
      },
      {
        phase: "4. Arm Circle and Acceleration",
        timing: "0.35-0.45s",
        keyPoints: [
          "Arm follows torso (not vice versa)",
          "Elbow leads hand through power position",
          "Elbow BENT coming down back (not straight)",
          "Internal rotation of shoulder generates velocity",
          "Forearm lags behind, then whips through",
          "Arm brushes hip at release zone"
        ],
        commonErrors: [
          "Arm-dominant (leading instead of following)",
          "Straight arm through back (no whip)",
          "Hand leading elbow (casting)",
          "Arm away from body (not brushing hip)"
        ],
        biomechanicalBenchmarks: {
          elbowFlexion: "30-45 degrees at back of circle",
          internalRotationVelocity: "6000-8000 degrees/second",
          shoulderVelocityContribution: "40-60% of total ball velocity"
        }
      },
      {
        phase: "5. Release and Follow-Through",
        timing: "0.45-0.55s",
        keyPoints: [
          "Release point consistent (within 2-3 inch zone)",
          "Wrist snap creates final spin and velocity",
          "Drag foot maintains ground contact OR lifts after release",
          "Follow through across body",
          "Deceleration protects shoulder"
        ],
        commonErrors: [
          "Inconsistent release point (control issues)",
          "No wrist snap (reduced velocity and spin)",
          "Drag foot lifting early (balance/power leak)",
          "No follow-through (injury risk)"
        ],
        biomechanicalBenchmarks: {
          releaseHeight: "Fastball: hip to mid-thigh, Riseball: mid-thigh to knee",
          releasePointConsistency: "Within 3 inches vertically for control",
          wristSnapContribution: "8-12% of velocity, 100% of spin quality"
        }
      }
    ]
  },

  velocityGeneration: {
    description: "Breaking down the physics of pitch velocity",
    contributors: [
      {
        source: "Lower Body (Legs and Hips)",
        contribution: "35-45% of velocity",
        mechanism: "Ground reaction force → hip drive → rotational momentum",
        training: "Squats, lunges, explosive jumps, rotational medicine ball throws",
        assessment: "Measure: stride length, hip rotation velocity, weight transfer timing"
      },
      {
        source: "Core (Obliques and Abs)",
        contribution: "20-25% of velocity",
        mechanism: "Transfers energy from lower to upper body, creates separation",
        training: "Rotational core work, medicine ball slams, pallof press",
        assessment: "Measure: hip-shoulder separation angle, torso rotation velocity"
      },
      {
        source: "Shoulder (Internal Rotation)",
        contribution: "25-35% of velocity",
        mechanism: "Internal rotators (subscapularis, pec major, lat) create rapid rotation",
        training: "Resistance band internal rotation, long toss, weighted balls (carefully)",
        assessment: "Measure: internal rotation velocity, arm slot angle"
      },
      {
        source: "Forearm/Wrist (Snap)",
        contribution: "10-15% of velocity, nearly 100% of spin",
        mechanism: "Wrist flexion and pronation/supination creates spin axis",
        training: "Wrist curls, football spins, rice bucket exercises",
        assessment: "Measure: wrist angle at release, spin rate (Rapsodo)"
      }
    ],

    velocityByAge: {
      "8U": { average: "32-38 mph", advanced: "39-43 mph", elite: "44-48 mph" },
      "10U": { average: "38-44 mph", advanced: "45-50 mph", elite: "51-55 mph" },
      "12U": { average: "45-52 mph", advanced: "53-58 mph", elite: "59-63 mph" },
      "14U": { average: "52-58 mph", advanced: "59-63 mph", elite: "64-67 mph" },
      "16U": { average: "56-62 mph", advanced: "63-66 mph", elite: "67-70 mph" },
      "18U": { average: "58-64 mph", advanced: "65-68 mph", elite: "69-72 mph" },
      "College": { average: "62-67 mph", advanced: "68-71 mph", elite: "72-77 mph" }
    }
  },

  injuryRiskFactors: {
    description: "Biomechanical red flags that increase injury risk",
    
    shoulderInjuryRisk: [
      {
        risk: "Insufficient Hip-Shoulder Separation",
        mechanism: "Increases load on shoulder to generate velocity",
        threshold: "<30 degrees separation = HIGH RISK",
        correction: "Hip drive drills, separation work, video feedback"
      },
      {
        risk: "Arm-Dominant Pitching",
        mechanism: "Shoulder compensates for lack of lower body power",
        indicator: "Low stride length + high arm velocity = overuse pattern",
        correction: "Leg drive emphasis, stride length work, kinetic chain drills"
      },
      {
        risk: "Straight Arm Through Back",
        mechanism: "Reduces whip, increases stress on anterior shoulder",
        indicator: "Elbow angle >160 degrees at back of circle",
        correction: "Elbow lead drills, wall touch drill (45° angle)"
      },
      {
        risk: "Excessive Pitch Volume",
        mechanism: "Accumulated microtrauma without adequate recovery",
        threshold: {
          "10U": ">60 pitches/game, >100/week",
          "12U": ">75 pitches/game, >125/week",
          "14U+": ">100 pitches/game, >150/week"
        },
        correction: "Enforce pitch counts, mandatory rest, year-round breaks"
      }
    ]
  },

  spinMechanics: {
    riseball: {
      spinAxis: "12-6 (backspin)",
      optimalRPM: "1400-1800 RPM",
      magnusEffect: "Backspin creates upward force opposing gravity",
      mechanics: "Force directed UNDER ball, aggressive wrist supination",
      releasePoint: "Lower than fastball (mid-thigh to knee)",
      efficiency: ">60% spin efficiency for effective rise",
      commonError: "Insufficient backspin (<60%), force not under ball"
    },
    
    dropball: {
      spinAxis: "6-12 (topspin)",
      optimalRPM: "1200-1600 RPM",
      magnusEffect: "Topspin accelerates downward movement",
      mechanics: "Force directed OVER ball, wrist pronation",
      releasePoint: "Later than fastball, more forward",
      efficiency: ">55% spin efficiency",
      commonError: "Insufficient topspin, early release"
    },
    
    curveball: {
      spinAxis: "3-9 or 9-3 (sidespin)",
      optimalRPM: "1000-1400 RPM",
      magnusEffect: "Sidespin creates lateral movement",
      mechanics: "Cut ball with fingers, wrist turn at release",
      releasePoint: "Similar to fastball but different finger pressure",
      efficiency: ">50% spin efficiency",
      commonError: "Rolling wrist too early, inconsistent axis"
    },
    
    changeup: {
      spinAxis: "Similar to fastball but slower",
      optimalRPM: "800-1200 RPM",
      goal: "Same arm speed, reduced velocity (8-12 mph slower)",
      mechanics: "Circle change grip, ball deeper in palm",
      releasePoint: "Identical to fastball (critical for deception)",
      efficiency: "Deception > spin",
      commonError: "Slowing arm, changing release point"
    }
  }
};

// ============================================================================
// HITTING BIOMECHANICS - Detailed Analysis Framework
// ============================================================================

export const HITTING_BIOMECHANICS = {
  swingPhases: {
    description: "Breaking down the swing into analyzable segments",
    
    phase1_Stance: {
      timing: "Pre-pitch",
      keyPoints: [
        "Balanced weight distribution (50/50 or 60/40 back leg)",
        "Knees slightly bent (athletic position)",
        "Hands at shoulder height, back elbow down",
        "Eyes level, tracking pitcher"
      ],
      biomechanics: {
        centerOfMass: "Over or slightly behind center",
        baseWidth: "Shoulder width or slightly wider",
        handPosition: "Behind back shoulder, 6-8 inches from body"
      }
    },

    phase2_Load: {
      timing: "As pitch is released (0.00-0.15s)",
      keyPoints: [
        "Weight shifts back (70-80% on back leg)",
        "Hands move back slightly (coil)",
        "Front foot lifts or taps (trigger mechanism)",
        "Hip and shoulder coil creates separation",
        "Head stays still, eyes on ball"
      ],
      biomechanics: {
        hipCoil: "15-25 degrees closed from starting position",
        shoulderCoil: "Additional 10-15 degrees beyond hips",
        loadDepth: "Hands move 3-6 inches back and slightly up",
        timing: "Load completes as ball releases from pitcher's hand"
      },
      commonErrors: [
        "No load (flat footed)",
        "Over-rotation (coiling too much)",
        "Loading too late or too early",
        "Head moving during load"
      ]
    },

    phase3_Stride: {
      timing: "Ball flight (0.15-0.30s)",
      keyPoints: [
        "Front foot strides toward pitcher (soft landing)",
        "Stride length 50-70% of hitter's height",
        "Foot lands slightly closed (knuckles point at pitcher)",
        "Weight still on back leg (70-80%)",
        "Hands stay back ('separation')",
        "Front knee soft (15-20 degree bend)"
      ],
      biomechanics: {
        strideLength: "Optimal ~60% of height for youth",
        footPlant: "Closed 10-20 degrees from straight",
        weightDistribution: "75% back, 25% front at foot plant",
        separation: "Hands 12-18 inches behind front hip at foot plant"
      },
      commonErrors: [
        "Lunging (weight shifts forward)",
        "Stride too long (>80% height)",
        "Stride opens up early",
        "Hands drift forward",
        "Stiff front leg"
      ]
    },

    phase4_Rotation: {
      timing: "Commit to swing (0.30-0.42s)",
      keyPoints: [
        "Back hip fires FIRST (initiates rotation)",
        "Rotation occurs on front leg axis",
        "Weight transfers forward (60-70% front at contact)",
        "Back foot pivots (squish the bug)",
        "Hands stay inside ball path",
        "Barrel enters hitting zone early, stays long"
      ],
      biomechanics: {
        hipRotationVelocity: "600-800 deg/sec (elite)",
        sequencing: "Hips → Torso (30-50ms delay) → Shoulders → Hands",
        hipShoulderSeparation: "40-60 degrees at peak",
        handPath: "Downward then level through zone (attack angle)",
        batSpeed: "Peak velocity just before contact"
      },
      commonErrors: [
        "Arms initiate instead of hips",
        "Hips and shoulders rotate together",
        "Casting (hands away from body)",
        "Dropping back shoulder (uppercut)",
        "Rolling over front side too early"
      ]
    },

    phase5_Contact: {
      timing: "Ball impact (0.40-0.45s)",
      keyPoints: [
        "Contact point varies by pitch location",
        "Inside pitch: contact out front",
        "Outside pitch: contact deeper (back of plate)",
        "Weight 60-70% on front leg",
        "Back foot on toe, heel up",
        "Head down, eyes on contact point",
        "Hands palm-up, palm-down at contact"
      ],
      biomechanics: {
        batSpeed: "65-75 mph (elite HS), 55-65 mph (14U)",
        attackAngle: "+5 to +15 degrees (matching pitch plane)",
        launchAngle: "10-25 degrees for optimal results",
        exitVelocity: "Function of bat speed + pitch velocity + contact quality",
        contactTime: "1-2 milliseconds (yes, really that fast!)"
      },
      commonErrors: [
        "Head pulling off ball",
        "Weight stuck on back side",
        "Bat head drag (hands ahead of barrel)",
        "Rolling wrists early",
        "Poor pitch recognition (swinging at bad pitch)"
      ]
    },

    phase6_Extension: {
      timing: "Post-contact (0.45-0.55s)",
      keyPoints: [
        "Arms extend through contact zone",
        "Drive through ball, don't stop at contact",
        "Weight continues shifting forward",
        "Back shoulder finishes high",
        "Balance maintained through finish"
      ],
      biomechanics: {
        extensionLength: "Barrel travels 18-24 inches past contact",
        followThrough: "Barrel finishes over front shoulder",
        balancePoint: "Finish on front leg, back toe dragging"
      },
      commonErrors: [
        "No extension (stopping at contact)",
        "Falling off balance",
        "Pulling off ball",
        "No follow-through"
      ]
    }
  },

  exitVelocityFactors: {
    description: "What creates hard-hit balls",
    
    formula: "Exit Velo = f(Bat Speed, Pitch Velocity, Contact Quality, Attack Angle)",
    
    batSpeed: {
      contribution: "~70-80% of exit velocity",
      development: "Strength training, proper mechanics, intent",
      benchmarks: {
        "10U": "40-50 mph",
        "12U": "50-60 mph",
        "14U": "55-65 mph",
        "16U": "60-70 mph",
        "18U/College": "65-75 mph"
      }
    },
    
    contactQuality: {
      contribution: "~15-20% variance",
      sweetSpot: "Barrel contact 2-3 inches from end of bat",
      timing: "Ball meets barrel at peak bat speed",
      angle: "Matching attack angle to pitch plane"
    },
    
    attackAngle: {
      description: "Bat path angle through hitting zone",
      optimal: "+5 to +15 degrees (slightly upward)",
      rationale: "Matches typical fastpitch pitch plane (8-10 degrees down)",
      measurement: "Angle of barrel relative to ground at contact"
    }
  },

  commonMechanicalIssues: {
    casting: {
      description: "Hands push away from body, creating long swing",
      biomechanicalCause: "Failure to maintain connection, early extension",
      identifying: "Elbow moves away from body, hands lead barrel",
      fixes: [
        "Connection drills (towel under front arm)",
        "Inside-out tee work",
        "Emphasis on hand path staying tight",
        "Short stroke drills"
      ]
    },
    
    lunging: {
      description: "Weight shifts forward prematurely",
      biomechanicalCause: "Poor timing, weak back leg, lack of load",
      identifying: "Weight 50%+ on front leg before swing starts",
      fixes: [
        "Load emphasis drills",
        "Balance drills (finish on back leg)",
        "Timing work (stride early, swing late)",
        "Weight shift awareness"
      ]
    },
    
    noHipRotation: {
      description: "Arms-only swing, no lower body engagement",
      biomechanicalCause: "Lack of hip initiation, poor sequencing",
      identifying: "Hips square at contact, low bat speed despite effort",
      fixes: [
        "Hip turn drills",
        "Lower body initiates",
        "Rotational medicine ball work",
        "No-stride hitting (eliminate stride, focus on rotation)"
      ]
    },
    
    pullingOff: {
      description: "Head and body pull away from plate",
      biomechanicalCause: "Fear, spinning open, poor balance",
      identifying: "Head moves toward dugout, weak contact to opposite field",
      fixes: [
        "Head down drills",
        "Opposite field emphasis",
        "Balance and posture work",
        "Soft toss forcing opposite field"
      ]
    }
  }
};

// ============================================================================
// CATCHING BIOMECHANICS
// ============================================================================

export const CATCHING_BIOMECHANICS = {
  receivingMechanics: {
    primaryStance: {
      keyPoints: [
        "Feet shoulder-width, weight on balls of feet",
        "Knees bent 90-100 degrees",
        "Glove target presented early and still",
        "Throwing hand protected (behind back or loose fist next to glove)"
      ],
      biomechanics: {
        centerOfMass: "Low and balanced",
        hipFlexion: "90-100 degrees for stability and mobility",
        ankleFlexion: "Adequate dorsiflexion for comfortable squat"
      }
    },

    framingBiomechanics: {
      concept: "Make borderline pitches look like strikes through subtle glove movement",
      technique: [
        "Receive ball with quiet hands (no sudden movement)",
        "Subtle pull toward strike zone (1-2 inches max)",
        "Hold presentation for 0.5-1.0 seconds",
        "Wrist stiffness (don't let ball push glove back)"
      ],
      researchFindings: "Elite framers gain 1-2 strikes per game = significant run prevention"
    }
  },

  popTimeBreakdown: {
    description: "Time from ball hitting glove to ball reaching 2B bag",
    
    components: [
      {
        component: "Receiving to Release",
        eliteTime: "0.6-0.7 seconds",
        averageTime: "0.8-1.0 seconds",
        subPhases: [
          "Catch to exchange: 0.15-0.25s",
          "Footwork and throw: 0.45-0.65s"
        ]
      },
      {
        component: "Ball Flight",
        distance: "127 feet (home to 2B)",
        throwVelocity: "60-70 mph (elite HS/college)",
        flightTime: "1.2-1.4 seconds"
      }
    ],

    totalPopTime: {
      elite: "1.8-2.0 seconds",
      college: "1.9-2.1 seconds",
      highSchool: "2.0-2.3 seconds",
      youth14U: "2.3-2.6 seconds",
      youth12U: "2.5-3.0 seconds"
    },

    optimization: {
      exchange: "Clean transfer, minimal wasted movement",
      footwork: "Quick, efficient (step-replace or jump pivot)",
      throwingMechanics: "Short arm action, accurate release",
      anticipation: "Know situation, read pitcher, quick decision"
    }
  },

  blockingBiomechanics: {
    technique: [
      "Drop to knees (don't dive forward)",
      "Chest over ball (form wall)",
      "Glove between legs, palm down",
      "Chin tucked, eyes on ball",
      "Redirect ball to front (keep in front of plate)"
    ],
    
    physics: "Goal is absorption and redirection, not catching",
    
    reactionTime: "Ball in dirt recognition to block initiation: 0.15-0.25 seconds",
    
    keys: [
      "Quick drop (explosiveness)",
      "Body angle (keep ball in front)",
      "Relaxation (rigid = bad bounce)",
      "Recovery (locate ball, make play if possible)"
    ]
  }
};

// ============================================================================
// FIELDING BIOMECHANICS (Infield & Outfield)
// ============================================================================

export const FIELDING_BIOMECHANICS = {
  infieldMechanics: {
    readyPosition: {
      timing: "As pitch is delivered",
      stance: "Feet shoulder-width, knees bent, weight forward on balls of feet",
      hands: "Relaxed and low, ready to move",
      eyes: "On hitter, tracking ball off bat"
    },

    groundBallApproach: {
      firstStep: "Explosive in direction of ball (crossover or drop step)",
      footwork: "Right-left-field for right-handed throwers",
      bodyPosition: "Low to ground, butt down (not bending at waist)",
      gloveAngle: "Fingers down, glove open, working ground-up",
      fieldingPosition: "Out front of body, between feet, centerline aligned"
    },

    transferAndRelease: {
      exchange: "Ball to throwing hand: 0.1-0.2 seconds (elite)",
      footwork: "Shuffle steps or crow hop to gain momentum toward target",
      armAction: "Short, quick (not long wind-up)",
      releaseTime: "From field to release: 0.4-0.7 seconds (elite infield)",
      accuracy: "More important than velocity - hit the target"
    },

    positionSpecific: {
      shortstop: {
        armStrength: "Highest in infield (longest throw: 90-100+ feet)",
        range: "Superior lateral movement required",
        armSlots: "Over-top primary, multiple slots for plays"
      },
      secondBase: {
        quickFeet: "Fastest pivot on double plays",
        armStrength: "Moderate (60-70 feet throws)",
        specialty: "Double play feed and pivot"
      },
      thirdBase: {
        reactions: "Quickest reaction time needed (hot corner)",
        armStrength: "Strong and accurate",
        charging: "Aggressive approach on bunts and slow rollers"
      }
    }
  },

  outfieldMechanics: {
    readAndRoute: {
      readPhase: "0.0-0.2s after contact",
      keys: [
        "Watch ball off bat (angle, speed, spin)",
        "Anticipate landing zone",
        "First step direction critical"
      ]
    },

    flyBallBiomechanics: {
      dropStep: "First move - drop step with foot on ball side",
      running: "Turn and run, don't backpedal",
      gloveWork: "Keep glove close to body until last moment",
      catchingPosition: "Over throwing shoulder, two hands, momentum toward target"
    },

    throwingMechanics: {
      crowHop: {
        purpose: "Generate momentum for strong, accurate throw",
        technique: "Skip-step gathering momentum, back foot lands as arm reaches back",
        power: "Uses lower body to add 10-15 mph to throw"
      },
      
      armAction: {
        backswing: "Long, fluid arm circle (not short like infield)",
        release: "Over-top or high 3/4 for carry",
        followThrough: "Across body, decelerate arm safely"
      },

      targets: {
        cutoffMan: "Chest-high, on line",
        bases: "One-hop preferred (easier to handle than fly ball)",
        velocity: "60-70 mph (elite HS/college outfield)"
      }
    }
  }
};

// ============================================================================
// MEDIAIPE INTEGRATION - Specific Measurements
// ============================================================================

export const MEDIAPIPE_ANALYSIS_POINTS = {
  pitching: {
    keyLandmarks: [
      "LEFT_HIP", "RIGHT_HIP", "LEFT_SHOULDER", "RIGHT_SHOULDER",
      "LEFT_ELBOW", "RIGHT_ELBOW", "LEFT_WRIST", "RIGHT_WRIST",
      "LEFT_KNEE", "RIGHT_KNEE", "LEFT_ANKLE", "RIGHT_ANKLE"
    ],

    calculatedMetrics: {
      hipShoulderSeparation: {
        calculation: "Angle between hip line and shoulder line in transverse plane",
        landmarks: ["LEFT_HIP", "RIGHT_HIP", "LEFT_SHOULDER", "RIGHT_SHOULDER"],
        optimalRange: "40-50 degrees",
        criticalFrame: "At stride foot contact"
      },

      armSlotAngle: {
        calculation: "Angle of throwing arm at release point",
        landmarks: ["RIGHT_SHOULDER", "RIGHT_ELBOW", "RIGHT_WRIST"] ,
        optimalRange: "160-180 degrees (nearly straight but slight bend)",
        criticalFrame: "At ball release"
      },

      strideLength: {
        calculation: "Distance from pivot foot to stride foot landing",
        landmarks: ["RIGHT_ANKLE", "LEFT_ANKLE"],
        optimalRange: "80-90% of pitcher height",
        criticalFrame: "At stride foot contact"
      },

      dragFootContact: {
        calculation: "Percentage of stride where drag foot maintains ground contact",
        landmarks: ["RIGHT_ANKLE", "RIGHT_FOOT_INDEX"],
        optimalRange: "70-100% of stride",
        assessment: "Y-coordinate consistency of drag foot"
      },

      kneeFlexion: {
        calculation: "Angle at drive knee during load",
        landmarks: ["RIGHT_HIP", "RIGHT_KNEE", "RIGHT_ANKLE"],
        optimalRange: "90-110 degrees",
        criticalFrame: "During load phase"
      }
    }
  },

  hitting: {
    keyLandmarks: [
      "LEFT_HIP", "RIGHT_HIP", "LEFT_SHOULDER", "RIGHT_SHOULDER",
      "LEFT_ELBOW", "RIGHT_ELBOW", "LEFT_WRIST", "RIGHT_WRIST",
      "LEFT_KNEE", "RIGHT_KNEE", "NOSE"
    ],

    calculatedMetrics: {
      hipRotation: {
        calculation: "Angular velocity of hip line from load to contact",
        landmarks: ["LEFT_HIP", "RIGHT_HIP"],
        optimalRange: "600-800 degrees/second",
        measurement: "Frame-by-frame angle change"
      },

      separation: {
        calculation: "Distance from hands to front hip at stride foot contact",
        landmarks: ["RIGHT_WRIST", "LEFT_HIP"],
        optimalRange: "12-18 inches",
        criticalFrame: "Stride foot contact"
      },

      headMovement: {
        calculation: "Displacement of head from stance to contact",
        landmarks: ["NOSE"],
        optimalRange: "<3 inches total movement",
        assessment: "Track X,Y coordinates through swing"
      },

      weightTransfer: {
        calculation: "Center of mass shift from load to contact",
        landmarks: ["CENTER_OF_MASS (calculated from all body points)"],
        optimalRange: "6-12 inches forward",
        assessment: "X-coordinate change of COM"
      }
    }
  },

  catching: {
    calculatedMetrics: {
      exchangeTime: {
        measurement: "Frames from ball contact to throw release",
        conversion: "Frames ÷ FPS = seconds",
        elite: "0.15-0.20 seconds"
      },

      hipRotation: {
        calculation: "Hip angle change from receive to throw",
        landmarks: ["LEFT_HIP", "RIGHT_HIP"],
        optimal: "90-110 degrees rotation toward target"
      }
    }
  }
};

// ============================================================================
// AI COACHING PROMPTS - Context for Feedback Generation
// ============================================================================

export const BIOMECHANICS_COACHING_CONTEXT = {
  promptTemplate: `
You are an expert biomechanics analyst and softball coach. 

PLAYER CONTEXT:
- Age: {age}
- Position: {position}
- Skill Level: {skillLevel}

BIOMECHANICAL DATA:
{metrics}

DETECTED ISSUES:
{issues}

STRENGTH AREAS:
{strengths}

BIOMECHANICAL BENCHMARKS FOR THIS AGE:
{ageBenchmarks}

KINETIC CHAIN PRINCIPLES:
{kineticChain}

Your task:
1. Explain detected issues in simple terms (ages 8-16 audience)
2. Connect issues to performance (why it matters)
3. Provide 2-3 specific corrective focuses with drills
4. Be encouraging - emphasize growth potential
5. Prioritize injury prevention for youth athletes
6. Reference proper biomechanical sequencing
`,

  exampleAnalysis: {
    issue: "Low hip-shoulder separation (22 degrees, target: 40-50 degrees)",
    explanation: "Your hips and shoulders are rotating together instead of your hips leading first. Think of it like wringing out a towel - you need that twist to create power!",
    impact: "This is reducing your velocity by about 5-8 mph. You're relying too much on your arm instead of using your whole body.",
    correction: "Focus on: 1) Hip drive drills where your hips fire FIRST, 2) Separation wall drills, 3) Video feedback to feel the difference",
    encouragement: "The good news? Your arm mechanics are solid! Once we add hip-shoulder separation, you'll see a big velocity jump.",
    safety: "This also protects your shoulder - using your whole body means less stress on your arm."
  }
};

export default {
  PITCHING_BIOMECHANICS,
  HITTING_BIOMECHANICS,
  CATCHING_BIOMECHANICS,
  FIELDING_BIOMECHANICS,
  MEDIAPIPE_ANALYSIS_POINTS,
  BIOMECHANICS_COACHING_CONTEXT
};
