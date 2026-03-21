import { Ionicons } from "@expo/vector-icons";
import { AVPlaybackStatus, ResizeMode, Video } from "expo-av";
import { useEffect, useRef, useState } from "react";
import { ActivityIndicator, Text, TouchableOpacity, View } from "react-native";
import type { Section } from "@/types/course";

interface VideoPlayerProps {
  section: Section | null;
  isPlaying: boolean;
  onPlayToggle: () => void;
  onVideoEnd: () => void;
}

export default function VideoPlayer({
  section,
  isPlaying,
  onPlayToggle,
  onVideoEnd,
}: VideoPlayerProps) {
  const videoRef = useRef<Video>(null);
  const [isBuffering, setIsBuffering] = useState(false);
  const [duration, setDuration] = useState(0); // ms
  const [position, setPosition] = useState(0); // ms
  const [isFinished, setIsFinished] = useState(false);
  const hasEndedRef = useRef(false);

  // Reset state when section changes
  useEffect(() => {
    setIsFinished(false);
    setPosition(0);
    setDuration(0);
    hasEndedRef.current = false;
  }, [section?.id]);

  // Sync play/pause with isPlaying prop
  useEffect(() => {
    if (!videoRef.current) return;
    if (isPlaying) {
      videoRef.current.playAsync();
    } else {
      videoRef.current.pauseAsync();
    }
  }, [isPlaying]);

  const handlePlaybackStatus = (status: AVPlaybackStatus) => {
    if (!status.isLoaded) {
      setIsBuffering(false);
      return;
    }

    setIsBuffering(status.isBuffering);

    if (status.durationMillis) setDuration(status.durationMillis);
    if (status.positionMillis !== undefined) setPosition(status.positionMillis);

    if (status.didJustFinish && !hasEndedRef.current) {
      hasEndedRef.current = true;
      setIsFinished(true);
      onVideoEnd();
    }
  };

  const formatTime = (ms: number) => {
    const totalSec = Math.floor(ms / 1000);
    const m = Math.floor(totalSec / 60);
    const s = totalSec % 60;
    return `${m}:${String(s).padStart(2, "0")}`;
  };

  const progressPct = duration > 0 ? (position / duration) * 100 : 0;

  if (!section?.videoUrl) {
    return (
      <View
        className="bg-gray-900 items-center justify-center"
        style={{ aspectRatio: 16 / 9 }}
      >
        <Ionicons name="videocam-off-outline" size={32} color="#4B5563" />
        <Text
          className="text-gray-500 text-xs mt-2"
          style={{ fontFamily: "Manrope_400Regular" }}
        >
          No video available
        </Text>
      </View>
    );
  }

  return (
    <View className="relative bg-black" style={{ aspectRatio: 16 / 9 }}>
      <Video
        ref={videoRef}
        source={{ uri: section.videoUrl }}
        style={{ flex: 1 }}
        resizeMode={ResizeMode.CONTAIN}
        onPlaybackStatusUpdate={handlePlaybackStatus}
        shouldPlay={isPlaying}
        useNativeControls={false}
      />

      {/* Buffering indicator */}
      {isBuffering && (
        <View className="absolute inset-0 items-center justify-center">
          <ActivityIndicator color="white" size="large" />
        </View>
      )}

      {/* Finished overlay */}
      {isFinished && (
        <View className="absolute inset-0 items-center justify-center bg-black/60">
          <View className="w-14 h-14 rounded-full bg-green-500 items-center justify-center mb-2">
            <Ionicons name="checkmark" size={28} color="white" />
          </View>
          <Text
            className="text-white text-sm"
            style={{ fontFamily: "Manrope_600SemiBold" }}
          >
            Lesson Complete
          </Text>
        </View>
      )}

      {/* Center play button (only when paused and not finished) */}
      {!isPlaying && !isFinished && !isBuffering && (
        <TouchableOpacity
          className="absolute inset-0 items-center justify-center"
          onPress={onPlayToggle}
          activeOpacity={0.85}
        >
          <View className="w-16 h-16 rounded-full bg-white/20 items-center justify-center border-2 border-white/50">
            <Ionicons name="play" size={30} color="white" style={{ marginLeft: 3 }} />
          </View>
        </TouchableOpacity>
      )}

      {/* Tap to pause while playing */}
      {isPlaying && !isFinished && (
        <TouchableOpacity
          className="absolute inset-0"
          onPress={onPlayToggle}
          activeOpacity={1}
        />
      )}

      {/* Section title */}
      {section && (
        <View className="absolute top-3 left-4 right-14">
          <Text
            className="text-white text-sm"
            style={{ fontFamily: "Manrope_600SemiBold" }}
            numberOfLines={1}
          >
            {section.title}
          </Text>
        </View>
      )}

      {/* Bottom controls */}
      <View className="absolute bottom-0 left-0 right-0 px-3 pb-3">
        <View className="w-full h-1 bg-white/30 rounded-full mb-2 overflow-hidden">
          <View
            className="h-full bg-white rounded-full"
            style={{ width: `${progressPct}%` }}
          />
        </View>
        <View className="flex-row items-center justify-between">
          <TouchableOpacity onPress={onPlayToggle} disabled={isFinished} activeOpacity={0.8}>
            <Ionicons name={isPlaying ? "pause" : "play"} size={16} color="white" />
          </TouchableOpacity>

          {duration > 0 && (
            <Text
              className="text-white/80 text-xs"
              style={{ fontFamily: "Manrope_400Regular" }}
            >
              {formatTime(position)} / {formatTime(duration)}
            </Text>
          )}

          <Ionicons name="expand-outline" size={15} color="rgba(255,255,255,0.7)" />
        </View>
      </View>
    </View>
  );
}
