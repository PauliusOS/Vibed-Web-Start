---
name: agent-gpt-image-implementor
description: when implementing gpt image analysis into the app
model: inherit
color: purple
---

# Agent: GPT Image Analysis Implementation

This agent instruction file contains all the essential knowledge and steps needed to implement AI-powered image analysis features in a Convex + Expo React Native app with Clerk authentication. It captures the learnings from our implementation to avoid common pitfalls.

## Agent Overview

**Purpose**: Implement a complete image analysis feature that allows users to upload/capture photos and automatically generate todo items using OpenAI's GPT-4 Vision model.

**Tech Stack**: 
- Backend: Convex (database, actions, HTTP endpoints)
- AI: OpenAI GPT-4 Vision via Vercel AI SDK
- Frontend: Expo React Native with Clerk authentication
- Image handling: Expo ImagePicker + Convex storage

## Critical Implementation Knowledge

### 1. Convex HTTP Actions - URL Gotcha 🚨

**CRITICAL**: Convex HTTP actions are served from `.convex.site` NOT `.convex.cloud`

```typescript
// ❌ WRONG - Will cause 404 errors
const uploadUrl = `https://deployment-name.convex.cloud/uploadImage`;

// ✅ CORRECT - HTTP actions endpoint
const uploadUrl = `https://deployment-name.convex.site/uploadImage`;
```

**Implementation Pattern:**
```typescript
// In frontend hooks/components
const convexUrl = process.env.EXPO_PUBLIC_CONVEX_URL; // ends with .convex.cloud
const siteUrl = convexUrl.replace('.convex.cloud', '.convex.site');
const uploadUrl = `${siteUrl}/uploadImage`;
```

### 2. OpenAI Response Parsing - JSON in Markdown 🚨

**CRITICAL**: OpenAI often returns JSON wrapped in markdown code blocks, causing parsing failures.

```javascript
// ❌ WRONG - Will fail if AI returns ```json ... ```
const parsed = JSON.parse(result.text);

// ✅ CORRECT - Extract JSON from markdown first
let content = result.text;
const codeBlockMatch = content.match(/```(?:json)?\s*\n?([\s\S]*?)\n?```/);
if (codeBlockMatch) {
  content = codeBlockMatch[1].trim();
}
const parsed = JSON.parse(content);
```

### 3. Expo ImagePicker API Updates 🚨

**CRITICAL**: Use array of strings for media types, not deprecated enum values

```typescript
// ❌ DEPRECATED - Will show warnings
mediaTypes: ExpoImagePicker.MediaTypeOptions.Images,
// ❌ ALSO DEPRECATED - Still triggers warnings
mediaTypes: ExpoImagePicker.MediaType.Images,

// ✅ CURRENT - Use array of strings
mediaTypes: ['images'],                    // Images only
mediaTypes: ['videos'],                    // Videos only  
mediaTypes: ['images', 'videos'],          // Both images and videos
```

### 4. Clerk Authentication in HTTP Actions 🚨

**CRITICAL**: HTTP actions require proper JWT authentication setup

```typescript
// Frontend: Get proper Clerk token
const token = await getToken({ template: "convex" });

// HTTP Action: Validate JWT
const identity = await ctx.auth.getUserIdentity();
if (!identity) {
  return new Response("Unauthorized", { status: 401 });
}
```

## Complete Implementation Steps

### Step 1: Install Dependencies

```bash
npm install @ai-sdk/openai ai expo-image-picker expo-file-system
```

### Step 2: Environment Configuration

```env
# .env.local
OPENAI_API_KEY=sk-...
EXPO_PUBLIC_CONVEX_URL=https://deployment-name.convex.cloud
```

### Step 3: Database Schema Updates

```typescript
// convex/schema.ts
import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  todos: defineTable({
    text: v.string(),
    completed: v.boolean(),
    userId: v.string(),
    createdAt: v.number(),
    // New fields for image-generated todos
    sourceImageId: v.optional(v.id("_storage")),
    generatedFrom: v.optional(v.literal("image")),
    confidence: v.optional(v.number()),
  }),

  imageAnalysis: defineTable({
    userId: v.string(),
    storageId: v.id("_storage"),
    imageUrl: v.string(),
    prompt: v.string(),
    analysis: v.string(),
    todosGenerated: v.array(v.id("todos")),
    createdAt: v.number(),
    model: v.string(),
    tokensUsed: v.optional(v.number()),
  }),
});
```

### Step 4: HTTP Upload Endpoint

```typescript
// convex/http.ts
import { httpRouter } from "convex/server";
import { httpAction } from "./_generated/server";

const http = httpRouter();

http.route({
  path: "/uploadImage",
  method: "POST",
  handler: httpAction(async (ctx, request) => {
    const authHeader = request.headers.get("Authorization");
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return new Response("Unauthorized", { status: 401 });
    }

    try {
      // Validate JWT token
      const identity = await ctx.auth.getUserIdentity();
      if (!identity) {
        return new Response("Unauthorized", { status: 401 });
      }

      const blob = await request.blob();
      const storageId = await ctx.storage.store(blob);
      
      return new Response(JSON.stringify({ storageId }), {
        status: 200,
        headers: {
          "Content-Type": "application/json",
          "Access-Control-Allow-Origin": "*",
          "Access-Control-Allow-Headers": "Content-Type, Authorization",
        },
      });
    } catch (error) {
      console.error("Upload error:", error);
      return new Response("Upload failed", { status: 500 });
    }
  }),
});

// CORS preflight
http.route({
  path: "/uploadImage",
  method: "OPTIONS",
  handler: httpAction(async () => {
    return new Response(null, {
      status: 204,
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "POST, OPTIONS",
        "Access-Control-Allow-Headers": "Content-Type, Authorization",
      },
    });
  }),
});

export default http;
```

### Step 5: OpenAI Integration (Robust Parsing)

```typescript
// convex/ai/openai.ts
import { openai } from '@ai-sdk/openai';
import { generateText } from 'ai';

export interface TodoItem {
  text: string;
  confidence: number;
  category?: string;
  priority?: 'low' | 'medium' | 'high';
}

export interface AIAnalysisResponse {
  todos: TodoItem[];
  summary: string;
  imageDescription: string;
}

export const ANALYSIS_PROMPTS = {
  default: `Analyze this image and extract actionable todo items. 
    Return ONLY a valid JSON object (no markdown, no code blocks, no extra text).
    Use this exact structure:
    {
      "todos": [{"text": "task description", "confidence": 0.9, "category": "optional", "priority": "medium"}],
      "summary": "brief summary",
      "imageDescription": "description of image"
    }`,
};

export const analyzeImageWithOpenAI = async (
  imageUrl: string,
  prompt: string = ANALYSIS_PROMPTS.default
): Promise<AIAnalysisResponse> => {
  const apiKey = process.env.OPENAI_API_KEY;
  
  if (!apiKey) {
    throw new Error('OPENAI_API_KEY is not configured');
  }

  try {
    const result = await generateText({
      model: openai('gpt-4o'),
      messages: [{
        role: 'user',
        content: [
          { type: 'text', text: prompt },
          { type: 'image', image: imageUrl }
        ]
      }],
      maxTokens: 1000,
      temperature: 0.7,
    });

    let content = result.text;
    
    // CRITICAL: Extract JSON from markdown code blocks if present
    const codeBlockMatch = content.match(/```(?:json)?\s*\n?([\s\S]*?)\n?```/);
    if (codeBlockMatch) {
      content = codeBlockMatch[1].trim();
    }
    
    try {
      const parsed = JSON.parse(content);
      
      return {
        todos: parsed.todos || [],
        summary: parsed.summary || 'Image analyzed successfully',
        imageDescription: parsed.imageDescription || 'No description available',
      };
    } catch (parseError) {
      console.error('Failed to parse AI response:', content);
      
      // Fallback response
      return {
        todos: [{
          text: content || 'Review the uploaded image',
          confidence: 0.5,
        }],
        summary: 'Image processed with basic extraction',
        imageDescription: 'Image content extracted as text',
      };
    }
  } catch (error) {
    console.error('OpenAI API error:', error);
    throw new Error(`Failed to analyze image: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
};
```

### Step 6: Image Analysis Action

```typescript
// convex/imageAnalysis.ts
import { v } from "convex/values";
import { action, internalMutation } from "./_generated/server";
import { internal } from "./_generated/api";
import { analyzeImageWithOpenAI, ANALYSIS_PROMPTS } from "./ai/openai";

export const analyzeImage = action({
  args: {
    storageId: v.id("_storage"),
    userId: v.string(),
    promptType: v.optional(v.union(
      v.literal("default"),
      v.literal("shopping"),
      v.literal("notes"),
      v.literal("receipt")
    )),
  },
  handler: async (ctx, args) => {
    try {
      const imageUrl = await ctx.storage.getUrl(args.storageId);
      
      if (!imageUrl) {
        throw new Error("Failed to get image URL from storage");
      }

      const promptType = args.promptType || "default";
      const prompt = ANALYSIS_PROMPTS[promptType];

      const analysisResult = await analyzeImageWithOpenAI(imageUrl, prompt);

      // Save analysis
      const analysisId = await ctx.runMutation(internal.imageAnalysis.saveAnalysis, {
        userId: args.userId,
        storageId: args.storageId,
        imageUrl: imageUrl,
        prompt: prompt,
        analysis: JSON.stringify(analysisResult),
        model: "gpt-4o",
      });

      // Save todos
      const todoIds = await ctx.runMutation(internal.imageAnalysis.saveTodosFromImage, {
        userId: args.userId,
        todos: analysisResult.todos.map(todo => ({
          text: todo.text,
          confidence: todo.confidence || 0.8,
        })),
        sourceImageId: args.storageId,
        analysisId: analysisId,
      });

      return {
        success: true,
        analysisResult,
        todoIds,
        analysisId,
      };
    } catch (error) {
      console.error("Image analysis failed:", error);
      return {
        success: false,
        error: error instanceof Error ? error.message : "Unknown error occurred",
      };
    }
  },
});

export const saveAnalysis = internalMutation({
  args: {
    userId: v.string(),
    storageId: v.id("_storage"),
    imageUrl: v.string(),
    prompt: v.string(),
    analysis: v.string(),
    model: v.string(),
  },
  handler: async (ctx, args) => {
    return await ctx.db.insert("imageAnalysis", {
      userId: args.userId,
      storageId: args.storageId,
      imageUrl: args.imageUrl,
      prompt: args.prompt,
      analysis: args.analysis,
      todosGenerated: [],
      createdAt: Date.now(),
      model: args.model,
    });
  },
});

export const saveTodosFromImage = internalMutation({
  args: {
    userId: v.string(),
    todos: v.array(v.object({
      text: v.string(),
      confidence: v.number(),
    })),
    sourceImageId: v.id("_storage"),
    analysisId: v.id("imageAnalysis"),
  },
  handler: async (ctx, args) => {
    const todoIds = [];
    
    for (const todo of args.todos) {
      const todoId = await ctx.db.insert("todos", {
        text: todo.text,
        completed: false,
        userId: args.userId,
        createdAt: Date.now(),
        sourceImageId: args.sourceImageId,
        generatedFrom: "image" as const,
        confidence: todo.confidence,
      });
      todoIds.push(todoId);
    }
    
    return todoIds;
  },
});
```

### Step 7: Frontend Hook with Correct URLs

```typescript
// hooks/useImageAnalysis.ts
import { useState } from 'react';
import { useAction } from 'convex/react';
import { api } from '@/convex/_generated/api';
import { Platform } from 'react-native';
import { useAuth } from '@clerk/clerk-expo';

export function useImageAnalysis() {
  const { getToken } = useAuth();
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  
  const analyzeImageAction = useAction(api.imageAnalysis.analyzeImage);

  const uploadImageToConvex = async (imageUri: string): Promise<string | null> => {
    try {
      const convexUrl = process.env.EXPO_PUBLIC_CONVEX_URL;
      if (!convexUrl) {
        throw new Error('Convex URL not configured');
      }

      // CRITICAL: Convert from .convex.cloud to .convex.site for HTTP actions
      const siteUrl = convexUrl.replace('.convex.cloud', '.convex.site');

      let blob: Blob;

      if (Platform.OS === 'web') {
        const response = await fetch(imageUri);
        blob = await response.blob();
      } else {
        const FileSystem = await import('expo-file-system');
        const base64 = await FileSystem.readAsStringAsync(imageUri, {
          encoding: FileSystem.EncodingType.Base64,
        });
        blob = await fetch(`data:image/jpeg;base64,${base64}`).then(r => r.blob());
      }

      const uploadUrl = `${siteUrl}/uploadImage`;
      const token = await getToken({ template: "convex" });
      
      const response = await fetch(uploadUrl, {
        method: 'POST',
        body: blob,
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error(`Upload failed: ${response.statusText}`);
      }

      const { storageId } = await response.json();
      return storageId;
    } catch (error) {
      console.error('Upload error:', error);
      throw error;
    }
  };

  const uploadAndAnalyzeImage = async (imageUri: string, userId: string) => {
    setIsAnalyzing(true);
    
    try {
      const storageId = await uploadImageToConvex(imageUri);
      
      if (!storageId) {
        throw new Error('Failed to upload image');
      }
      
      const result = await analyzeImageAction({
        storageId: storageId as any,
        userId,
      });
      
      if (result.success && result.analysisResult) {
        return result.analysisResult;
      } else {
        throw new Error(result.error || 'Analysis failed');
      }
    } catch (error) {
      console.error('Analysis error:', error);
      throw error;
    } finally {
      setIsAnalyzing(false);
    }
  };

  return {
    isAnalyzing,
    uploadAndAnalyzeImage,
  };
}
```

### Step 8: ImagePicker Component (Current API)

```typescript
// components/ImagePicker.tsx
import React from 'react';
import { TouchableOpacity, Text } from 'react-native';
import * as ExpoImagePicker from 'expo-image-picker';

export function ImagePicker({ onImageSelected }: { onImageSelected: (uri: string) => void }) {
  const pickImageFromLibrary = async () => {
    try {
      const result = await ExpoImagePicker.launchImageLibraryAsync({
        mediaTypes: ['images'], // CRITICAL: Use array of strings, not enum values
        allowsEditing: true,
        aspect: [4, 3],
        quality: 0.8,
      });

      if (!result.canceled && result.assets && result.assets[0]) {
        onImageSelected(result.assets[0].uri);
      }
    } catch (error) {
      console.error('Image picker error:', error);
    }
  };

  return (
    <TouchableOpacity onPress={pickImageFromLibrary}>
      <Text>Choose from Library</Text>
    </TouchableOpacity>
  );
}
```

## Testing & Debugging Checklist

### ✅ Deployment Verification
- [ ] Run `npx convex dev --once` after changes
- [ ] Check function spec: `npx convex function-spec` should show HTTP routes
- [ ] Test HTTP endpoint: `curl https://deployment-name.convex.site/test`

### ✅ Authentication Check
- [ ] Verify JWT token generation with `getToken({ template: "convex" })`
- [ ] Confirm `ctx.auth.getUserIdentity()` returns user in HTTP action
- [ ] Check Authorization header format: `Bearer <token>`

### ✅ AI Response Validation
- [ ] Log raw AI response to debug parsing issues
- [ ] Test with simple images first (text, handwriting)
- [ ] Verify JSON structure matches interface

### ✅ Common Error Patterns
- 404 on HTTP endpoints → Check `.convex.site` vs `.convex.cloud`
- JSON parse errors → Check for markdown code block wrapping
- Auth errors → Verify JWT token and Clerk configuration
- Image upload failures → Check blob conversion and CORS headers

## Environment Variables Template

```env
# Required
OPENAI_API_KEY=sk-proj-...
EXPO_PUBLIC_CONVEX_URL=https://deployment-name.convex.cloud
CLERK_JWT_ISSUER_DOMAIN=https://clerk-domain.clerk.accounts.dev

# Convex deployment (auto-generated)
CONVEX_DEPLOYMENT=dev:deployment-name
```

## Success Metrics & Validation

After implementation, verify:
1. ✅ Image upload completes without 404 errors
2. ✅ AI analysis returns structured todo items
3. ✅ Todos are saved to database with proper metadata
4. ✅ No deprecation warnings in console
5. ✅ Authentication works properly across all endpoints

This agent instruction captures all critical learnings and should prevent the common pitfalls we encountered during implementation.
