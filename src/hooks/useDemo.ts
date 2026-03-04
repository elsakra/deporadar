"use client";

import { useState, useCallback, useRef, useEffect } from "react";
import { DEMO_TRANSCRIPT } from "@/data/demo-transcript";
import { DEMO_SUGGESTIONS } from "@/data/demo-suggestions";
import type { TranscriptLine, RadarSuggestion } from "@/types";

export type DemoState = "idle" | "playing" | "paused" | "finished";

export function useDemo() {
  const [state, setState] = useState<DemoState>("idle");
  const [lines, setLines] = useState<TranscriptLine[]>([]);
  const [suggestions, setSuggestions] = useState<RadarSuggestion[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const alertMap = new Map(DEMO_SUGGESTIONS.map((s) => [s.lineSeq, s]));

  const clearTimer = () => {
    if (timerRef.current) {
      clearTimeout(timerRef.current);
      timerRef.current = null;
    }
  };

  const scheduleNext = useCallback(
    (index: number) => {
      if (index >= DEMO_TRANSCRIPT.length) {
        setState("finished");
        return;
      }

      const line = DEMO_TRANSCRIPT[index];
      const prevLine = index > 0 ? DEMO_TRANSCRIPT[index - 1] : null;

      // Check if we need to insert a radar alert before this answer line
      // (the 2-second window: alert fires between Q and A)
      const alertForPrevQ =
        prevLine && prevLine.role === "questioning"
          ? alertMap.get(prevLine.seq)
          : null;

      if (alertForPrevQ && line.role === "answering") {
        // Show alert first, then answer after delay
        timerRef.current = setTimeout(() => {
          setSuggestions((prev) => [...prev, alertForPrevQ]);

          timerRef.current = setTimeout(() => {
            setLines((prev) => [...prev, line]);
            setCurrentIndex(index + 1);
            scheduleNext(index + 1);
          }, 2000);
        }, 1500);
      } else {
        const delay = line.role === "questioning" ? 3500 : 2500;
        timerRef.current = setTimeout(() => {
          setLines((prev) => [...prev, line]);
          setCurrentIndex(index + 1);
          scheduleNext(index + 1);
        }, delay);
      }
    },
    [alertMap]
  );

  const start = useCallback(() => {
    setLines([]);
    setSuggestions([]);
    setCurrentIndex(0);
    setState("playing");
    scheduleNext(0);
  }, [scheduleNext]);

  const pause = useCallback(() => {
    clearTimer();
    setState("paused");
  }, []);

  const resume = useCallback(() => {
    setState("playing");
    scheduleNext(currentIndex);
  }, [currentIndex, scheduleNext]);

  const skip = useCallback(() => {
    clearTimer();
    setLines([...DEMO_TRANSCRIPT]);
    setSuggestions([...DEMO_SUGGESTIONS]);
    setCurrentIndex(DEMO_TRANSCRIPT.length);
    setState("finished");
  }, []);

  useEffect(() => {
    return () => clearTimer();
  }, []);

  return {
    state,
    lines,
    suggestions,
    activeSuggestions: suggestions.filter((s) => !s.dismissed),
    start,
    pause,
    resume,
    skip,
    progress: Math.round((currentIndex / DEMO_TRANSCRIPT.length) * 100),
  };
}
