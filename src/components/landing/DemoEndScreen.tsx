"use client";

import type { RadarSuggestion, DigestData } from "@/types";
import { Button } from "@/components/ui/button";
import { Share2, ArrowRight, BookOpen } from "lucide-react";
import Link from "next/link";

interface Props {
  suggestions: RadarSuggestion[];
  digest: DigestData;
}

export function DemoEndScreen({ suggestions, digest }: Props) {
  const formCount = suggestions.filter((s) => s.category === "FORM").length;
  const privCount = suggestions.filter((s) => s.category === "PRIVILEGE").length;

  const handleShare = () => {
    const text = `Just tried DepoRadar -- AI that catches form objections and privilege probes during depositions. The 90-second demo is impressive: ${window.location.origin}/demo`;
    navigator.clipboard.writeText(text);
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] p-6 text-center">
      <div className="max-w-md space-y-6">
        <div className="space-y-2">
          <h2 className="text-2xl font-bold text-zinc-100">Demo Complete</h2>
          <p className="text-zinc-400 text-sm">
            Here&apos;s what DepoRadar caught in this excerpt:
          </p>
        </div>

        <div className="flex justify-center gap-6">
          <div className="text-center">
            <div className="text-3xl font-bold text-amber-400">{formCount}</div>
            <div className="text-xs text-zinc-500 mt-1">Form Objections</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-red-400">{privCount}</div>
            <div className="text-xs text-zinc-500 mt-1">Privilege Risks</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-zinc-300">
              {digest.sections.reduce((acc, s) => acc + s.items.length, 0)}
            </div>
            <div className="text-xs text-zinc-500 mt-1">Digest Items</div>
          </div>
        </div>

        <div className="bg-zinc-900 border border-zinc-800 rounded-lg p-4 text-left">
          <div className="flex items-center gap-2 mb-3">
            <BookOpen className="h-4 w-4 text-zinc-400" />
            <span className="text-xs font-semibold text-zinc-400 tracking-wider">
              DIGEST PREVIEW
            </span>
          </div>
          {digest.sections.slice(0, 2).map((section) => (
            <div key={section.title} className="mb-3">
              <h4 className="text-[10px] font-bold text-zinc-500 tracking-wider mb-1">
                {section.title}
              </h4>
              {section.items.slice(0, 2).map((item, i) => (
                <p key={i} className="text-xs text-zinc-400 mb-1">
                  {item.lineRef && (
                    <span className="text-zinc-600 font-mono">
                      Line {item.lineRef}:{" "}
                    </span>
                  )}
                  {item.text}
                </p>
              ))}
            </div>
          ))}
        </div>

        <div className="space-y-3">
          <Link href="/auth" className="block">
            <Button className="w-full h-12 text-base font-semibold gap-2">
              Start free — 2 sessions, no credit card
              <ArrowRight className="h-4 w-4" />
            </Button>
          </Link>
          <Button
            variant="outline"
            className="w-full h-10 gap-2 border-zinc-700 text-zinc-300"
            onClick={handleShare}
          >
            <Share2 className="h-4 w-4" />
            Share this demo with a colleague
          </Button>
          <Link
            href="/#pricing"
            className="block text-xs text-zinc-500 hover:text-zinc-400 transition-colors"
          >
            See pricing →
          </Link>
        </div>
      </div>
    </div>
  );
}
