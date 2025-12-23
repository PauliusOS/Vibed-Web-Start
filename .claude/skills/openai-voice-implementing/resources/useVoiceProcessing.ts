// Create this file: hooks/useVoiceProcessing.ts

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
