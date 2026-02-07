
import { pgTable, text, serial, integer, boolean, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// === TABLE DEFINITIONS ===
export const storyProgress = pgTable("story_progress", {
  id: serial("id").primaryKey(),
  sessionId: text("session_id").notNull(), // Frontend generates a UUID for the session
  currentChapter: integer("current_chapter").default(0), // 0: Start, 1: Minigame, 2: Voice, 3: Clues, 4: Finale, 5: Snowflake, 6: Maze, 7: Ending
  minigameAttempts: integer("minigame_attempts").default(0),
  cluesFound: text("clues_found").array().default([]), // IDs of clues found
  isComplete: boolean("is_complete").default(false),
  hasFailedHeart: boolean("has_failed_heart").default(false), // New branch for failing Ch 1
  loveMeter: integer("love_meter").default(0), // For snowflake minigame
  storyPath: text("story_path").default("standard"), // 'standard', 'sadness', 'imprisoned', 'moon', 'escape'
  lastUpdated: timestamp("last_updated").defaultNow(),
});

// === SCHEMAS ===
export const insertProgressSchema = createInsertSchema(storyProgress).omit({ 
  id: true, 
  lastUpdated: true 
});

export const updateProgressSchema = insertProgressSchema.partial();

// === TYPES ===
export type StoryProgress = typeof storyProgress.$inferSelect;
export type InsertStoryProgress = z.infer<typeof insertProgressSchema>;
export type UpdateStoryProgress = z.infer<typeof updateProgressSchema>;

// Password verification type
export const verifyPasswordSchema = z.object({
  password: z.string().min(1),
});
