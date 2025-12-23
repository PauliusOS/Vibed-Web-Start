# OpenAI Voice Implementation Skill

Complete skill for implementing voice conversation features using OpenAI Whisper, GPT, and TTS with Vercel AI SDK in Expo + Convex applications.

## Quick Start

1. **Invoke this skill** when you need voice features in your app
2. **Follow SKILL.md** for the implementation workflow
3. **Copy code from resources/** folder
4. **Test using the checklist** in implementation-guide.md
5. **Reference troubleshooting.md** if you encounter issues

## What's Included

### Main File
- **SKILL.md** - Primary workflow guide with all steps

### Resources Folder
- **schema.ts** - Database schema for voiceConversations table
- **voice.ts** - Complete Convex backend actions (STT, AI, TTS)
- **useVoiceRecording.ts** - Audio recording hook
- **useVoiceProcessing.ts** - Voice processing hook
- **useAudioPlayback.ts** - Audio playback hook
- **VoiceInterface.tsx** - Production-ready UI component
- **implementation-guide.md** - Detailed step-by-step guide
- **troubleshooting.md** - Common errors and solutions

## Features

✅ Audio recording with permissions
✅ OpenAI Whisper speech-to-text
✅ Vercel AI SDK for GPT responses
✅ OpenAI TTS with 6 voice options
✅ Audio playback controls
✅ Conversation history persistence
✅ Complete error handling
✅ iOS and Android support

## Implementation Time

- **Phase 1 (Setup):** 10 minutes
- **Phase 2 (Schema):** 5 minutes
- **Phase 3 (Backend):** 20 minutes
- **Phase 4 (Hooks):** 15 minutes
- **Phase 5 (Component):** 20 minutes
- **Phase 6 (Integration):** 10 minutes
- **Phase 7 (Testing):** 15 minutes

**Total:** ~90 minutes for complete implementation

## Cost

Approximately **$0.035 per 5-minute conversation**:
- Whisper STT: $0.015
- GPT-4o: $0.02
- TTS: $0.003

## Usage Example

```typescript
import { VoiceInterface } from "@/components/VoiceInterface";

export default function MyScreen() {
  return (
    <VoiceInterface
      systemPrompt="You are a helpful assistant."
      voicePreference="nova"
      maxRecordingSeconds={300}
    />
  );
}
```

## When to Use This Skill

Use this skill when implementing:
- Voice chat features
- Speech-to-text transcription
- AI voice assistants
- Text-to-speech responses
- Voice-enabled note taking
- Conversational AI interfaces

## Support

- Check **troubleshooting.md** for common issues
- Review **implementation-guide.md** for detailed steps
- All code is production-ready and type-safe

## Model Options

**STT:** whisper-1
**AI:** gpt-4o, gpt-4o-mini, gpt-3.5-turbo
**TTS:** alloy, echo, fable, onyx, nova, shimmer

## Requirements

- Expo SDK (latest)
- Convex backend
- Clerk authentication
- OpenAI API key
