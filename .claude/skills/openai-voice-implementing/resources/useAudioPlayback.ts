// Create this file: hooks/useAudioPlayback.ts

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
