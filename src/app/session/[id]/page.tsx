"use client";

import { useState, useEffect, useCallback, use } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { useTranscript } from "@/hooks/useTranscript";
import { useBookmarks } from "@/hooks/useBookmarks";
import { useAudio } from "@/hooks/useAudio";
import { SessionHeader } from "@/components/session/SessionHeader";
import { TranscriptFeed } from "@/components/transcript/TranscriptFeed";
import { TranscriptInput } from "@/components/transcript/TranscriptInput";
import { RadarPill } from "@/components/radar/RadarPill";
import { RadarPanel } from "@/components/radar/RadarPanel";
import { ActionBar } from "@/components/session/ActionBar";
import { BookmarkSheet } from "@/components/session/BookmarkSheet";
import { AudioControl } from "@/components/session/AudioControl";
import type { Session } from "@/types";

export default function LiveSessionPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const router = useRouter();
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  const [radarOpen, setRadarOpen] = useState(false);
  const [bookmarkOpen, setBookmarkOpen] = useState(false);
  const [bookmarkExcerpt, setBookmarkExcerpt] = useState("");

  const transcript = useTranscript(id);
  const { addBookmark } = useBookmarks(id);

  const handleAudioLine = useCallback(
    (line: Parameters<typeof transcript.addAudioLine>[0]) => {
      transcript.addAudioLine(line);
    },
    [transcript.addAudioLine]
  );

  const audio = useAudio({ onTranscriptLine: handleAudioLine });

  useEffect(() => {
    const load = async () => {
      const supabase = createClient();
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        router.push("/auth");
        return;
      }

      const res = await fetch(`/api/sessions/${id}`);
      if (res.ok) {
        const data = await res.json();
        setSession(data);
        if (data.ended_at) {
          router.push(`/session/${id}/review`);
          return;
        }
      } else {
        router.push("/sessions");
        return;
      }
      setLoading(false);
    };
    load();
  }, [id, router]);

  const handleEndSession = async () => {
    audio.stop();
    await fetch(`/api/sessions/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ended_at: new Date().toISOString() }),
    });
    router.push(`/session/${id}/review`);
  };

  const handlePaste = async (text: string) => {
    await transcript.pasteTranscript(text);
  };

  const handleBookmarkFromRadar = (excerpt: string) => {
    setBookmarkExcerpt(excerpt);
    setBookmarkOpen(true);
  };

  if (loading) {
    return (
      <div className="h-screen bg-zinc-950 flex items-center justify-center">
        <div className="animate-pulse text-zinc-500">Loading session...</div>
      </div>
    );
  }

  return (
    <div className="h-screen flex flex-col bg-zinc-950">
      <SessionHeader
        title={session?.title || "Session"}
        isActive={!session?.ended_at}
      />

      {audio.isRecording && (
        <div className="px-4 py-1.5 bg-amber-950/20 border-b border-amber-800/20">
          <p className="text-[10px] text-amber-500 flex items-center gap-1.5">
            <span className="h-1.5 w-1.5 rounded-full bg-red-500 animate-pulse" />
            Live transcription active — you are responsible for compliance with
            applicable recording and consent laws.
          </p>
        </div>
      )}

      <TranscriptFeed
        lines={transcript.lines}
        suggestions={transcript.activeSuggestions}
        isAnalyzing={transcript.isAnalyzing}
        cleanSegment={transcript.lastCleanSegment}
      />

      {transcript.activeSuggestions.length > 0 && (
        <RadarPill
          suggestions={transcript.activeSuggestions}
          onClick={() => setRadarOpen(true)}
        />
      )}

      <div className="flex items-center justify-between px-4 py-2 bg-zinc-950 border-t border-zinc-800">
        <div className="flex items-center gap-2">
          <ActionBar
            onBookmark={() => setBookmarkOpen(true)}
            onNote={() => {}}
            onEnd={handleEndSession}
          />
        </div>
        <AudioControl
          isRecording={audio.isRecording}
          isConnecting={audio.isConnecting}
          complianceAccepted={audio.complianceAccepted}
          error={audio.error}
          onStart={audio.start}
          onStop={audio.stop}
          onAcceptCompliance={audio.acceptCompliance}
        />
      </div>

      {!audio.isRecording && (
        <TranscriptInput
          onSubmit={handlePaste}
          isAnalyzing={transcript.isAnalyzing}
        />
      )}

      <RadarPanel
        open={radarOpen}
        onOpenChange={setRadarOpen}
        suggestions={transcript.suggestions}
        onDismiss={transcript.dismissSuggestion}
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
