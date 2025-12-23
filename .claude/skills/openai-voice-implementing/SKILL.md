---
name: OpenAI Voice Implementing
description: Implements complete voice conversation features using OpenAI Whisper (STT), GPT models, and TTS with Vercel AI SDK for Expo + Convex apps. Use when adding voice recording, transcription, AI responses, or text-to-speech to any React Native application.
---

# OpenAI Voice Implementation

Builds production-ready voice conversation systems with speech-to-text, AI responses, and text-to-speech capabilities.

## When to Use This Skill

Use this skill when you need to:
- Add voice recording with transcription
- Implement speech-to-text using OpenAI Whisper
- Build AI chat with voice input/output
- Add text-to-speech capabilities
- Create voice assistants or conversational AI features

## What This Skill Provides

✅ Complete audio recording system with permissions
✅ OpenAI Whisper integration for STT
✅ Vercel AI SDK integration for AI responses
✅ OpenAI TTS for voice output
✅ Audio playback controls
✅ Conversation history persistence
✅ Production-ready error handling

## Implementation Workflow

### Phase 1: Setup & Dependencies

**Install packages:**
```bash
npx expo install expo-audio expo-file-system
npm install ai @ai-sdk/openai openai
npm install lottie-react-native expo-linear-gradient
```

**Configure environment:**
```bash
npx convex env set OPENAI_API_KEY sk-proj-your-key-here
```

**Update app.json:**
```json
{
  "expo": {
    "plugins": [
      [
        "expo-audio",
        {
          "microphonePermission": "Allow $(PRODUCT_NAME) to access your microphone."
        }
      ]
    ]
  }
}
```

---

### Phase 2: Backend Implementation

**Create database schema** in `convex/schema.ts`:
- Refer to `resources/schema.ts` for the voiceConversations table

**Create backend functions** in `convex/voice.ts`:
- Refer to `resources/voice.ts` for complete implementation
- Includes: transcribeAudio, generateAIResponse, generateSpeech, processVoiceConversation
- All functions are type-safe with proper return types

---

### Phase 3: Frontend Hooks

**Create three custom hooks:**

1. `hooks/useVoiceRecording.ts` - Audio recording management
   - Refer to `resources/useVoiceRecording.ts`
   - Handles permissions, recording, duration tracking

2. `hooks/useVoiceProcessing.ts` - Voice conversation processing
   - Refer to `resources/useVoiceProcessing.ts`
   - Manages transcription, AI response, audio generation

3. `hooks/useAudioPlayback.ts` - Audio playback controls
   - Refer to `resources/useAudioPlayback.ts`
   - Play, pause, resume, stop functionality

---

### Phase 4: UI Component

**Create `components/VoiceInterface.tsx`:**
- Refer to `resources/VoiceInterface.tsx` for complete component
- Includes recording controls, transcription display, response playback
- Fully styled with dark theme and animations

---

### Phase 5: Integration

**Use in any screen:**
```typescript
import { VoiceInterface } from "@/components/VoiceInterface";

export default function YourScreen() {
  return (
    <VoiceInterface
      systemPrompt="You are a helpful assistant."
      contextData="Optional context for AI"
      voicePreference="nova"
      maxRecordingSeconds={300}
      onTranscriptionComplete={(text) => console.log(text)}
      onResponseComplete={(text) => console.log(text)}
    />
  );
}
```

---

## Critical Implementation Rules

### ✅ ALWAYS Do This

1. **API Keys**: ONLY in Convex environment, NEVER in frontend
2. **Audio Format**: Auto-detect from file extension (.mp3, .wav, .m4a)
3. **Permissions**: Request microphone access before recording
4. **Audio Mode**: Toggle between recording (earpiece) and playback (loudspeaker)
5. **Type Safety**: Add `: Promise<ReturnType>` to all Convex handlers
6. **User Auth**: Verify userId exists before processing
7. **Base64**: Use `FileSystem.readAsStringAsync()` with Base64 encoding

### ❌ NEVER Do This

1. DON'T expose OpenAI keys in frontend
2. DON'T use `Buffer` in Convex (not available)
3. DON'T store audio base64 in database (size limits)
4. DON'T forget to unload audio on unmount
5. DON'T hardcode model names (make configurable)
6. DON'T skip permission checks (iOS crash)
7. DON'T use incorrect model names (verify OpenAI docs)

---

## Model Options Reference

**Whisper STT:**
- `whisper-1` - $0.006/minute

**GPT Models (via Vercel AI SDK):**
- `gpt-4o` - Most capable
- `gpt-4o-mini` - Faster, cheaper
- `gpt-3.5-turbo` - Fastest, cheapest

**TTS Voices:**
- `alloy`, `echo`, `fable`, `onyx`, `nova`, `shimmer`

**Cost per 5-min conversation:** ~$0.035

---

## Testing Checklist

- [ ] Microphone permissions work
- [ ] Recording starts/stops correctly
- [ ] Max duration auto-stop works
- [ ] Transcription is accurate
- [ ] AI response is relevant
- [ ] TTS audio plays correctly
- [ ] Play/pause controls work
- [ ] Conversation saved to database
- [ ] Errors handled gracefully
- [ ] Works on iOS and Android

---

## Common Errors & Fixes

**"Buffer is not defined"**
→ Don't use Buffer in Convex, use Uint8Array

**"Recording failed to start"**
→ Check permissions and audio mode

**"Invalid audio format"**
→ Verify file extension matches format

**"API key not found"**
→ Set in Convex: `npx convex env set OPENAI_API_KEY sk-...`

**"Model not found"**
→ Use correct names: `gpt-4o`, not `gpt-5`

---

## Resources

All implementation files are in the `resources/` folder:
- `schema.ts` - Database schema
- `voice.ts` - Backend actions
- `useVoiceRecording.ts` - Recording hook
- `useVoiceProcessing.ts` - Processing hook
- `useAudioPlayback.ts` - Playback hook
- `VoiceInterface.tsx` - UI component
- `implementation-guide.md` - Detailed guide
- `troubleshooting.md` - Common issues

---

## References

- [OpenAI Whisper API](https://platform.openai.com/docs/guides/speech-to-text)
- [OpenAI TTS API](https://platform.openai.com/docs/guides/text-to-speech)
- [Vercel AI SDK](https://sdk.vercel.ai/docs)
- [expo-audio](https://docs.expo.dev/versions/latest/sdk/audio/)
