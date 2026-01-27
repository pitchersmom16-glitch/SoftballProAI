import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { api } from "@shared/routes";
import { z } from "zod";
import { setupAuth, registerAuthRoutes } from "./replit_integrations/auth";
import { registerObjectStorageRoutes } from "./replit_integrations/object_storage";
import { openai } from "./replit_integrations/audio"; // Use the audio client for openai instance
import { analyzeMechanics, getCorrectiveDrills, getDrillsByTag, getDrillsByExpert } from "./brain/analyze_mechanics";

export async function registerRoutes(
  httpServer: Server,
  app: Express
): Promise<Server> {
  // Wire up integrations
  await setupAuth(app);
  registerAuthRoutes(app);
  registerObjectStorageRoutes(app);

  // === API ROUTES ===

  // User Role Management
  app.put("/api/user/role", async (req, res) => {
    try {
      if (!req.user) return res.status(401).json({ message: "Unauthorized" });
      const userId = (req.user as any).claims.sub;
      
      const roleSchema = z.object({
        role: z.enum(["player", "team_coach", "pitching_coach"])
      });
      
      const { role } = roleSchema.parse(req.body);
      await storage.updateUserRole(userId, role);
      
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
      
      res.status(201).json(checkin);
    } catch (err) {
      if (err instanceof z.ZodError) {
        return res.status(400).json({ message: err.errors[0].message });
      }
      throw err;
    }
  });

  // Random Mental Edge (Mamba Mentality)
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

  // Drills
  app.get(api.drills.list.path, async (req, res) => {
    const category = req.query.skillType as string; // Approximate mapping
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
        skillType as "pitching" | "hitting",
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
      name: "Sarah Jenkins",
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
