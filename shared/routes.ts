
import { z } from 'zod';
import { insertProgressSchema, updateProgressSchema, storyProgress, verifyPasswordSchema } from './schema';

export const api = {
  story: {
    // Create or retrieve session
    init: {
      method: 'POST' as const,
      path: '/api/story/init' as const,
      input: z.object({ sessionId: z.string() }),
      responses: {
        200: z.custom<typeof storyProgress.$inferSelect>(), // Returns existing or new
      },
    },
    // Get current progress
    get: {
      method: 'GET' as const,
      path: '/api/story/:sessionId' as const,
      responses: {
        200: z.custom<typeof storyProgress.$inferSelect>(),
        404: z.object({ message: z.string() }),
      },
    },
    // Update progress (chapter, clues, attempts)
    update: {
      method: 'PATCH' as const,
      path: '/api/story/:sessionId' as const,
      input: updateProgressSchema,
      responses: {
        200: z.custom<typeof storyProgress.$inferSelect>(),
        404: z.object({ message: z.string() }),
      },
    },
    // Verify finale password
    verify: {
      method: 'POST' as const,
      path: '/api/story/verify' as const,
      input: verifyPasswordSchema,
      responses: {
        200: z.object({ success: z.boolean(), message: z.string() }),
      },
    },
  },
};

// Helper to verify the password logic on backend (so it's not exposed in frontend bundle)
export const FINAL_PASSWORD = "i love you"; // Or whatever the line is meant to be

export function buildUrl(path: string, params?: Record<string, string | number>): string {
  let url = path;
  if (params) {
    Object.entries(params).forEach(([key, value]) => {
      if (url.includes(`:${key}`)) {
        url = url.replace(`:${key}`, String(value));
      }
    });
  }
  return url;
}
