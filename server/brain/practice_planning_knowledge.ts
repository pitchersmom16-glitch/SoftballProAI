/**
 * PRACTICE PLANNING KNOWLEDGE BASE
 * SoftballProAI Brain - Complete Practice Structure and Planning
 * 
 * Comprehensive guide to planning effective softball practices for all age groups,
 * including station-based drills, time management, and skill development progressions.
 * Updated: January 2026
 */

// ============================================================================
// PRACTICE PLANNING FRAMEWORK
// ============================================================================

export const PRACTICE_FRAMEWORK = {
  philosophy: {
    maxReps: "Station-based practice allows more repetitions in shorter time",
    smallGroups: "Break team into 2-4 groups rotating through stations",
    individualAttention: "Coaches can work more closely with individual players",
    engagement: "Keep all players active - no standing in long lines",
    purposeful: "Every drill should have clear objective tied to game situations"
  },

  practiceComponents: {
    warmUp: {
      duration: "15 minutes",
      activities: [
        "Dynamic stretching (leg swings, arm circles, high knees)",
        "Light jogging or agility ladders",
        "Partner throwing progression (short, medium, long toss)",
        "Arm care exercises for overhead athletes"
      ],
      importance: "Injury prevention and mental transition from school to practice"
    },

    skillDevelopment: {
      duration: "30-40 minutes",
      structure: "Station-based rotations with 2-4 groups",
      stations: [
        "Hitting (live BP, tee work, soft toss)",
        "Fielding (ground balls, fly balls, specific positions)",
        "Throwing/Catching (exchanges, accuracy, pop time)",
        "Base running (leads, steals, sliding)"
      ],
      rotation: "8-12 minutes per station",
      coaching: "Assign coach or parent helper to each station"
    },

    tacticalKnowledge: {
      duration: "15-20 minutes",
      focus: "Situational softball - game IQ development",
      activities: [
        "Cutoff and relay positioning",
        "First and third defense",
        "Rundowns and tags",
        "Bunt coverage",
        "Communication drills",
        "Game situation decision-making"
      ],
      method: "Walk-through then live simulation"
    },

    conditioning: {
      duration: "10-15 minutes",
      focus: "Softball-specific fitness",
      activities: [
        "Sprint work (bases, home to second)",
        "Agility drills",
        "Core strengthening",
        "Speed and quickness training"
      ],
      placement: "Can be integrated throughout or at end",
      note: "Keep it fun for youth - competition and games"
    },

    coolDown: {
      duration: "5-10 minutes",
      activities: [
        "Static stretching",
        "Team huddle and review",
        "Announcements for next practice/game",
        "Positive reinforcement and encouragement"
      ],
      importance: "Mental and physical recovery, team bonding"
    }
  },

  practiceLength: {
    "8U-10U": "60-90 minutes (attention span consideration)",
    "12U-14U": "90-120 minutes",
    "16U-18U": "120-150 minutes",
    college: "2-3 hours",
    note: "Quality over quantity - focused practice better than long, unfocused one"
  }
};

// ============================================================================
// STATION-BASED PRACTICE PLANS
// ============================================================================

export const STATION_PLANS = {
  fourStationRotation: {
    description: "Break team into 4 groups, 10-minute rotations",
    totalTime: "40 minutes of skill work",
    
    station1_Hitting: {
      setup: "Batting cage or hitting area",
      equipment: "Tees, soft toss net, baseballs/softballs",
      activities: [
        "Tee work (5 swings focus on mechanics)",
        "Soft toss (10 swings)",
        "Live BP (5-7 swings)",
        "Partner evaluation and feedback"
      ],
      coach: "Hitting coach focuses on mechanics"
    },

    station2_Infield: {
      setup: "Infield positions",
      equipment: "Softballs, bases, screens",
      activities: [
        "Ground ball progression (roll, short hop, routine)",
        "Double play work (2B/SS)",
        "First base receiving and footwork",
        "Third base charging and bare hand"
      ],
      coach: "Infield coach focuses on footwork and exchanges"
    },

    station3_Outfield: {
      setup: "Outfield area",
      equipment: "Softballs, bucket, cones",
      activities: [
        "Drop step drill and angles",
        "Fly ball communication",
        "Crow hop and throwing progression",
        "Do-or-die approach"
      ],
      coach: "Outfield coach focuses on routes and arm strength"
    },

    station4_Pitching_Catching: {
      setup: "Bullpen area",
      equipment: "Balls, catcher's gear, strike zone mat",
      activities: [
        "Pitchers: Bullpen work with specific focus",
        "Catchers: Blocking, framing, throw-downs",
        "Pitcher-catcher communication",
        "Mix players if needed (everyone learns catching basics)"
      ],
      coach: "Pitching/catching specialist"
    }
  },

  threeStationSmallTeam: {
    description: "For teams with 9-12 players",
    rotation: "12-15 minutes per station",
    
    station1: "Hitting and bunting",
    station2: "Fielding (combined infield/outfield work)",
    station3: "Pitching, catching, and throwing accuracy",
    
    note: "Smaller groups allow more individual attention"
  },

  twoStationIntense: {
    description: "For focused skill development",
    rotation: "20 minutes per station, repeat twice",
    
    option1: {
      station1: "Hitting (live BP and situational hitting)",
      station2: "Defense (full team defense with scenarios)"
    },

    option2: {
      station1: "Pitching and catching (1:1 or small group)",
      station2: "Position players (hitting and fielding)"
    }
  }
};

// ============================================================================
// AGE-SPECIFIC PRACTICE PLANS
// ============================================================================

export const AGE_SPECIFIC_PLANS = {
  "8U-10U": {
    focus: "Fundamentals, fun, and engagement",
    attention: "Keep activities short (5-7 minutes), high energy",
    
    samplePractice: {
      warmUp: "10 min - Dynamic warm-up with games (sharks and minnows)",
      throwing: "10 min - Partner catch with progression",
      hitting: "20 min - 2 stations: Tee work and soft toss",
      fielding: "20 min - Ground ball lines with fun competition",
      baseRunning: "10 min - Leads, sliding practice (use slide mat)",
      game: "15 min - Scrimmage or situational game",
      coolDown: "5 min - Stretching and huddle"
    },

    coachingTips: [
      "Use positive reinforcement constantly",
      "Demonstrate everything - show don't just tell",
      "Keep lines short - maximum engagement",
      "Make it fun with competitions and games",
      "Focus on effort and attitude over results"
    ]
  },

  "12U-14U": {
    focus: "Skill refinement and game situations",
    intensity: "Medium - balance skill work with conditioning",
    
    samplePractice: {
      warmUp: "15 min - Dynamic stretch and throwing progression",
      stations: "40 min - 4 station rotation (10 min each)",
      situational: "20 min - First and third defense, cutoffs",
      conditioning: "10 min - Base running sprints and agility",
      liveWork: "20 min - Scrimmage with specific focus",
      coolDown: "5 min - Static stretch and team talk"
    },

    coachingTips: [
      "Emphasize attention to detail",
      "Teach the 'why' behind techniques",
      "Introduce mental game concepts",
      "Set individual and team goals",
      "Encourage leadership development"
    ]
  },

  "16U-18U": {
    focus: "Game preparation, advanced skills, recruiting",
    intensity: "High - competitive practice intensity",
    
    samplePractice: {
      warmUp: "15 min - Dynamic prep and long toss",
      stationWork: "35 min - Focused skill stations",
      teamDefense: "25 min - Full defensive situations",
      liveAB: "30 min - Live at-bats with game situations",
      conditioning: "10 min - Softball-specific conditioning",
      videoReview: "10 min - Quick film review if available",
      coolDown: "5 min - Recovery and announcements"
    },

    coachingTips: [
      "Practice like you play",
      "High accountability and expectations",
      "Player leadership emphasized",
      "Recruiting guidance as needed",
      "Mental preparation for competition"
    ]
  }
};

// ============================================================================
// SPECIALIZED PRACTICE FOCUSES
// ============================================================================

export const SPECIALIZED_PRACTICES = {
  defensiveFocus: {
    duration: "2 hours",
    emphasis: "Fielding, throwing, and team defense",
    
    plan: {
      warmUp: "15 min",
      individualDefense: "30 min - Position-specific work in stations",
      teamDefense: "45 min - Full team defensive situations",
      situationalDefense: "20 min - Bunt coverage, first/third, rundowns",
      conditioning: "10 min - Defensive agility work"
    },

    situations: [
      "Runner on first - steal",
      "Bases loaded - ground ball to each position",
      "Runner on second - base hit to outfield",
      "Bunt with runners on",
      "Pop flies with communication",
      "First and third steal situations"
    ]
  },

  offensiveFocus: {
    duration: "2 hours",
    emphasis: "Hitting, bunting, and base running",
    
    plan: {
      warmUp: "15 min",
      teeWork: "20 min - Mechanical focus",
      liveBP: "40 min - 2-3 rounds per player",
      bunting: "20 min - Sacrifice and drag bunts",
      baseRunning: "20 min - Leads, steals, reads",
      situational: "15 min - Hit and run, squeeze plays"
    },

    emphasis: [
      "Quality at-bats",
      "Situational hitting (move runner, opposite field)",
      "Bunting execution",
      "Aggressive baserunning",
      "Two-strike approach"
    ]
  },

  pitchingCatchingClinic: {
    duration: "2 hours",
    emphasis: "Battery development",
    
    pitchers: {
      mechanicWork: "30 min - Specific mechanical focus",
      gameSimulation: "30 min - Live hitters",
      conditioning: "20 min - Pitcher-specific conditioning"
    },

    catchers: {
      receiving: "30 min - Framing and blocking",
      throwing: "20 min - Pop time work and accuracy",
      gameCalving: "40 min - Working with pitchers on sequencing",
      conditioning: "30 min - Catcher-specific conditioning"
    },

    together: "Work on communication, pitch calling, game preparation"
  },

  preGamePractice: {
    duration: "60-90 minutes",
    focus: "Final preparation before competition",
    
    plan: {
      warmUp: "15 min - Light dynamic warm-up",
      infieldOutfield: "20 min - Position work",
      hittingGroups: "25 min - Short BP rounds",
      pitchingCatching: "20 min - Bullpen for starters",
      baseRunning: "10 min - Quick review",
      teamMeeting: "5 min - Game plan and assignments"
    },

    notes: [
      "Keep it light and confident",
      "No new information - reinforce what they know",
      "Build confidence with positive feedback",
      "End on high note"
    ]
  }
};

// ============================================================================
// SEASONAL PRACTICE PLANNING
// ============================================================================

export const SEASONAL_PLANNING = {
  preseason: {
    weeks1to2: {
      focus: "Conditioning and fundamental review",
      emphasis: "Build fitness base, refresh skills from off-season",
      practices: "4-5 per week, moderate intensity"
    },

    weeks3to4: {
      focus: "Skill development and team concepts",
      emphasis: "Station work, introduce team defense, live scrimmages",
      practices: "4-5 per week, increasing intensity"
    },

    weeks5to6: {
      focus: "Game preparation and final adjustments",
      emphasis: "Situational work, intra-squad games, finalize lineups",
      practices: "3-4 per week, game-like intensity"
    }
  },

  inSeason: {
    mondayAfterWeekend: {
      focus: "Recovery and review",
      type: "Light practice or off",
      activities: "Film review, mental game, light skill work"
    },

    midWeek: {
      focus: "Skill maintenance and game prep",
      type: "Full practice with focus areas from weekend",
      activities: "Address weaknesses, prepare for next opponent"
    },

    dayBeforeGame: {
      focus: "Final preparation",
      type: "Light walk-through",
      activities: "Review game plan, build confidence, stay fresh"
    },

    afterGame: {
      focus: "Recovery",
      type: "Off or very light",
      activities: "Mental recovery, physical rest, prepare for next"
    }
  },

  postseason: {
    focus: "Reflection and development planning",
    activities: [
      "Individual player meetings",
      "Goal setting for off-season",
      "Skill assessment",
      "Celebrate season accomplishments",
      "Off-season training plan"
    ]
  }
};

// ============================================================================
// PRACTICE EFFICIENCY TIPS
// ============================================================================

export const EFFICIENCY_TIPS = {
  maximizeReps: [
    "Use multiple stations to keep everyone active",
    "Have assistant coaches or parent helpers manage stations",
    "Prepare drills and equipment before practice",
    "Keep explanations short - demonstrate and do",
    "Use shagging system to keep balls in play"
  ],

  timeManagement: [
    "Use timer for station rotations - keeps practice moving",
    "Have transition plan - players know where to go next",
    "Set up stations during warm-up time",
    "Have backup plan for weather or field issues",
    "End on time - respect players' and families' schedules"
  ],

  engagement: [
    "No lines longer than 3-4 players",
    "Competition and games to maintain energy",
    "Rotate activities every 8-12 minutes for youth",
    "Pair players of different skill levels for peer teaching",
    "Give players responsibilities (team captain, station leader)"
  ],

  safety: [
    "Always warm up properly - non-negotiable",
    "Check equipment before practice",
    "Have first aid kit accessible",
    "Establish safety rules (batting cage use, throwing areas)",
    "Monitor fatigue especially in hot weather",
    "Have emergency action plan"
  ],

  communication: [
    "Share practice plan with assistants beforehand",
    "Communicate schedule to parents",
    "Quick team huddle at start - set tone and expectations",
    "Provide feedback during practice",
    "End with summary of what was accomplished"
  ]
};

// ============================================================================
// PRACTICE PLAN TEMPLATES
// ============================================================================

export const PRACTICE_TEMPLATES = {
  standardPractice: {
    total: "2 hours",
    breakdown: [
      "0:00-0:15 - Warm-up and throwing progression",
      "0:15-0:55 - 4 Station rotation (10 min each)",
      "0:55-1:15 - Team defense situational work",
      "1:15-1:35 - Live scrimmage or controlled game",
      "1:35-1:50 - Conditioning and base running",
      "1:50-2:00 - Cool down and team meeting"
    ]
  },

  intensePracticeFocus: {
    total: "2 hours",
    focus: "High-intensity skill development",
    breakdown: [
      "0:00-0:15 - Dynamic warm-up with speed work",
      "0:15-0:45 - Primary skill station (hitting or defense)",
      "0:45-1:15 - Secondary skill station",
      "1:15-1:45 - Live game simulation",
      "1:45-2:00 - Cool down and recovery"
    ]
  },

  lightPracticeDay: {
    total: "90 minutes",
    focus: "Recovery and mental preparation",
    breakdown: [
      "0:00-0:15 - Light warm-up and stretching",
      "0:15-0:40 - Skill review with low intensity",
      "0:40-1:05 - Mental game and video review",
      "1:05-1:20 - Walk-through of game situations",
      "1:20-1:30 - Team building activity"
    ]
  }
};

export default {
  PRACTICE_FRAMEWORK,
  STATION_PLANS,
  AGE_SPECIFIC_PLANS,
  SPECIALIZED_PRACTICES,
  SEASONAL_PLANNING,
  EFFICIENCY_TIPS,
  PRACTICE_TEMPLATES
};
