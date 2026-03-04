"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Mic, MicOff, AlertTriangle } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";

interface Props {
  isRecording: boolean;
  isConnecting: boolean;
  complianceAccepted: boolean;
  error: string | null;
  onStart: () => void;
  onStop: () => void;
  onAcceptCompliance: () => void;
}

export function AudioControl({
  isRecording,
  isConnecting,
  complianceAccepted,
  error,
  onStart,
  onStop,
  onAcceptCompliance,
}: Props) {
  const [showGate, setShowGate] = useState(false);
  const [checked, setChecked] = useState(false);

  const handleToggle = () => {
    if (isRecording) {
      onStop();
      return;
    }

    if (!complianceAccepted) {
      setShowGate(true);
      return;
    }

    onStart();
  };

  const handleAccept = () => {
    onAcceptCompliance();
    setShowGate(false);
    onStart();
  };

  return (
    <>
      <div className="flex items-center gap-2">
        <Button
          variant={isRecording ? "destructive" : "outline"}
          size="sm"
          className="gap-2 h-9"
          onClick={handleToggle}
          disabled={isConnecting}
        >
          {isRecording ? (
            <MicOff className="h-4 w-4" />
          ) : (
            <Mic className="h-4 w-4" />
          )}
          <span className="text-xs">
            {isConnecting
              ? "Connecting..."
              : isRecording
                ? "Stop Audio"
                : "Audio Mode"}
          </span>
          <Badge
            variant="outline"
            className="text-[8px] px-1 py-0 border-zinc-600 text-zinc-500"
          >
            Beta
          </Badge>
        </Button>
        {error && <span className="text-[10px] text-red-400">{error}</span>}
      </div>

      {isRecording && (
        <div className="px-4 py-1.5 bg-amber-950/20 border-b border-amber-800/20">
          <p className="text-[10px] text-amber-500 flex items-center gap-1.5">
            <span className="h-1.5 w-1.5 rounded-full bg-red-500 animate-pulse" />
            Live transcription active — you are responsible for compliance with
            applicable recording and consent laws.
          </p>
        </div>
      )}

      <Dialog open={showGate} onOpenChange={setShowGate}>
        <DialogContent className="bg-zinc-950 border-zinc-800">
          <DialogHeader>
            <DialogTitle className="text-zinc-200 flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-amber-400" />
              Audio Mode Compliance
            </DialogTitle>
            <DialogDescription className="text-zinc-400">
              Please review before enabling audio transcription.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 text-sm text-zinc-400">
            <p>
              This mode transcribes audio from your device&apos;s microphone.
              DepoRadar does <strong className="text-zinc-200">NOT</strong>{" "}
              store audio.
            </p>
            <p className="font-medium text-zinc-300">
              Important: You are solely responsible for compliance with all
              applicable recording, transcription, and consent laws in your
              jurisdiction.
            </p>
            <label className="flex items-start gap-3 cursor-pointer">
              <input
                type="checkbox"
                checked={checked}
                onChange={(e) => setChecked(e.target.checked)}
                className="mt-1 rounded border-zinc-700 bg-zinc-900"
              />
              <span className="text-xs text-zinc-500 leading-relaxed">
                I confirm that the use of real-time transcription technology has
                been disclosed to all parties and/or approved by the presiding
                officer. I accept full responsibility for compliance.
              </span>
            </label>
            <Button
              onClick={handleAccept}
              disabled={!checked}
              className="w-full"
            >
              Enable Audio Mode
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
