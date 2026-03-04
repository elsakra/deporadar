"use client";

import { useState } from "react";
import type { RadarSuggestion } from "@/types";
import { RADAR_CATEGORY_CONFIG } from "@/types";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { ChevronDown, ChevronUp, Bookmark, X } from "lucide-react";

interface Props {
  suggestion: RadarSuggestion;
  onDismiss: (id: string) => void;
  onBookmark?: (excerpt: string) => void;
}

export function SuggestionCard({ suggestion, onDismiss, onBookmark }: Props) {
  const [expanded, setExpanded] = useState(false);
  const config = RADAR_CATEGORY_CONFIG[suggestion.category];

  return (
    <div
      className={cn(
        "rounded-lg border p-3 transition-all",
        suggestion.category === "PRIVILEGE"
          ? "border-red-800/50 bg-red-950/20"
          : "border-amber-800/30 bg-amber-950/10"
      )}
    >
      <div className="flex items-start justify-between gap-2">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <span
              className={cn(
                "text-[10px] font-bold tracking-widest px-1.5 py-0.5 rounded",
                config.bgColor,
                config.color
              )}
            >
              {suggestion.category}
            </span>
            <span className="text-[10px] text-zinc-500 font-mono">
              Line {suggestion.lineSeq} · {suggestion.confidence.toFixed(2)}
            </span>
          </div>
          <p className={cn("text-sm font-semibold", config.color)}>
            {suggestion.suggestedText}
          </p>
        </div>
        <div className="flex items-center gap-1 shrink-0">
          {onBookmark && (
            <Button
              variant="ghost"
              size="icon"
              className="h-7 w-7 text-zinc-500 hover:text-zinc-300"
              onClick={() => onBookmark(suggestion.excerpt)}
            >
              <Bookmark className="h-3.5 w-3.5" />
            </Button>
          )}
          <Button
            variant="ghost"
            size="icon"
            className="h-7 w-7 text-zinc-500 hover:text-zinc-300"
            onClick={() => onDismiss(suggestion.id)}
          >
            <X className="h-3.5 w-3.5" />
          </Button>
        </div>
      </div>

      <button
        onClick={() => setExpanded(!expanded)}
        className="flex items-center gap-1 mt-2 text-[11px] text-zinc-500 hover:text-zinc-300 transition-colors"
      >
        {expanded ? (
          <ChevronUp className="h-3 w-3" />
        ) : (
          <ChevronDown className="h-3 w-3" />
        )}
        {expanded ? "Hide" : "Why?"}
      </button>

      {expanded && (
        <div className="mt-2 space-y-2 text-xs text-zinc-400">
          <p>{suggestion.rationale}</p>
          <blockquote className="border-l-2 border-zinc-700 pl-3 italic text-zinc-500">
            &ldquo;{suggestion.excerpt}&rdquo;
          </blockquote>
        </div>
      )}
    </div>
  );
}
