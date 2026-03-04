"use client";

import type { RadarSuggestion } from "@/types";
import { RADAR_CATEGORY_CONFIG } from "@/types";
import { cn } from "@/lib/utils";
import { AlertTriangle, Shield } from "lucide-react";

interface Props {
  suggestions: RadarSuggestion[];
  onClick: () => void;
}

export function RadarPill({ suggestions, onClick }: Props) {
  const active = suggestions.filter((s) => !s.dismissed);

  if (active.length === 0) return null;

  const latest = active[active.length - 1];
  const config = RADAR_CATEGORY_CONFIG[latest.category];
  const hasPrivilege = active.some((s) => s.category === "PRIVILEGE");

  return (
    <button
      onClick={onClick}
      className={cn(
        "w-full flex items-center justify-between px-4 py-3 transition-all",
        "border-t border-zinc-800",
        hasPrivilege
          ? "bg-red-950/40 hover:bg-red-950/60"
          : "bg-amber-950/30 hover:bg-amber-950/50"
      )}
    >
      <div className="flex items-center gap-3">
        {hasPrivilege ? (
          <Shield className="h-5 w-5 text-red-400 animate-pulse" />
        ) : (
          <AlertTriangle className="h-5 w-5 text-amber-400" />
        )}
        <span className={cn("text-base font-semibold tracking-wide", config.color)}>
          {latest.category} — {latest.subtype.replace(/_/g, " ")}
        </span>
      </div>
      <span
        className={cn(
          "text-sm font-mono px-2 py-0.5 rounded",
          config.bgColor,
          config.color
        )}
      >
        {active.length} total
      </span>
    </button>
  );
}
