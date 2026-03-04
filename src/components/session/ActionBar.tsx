"use client";

import { Button } from "@/components/ui/button";
import { Bookmark, StickyNote, Square } from "lucide-react";

interface Props {
  onBookmark: () => void;
  onNote: () => void;
  onEnd: () => void;
  isDemo?: boolean;
}

export function ActionBar({ onBookmark, onNote, onEnd, isDemo }: Props) {
  return (
    <div className="flex items-center justify-between px-4 py-2 bg-zinc-950 border-t border-zinc-800">
      <div className="flex items-center gap-2">
        <Button
          variant="ghost"
          size="sm"
          className="text-zinc-400 hover:text-zinc-200 h-9 gap-2"
          onClick={onBookmark}
        >
          <Bookmark className="h-4 w-4" />
          <span className="text-xs">Bookmark</span>
        </Button>
        <Button
          variant="ghost"
          size="sm"
          className="text-zinc-400 hover:text-zinc-200 h-9 gap-2"
          onClick={onNote}
        >
          <StickyNote className="h-4 w-4" />
          <span className="text-xs">Note</span>
        </Button>
      </div>
      <Button
        variant="ghost"
        size="sm"
        className="text-red-400 hover:text-red-300 hover:bg-red-950/30 h-9 gap-2"
        onClick={onEnd}
      >
        <Square className="h-3.5 w-3.5" />
        <span className="text-xs">{isDemo ? "Skip to End" : "End Session"}</span>
      </Button>
    </div>
  );
}
