import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { api } from "@shared/routes";
import { z } from "zod";
import { setupAuth, registerAuthRoutes, isAuthenticated } from "./auth/localAuth";
import { registerObjectStorageRoutes } from "./storage/objectStorage";
import { openai } from "./replit_integrations/audio"; // Use the audio client for openai instance
import { analyzeMechanics, getCorrectiveDrills, getDrillsByTag, getDrillsByExpert } from "./brain/analyze_mechanics";
import { stripeService } from "./stripeService";
import { getStripePublishableKey, getUncachableStripeClient } from "./stripeClient";

export async function registerRoutes(
  httpServer: Server,
  app: Express
): Promise<Server> {
  // Wire up local authentication
  await setupAuth(app);
  registerAuthRoutes(app);
  registerObjectStorageRoutes(app);

  // === API ROUTES ===

  // User Role Management
  app.put("/api/user/role", async (req, res) => {
    try {
      if (!req.user) return res.status(401).json({ message: "Unauthorized" });
      const userId = (req.user as any).claims.sub;
      const userClaims = (req.user as any).claims;
      
      const roleSchema = z.object({
        role: z.enum(["player", "team_coach", "pitching_coach"])
      });
      
      const { role } = roleSchema.parse(req.body);
      await storage.updateUserRole(userId, role);
      
      // For coach roles, ensure coach record exists
      if (role === "team_coach" || role === "pitching_coach") {
        let existingCoach = await storage.getCoachByUserId(userId);
        
        if (!existingCoach) {
          // Create coach record
          const firstName = userClaims.given_name || userClaims.first_name || "Coach";
          const lastName = userClaims.family_name || userClaims.last_name || "";
          const coachName = `${firstName} ${lastName}`.trim();
          
          existingCoach = await storage.createCoach({
            userId,
            name: coachName,
            specialty: role === "pitching_coach" ? "PITCHING" : null,
          });
        }
        
        // For team coaches, ensure they have at least one team
        if (role === "team_coach") {
          const existingTeams = await storage.getTeamsByHeadCoach(existingCoach.id);
          if (!existingTeams || existingTeams.length === 0) {
            const firstName = userClaims.given_name || userClaims.first_name || "Coach";
            const lastName = userClaims.family_name || userClaims.last_name || "";
            const coachName = `${firstName} ${lastName}`.trim();
            const teamCode = `TEAM_${crypto.randomUUID().slice(0, 8).toUpperCase()}`;
            await storage.createTeam({
              name: `${coachName}'s Team`,
              headCoachId: existingCoach.id,
              referralCode: teamCode,
            });
          }
        }
      }
      
      res.json({ success: true, role });
    } catch (err) {
      if (err instanceof z.ZodError) {
        return res.status(400).json({ message: err.errors[0].message });
      }
      throw err;
    }
  });

  // Player Check-ins
  app.get("/api/player/checkin/today", async (req, res) => {
    try {
      if (!req.user) return res.status(401).json({ message: "Unauthorized" });
      const userId = (req.user as any).claims.sub;
      const today = new Date().toISOString().split('T')[0];
      const checkin = await storage.getPlayerCheckinByDate(userId, today);
      res.json(checkin || null);
    } catch (err) {
      throw err;
    }
  });

  app.post("/api/player/checkin", async (req, res) => {
    try {
      if (!req.user) return res.status(401).json({ message: "Unauthorized" });
      const userId = (req.user as any).claims.sub;
      
      const checkinSchema = z.object({
        mood: z.string(),
        sorenessAreas: z.array(z.string()),
        sorenessLevel: z.number().min(1).max(10),
        notes: z.string().optional(),
      });
      
      const data = checkinSchema.parse(req.body);
      const today = new Date().toISOString().split('T')[0];
      
      // Determine blocked activities based on soreness
      const blockedActivities: string[] = [];
      const isArmSore = data.sorenessAreas.includes("arm") || data.sorenessAreas.includes("shoulder");
      if (isArmSore && data.sorenessLevel >= 7) {
        blockedActivities.push("pitching", "throwing");
      }
      
      const checkin = await storage.createPlayerCheckin({
        userId,
        date: today,
        mood: data.mood,
        sorenessAreas: data.sorenessAreas,
        sorenessLevel: data.sorenessLevel,
        notes: data.notes || null,
        blockedActivities,
      });
      
      // NOTIFICATION TRIGGER: High soreness/injury alert to Team Coach
      if (data.sorenessLevel >= 7 && data.sorenessAreas.length > 0) {
        // Find player's team coach (if on a team)
        const athletes = await storage.getAthletes();
        const playerAthlete = athletes.find(a => a.userId === userId);
        
        if (playerAthlete?.teamId) {
          const team = await storage.getTeam(playerAthlete.teamId);
          if (team?.headCoachId) {
            const coach = await storage.getCoach(team.headCoachId);
            if (coach?.userId) {
              const sorenessType = data.sorenessLevel >= 8 ? "injury_alert" : "high_soreness_alert";
              const athleteName = `${playerAthlete.firstName} ${playerAthlete.lastName}`;
              const alertTitle = data.sorenessLevel >= 8 
                ? `INJURY ALERT: ${athleteName}`
                : `High Soreness: ${athleteName}`;
              
              await storage.createNotification({
                userId: coach.userId,
                type: sorenessType,
                title: alertTitle,
                message: `${athleteName} reported ${data.sorenessLevel}/10 soreness in: ${data.sorenessAreas.join(", ")}. ${data.notes || "Check roster status before practice."}`,
                linkUrl: "/roster",
                relatedId: playerAthlete.id.toString(),
              });
            }
          }
        }
        
        // Also notify private instructor coaches
        const playerCoaches = await storage.getPlayerCoaches(userId);
        for (const rel of playerCoaches.filter(r => r.status === "active")) {
          const coach = await storage.getCoach(rel.coachId);
          if (coach?.userId) {
            await storage.createNotification({
              userId: coach.userId,
              type: data.sorenessLevel >= 8 ? "injury_alert" : "high_soreness_alert",
              title: data.sorenessLevel >= 8 ? `INJURY ALERT` : `High Soreness Alert`,
              message: `Your student reported ${data.sorenessLevel}/10 soreness in: ${data.sorenessAreas.join(", ")}.`,
              linkUrl: "/roster",
              relatedId: userId,
            });
          }
        }
      }
      
      res.status(201).json(checkin);
    } catch (err) {
      if (err instanceof z.ZodError) {
        return res.status(400).json({ message: err.errors[0].message });
      }
      throw err;
    }
  });

  // Player video assessment upload (for Coach Me feature)
  app.post("/api/player/assessment", async (req, res) => {
    try {
      if (!req.user) return res.status(401).json({ message: "Unauthorized" });
      const userId = (req.user as any).claims.sub;
      const userClaims = (req.user as any).claims;
      
      const assessmentSchema = z.object({
        skillType: z.enum(["hitting", "pitching", "catching", "fielding"]),
        videoUrl: z.string().url(),
      });
      
      const data = assessmentSchema.parse(req.body);
      
      // Find or create athlete profile for this player
      const athletes = await storage.getAthletes();
      let athlete = athletes.find(a => a.userId === userId);
      
      // If no athlete profile exists, create one
      if (!athlete) {
        athlete = await storage.createAthlete({
          firstName: userClaims.given_name || "Solo",
          lastName: userClaims.family_name || "Player",
          userId: userId,
        });
      }
      
      // Create assessment record
      const assessment = await storage.createAssessment({
        athleteId: athlete.id,
        skillType: data.skillType,
        videoUrl: data.videoUrl,
      });
      
      res.status(201).json(assessment);
    } catch (err) {
      if (err instanceof z.ZodError) {
        return res.status(400).json({ message: err.errors[0].message });
      }
      throw err;
    }
  });

  // Random Mental Edge (Championship Mindset)
  app.get("/api/mental-edge/random", async (req, res) => {
    try {
      const allContent = await storage.getMentalEdge();
      if (allContent.length === 0) {
        return res.json(null);
      }
      const randomIndex = Math.floor(Math.random() * allContent.length);
      res.json(allContent[randomIndex]);
    } catch (err) {
      throw err;
    }
  });

  // Coaches
  app.get(api.coaches.me.path, async (req, res) => {
    if (!req.user) return res.status(401).json({ message: "Unauthorized" });
    const userId = (req.user as any).claims.sub;
    const coach = await storage.getCoachByUserId(userId);
    if (!coach) return res.status(404).json({ message: "Coach profile not found" });
    res.json(coach);
  });

  app.post(api.coaches.create.path, async (req, res) => {
    try {
      if (!req.user) return res.status(401).json({ message: "Unauthorized" });
      const userId = (req.user as any).claims.sub;
      
      const input = api.coaches.create.input.parse({
        ...req.body,
        userId: userId // Enforce userId from auth
      });
      
      const coach = await storage.createCoach(input);
      res.status(201).json(coach);
    } catch (err) {
      if (err instanceof z.ZodError) {
        return res.status(400).json({ message: err.errors[0].message });
      }
      throw err;
    }
  });

  // Athletes
  app.get(api.athletes.list.path, async (req, res) => {
    const teamId = req.query.teamId ? Number(req.query.teamId) : undefined;
    const athletes = await storage.getAthletes(teamId);
    res.json(athletes);
  });

  app.get(api.athletes.get.path, async (req, res) => {
    const athlete = await storage.getAthlete(Number(req.params.id));
    if (!athlete) return res.status(404).json({ message: "Athlete not found" });
    res.json(athlete);
  });

  app.post(api.athletes.create.path, async (req, res) => {
    try {
      const input = api.athletes.create.input.parse(req.body);
      const athlete = await storage.createAthlete(input);
      res.status(201).json(athlete);
    } catch (err) {
      if (err instanceof z.ZodError) {
        return res.status(400).json({ message: err.errors[0].message });
      }
      throw err;
    }
  });

  // Update athlete
  app.put(api.athletes.update.path, isAuthenticated, async (req, res) => {
    try {
      if (!req.user) return res.status(401).json({ message: "Unauthorized" });
      const userId = (req.user as any).claims.sub;
      
      const id = Number(req.params.id);
      const athlete = await storage.getAthlete(id);
      if (!athlete) {
        return res.status(404).json({ message: "Athlete not found" });
      }
      
      // Authorization check: user must either own the athlete OR be coach of athlete's team
      let isAuthorized = false;
      
      // Check if athlete belongs to this user
      if (athlete.userId === userId) {
        isAuthorized = true;
      }
      
      // Check if user is a coach who manages this athlete's team
      if (!isAuthorized && athlete.teamId) {
        const coach = await storage.getCoachByUserId(userId);
        if (coach) {
          const team = await storage.getTeam(athlete.teamId);
          if (team && team.headCoachId === coach.id) {
            isAuthorized = true;
          }
        }
      }
      
      // Check if user is a private instructor with this athlete as a student
      if (!isAuthorized) {
        const coach = await storage.getCoachByUserId(userId);
        if (coach) {
          const relationships = await storage.getCoachPlayers(coach.id);
          const isMyStudent = relationships.some(rel => rel.playerId === athlete.userId && rel.status === "active");
          if (isMyStudent) {
            isAuthorized = true;
          }
        }
      }
      
      if (!isAuthorized) {
        return res.status(403).json({ message: "You are not authorized to update this athlete" });
      }
      
      const input = api.athletes.update.input.parse(req.body);
      const updated = await storage.updateAthlete(id, input);
      res.json(updated);
    } catch (err) {
      if (err instanceof z.ZodError) {
        return res.status(400).json({ message: err.errors[0].message });
      }
      console.error("Error updating athlete:", err);
      res.status(500).json({ message: "Failed to update athlete" });
    }
  });

  // Delete athlete
  app.delete("/api/athletes/:id", isAuthenticated, async (req, res) => {
    try {
      const id = Number(req.params.id);
      const athlete = await storage.getAthlete(id);
      if (!athlete) {
        return res.status(404).json({ message: "Athlete not found" });
      }
      await storage.deleteAthlete(id);
      res.json({ message: "Athlete deleted successfully" });
    } catch (err) {
      console.error("Error deleting athlete:", err);
      res.status(500).json({ message: "Failed to delete athlete" });
    }
  });

  // Teams
  app.get(api.teams.list.path, async (req, res) => {
    const teams = await storage.getTeams();
    res.json(teams);
  });

  app.post(api.teams.create.path, async (req, res) => {
    try {
      const input = api.teams.create.input.parse(req.body);
      const team = await storage.createTeam(input);
      res.status(201).json(team);
    } catch (err) {
      if (err instanceof z.ZodError) {
        return res.status(400).json({ message: err.errors[0].message });
      }
      throw err;
    }
  });

  // Update team (for head coaches to update their team)
  app.patch("/api/teams/:id", isAuthenticated, async (req, res) => {
    try {
      if (!req.user) return res.status(401).json({ message: "Unauthorized" });
      const userId = (req.user as any).claims.sub;
      
      const id = Number(req.params.id);
      const team = await storage.getTeam(id);
      if (!team) {
        return res.status(404).json({ message: "Team not found" });
      }
      
      // Get the coach for this user
      const coach = await storage.getCoachByUserId(userId);
      
      // Authorization: Must be existing head coach OR team has no head coach (can claim it)
      const isHeadCoach = coach && team.headCoachId === coach.id;
      const canClaimTeam = coach && !team.headCoachId;
      
      if (!isHeadCoach && !canClaimTeam) {
        return res.status(403).json({ message: "Only the head coach can update this team" });
      }
      
      const updateSchema = z.object({
        name: z.string().optional(),
        ageDivision: z.string().optional(),
        season: z.string().optional(),
        logoUrl: z.string().url().optional().nullable(),
        headCoachId: z.number().optional(),
        active: z.boolean().optional(),
      });
      
      const input = updateSchema.parse(req.body);
      
      // If user is claiming the team (no existing head coach), they can set themselves as head coach
      if (canClaimTeam && input.headCoachId && input.headCoachId === coach!.id) {
        // Allow claiming
      } else if (isHeadCoach) {
        // Head coach can update anything
      } else if (input.headCoachId !== undefined) {
        // Non-head coach trying to set headCoachId
        return res.status(403).json({ message: "Only existing head coach can change head coach" });
      }
      
      const updated = await storage.updateTeam(id, input);
      res.json(updated);
    } catch (err) {
      if (err instanceof z.ZodError) {
        return res.status(400).json({ message: err.errors[0].message });
      }
      console.error("Error updating team:", err);
      res.status(500).json({ message: "Failed to update team" });
    }
  });

  // Delete team
  app.delete("/api/teams/:id", isAuthenticated, async (req, res) => {
    try {
      const id = Number(req.params.id);
      const team = await storage.getTeam(id);
      if (!team) {
        return res.status(404).json({ message: "Team not found" });
      }
      await storage.deleteTeam(id);
      res.json({ message: "Team deleted successfully" });
    } catch (err) {
      console.error("Error deleting team:", err);
      res.status(500).json({ message: "Failed to delete team" });
    }
  });

  // Drills
  app.get(api.drills.list.path, async (req, res) => {
    const category = req.query.category as string;
    const drills = await storage.getDrills(category);
    res.json(drills);
  });

  app.post(api.drills.create.path, async (req, res) => {
    try {
      const input = api.drills.create.input.parse(req.body);
      const drill = await storage.createDrill(input);
      res.status(201).json(drill);
    } catch (err) {
      if (err instanceof z.ZodError) {
        return res.status(400).json({ message: err.errors[0].message });
      }
      throw err;
    }
  });

  // Assessments
  app.get(api.assessments.list.path, async (req, res) => {
    const athleteId = req.query.athleteId ? Number(req.query.athleteId) : undefined;
    const assessments = await storage.getAssessments(athleteId);
    res.json(assessments);
  });

  app.get(api.assessments.get.path, async (req, res) => {
    const id = Number(req.params.id);
    const assessment = await storage.getAssessment(id);
    if (!assessment) return res.status(404).json({ message: "Assessment not found" });
    
    const feedback = await storage.getFeedback(id);
    res.json({ ...assessment, feedback });
  });

  app.post(api.assessments.create.path, async (req, res) => {
    try {
      const input = api.assessments.create.input.parse(req.body);
      const assessment = await storage.createAssessment(input);
      res.status(201).json(assessment);

      // Optionally trigger analysis immediately?
      // For MVP, user might click "Analyze" separately.
    } catch (err) {
      if (err instanceof z.ZodError) {
        return res.status(400).json({ message: err.errors[0].message });
      }
      throw err;
    }
  });

  app.post(api.assessments.analyze.path, async (req, res) => {
    const id = Number(req.params.id);
    const assessment = await storage.getAssessment(id);
    if (!assessment) return res.status(404).json({ message: "Assessment not found" });

    // Start Async Analysis
    // In a real app, this would be a background job.
    // For MVP, we'll await a quick mock/AI call or set timeout.
    
    // Update status to analyzing
    await storage.updateAssessment(id, { status: "analyzing" });

    // Mock AI Analysis
    (async () => {
      try {
        // Wait a bit to simulate processing
        await new Promise(r => setTimeout(r, 2000));

        // Call OpenAI to generate feedback based on "metrics" (mocked for now)
        // Since we don't have real pose estimation, we'll hallucinate some metrics based on a random seed
        // or just generate generic feedback.
        
        const mockMetrics = {
          velocity_mph: 55 + Math.random() * 10,
          spin_rate: 1200 + Math.random() * 200,
          stride_length_percentage: 85 + Math.random() * 15
        };

        const response = await openai.chat.completions.create({
          model: "gpt-5.1",
          messages: [
            { role: "system", content: "You are an expert FASTPITCH SOFTBALL mechanics coach specializing in the windmill pitching motion. Your expertise covers: rise ball, drop ball, curve ball, change-up, and screw ball mechanics. You understand proper drag foot technique, hip drive, arm circle speed, wrist snap timing, and stride length optimization specific to fastpitch softball - NOT baseball. All feedback must be age-appropriate and focused on injury prevention and proper fastpitch form." },
            { role: "user", content: `Fastpitch Softball Metrics: ${JSON.stringify(mockMetrics)}. Skill: ${assessment.skillType}. Generate 3 key feedback points focused on windmill pitching mechanics, drag foot position, and release point.` }
          ],
        });

        const feedbackText = response.choices[0].message.content || "Great effort! Keep working on consistency.";

        // Save Feedback
        await storage.createFeedback({
          assessmentId: id,
          feedbackText: feedbackText,
          priority: "High",
          issueDetected: "Mechanics consistency"
        });

        // Update Assessment
        await storage.updateAssessment(id, { 
          status: "completed",
          metrics: mockMetrics
        });

      } catch (error) {
        console.error("Analysis failed", error);
        await storage.updateAssessment(id, { status: "failed" });
      }
    })();

    res.status(202).json({ message: "Analysis started", status: "analyzing" });
  });

  // === ROSTER HEALTH ===
  app.get("/api/roster-health", async (req, res) => {
    try {
      const teamId = req.query.teamId ? Number(req.query.teamId) : undefined;
      const athletes = await storage.getAthletes(teamId);
      const today = new Date().toISOString().split('T')[0];
      
      // Get health status for each athlete based on check-ins
      const rosterHealth = await Promise.all(
        athletes.map(async (athlete) => {
          let healthStatus: "healthy" | "caution" | "rest" = "healthy";
          let lastCheckIn = null;
          
          // Try to get check-in if athlete has a userId
          if (athlete.userId) {
            const checkin = await storage.getPlayerCheckinByDate(athlete.userId, today);
            if (checkin) {
              lastCheckIn = {
                mood: checkin.mood,
                sorenessLevel: checkin.sorenessLevel,
                sorenessAreas: checkin.sorenessAreas || [],
                blockedActivities: checkin.blockedActivities || [],
              };
              
              // Determine health status based on check-in data
              const isArmSore = lastCheckIn.sorenessAreas.includes("arm") || 
                               lastCheckIn.sorenessAreas.includes("shoulder");
              const sorenessLvl = lastCheckIn.sorenessLevel ?? 0;
              if (isArmSore && sorenessLvl >= 7) {
                healthStatus = "rest";
              } else if (isArmSore || sorenessLvl >= 5) {
                healthStatus = "caution";
              }
            }
          }
          
          return {
            athlete,
            healthStatus,
            lastCheckIn,
          };
        })
      );
      
      res.json(rosterHealth);
    } catch (err) {
      throw err;
    }
  });

  // === PRACTICE PLANS ===
  app.get("/api/practice-plans", async (req, res) => {
    try {
      const teamId = req.query.teamId ? Number(req.query.teamId) : undefined;
      const plans = await storage.getPracticePlans(teamId);
      res.json(plans);
    } catch (err) {
      throw err;
    }
  });

  app.post("/api/practice-plans", async (req, res) => {
    try {
      if (!req.user) return res.status(401).json({ message: "Unauthorized" });
      
      const planSchema = z.object({
        name: z.string().min(1),
        duration: z.number().optional(),
        focus: z.string().optional(),
        scheduledDate: z.string().optional(),
        notes: z.string().optional(),
        teamId: z.number().optional(),
      });
      
      const data = planSchema.parse(req.body);
      
      // Get coach profile to set coachId
      const userId = (req.user as any).claims.sub;
      const coach = await storage.getCoachByUserId(userId);
      if (!coach) return res.status(404).json({ message: "Coach profile not found. Please complete your profile first." });
      
      // Validate team ownership if teamId is provided
      if (data.teamId) {
        const team = await storage.getTeam(data.teamId);
        if (!team || team.headCoachId !== coach.id) {
          return res.status(403).json({ message: "You don't have access to this team" });
        }
      }
      
      const plan = await storage.createPracticePlan({
        name: data.name,
        duration: data.duration || null,
        focus: data.focus || null,
        scheduledDate: data.scheduledDate || null,
        notes: data.notes || null,
        teamId: data.teamId || null,
        coachId: coach.id,
      });
      res.status(201).json(plan);
    } catch (err) {
      if (err instanceof z.ZodError) {
        return res.status(400).json({ message: err.errors[0].message });
      }
      throw err;
    }
  });

  // === COACH STUDENTS (Stable) ===
  app.get("/api/coach/students", async (req, res) => {
    try {
      if (!req.user) return res.status(401).json({ message: "Unauthorized" });
      const userId = (req.user as any).claims.sub;
      const coach = await storage.getCoachByUserId(userId);
      if (!coach) return res.json([]);
      
      const students = await storage.getCoachStudents(coach.id);
      res.json(students);
    } catch (err) {
      throw err;
    }
  });

  app.post("/api/coach/students", async (req, res) => {
    try {
      if (!req.user) return res.status(401).json({ message: "Unauthorized" });
      const userId = (req.user as any).claims.sub;
      const coach = await storage.getCoachByUserId(userId);
      if (!coach) return res.status(404).json({ message: "Coach profile not found" });
      
      const studentSchema = z.object({
        athleteId: z.number(),
        status: z.string().optional(),
        startDate: z.string().optional(),
        notes: z.string().optional(),
      });
      
      const data = studentSchema.parse(req.body);
      const student = await storage.createCoachStudent({
        ...data,
        coachId: coach.id,
      });
      res.status(201).json(student);
    } catch (err) {
      if (err instanceof z.ZodError) {
        return res.status(400).json({ message: err.errors[0].message });
      }
      throw err;
    }
  });

  // === HOMEWORK ASSIGNMENTS ===
  app.get("/api/homework", async (req, res) => {
    try {
      if (!req.user) return res.status(401).json({ message: "Unauthorized" });
      const userId = (req.user as any).claims.sub;
      const coach = await storage.getCoachByUserId(userId);
      
      const athleteId = req.query.athleteId ? Number(req.query.athleteId) : undefined;
      const assignments = await storage.getHomeworkAssignments(coach?.id, athleteId);
      res.json(assignments);
    } catch (err) {
      throw err;
    }
  });

  app.post("/api/homework", async (req, res) => {
    try {
      if (!req.user) return res.status(401).json({ message: "Unauthorized" });
      const userId = (req.user as any).claims.sub;
      const coach = await storage.getCoachByUserId(userId);
      if (!coach) return res.status(404).json({ message: "Coach profile not found" });
      
      const homeworkSchema = z.object({
        athleteId: z.number(),
        title: z.string().min(1),
        description: z.string().optional(),
        skillFocus: z.string().optional(),
        referenceVideoUrl: z.string().optional(),
        drillId: z.number().optional(),
        reps: z.number().optional(),
        dueDate: z.string().optional(),
      });
      
      const data = homeworkSchema.parse(req.body);
      const assignment = await storage.createHomeworkAssignment({
        athleteId: data.athleteId,
        title: data.title,
        description: data.description || null,
        skillFocus: data.skillFocus || null,
        referenceVideoUrl: data.referenceVideoUrl || null,
        drillId: data.drillId || null,
        reps: data.reps || null,
        dueDate: data.dueDate || null,
        coachId: coach.id,
      });
      res.status(201).json(assignment);
    } catch (err) {
      if (err instanceof z.ZodError) {
        return res.status(400).json({ message: err.errors[0].message });
      }
      throw err;
    }
  });

  // === BRAIN API ROUTES ===
  
  // Analyze mechanics and get drill recommendations
  app.post("/api/brain/analyze", async (req, res) => {
    try {
      const { skillType, detectedIssues, athleteLevel, limit } = req.body;
      
      if (!skillType || !["pitching", "hitting"].includes(skillType)) {
        return res.status(400).json({ 
          message: "Invalid skillType. Must be 'pitching' or 'hitting'" 
        });
      }

      const result = await analyzeMechanics({
        skillType,
        detectedIssues: detectedIssues || [],
        athleteLevel: athleteLevel || "Intermediate",
        limit: limit || 3
      });

      res.json(result);
    } catch (err) {
      console.error("Brain analysis error:", err);
      res.status(500).json({ message: "Analysis failed" });
    }
  });

  // Quick corrective drill lookup
  app.get("/api/brain/corrective-drills", async (req, res) => {
    try {
      const { skillType, issue, limit } = req.query;
      
      if (!skillType || !["pitching", "hitting"].includes(skillType as string)) {
        return res.status(400).json({ 
          message: "Invalid skillType. Must be 'pitching' or 'hitting'" 
        });
      }
      
      if (!issue) {
        return res.status(400).json({ message: "Issue parameter required" });
      }

      const drills = await getCorrectiveDrills(
        (skillType as string).toUpperCase() as "PITCHING" | "HITTING" | "CATCHING" | "FIELDING",
        issue as string,
        limit ? Number(limit) : 3
      );

      res.json({ issue, recommendations: drills });
    } catch (err) {
      console.error("Corrective drills error:", err);
      res.status(500).json({ message: "Lookup failed" });
    }
  });

  // Search drills by mechanic tag
  app.get("/api/brain/drills-by-tag", async (req, res) => {
    try {
      const { tag, limit } = req.query;
      
      if (!tag) {
        return res.status(400).json({ message: "Tag parameter required" });
      }

      const drills = await getDrillsByTag(tag as string, limit ? Number(limit) : 10);
      res.json({ tag, drills });
    } catch (err) {
      console.error("Drills by tag error:", err);
      res.status(500).json({ message: "Lookup failed" });
    }
  });

  // Search drills by expert source
  app.get("/api/brain/drills-by-expert", async (req, res) => {
    try {
      const { expert } = req.query;
      
      if (!expert) {
        return res.status(400).json({ message: "Expert parameter required" });
      }

      const drills = await getDrillsByExpert(expert as string);
      res.json({ expert, drills });
    } catch (err) {
      console.error("Drills by expert error:", err);
      res.status(500).json({ message: "Lookup failed" });
    }
  });

  // === BRAIN TRAINING ROUTES (Admin Dashboard) ===

  // Add new drill to Knowledge Base
  app.post("/api/brain/train/drill", async (req, res) => {
    try {
      const input = api.brain.trainDrill.input.parse(req.body);
      const drill = await storage.createDrill(input);
      res.status(201).json({ message: "Drill added to Knowledge Base", drill });
    } catch (err) {
      if (err instanceof z.ZodError) {
        return res.status(400).json({ message: err.errors[0].message });
      }
      console.error("Train drill error:", err);
      res.status(500).json({ message: "Failed to add drill" });
    }
  });

  // Add new Mental Edge content
  app.post("/api/brain/train/mental-edge", async (req, res) => {
    try {
      const input = api.mentalEdge.create.input.parse(req.body);
      const content = await storage.createMentalEdge(input);
      res.status(201).json({ message: "Mental Edge content added", content });
    } catch (err) {
      if (err instanceof z.ZodError) {
        return res.status(400).json({ message: err.errors[0].message });
      }
      console.error("Train mental edge error:", err);
      res.status(500).json({ message: "Failed to add mental edge content" });
    }
  });

  // Get all Mental Edge content
  app.get("/api/mental-edge", async (req, res) => {
    try {
      const content = await storage.getMentalEdge();
      res.json(content);
    } catch (err) {
      console.error("Get mental edge error:", err);
      res.status(500).json({ message: "Failed to fetch mental edge content" });
    }
  });

  // Bulk import drills from JSON (Knowledge Base Importer)
  app.post("/api/admin/import-drills", async (req, res) => {
    try {
      if (!req.user) return res.status(401).json({ message: "Unauthorized" });
      
      const userId = (req.user as any).claims.sub;
      const user = await storage.getUser(userId);
      
      if (!user || (user.role !== "team_coach" && user.role !== "pitching_coach")) {
        return res.status(403).json({ message: "Only coaches can import drills" });
      }
      
      const importSchema = z.object({
        category: z.enum(["Pitching", "Hitting", "Catching", "Throwing", "Biomechanics", "Crossfit"]),
        drills: z.array(z.object({
          name: z.string().min(1, "Drill name is required"),
          description: z.string().min(1, "Description is required"),
          skillType: z.string().optional(),
          difficulty: z.string().optional(),
          videoUrl: z.string().optional(),
          equipment: z.array(z.string()).optional(),
          ageRange: z.string().optional(),
          expertSource: z.string().optional(),
          mechanicTags: z.array(z.string()).optional(),
          issueAddressed: z.string().optional(),
        }))
      });

      const { category, drills } = importSchema.parse(req.body);
      
      let imported = 0;
      let errors: string[] = [];
      
      for (const drill of drills) {
        try {
          await storage.createDrill({
            name: drill.name,
            category,
            description: drill.description,
            skillType: drill.skillType || category.toLowerCase(),
            difficulty: drill.difficulty,
            videoUrl: drill.videoUrl,
            equipment: drill.equipment,
            ageRange: drill.ageRange,
            expertSource: drill.expertSource,
            mechanicTags: drill.mechanicTags,
            issueAddressed: drill.issueAddressed,
          });
          imported++;
        } catch (err) {
          errors.push(`Failed to import "${drill.name}": ${err instanceof Error ? err.message : 'Unknown error'}`);
        }
      }
      
      res.status(201).json({ 
        message: `Imported ${imported} of ${drills.length} drills`,
        imported,
        total: drills.length,
        errors: errors.length > 0 ? errors : undefined
      });
    } catch (err) {
      if (err instanceof z.ZodError) {
        return res.status(400).json({ 
          message: "Invalid JSON format", 
          errors: err.errors.map(e => `${e.path.join('.')}: ${e.message}`)
        });
      }
      console.error("Import drills error:", err);
      res.status(500).json({ message: "Failed to import drills" });
    }
  });

  // Delete a drill
  app.delete("/api/drills/:id", async (req, res) => {
    try {
      await storage.deleteDrill(Number(req.params.id));
      res.json({ message: "Drill deleted" });
    } catch (err) {
      console.error("Delete drill error:", err);
      res.status(500).json({ message: "Failed to delete drill" });
    }
  });

  // Delete Mental Edge content
  app.delete("/api/mental-edge/:id", async (req, res) => {
    try {
      await storage.deleteMentalEdge(Number(req.params.id));
      res.json({ message: "Mental edge content deleted" });
    } catch (err) {
      console.error("Delete mental edge error:", err);
      res.status(500).json({ message: "Failed to delete mental edge content" });
    }
  });

  // === HYBRID COACHING SYSTEM ROUTES ===

  // Get player's athlete profile
  app.get("/api/player/athlete", async (req, res) => {
    try {
      if (!req.user) return res.status(401).json({ message: "Unauthorized" });
      const userId = (req.user as any).claims.sub;
      const athlete = await storage.getAthleteByUserId(userId);
      if (!athlete) {
        return res.status(404).json({ message: "No athlete profile found for your account" });
      }
      res.json(athlete);
    } catch (err) {
      throw err;
    }
  });

  // Get player's coaching team
  app.get("/api/player/coaches", async (req, res) => {
    try {
      if (!req.user) return res.status(401).json({ message: "Unauthorized" });
      const userId = (req.user as any).claims.sub;
      const coaches = await storage.getPlayerCoaches(userId);
      res.json(coaches);
    } catch (err) {
      throw err;
    }
  });

  // Get player settings (subscription mode)
  app.get("/api/player/settings", async (req, res) => {
    try {
      if (!req.user) return res.status(401).json({ message: "Unauthorized" });
      const userId = (req.user as any).claims.sub;
      let settings = await storage.getPlayerSettings(userId);
      
      // Create default settings if none exist
      if (!settings) {
        settings = await storage.createPlayerSettings({ userId, subscriptionMode: "solo" });
      }
      
      res.json(settings);
    } catch (err) {
      throw err;
    }
  });

  // Update player settings
  app.patch("/api/player/settings", async (req, res) => {
    try {
      if (!req.user) return res.status(401).json({ message: "Unauthorized" });
      const userId = (req.user as any).claims.sub;
      
      const settingsSchema = z.object({
        subscriptionMode: z.enum(["solo", "coached"]).optional(),
        notificationsEnabled: z.boolean().optional(),
        autoAssignDrills: z.boolean().optional(),
      });
      
      const data = settingsSchema.parse(req.body);
      
      // Ensure settings exist first
      let settings = await storage.getPlayerSettings(userId);
      if (!settings) {
        settings = await storage.createPlayerSettings({ userId, subscriptionMode: "solo" });
      }
      
      const updated = await storage.updatePlayerSettings(userId, data);
      res.json(updated);
    } catch (err) {
      if (err instanceof z.ZodError) {
        return res.status(400).json({ message: err.errors[0].message });
      }
      throw err;
    }
  });

  // Send coach invite
  app.post("/api/player/invite-coach", async (req, res) => {
    try {
      if (!req.user) return res.status(401).json({ message: "Unauthorized" });
      const userId = (req.user as any).claims.sub;
      
      const inviteSchema = z.object({
        coachEmail: z.string().email().optional(),
        coachUsername: z.string().optional(),
        skillType: z.enum(["PITCHING", "HITTING", "CATCHING", "FIELDING"]),
        message: z.string().optional(),
      });
      
      const data = inviteSchema.parse(req.body);
      
      if (!data.coachEmail && !data.coachUsername) {
        return res.status(400).json({ message: "Either coach email or username is required" });
      }
      
      // Generate unique invite token
      const inviteToken = crypto.randomUUID();
      const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000); // 7 days
      
      const invite = await storage.createCoachInvite({
        fromPlayerId: userId,
        toCoachEmail: data.coachEmail || null,
        toCoachUsername: data.coachUsername || null,
        skillType: data.skillType,
        status: "pending",
        inviteToken,
        expiresAt,
        message: data.message || null,
      });
      
      res.status(201).json(invite);
    } catch (err) {
      if (err instanceof z.ZodError) {
        return res.status(400).json({ message: err.errors[0].message });
      }
      throw err;
    }
  });

  // Get player's sent invites
  app.get("/api/player/invites", async (req, res) => {
    try {
      if (!req.user) return res.status(401).json({ message: "Unauthorized" });
      const userId = (req.user as any).claims.sub;
      const invites = await storage.getPlayerInvites(userId);
      res.json(invites);
    } catch (err) {
      throw err;
    }
  });

  // Get coach's received invites
  app.get("/api/coach/invites", async (req, res) => {
    try {
      if (!req.user) return res.status(401).json({ message: "Unauthorized" });
      const userId = (req.user as any).claims.sub;
      const coach = await storage.getCoachByUserId(userId);
      if (!coach) return res.json([]);
      
      const invites = await storage.getCoachInvites(coach.id);
      res.json(invites);
    } catch (err) {
      throw err;
    }
  });

  // Accept or decline invite
  app.patch("/api/coach/invites/:id", async (req, res) => {
    try {
      if (!req.user) return res.status(401).json({ message: "Unauthorized" });
      const userId = (req.user as any).claims.sub;
      const coach = await storage.getCoachByUserId(userId);
      if (!coach) return res.status(404).json({ message: "Coach profile not found" });
      
      const actionSchema = z.object({
        status: z.enum(["accepted", "declined"]),
      });
      
      const { status } = actionSchema.parse(req.body);
      const inviteId = Number(req.params.id);
      
      // Update invite status
      const invite = await storage.updateCoachInvite(inviteId, { 
        status, 
        toCoachId: coach.id 
      });
      
      // If accepted, create the player-coach relationship
      if (status === "accepted") {
        await storage.createPlayerCoachRelationship({
          playerId: invite.fromPlayerId,
          coachId: coach.id,
          skillType: invite.skillType,
          status: "active",
          subscriptionMode: "coached",
        });
      }
      
      res.json(invite);
    } catch (err) {
      if (err instanceof z.ZodError) {
        return res.status(400).json({ message: err.errors[0].message });
      }
      throw err;
    }
  });

  // Get coach's players (students)
  app.get("/api/coach/players", async (req, res) => {
    try {
      if (!req.user) return res.status(401).json({ message: "Unauthorized" });
      const userId = (req.user as any).claims.sub;
      const coach = await storage.getCoachByUserId(userId);
      if (!coach) return res.json([]);
      
      const players = await storage.getCoachPlayers(coach.id);
      res.json(players);
    } catch (err) {
      throw err;
    }
  });

  // Remove coach from player's team
  app.delete("/api/player/coaches/:id", async (req, res) => {
    try {
      if (!req.user) return res.status(401).json({ message: "Unauthorized" });
      await storage.deletePlayerCoachRelationship(Number(req.params.id));
      res.json({ message: "Coach removed from your team" });
    } catch (err) {
      throw err;
    }
  });

  // === COACH REVIEW QUEUE (Pending Assessments) ===

  // Get assessments pending coach review
  app.get("/api/coach/review-queue", async (req, res) => {
    try {
      if (!req.user) return res.status(401).json({ message: "Unauthorized" });
      const userId = (req.user as any).claims.sub;
      const coach = await storage.getCoachByUserId(userId);
      
      // Get all pending_coach_review assessments for this coach's players
      const pendingAssessments = await storage.getAssessmentsByStatus("pending_coach_review", coach?.id);
      res.json(pendingAssessments);
    } catch (err) {
      throw err;
    }
  });

  // Approve assessment (release drills to player)
  app.post("/api/coach/assessments/:id/approve", async (req, res) => {
    try {
      if (!req.user) return res.status(401).json({ message: "Unauthorized" });
      const assessmentId = Number(req.params.id);
      
      await storage.updateAssessment(assessmentId, { status: "coach_approved" });
      res.json({ message: "Assessment approved, drills released to player" });
    } catch (err) {
      throw err;
    }
  });

  // Edit and approve assessment
  app.post("/api/coach/assessments/:id/edit-approve", async (req, res) => {
    try {
      if (!req.user) return res.status(401).json({ message: "Unauthorized" });
      const assessmentId = Number(req.params.id);
      
      const editSchema = z.object({
        notes: z.string().optional(),
        additionalFeedback: z.string().optional(),
      });
      
      const data = editSchema.parse(req.body);
      
      await storage.updateAssessment(assessmentId, { 
        status: "coach_edited",
        notes: data.notes
      });
      
      // Add coach's additional feedback if provided
      if (data.additionalFeedback) {
        await storage.createFeedback({
          assessmentId,
          feedbackText: data.additionalFeedback,
          priority: "High",
          issueDetected: "Coach Review"
        });
      }
      
      res.json({ message: "Assessment edited and approved" });
    } catch (err) {
      if (err instanceof z.ZodError) {
        return res.status(400).json({ message: err.errors[0].message });
      }
      throw err;
    }
  });

  // === HEAD COACH MODE - Team Referrals ===

  // Generate or get team referral code (for head coaches)
  app.get("/api/team/:teamId/referral-code", async (req, res) => {
    try {
      if (!req.user) return res.status(401).json({ message: "Unauthorized" });
      const userId = (req.user as any).claims.sub;
      const teamId = Number(req.params.teamId);
      
      // Get team and verify ownership
      let team = await storage.getTeam(teamId);
      if (!team) {
        return res.status(404).json({ message: "Team not found" });
      }
      
      // Verify user is the head coach
      const coach = await storage.getCoachByUserId(userId);
      if (!coach || team.headCoachId !== coach.id) {
        return res.status(403).json({ message: "Only the head coach can manage team referrals" });
      }
      
      // Generate referral code if none exists
      if (!team.referralCode) {
        const code = `TEAM_${crypto.randomUUID().slice(0, 8).toUpperCase()}`;
        team = await storage.updateTeam(team.id, { referralCode: code });
      }
      
      res.json({ 
        referralCode: team.referralCode,
        referralUrl: `/register?ref=${team.referralCode}`,
        teamId: team.id,
        teamName: team.name
      });
    } catch (err) {
      throw err;
    }
  });

  // Get teams for current head coach
  app.get("/api/coach/teams", async (req, res) => {
    try {
      if (!req.user) return res.status(401).json({ message: "Unauthorized" });
      const userId = (req.user as any).claims.sub;
      
      const coach = await storage.getCoachByUserId(userId);
      if (!coach) {
        return res.json({ teams: [] });
      }
      
      const teams = await storage.getTeamsByHeadCoach(coach.id);
      res.json({ 
        teams: teams.map(t => ({
          id: t.id,
          name: t.name,
          ageDivision: t.ageDivision,
          season: t.season,
          referralCode: t.referralCode,
          referralUrl: t.referralCode ? `/register?ref=${t.referralCode}` : null
        }))
      });
    } catch (err) {
      throw err;
    }
  });

  // === SPECIALIST COACH MODE ===

  // Generate or get coach's referral code
  app.get("/api/specialist/referral-code", async (req, res) => {
    try {
      if (!req.user) return res.status(401).json({ message: "Unauthorized" });
      const userId = (req.user as any).claims.sub;
      let coach = await storage.getCoachByUserId(userId);
      
      if (!coach) {
        return res.status(404).json({ message: "Coach profile not found" });
      }
      
      // Generate referral code if none exists
      if (!coach.referralCode) {
        const code = `COACH_${crypto.randomUUID().slice(0, 8).toUpperCase()}`;
        coach = await storage.updateCoach(coach.id, { referralCode: code });
      }
      
      res.json({ 
        referralCode: coach.referralCode,
        referralUrl: `/register?ref=${coach.referralCode}`
      });
    } catch (err) {
      throw err;
    }
  });

  // Get coach's roster (My Students)
  app.get("/api/specialist/roster", async (req, res) => {
    try {
      if (!req.user) return res.status(401).json({ message: "Unauthorized" });
      const userId = (req.user as any).claims.sub;
      const coach = await storage.getCoachByUserId(userId);
      
      if (!coach) return res.json({ students: [], count: 0, maxStudents: 25 });
      
      // Get all active student relationships
      const relationships = await storage.getCoachPlayers(coach.id);
      
      // Enrich with onboarding status and last activity
      const students = await Promise.all(
        relationships.map(async (rel) => {
          const onboarding = rel.player ? await storage.getPlayerOnboarding(rel.playerId) : null;
          const baselineVideos = rel.player ? await storage.getBaselineVideos(rel.playerId) : [];
          
          const needsReview = !onboarding?.dashboardUnlocked && baselineVideos.length >= 4;
          return {
            id: rel.id,
            playerId: rel.playerId,
            name: rel.player?.firstName && rel.player?.lastName 
              ? `${rel.player.firstName} ${rel.player.lastName}` 
              : rel.player?.email || "Unknown",
            email: rel.player?.email,
            skillType: rel.skillType,
            status: rel.status,
            startDate: rel.startDate,
            baselineComplete: onboarding?.baselineComplete ?? false,
            baselineVideoCount: baselineVideos.length,
            dashboardUnlocked: onboarding?.dashboardUnlocked ?? false,
            needsReview,
            // Include baseline videos for students needing review
            baselineVideos: needsReview ? baselineVideos.map(v => ({
              id: v.id,
              videoNumber: v.videoNumber,
              videoUrl: v.videoUrl,
              status: v.status,
            })) : undefined,
          };
        })
      );
      
      res.json({ 
        students: students.filter(s => s.status === "active"),
        count: students.filter(s => s.status === "active").length,
        maxStudents: coach.maxStudents || 25
      });
    } catch (err) {
      throw err;
    }
  });

  // Smart Invite - Send invite to student/parent
  app.post("/api/specialist/invite", async (req, res) => {
    try {
      if (!req.user) return res.status(401).json({ message: "Unauthorized" });
      const userId = (req.user as any).claims.sub;
      const coach = await storage.getCoachByUserId(userId);
      
      if (!coach) return res.status(404).json({ message: "Coach profile not found" });
      
      // Check student cap
      const activeCount = await storage.getCoachActiveStudentCount(coach.id);
      const maxStudents = coach.maxStudents || 25;
      
      if (activeCount >= maxStudents) {
        return res.status(400).json({ 
          message: `You have reached your maximum of ${maxStudents} active students. Archive inactive students to add more.` 
        });
      }
      
      const inviteSchema = z.object({
        parentEmail: z.string().email().optional(),
        studentEmail: z.string().email().optional(),
        phone: z.string().optional(),
        studentName: z.string().optional(),
      });
      
      const data = inviteSchema.parse(req.body);
      
      if (!data.parentEmail && !data.studentEmail && !data.phone) {
        return res.status(400).json({ message: "At least one contact method is required (parent email, student email, or phone)" });
      }
      
      // Generate unique invite token
      const inviteToken = crypto.randomUUID();
      const expiresAt = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000); // 30 days
      
      const invite = await storage.createStudentInvite({
        coachId: coach.id,
        parentEmail: data.parentEmail || null,
        studentEmail: data.studentEmail || null,
        phone: data.phone || null,
        studentName: data.studentName || null,
        skillType: coach.specialty || "PITCHING",
        inviteToken,
        status: "pending",
        expiresAt,
      });
      
      res.status(201).json({
        invite,
        inviteUrl: `/register?invite=${inviteToken}`,
        message: "Invite created successfully"
      });
    } catch (err) {
      if (err instanceof z.ZodError) {
        return res.status(400).json({ message: err.errors[0].message });
      }
      throw err;
    }
  });

  // Get coach's sent invites
  app.get("/api/specialist/invites", async (req, res) => {
    try {
      if (!req.user) return res.status(401).json({ message: "Unauthorized" });
      const userId = (req.user as any).claims.sub;
      const coach = await storage.getCoachByUserId(userId);
      
      if (!coach) return res.json([]);
      
      const invites = await storage.getStudentInvitesByCoach(coach.id);
      res.json(invites);
    } catch (err) {
      throw err;
    }
  });

  // Archive student (remove from active roster)
  app.post("/api/specialist/roster/:id/archive", async (req, res) => {
    try {
      if (!req.user) return res.status(401).json({ message: "Unauthorized" });
      const relationshipId = Number(req.params.id);
      
      await storage.updatePlayerCoachRelationship(relationshipId, { status: "inactive" });
      res.json({ message: "Student archived successfully" });
    } catch (err) {
      throw err;
    }
  });

  // === REFERRAL REGISTRATION (Public Route) ===

  // Validate invite token and get coach info
  app.get("/api/register/validate", async (req, res) => {
    try {
      const { invite, ref } = req.query;
      
      // Check for direct invite token
      if (invite) {
        const studentInvite = await storage.getStudentInviteByToken(invite as string);
        if (!studentInvite) {
          return res.status(404).json({ message: "Invalid or expired invite" });
        }
        if (studentInvite.status !== "pending") {
          return res.status(400).json({ message: "This invite has already been used" });
        }
        if (studentInvite.expiresAt && new Date(studentInvite.expiresAt) < new Date()) {
          return res.status(400).json({ message: "This invite has expired" });
        }
        
        const coach = await storage.getCoach(studentInvite.coachId);
        return res.json({
          type: "invite",
          coachId: studentInvite.coachId,
          coachName: coach?.name,
          skillType: studentInvite.skillType,
          studentName: studentInvite.studentName,
          inviteToken: invite,
        });
      }
      
      // Check for referral code (can be TEAM_ or COACH_ prefixed)
      if (ref) {
        const refCode = ref as string;
        
        // Check if it's a team referral (TEAM_ prefix)
        if (refCode.startsWith("TEAM_")) {
          const team = await storage.getTeamByReferralCode(refCode);
          if (!team) {
            return res.status(404).json({ message: "Invalid team referral code" });
          }
          
          // Get head coach info
          const coach = team.headCoachId ? await storage.getCoach(team.headCoachId) : null;
          
          return res.json({
            type: "team_referral",
            teamId: team.id,
            teamName: team.name,
            coachId: team.headCoachId,
            coachName: coach?.name || "Head Coach",
            referralCode: refCode,
          });
        }
        
        // Otherwise, it's a coach/specialist referral (COACH_ prefix)
        const coach = await storage.getCoachByReferralCode(refCode);
        if (!coach) {
          return res.status(404).json({ message: "Invalid referral code" });
        }
        
        return res.json({
          type: "referral",
          coachId: coach.id,
          coachName: coach.name,
          skillType: coach.specialty,
          referralCode: refCode,
        });
      }
      
      return res.status(400).json({ message: "Invite token or referral code required" });
    } catch (err) {
      throw err;
    }
  });

  // Complete registration with referral/invite (called after OAuth)
  app.post("/api/register/complete", async (req, res) => {
    try {
      if (!req.user) return res.status(401).json({ message: "Must be logged in to complete registration" });
      
      const userId = (req.user as any).claims.sub;
      const userClaims = (req.user as any).claims;
      
      const completeSchema = z.object({
        inviteToken: z.string().optional(),
        referralCode: z.string().optional(),
        firstName: z.string().optional(),
        lastName: z.string().optional(),
        primaryPosition: z.string().optional(),
      });
      
      const data = completeSchema.parse(req.body);
      
      let coachId: number | null = null;
      let teamId: number | null = null;
      let skillType: string = "PITCHING";
      let isTeamReferral = false;
      
      // Handle direct invite (Private Instructor Mode)
      if (data.inviteToken) {
        const invite = await storage.getStudentInviteByToken(data.inviteToken);
        if (invite && invite.status === "pending") {
          coachId = invite.coachId;
          skillType = invite.skillType;
          
          // Mark invite as used
          await storage.updateStudentInvite(invite.id, { 
            status: "registered",
            registeredUserId: userId
          });
        }
      }
      
      // Handle referral code (can be TEAM_ or COACH_ prefixed)
      if (!coachId && data.referralCode) {
        const refCode = data.referralCode;
        
        // Check if it's a team referral (Head Coach Mode)
        if (refCode.startsWith("TEAM_")) {
          const team = await storage.getTeamByReferralCode(refCode);
          if (team && team.headCoachId) {
            coachId = team.headCoachId;
            teamId = team.id;
            isTeamReferral = true;
          }
        } else {
          // Otherwise, it's a coach/specialist referral (Private Instructor Mode)
          const coach = await storage.getCoachByReferralCode(refCode);
          if (coach) {
            coachId = coach.id;
            skillType = coach.specialty || "PITCHING";
          }
        }
      }
      
      if (!coachId) {
        return res.status(400).json({ message: "Invalid invite or referral" });
      }
      
      // For team referrals (Head Coach Mode), create an athlete record with teamId
      if (isTeamReferral && teamId) {
        const firstName = data.firstName || userClaims.given_name || "Player";
        const lastName = data.lastName || userClaims.family_name || "Name";
        const primaryPosition = data.primaryPosition || null;
        
        // Check if athlete already exists for this user
        const existingAthlete = await storage.getAthleteByUserId(userId);
        if (existingAthlete) {
          // Update existing athlete with team assignment and position
          await storage.updateAthlete(existingAthlete.id, { 
            teamId, 
            firstName, 
            lastName,
            primaryPosition 
          });
        } else {
          // Create new athlete linked to the team
          await storage.createAthlete({
            userId,
            firstName,
            lastName,
            teamId,
            primaryPosition,
          });
        }
        
        // Create onboarding record for team players (requires 4 baseline videos)
        const existingOnboarding = await storage.getPlayerOnboarding(userId);
        if (!existingOnboarding) {
          await storage.createPlayerOnboarding({
            userId,
            coachId,
            teamId,
            onboardingType: "team_coach",
            skillType: primaryPosition === "P" ? "PITCHING" : "HITTING",
            baselineComplete: false,
            dashboardUnlocked: false,
          });
        }
        
        // Set player settings
        let settings = await storage.getPlayerSettings(userId);
        if (!settings) {
          await storage.createPlayerSettings({ userId, subscriptionMode: "coached" });
        } else {
          await storage.updatePlayerSettings(userId, { subscriptionMode: "coached" });
        }
        
        // CRITICAL: Set user role to "player" so they skip role selection
        await storage.updateUserRole(userId, "player");
        
        return res.json({ 
          message: "Welcome to the team! Please complete your baseline videos.",
          requiresBaseline: true,
          coachId,
          teamId,
          role: "player"
        });
      }
      
      // For Private Instructor Mode, create player-coach relationship
      await storage.createPlayerCoachRelationship({
        playerId: userId,
        coachId,
        skillType,
        status: "active",
        subscriptionMode: "coached",
      });
      
      // Determine onboarding type based on coach specialty
      const coach = await storage.getCoach(coachId);
      let onboardingType = "pitching_instructor";
      if (skillType === "CATCHING" || coach?.specialty === "CATCHING") {
        onboardingType = "catching_instructor";
      }
      
      // Create onboarding record (dashboard locked until baseline complete)
      await storage.createPlayerOnboarding({
        userId,
        coachId,
        onboardingType,
        skillType,
        baselineComplete: false,
        dashboardUnlocked: false,
      });
      
      // Set player settings to coached mode
      let settings = await storage.getPlayerSettings(userId);
      if (!settings) {
        await storage.createPlayerSettings({ userId, subscriptionMode: "coached" });
      } else {
        await storage.updatePlayerSettings(userId, { subscriptionMode: "coached" });
      }
      
      res.json({ 
        message: "Registration complete! Please upload your baseline videos.",
        requiresBaseline: true,
        coachId,
        skillType
      });
    } catch (err) {
      if (err instanceof z.ZodError) {
        return res.status(400).json({ message: err.errors[0].message });
      }
      throw err;
    }
  });

  // === BASELINE PROTOCOL ===

  // Video prompts for different onboarding modes
  const VIDEO_PROMPTS = {
    team_coach: [
      { number: 1, category: "hitting", title: "Hitting", description: "Record your swing from the side - show full stance through follow-through", focusAreas: ["bat path", "hip rotation", "contact point"] },
      { number: 2, category: "throwing", title: "Throwing", description: "Record your throwing motion from the side - show arm action and release", focusAreas: ["arm slot", "stride length", "follow-through"] },
      { number: 3, category: "fielding", title: "Fielding", description: "Record yourself fielding ground balls - show ready position and transfers", focusAreas: ["glove position", "footwork", "transfer speed"] },
      { number: 4, category: "pitching_or_catching", title: "Pitching or Catching", description: "Record your pitch (if pitcher) OR a blocking/framing drill (if catcher)", focusAreas: ["arm circle", "leg drive", "release point"] },
    ],
    pitching_instructor: [
      { number: 1, category: "fastball", title: "Fastball", description: "Record 3-5 fastballs from the side view - full windmill motion", focusAreas: ["arm circle", "knee drive", "hip-shoulder separation", "release point"] },
      { number: 2, category: "drop_ball", title: "Drop Ball", description: "Record 3-5 drop balls from the side view - focus on spin and release", focusAreas: ["wrist snap", "release angle", "leg drive"] },
      { number: 3, category: "change_up", title: "Change-up", description: "Record 3-5 change-ups - show deceptive motion and grip release", focusAreas: ["arm speed", "deception", "grip release"] },
      { number: 4, category: "pitchers_choice", title: "Pitcher's Choice", description: "Record your specialty pitch (rise ball, curve, screw, etc.)", focusAreas: ["spin direction", "movement", "command"] },
    ],
    catching_instructor: [
      { number: 1, category: "framing", title: "Framing", description: "Record yourself receiving 5+ pitches - show glove presentation and stick", focusAreas: ["glove angle", "subtle movement", "stick presentation"] },
      { number: 2, category: "blocking", title: "Blocking", description: "Record yourself blocking balls in the dirt - show stance and body position", focusAreas: ["drop mechanics", "glove position", "body angle"] },
      { number: 3, category: "transfer", title: "Transfer (Pop-time)", description: "Record catch-to-throw transfer - show footwork and arm action", focusAreas: ["transfer speed", "footwork", "arm slot", "pop-time"] },
      { number: 4, category: "bunt_coverage", title: "Bunt Coverage", description: "Record fielding bunts - show explosiveness and throw accuracy", focusAreas: ["first step", "barehand technique", "throw accuracy"] },
    ],
  };

  // Get onboarding status (including baseline progress)
  app.get("/api/player/onboarding", async (req, res) => {
    try {
      if (!req.user) return res.status(401).json({ message: "Unauthorized" });
      const userId = (req.user as any).claims.sub;
      
      const onboarding = await storage.getPlayerOnboarding(userId);
      if (!onboarding) {
        // No onboarding = solo player, dashboard unlocked by default
        return res.json({ dashboardUnlocked: true, baselineComplete: true });
      }
      
      const baselineVideos = await storage.getBaselineVideos(userId);
      
      // Get video prompts based on onboarding type
      const onboardingType = (onboarding.onboardingType as keyof typeof VIDEO_PROMPTS) || "team_coach";
      const videoPrompts = VIDEO_PROMPTS[onboardingType] || VIDEO_PROMPTS.team_coach;
      
      res.json({
        ...onboarding,
        baselineVideoCount: baselineVideos.length,
        baselineVideosRequired: 4,
        baselineVideos,
        videoPrompts,
      });
    } catch (err) {
      throw err;
    }
  });

  // Upload baseline video
  app.post("/api/player/baseline-video", async (req, res) => {
    try {
      if (!req.user) return res.status(401).json({ message: "Unauthorized" });
      const userId = (req.user as any).claims.sub;
      
      const videoSchema = z.object({
        videoUrl: z.string().url(),
        videoNumber: z.number().min(1).max(4),
        videoCategory: z.string(), // e.g., "fastball", "hitting", "framing"
        durationSeconds: z.number().optional(),
      });
      
      const data = videoSchema.parse(req.body);
      
      // Validate duration is at least 20 seconds
      if (data.durationSeconds && data.durationSeconds < 20) {
        return res.status(400).json({ message: "Video must be at least 20 seconds long" });
      }
      
      // Get onboarding to find coach
      const onboarding = await storage.getPlayerOnboarding(userId);
      if (!onboarding) {
        return res.status(400).json({ message: "No onboarding record found" });
      }
      
      // Determine skill type based on category and onboarding type
      let skillType = onboarding.skillType || "GENERAL";
      if (["fastball", "drop_ball", "change_up", "pitchers_choice"].includes(data.videoCategory)) {
        skillType = "PITCHING";
      } else if (["framing", "blocking", "transfer", "bunt_coverage"].includes(data.videoCategory)) {
        skillType = "CATCHING";
      } else if (data.videoCategory === "hitting") {
        skillType = "HITTING";
      } else if (data.videoCategory === "throwing") {
        skillType = "THROWING";
      } else if (data.videoCategory === "fielding") {
        skillType = "FIELDING";
      }
      
      // Get athlete record to link assessment
      const athlete = await storage.getAthleteByUserId(userId);
      
      // Create an assessment for this baseline video (for PoseAnalyzer analysis)
      let assessmentId: number | undefined;
      if (athlete) {
        const assessment = await storage.createAssessment({
          athleteId: athlete.id,
          coachId: onboarding.coachId || undefined,
          skillType,
          videoUrl: data.videoUrl,
          notes: `Baseline ${data.videoCategory} video - ${new Date().toLocaleDateString()}`,
        });
        assessmentId = assessment.id;
      }
      
      // Create baseline video record
      const video = await storage.createBaselineVideo({
        userId,
        coachId: onboarding.coachId,
        skillType,
        videoCategory: data.videoCategory,
        videoNumber: data.videoNumber,
        videoUrl: data.videoUrl,
        durationSeconds: data.durationSeconds,
        status: "analyzing",
        assessmentId,
      });
      
      // Check if all 4 videos are uploaded
      const allVideos = await storage.getBaselineVideos(userId);
      if (allVideos.length >= 4) {
        // Mark baseline as complete but keep dashboard locked until coach approves
        await storage.updatePlayerOnboarding(userId, { baselineComplete: true });
        
        // NOTIFICATION TRIGGER: Notify instructor that baseline is ready for review
        if (onboarding.coachId) {
          const coach = await storage.getCoach(onboarding.coachId);
          if (coach?.userId) {
            await storage.createNotification({
              userId: coach.userId,
              type: "baseline_ready",
              title: "Baseline Ready for Review",
              message: `A new student has completed their 4-video baseline. Click to review and create their training roadmap.`,
              linkUrl: "/roster",
              relatedId: userId,
            });
          }
        }
      } else {
        // NOTIFICATION TRIGGER: Notify instructor of each video upload
        if (onboarding.coachId) {
          const coach = await storage.getCoach(onboarding.coachId);
          if (coach?.userId) {
            await storage.createNotification({
              userId: coach.userId,
              type: "video_uploaded",
              title: "New Video Uploaded",
              message: `Student uploaded baseline video ${data.videoNumber}/4. ${4 - allVideos.length} more to go.`,
              linkUrl: "/roster",
              relatedId: userId,
            });
          }
        }
      }
      
      res.status(201).json({
        video,
        totalUploaded: allVideos.length,
        remaining: Math.max(0, 4 - allVideos.length),
        baselineComplete: allVideos.length >= 4,
      });
    } catch (err) {
      if (err instanceof z.ZodError) {
        return res.status(400).json({ message: err.errors[0].message });
      }
      throw err;
    }
  });

  // Coach: Get students needing baseline review
  app.get("/api/specialist/baseline-queue", async (req, res) => {
    try {
      if (!req.user) return res.status(401).json({ message: "Unauthorized" });
      const userId = (req.user as any).claims.sub;
      const coach = await storage.getCoachByUserId(userId);
      
      if (!coach) return res.json([]);
      
      // Get all students with complete baseline but unlocked dashboard
      const relationships = await storage.getCoachPlayers(coach.id);
      
      const needsReview = await Promise.all(
        relationships.map(async (rel) => {
          const onboarding = await storage.getPlayerOnboarding(rel.playerId);
          const videos = await storage.getBaselineVideos(rel.playerId);
          
          if (onboarding?.baselineComplete && !onboarding?.dashboardUnlocked) {
            return {
              playerId: rel.playerId,
              playerName: rel.player?.firstName && rel.player?.lastName 
                ? `${rel.player.firstName} ${rel.player.lastName}` 
                : rel.player?.email,
              skillType: rel.skillType,
              videos,
              submittedAt: videos[videos.length - 1]?.createdAt,
            };
          }
          return null;
        })
      );
      
      res.json(needsReview.filter(Boolean));
    } catch (err) {
      throw err;
    }
  });

  // Coach: Approve baseline and unlock dashboard
  app.post("/api/specialist/baseline/:playerId/approve", async (req, res) => {
    try {
      if (!req.user) return res.status(401).json({ message: "Unauthorized" });
      const userId = (req.user as any).claims.sub;
      const playerId = req.params.playerId;
      
      // Verify coach exists
      const coach = await storage.getCoachByUserId(userId);
      if (!coach) {
        return res.status(403).json({ message: "Only instructors can approve baselines" });
      }
      
      // Verify this coach is linked to this player
      const relationships = await storage.getCoachPlayers(coach.id);
      const isMyStudent = relationships.some(rel => rel.playerId === playerId && rel.status === "active");
      if (!isMyStudent) {
        return res.status(403).json({ message: "You can only approve baselines for your own students" });
      }
      
      // Unlock dashboard
      await storage.updatePlayerOnboarding(playerId, { 
        dashboardUnlocked: true,
        baselineApprovedAt: new Date(),
        // Set next video prompt for 2 weeks later
        nextVideoPromptDate: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      });
      
      // NOTIFICATION TRIGGER: Notify player that roadmap is ready
      await storage.createNotification({
        userId: playerId,
        type: "roadmap_ready",
        title: "Your Training Roadmap is Ready!",
        message: `Your coach has reviewed your baseline videos and created a personalized training plan. Your dashboard is now unlocked!`,
        linkUrl: "/dashboard",
        relatedId: coach.id.toString(),
      });
      
      res.json({ message: "Baseline approved, dashboard unlocked for student" });
    } catch (err) {
      throw err;
    }
  });

  // === UNIVERSAL NOTIFICATION ENGINE ===

  // Get all notifications for current user
  app.get("/api/notifications", async (req, res) => {
    try {
      if (!req.user) return res.status(401).json({ message: "Unauthorized" });
      const userId = (req.user as any).claims.sub;
      
      const notifications = await storage.getNotifications(userId);
      const unreadCount = await storage.getUnreadNotificationCount(userId);
      
      res.json({ notifications, unreadCount });
    } catch (err) {
      throw err;
    }
  });

  // Get unread notification count
  app.get("/api/notifications/unread-count", async (req, res) => {
    try {
      if (!req.user) return res.status(401).json({ message: "Unauthorized" });
      const userId = (req.user as any).claims.sub;
      
      const count = await storage.getUnreadNotificationCount(userId);
      res.json({ count });
    } catch (err) {
      throw err;
    }
  });

  // Mark notification as read (with ownership verification)
  app.patch("/api/notifications/:id/read", async (req, res) => {
    try {
      if (!req.user) return res.status(401).json({ message: "Unauthorized" });
      const userId = (req.user as any).claims.sub;
      
      const notificationId = parseInt(req.params.id);
      
      // Verify ownership by checking if notification belongs to this user
      const userNotifications = await storage.getNotifications(userId);
      const ownsNotification = userNotifications.some(n => n.id === notificationId);
      
      if (!ownsNotification) {
        return res.status(403).json({ message: "You can only mark your own notifications as read" });
      }
      
      const notification = await storage.markNotificationRead(notificationId);
      res.json(notification);
    } catch (err) {
      throw err;
    }
  });

  // Mark all notifications as read
  app.patch("/api/notifications/read-all", async (req, res) => {
    try {
      if (!req.user) return res.status(401).json({ message: "Unauthorized" });
      const userId = (req.user as any).claims.sub;
      
      await storage.markAllNotificationsRead(userId);
      res.json({ message: "All notifications marked as read" });
    } catch (err) {
      throw err;
    }
  });

  // === GAMECHANGER STATS IMPORT ===
  
  // Import stats from CSV
  app.post("/api/stats/import", isAuthenticated, async (req, res) => {
    try {
      const userId = (req.user as any).claims.sub;
      
      const statsSchema = z.object({
        name: z.string().optional(),
        pos: z.string().optional(),
        avg: z.string().optional(),
        ops: z.string().optional(),
        era: z.string().optional(),
        whip: z.string().optional(),
        kPercent: z.string().optional(),
        firstPitchStrikePercent: z.string().optional(),
        exitVelocity: z.string().optional(),
      });
      
      const stats = statsSchema.parse(req.body);
      
      // Get athlete record for this user
      const athlete = await storage.getAthleteByUserId(userId);
      
      // Save to database
      const savedStats = await storage.createGameChangerStats({
        userId,
        athleteId: athlete?.id,
        season: "2025-2026",
        avg: stats.avg ? stats.avg : null,
        ops: stats.ops ? stats.ops : null,
        era: stats.era ? stats.era : null,
        whip: stats.whip ? stats.whip : null,
        kPercent: stats.kPercent ? stats.kPercent : null,
        firstPitchStrikePercent: stats.firstPitchStrikePercent ? stats.firstPitchStrikePercent : null,
        exitVelocity: stats.exitVelocity ? stats.exitVelocity : null,
        rawData: stats,
      });
      
      res.json({ success: true, stats: savedStats });
    } catch (err) {
      if (err instanceof z.ZodError) {
        return res.status(400).json({ message: err.errors[0].message });
      }
      throw err;
    }
  });

  // Get current user's stats
  app.get("/api/stats", isAuthenticated, async (req, res) => {
    try {
      const userId = (req.user as any).claims.sub;
      const stats = await storage.getGameChangerStatsByUserId(userId);
      res.json(stats || null);
    } catch (err) {
      throw err;
    }
  });

  // === PUBLIC RECRUITING PROFILE ===
  
  // Get public profile by athlete ID (no auth required)
  app.get("/api/profile/public/:id", async (req, res) => {
    try {
      const athleteId = parseInt(req.params.id);
      if (isNaN(athleteId)) {
        return res.status(400).json({ message: "Invalid athlete ID" });
      }
      
      const athlete = await storage.getAthlete(athleteId);
      if (!athlete) {
        return res.status(404).json({ message: "Athlete not found" });
      }
      
      // Get team info
      let teamName = null;
      if (athlete.teamId) {
        const team = await storage.getTeam(athlete.teamId);
        teamName = team?.name;
      }
      
      res.json({
        id: athlete.id,
        firstName: athlete.firstName,
        lastName: athlete.lastName,
        heightInches: athlete.heightInches,
        primaryPosition: athlete.primaryPosition,
        secondaryPosition: athlete.secondaryPosition,
        graduationYear: athlete.graduationYear,
        school: athlete.school,
        teamName,
        photoUrl: athlete.photoUrl,
      });
    } catch (err) {
      throw err;
    }
  });

  // Get public stats by athlete ID
  app.get("/api/stats/public/:id", async (req, res) => {
    try {
      const athleteId = parseInt(req.params.id);
      if (isNaN(athleteId)) {
        return res.status(400).json({ message: "Invalid athlete ID" });
      }
      
      const stats = await storage.getGameChangerStatsByAthleteId(athleteId);
      if (!stats) {
        // Return demo stats for demo profile
        return res.json({
          era: "1.25",
          whip: "0.89",
          kPercent: "35%",
          firstPitchStrikePercent: "68%",
          avg: ".385",
          ops: ".975",
          exitVelocity: "67",
        });
      }
      
      res.json({
        avg: stats.avg,
        ops: stats.ops,
        era: stats.era,
        whip: stats.whip,
        kPercent: stats.kPercent ? `${stats.kPercent}%` : null,
        firstPitchStrikePercent: stats.firstPitchStrikePercent ? `${stats.firstPitchStrikePercent}%` : null,
        exitVelocity: stats.exitVelocity,
      });
    } catch (err) {
      throw err;
    }
  });

  // Get public AI analysis by athlete ID
  app.get("/api/analysis/public/:id", async (req, res) => {
    try {
      const athleteId = parseInt(req.params.id);
      if (isNaN(athleteId)) {
        return res.status(400).json({ message: "Invalid athlete ID" });
      }
      
      const analysis = await storage.getSkeletalAnalysisByAthleteId(athleteId);
      if (!analysis) {
        // Return demo analysis for demo profile
        return res.json({
          highlights: [
            { title: "Elite Arm Circle Speed", grade: "A" },
            { title: "Strong Knee Drive", grade: "A-" },
            { title: "Optimal Release Point", grade: "B+" },
            { title: "Explosive Hip Rotation", grade: "A" },
          ]
        });
      }
      
      res.json({
        highlights: analysis.highlights?.map((h: string) => ({ title: h, grade: "A" })) || [],
      });
    } catch (err) {
      throw err;
    }
  });

  // Get public goals by athlete ID
  app.get("/api/goals/public/:id", async (req, res) => {
    try {
      const athleteId = parseInt(req.params.id);
      if (isNaN(athleteId)) {
        return res.status(400).json({ message: "Invalid athlete ID" });
      }
      
      // For now return demo goals - will integrate with actual goal storage later
      res.json([
        { metric: "velocity", metricLabel: "Increase Velocity", target: 5, unit: "mph", currentBaseline: 58, progress: 60 },
        { metric: "spin_rate", metricLabel: "Improve Spin Rate", target: 200, unit: "rpm", currentBaseline: 1800, progress: 45 },
        { metric: "strike_zone", metricLabel: "Strike Zone %", target: 70, unit: "%", currentBaseline: 62, progress: 75 },
      ]);
    } catch (err) {
      throw err;
    }
  });

  // === STRIPE PAYMENT ROUTES ===

  // Get Stripe publishable key
  app.get("/api/stripe/config", async (req, res) => {
    try {
      const publishableKey = await getStripePublishableKey();
      res.json({ publishableKey });
    } catch (err) {
      console.error("Failed to get Stripe config:", err);
      res.status(500).json({ message: "Stripe not configured" });
    }
  });

  // List products with prices
  app.get("/api/stripe/products", async (req, res) => {
    try {
      const products = await stripeService.listProductsWithPrices();
      const productsMap = new Map();
      for (const row of products) {
        if (!productsMap.has(row.product_id)) {
          productsMap.set(row.product_id, {
            id: row.product_id,
            name: row.product_name,
            description: row.product_description,
            active: row.product_active,
            metadata: row.product_metadata,
            prices: []
          });
        }
        if (row.price_id) {
          productsMap.get(row.product_id).prices.push({
            id: row.price_id,
            unit_amount: row.unit_amount,
            currency: row.currency,
            recurring: row.recurring,
            active: row.price_active,
            metadata: row.price_metadata,
          });
        }
      }
      res.json(Array.from(productsMap.values()));
    } catch (err) {
      console.error("Failed to list products:", err);
      res.status(500).json({ message: "Failed to list products" });
    }
  });

  // Validate coupon code
  app.post("/api/stripe/validate-coupon", async (req, res) => {
    try {
      const { code } = req.body;
      if (!code) {
        return res.status(400).json({ valid: false, message: "Coupon code required" });
      }

      const coupon = await stripeService.validateCoupon(code.toUpperCase());
      if (coupon) {
        res.json({
          valid: true,
          percentOff: coupon.percent_off,
          amountOff: coupon.amount_off,
          badge: coupon.metadata?.badge || null
        });
      } else {
        res.json({ valid: false });
      }
    } catch (err) {
      console.error("Coupon validation error:", err);
      res.json({ valid: false });
    }
  });

  // Create checkout session
  app.post("/api/stripe/checkout", isAuthenticated, async (req, res) => {
    try {
      if (!req.user) return res.status(401).json({ message: "Unauthorized" });
      const userId = (req.user as any).claims.sub;
      const userClaims = (req.user as any).claims;
      const { tier, couponCode } = req.body;

      if (!tier) {
        return res.status(400).json({ message: "Tier is required" });
      }

      // Map tier to metadata for finding the right price
      const products = await stripeService.listProductsWithPrices();
      
      // Find the product for this tier
      let priceId: string | null = null;
      for (const row of products) {
        const metadata = (row as any).product_metadata;
        if (metadata?.tier === tier && (row as any).price_id) {
          priceId = String((row as any).price_id);
          break;
        }
      }

      if (!priceId) {
        return res.status(400).json({ message: "Invalid tier" });
      }

      // Get or create Stripe customer
      let subscription = await storage.getUserSubscription(userId);
      let customerId = subscription?.stripeCustomerId;

      if (!customerId) {
        const email = userClaims.email || `${userId}@example.com`;
        const name = `${userClaims.first_name || ''} ${userClaims.last_name || ''}`.trim() || undefined;
        const customer = await stripeService.createCustomer(email, userId, name);
        customerId = customer.id;
        
        // Save customer ID
        await storage.upsertUserSubscription({
          userId,
          stripeCustomerId: customerId,
          tier: tier,
        });
      }

      const baseUrl = process.env.BASE_URL || `http://localhost:${process.env.PORT || 5000}`;
      const session = await stripeService.createCheckoutSession(
        customerId,
        priceId,
        `${baseUrl}/dashboard?checkout=success`,
        `${baseUrl}/pricing?checkout=cancelled`,
        couponCode
      );

      // If using DONOR100, mark as founding member
      if (couponCode?.toUpperCase() === 'DONOR100') {
        await storage.upsertUserSubscription({
          userId,
          stripeCustomerId: customerId,
          tier: tier,
          couponCode: 'DONOR100',
          isFoundingMember: true,
        });
      }

      res.json({ url: session.url });
    } catch (err) {
      console.error("Checkout error:", err);
      res.status(500).json({ message: "Failed to create checkout session" });
    }
  });

  // Get user subscription status
  app.get("/api/stripe/subscription", isAuthenticated, async (req, res) => {
    try {
      if (!req.user) return res.status(401).json({ message: "Unauthorized" });
      const userId = (req.user as any).claims.sub;
      
      const subscription = await storage.getUserSubscription(userId);
      res.json(subscription || { status: "none" });
    } catch (err) {
      console.error("Subscription fetch error:", err);
      res.status(500).json({ message: "Failed to get subscription" });
    }
  });

  // Create customer portal session
  app.post("/api/stripe/portal", isAuthenticated, async (req, res) => {
    try {
      if (!req.user) return res.status(401).json({ message: "Unauthorized" });
      const userId = (req.user as any).claims.sub;
      
      const subscription = await storage.getUserSubscription(userId);
      if (!subscription?.stripeCustomerId) {
        return res.status(400).json({ message: "No subscription found" });
      }

      const baseUrl = process.env.BASE_URL || `http://localhost:${process.env.PORT || 5000}`;
      const session = await stripeService.createCustomerPortalSession(
        subscription.stripeCustomerId,
        `${baseUrl}/dashboard`
      );

      res.json({ url: session.url });
    } catch (err) {
      console.error("Portal error:", err);
      res.status(500).json({ message: "Failed to create portal session" });
    }
  });

  // === TEAM STATS IMPORT ===
  
  // Import team stats from CSV
  app.post("/api/team-stats/import", isAuthenticated, async (req, res) => {
    try {
      if (!req.user) return res.status(401).json({ message: "Unauthorized" });
      const userId = (req.user as any).claims.sub;
      
      const coach = await storage.getCoachByUserId(userId);
      if (!coach) {
        return res.status(403).json({ message: "Coach account required" });
      }

      const { teamId, csvData, season } = req.body;
      if (!csvData) {
        return res.status(400).json({ message: "CSV data required" });
      }

      // Parse CSV data to extract team-level stats
      const rows = csvData.split('\n').filter((r: string) => r.trim());
      if (rows.length < 2) {
        return res.status(400).json({ message: "Invalid CSV format" });
      }

      const headers = rows[0].split(',').map((h: string) => h.trim().toLowerCase());
      const dataRows = rows.slice(1);

      // Calculate aggregate team stats
      let totalAvg = 0, totalOps = 0, totalEra = 0, totalWhip = 0, qabCount = 0;
      let avgCount = 0, opsCount = 0, eraCount = 0, whipCount = 0;

      for (const row of dataRows) {
        const values = row.split(',').map((v: string) => v.trim());
        const record: any = {};
        headers.forEach((h: string, i: number) => {
          record[h] = values[i];
        });

        // Batting stats
        if (record.avg && !isNaN(parseFloat(record.avg))) {
          totalAvg += parseFloat(record.avg);
          avgCount++;
        }
        if (record.ops && !isNaN(parseFloat(record.ops))) {
          totalOps += parseFloat(record.ops);
          opsCount++;
        }
        
        // Pitching stats
        if (record.era && !isNaN(parseFloat(record.era))) {
          totalEra += parseFloat(record.era);
          eraCount++;
        }
        if (record.whip && !isNaN(parseFloat(record.whip))) {
          totalWhip += parseFloat(record.whip);
          whipCount++;
        }

        // Quality at-bats (estimate based on OPS > .700 or AVG > .300)
        const playerOps = parseFloat(record.ops) || 0;
        const playerAvg = parseFloat(record.avg) || 0;
        if (playerOps > 0.700 || playerAvg > 0.300) {
          qabCount += parseInt(record.ab || record.games_played || '10');
        }
      }

      const teamStatsData = {
        teamId: teamId || null,
        coachId: coach.id,
        season: season || `${new Date().getFullYear()} Season`,
        gamesPlayed: dataRows.length,
        teamAvg: avgCount > 0 ? (totalAvg / avgCount).toFixed(3) : null,
        teamOps: opsCount > 0 ? (totalOps / opsCount).toFixed(3) : null,
        teamEra: eraCount > 0 ? (totalEra / eraCount).toFixed(2) : null,
        teamWhip: whipCount > 0 ? (totalWhip / whipCount).toFixed(2) : null,
        totalQualityAtBats: qabCount,
        rawData: { headers, rowCount: dataRows.length },
      };

      const stats = await storage.createTeamStats(teamStatsData);
      res.status(201).json(stats);
    } catch (err) {
      console.error("Team stats import error:", err);
      res.status(500).json({ message: "Failed to import team stats" });
    }
  });

  // Get team stats by team ID
  app.get("/api/team-stats/:teamId", isAuthenticated, async (req, res) => {
    try {
      const teamIdParam = req.params.teamId;
      const teamId = parseInt(typeof teamIdParam === 'string' ? teamIdParam : teamIdParam[0]);
      if (isNaN(teamId)) {
        return res.status(400).json({ message: "Invalid team ID" });
      }
      
      const stats = await storage.getTeamStatsByTeamId(teamId);
      res.json(stats || null);
    } catch (err) {
      throw err;
    }
  });

  // Get team stats for coach
  app.get("/api/coach/team-stats", isAuthenticated, async (req, res) => {
    try {
      if (!req.user) return res.status(401).json({ message: "Unauthorized" });
      const userId = (req.user as any).claims.sub;
      
      const coach = await storage.getCoachByUserId(userId);
      if (!coach) {
        return res.json([]);
      }
      
      const stats = await storage.getTeamStatsByCoachId(coach.id);
      res.json(stats);
    } catch (err) {
      throw err;
    }
  });

  // Seed Data (if empty)
  seedDatabase();

  return httpServer;
}

async function seedDatabase() {
  const teams = await storage.getTeams();
  if (teams.length === 0) {
    const team = await storage.createTeam({
      name: "Thunderbolts 14U",
      ageDivision: "14U",
      season: "Spring 2026",
      active: true
    });
    
    await storage.createAthlete({
      firstName: "Sarah",
      lastName: "Jenkins",
      teamId: team.id,
      primaryPosition: "P",
      secondaryPosition: "1B",
      jerseyNumber: 12,
      bats: "R",
      throws: "R"
    });

    await storage.createDrill({
      name: "Towel Drill",
      category: "Mechanics",
      skillType: "pitching",
      difficulty: "Beginner",
      description: "Practice arm mechanics without a ball using a towel.",
      equipment: ["Towel"]
    });
  }
}
