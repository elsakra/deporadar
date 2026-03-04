"use client";

import { useElapsedTime } from "@/hooks/useElapsedTime";
import { cn } from "@/lib/utils";

interface Props {
  title: string;
  isActive: boolean;
  isDemo?: boolean;
}

export function SessionHeader({ title, isActive, isDemo }: Props) {
  const { formatted } = useElapsedTime(isActive);

  return (
    <div className="flex items-center justify-between px-4 py-3 bg-zinc-950 border-b border-zinc-800">
      <div className="flex items-center gap-3 min-w-0">
        <div
          className={cn(
            "h-2 w-2 rounded-full shrink-0",
            isActive ? "bg-emerald-500 animate-pulse" : "bg-zinc-600"
          )}
        />
        <h1 className="text-sm font-medium text-zinc-200 truncate">{title}</h1>
        {isDemo && (
          <span className="text-[10px] px-1.5 py-0.5 bg-blue-500/10 text-blue-400 rounded font-mono shrink-0">
            DEMO
          </span>
        )}
      </div>
      <span className="text-sm font-mono text-zinc-500 tabular-nums shrink-0">
        {formatted}
      </span>
    </div>
  );
}
