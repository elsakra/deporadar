"use client";

import { useState, useCallback } from "react";
import type { Bookmark, BookmarkTag } from "@/types";
import { v4 as uuid } from "uuid";

export function useBookmarks(sessionId?: string) {
  const [bookmarks, setBookmarks] = useState<Bookmark[]>([]);

  const addBookmark = useCallback(
    async (tag: BookmarkTag, note?: string, excerptText?: string, lineId?: string) => {
      const bookmark: Bookmark = {
        id: uuid(),
        session_id: sessionId || "demo",
        tag,
        note,
        transcript_line_id: lineId,
        excerpt_text: excerptText,
        created_at: new Date().toISOString(),
      };

      setBookmarks((prev) => [...prev, bookmark]);

      if (sessionId && sessionId !== "demo") {
        try {
          await fetch(`/api/sessions/${sessionId}/bookmarks`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              tag,
              note,
              transcript_line_id: lineId,
              excerpt_text: excerptText,
            }),
          });
        } catch {}
      }

      return bookmark;
    },
    [sessionId]
  );

  const removeBookmark = useCallback((id: string) => {
    setBookmarks((prev) => prev.filter((b) => b.id !== id));
  }, []);

  return { bookmarks, addBookmark, removeBookmark };
}
