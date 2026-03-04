"use client";

import type { RadarSuggestion } from "@/types";
import { SuggestionCard } from "./SuggestionCard";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { ScrollArea } from "@/components/ui/scroll-area";

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  suggestions: RadarSuggestion[];
  onDismiss: (id: string) => void;
  onBookmark?: (excerpt: string) => void;
}

export function RadarPanel({
  open,
  onOpenChange,
  suggestions,
  onDismiss,
  onBookmark,
}: Props) {
  const active = suggestions.filter((s) => !s.dismissed);
  const formCount = active.filter((s) => s.category === "FORM").length;
  const privCount = active.filter((s) => s.category === "PRIVILEGE").length;

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="bottom" className="h-[45vh] bg-zinc-950 border-zinc-800">
        <SheetHeader className="pb-3 border-b border-zinc-800">
          <SheetTitle className="text-zinc-200 flex items-center gap-3">
            Radar Alerts
            {formCount > 0 && (
              <span className="text-xs bg-amber-400/10 text-amber-400 px-2 py-0.5 rounded font-mono">
                {formCount} FORM
              </span>
            )}
            {privCount > 0 && (
              <span className="text-xs bg-red-400/10 text-red-400 px-2 py-0.5 rounded font-mono">
                {privCount} PRIVILEGE
              </span>
            )}
          </SheetTitle>
        </SheetHeader>
        <ScrollArea className="h-full pt-3">
          <div className="space-y-3 pb-6">
            {active.length === 0 ? (
              <p className="text-sm text-zinc-500 text-center py-8">
                No active alerts
              </p>
            ) : (
              active.map((s) => (
                <SuggestionCard
                  key={s.id}
                  suggestion={s}
                  onDismiss={onDismiss}
                  onBookmark={onBookmark}
                />
              ))
            )}
          </div>
        </ScrollArea>
      </SheetContent>
    </Sheet>
  );
}
