// Add this to your convex/schema.ts file

import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  // ... your existing tables

  voiceConversations: defineTable({
    userId: v.string(),
    transcription: v.string(),          // User's spoken input
    aiResponse: v.string(),              // AI's text response
    audioResponseUrl: v.optional(v.string()), // Optional TTS audio URL
    contextData: v.optional(v.string()), // Optional app-specific context
    createdAt: v.number(),
  })
    .index("by_user", ["userId"])
    .index("by_created_at", ["createdAt"]),
});
