"use client";

import { useState } from "react";
import { useDemo } from "@/hooks/useDemo";
import { useBookmarks } from "@/hooks/useBookmarks";
import { DEMO_DIGEST } from "@/data/demo-digest";
import { SessionHeader } from "@/components/session/SessionHeader";
import { TranscriptFeed } from "@/components/transcript/TranscriptFeed";
import { RadarPill } from "@/components/radar/RadarPill";
import { RadarPanel } from "@/components/radar/RadarPanel";
import { ActionBar } from "@/components/session/ActionBar";
import { BookmarkSheet } from "@/components/session/BookmarkSheet";
import { DemoEndScreen } from "@/components/landing/DemoEndScreen";
import { Button } from "@/components/ui/button";
import { Play } from "lucide-react";

export default function DemoPage() {
  const demo = useDemo();
  const { bookmarks, addBookmark } = useBookmarks("demo");
  const [radarOpen, setRadarOpen] = useState(false);
  const [bookmarkOpen, setBookmarkOpen] = useState(false);
  const [bookmarkExcerpt, setBookmarkExcerpt] = useState("");

  const handleBookmarkFromRadar = (excerpt: string) => {
    setBookmarkExcerpt(excerpt);
    setBookmarkOpen(true);
  };

  if (demo.state === "idle") {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-6 bg-zinc-950">
        <div className="max-w-md text-center space-y-6">
          <div className="space-y-3">
            <h1 className="text-2xl font-bold text-zinc-100">Live Demo</h1>
            <p className="text-sm text-zinc-400 leading-relaxed">
              You&apos;re defending a plaintiff deposition in{" "}
              <span className="text-zinc-200 font-medium">
                Smith v. Acme Industrial Corp.
              </span>{" "}
              Defense counsel is questioning your client. Watch the radar catch
              form defects and privilege probes in real-time.
            </p>
          </div>
          <Button onClick={demo.start} size="lg" className="h-12 px-8 gap-2">
            <Play className="h-4 w-4" />
            Start Demo
          </Button>
          <p className="text-[10px] text-zinc-600">
            ~90 seconds. No signup required. Fully client-side.
          </p>
        </div>
      </div>
    );
  }

  if (demo.state === "finished") {
    return (
      <div className="min-h-screen bg-zinc-950">
        <SessionHeader title="Smith v. Acme Industrial Corp." isActive={false} isDemo />
        <DemoEndScreen suggestions={demo.suggestions} digest={DEMO_DIGEST} />
      </div>
    );
  }

  return (
    <div className="h-screen flex flex-col bg-zinc-950">
      {/* Demo banner */}
      <div className="px-4 py-2 bg-blue-950/30 border-b border-blue-800/30 text-center">
        <p className="text-xs text-blue-400">
          Demo: You&apos;re defending a plaintiff deposition in Smith v. Acme Corp.
        </p>
      </div>

      <SessionHeader
        title="Smith v. Acme Industrial Corp."
        isActive={demo.state === "playing"}
        isDemo
      />

      <TranscriptFeed
        lines={demo.lines}
        suggestions={demo.activeSuggestions}
      />

      {demo.activeSuggestions.length > 0 && (
        <RadarPill
          suggestions={demo.activeSuggestions}
          onClick={() => setRadarOpen(true)}
        />
      )}

      <ActionBar
        onBookmark={() => setBookmarkOpen(true)}
        onNote={() => {}}
        onEnd={demo.skip}
        isDemo
      />

      <RadarPanel
        open={radarOpen}
        onOpenChange={setRadarOpen}
        suggestions={demo.suggestions}
        onDismiss={() => {}}
        onBookmark={handleBookmarkFromRadar}
      />

      <BookmarkSheet
        open={bookmarkOpen}
        onOpenChange={setBookmarkOpen}
        onSave={(tag, note) => addBookmark(tag, note, bookmarkExcerpt)}
        excerpt={bookmarkExcerpt}
      />
    </div>
  );
}
