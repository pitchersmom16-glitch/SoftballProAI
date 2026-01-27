import { pgTable, text, serial, integer, boolean, timestamp, jsonb, date, numeric } from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export * from "./models/auth";
export * from "./models/chat";

import { users } from "./models/auth";

// === TABLE DEFINITIONS ===

export const coaches = pgTable("coaches", {
  id: serial("id").primaryKey(),
  userId: text("user_id").notNull().references(() => users.id), // Link to auth user
  name: text("name").notNull(),
  bio: text("bio"),
  experienceYears: integer("experience_years"),
  certificationLevel: text("certification_level"),
  createdAt: timestamp("created_at").defaultNow(),
});

export const teams = pgTable("teams", {
  id: serial("id").primaryKey(),
  headCoachId: integer("head_coach_id").references(() => coaches.id),
  name: text("name").notNull(),
  ageDivision: text("age_division"), // e.g., "12U", "14U"
  season: text("season"), // e.g., "Spring 2024"
  logoUrl: text("logo_url"),
  active: boolean("active").default(true),
  createdAt: timestamp("created_at").defaultNow(),
});

export const athletes = pgTable("athletes", {
  id: serial("id").primaryKey(),
  userId: text("user_id").references(() => users.id), // Optional: if athlete manages their own account
  name: text("name").notNull(),
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

export type UpdateAthleteRequest = Partial<CreateAthleteRequest>;
export type UpdateAssessmentRequest = Partial<CreateAssessmentRequest> & { status?: string, metrics?: any };
export type UpdateHomeworkRequest = Partial<CreateHomeworkRequest> & { status?: string, completedAt?: Date };

