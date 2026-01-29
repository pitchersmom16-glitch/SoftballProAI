/**
 * TOURNAMENT RULES KNOWLEDGE BASE
 * SoftballProAI Brain - Comprehensive Rules Reference
 * 
 * Complete rules for High School (NFHS), PGF, USSSA, GSA, Titan, and other
 * major fastpitch softball organizations. Essential for coaches and players
 * to understand rule differences across competitions.
 * Updated: January 2026
 */

// ============================================================================
// NFHS (HIGH SCHOOL) RULES - 2026 Edition
// ============================================================================

export const NFHS_RULES = {
  overview: {
    organization: "National Federation of State High School Associations",
    governs: "High school softball across United States",
    rulebook: "Official NFHS Softball Rules Book",
    updates: "2026 edition with significant changes"
  },

  majorRuleChanges2026: {
    pitchingDelivery: {
      newRule: "Beginning in 2026, pitchers may disengage both feet from playing surface if pivot foot is not replanted prior to delivery",
      previous: "Pivot foot had to remain in contact with ground",
      impact: "More flexibility in pitching styles, but no crow hopping (replanting is still illegal)"
    },

    electronicDevices: {
      rule: "Rule 1-9-6 prohibits players from transmitting or recording audio or video from playing surface",
      clarification: "Clear definition of prohibited electronic device use",
      allowed: "Communication devices in dugout only, not on field",
      impact: "No GoPros, recording devices, or communication devices on players during play"
    },

    uniforms: {
      effective: "January 1, 2027",
      allowed: "Only player's name, school name/nickname, school mascot, and/or school logo",
      wristbands: "Playbooks/playcards may only be worn on wrist or arm",
      pitchers: "Must wear wristbands on non-pitching arm",
      impact: "Standardizes uniform appearance across high school softball"
    },

    pitcherDryingAgents: {
      clarification: "Dirt is NOT a foreign substance and doesn't require wiping",
      allowed: "Powdered rosin or comparable agents listed on USA Softball certified equipment website",
      impact: "Pitchers can use dirt without penalty, approved rosin products permitted"
    },

    umpireUniforms: {
      current: "Heather gray, charcoal gray, or navy blue slacks permitted",
      change: "Effective January 1, 2027, heather gray no longer permitted",
      future: "Charcoal gray or navy blue only starting 2027"
    },

    rule8Reformatting: {
      change: "Rule 8 reorganized for clarity with separated articles and outlined exceptions/penalties",
      impact: "Easier to understand and apply rules consistently"
    }
  },

  pointsOfEmphasis2026: {
    obstruction: {
      definition: "Requires actual impediment to runner progress - mere positioning doesn't constitute obstruction",
      standard: "Must show delay, path alteration, or hesitation",
      teaching: "Coaches and umpires must understand difference between being in way vs. actual obstruction",
      importance: "Primary area of emphasis for 2026 season"
    },

    unobstructedView: {
      emphasis: "Maintaining unobstructed view of plays",
      application: "Umpire positioning and player awareness",
      importance: "Secondary area of emphasis for 2026"
    }
  },

  gameFormat: {
    innings: "7 innings regulation",
    timeLimit: "Varies by state association - typically no time limit for varsity",
    runRule: "Typically 10 runs after 5 innings, 15 runs after 3 innings (state-dependent)",
    tiebreaker: "International Tiebreaker rule may be used per state adoption"
  },

  equipmentRules: {
    bats: "Must meet NFHS standards, USA Softball or BBCOR certification",
    balls: "Approved .44 cor, 375 lb compression",
    helmets: "Batting helmets required for all batters and runners",
    catcher: "Full gear required (helmet with mask, chest protector, shin guards, throat guard)"
  },

  substitutionRules: {
    reentry: "Starting player may be substituted and re-enter once",
    courtesy Runner: "Allowed for pitcher and/or catcher - must be player not currently in lineup",
    DPFlex: "Designated Player/Flex player option available",
    reporting: "Substitutes must be reported to umpire and scorer"
  }
};

// ============================================================================
// PGF (PREMIER GIRLS FASTPITCH) TOURNAMENT RULES
// ============================================================================

export const PGF_RULES = {
  overview: {
    organization: "Premier Girls Fastpitch",
    focus: "Elite travel ball tournaments and showcases",
    events: "PGF Nationals and sanctioned tournaments"
  },

  gameFormat: {
    poolPlay: {
      time: "80 minutes with 'finish the inning' rule",
      runRule: "10 runs after 5 innings",
      ties: "Games can end in tie",
      lineups: "Minimum 9 batters with unlimited substitutions",
      courtesyRunners: "Allowed for any position"
    },

    bracketPlay: {
      time: "80 minutes with 'finish the inning' rule for bracket games",
      championship: "7 innings or 90 minutes maximum, whichever comes first",
      runRule: "10 runs after 5 innings",
      lineups: "9 batters with Flex/DP option",
      courtesyRunners: "For pitcher/catcher only, must come from bench",
      tiebreaker: "International Tiebreaker (ITB) with last batted out as runner"
    }
  },

  tournamentProcedures: {
    preGame: {
      conference: "5 minutes before start time for pool play",
      coinFlip: "Determines home team for pool play",
      homeTeam: "Official scorekeeper",
      warmUp: "No organized infield practice - warm up beyond baselines or in foul territory",
      batting: "No live batting allowed in complex"
    },

    timing: {
      preparation: "Teams should be prepared to start up to 30 minutes early",
      gameTime: "80 minutes starts at first pitch",
      finishInning: "Complete inning in progress when time expires"
    },

    seeding: {
      poolPlay: "Uses tiebreaker procedures after pool play",
      headToHead: "May or may not be used depending on tournament format",
      tiebreakers: "Specific procedures outlined in tournament rules"
    }
  },

  conductRules: {
    managers: "Only managers may consult with umpires",
    players: "Must stay out of discussions with umpires",
    sponsors: "Must remain out of umpire discussions",
    enforcement: "Violations can result in ejection or team penalties"
  },

  rulebook: {
    official: "PGF/NFHS Rulebook",
    deviations: "Pool play lineup rules differ from standard NFHS",
    enforcement: "All other NFHS rules apply unless specifically modified"
  }
};

// ============================================================================
// USSSA (UNITED STATES SPECIALTY SPORTS ASSOCIATION) RULES
// ============================================================================

export const USSSA_RULES = {
  overview: {
    organization: "United States Specialty Sports Association",
    currentEdition: "Seventeenth Edition, revised February 2025",
    governs: "Youth and adult fastpitch softball nationally",
    accessibility: "Available at usssa.com/docs/Fastpitch/Fastpitch_Rules.pdf and mobile app"
  },

  ruleCategories: [
    "Playing field specifications",
    "Equipment requirements",
    "Definitions and game terminology",
    "Game play and scoring",
    "Players and substitutes",
    "Pitching regulations",
    "Batting rules",
    "Base running",
    "Appeals and protests",
    "Umpire procedures",
    "Ejection and disciplinary procedures",
    "Special divisions (10U, men's, coach pitch, machine pitch, T-ball, arena indoor)"
  ],

  keyDifferences: {
    pitching: {
      windmill: "Full windmill delivery allowed",
      dragFoot: "May drag or push off",
      leaping: "Both feet may be airborne if no replant (crow hop illegal)",
      equipment: "Approved rosin and drying agents"
    },

    bats: {
      approval: "USSSA certified bats or USA Softball approved",
      ghost: "Both USSSA Ghost and USA/ASA Ghost bats are legal",
      inspection: "Subject to inspection before and during game"
    },

    substitutions: {
      unlimited: "Many age divisions allow unlimited substitutions",
      courtesyRunner: "Allowed per division rules",
      dpFlex: "Available in most competitive divisions"
    }
  },

  ageDivisions: {
    youth: "6U, 8U, 10U, 12U, 14U, 16U, 18U",
    ageCalculation: "Based on player age as of specific date (typically December 31 or January 1)",
    movement: "Players may play up in age, restrictions on playing down"
  },

  tournamentFormat: {
    poolPlay: "Varies by tournament - typically timed or inning limit",
    bracket: "Single or double elimination",
    championship: "Full 7 innings or time limit",
    tiebreaker: "ITB (International Tiebreaker) commonly used"
  }
};

// ============================================================================
// GSA (GLOBAL SPORTS ALLIANCE) RULES
// ============================================================================

export const GSA_RULES = {
  overview: {
    organization: "Global Sports Alliance (note: primarily baseball-focused, limited softball info available)",
    season: "2025-2026 season runs August 1, 2025 - July 31, 2026"
  },

  ageEligibility: {
    determination: "Age on April 30, 2026",
    example: "Player born September 2013 plays 12U",
    gradeExemption: "12U and under teams may carry two (2) grade exempt players",
    documentation: "Coaches must provide grade exemption documentation to GSA before player competes"
  },

  gameFormat: {
    "7U-8U": {
      timeLimit: "1 hour 30 minutes for pool and bracket",
      innings: "6 innings"
    },
    "9U-18U": {
      timeLimit: "1 hour 40 minutes for pool and bracket",
      innings: "7 innings (13U-18U), 6 innings (9U-12U)"
    },
    championship: {
      timeLimit: "2 hours all age groups",
      innings: "Full regulation per age group"
    }
  },

  contact: {
    email: "rjmondoux@gsanational.org",
    note: "Contact directly for detailed 2026 softball tournament rules"
  }
};

// ============================================================================
// TITAN TOURNAMENTS RULES
// ============================================================================

export const TITAN_RULES = {
  overview: {
    organization: "Tournament Titan",
    website: "tournamenttitan.com",
    rulebook: "Available for download - online version supersedes printed"
  },

  ageDivisions2025: {
    calculation: "Birth date September through August",
    divisions: "7U through 18U",
    splitting: "Divisions split if enough teams enter",
    example: "10U includes players born September 2013 through August 2014"
  },

  pitchingRules: {
    dragFoot: "May drag pivot foot in contact with ground when pushing off",
    airborne: "May have both feet in air during delivery",
    crowHop: "NOT allowed - re-planting pivot foot to push off second time is illegal",
    enforcement: "Umpire will call illegal pitch for crow hop"
  },

  equipment: {
    bats: {
      usssaGhost: "Legal",
      usaGhost: "Legal (USA/ASA approved)",
      certification: "Must be USSSA or USA Softball approved"
    }
  },

  updates: {
    annual: "Rules updated annually - check website for current year",
    access: "Downloadable rule book on Tournament Titan website",
    supersede: "Online version always supersedes any printed version"
  }
};

// ============================================================================
// METROBALL RULES
// ============================================================================

export const METROBALL_RULES = {
  status: {
    note: "Limited information available - Metroball primarily known as basketball organization",
    clarification: "May not be a softball league - verify organization name",
    alternative: "If looking for metropolitan area softball league, specify city/region"
  },

  recommendation: "Contact local softball associations for metro-area specific leagues and rules"
};

// ============================================================================
// INTERNATIONAL TIEBREAKER RULE (ITB)
// ============================================================================

export const INTERNATIONAL_TIEBREAKER = {
  description: "Used to resolve tied games after regulation innings",
  
  procedure: {
    startingRunner: "Last batted out placed on second base to start inning",
    whoRuns: "If substitute has replaced the last out, the substitute runs",
    bothTeams: "Both teams get opportunity with runner on second",
    continues: "Continues until tie is broken"
  },

  strategy: {
    bunting: "Often used to advance runner to third with less than 2 outs",
    smallBall: "Contact hitting emphasized over power",
    defense: "Prevent runner from scoring while trying to score your own",
    coaching: "Practice ITB scenarios - very common in tournaments"
  },

  adoption: {
    usage: "Widely adopted across tournaments",
    highSchool: "Some states use for extra innings",
    youth: "Common in youth and travel ball",
    timing: "Helps keep tournaments on schedule"
  }
};

// ============================================================================
// COMMON RULE VARIATIONS ACROSS ORGANIZATIONS
// ============================================================================

export const RULE_COMPARISONS = {
  substitutions: {
    NFHS: "Starter may re-enter once",
    PGF_Pool: "Unlimited substitutions",
    PGF_Bracket: "Flex/DP with limited substitution",
    USSSA: "Varies by division - often unlimited in youth"
  },

  courtesyRunners: {
    NFHS: "For pitcher and/or catcher - not in lineup",
    PGF_Pool: "Any position",
    PGF_Bracket: "Pitcher/catcher only from bench",
    USSSA: "Per division rules"
  },

  timeLimit: {
    NFHS: "Typically no time limit (state dependent)",
    PGF: "80 minutes pool/bracket, 90 minutes championship",
    GSA: "90-100 minutes depending on age",
    Titan: "Varies by tournament"
  },

  runRules: {
    standard: "10 runs after 5 innings (most organizations)",
    variations: "15 after 3, 8 after 4 (some youth leagues)",
    championship: "May not apply in championship games (organization dependent)"
  },

  pitchingRestrictions: {
    windmill: "All organizations allow full windmill",
    leaping: "Allowed if no replant (most organizations)",
    crowHop: "Illegal across all organizations",
    foreignSubstance: "Rosin allowed, specific rules per organization"
  }
};

// ============================================================================
// COACH AND PLAYER EDUCATION
// ============================================================================

export const RULES_EDUCATION = {
  coachResponsibility: {
    knowRules: "Understand rules for each organization you compete in",
    teachPlayers: "Educate players on rule differences",
    preGame: "Clarify any questions with umpires during ground rules meeting",
    lineup: "Understand substitution and courtesy runner rules for each tournament"
  },

  commonMisunderstandings: {
    obstructionVsInterference: "Obstruction is defense on offense, interference is offense on defense",
    lookBackRule: "Runner must immediately proceed or return when pitcher has ball in circle",
    infield FlyRule: "Rarely used in softball (less than two outs, runners on first and second or bases loaded)",
    leavingEarly: "Runner leaves base before pitch released - different from leading off",
    droppedThirdStrike: "Batter can attempt first base if not occupied or with 2 outs"
  },

  preparationTips: {
    beforeTournament: [
      "Read tournament rules carefully",
      "Understand lineup card requirements",
      "Know courtesy runner rules",
      "Clarify time limits and run rules",
      "Understand tiebreaker procedures"
    ],
    
    atTournament: [
      "Attend coaches meeting",
      "Ask questions during plate meeting",
      "Have rule book accessible",
      "Stay calm during disputes",
      "Teach players to respect umpires"
    ]
  }
};

export default {
  NFHS_RULES,
  PGF_RULES,
  USSSA_RULES,
  GSA_RULES,
  TITAN_RULES,
  METROBALL_RULES,
  INTERNATIONAL_TIEBREAKER,
  RULE_COMPARISONS,
  RULES_EDUCATION
};
