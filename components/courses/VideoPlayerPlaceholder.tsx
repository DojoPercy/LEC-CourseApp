import { Ionicons } from "@expo/vector-icons";
import { Image } from "expo-image";
import { useEffect, useRef, useState } from "react";
import { Text, TouchableOpacity, View } from "react-native";
import type { Section } from "@/types/course";

interface VideoPlayerPlaceholderProps {
  section: Section | null;
  courseThumbnail?: string;
  isPlaying: boolean;
  onPlayToggle: () => void;
  onVideoEnd: () => void;
}

// Simulate ~6 seconds for demo; real implementation will use expo-av
const SIMULATION_DURATION_MS = 6000;
const TICK_MS = 100;

export default function VideoPlayerPlaceholder({
  section,
  courseThumbnail,
  isPlaying,
  onPlayToggle,
  onVideoEnd,
}: VideoPlayerPlaceholderProps) {
  const [progress, setProgress] = useState(0); // 0–100
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const hasEndedRef = useRef(false);

  // Reset progress when section changes
  useEffect(() => {
    setProgress(0);
    hasEndedRef.current = false;
    if (intervalRef.current) clearInterval(intervalRef.current);
  }, [section?.id]);

  // Drive the simulated playback
  useEffect(() => {
    if (intervalRef.current) clearInterval(intervalRef.current);

    if (!isPlaying) return;

    const increment = (TICK_MS / SIMULATION_DURATION_MS) * 100;

    intervalRef.current = setInterval(() => {
      setProgress((prev) => {
        const next = prev + increment;
        if (next >= 100) {
          clearInterval(intervalRef.current!);
          if (!hasEndedRef.current) {
            hasEndedRef.current = true;
            // Slight delay so the bar visually fills before callback
            setTimeout(onVideoEnd, 300);
          }
          return 100;
        }
        return next;
      });
    }, TICK_MS);

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [isPlaying, section?.id]);

  const isFinished = progress >= 100;

  // Format elapsed time from progress
  const formatTime = (pct: number) => {
    if (!section) return "0:00";
    const [min, sec] = section.duration.split(":").map(Number);
    const totalSec = (min ?? 0) * 60 + (sec ?? 0);
    const elapsed = Math.floor((pct / 100) * totalSec);
    const m = Math.floor(elapsed / 60);
    const s = elapsed % 60;
    return `${m}:${String(s).padStart(2, "0")}`;
  };

  return (
    <View className="relative bg-gray-900" style={{ aspectRatio: 16 / 9 }}>
      {courseThumbnail && (
        <Image
          source={{ uri: courseThumbnail }}
          style={{ position: "absolute", top: 0, left: 0, right: 0, bottom: 0 }}
          contentFit="cover"
        />
      )}

      {/* Dark overlay — lighter when playing */}
      <View
        className="absolute inset-0"
        style={{ backgroundColor: isPlaying ? "rgba(0,0,0,0.35)" : "rgba(0,0,0,0.55)" }}
      />

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

      {/* Center Play/Pause (hidden when finished) */}
      {!isFinished && (
        <TouchableOpacity
          className="absolute inset-0 items-center justify-center"
          onPress={onPlayToggle}
          activeOpacity={0.85}
        >
          {!isPlaying && (
            <View className="w-16 h-16 rounded-full bg-white/20 items-center justify-center border-2 border-white/50">
              <Ionicons name="play" size={30} color="white" style={{ marginLeft: 3 }} />
            </View>
          )}
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

      {/* Section title (top) */}
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
        {/* Progress bar */}
        <View
          className="w-full h-1 bg-white/30 rounded-full mb-2 overflow-hidden"
        >
          <View
            className="h-full bg-white rounded-full"
            style={{ width: `${progress}%` }}
          />
        </View>

        <View className="flex-row items-center justify-between">
          {/* Play/pause mini button */}
          <TouchableOpacity onPress={onPlayToggle} disabled={isFinished} activeOpacity={0.8}>
            <Ionicons
              name={isPlaying ? "pause" : "play"}
              size={16}
              color="white"
            />
          </TouchableOpacity>

          {/* Time */}
          {section && (
            <Text
              className="text-white/80 text-xs"
              style={{ fontFamily: "Manrope_400Regular" }}
            >
              {formatTime(progress)} / {section.duration}
            </Text>
          )}

          {/* Fullscreen placeholder */}
          <Ionicons name="expand-outline" size={15} color="rgba(255,255,255,0.7)" />
        </View>
      </View>
    </View>
  );
}
