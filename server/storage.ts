
import { db } from "./db";
import { eq } from "drizzle-orm";
import { 
  storyProgress, 
  type StoryProgress, 
  type InsertStoryProgress, 
  type UpdateStoryProgress 
} from "@shared/schema";

export interface IStorage {
  // Story Progress
  getProgress(sessionId: string): Promise<StoryProgress | undefined>;
  createProgress(progress: InsertStoryProgress): Promise<StoryProgress>;
  updateProgress(sessionId: string, updates: UpdateStoryProgress): Promise<StoryProgress>;
}

export class DatabaseStorage implements IStorage {
  async getProgress(sessionId: string): Promise<StoryProgress | undefined> {
    const [progress] = await db
      .select()
      .from(storyProgress)
      .where(eq(storyProgress.sessionId, sessionId));
    return progress;
  }

  async createProgress(insertProgress: InsertStoryProgress): Promise<StoryProgress> {
    const [progress] = await db
      .insert(storyProgress)
      .values(insertProgress)
      .returning();
    return progress;
  }

  async updateProgress(sessionId: string, updates: UpdateStoryProgress): Promise<StoryProgress> {
    const [updated] = await db
      .update(storyProgress)
      .set({ ...updates, lastUpdated: new Date() })
      .where(eq(storyProgress.sessionId, sessionId))
      .returning();
    return updated;
  }
}

export const storage = new DatabaseStorage();
