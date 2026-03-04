"use client";

import { useState, useCallback, useRef } from "react";
import type { TranscriptLine } from "@/types";
import { v4 as uuid } from "uuid";

const QUESTION_INDICATORS =
  /^(?:Q[.:]?\s|(?:can|could|would|will|do|did|have|has|are|is|were|was|who|what|where|when|why|how)\s)/i;

function classifyAudioRole(text: string): "questioning" | "answering" {
  const trimmed = text.trim();
  if (QUESTION_INDICATORS.test(trimmed)) return "questioning";
  if (trimmed.endsWith("?")) return "questioning";
  return "answering";
}

interface UseAudioOptions {
  onTranscriptLine: (line: TranscriptLine) => void;
}

export function useAudio({ onTranscriptLine }: UseAudioOptions) {
  const [isRecording, setIsRecording] = useState(false);
  const [isConnecting, setIsConnecting] = useState(false);
  const [complianceAccepted, setComplianceAccepted] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const socketRef = useRef<WebSocket | null>(null);
  const mediaRef = useRef<MediaStream | null>(null);
  const recorderRef = useRef<MediaRecorder | null>(null);
  const seqRef = useRef(0);

  const start = useCallback(async () => {
    if (!complianceAccepted) return;
    setIsConnecting(true);
    setError(null);

    try {
      const tokenRes = await fetch("/api/auth/deepgram-token", {
        method: "POST",
      });
      if (!tokenRes.ok) throw new Error("Failed to get Deepgram token");
      const { key } = await tokenRes.json();

      const stream = await navigator.mediaDevices.getUserMedia({
        audio: {
          echoCancellation: true,
          noiseSuppression: true,
          sampleRate: 16000,
        },
      });
      mediaRef.current = stream;

      const socket = new WebSocket(
        `wss://api.deepgram.com/v1/listen?model=nova-2&language=en&smart_format=true&punctuate=true`,
        ["token", key]
      );

      socket.onopen = () => {
        setIsRecording(true);
        setIsConnecting(false);

        const mediaRecorder = new MediaRecorder(stream, {
          mimeType: "audio/webm",
        });
        recorderRef.current = mediaRecorder;

        mediaRecorder.ondataavailable = (event) => {
          if (event.data.size > 0 && socket.readyState === WebSocket.OPEN) {
            socket.send(event.data);
          }
        };

        mediaRecorder.start(250);
      };

      socket.onmessage = (event) => {
        const data = JSON.parse(event.data);
        const transcript = data.channel?.alternatives?.[0]?.transcript;
        if (transcript && data.is_final) {
          const role = classifyAudioRole(transcript);
          const line: TranscriptLine = {
            id: uuid(),
            seq: ++seqRef.current,
            speaker: role === "questioning" ? "Q" : "A",
            text: transcript,
            role,
          };
          onTranscriptLine(line);
        }
      };

      socket.onerror = () => {
        setError("Audio connection error");
        setIsRecording(false);
        setIsConnecting(false);
      };

      socket.onclose = () => {
        setIsRecording(false);
      };

      socketRef.current = socket;
    } catch (err) {
      setError(err instanceof Error ? err.message : "Audio failed");
      setIsRecording(false);
      setIsConnecting(false);
    }
  }, [complianceAccepted, onTranscriptLine]);

  const stop = useCallback(() => {
    if (recorderRef.current && recorderRef.current.state !== "inactive") {
      recorderRef.current.stop();
      recorderRef.current = null;
    }
    if (socketRef.current) {
      socketRef.current.close();
      socketRef.current = null;
    }
    if (mediaRef.current) {
      mediaRef.current.getTracks().forEach((t) => t.stop());
      mediaRef.current = null;
    }
    setIsRecording(false);
  }, []);

  const acceptCompliance = useCallback(() => {
    setComplianceAccepted(true);
  }, []);

  return {
    isRecording,
    isConnecting,
    complianceAccepted,
    error,
    start,
    stop,
    acceptCompliance,
  };
}
