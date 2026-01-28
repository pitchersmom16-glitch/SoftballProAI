import { pgTable, text, serial, integer, boolean, timestamp, jsonb, date, numeric } from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export * from "./models/auth";
export * from "./models/chat";

import { users } from "./models/auth";

// === SKILL TYPE ENUM (Source of Truth for Holistic Athlete Model) ===
// Supports ALL 4 Core Skills as defined in Master Spec Sheet
export const SkillTypeEnum = z.enum(["PITCHING", "HITTING", "CATCHING", "FIELDING"]);
export type SkillType = z.infer<typeof SkillTypeEnum>;

// Category enum for drills (includes all positions + conditioning + mental)
export const DrillCategoryEnum = z.enum(["PITCHING", "HITTING", "CATCHING", "FIELDING", "INFIELD", "OUTFIELD", "CONDITIONING", "MENTAL"]);
export type DrillCategory = z.infer<typeof DrillCategoryEnum>;

// === ASSESSMENT STATUS ENUM ===
// Supports the AI vs. Coach Review hybrid workflow
export const AssessmentStatusEnum = z.enum([
  "pending",              // Just uploaded, not yet analyzed
  "analyzing",            // AI is processing
  "ai_complete",          // AI analysis done, ready for auto-assign (Solo mode)
  "pending_coach_review", // AI done, held for coach review (Coached mode)
  "coach_approved",       // Coach approved AI suggestions
  "coach_edited",         // Coach modified AI suggestions
  "completed",            // Final state, visible to player
  "reviewed"              // Legacy status for backwards compatibility
]);
export type AssessmentStatus = z.infer<typeof AssessmentStatusEnum>;

// === PLAYER SUBSCRIPTION MODE ===
export const PlayerModeEnum = z.enum(["solo", "coached"]);
export type PlayerMode = z.infer<typeof PlayerModeEnum>;

// === COACH INVITE STATUS ===
export const InviteStatusEnum = z.enum(["pending", "accepted", "declined", "expired"]);
export type InviteStatus = z.infer<typeof InviteStatusEnum>;

// === TABLE DEFINITIONS ===

export const coaches = pgTable("coaches", {
  id: serial("id").primaryKey(),
  userId: text("user_id").notNull().references(() => users.id), // Link to auth user
  name: text("name").notNull(),
  bio: text("bio"),
  experienceYears: integer("experience_years"),
  certificationLevel: text("certification_level"),
  specialty: text("specialty"), // "PITCHING", "CATCHING", "HITTING", "FIELDING" - for Specialist Coaches
  referralCode: text("referral_code").unique(), // Unique code for Smart Invite URLs (e.g., "COACH_ABC123")
  maxStudents: integer("max_students").default(25), // Hard cap on active students
  createdAt: timestamp("created_at").defaultNow(),
});

export const teams = pgTable("teams", {
  id: serial("id").primaryKey(),
  headCoachId: integer("head_coach_id").references(() => coaches.id),
  name: text("name").notNull(),
  ageDivision: text("age_division"), // e.g., "12U", "14U"
  season: text("season"), // e.g., "Spring 2024"
  logoUrl: text("logo_url"),
  referralCode: text("referral_code").unique(), // Unique code for team invite URLs (e.g., "TEAM_ABC123")
  active: boolean("active").default(true),
  createdAt: timestamp("created_at").defaultNow(),
});

export const athletes = pgTable("athletes", {
  id: serial("id").primaryKey(),
  userId: text("user_id").references(() => users.id), // Optional: if athlete manages their own account
  firstName: text("first_name").notNull(),
  lastName: text("last_name").notNull(),
  dob: date("dob"),
  heightInches: integer("height_inches"),
  weightLbs: integer("weight_lbs"),
  bats: text("bats"), // R, L, S
  throws: text("throws"), // R, L
  primaryPosition: text("primary_position"),
  secondaryPosition: text("secondary_position"),
  jerseyNumber: integer("jersey_number"),
  teamId: integer("team_id").references(() => teams.id),
  photoUrl: text("photo_url"),
  // Contact information for text messaging
  playerPhone: text("player_phone"), // Player's phone number
  parentPhone: text("parent_phone"), // Parent/guardian phone number
  parentEmail: text("parent_email"), // Parent/guardian email
  // Player self-service fields
  goals: text("goals"), // Player's personal goals
  preferredTrainingDays: text("preferred_training_days").array(), // ["Monday", "Wednesday", "Friday"]
  graduationYear: integer("graduation_year"), // For recruiting purposes
  school: text("school"), // Current school
  createdAt: timestamp("created_at").defaultNow(),
});

export const skills = pgTable("skills", {
  id: serial("id").primaryKey(),
  name: text("name").notNull().unique(), // e.g., "Pitching", "Hitting"
  description: text("description"),
});

// Skill categories: Pitching, Hitting, Catching, Throwing, Mental
export const drills = pgTable("drills", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  category: text("category").notNull(), // "Pitching", "Hitting", "Catching", "Throwing"
  skillType: text("skill_type"), // e.g., "pitching", "hitting", "catching", "throwing"
  difficulty: text("difficulty"), // Beginner, Intermediate, Advanced
  description: text("description").notNull(),
  videoUrl: text("video_url"), // YouTube URL for reference video
  equipment: text("equipment").array(),
  ageRange: text("age_range"),
  // Knowledge Base fields for AI Brain
  expertSource: text("expert_source"), // e.g., "Amanda Scarborough", "Denny Dunn"
  mechanicTags: text("mechanic_tags").array(), // e.g., ["Internal Rotation", "Framing", "Pop Time"]
  issueAddressed: text("issue_addressed"), // Biomechanical issue this drill corrects
  createdAt: timestamp("created_at").defaultNow(),
});

// Player Daily Check-ins for soreness tracking and injury prevention
export const playerCheckins = pgTable("player_checkins", {
  id: serial("id").primaryKey(),
  athleteId: integer("athlete_id").references(() => athletes.id),
  userId: text("user_id").references(() => users.id), // Direct link for player mode users
  date: date("date").notNull(),
  mood: text("mood"), // "great", "good", "okay", "tired", "struggling"
  energyLevel: integer("energy_level"), // 1-10 scale
  sorenessAreas: text("soreness_areas").array(), // ["arm", "shoulder", "legs", "back"]
  sorenessLevel: integer("soreness_level"), // 1-10 scale, 7+ triggers injury prevention
  sleepHours: numeric("sleep_hours"),
  notes: text("notes"),
  blockedActivities: text("blocked_activities").array(), // Activities blocked due to soreness
  createdAt: timestamp("created_at").defaultNow(),
});

// Homework Assignments from Pitching Coach to Players
export const homeworkAssignments = pgTable("homework_assignments", {
  id: serial("id").primaryKey(),
  coachId: integer("coach_id").references(() => coaches.id),
  athleteId: integer("athlete_id").references(() => athletes.id),
  drillId: integer("drill_id").references(() => drills.id),
  title: text("title").notNull(),
  description: text("description"),
  skillFocus: text("skill_focus"), // "rise_ball", "drop_ball", "curve_ball", "change_up", "mechanics", "drag_foot"
  referenceVideoUrl: text("reference_video_url"), // Pro model or instructional video
  reps: integer("reps"), // e.g., "Do 20 K-Drills"
  dueDate: date("due_date"),
  status: text("status").default("assigned"), // "assigned", "in_progress", "completed", "overdue"
  completedAt: timestamp("completed_at"),
  videoSubmissionUrl: text("video_submission_url"), // Player's video of completed homework
  coachFeedback: text("coach_feedback"),
  createdAt: timestamp("created_at").defaultNow(),
});

// Practice Plans for Team Coaches
export const practicePlans = pgTable("practice_plans", {
  id: serial("id").primaryKey(),
  coachId: integer("coach_id").references(() => coaches.id),
  teamId: integer("team_id").references(() => teams.id),
  name: text("name").notNull(), // e.g., "2-Hour Defensive Focus"
  duration: integer("duration"), // Duration in minutes
  focus: text("focus"), // "Defensive", "Offensive", "Pitching", "Full Practice"
  stations: jsonb("stations"), // Array of station objects with groups and drills
  scheduledDate: date("scheduled_date"),
  notes: text("notes"),
  createdAt: timestamp("created_at").defaultNow(),
});

// Pitching Coach "Stable" - Students assigned to a pitching coach
export const coachStudents = pgTable("coach_students", {
  id: serial("id").primaryKey(),
  coachId: integer("coach_id").references(() => coaches.id),
  athleteId: integer("athlete_id").references(() => athletes.id),
  status: text("status").default("active"), // "active", "inactive", "graduated"
  startDate: date("start_date"),
  notes: text("notes"),
  createdAt: timestamp("created_at").defaultNow(),
});

// === HYBRID COACHING SYSTEM TABLES ===

// Player-Coach Relationships - Tracks which coach covers which skill for a player
// Enables the "My Coaching Team" feature where a player can have different coaches for different skills
export const playerCoachRelationships = pgTable("player_coach_relationships", {
  id: serial("id").primaryKey(),
  playerId: text("player_id").notNull().references(() => users.id), // The player (user)
  coachId: integer("coach_id").notNull().references(() => coaches.id), // The assigned coach
  skillType: text("skill_type").notNull(), // "PITCHING", "HITTING", "CATCHING", "FIELDING"
  status: text("status").default("active"), // "active", "inactive", "pending"
  subscriptionMode: text("subscription_mode").default("coached"), // "solo", "coached"
  startDate: date("start_date"),
  notes: text("notes"),
  createdAt: timestamp("created_at").defaultNow(),
});

// Coach Invites - Handles the invite flow when a player adds a coach
export const coachInvites = pgTable("coach_invites", {
  id: serial("id").primaryKey(),
  fromPlayerId: text("from_player_id").notNull().references(() => users.id), // Player sending invite
  toCoachEmail: text("to_coach_email"), // Email invite (if email provided)
  toCoachUsername: text("to_coach_username"), // Username invite (if username provided)
  toCoachId: integer("to_coach_id").references(() => coaches.id), // Resolved coach ID
  skillType: text("skill_type").notNull(), // Which skill this coach will cover
  status: text("status").default("pending"), // "pending", "accepted", "declined", "expired"
  inviteToken: text("invite_token"), // Unique token for email links
  expiresAt: timestamp("expires_at"),
  message: text("message"), // Optional message from player
  createdAt: timestamp("created_at").defaultNow(),
});

// Smart Invite - Coach invites students/parents via email/phone with unique referral URL
export const studentInvites = pgTable("student_invites", {
  id: serial("id").primaryKey(),
  coachId: integer("coach_id").notNull().references(() => coaches.id),
  parentEmail: text("parent_email"),
  studentEmail: text("student_email"),
  phone: text("phone"),
  studentName: text("student_name"),
  skillType: text("skill_type").notNull(), // Coach's specialty that student is signing up for
  inviteToken: text("invite_token").notNull().unique(), // Unique token for the referral URL
  status: text("status").default("pending"), // "pending", "registered", "expired"
  registeredUserId: text("registered_user_id").references(() => users.id), // Set when student registers
  expiresAt: timestamp("expires_at"),
  createdAt: timestamp("created_at").defaultNow(),
});

// Baseline Videos - Track student onboarding video uploads (4 required to unlock app)
export const baselineVideos = pgTable("baseline_videos", {
  id: serial("id").primaryKey(),
  userId: text("user_id").notNull().references(() => users.id),
  coachId: integer("coach_id").references(() => coaches.id),
  skillType: text("skill_type").notNull(), // "PITCHING", "CATCHING", etc.
  videoCategory: text("video_category").notNull(), // Specific video type: "fastball", "drop_ball", "framing", "hitting", etc.
  videoNumber: integer("video_number").notNull(), // 1-4 for the baseline protocol
  videoUrl: text("video_url").notNull(),
  durationSeconds: integer("duration_seconds"),
  assessmentId: integer("assessment_id").references(() => assessments.id), // Created when AI analyzes
  status: text("status").default("uploaded"), // "uploaded", "analyzing", "analyzed"
  createdAt: timestamp("created_at").defaultNow(),
});

// Player Onboarding Status - Tracks whether student has completed baseline protocol
export const playerOnboarding = pgTable("player_onboarding", {
  id: serial("id").primaryKey(),
  userId: text("user_id").notNull().references(() => users.id).unique(),
  coachId: integer("coach_id").references(() => coaches.id), // Linked coach (for Private Instructor Mode)
  teamId: integer("team_id").references(() => teams.id), // Linked team (for Head Coach Mode)
  onboardingType: text("onboarding_type").notNull().default("team_coach"), // "team_coach", "pitching_instructor", "catching_instructor"
  skillType: text("skill_type"), // Specialty they signed up for
  baselineComplete: boolean("baseline_complete").default(false), // Set to true after 4 videos
  baselineApprovedAt: timestamp("baseline_approved_at"), // When coach approved
  dashboardUnlocked: boolean("dashboard_unlocked").default(false),
  nextVideoPromptDate: date("next_video_prompt_date"), // 2 weeks after completion
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Player Settings - Stores player preferences including subscription mode
export const playerSettings = pgTable("player_settings", {
  id: serial("id").primaryKey(),
  userId: text("user_id").notNull().references(() => users.id).unique(),
  subscriptionMode: text("subscription_mode").default("solo"), // "solo" ($9.99) or "coached" (hybrid)
  notificationsEnabled: boolean("notifications_enabled").default(true),
  autoAssignDrills: boolean("auto_assign_drills").default(true), // For solo mode
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Mental Edge table for mindset content, motivation, and psychological training
export const mentalEdge = pgTable("mental_edge", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  contentType: text("content_type").notNull(), // "quote", "video", "principle", "visualization"
  category: text("category").notNull(), // "Pre-Game", "Recovery", "Focus", "Confidence", "Resilience"
  source: text("source"), // e.g., "Kobe Bryant", "Michael Jordan", "Best of 2021 Motivational"
  content: text("content").notNull(), // The quote text or description
  videoUrl: text("video_url"), // YouTube URL for video content
  tags: text("tags").array(), // e.g., ["Mamba Mentality", "Work Ethic", "Clutch Performance"]
  usageContext: text("usage_context"), // When to use: "before at-bat", "after strikeout", "team meeting"
  createdAt: timestamp("created_at").defaultNow(),
});

export const assessments = pgTable("assessments", {
  id: serial("id").primaryKey(),
  athleteId: integer("athlete_id").notNull().references(() => athletes.id),
  coachId: integer("coach_id").references(() => coaches.id), // Who reviewed/created it
  date: timestamp("date").defaultNow(),
  skillType: text("skill_type").notNull(), // pitching, hitting
  videoUrl: text("video_url").notNull(),
  status: text("status").default("pending"), // pending, analyzing, completed, reviewed
  metrics: jsonb("metrics"), // Extracted data (velocity, angle, etc.)
  notes: text("notes"),
  createdAt: timestamp("created_at").defaultNow(),
});

export const assessmentFeedback = pgTable("assessment_feedback", {
  id: serial("id").primaryKey(),
  assessmentId: integer("assessment_id").notNull().references(() => assessments.id),
  drillId: integer("drill_id").references(() => drills.id), // Suggested drill
  issueDetected: text("issue_detected"),
  feedbackText: text("feedback_text").notNull(),
  priority: text("priority"), // High, Medium, Low
  createdAt: timestamp("created_at").defaultNow(),
});

// === NOTIFICATION TYPE ENUM ===
export const NotificationTypeEnum = z.enum([
  "training_reminder",      // Player: 15 mins before training time
  "championship_mindset",   // Player: Daily motivation quote
  "video_uploaded",         // Instructor: Student uploaded video
  "baseline_ready",         // Instructor: Student baseline ready for review
  "high_soreness_alert",    // Team Coach: Player reported high soreness
  "injury_alert",           // Team Coach: Player reported injury
  "roadmap_ready",          // Player: Coach created training roadmap
  "homework_assigned",      // Player: New drill assignment
]);
export type NotificationType = z.infer<typeof NotificationTypeEnum>;

// === NOTIFICATIONS TABLE ===
export const notifications = pgTable("notifications", {
  id: serial("id").primaryKey(),
  userId: text("user_id").notNull().references(() => users.id),
  type: text("type").notNull(), // NotificationType values
  title: text("title").notNull(),
  message: text("message").notNull(),
  linkUrl: text("link_url"), // Optional action link
  relatedId: text("related_id"), // Optional reference to related entity (playerId, assessmentId, etc.)
  read: boolean("read").default(false),
  emailSent: boolean("email_sent").default(false),
  pushSent: boolean("push_sent").default(false),
  createdAt: timestamp("created_at").defaultNow(),
});

// === RELATIONS ===

export const coachesRelations = relations(coaches, ({ one, many }) => ({
  user: one(users, {
    fields: [coaches.userId],
    references: [users.id],
  }),
  teams: many(teams),
  assessments: many(assessments),
}));

export const teamsRelations = relations(teams, ({ one, many }) => ({
  headCoach: one(coaches, {
    fields: [teams.headCoachId],
    references: [coaches.id],
  }),
  athletes: many(athletes),
}));

export const athletesRelations = relations(athletes, ({ one, many }) => ({
  team: one(teams, {
    fields: [athletes.teamId],
    references: [teams.id],
  }),
  assessments: many(assessments),
}));

export const assessmentsRelations = relations(assessments, ({ one, many }) => ({
  athlete: one(athletes, {
    fields: [assessments.athleteId],
    references: [athletes.id],
  }),
  coach: one(coaches, {
    fields: [assessments.coachId],
    references: [coaches.id],
  }),
  feedback: many(assessmentFeedback),
}));

export const assessmentFeedbackRelations = relations(assessmentFeedback, ({ one }) => ({
  assessment: one(assessments, {
    fields: [assessmentFeedback.assessmentId],
    references: [assessments.id],
  }),
  drill: one(drills, {
    fields: [assessmentFeedback.drillId],
    references: [drills.id],
  }),
}));


// === BASE SCHEMAS ===

export const insertCoachSchema = createInsertSchema(coaches).omit({ id: true, createdAt: true });
export const insertTeamSchema = createInsertSchema(teams).omit({ id: true, createdAt: true });
export const insertAthleteSchema = createInsertSchema(athletes).omit({ id: true, createdAt: true });
export const insertDrillSchema = createInsertSchema(drills).omit({ id: true, createdAt: true });
export const insertMentalEdgeSchema = createInsertSchema(mentalEdge).omit({ id: true, createdAt: true });
export const insertAssessmentSchema = createInsertSchema(assessments).omit({ id: true, createdAt: true, status: true, metrics: true });
export const insertFeedbackSchema = createInsertSchema(assessmentFeedback).omit({ id: true, createdAt: true });
export const insertPlayerCheckinSchema = createInsertSchema(playerCheckins).omit({ id: true, createdAt: true });
export const insertHomeworkSchema = createInsertSchema(homeworkAssignments).omit({ id: true, createdAt: true, completedAt: true });
export const insertPracticePlanSchema = createInsertSchema(practicePlans).omit({ id: true, createdAt: true });
export const insertCoachStudentSchema = createInsertSchema(coachStudents).omit({ id: true, createdAt: true });
export const insertPlayerCoachRelationshipSchema = createInsertSchema(playerCoachRelationships).omit({ id: true, createdAt: true });
export const insertCoachInviteSchema = createInsertSchema(coachInvites).omit({ id: true, createdAt: true });
export const insertPlayerSettingsSchema = createInsertSchema(playerSettings).omit({ id: true, createdAt: true, updatedAt: true });
export const insertStudentInviteSchema = createInsertSchema(studentInvites).omit({ id: true, createdAt: true });
export const insertBaselineVideoSchema = createInsertSchema(baselineVideos).omit({ id: true, createdAt: true });
export const insertPlayerOnboardingSchema = createInsertSchema(playerOnboarding).omit({ id: true, createdAt: true, updatedAt: true });
export const insertNotificationSchema = createInsertSchema(notifications).omit({ id: true, createdAt: true });

// === EXPLICIT API CONTRACT TYPES ===

export type Coach = typeof coaches.$inferSelect;
export type Team = typeof teams.$inferSelect;
export type Athlete = typeof athletes.$inferSelect;
export type Drill = typeof drills.$inferSelect;
export type MentalEdge = typeof mentalEdge.$inferSelect;
export type Assessment = typeof assessments.$inferSelect;
export type Feedback = typeof assessmentFeedback.$inferSelect;
export type PlayerCheckin = typeof playerCheckins.$inferSelect;
export type HomeworkAssignment = typeof homeworkAssignments.$inferSelect;
export type PracticePlan = typeof practicePlans.$inferSelect;
export type CoachStudent = typeof coachStudents.$inferSelect;
export type PlayerCoachRelationship = typeof playerCoachRelationships.$inferSelect;
export type CoachInvite = typeof coachInvites.$inferSelect;
export type PlayerSettings = typeof playerSettings.$inferSelect;
export type StudentInvite = typeof studentInvites.$inferSelect;
export type BaselineVideo = typeof baselineVideos.$inferSelect;
export type PlayerOnboarding = typeof playerOnboarding.$inferSelect;
export type Notification = typeof notifications.$inferSelect;

export type CreateCoachRequest = z.infer<typeof insertCoachSchema>;
export type CreateTeamRequest = z.infer<typeof insertTeamSchema>;
export type CreateAthleteRequest = z.infer<typeof insertAthleteSchema>;
export type CreateDrillRequest = z.infer<typeof insertDrillSchema>;
export type CreateMentalEdgeRequest = z.infer<typeof insertMentalEdgeSchema>;
export type CreateAssessmentRequest = z.infer<typeof insertAssessmentSchema>;
export type CreateFeedbackRequest = z.infer<typeof insertFeedbackSchema>;
export type CreatePlayerCheckinRequest = z.infer<typeof insertPlayerCheckinSchema>;
export type CreateHomeworkRequest = z.infer<typeof insertHomeworkSchema>;
export type CreatePracticePlanRequest = z.infer<typeof insertPracticePlanSchema>;
export type CreateCoachStudentRequest = z.infer<typeof insertCoachStudentSchema>;
export type CreatePlayerCoachRelationshipRequest = z.infer<typeof insertPlayerCoachRelationshipSchema>;
export type CreateCoachInviteRequest = z.infer<typeof insertCoachInviteSchema>;
export type CreatePlayerSettingsRequest = z.infer<typeof insertPlayerSettingsSchema>;
export type CreateStudentInviteRequest = z.infer<typeof insertStudentInviteSchema>;
export type CreateBaselineVideoRequest = z.infer<typeof insertBaselineVideoSchema>;
export type CreatePlayerOnboardingRequest = z.infer<typeof insertPlayerOnboardingSchema>;
export type CreateNotificationRequest = z.infer<typeof insertNotificationSchema>;

// GameChanger Stats Import - Stores parsed CSV data from GameChanger exports
export const gameChangerStats = pgTable("game_changer_stats", {
  id: serial("id").primaryKey(),
  athleteId: integer("athlete_id").references(() => athletes.id),
  userId: text("user_id").references(() => users.id),
  season: text("season"), // e.g., "Fall 2025", "Spring 2026"
  gamesPlayed: integer("games_played"),
  // Hitting stats
  avg: numeric("avg"), // Batting Average
  ops: numeric("ops"), // On-base Plus Slugging
  exitVelocity: numeric("exit_velocity"), // Exit Velocity (mph)
  // Pitching stats
  era: numeric("era"), // Earned Run Average
  whip: numeric("whip"), // Walks + Hits per Inning Pitched
  kPercent: numeric("k_percent"), // Strikeout Percentage
  firstPitchStrikePercent: numeric("first_pitch_strike_percent"), // First Pitch Strike %
  // Raw CSV data for reference
  rawData: jsonb("raw_data"), // Store full CSV row
  importedAt: timestamp("imported_at").defaultNow(),
  createdAt: timestamp("created_at").defaultNow(),
});

// AI Skeletal Analysis Results - Stores biomechanical highlights for recruiting
export const skeletalAnalysis = pgTable("skeletal_analysis", {
  id: serial("id").primaryKey(),
  athleteId: integer("athlete_id").references(() => athletes.id),
  userId: text("user_id").references(() => users.id),
  assessmentId: integer("assessment_id").references(() => assessments.id),
  skillType: text("skill_type").notNull(), // "PITCHING", "HITTING", etc.
  highlights: text("highlights").array(), // e.g., ["Elite Arm Circle Speed", "Strong Knee Drive"]
  metrics: jsonb("metrics"), // Detailed measurements
  overallGrade: text("overall_grade"), // A, B, C, D
  createdAt: timestamp("created_at").defaultNow(),
});

export const insertGameChangerStatsSchema = createInsertSchema(gameChangerStats).omit({ id: true, createdAt: true, importedAt: true });
export const insertSkeletalAnalysisSchema = createInsertSchema(skeletalAnalysis).omit({ id: true, createdAt: true });

export type GameChangerStats = typeof gameChangerStats.$inferSelect;
export type SkeletalAnalysis = typeof skeletalAnalysis.$inferSelect;
export type CreateGameChangerStatsRequest = z.infer<typeof insertGameChangerStatsSchema>;
export type CreateSkeletalAnalysisRequest = z.infer<typeof insertSkeletalAnalysisSchema>;

export type UpdateAthleteRequest = Partial<CreateAthleteRequest>;
export type UpdateAssessmentRequest = Partial<CreateAssessmentRequest> & { status?: string, metrics?: any };
export type UpdateHomeworkRequest = Partial<CreateHomeworkRequest> & { status?: string, completedAt?: Date };

// Team Stats Import - Aggregated team-level statistics from GameChanger CSV
export const teamStats = pgTable("team_stats", {
  id: serial("id").primaryKey(),
  teamId: integer("team_id").references(() => teams.id),
  coachId: integer("coach_id").references(() => coaches.id),
  season: text("season"), // e.g., "Fall 2025", "Spring 2026"
  gamesPlayed: integer("games_played"),
  // Team-level batting stats
  teamAvg: numeric("team_avg"), // Team Batting Average
  teamOps: numeric("team_ops"), // Team OPS
  totalQualityAtBats: integer("total_quality_at_bats"), // QAB count
  // Team-level pitching stats
  teamEra: numeric("team_era"), // Team ERA
  teamWhip: numeric("team_whip"), // Team WHIP
  // Raw data
  rawData: jsonb("raw_data"), // Store aggregated CSV data
  importedAt: timestamp("imported_at").defaultNow(),
  createdAt: timestamp("created_at").defaultNow(),
});

// User Subscription Info - Tracks subscription tier and founding member status
export const userSubscriptions = pgTable("user_subscriptions", {
  id: serial("id").primaryKey(),
  userId: text("user_id").notNull().references(() => users.id).unique(),
  stripeCustomerId: text("stripe_customer_id"),
  stripeSubscriptionId: text("stripe_subscription_id"),
  tier: text("tier"), // "basic", "elite", "coach"
  couponCode: text("coupon_code"), // Applied coupon code
  isFoundingMember: boolean("is_founding_member").default(false),
  status: text("status").default("inactive"), // "active", "inactive", "cancelled", "past_due"
  currentPeriodEnd: timestamp("current_period_end"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const insertTeamStatsSchema = createInsertSchema(teamStats).omit({ id: true, createdAt: true, importedAt: true });
export const insertUserSubscriptionSchema = createInsertSchema(userSubscriptions).omit({ id: true, createdAt: true, updatedAt: true });

export type TeamStats = typeof teamStats.$inferSelect;
export type UserSubscription = typeof userSubscriptions.$inferSelect;
export type CreateTeamStatsRequest = z.infer<typeof insertTeamStatsSchema>;
export type CreateUserSubscriptionRequest = z.infer<typeof insertUserSubscriptionSchema>;

