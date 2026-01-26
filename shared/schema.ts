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

export const drills = pgTable("drills", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  category: text("category").notNull(), // e.g., "Mechanics", "Strength", "Mental"
  skillType: text("skill_type"), // e.g., "pitching", "hitting"
  difficulty: text("difficulty"), // Beginner, Intermediate, Advanced
  description: text("description").notNull(),
  videoUrl: text("video_url"),
  equipment: text("equipment").array(),
  ageRange: text("age_range"),
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
export const insertAssessmentSchema = createInsertSchema(assessments).omit({ id: true, createdAt: true, status: true, metrics: true }); // Status/metrics usually set by system
export const insertFeedbackSchema = createInsertSchema(assessmentFeedback).omit({ id: true, createdAt: true });

// === EXPLICIT API CONTRACT TYPES ===

export type Coach = typeof coaches.$inferSelect;
export type Team = typeof teams.$inferSelect;
export type Athlete = typeof athletes.$inferSelect;
export type Drill = typeof drills.$inferSelect;
export type Assessment = typeof assessments.$inferSelect;
export type Feedback = typeof assessmentFeedback.$inferSelect;

export type CreateCoachRequest = z.infer<typeof insertCoachSchema>;
export type CreateTeamRequest = z.infer<typeof insertTeamSchema>;
export type CreateAthleteRequest = z.infer<typeof insertAthleteSchema>;
export type CreateDrillRequest = z.infer<typeof insertDrillSchema>;
export type CreateAssessmentRequest = z.infer<typeof insertAssessmentSchema>;
export type CreateFeedbackRequest = z.infer<typeof insertFeedbackSchema>;

export type UpdateAthleteRequest = Partial<CreateAthleteRequest>;
export type UpdateAssessmentRequest = Partial<CreateAssessmentRequest> & { status?: string, metrics?: any };

