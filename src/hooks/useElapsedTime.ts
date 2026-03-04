"use client";

import { useState, useEffect, useRef } from "react";

export function useElapsedTime(running: boolean) {
  const [elapsed, setElapsed] = useState(0);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    if (running) {
      intervalRef.current = setInterval(() => {
        setElapsed((prev) => prev + 1);
      }, 1000);
    } else if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [running]);

  const formatted = [
    String(Math.floor(elapsed / 3600)).padStart(2, "0"),
    String(Math.floor((elapsed % 3600) / 60)).padStart(2, "0"),
    String(elapsed % 60).padStart(2, "0"),
  ].join(":");

  return { elapsed, formatted };
}
