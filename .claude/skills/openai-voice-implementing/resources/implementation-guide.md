# Complete Implementation Guide

## Step-by-Step Implementation

### Prerequisites

- Expo app with Convex backend
- Clerk authentication configured
- OpenAI API key

---

## Phase 1: Project Setup (10 minutes)

### 1. Install Dependencies

```bash
# Audio libraries
npx expo install expo-audio expo-file-system

# AI SDKs
npm install ai @ai-sdk/openai openai

# UI (optional but recommended)
npm install lottie-react-native expo-linear-gradient
```

### 2. Configure Environment

```bash
# Set OpenAI key in Convex (NEVER in frontend .env)
npx convex env set OPENAI_API_KEY sk-proj-your-actual-key-here
```

### 3. Update app.json

```json
{
  "expo": {
    "name": "Your App",
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

### 4. Rebuild After Adding Plugins

```bash
# For development
npx expo prebuild --clean

# Or restart dev server
npx expo start --clear
```

---

## Phase 2: Database Schema (5 minutes)

### Update `convex/schema.ts`

```typescript
import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  // ... your existing tables (users, etc.)

  voiceConversations: defineTable({
    userId: v.string(),
    transcription: v.string(),
    aiResponse: v.string(),
    audioResponseUrl: v.optional(v.string()),
    contextData: v.optional(v.string()),
    createdAt: v.number(),
  })
    .index("by_user", ["userId"])
    .index("by_created_at", ["createdAt"]),
});
```

### Run Schema Migration

```bash
# Convex automatically applies schema changes
# Just restart dev if needed
npx convex dev
```

---

## Phase 3: Backend Actions (20 minutes)

### Create `convex/voice.ts`

Copy the complete file from `resources/voice.ts`. This includes:

- `transcribeAudio` - Whisper STT action
- `generateAIResponse` - GPT response action
- `generateSpeech` - TTS action
- `processVoiceConversation` - Main workflow action
- `saveConversation` - Internal mutation

**Key points:**
- All actions return typed Promises
- Uses OpenAI SDK for Whisper and TTS
- Uses Vercel AI SDK for GPT responses
- Streams text for better UX
- Saves conversation history

### Verify Backend

```bash
# Check for errors in Convex dashboard
npx convex dev

# Test action manually in Convex dashboard
# Functions > voice > processVoiceConversation
```

---

## Phase 4: Custom Hooks (15 minutes)

### 1. Create `hooks/useVoiceRecording.ts`

Copy from `resources/useVoiceRecording.ts`

**Features:**
- Requests microphone permissions
- Manages recording state
- Tracks duration with auto-update
- Enforces max duration
- Proper cleanup

### 2. Create `hooks/useVoiceProcessing.ts`

Copy from `resources/useVoiceProcessing.ts`

**Features:**
- Auto-detects audio format
- Converts file to base64
- Calls Convex action
- Manages processing state
- Error handling

### 3. Create `hooks/useAudioPlayback.ts`

Copy from `resources/useAudioPlayback.ts`

**Features:**
- Plays base64 audio
- Play/pause controls
- Proper audio mode management
- Loading states

---

## Phase 5: UI Component (20 minutes)

### Create `components/VoiceInterface.tsx`

Copy from `resources/VoiceInterface.tsx`

**Features:**
- Record button with permission check
- Recording timer display
- Processing state with loading
- Transcription display
- Response with audio playback
- Error handling with alerts
- Reset functionality

**Customization:**
- Adjust colors in StyleSheet
- Change button icons (using lucide-react-native)
- Modify text labels
- Add custom animations

---

## Phase 6: Integration (10 minutes)

### Use in Any Screen

```typescript
// Example: app/(tabs)/chat.tsx

import { VoiceInterface } from "@/components/VoiceInterface";

export default function ChatScreen() {
  return (
    <View style={styles.container}>
      <VoiceInterface
        systemPrompt="You are a helpful AI assistant. Provide clear, concise responses."
        contextData={`User's name: ${userName}`}
        voicePreference="nova"
        maxRecordingSeconds={300}
        onTranscriptionComplete={(text) => {
          console.log("User said:", text);
          // Optional: Add to chat history
        }}
        onResponseComplete={(text) => {
          console.log("AI responded:", text);
          // Optional: Add to chat history
        }}
      />
    </View>
  );
}
```

### Props Reference

| Prop | Type | Required | Default | Description |
|------|------|----------|---------|-------------|
| `systemPrompt` | string | Yes | - | AI's system instructions |
| `contextData` | string | No | - | Additional context for AI |
| `voicePreference` | string | No | "nova" | TTS voice (alloy, echo, fable, onyx, nova, shimmer) |
| `maxRecordingSeconds` | number | No | 300 | Max recording time in seconds |
| `onTranscriptionComplete` | function | No | - | Callback with transcription text |
| `onResponseComplete` | function | No | - | Callback with AI response text |

---

## Phase 7: Testing (15 minutes)

### Manual Testing Checklist

**Recording:**
- [ ] Permission dialog appears on first use
- [ ] Permission denial handled gracefully
- [ ] Recording starts when button pressed
- [ ] Timer updates every second
- [ ] Recording stops when button pressed
- [ ] Recording auto-stops at max duration

**Processing:**
- [ ] Loading state shows while processing
- [ ] Processing completes within 30 seconds
- [ ] Error messages display if API fails

**Transcription:**
- [ ] Transcription text displays correctly
- [ ] Transcription is accurate to spoken words
- [ ] Works with different accents/languages

**AI Response:**
- [ ] Response is relevant to question
- [ ] Response displays in UI
- [ ] Response follows system prompt

**Audio Playback:**
- [ ] Audio plays automatically
- [ ] Play/pause buttons work
- [ ] Audio plays through speaker (not earpiece)
- [ ] Audio quality is clear

**General:**
- [ ] Works on iOS
- [ ] Works on Android
- [ ] Errors show user-friendly messages
- [ ] Reset button clears all states
- [ ] Can record multiple times in a row

### Automated Testing (Optional)

```typescript
// Example test with Jest + React Native Testing Library
import { render, fireEvent, waitFor } from '@testing-library/react-native';
import { VoiceInterface } from '@/components/VoiceInterface';

test('voice interface renders and handles recording', async () => {
  const { getByText } = render(
    <VoiceInterface systemPrompt="Test prompt" />
  );

  const recordButton = getByText('Start Speaking');
  expect(recordButton).toBeTruthy();

  fireEvent.press(recordButton);

  await waitFor(() => {
    expect(getByText(/Stop/)).toBeTruthy();
  });
});
```

---

## Phase 8: Optimization (Optional)

### Cost Optimization

**Use cheaper models:**
```typescript
// In voice.ts
const model = args.modelName || "gpt-4o-mini"; // Instead of gpt-4o
```

**Reduce token usage:**
```typescript
// In voice.ts
maxTokens: args.maxTokens || 150, // Instead of 500
```

**Use faster TTS:**
```typescript
// In voice.ts
const model = args.model || "tts-1"; // Instead of tts-1-hd
```

### Performance Optimization

**Add timeouts:**
```typescript
// In useVoiceProcessing.ts
const timeoutPromise = new Promise((_, reject) =>
  setTimeout(() => reject(new Error("Request timeout")), 30000)
);

const result = await Promise.race([
  processConversation(args),
  timeoutPromise,
]);
```

**Cache responses (optional):**
```typescript
// Create a query to check for recent similar conversations
export const findSimilarConversation = query({
  args: { transcription: v.string(), userId: v.string() },
  handler: async (ctx, args) => {
    // Find recent conversation with similar transcription
    const recent = await ctx.db
      .query("voiceConversations")
      .withIndex("by_user", (q) => q.eq("userId", args.userId))
      .order("desc")
      .first();

    if (recent && isSimilar(recent.transcription, args.transcription)) {
      return recent;
    }
    return null;
  },
});
```

---

## Advanced Features

### 1. Conversation History Page

```typescript
// hooks/useConversationHistory.ts
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";

export const useConversationHistory = (userId: string, limit = 10) => {
  const conversations = useQuery(api.voice.getConversationHistory, {
    userId,
    limit,
  });

  return { conversations };
};

// Add to voice.ts
export const getConversationHistory = query({
  args: { userId: v.string(), limit: v.optional(v.number()) },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("voiceConversations")
      .withIndex("by_user", (q) => q.eq("userId", args.userId))
      .order("desc")
      .take(args.limit || 10);
  },
});
```

### 2. Voice Selection UI

```typescript
// components/VoiceSelector.tsx
const VOICES = [
  { id: "alloy", name: "Alloy", description: "Neutral and balanced" },
  { id: "echo", name: "Echo", description: "Male, warm" },
  { id: "fable", name: "Fable", description: "British accent" },
  { id: "onyx", name: "Onyx", description: "Deep, authoritative" },
  { id: "nova", name: "Nova", description: "Female, friendly" },
  { id: "shimmer", name: "Shimmer", description: "Soft, gentle" },
];

export const VoiceSelector = ({ selected, onSelect }) => {
  return (
    <View>
      {VOICES.map((voice) => (
        <TouchableOpacity
          key={voice.id}
          onPress={() => onSelect(voice.id)}
          style={selected === voice.id ? styles.selected : styles.option}
        >
          <Text>{voice.name}</Text>
          <Text style={styles.description}>{voice.description}</Text>
        </TouchableOpacity>
      ))}
    </View>
  );
};
```

### 3. Streaming Responses (Real-time UI)

```typescript
// For future implementation - requires WebSocket or SSE
// This is more complex and requires additional setup
```

---

## Production Checklist

Before deploying to production:

- [ ] OpenAI API key set in Convex production environment
- [ ] Tested on physical iOS device
- [ ] Tested on physical Android device
- [ ] Error handling covers all edge cases
- [ ] User feedback messages are clear
- [ ] Loading states prevent multiple requests
- [ ] Audio cleanup on component unmount
- [ ] Rate limiting on backend (if needed)
- [ ] Cost monitoring dashboard set up
- [ ] Analytics tracking (optional)
- [ ] Terms of service updated (if collecting voice data)
- [ ] Privacy policy updated (voice data handling)

---

## Deployment

### Deploy Convex Backend

```bash
npx convex deploy
```

### Build Expo App

```bash
# iOS
eas build --platform ios

# Android
eas build --platform android
```

---

## Monitoring & Maintenance

**Track costs:**
- OpenAI Usage Dashboard: https://platform.openai.com/usage
- Monitor per-conversation costs
- Set billing limits

**Monitor performance:**
- Convex logs for action duration
- User feedback on audio quality
- Transcription accuracy reports

**Regular updates:**
- Update OpenAI SDK when new versions release
- Update Expo SDK every few months
- Test on new OS versions

---

## Support Resources

- [OpenAI API Documentation](https://platform.openai.com/docs)
- [Vercel AI SDK Docs](https://sdk.vercel.ai/docs)
- [Expo Audio Docs](https://docs.expo.dev/versions/latest/sdk/audio/)
- [Convex Docs](https://docs.convex.dev)

For issues with this implementation, check `troubleshooting.md`.
