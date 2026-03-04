"use client";

import { useState, useCallback } from "react";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Send } from "lucide-react";

interface Props {
  onSubmit: (text: string) => Promise<void>;
  isAnalyzing?: boolean;
  placeholder?: string;
}

export function TranscriptInput({ onSubmit, isAnalyzing, placeholder }: Props) {
  const [text, setText] = useState("");

  const handleSubmit = useCallback(async () => {
    const trimmed = text.trim();
    if (!trimmed || isAnalyzing) return;
    setText("");
    await onSubmit(trimmed);
  }, [text, isAnalyzing, onSubmit]);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && (e.metaKey || e.ctrlKey)) {
      e.preventDefault();
      handleSubmit();
    }
  };

  return (
    <div className="border-t border-zinc-800 bg-zinc-950 p-3">
      <div className="flex gap-2 items-end">
        <Textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder={
            placeholder ||
            "Paste transcript from CaseViewNet (⌘+Enter to analyze)"
          }
          className="min-h-[60px] max-h-[200px] resize-none bg-zinc-900 border-zinc-800 text-sm font-mono text-zinc-200 placeholder:text-zinc-600"
          rows={3}
        />
        <Button
          onClick={handleSubmit}
          disabled={!text.trim() || isAnalyzing}
          size="icon"
          className="shrink-0 h-10 w-10"
        >
          <Send className="h-4 w-4" />
        </Button>
      </div>
      <p className="text-[10px] text-zinc-600 mt-1 px-1">
        Handles Q./A., MR./MS., line numbers, CaseViewNet format. ⌘+Enter to
        submit.
      </p>
    </div>
  );
}
