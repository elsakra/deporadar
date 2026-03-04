"use client";

import { useEffect, useRef } from "react";
import type { TranscriptLine, RadarSuggestion } from "@/types";
import { TranscriptLineRow } from "./TranscriptLine";
import { ScrollArea } from "@/components/ui/scroll-area";

interface Props {
  lines: TranscriptLine[];
  suggestions: RadarSuggestion[];
  isAnalyzing?: boolean;
  cleanSegment?: boolean;
}

export function TranscriptFeed({
  lines,
  suggestions,
  isAnalyzing,
  cleanSegment,
}: Props) {
  const bottomRef = useRef<HTMLDivElement>(null);
  const suggestionMap = new Map(
    suggestions
      .filter((s) => !s.dismissed)
      .map((s) => [s.lineSeq, s])
  );

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [lines.length, suggestions.length]);

  if (lines.length === 0) {
    return (
      <div className="flex-1 flex items-center justify-center p-8">
        <div className="text-center text-zinc-500">
          <p className="text-lg font-medium mb-1">Waiting for transcript</p>
          <p className="text-sm">
            Paste transcript text from CaseViewNet below, or start audio mode
          </p>
        </div>
      </div>
    );
  }

  return (
    <ScrollArea className="flex-1">
      <div className="py-2">
        {lines.map((line, i) => (
          <TranscriptLineRow
            key={line.id}
            line={line}
            suggestion={suggestionMap.get(line.seq)}
            isLatest={i === lines.length - 1}
          />
        ))}
        {isAnalyzing && (
          <div className="px-4 py-2 text-xs text-zinc-500 animate-pulse">
            Analyzing...
          </div>
        )}
        {cleanSegment && !isAnalyzing && lines.length > 0 && (
          <div className="px-4 py-2 flex items-center gap-2 text-xs text-emerald-500/80">
            <span className="inline-block w-2 h-2 rounded-full bg-emerald-500/60" />
            Transcript looks clean. No objectionable questions detected.
          </div>
        )}
        <div ref={bottomRef} />
      </div>
    </ScrollArea>
  );
}
