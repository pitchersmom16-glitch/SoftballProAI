import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { api } from "@shared/routes";
import { z } from "zod";
import { setupAuth, registerAuthRoutes } from "./replit_integrations/auth";
import { registerObjectStorageRoutes } from "./replit_integrations/object_storage";
import { openai } from "./replit_integrations/audio"; // Use the audio client for openai instance

export async function registerRoutes(
  httpServer: Server,
  app: Express
): Promise<Server> {
  // Wire up integrations
  await setupAuth(app);
  registerAuthRoutes(app);
  registerObjectStorageRoutes(app);

  // === API ROUTES ===

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
            { role: "system", content: "You are an expert softball mechanics coach. Analyze the pitching metrics and provide feedback." },
            { role: "user", content: `Metrics: ${JSON.stringify(mockMetrics)}. Skill: ${assessment.skillType}. Generate 3 key feedback points.` }
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
