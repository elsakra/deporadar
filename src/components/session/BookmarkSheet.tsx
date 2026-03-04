"use client";

import { useState } from "react";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { BOOKMARK_TAGS, type BookmarkTag } from "@/types";
import { cn } from "@/lib/utils";

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSave: (tag: BookmarkTag, note?: string) => void;
  excerpt?: string;
}

export function BookmarkSheet({ open, onOpenChange, onSave, excerpt }: Props) {
  const [selectedTag, setSelectedTag] = useState<BookmarkTag>("follow_up");
  const [note, setNote] = useState("");

  const handleSave = () => {
    onSave(selectedTag, note || undefined);
    setNote("");
    onOpenChange(false);
  };

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="bottom" className="bg-zinc-950 border-zinc-800">
        <SheetHeader>
          <SheetTitle className="text-zinc-200">Add Bookmark</SheetTitle>
        </SheetHeader>
        <div className="space-y-4 pt-4">
          {excerpt && (
            <blockquote className="text-xs text-zinc-500 border-l-2 border-zinc-700 pl-3 italic">
              &ldquo;{excerpt}&rdquo;
            </blockquote>
          )}
          <div className="flex flex-wrap gap-2">
            {BOOKMARK_TAGS.map((tag) => (
              <button
                key={tag.value}
                onClick={() => setSelectedTag(tag.value)}
                className={cn(
                  "text-xs px-3 py-1.5 rounded-full border transition-colors",
                  selectedTag === tag.value
                    ? "bg-zinc-200 text-zinc-900 border-zinc-200"
                    : "border-zinc-700 text-zinc-400 hover:border-zinc-500"
                )}
              >
                {tag.label}
              </button>
            ))}
          </div>
          <Textarea
            value={note}
            onChange={(e) => setNote(e.target.value)}
            placeholder="Optional note..."
            className="bg-zinc-900 border-zinc-800 text-sm resize-none"
            rows={2}
          />
          <Button onClick={handleSave} className="w-full">
            Save Bookmark
          </Button>
        </div>
      </SheetContent>
    </Sheet>
  );
}
