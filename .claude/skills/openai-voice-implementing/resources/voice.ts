// Create this file: convex/voice.ts

import { v } from "convex/values";
import { action, internalMutation } from "./_generated/server";
import { internal } from "./_generated/api";
import OpenAI from "openai";
import { streamText } from "ai";
import { openai as openaiProvider } from "@ai-sdk/openai";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY!,
});

// Action 1: Speech-to-Text using Whisper
export const transcribeAudio = action({
  args: {
    audioBase64: v.string(),
    format: v.string(), // 'mp3', 'wav', 'mp4' (m4a)
  },
  handler: async (ctx, args): Promise<{ text: string }> => {
    // Convert base64 to buffer
    const audioBuffer = Buffer.from(args.audioBase64, "base64");

    // Create File object for Whisper API
    const file = new File([audioBuffer], `recording.${args.format}`, {
      type: `audio/${args.format}`,
    });

    // Transcribe using Whisper
    const transcription = await openai.audio.transcriptions.create({
      file: file,
      model: "whisper-1",
      language: "en", // Change as needed or omit for auto-detection
      response_format: "json",
    });

    return { text: transcription.text };
  },
});

// Action 2: AI Response Generation
export const generateAIResponse = action({
  args: {
    userMessage: v.string(),
    systemPrompt: v.string(),
    contextData: v.optional(v.string()),
    modelName: v.optional(v.string()),
    maxTokens: v.optional(v.number()),
  },
  handler: async (ctx, args): Promise<{ response: string }> => {
    const model = args.modelName || "gpt-4o";

    // Build system message with context
    const systemMessage = args.contextData
      ? `${args.systemPrompt}\n\nContext: ${args.contextData}`
      : args.systemPrompt;

    // Use Vercel AI SDK for streaming
    const result = await streamText({
      model: openaiProvider(model),
      system: systemMessage,
      prompt: args.userMessage,
      maxTokens: args.maxTokens || 500,
    });

    // Collect full response
    let fullResponse = "";
    for await (const textPart of result.textStream) {
      fullResponse += textPart;
    }

    return { response: fullResponse };
  },
});

// Action 3: Text-to-Speech using OpenAI TTS
export const generateSpeech = action({
  args: {
    text: v.string(),
    voice: v.optional(v.string()),
    model: v.optional(v.string()),
  },
  handler: async (ctx, args): Promise<{ audioBase64: string; format: string }> => {
    const voice = args.voice || "nova"; // alloy, echo, fable, onyx, nova, shimmer
    const model = args.model || "tts-1"; // tts-1 or tts-1-hd

    const speechResponse = await openai.audio.speech.create({
      model: model as "tts-1" | "tts-1-hd",
      voice: voice as any,
      input: args.text,
      response_format: "mp3",
      speed: 1.0,
    });

    // Convert to base64 for transfer
    const buffer = Buffer.from(await speechResponse.arrayBuffer());
    const base64Audio = buffer.toString("base64");

    return { audioBase64: base64Audio, format: "mp3" };
  },
});

// Action 4: Complete Voice Conversation Workflow
export const processVoiceConversation = action({
  args: {
    userId: v.string(),
    audioBase64: v.string(),
    audioFormat: v.string(),
    systemPrompt: v.string(),
    contextData: v.optional(v.string()),
    voicePreference: v.optional(v.string()),
  },
  handler: async (ctx, args): Promise<{
    transcription: string;
    response: string;
    audioBase64: string;
  }> => {
    // Step 1: Transcribe audio
    const transcription = await ctx.runAction(internal.voice.transcribeAudio, {
      audioBase64: args.audioBase64,
      format: args.audioFormat,
    });

    // Step 2: Generate AI response
    const aiResponse = await ctx.runAction(internal.voice.generateAIResponse, {
      userMessage: transcription.text,
      systemPrompt: args.systemPrompt,
      contextData: args.contextData,
    });

    // Step 3: Convert to speech
    const speech = await ctx.runAction(internal.voice.generateSpeech, {
      text: aiResponse.response,
      voice: args.voicePreference,
    });

    // Step 4: Save conversation
    await ctx.runMutation(internal.voice.saveConversation, {
      userId: args.userId,
      transcription: transcription.text,
      aiResponse: aiResponse.response,
      contextData: args.contextData,
    });

    return {
      transcription: transcription.text,
      response: aiResponse.response,
      audioBase64: speech.audioBase64,
    };
  },
});

// Internal Mutation: Save Conversation
export const saveConversation = internalMutation({
  args: {
    userId: v.string(),
    transcription: v.string(),
    aiResponse: v.string(),
    contextData: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    return await ctx.db.insert("voiceConversations", {
      userId: args.userId,
      transcription: args.transcription,
      aiResponse: args.aiResponse,
      contextData: args.contextData,
      createdAt: Date.now(),
    });
  },
});
