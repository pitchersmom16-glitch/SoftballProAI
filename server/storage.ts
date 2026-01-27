import { db } from "./db";
import { 
  coaches, teams, athletes, drills, assessments, assessmentFeedback, mentalEdge,
  type Coach, type Team, type Athlete, type Drill, type Assessment, type Feedback, type MentalEdge,
  type CreateCoachRequest, type CreateTeamRequest, type CreateAthleteRequest, 
  type CreateDrillRequest, type CreateMentalEdgeRequest, type CreateAssessmentRequest, type CreateFeedbackRequest,
  type UpdateAthleteRequest, type UpdateAssessmentRequest
} from "@shared/schema";
import { eq, desc } from "drizzle-orm";

export interface IStorage {
  // Coaches
  getCoach(id: number): Promise<Coach | undefined>;
  getCoachByUserId(userId: string): Promise<Coach | undefined>;
  createCoach(coach: CreateCoachRequest): Promise<Coach>;

  // Teams
  getTeams(): Promise<Team[]>;
  createTeam(team: CreateTeamRequest): Promise<Team>;

  // Athletes
  getAthletes(teamId?: number): Promise<Athlete[]>;
  getAthlete(id: number): Promise<Athlete | undefined>;
  createAthlete(athlete: CreateAthleteRequest): Promise<Athlete>;
  updateAthlete(id: number, athlete: UpdateAthleteRequest): Promise<Athlete>;

  // Drills
  getDrills(category?: string): Promise<Drill[]>;
  createDrill(drill: CreateDrillRequest): Promise<Drill>;
  deleteDrill(id: number): Promise<void>;

  // Mental Edge
  getMentalEdge(): Promise<MentalEdge[]>;
  createMentalEdge(content: CreateMentalEdgeRequest): Promise<MentalEdge>;
  deleteMentalEdge(id: number): Promise<void>;

  // Assessments
  getAssessments(athleteId?: number): Promise<Assessment[]>;
  getAssessment(id: number): Promise<Assessment | undefined>;
  createAssessment(assessment: CreateAssessmentRequest): Promise<Assessment>;
  updateAssessment(id: number, update: UpdateAssessmentRequest): Promise<Assessment>;
  
  // Feedback
  getFeedback(assessmentId: number): Promise<Feedback[]>;
  createFeedback(feedback: CreateFeedbackRequest): Promise<Feedback>;
}

export class DatabaseStorage implements IStorage {
  // Coaches
  async getCoach(id: number): Promise<Coach | undefined> {
    const [coach] = await db.select().from(coaches).where(eq(coaches.id, id));
    return coach;
  }
  async getCoachByUserId(userId: string): Promise<Coach | undefined> {
    const [coach] = await db.select().from(coaches).where(eq(coaches.userId, userId));
    return coach;
  }
  async createCoach(coach: CreateCoachRequest): Promise<Coach> {
    const [newCoach] = await db.insert(coaches).values(coach).returning();
    return newCoach;
  }

  // Teams
  async getTeams(): Promise<Team[]> {
    return db.select().from(teams);
  }
  async createTeam(team: CreateTeamRequest): Promise<Team> {
    const [newTeam] = await db.insert(teams).values(team).returning();
    return newTeam;
  }

  // Athletes
  async getAthletes(teamId?: number): Promise<Athlete[]> {
    if (teamId) {
      return db.select().from(athletes).where(eq(athletes.teamId, teamId));
    }
    return db.select().from(athletes);
  }
  async getAthlete(id: number): Promise<Athlete | undefined> {
    const [athlete] = await db.select().from(athletes).where(eq(athletes.id, id));
    return athlete;
  }
  async createAthlete(athlete: CreateAthleteRequest): Promise<Athlete> {
    const [newAthlete] = await db.insert(athletes).values(athlete).returning();
    return newAthlete;
  }
  async updateAthlete(id: number, update: UpdateAthleteRequest): Promise<Athlete> {
    const [updated] = await db.update(athletes).set(update).where(eq(athletes.id, id)).returning();
    return updated;
  }

  // Drills
  async getDrills(category?: string): Promise<Drill[]> {
    if (category) {
      return db.select().from(drills).where(eq(drills.category, category));
    }
    return db.select().from(drills);
  }
  async createDrill(drill: CreateDrillRequest): Promise<Drill> {
    const [newDrill] = await db.insert(drills).values(drill).returning();
    return newDrill;
  }
  async deleteDrill(id: number): Promise<void> {
    await db.delete(drills).where(eq(drills.id, id));
  }

  // Mental Edge
  async getMentalEdge(): Promise<MentalEdge[]> {
    return db.select().from(mentalEdge);
  }
  async createMentalEdge(content: CreateMentalEdgeRequest): Promise<MentalEdge> {
    const [newContent] = await db.insert(mentalEdge).values(content).returning();
    return newContent;
  }
  async deleteMentalEdge(id: number): Promise<void> {
    await db.delete(mentalEdge).where(eq(mentalEdge.id, id));
  }

  // Assessments
  async getAssessments(athleteId?: number): Promise<Assessment[]> {
    if (athleteId) {
      return db.select().from(assessments).where(eq(assessments.athleteId, athleteId)).orderBy(desc(assessments.createdAt));
    }
    return db.select().from(assessments).orderBy(desc(assessments.createdAt));
  }
  async getAssessment(id: number): Promise<Assessment | undefined> {
    const [assessment] = await db.select().from(assessments).where(eq(assessments.id, id));
    return assessment;
  }
  async createAssessment(assessment: CreateAssessmentRequest): Promise<Assessment> {
    const [newAssessment] = await db.insert(assessments).values(assessment).returning();
    return newAssessment;
  }
  async updateAssessment(id: number, update: UpdateAssessmentRequest): Promise<Assessment> {
    const [updated] = await db.update(assessments).set(update).where(eq(assessments.id, id)).returning();
    return updated;
  }

  // Feedback
  async getFeedback(assessmentId: number): Promise<Feedback[]> {
    return db.select().from(assessmentFeedback).where(eq(assessmentFeedback.assessmentId, assessmentId));
  }
  async createFeedback(feedback: CreateFeedbackRequest): Promise<Feedback> {
    const [newFeedback] = await db.insert(assessmentFeedback).values(feedback).returning();
    return newFeedback;
  }
}

export const storage = new DatabaseStorage();
