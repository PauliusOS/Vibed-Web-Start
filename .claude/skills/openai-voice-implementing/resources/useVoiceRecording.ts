// Create this file: hooks/useVoiceRecording.ts

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
