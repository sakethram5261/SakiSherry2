
import type { Express } from "express";
import type { Server } from "http";
import { storage } from "./storage";
import { api, FINAL_PASSWORD } from "@shared/routes";
import { z } from "zod";

export async function registerRoutes(
  httpServer: Server,
  app: Express
): Promise<Server> {
  
  // Initialize or Get Progress
  app.post(api.story.init.path, async (req, res) => {
    const { sessionId } = api.story.init.input.parse(req.body);
    let progress = await storage.getProgress(sessionId);
    
    if (!progress) {
      progress = await storage.createProgress({
        sessionId,
        currentChapter: 0,
        minigameAttempts: 0,
        cluesFound: [],
        isComplete: false
      });
    }
    
    res.json(progress);
  });

  // Get Progress
  app.get(api.story.get.path, async (req, res) => {
    const sessionId = req.params.sessionId;
    const progress = await storage.getProgress(sessionId);
    
    if (!progress) {
      return res.status(404).json({ message: "Session not found" });
    }
    
    res.json(progress);
  });

  // Update Progress
  app.patch(api.story.update.path, async (req, res) => {
    const sessionId = req.params.sessionId;
    const updates = api.story.update.input.parse(req.body);
    
    try {
      const updated = await storage.updateProgress(sessionId, updates);
      res.json(updated);
    } catch (error) {
      res.status(404).json({ message: "Session not found" });
    }
  });

  // Verify Password
  app.post(api.story.verify.path, async (req, res) => {
    const { password } = api.story.verify.input.parse(req.body);
    
    // Normalize string: lowercase, trim
    const normalized = password.toLowerCase().trim();
    // Accept a few variations of the "line to her"
    const validPasswords = [
      "i love you",
      "the moon is beautiful", 
      "moon is beautiful",
      "eternal love",
      "my love",
      "found you"
    ];
    
    const isValid = validPasswords.some(p => normalized.includes(p));

    if (isValid) {
      res.json({ success: true, message: "The memory returns..." });
    } else {
      res.json({ success: false, message: "That doesn't feel quite right." });
    }
  });

  return httpServer;
}
