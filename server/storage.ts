import { db } from "./db";
import { 
  coaches, teams, athletes, drills, assessments, assessmentFeedback, mentalEdge, playerCheckins,
  practicePlans, coachStudents, homeworkAssignments, playerCoachRelationships, coachInvites, playerSettings,
  studentInvites, baselineVideos, playerOnboarding, notifications,
  type Coach, type Team, type Athlete, type Drill, type Assessment, type Feedback, type MentalEdge, type PlayerCheckin,
  type PracticePlan, type CoachStudent, type HomeworkAssignment, type PlayerCoachRelationship, type CoachInvite, type PlayerSettings,
  type StudentInvite, type BaselineVideo, type PlayerOnboarding, type Notification,
  type CreateCoachRequest, type CreateTeamRequest, type CreateAthleteRequest, 
  type CreateDrillRequest, type CreateMentalEdgeRequest, type CreateAssessmentRequest, type CreateFeedbackRequest,
  type CreatePlayerCheckinRequest, type UpdateAthleteRequest, type UpdateAssessmentRequest,
  type CreatePlayerCoachRelationshipRequest, type CreateCoachInviteRequest, type CreatePlayerSettingsRequest,
  type CreateStudentInviteRequest, type CreateBaselineVideoRequest, type CreatePlayerOnboardingRequest,
  type CreateNotificationRequest
} from "@shared/schema";
import { users, type UserRole } from "@shared/models/auth";
import { eq, desc, and } from "drizzle-orm";

export interface IStorage {
  // Coaches
  getCoach(id: number): Promise<Coach | undefined>;
  getCoachByUserId(userId: string): Promise<Coach | undefined>;
  createCoach(coach: CreateCoachRequest): Promise<Coach>;

  // Teams
  getTeam(id: number): Promise<Team | undefined>;
  getTeams(): Promise<Team[]>;
  createTeam(team: CreateTeamRequest): Promise<Team>;
  deleteTeam(id: number): Promise<void>;

  // Athletes
  getAthletes(teamId?: number): Promise<Athlete[]>;
  getAthlete(id: number): Promise<Athlete | undefined>;
  createAthlete(athlete: CreateAthleteRequest): Promise<Athlete>;
  updateAthlete(id: number, athlete: UpdateAthleteRequest): Promise<Athlete>;
  deleteAthlete(id: number): Promise<void>;

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
  
  // User Role
  getUser(userId: string): Promise<{ id: string; role: UserRole | null } | undefined>;
  updateUserRole(userId: string, role: UserRole): Promise<void>;
  
  // Player Check-ins
  getPlayerCheckinByDate(userId: string, date: string): Promise<PlayerCheckin | undefined>;
  createPlayerCheckin(checkin: CreatePlayerCheckinRequest): Promise<PlayerCheckin>;
  
  // Practice Plans
  getPracticePlans(teamId?: number): Promise<PracticePlan[]>;
  createPracticePlan(plan: Partial<PracticePlan>): Promise<PracticePlan>;
  
  // Coach Students (Stable)
  getCoachStudents(coachId: number): Promise<(CoachStudent & { athlete?: Athlete })[]>;
  createCoachStudent(student: Partial<CoachStudent>): Promise<CoachStudent>;
  
  // Homework Assignments
  getHomeworkAssignments(coachId?: number, athleteId?: number): Promise<HomeworkAssignment[]>;
  createHomeworkAssignment(assignment: Partial<HomeworkAssignment>): Promise<HomeworkAssignment>;
  
  // Player-Coach Relationships (Hybrid Coaching)
  getPlayerCoaches(playerId: string): Promise<(PlayerCoachRelationship & { coach?: Coach })[]>;
  getCoachPlayers(coachId: number): Promise<(PlayerCoachRelationship & { player?: any })[]>;
  createPlayerCoachRelationship(rel: CreatePlayerCoachRelationshipRequest): Promise<PlayerCoachRelationship>;
  updatePlayerCoachRelationship(id: number, update: Partial<PlayerCoachRelationship>): Promise<PlayerCoachRelationship>;
  deletePlayerCoachRelationship(id: number): Promise<void>;
  
  // Coach Invites
  getPlayerInvites(playerId: string): Promise<CoachInvite[]>;
  getCoachInvites(coachId: number): Promise<CoachInvite[]>;
  getInviteByToken(token: string): Promise<CoachInvite | undefined>;
  createCoachInvite(invite: CreateCoachInviteRequest): Promise<CoachInvite>;
  updateCoachInvite(id: number, update: Partial<CoachInvite>): Promise<CoachInvite>;
  
  // Player Settings
  getPlayerSettings(userId: string): Promise<PlayerSettings | undefined>;
  createPlayerSettings(settings: CreatePlayerSettingsRequest): Promise<PlayerSettings>;
  updatePlayerSettings(userId: string, update: Partial<PlayerSettings>): Promise<PlayerSettings>;
  
  // Assessments by status (for coach review queue)
  getAssessmentsByStatus(status: string, coachId?: number): Promise<Assessment[]>;
  
  // === SPECIALIST COACH MODE ===
  
  // Student Invites (Smart Invite System)
  getStudentInvitesByCoach(coachId: number): Promise<StudentInvite[]>;
  getStudentInviteByToken(token: string): Promise<StudentInvite | undefined>;
  createStudentInvite(invite: CreateStudentInviteRequest): Promise<StudentInvite>;
  updateStudentInvite(id: number, update: Partial<StudentInvite>): Promise<StudentInvite>;
  getCoachActiveStudentCount(coachId: number): Promise<number>;
  
  // Baseline Videos
  getBaselineVideos(userId: string): Promise<BaselineVideo[]>;
  createBaselineVideo(video: CreateBaselineVideoRequest): Promise<BaselineVideo>;
  updateBaselineVideo(id: number, update: Partial<BaselineVideo>): Promise<BaselineVideo>;
  
  // Player Onboarding
  getPlayerOnboarding(userId: string): Promise<PlayerOnboarding | undefined>;
  createPlayerOnboarding(onboarding: CreatePlayerOnboardingRequest): Promise<PlayerOnboarding>;
  updatePlayerOnboarding(userId: string, update: Partial<PlayerOnboarding>): Promise<PlayerOnboarding>;
  
  // Coach by referral code
  getCoachByReferralCode(code: string): Promise<Coach | undefined>;
  updateCoach(id: number, update: Partial<Coach>): Promise<Coach>;
  
  // === NOTIFICATIONS ===
  getNotifications(userId: string): Promise<Notification[]>;
  getUnreadNotificationCount(userId: string): Promise<number>;
  createNotification(notification: CreateNotificationRequest): Promise<Notification>;
  markNotificationRead(id: number): Promise<Notification>;
  markAllNotificationsRead(userId: string): Promise<void>;
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
  async getTeam(id: number): Promise<Team | undefined> {
    const [team] = await db.select().from(teams).where(eq(teams.id, id));
    return team;
  }
  async getTeams(): Promise<Team[]> {
    return db.select().from(teams);
  }
  async createTeam(team: CreateTeamRequest): Promise<Team> {
    const [newTeam] = await db.insert(teams).values(team).returning();
    return newTeam;
  }

  async deleteTeam(id: number): Promise<void> {
    // First unassign all athletes from this team
    await db.update(athletes).set({ teamId: null }).where(eq(athletes.teamId, id));
    // Then delete the team
    await db.delete(teams).where(eq(teams.id, id));
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

  async deleteAthlete(id: number): Promise<void> {
    await db.delete(athletes).where(eq(athletes.id, id));
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

  // User Role
  async getUser(userId: string): Promise<{ id: string; role: UserRole | null } | undefined> {
    const result = await db.select({ id: users.id, role: users.role }).from(users).where(eq(users.id, userId));
    return result[0];
  }
  
  async updateUserRole(userId: string, role: UserRole): Promise<void> {
    await db.update(users).set({ role }).where(eq(users.id, userId));
  }

  // Player Check-ins
  async getPlayerCheckinByDate(userId: string, date: string): Promise<PlayerCheckin | undefined> {
    const [checkin] = await db.select().from(playerCheckins)
      .where(and(eq(playerCheckins.userId, userId), eq(playerCheckins.date, date)));
    return checkin;
  }

  async createPlayerCheckin(checkin: CreatePlayerCheckinRequest): Promise<PlayerCheckin> {
    const [newCheckin] = await db.insert(playerCheckins).values(checkin).returning();
    return newCheckin;
  }

  // Practice Plans
  async getPracticePlans(teamId?: number): Promise<PracticePlan[]> {
    if (teamId) {
      return db.select().from(practicePlans).where(eq(practicePlans.teamId, teamId)).orderBy(desc(practicePlans.createdAt));
    }
    return db.select().from(practicePlans).orderBy(desc(practicePlans.createdAt));
  }

  async createPracticePlan(plan: Partial<PracticePlan>): Promise<PracticePlan> {
    const [newPlan] = await db.insert(practicePlans).values(plan as any).returning();
    return newPlan;
  }

  // Coach Students (Stable)
  async getCoachStudents(coachId: number): Promise<(CoachStudent & { athlete?: Athlete })[]> {
    const students = await db.select().from(coachStudents).where(eq(coachStudents.coachId, coachId));
    
    // Join with athletes
    const enrichedStudents = await Promise.all(
      students.map(async (student) => {
        if (student.athleteId) {
          const [athlete] = await db.select().from(athletes).where(eq(athletes.id, student.athleteId));
          return { ...student, athlete };
        }
        return student;
      })
    );
    
    return enrichedStudents;
  }

  async createCoachStudent(student: Partial<CoachStudent>): Promise<CoachStudent> {
    const [newStudent] = await db.insert(coachStudents).values(student as any).returning();
    return newStudent;
  }

  // Homework Assignments
  async getHomeworkAssignments(coachId?: number, athleteId?: number): Promise<HomeworkAssignment[]> {
    if (coachId && athleteId) {
      return db.select().from(homeworkAssignments)
        .where(and(eq(homeworkAssignments.coachId, coachId), eq(homeworkAssignments.athleteId, athleteId)))
        .orderBy(desc(homeworkAssignments.createdAt));
    }
    if (coachId) {
      return db.select().from(homeworkAssignments).where(eq(homeworkAssignments.coachId, coachId)).orderBy(desc(homeworkAssignments.createdAt));
    }
    if (athleteId) {
      return db.select().from(homeworkAssignments).where(eq(homeworkAssignments.athleteId, athleteId)).orderBy(desc(homeworkAssignments.createdAt));
    }
    return db.select().from(homeworkAssignments).orderBy(desc(homeworkAssignments.createdAt));
  }

  async createHomeworkAssignment(assignment: Partial<HomeworkAssignment>): Promise<HomeworkAssignment> {
    const [newAssignment] = await db.insert(homeworkAssignments).values(assignment as any).returning();
    return newAssignment;
  }

  // Player-Coach Relationships (Hybrid Coaching)
  async getPlayerCoaches(playerId: string): Promise<(PlayerCoachRelationship & { coach?: Coach })[]> {
    const relationships = await db.select().from(playerCoachRelationships)
      .where(eq(playerCoachRelationships.playerId, playerId));
    
    // Join with coaches
    const enriched = await Promise.all(
      relationships.map(async (rel) => {
        const [coach] = await db.select().from(coaches).where(eq(coaches.id, rel.coachId));
        return { ...rel, coach };
      })
    );
    
    return enriched;
  }

  async getCoachPlayers(coachId: number): Promise<(PlayerCoachRelationship & { player?: any })[]> {
    const relationships = await db.select().from(playerCoachRelationships)
      .where(eq(playerCoachRelationships.coachId, coachId));
    
    // Join with users (players)
    const enriched = await Promise.all(
      relationships.map(async (rel) => {
        const [player] = await db.select().from(users).where(eq(users.id, rel.playerId));
        return { ...rel, player };
      })
    );
    
    return enriched;
  }

  async createPlayerCoachRelationship(rel: CreatePlayerCoachRelationshipRequest): Promise<PlayerCoachRelationship> {
    const [newRel] = await db.insert(playerCoachRelationships).values(rel).returning();
    return newRel;
  }

  async updatePlayerCoachRelationship(id: number, update: Partial<PlayerCoachRelationship>): Promise<PlayerCoachRelationship> {
    const [updated] = await db.update(playerCoachRelationships).set(update).where(eq(playerCoachRelationships.id, id)).returning();
    return updated;
  }

  async deletePlayerCoachRelationship(id: number): Promise<void> {
    await db.delete(playerCoachRelationships).where(eq(playerCoachRelationships.id, id));
  }

  // Coach Invites
  async getPlayerInvites(playerId: string): Promise<CoachInvite[]> {
    return db.select().from(coachInvites)
      .where(eq(coachInvites.fromPlayerId, playerId))
      .orderBy(desc(coachInvites.createdAt));
  }

  async getCoachInvites(coachId: number): Promise<CoachInvite[]> {
    return db.select().from(coachInvites)
      .where(eq(coachInvites.toCoachId, coachId))
      .orderBy(desc(coachInvites.createdAt));
  }

  async getInviteByToken(token: string): Promise<CoachInvite | undefined> {
    const [invite] = await db.select().from(coachInvites)
      .where(eq(coachInvites.inviteToken, token));
    return invite;
  }

  async createCoachInvite(invite: CreateCoachInviteRequest): Promise<CoachInvite> {
    const [newInvite] = await db.insert(coachInvites).values(invite).returning();
    return newInvite;
  }

  async updateCoachInvite(id: number, update: Partial<CoachInvite>): Promise<CoachInvite> {
    const [updated] = await db.update(coachInvites).set(update).where(eq(coachInvites.id, id)).returning();
    return updated;
  }

  // Player Settings
  async getPlayerSettings(userId: string): Promise<PlayerSettings | undefined> {
    const [settings] = await db.select().from(playerSettings)
      .where(eq(playerSettings.userId, userId));
    return settings;
  }

  async createPlayerSettings(settings: CreatePlayerSettingsRequest): Promise<PlayerSettings> {
    const [newSettings] = await db.insert(playerSettings).values(settings).returning();
    return newSettings;
  }

  async updatePlayerSettings(userId: string, update: Partial<PlayerSettings>): Promise<PlayerSettings> {
    const [updated] = await db.update(playerSettings)
      .set({ ...update, updatedAt: new Date() })
      .where(eq(playerSettings.userId, userId))
      .returning();
    return updated;
  }

  // Assessments by status (for coach review queue)
  async getAssessmentsByStatus(status: string, coachId?: number): Promise<Assessment[]> {
    if (coachId) {
      return db.select().from(assessments)
        .where(and(eq(assessments.status, status), eq(assessments.coachId, coachId)))
        .orderBy(desc(assessments.createdAt));
    }
    return db.select().from(assessments)
      .where(eq(assessments.status, status))
      .orderBy(desc(assessments.createdAt));
  }

  // === SPECIALIST COACH MODE ===

  // Student Invites (Smart Invite System)
  async getStudentInvitesByCoach(coachId: number): Promise<StudentInvite[]> {
    return db.select().from(studentInvites)
      .where(eq(studentInvites.coachId, coachId))
      .orderBy(desc(studentInvites.createdAt));
  }

  async getStudentInviteByToken(token: string): Promise<StudentInvite | undefined> {
    const [invite] = await db.select().from(studentInvites)
      .where(eq(studentInvites.inviteToken, token));
    return invite;
  }

  async createStudentInvite(invite: CreateStudentInviteRequest): Promise<StudentInvite> {
    const [newInvite] = await db.insert(studentInvites).values(invite).returning();
    return newInvite;
  }

  async updateStudentInvite(id: number, update: Partial<StudentInvite>): Promise<StudentInvite> {
    const [updated] = await db.update(studentInvites).set(update).where(eq(studentInvites.id, id)).returning();
    return updated;
  }

  async getCoachActiveStudentCount(coachId: number): Promise<number> {
    const relationships = await db.select().from(playerCoachRelationships)
      .where(and(eq(playerCoachRelationships.coachId, coachId), eq(playerCoachRelationships.status, "active")));
    return relationships.length;
  }

  // Baseline Videos
  async getBaselineVideos(userId: string): Promise<BaselineVideo[]> {
    return db.select().from(baselineVideos)
      .where(eq(baselineVideos.userId, userId))
      .orderBy(baselineVideos.videoNumber);
  }

  async createBaselineVideo(video: CreateBaselineVideoRequest): Promise<BaselineVideo> {
    const [newVideo] = await db.insert(baselineVideos).values(video).returning();
    return newVideo;
  }

  async updateBaselineVideo(id: number, update: Partial<BaselineVideo>): Promise<BaselineVideo> {
    const [updated] = await db.update(baselineVideos).set(update).where(eq(baselineVideos.id, id)).returning();
    return updated;
  }

  // Player Onboarding
  async getPlayerOnboarding(userId: string): Promise<PlayerOnboarding | undefined> {
    const [onboarding] = await db.select().from(playerOnboarding)
      .where(eq(playerOnboarding.userId, userId));
    return onboarding;
  }

  async createPlayerOnboarding(onboarding: CreatePlayerOnboardingRequest): Promise<PlayerOnboarding> {
    const [newOnboarding] = await db.insert(playerOnboarding).values(onboarding).returning();
    return newOnboarding;
  }

  async updatePlayerOnboarding(userId: string, update: Partial<PlayerOnboarding>): Promise<PlayerOnboarding> {
    const [updated] = await db.update(playerOnboarding)
      .set({ ...update, updatedAt: new Date() })
      .where(eq(playerOnboarding.userId, userId))
      .returning();
    return updated;
  }

  // Coach by referral code
  async getCoachByReferralCode(code: string): Promise<Coach | undefined> {
    const [coach] = await db.select().from(coaches)
      .where(eq(coaches.referralCode, code));
    return coach;
  }

  async updateCoach(id: number, update: Partial<Coach>): Promise<Coach> {
    const [updated] = await db.update(coaches).set(update).where(eq(coaches.id, id)).returning();
    return updated;
  }

  // === NOTIFICATIONS ===
  async getNotifications(userId: string): Promise<Notification[]> {
    return db.select().from(notifications)
      .where(eq(notifications.userId, userId))
      .orderBy(desc(notifications.createdAt));
  }

  async getUnreadNotificationCount(userId: string): Promise<number> {
    const unread = await db.select().from(notifications)
      .where(and(eq(notifications.userId, userId), eq(notifications.read, false)));
    return unread.length;
  }

  async createNotification(notification: CreateNotificationRequest): Promise<Notification> {
    const [newNotification] = await db.insert(notifications).values(notification).returning();
    return newNotification;
  }

  async markNotificationRead(id: number): Promise<Notification> {
    const [updated] = await db.update(notifications)
      .set({ read: true })
      .where(eq(notifications.id, id))
      .returning();
    return updated;
  }

  async markAllNotificationsRead(userId: string): Promise<void> {
    await db.update(notifications)
      .set({ read: true })
      .where(eq(notifications.userId, userId));
  }
}

export const storage = new DatabaseStorage();
