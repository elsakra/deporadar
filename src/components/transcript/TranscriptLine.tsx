"use client";

import type { TranscriptLine as TLine, RadarSuggestion } from "@/types";
import { RADAR_CATEGORY_CONFIG } from "@/types";
import { cn } from "@/lib/utils";

interface Props {
  line: TLine;
  suggestion?: RadarSuggestion;
  isLatest?: boolean;
}

export function TranscriptLineRow({ line, suggestion, isLatest }: Props) {
  const roleStyles: Record<string, string> = {
    questioning: "text-zinc-100",
    answering: "text-zinc-400",
    objecting: "text-amber-400/80 italic",
    procedural: "text-zinc-600 italic text-sm",
  };

  const speakerLabel =
    line.role === "questioning"
      ? "Q."
      : line.role === "answering"
        ? "A."
        : line.speaker;

  return (
    <div
      className={cn(
        "group relative px-4 py-2 transition-colors",
        suggestion && !suggestion.dismissed && RADAR_CATEGORY_CONFIG[suggestion.category].bgColor,
        isLatest && "animate-in fade-in slide-in-from-bottom-2 duration-300"
      )}
    >
      <div className="flex gap-3">
        <span
          className={cn(
            "shrink-0 w-6 font-mono text-xs text-zinc-600 pt-0.5 text-right"
          )}
        >
          {line.seq}
        </span>
        <div className={cn("flex-1 min-w-0", roleStyles[line.role])}>
          <span className="font-semibold text-sm mr-2 opacity-70">
            {speakerLabel}
          </span>
          <span className="text-sm leading-relaxed">{line.text}</span>
        </div>
      </div>
      {suggestion && !suggestion.dismissed && (
        <div
          className={cn(
            "ml-9 mt-1 text-xs font-medium",
            RADAR_CATEGORY_CONFIG[suggestion.category].color
          )}
        >
          ● {suggestion.suggestedText}
        </div>
      )}
    </div>
  );
}
