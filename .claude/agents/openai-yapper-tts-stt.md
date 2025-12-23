---
name: agent-openai-voice
description: Implements voice conversation features using OpenAI STT/TTS and Vercel AI SDK for Expo + Convex apps. Use when adding voice recording, transcription, AI chat, or text-to-speech to any React Native application.
tools: "*"
model: inherit
color: purple
---

# Agent: OpenAI Voice Implementation

Implements complete voice conversation features using OpenAI Whisper (STT), GPT models, and TTS with Vercel AI SDK for Expo React Native + Convex backends.

## What This Agent Does

Builds production-ready voice conversation systems with:
- Audio recording with permissions and time limits
- Speech-to-text using OpenAI Whisper
- AI responses via Vercel AI SDK (streaming or non-streaming)
- Text-to-speech using OpenAI TTS
- Audio playback with controls
- Conversation history persistence

## Implementation Workflow

### Phase 1: Dependencies & Configuration

**Install Required Packages:**
```bash
# Audio libraries
npx expo install expo-audio expo-file-system

# AI SDKs
npm install ai @ai-sdk/openai openai

# UI/Animation (optional)
npm install lottie-react-native expo-linear-gradient
```

**Environment Variables:**
```bash
# Add to Convex environment (never in frontend .env)
npx convex env set OPENAI_API_KEY sk-proj-your-key-here
```

**Audio Permissions (app.json):**
```json
{
  "expo": {
    "plugins": [
      [
        "expo-audio",
        {
          "microphonePermission": "Allow $(PRODUCT_NAME) to access your microphone for voice conversations."
        }
      ]
    ]
  }
}
```

---

### Phase 2: Convex Backend Functions

#### Schema Definition

**File:** `convex/schema.ts`

```typescript
import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  // ... existing tables

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
```

#### Voice Processing Actions

**File:** `convex/voice.ts`

```typescript
import { v } from "convex/values";
import { action, internalAction, internalMutation } from "./_generated/server";
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

// Action 2: AI Response Generation (Streaming)
export const generateAIResponse = action({
  args: {
    userMessage: v.string(),
    systemPrompt: v.string(),
    contextData: v.optional(v.string()),
    modelName: v.optional(v.string()),
    maxTokens: v.optional(v.number()),
  },
  handler: async (ctx, args): Promise<{ response: string }> => {
    const model = args.modelName || "gpt-4o"; // gpt-4o, gpt-4o-mini, etc.

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

// Query: Get Conversation History
export const getConversationHistory = internalAction({
  args: {
    userId: v.string(),
    limit: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    const conversations = await ctx.runQuery(internal.voice.getConversations, {
      userId: args.userId,
      limit: args.limit || 10,
    });
    return conversations;
  },
});
```

---

### Phase 3: React Native Hooks

#### Hook 1: Audio Recording

**File:** `hooks/useVoiceRecording.ts`

```typescript
import { useState, useEffect } from "react";
import { Audio, AudioModule } from "expo-audio";

export const useVoiceRecording = (maxDurationMs: number = 300000) => {
  const [recording, setRecording] = useState<Audio.Recording | null>(null);
  const [isRecording, setIsRecording] = useState(false);
  const [durationMs, setDurationMs] = useState(0);
  const [hasPermission, setHasPermission] = useState<boolean | null>(null);

  const isMaxDuration = durationMs >= maxDurationMs;

  // Request permissions on mount
  useEffect(() => {
    (async () => {
      const { granted } = await Audio.requestPermissionsAsync();
      setHasPermission(granted);
    })();
  }, []);

  // Update duration during recording
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isRecording && recording) {
      interval = setInterval(async () => {
        const status = await recording.getStatusAsync();
        if (status.isRecording) {
          setDurationMs(status.durationMillis);
        }
      }, 100);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isRecording, recording]);

  const startVoiceRecording = async () => {
    if (!hasPermission) {
      const { granted } = await Audio.requestPermissionsAsync();
      if (!granted) {
        throw new Error("Microphone permission denied");
      }
      setHasPermission(true);
    }

    try {
      // Set audio mode for recording
      await AudioModule.setAudioModeAsync({
        allowsRecording: true,
        playsInSilentMode: true,
      });

      // Start recording
      const { recording: newRecording } = await Audio.Recording.createAsync(
        Audio.RecordingPresets.HIGH_QUALITY
      );

      setRecording(newRecording);
      setIsRecording(true);
      setDurationMs(0);
    } catch (error) {
      console.error("Failed to start recording:", error);
      throw error;
    }
  };

  const stopVoiceRecording = async (): Promise<{ fileUri: string }> => {
    if (!recording) {
      throw new Error("No active recording");
    }

    try {
      await recording.stopAndUnloadAsync();
      const uri = recording.getURI();
      setIsRecording(false);
      setRecording(null);

      if (!uri) {
        throw new Error("Recording URI is null");
      }

      return { fileUri: uri };
    } catch (error) {
      console.error("Failed to stop recording:", error);
      throw error;
    }
  };

  const reset = () => {
    setRecording(null);
    setIsRecording(false);
    setDurationMs(0);
  };

  return {
    startVoiceRecording,
    stopVoiceRecording,
    isRecording,
    durationMs,
    isMaxDuration,
    hasPermission,
    reset,
  };
};
```

#### Hook 2: Voice Processing

**File:** `hooks/useVoiceProcessing.ts`

```typescript
import { useState } from "react";
import { useAction } from "convex/react";
import { api } from "@/convex/_generated/api";
import * as FileSystem from "expo-file-system";

export const useVoiceProcessing = () => {
  const [isProcessing, setIsProcessing] = useState(false);
  const [transcription, setTranscription] = useState("");
  const [response, setResponse] = useState("");
  const [audioBase64, setAudioBase64] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const processConversation = useAction(api.voice.processVoiceConversation);

  const submitRecording = async (
    audioUri: string,
    userId: string,
    systemPrompt: string,
    contextData?: string,
    voicePreference?: string
  ) => {
    setIsProcessing(true);
    setError(null);

    try {
      // Auto-detect audio format from file extension
      let format = "mp4"; // Default for .m4a
      if (audioUri.toLowerCase().endsWith(".mp3")) format = "mp3";
      else if (audioUri.toLowerCase().endsWith(".wav")) format = "wav";
      else if (audioUri.toLowerCase().endsWith(".m4a")) format = "mp4";

      // Read audio file and convert to base64
      const audioBase64 = await FileSystem.readAsStringAsync(audioUri, {
        encoding: FileSystem.EncodingType.Base64,
      });

      // Process through Convex
      const result = await processConversation({
        userId,
        audioBase64,
        audioFormat: format,
        systemPrompt,
        contextData,
        voicePreference,
      });

      setTranscription(result.transcription);
      setResponse(result.response);
      setAudioBase64(result.audioBase64);
    } catch (err: any) {
      console.error("Error processing voice conversation:", err);
      setError(err.message || "Failed to process voice conversation");
      throw err;
    } finally {
      setIsProcessing(false);
    }
  };

  const reset = () => {
    setTranscription("");
    setResponse("");
    setAudioBase64(null);
    setError(null);
  };

  return {
    submitRecording,
    isProcessing,
    transcription,
    response,
    audioBase64,
    error,
    reset,
  };
};
```

#### Hook 3: Audio Playback

**File:** `hooks/useAudioPlayback.ts`

```typescript
import { useState, useEffect } from "react";
import { useAudioPlayer, AudioModule } from "expo-audio";

export const useAudioPlayback = () => {
  const player = useAudioPlayer();
  const [isPlaying, setIsPlaying] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // Monitor playback status
  useEffect(() => {
    if (player) {
      setIsPlaying(player.playing);
    }
  }, [player.playing]);

  const playAudioFromBase64 = async (base64: string) => {
    try {
      setIsLoading(true);

      // Set audio mode for playback
      await AudioModule.setAudioModeAsync({
        allowsRecording: false,
        playsInSilentMode: true,
      });

      // Convert base64 to data URI
      const audioUri = `data:audio/mp3;base64,${base64}`;

      // Replace source and play
      player.replace({ uri: audioUri });
      player.play();

      setIsPlaying(true);
    } catch (error) {
      console.error("Error playing audio:", error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const pauseAudio = () => {
    if (player) {
      player.pause();
      setIsPlaying(false);
    }
  };

  const resumeAudio = () => {
    if (player) {
      player.play();
      setIsPlaying(true);
    }
  };

  const stopAudio = () => {
    if (player) {
      player.pause();
      player.seekTo(0);
      setIsPlaying(false);
    }
  };

  return {
    playAudioFromBase64,
    pauseAudio,
    resumeAudio,
    stopAudio,
    isPlaying,
    isLoading,
  };
};
```

---

### Phase 4: UI Component

**File:** `components/VoiceInterface.tsx`

```typescript
import React, { useEffect } from "react";
import { View, Text, TouchableOpacity, StyleSheet, Alert } from "react-native";
import { Mic, StopCircle, Play, Pause } from "lucide-react-native";
import { useVoiceRecording } from "@/hooks/useVoiceRecording";
import { useVoiceProcessing } from "@/hooks/useVoiceProcessing";
import { useAudioPlayback } from "@/hooks/useAudioPlayback";
import { useAuth } from "@clerk/clerk-expo";

interface VoiceInterfaceProps {
  systemPrompt: string;
  contextData?: string;
  voicePreference?: string;
  maxRecordingSeconds?: number;
  onTranscriptionComplete?: (text: string) => void;
  onResponseComplete?: (text: string) => void;
}

export const VoiceInterface: React.FC<VoiceInterfaceProps> = ({
  systemPrompt,
  contextData,
  voicePreference = "nova",
  maxRecordingSeconds = 300,
  onTranscriptionComplete,
  onResponseComplete,
}) => {
  const { userId } = useAuth();

  const {
    startVoiceRecording,
    stopVoiceRecording,
    isRecording,
    durationMs,
    isMaxDuration,
    hasPermission,
  } = useVoiceRecording(maxRecordingSeconds * 1000);

  const {
    submitRecording,
    isProcessing,
    transcription,
    response,
    audioBase64,
    error,
  } = useVoiceProcessing();

  const {
    playAudioFromBase64,
    pauseAudio,
    resumeAudio,
    isPlaying,
  } = useAudioPlayback();

  // Auto-stop at max duration
  useEffect(() => {
    if (isMaxDuration && isRecording) {
      handleStopRecording();
    }
  }, [isMaxDuration]);

  // Auto-play response when ready
  useEffect(() => {
    if (audioBase64) {
      playAudioFromBase64(audioBase64);
    }
  }, [audioBase64]);

  // Callbacks
  useEffect(() => {
    if (transcription && onTranscriptionComplete) {
      onTranscriptionComplete(transcription);
    }
  }, [transcription]);

  useEffect(() => {
    if (response && onResponseComplete) {
      onResponseComplete(response);
    }
  }, [response]);

  const handleStartRecording = async () => {
    if (!hasPermission) {
      Alert.alert("Permission Required", "Microphone access is required for voice recording.");
      return;
    }
    try {
      await startVoiceRecording();
    } catch (err: any) {
      Alert.alert("Recording Error", err.message);
    }
  };

  const handleStopRecording = async () => {
    if (!userId) {
      Alert.alert("Authentication Error", "You must be signed in to use voice features.");
      return;
    }

    try {
      const recording = await stopVoiceRecording();
      await submitRecording(
        recording.fileUri,
        userId,
        systemPrompt,
        contextData,
        voicePreference
      );
    } catch (err: any) {
      Alert.alert("Processing Error", err.message || "Failed to process recording");
    }
  };

  const formatTime = (ms: number) => {
    const totalSeconds = Math.floor(ms / 1000);
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;
    return `${minutes}:${seconds.toString().padStart(2, "0")}`;
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Voice Conversation</Text>

      {/* Recording Controls */}
      {!isRecording && !isProcessing && !response && (
        <TouchableOpacity style={styles.recordButton} onPress={handleStartRecording}>
          <Mic size={32} color="#fff" />
          <Text style={styles.buttonText}>Start Speaking</Text>
        </TouchableOpacity>
      )}

      {/* Recording in Progress */}
      {isRecording && (
        <View style={styles.recordingContainer}>
          <View style={styles.pulsingCircle} />
          <Text style={styles.timer}>
            {formatTime(durationMs)} / {formatTime(maxRecordingSeconds * 1000)}
          </Text>
          <TouchableOpacity style={styles.stopButton} onPress={handleStopRecording}>
            <StopCircle size={32} color="#fff" />
            <Text style={styles.buttonText}>Stop</Text>
          </TouchableOpacity>
        </View>
      )}

      {/* Processing */}
      {isProcessing && (
        <View style={styles.processingContainer}>
          <Text style={styles.statusText}>Processing your message...</Text>
        </View>
      )}

      {/* Transcription Display */}
      {transcription && (
        <View style={styles.transcriptionContainer}>
          <Text style={styles.label}>You said:</Text>
          <Text style={styles.transcriptionText}>{transcription}</Text>
        </View>
      )}

      {/* Response Display */}
      {response && (
        <View style={styles.responseContainer}>
          <Text style={styles.label}>AI Response:</Text>
          <Text style={styles.responseText}>{response}</Text>

          {/* Playback Controls */}
          <View style={styles.playbackControls}>
            {!isPlaying ? (
              <TouchableOpacity onPress={resumeAudio}>
                <Play size={24} color="#10B981" />
              </TouchableOpacity>
            ) : (
              <TouchableOpacity onPress={pauseAudio}>
                <Pause size={24} color="#10B981" />
              </TouchableOpacity>
            )}
          </View>
        </View>
      )}

      {/* Error Display */}
      {error && (
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>{error}</Text>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 20,
    backgroundColor: "#1F2937",
    borderRadius: 12,
    margin: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#fff",
    textAlign: "center",
    marginBottom: 20,
  },
  recordButton: {
    backgroundColor: "#10B981",
    borderRadius: 50,
    padding: 20,
    alignItems: "center",
    justifyContent: "center",
  },
  stopButton: {
    backgroundColor: "#EF4444",
    borderRadius: 50,
    padding: 20,
    alignItems: "center",
    justifyContent: "center",
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
    marginTop: 8,
  },
  recordingContainer: {
    alignItems: "center",
    gap: 16,
  },
  pulsingCircle: {
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: "#EF4444",
  },
  timer: {
    fontSize: 32,
    color: "#fff",
    fontWeight: "bold",
  },
  processingContainer: {
    padding: 20,
    alignItems: "center",
  },
  statusText: {
    color: "#9CA3AF",
    fontSize: 16,
    fontStyle: "italic",
  },
  transcriptionContainer: {
    marginTop: 20,
    padding: 16,
    backgroundColor: "#374151",
    borderRadius: 8,
  },
  responseContainer: {
    marginTop: 20,
    padding: 16,
    backgroundColor: "#10B981",
    borderRadius: 8,
  },
  label: {
    fontSize: 12,
    color: "#9CA3AF",
    marginBottom: 8,
    textTransform: "uppercase",
  },
  transcriptionText: {
    color: "#fff",
    fontSize: 14,
    lineHeight: 20,
  },
  responseText: {
    color: "#fff",
    fontSize: 14,
    lineHeight: 20,
  },
  playbackControls: {
    marginTop: 12,
    alignItems: "center",
  },
  errorContainer: {
    marginTop: 20,
    padding: 16,
    backgroundColor: "#EF4444",
    borderRadius: 8,
  },
  errorText: {
    color: "#fff",
    fontSize: 14,
  },
});
```

---

## Usage Example

**In any screen:**

```typescript
import { VoiceInterface } from "@/components/VoiceInterface";

export default function ChatScreen() {
  const systemPrompt = "You are a helpful AI assistant. Provide concise, clear responses.";
  const contextData = "User is asking about product features.";

  return (
    <VoiceInterface
      systemPrompt={systemPrompt}
      contextData={contextData}
      voicePreference="nova"
      maxRecordingSeconds={300}
      onTranscriptionComplete={(text) => console.log("Transcription:", text)}
      onResponseComplete={(text) => console.log("Response:", text)}
    />
  );
}
```

---

## Critical Implementation Notes

### ✅ ALWAYS Do This

1. **OpenAI API Key**: ONLY in Convex environment variables, NEVER in frontend `.env`
2. **Audio Format Detection**: Auto-detect from file extension (`.mp3`, `.wav`, `.m4a`)
3. **Permissions**: Request microphone permissions before recording
4. **Audio Mode Management**:
   - Recording: `allowsRecording: true`
   - Playback: `allowsRecording: false` (switches to loudspeaker)
5. **User Authentication**: Always verify `userId` exists before processing
6. **Type Safety**: Add `: Promise<ReturnType>` to all Convex action handlers
7. **Error Handling**: Use try/catch and show user-friendly alerts
8. **Base64 Conversion**: Use `FileSystem.readAsStringAsync()` with `Base64` encoding

### ❌ NEVER Do This

1. **DON'T** expose OpenAI API keys in frontend code
2. **DON'T** use `Buffer` in Convex - not available in runtime
3. **DON'T** store audio base64 in database - exceeds size limits
4. **DON'T** forget to unload audio players/recorders on unmount
5. **DON'T** hardcode model names - make them configurable
6. **DON'T** skip permission checks - will crash on iOS
7. **DON'T** use incorrect OpenAI model names (e.g., `gpt-5` doesn't exist yet - use `gpt-4o`)

---

## Model Options

### Whisper STT
- `whisper-1` - Only model available, $0.006/minute

### GPT Models (via Vercel AI SDK)
- `gpt-4o` - Most capable, multimodal
- `gpt-4o-mini` - Faster, cheaper
- `gpt-4-turbo` - Previous generation
- `gpt-3.5-turbo` - Fastest, cheapest

### TTS Voices
- `alloy` - Neutral, balanced
- `echo` - Male, warm
- `fable` - British accent
- `onyx` - Deep, authoritative
- `nova` - Female, friendly (default)
- `shimmer` - Soft, gentle

---

## Cost Estimation

**Per 5-minute conversation:**
- Whisper STT: $0.006/min × 5 = **$0.03**
- GPT-4o: ~500 tokens × $0.005/1K = **$0.0025**
- TTS: ~200 chars × $15/1M chars = **$0.003**
- **Total: ~$0.035 per conversation**

---

## Testing Checklist

- [ ] Microphone permissions requested and handled
- [ ] Recording starts/stops correctly
- [ ] Max duration auto-stop works
- [ ] Audio file created with correct format
- [ ] Whisper transcription returns accurate text
- [ ] AI response is relevant and appropriate
- [ ] TTS audio plays correctly
- [ ] Playback controls work (play/pause)
- [ ] Conversation saved to database
- [ ] Error states handled gracefully
- [ ] Works on both iOS and Android
- [ ] Audio quality is acceptable
- [ ] Response time is reasonable (< 30 seconds)

---

## Common Errors & Solutions

### Error: "Buffer is not defined"
**Solution:** Don't use `Buffer` in Convex - use `Uint8Array` or move buffer operations to client

### Error: "Recording failed to start"
**Solution:** Check microphone permissions and audio mode configuration

### Error: "Invalid audio format"
**Solution:** Verify file extension matches actual audio format (use `expo-audio` high quality preset)

### Error: "API key not found"
**Solution:** Set in Convex: `npx convex env set OPENAI_API_KEY sk-...`

### Error: "Model not found"
**Solution:** Use correct model names - `gpt-4o`, not `gpt-5`

---

## Advanced Features

### Streaming Responses (Real-time UI Update)
```typescript
// In Convex action
const result = streamText({
  model: openaiProvider("gpt-4o"),
  prompt: userMessage,
});

// Stream to frontend via SSE or WebSockets
for await (const textPart of result.textStream) {
  // Send chunk to frontend
  await sendChunk(textPart);
}
```

### Conversation History
```typescript
// Query past conversations
const history = await ctx.db
  .query("voiceConversations")
  .withIndex("by_user", (q) => q.eq("userId", userId))
  .order("desc")
  .take(10);
```

### Custom Voice Selection UI
```typescript
const VOICES = [
  { id: "alloy", name: "Alloy", description: "Neutral" },
  { id: "nova", name: "Nova", description: "Friendly" },
  // ... more voices
];

// Let user select in settings
```

---

## References

- [OpenAI Whisper API](https://platform.openai.com/docs/guides/speech-to-text)
- [OpenAI TTS API](https://platform.openai.com/docs/guides/text-to-speech)
- [Vercel AI SDK](https://sdk.vercel.ai/docs)
- [expo-audio Documentation](https://docs.expo.dev/versions/latest/sdk/audio/)
- [Convex Actions](https://docs.convex.dev/functions/actions)
