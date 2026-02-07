import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api, buildUrl } from "@shared/routes";
import type { UpdateStoryProgress, StoryProgress } from "@shared/schema";
import { v4 as uuidv4 } from 'uuid'; // We need a UUID generator, using simple fallback if not available or just Math.random for demo if package missing, but let's assume we use a simple util

// Simple UUID generator since we didn't add uuid package in requirements (my bad, fixing inline)
const generateUUID = () => {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
    var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
    return v.toString(16);
  });
};

const getSessionId = () => {
  let id = localStorage.getItem('story_session_id');
  if (!id) {
    id = generateUUID();
    localStorage.setItem('story_session_id', id);
  }
  return id;
};

export function useStorySession() {
  const sessionId = getSessionId();
  
  // Ensure session exists on backend
  return useQuery({
    queryKey: ['story_session', sessionId],
    queryFn: async () => {
      // First try to get it
      const getRes = await fetch(buildUrl(api.story.get.path, { sessionId }), { credentials: "include" });
      if (getRes.ok) {
        return api.story.get.responses[200].parse(await getRes.json());
      }
      
      // If not found, init it
      const initRes = await fetch(api.story.init.path, {
        method: api.story.init.method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ sessionId }),
        credentials: "include"
      });
      
      if (!initRes.ok) throw new Error("Failed to initialize story session");
      return api.story.init.responses[200].parse(await initRes.json());
    }
  });
}

export function useUpdateStory() {
  const sessionId = getSessionId();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (updates: UpdateStoryProgress) => {
      const url = buildUrl(api.story.update.path, { sessionId });
      const res = await fetch(url, {
        method: api.story.update.method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updates),
        credentials: "include",
      });
      
      if (!res.ok) throw new Error("Failed to update story progress");
      return api.story.update.responses[200].parse(await res.json());
    },
    onSuccess: (data) => {
      queryClient.setQueryData(['story_session', sessionId], data);
    }
  });
}

export function useVerifyPassword() {
  return useMutation({
    mutationFn: async (password: string) => {
      const res = await fetch(api.story.verify.path, {
        method: api.story.verify.method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password }),
        credentials: "include",
      });
      
      if (!res.ok) throw new Error("Failed to verify password");
      return api.story.verify.responses[200].parse(await res.json());
    }
  });
}
