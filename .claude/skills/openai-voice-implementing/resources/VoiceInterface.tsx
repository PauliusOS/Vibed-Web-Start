// Create this file: components/VoiceInterface.tsx

import React, { useEffect } from "react";
import { View, Text, TouchableOpacity, StyleSheet, Alert, ScrollView } from "react-native";
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
    reset: resetRecording,
  } = useVoiceRecording(maxRecordingSeconds * 1000);

  const {
    submitRecording,
    isProcessing,
    transcription,
    response,
    audioBase64,
    error,
    reset: resetProcessing,
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

  const handleReset = () => {
    resetRecording();
    resetProcessing();
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
          <ScrollView style={styles.scrollView}>
            <Text style={styles.transcriptionText}>{transcription}</Text>
          </ScrollView>
        </View>
      )}

      {/* Response Display */}
      {response && (
        <View style={styles.responseContainer}>
          <Text style={styles.label}>AI Response:</Text>
          <ScrollView style={styles.scrollView}>
            <Text style={styles.responseText}>{response}</Text>
          </ScrollView>

          {/* Playback Controls */}
          <View style={styles.playbackControls}>
            {!isPlaying ? (
              <TouchableOpacity onPress={resumeAudio} style={styles.playButton}>
                <Play size={24} color="#fff" />
                <Text style={styles.controlText}>Play</Text>
              </TouchableOpacity>
            ) : (
              <TouchableOpacity onPress={pauseAudio} style={styles.playButton}>
                <Pause size={24} color="#fff" />
                <Text style={styles.controlText}>Pause</Text>
              </TouchableOpacity>
            )}
          </View>

          {/* Reset Button */}
          <TouchableOpacity style={styles.resetButton} onPress={handleReset}>
            <Text style={styles.resetButtonText}>Ask Another Question</Text>
          </TouchableOpacity>
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
    fontWeight: "600",
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
    maxHeight: 150,
  },
  responseContainer: {
    marginTop: 20,
    padding: 16,
    backgroundColor: "#10B981",
    borderRadius: 8,
  },
  label: {
    fontSize: 12,
    color: "#D1D5DB",
    marginBottom: 8,
    textTransform: "uppercase",
    fontWeight: "600",
  },
  scrollView: {
    maxHeight: 120,
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
  playButton: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    padding: 8,
  },
  controlText: {
    color: "#fff",
    fontSize: 14,
    fontWeight: "600",
  },
  resetButton: {
    marginTop: 16,
    backgroundColor: "#374151",
    padding: 12,
    borderRadius: 8,
    alignItems: "center",
  },
  resetButtonText: {
    color: "#fff",
    fontSize: 14,
    fontWeight: "600",
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
