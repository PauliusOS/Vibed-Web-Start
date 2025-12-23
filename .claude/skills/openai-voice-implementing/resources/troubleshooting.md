# Troubleshooting Guide

## Common Errors and Solutions

### Backend Errors

#### Error: "Buffer is not defined"
**Cause:** Using Node.js `Buffer` in Convex runtime
**Solution:** Convex doesn't support Buffer. Use `Uint8Array` instead or move buffer operations to client-side

```typescript
// ❌ Don't do this in Convex
const buffer = Buffer.from(base64, 'base64');

// ✅ Do this instead (if needed)
const uint8Array = new Uint8Array(arrayBuffer);
```

#### Error: "API key not found" or "OPENAI_API_KEY is undefined"
**Cause:** Environment variable not set in Convex
**Solution:** Set the key in Convex environment (not in frontend .env)

```bash
npx convex env set OPENAI_API_KEY sk-proj-your-key-here
```

#### Error: "Model 'gpt-5' not found"
**Cause:** Using non-existent model name
**Solution:** Use valid OpenAI model names

```typescript
// ✅ Valid models
"gpt-4o"
"gpt-4o-mini"
"gpt-4-turbo"
"gpt-3.5-turbo"
```

#### Error: "Value is too large (X MiB > maximum size 1 MiB)"
**Cause:** Trying to store large base64 audio in database
**Solution:** Never store audio base64 in database. Only pass it between actions, or use Convex file storage

```typescript
// ❌ Don't do this
await ctx.db.insert("conversations", {
  audioBase64: largeBase64String, // TOO BIG!
});

// ✅ Do this instead
// Store in Convex file storage, save only storage ID
const storageId = await ctx.storage.store(audioBlob);
await ctx.db.insert("conversations", {
  audioStorageId: storageId,
});
```

---

### Frontend Errors

#### Error: "Recording failed to start"
**Cause:** Missing microphone permissions or audio mode not set
**Solution:** Request permissions and configure audio mode

```typescript
// Request permissions first
const { granted } = await Audio.requestPermissionsAsync();
if (!granted) {
  throw new Error("Microphone permission denied");
}

// Set audio mode for recording
await AudioModule.setAudioModeAsync({
  allowsRecording: true,
  playsInSilentMode: true,
});
```

#### Error: "Recording URI is null"
**Cause:** Trying to get URI before recording is stopped
**Solution:** Only call `getURI()` after `stopAndUnloadAsync()`

```typescript
await recording.stopAndUnloadAsync();
const uri = recording.getURI(); // Now safe to call
```

#### Error: "Invalid audio format"
**Cause:** File extension doesn't match actual audio format
**Solution:** Use expo-audio's built-in presets

```typescript
const { recording } = await Audio.Recording.createAsync(
  Audio.RecordingPresets.HIGH_QUALITY // Ensures correct format
);
```

#### Error: "Failed to read audio file"
**Cause:** File path is incorrect or file doesn't exist
**Solution:** Verify file exists before reading

```typescript
const fileInfo = await FileSystem.getInfoAsync(audioUri);
if (!fileInfo.exists) {
  throw new Error("Audio file not found");
}
```

---

### iOS-Specific Issues

#### Issue: Recording stops immediately on iOS
**Cause:** Microphone permission not granted or info.plist missing
**Solution:** Add to app.json plugins

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

#### Issue: Audio plays through earpiece instead of speaker
**Cause:** Audio mode set to `allowsRecording: true`
**Solution:** Switch audio mode for playback

```typescript
// For playback (loudspeaker)
await AudioModule.setAudioModeAsync({
  allowsRecording: false,
  playsInSilentMode: true,
});
```

---

### Android-Specific Issues

#### Issue: Recording quality is poor
**Cause:** Using low-quality preset or incorrect sample rate
**Solution:** Use HIGH_QUALITY preset

```typescript
const { recording } = await Audio.Recording.createAsync(
  Audio.RecordingPresets.HIGH_QUALITY
);
```

#### Issue: Audio doesn't play in background
**Cause:** Background audio not configured
**Solution:** Not typically needed for voice chat, but if required:

```typescript
await AudioModule.setAudioModeAsync({
  allowsRecording: false,
  playsInSilentMode: true,
  staysActiveInBackground: true, // Android only
});
```

---

### Performance Issues

#### Issue: Processing takes too long (>30 seconds)
**Causes & Solutions:**

1. **Large audio files**
   - Solution: Limit recording duration to 5 minutes max
   - Solution: Use `tts-1` instead of `tts-1-hd` for faster TTS

2. **Slow model**
   - Solution: Use `gpt-4o-mini` instead of `gpt-4o`
   - Solution: Reduce `maxTokens` parameter

3. **Network latency**
   - Solution: Show loading states to user
   - Solution: Add timeout handlers

```typescript
const timeout = new Promise((_, reject) =>
  setTimeout(() => reject(new Error("Request timeout")), 30000)
);

const result = await Promise.race([
  processConversation(args),
  timeout,
]);
```

#### Issue: App crashes with large responses
**Cause:** Memory issues from large base64 strings
**Solution:** Stream responses or chunk processing

```typescript
// Use streaming for large responses
for await (const textPart of result.textStream) {
  // Update UI incrementally
  setResponse(prev => prev + textPart);
}
```

---

### Debugging Tips

**Enable verbose logging:**
```typescript
// In hooks and components
console.log("[VoiceRecording] Starting:", { durationMs, hasPermission });
console.log("[VoiceProcessing] Submitting:", { audioFormat, userId });
console.log("[AudioPlayback] Playing:", { base64Length: base64.length });
```

**Check Convex logs:**
```bash
npx convex dev
# Watch for action logs in terminal
```

**Test audio file manually:**
```typescript
// Verify file exists and is readable
const fileInfo = await FileSystem.getInfoAsync(audioUri);
console.log("File info:", fileInfo);

const base64 = await FileSystem.readAsStringAsync(audioUri, {
  encoding: FileSystem.EncodingType.Base64,
});
console.log("Base64 length:", base64.length);
```

**Test Whisper API directly:**
```bash
# From terminal
curl https://api.openai.com/v1/audio/transcriptions \
  -H "Authorization: Bearer $OPENAI_API_KEY" \
  -H "Content-Type: multipart/form-data" \
  -F file="@/path/to/audio.mp3" \
  -F model="whisper-1"
```

---

### Quick Checklist

When things aren't working, check:

- [ ] OpenAI API key is set in Convex environment
- [ ] Microphone permissions are granted
- [ ] Audio mode is correctly set (recording vs playback)
- [ ] File URI exists and is readable
- [ ] Audio format matches file extension
- [ ] Model names are correct (gpt-4o, not gpt-5)
- [ ] Not storing base64 in database
- [ ] Not using Buffer in Convex actions
- [ ] Error handling is in place
- [ ] Loading states are shown to user
