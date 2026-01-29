/**
 * COMPREHENSIVE SOFTBALL KNOWLEDGE BASE
 * SoftballProAI Brain - Complete Training Encyclopedia
 * 
 * This file contains exhaustive softball knowledge across all positions,
 * coaching techniques, biomechanics, and training methods.
 * Updated: January 2026
 */

// ============================================================================
// PITCHING KNOWLEDGE - Mechanics, Training, and Expert Insights
// ============================================================================

export const PITCHING_KNOWLEDGE = {
  fundamentals: {
    windmillMechanics: {
      description: "The windmill pitch is broken into three main segments: upper half, lower half, and arm circle",
      keyPhases: [
        "Stance and Load Position",
        "Leg Drive and Weight Transfer",
        "Arm Circle (top to bottom)",
        "Hip-Shoulder Separation",
        "Release Point",
        "Follow Through and Drag Foot Finish"
      ],
      criticalMechanics: {
        elbowBend: "Elbow must bend coming down the back side of the circle to enable proper arm whip. The elbow leads, NOT the hand.",
        internalRotation: "Shoulder internal rotation generates 40-60% of pitch velocity. This is THE primary velocity source.",
        dragFoot: "Active stabilizer maintaining ground contact. Posterior chain pulls through dirt rather than lifting.",
        hipShoulder: "Hips fire first, creating 40-50 degrees of separation. This loads the core like a rubber band in stretch-shortening cycle."
      }
    },
    
    gripFundamentals: {
      fourSeam: "Primary pitch to master first. Requires 60% strike accuracy before advancing. Use 'C' seams with fingertips on seams, thumb aligned with middle finger, fingers slightly curled for spin.",
      riseBall: "Pointer finger dug into seam. Requires 1400+ RPM backspin with 12-6 axis. Magnus effect creates upward force.",
      changeup: "Circle change grip with ball cupped in palm to reduce velocity 8-12 mph.",
      dropBall: "Topspin oriented 6-12 axis. Released slightly later than fastball."
    },
    
    velocityGeneration: {
      primarySources: [
        "Internal rotation of shoulder (40-60%)",
        "Hip-shoulder separation (20-25%)",
        "Leg drive and weight transfer (15-20%)",
        "Wrist snap and finger roll (10-15%)"
      ],
      benchmarks: {
        "10U": "35-42 mph",
        "12U": "42-50 mph", 
        "14U": "50-58 mph",
        "16U": "56-63 mph",
        "18U": "58-68 mph",
        "College": "62-72 mph",
        "Elite": "70-77 mph (Monica Abbott record: 77 mph)"
      }
    }
  },

  expertInsights: {
    amandaScarborough: {
      philosophy: "There is no single 'correct' way to pitch. Elite pitchers like Monica Abbott, Cat Osterman, and Lisa Fernandez use varying techniques but all achieved Olympic-level success.",
      gloveHandVariation: "Abbott uses 'thumb up' position while Fernandez uses 'thumb down' - both work at elite level",
      coachingPrinciple: "Pitchers should adopt mechanics that feel comfortable and confident for their individual bodies rather than forcing standardized technique"
    },
    
    monicaAbbott: {
      specialty: "Rise ball as signature pitch",
      approach: "Analyzes opposing hitters' metrics, throws harder (up to 70 mph)",
      records: "NCAA Division I records: 189 career victories, 112 shutouts, 2,440 strikeouts"
    },
    
    catOsterman: {
      specialty: "Drop ball specialist",
      approach: "Keeps mechanics simpler, throws slower (62 mph), specializes in pitches down in zone",
      strength: "Focuses extensively on drop ball during bullpen sessions"
    },
    
    paisleysPitching: {
      velocityDevelopment: "Two primary methods: isometrics and long toss with progressive overload",
      isometrics: "Focus on positions like takeoff and finish - both athletic and pitching-specific",
      longToss: "Progressive overload increasing reps and distance weekly",
      riseballTraining: "Requires efficient spin (over 60% backspin) with force directed under ball. Use weighted 9oz softballs and football spinning drills from whip position."
    }
  },

  trainingDrills: {
    fundamental: [
      {
        name: "Target Practice",
        purpose: "Accuracy development",
        description: "Focus on hitting specific zones with consistent mechanics"
      },
      {
        name: "Bucket Toss",
        purpose: "Unpredictable situations",
        description: "Random ball placement to develop adaptability"
      },
      {
        name: "Knee-Up Drills",
        purpose: "Leg drive isolation",
        description: "Focus on explosive power from drive leg"
      },
      {
        name: "One-Knee Drills",
        purpose: "Upper body mechanics",
        description: "Isolate arm circle without leg involvement"
      }
    ],
    
    advanced: [
      {
        name: "Elbow Lead Wall Drill",
        purpose: "Proper elbow bend mechanics",
        description: "Stand 45 degrees to wall, touch wall with elbow (not hand) during arm circle. Perform 50-100 times daily.",
        expertSource: "Fastpitch Lane"
      },
      {
        name: "Knee Drive Drill",
        purpose: "Explosive leg power",
        description: "Focus on driving through with push leg"
      },
      {
        name: "Hip-Shoulder Separation Work",
        purpose: "Power generation",
        description: "Hip fires first, shoulder follows - create elastic stretch"
      }
    ],
    
    gameSituation: [
      "3-Minute Drill - Simulate pressure situations",
      "First Batter Out Drill - Focus on first pitch strikes",
      "Rapid Fire Pitching - Build endurance and consistency",
      "Live Batting Practice - Game-speed repetitions",
      "Full Count Challenges - High-pressure decision making",
      "Bases Loaded Scenarios - Mental toughness under pressure"
    ]
  }
};

// ============================================================================
// HITTING KNOWLEDGE - Swing Mechanics and Exit Velocity Training
// ============================================================================

export const HITTING_KNOWLEDGE = {
  mechanicsDifferences: {
    fastpitchVsBaseball: {
      releasePoint: "Fastpitch: 3-4 feet high vs Baseball: 7 feet",
      ballFlight: "High arc of 35-60 mph requiring more direct path to ball",
      importance: "Softball-specific coaching is ESSENTIAL. Applying baseball-only principles damages swing development.",
      swingPath: "Fastpitch requires more direct, less looping path due to pitch trajectory"
    }
  },

  keyMetrics: {
    exitVelocity: {
      description: "Primary metric for measuring hitting quality - reflects timing, mechanics, and contact quality",
      benchmarks: {
        "Youth (10U-12U)": "45-55 mph",
        "14U": "55-65 mph",
        "High School (16U-18U)": "65-75 mph",
        "College": "75-85 mph",
        "Elite": "85+ mph"
      },
      impact: "5 mph exit velocity increase correlates to 18-62% higher batting average at MLB level",
      realResults: "Rachel Garcia added 11 mph in single 30-minute session. Teams average 7 mph increases with proper training."
    },
    
    timeToContact: {
      professional: "0.14-0.18 seconds",
      collegeTravel: "0.15-0.21 seconds (16U-18U)",
      highSchool: "0.16-0.22 seconds"
    },
    
    blastFactorScore: {
      professional: "78-92",
      college: "67-83",
      highSchoolVarsity: "45-65",
      components: "Attack angle and on-plane efficiency weighted heavily"
    }
  },

  essentialMechanics: {
    timing: {
      priority: "MOST overlooked but critical component",
      principle: "Without proper timing, good mechanics alone lead to weak results",
      evaluationOrder: [
        "1. Strike selection (pitch recognition)",
        "2. Feeling on-time during swings",
        "3. Mechanical adjustments"
      ]
    },
    
    sequencing: {
      properOrder: [
        "Weight shift and load",
        "Hip rotation (fires first)",
        "Torso rotation (follows hips)",
        "Hands and bat path",
        "Contact and extension",
        "Follow through"
      ],
      separation: "Hip-shoulder separation loads the core - hips must lead"
    },
    
    commonIssues: {
      casting: "Hands drift away from body, creating long swing path. Fix: Keep hands inside, lead with elbow",
      lunging: "Weight shifts too early. Fix: Stay back, proper load timing",
      uppercut: "Swing plane too steep. Fix: Level through zone, match pitch plane",
      rollingOver: "Hands roll too early. Fix: Stay through ball, opposite field focus",
      noHipRotation: "All arms, no power. Fix: Hip drive, kinetic chain sequencing"
    }
  },

  trainingApproach: {
    drillStructure: "Short 3-5 swing rounds with minimal feedback between swings to create game-ready conditions",
    focusAreas: "Develop efficient, connected swings that maximize exit velocity through proper sequencing",
    teeWork: "Essential for building muscle memory and testing mechanical changes",
    liveAB: "Must transfer cage work to game situations - practice situational hitting"
  },

  mentalApproach: {
    confidence: "Build pre-AB confidence by recalling past successes, not waiting for results",
    approach: "Have a plan for each pitch location and count",
    visualization: "See successful at-bat before stepping in box"
  }
};

// ============================================================================
// CATCHING KNOWLEDGE - Framing, Blocking, and Throwing
// ============================================================================

export const CATCHING_KNOWLEDGE = {
  coreSkills: [
    "Stance (primary and secondary positions)",
    "Receiving and framing", 
    "Blocking balls in dirt",
    "Throwing and pop time",
    "Footwork for steal situations",
    "Body positioning for tags and plate coverage",
    "Pitcher communication and game calling",
    "Conditioning for endurance and injury prevention"
  ],

  blockingProgression: {
    stage1: "Fully geared on knees, work body positioning first",
    stage2: "Progress to squat position using regular balls",
    stage3: "Coach throws overhand to create realistic hops",
    goal: "Stay down and block ball back to plate",
    
    keyDrills: {
      catchBlockFake: "Coach throws from 30 feet, mixing strikes with dirt balls at random to develop reactive blocking",
      shadowBlocking: "No ball - coach signals location, catcher assumes blocking position for form check",
      dropBlockRise: "Move along line of 6-10 balls, dropping into blocking position at each while keeping glove low"
    }
  },

  framingTechniques: {
    softHands: "Catch and stick - no stabbing or loud glove",
    glovePresentation: "Show pitch to umpire, subtle pull toward zone",
    quietGlove: "Silent catch indicates proper receiving technique",
    funneling: "Smooth motion bringing ball to body, not jerky movements",
    
    drills: [
      "Mock throwing motion from one knee - focus on arm motion, wrist flex, release",
      "Grip drill from knees - pick up balls from different angles for quick 4-seam grip",
      "Tennis ball wall throws - underhand throw and catch with throwing arm for hand-eye coordination"
    ]
  },

  throwingAndPopTime: {
    popTimeBenchmarks: {
      "Youth": "2.5-3.0 seconds",
      "14U": "2.3-2.6 seconds",
      "16U-18U": "2.0-2.3 seconds",
      "College": "1.8-2.1 seconds",
      "Elite": "1.7-1.9 seconds"
    },
    
    components: {
      exchange: "Clean ball transfer from glove to throwing hand",
      footwork: "Quick feet - gain ground toward target",
      armPath: "Short, quick release - not long wind-up",
      accuracy: "Hit target consistently - velocity without accuracy is useless"
    },
    
    training: "Master technique before increasing speed. Proper form prevents injury and improves results."
  }
};

// ============================================================================
// INFIELD KNOWLEDGE - Footwork, Fielding, and Throwing
// ============================================================================

export const INFIELD_KNOWLEDGE = {
  footworkPrinciples: {
    basePosition: "Low athletic positioning by bending at knees, NOT waist",
    movement: "Short, quick steps maintain speed and body control",
    patterns: {
      groundBalls: "Right-left-field: Right foot gets low, left foot steps through",
      lateralMovement: "Shuffle without crossing feet to maintain balance",
      transition: "Short steps after fielding to proper throwing position"
    }
  },

  fieldingTechniques: {
    handPosition: {
      glovePlacement: "Fingers down for ground balls, up for waist-high",
      softHands: "Give with ball, don't fight it",
      twoHands: "Secure ball with throwing hand immediately",
      centerline: "Field ball in front of body, aligned with center"
    },
    
    approach: {
      speed: "Under control - don't charge too fast",
      balance: "Athletic position maintained throughout",
      eyeContact: "Watch ball all the way into glove"
    }
  },

  essentialDrills: {
    sideToSide: "Shuffle laterally without crossing feet, field grounders between feet while staying low",
    infieldFootwork: "Sprint to ball, fire to second, sprint to first, receive and throw home - develops double play footwork and conditioning",
    rapidFireFootwork: "Focus on body control and quick transition to throwing position using short steps",
    throwingOnRun: "Catch-to-throw transitions, coordination, and ball handling",
    handsRoutine: "Progress from knees (glove angle focus) to wide base (add footwork) to full movement"
  },

  positionSpecific: {
    firstBase: {
      receiving: "Stretch toward throw while maintaining contact with base",
      footwork: "Know when to come off bag for bad throws",
      scoops: "Essential skill for saving errors on short hops"
    },
    
    secondBase: {
      doublePlay: "Quick pivot at bag, multiple footwork options (inside, outside, jump)",
      range: "Cover large area with lateral agility",
      communication: "Constant talk with shortstop and first base"
    },
    
    shortstop: {
      armStrength: "Longest throw in infield - requires strong, accurate arm",
      range: "Athletic ability to cover ground in both directions",
      leadership: "Quarterback of infield, directs traffic"
    },
    
    thirdBase: {
      reactions: "Hot corner requires quick reflexes",
      charging: "Aggressive approach on slow rollers and bunts",
      armAngle: "Strong, accurate throws from different arm slots"
    }
  }
};

// ============================================================================
// OUTFIELD KNOWLEDGE - Fly Balls, Routes, and Arm Strength
// ============================================================================

export const OUTFIELD_KNOWLEDGE = {
  fundamentals: {
    stance: "Athletic position with square shoulders toward home plate, thumbs up",
    readyPosition: "Weight on balls of feet, prepared to move in any direction",
    firstMove: "Drop step with foot closest to ball's direction"
  },

  flyBallTechnique: {
    dropStep: "First movement - step with foot on side ball is hit",
    overheadBalls: "Drop step toward glove side",
    running: "Glove tucked close to body until last second",
    positioning: "Get behind ball to transition into throw - move forward, don't backpedal",
    catching: "Catch at eye level on throwing side with two hands for quick transition"
  },

  routes: {
    straightBack: "Sprint straight back, easiest angle",
    fortyFiveDegrees: "Angle back - most common",
    ninetyDegrees: "Straight lateral - difficult, requires quick break",
    oneThirtyFive: "Angle in - easiest, coming forward",
    communication: "Call ball loudly and early, defer to center fielder on overlap"
  },

  throwingMechanics: {
    crowHop: {
      purpose: "Generate momentum for long-distance throws",
      technique: "Leap forward, raise throwing arm knee first then glove knee, throw when back foot lands",
      followThrough: "Complete the throw for maximum power and accuracy"
    },
    
    grip: "Across the seams with thumb splitting index and middle fingers for backspin",
    release: "Fingers on top of ball create backspin for straighter, longer throws",
    extension: "Release out in front with good arm extension",
    
    armStrength: "Must be able to throw home from outfield with one-hop accuracy"
  },

  essentialDrills: {
    youngPlayers: [
      "Self-toss and throw: Practice moving into ball when catching",
      "Outfield range drill: Develop horizontal movement",
      "Tennis ball drill: Drop steps and directional movement without glove",
      "Turned back drill: React to balls while facing away initially"
    ],
    
    advanced: [
      "Quarterback drill: Run from multiple angles (straight back, 45°, 90°, 135°) keeping glove tucked",
      "Crow hop progression: Perfect transition to throws",
      "Do-or-die drill: Charge ball and make quick, accurate throw",
      "Shoe string catch drill: Low balls requiring full extension"
    ]
  },

  positionSpecific: {
    leftField: "Pull side power - expect more balls, need solid arm for throw to third",
    centerField: "Most athletic outfielder, covers most ground, calls off corner outfielders",
    rightField: "Strongest arm for throws to third, cover first base on bunts"
  }
};

// ============================================================================
// BIOMECHANICS ANALYSIS FRAMEWORK
// ============================================================================

export const BIOMECHANICS_FRAMEWORK = {
  kineticChain: {
    definition: "Sequential activation of body segments from large to small, proximal to distal",
    properSequence: "Ground → Legs → Hips → Torso → Shoulders → Arm → Hand → Implement",
    efficiency: "Each segment reaches peak velocity as previous segment decelerates, transferring energy",
    leaks: "Any break in chain reduces power transfer - most common: hips and shoulders rotating together"
  },

  forceGeneration: {
    groundReactionForce: "Push into ground creates equal and opposite force - foundation of all power",
    hipDrive: "Largest muscles generate most force - hips are power source",
    separation: "Hip-shoulder separation creates elastic energy storage",
    transfer: "Core transfers lower body power to upper body and implement"
  },

  injuryPrevention: {
    shoulderCare: {
      concern: "Overhead athletes at high risk for rotator cuff and labrum injuries",
      prevention: [
        "Proper warm-up with arm circles and band work",
        "Strengthening internal and external rotators",
        "Monitor pitch counts and rest periods",
        "Ice after throwing sessions",
        "Scapular stabilization exercises"
      ]
    },
    
    aclPrevention: {
      concern: "Female athletes 4-6x higher ACL injury risk than males",
      prevention: [
        "Posterior chain strengthening (glutes, hamstrings)",
        "Deceleration training",
        "Proper landing mechanics",
        "Single-leg stability work",
        "Avoid valgus knee collapse"
      ]
    }
  },

  videoAnalysisPoints: {
    pitching: [
      "Arm slot angle at release",
      "Hip-shoulder separation degree",
      "Drag foot contact percentage",
      "Release point consistency",
      "Stride length relative to height",
      "Spine angle at release"
    ],
    
    hitting: [
      "Time to contact",
      "Hip rotation speed",
      "Attack angle through zone",
      "Bat speed at contact",
      "Launch angle",
      "Extension through contact"
    ],
    
    catching: [
      "Pop time (catch to tag)",
      "Exchange time",
      "Throwing velocity",
      "Framing quality (pitch movement)",
      "Blocking success rate",
      "Footwork efficiency"
    ],
    
    fielding: [
      "First step quickness",
      "Glove presentation angle",
      "Transfer time",
      "Throwing velocity",
      "Release time",
      "Accuracy to target"
    ]
  }
};

// ============================================================================
// EXPERT SOURCES AND REFERENCES
// ============================================================================

export const EXPERT_SOURCES = {
  pitchingExperts: [
    {
      name: "Amanda Scarborough",
      credentials: "Former Texas A&M pitcher, Olympic player, ESPN analyst",
      specialty: "Pitching mechanics individualization, mental game",
      philosophy: "No single correct way - find what works for individual body type"
    },
    {
      name: "Monica Abbott",
      credentials: "Olympic medalist, fastest pitch record (77 mph), NCAA career leader",
      specialty: "Rise ball mechanics, velocity training, competitive mindset"
    },
    {
      name: "Cat Osterman",
      credentials: "Olympic medalist, Texas Longhorns legend",
      specialty: "Drop ball mastery, pitch sequencing, game strategy"
    },
    {
      name: "Denny Dunn",
      credentials: "Pitching coach, biomechanics specialist",
      specialty: "Scientific approach to pitching mechanics and velocity development"
    },
    {
      name: "Toni Paisley (Paisley's Pitching)",
      credentials: "Professional pitching instructor, app developer",
      specialty: "Structured training programs, velocity development, spin mechanics"
    }
  ],
  
  hittingExperts: [
    {
      name: "Kelly Kretschman",
      credentials: "Olympic gold medalist, Alabama softball",
      specialty: "Slap hitting, speed game, offensive strategy"
    },
    {
      name: "Rachel Garcia",
      credentials: "UCLA star, Olympic player, USA Softball",
      specialty: "Two-way player, power hitting, exit velocity training"
    }
  ],
  
  biomechanics: [
    {
      name: "Dr. James Andrews",
      credentials: "Renowned orthopedic surgeon, ASMI founder",
      specialty: "Throwing biomechanics, injury prevention"
    },
    {
      name: "Kelly Inouye-Perez",
      credentials: "UCLA Head Coach, Olympic coach",
      specialty: "Complete player development, catching instruction"
    }
  ]
};

export default {
  PITCHING_KNOWLEDGE,
  HITTING_KNOWLEDGE,
  CATCHING_KNOWLEDGE,
  INFIELD_KNOWLEDGE,
  OUTFIELD_KNOWLEDGE,
  BIOMECHANICS_FRAMEWORK,
  EXPERT_SOURCES
};
