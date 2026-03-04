"use client";

import { useState, useCallback, useRef } from "react";
import type { TranscriptLine, RadarSuggestion, AnalyzeResponse } from "@/types";
import { parseTranscript } from "@/lib/transcript/speaker-parser";

export function useTranscript(sessionId?: string) {
  const [lines, setLines] = useState<TranscriptLine[]>([]);
  const [suggestions, setSuggestions] = useState<RadarSuggestion[]>([]);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [lastCleanSegment, setLastCleanSegment] = useState(false);
  const seqRef = useRef(0);

  const sendToAnalyze = useCallback(
    async (newLines: TranscriptLine[], inputSource: "text" | "audio") => {
      setIsAnalyzing(true);
      setLastCleanSegment(false);

      try {
        const contextLines = lines.slice(-15);
        const res = await fetch("/api/analyze", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            sessionId: sessionId || "demo",
            lines: newLines.map((l) => ({
              seq: l.seq,
              speaker: l.speaker,
              text: l.text,
              role: l.role,
            })),
            context: contextLines.map((l) => ({
              seq: l.seq,
              speaker: l.speaker,
              text: l.text,
              role: l.role,
            })),
            inputSource,
          }),
        });

        const data: AnalyzeResponse = await res.json();
        if (data.suggestions?.length) {
          setSuggestions((prev) => [...prev, ...data.suggestions]);
        }
        setLastCleanSegment(data.cleanSegment);
      } catch (err) {
        console.error("Analysis failed:", err);
        setLastCleanSegment(true);
      } finally {
        setIsAnalyzing(false);
      }
    },
    [lines, sessionId]
  );

  const addLines = useCallback(
    async (newLines: TranscriptLine[], inputSource: "text" | "audio" = "text") => {
      setLines((prev) => [...prev, ...newLines]);

      if (inputSource === "audio") {
        // Audio: always send to analyze (server decides what to check)
        await sendToAnalyze(newLines, "audio");
        return;
      }

      // Text: only analyze if there are question lines
      const questionLines = newLines.filter((l) => l.role === "questioning");
      if (questionLines.length === 0) {
        setLastCleanSegment(true);
        return;
      }

      await sendToAnalyze(newLines, "text");
    },
    [sendToAnalyze]
  );

  const addAudioLine = useCallback(
    async (line: TranscriptLine) => {
      await addLines([line], "audio");
    },
    [addLines]
  );

  const pasteTranscript = useCallback(
    async (rawText: string, inputSource: "text" | "audio" = "text") => {
      const parsed = parseTranscript(rawText);
      const numbered = parsed.map((l) => ({
        ...l,
        seq: ++seqRef.current,
      }));
      await addLines(numbered, inputSource);
      return numbered;
    },
    [addLines]
  );

  const addDemoLine = useCallback((line: TranscriptLine) => {
    setLines((prev) => [...prev, line]);
  }, []);

  const addDemoSuggestion = useCallback((suggestion: RadarSuggestion) => {
    setSuggestions((prev) => [...prev, suggestion]);
  }, []);

  const dismissSuggestion = useCallback((id: string) => {
    setSuggestions((prev) =>
      prev.map((s) => (s.id === id ? { ...s, dismissed: true } : s))
    );
  }, []);

  return {
    lines,
    suggestions,
    isAnalyzing,
    lastCleanSegment,
    addLines,
    addAudioLine,
    pasteTranscript,
    addDemoLine,
    addDemoSuggestion,
    dismissSuggestion,
    activeSuggestions: suggestions.filter((s) => !s.dismissed),
  };
}
