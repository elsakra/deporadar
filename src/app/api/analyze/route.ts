import { NextRequest, NextResponse } from "next/server";
import { AnalyzeRequestSchema } from "@/types";
import type { RadarSuggestion, TranscriptLine } from "@/types";
import { CONFIDENCE_FLOOR, AUDIO_CONFIDENCE_PENALTY } from "@/types";
import { runHeuristics, runHeuristicsAudio } from "@/lib/radar/heuristics";
import { refineSuggestion } from "@/lib/radar/llm-refiner";
import { v4 as uuid } from "uuid";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const parsed = AnalyzeRequestSchema.parse(body);

    const { lines, context, inputSource } = parsed;
    const allContext: TranscriptLine[] = [
      ...context.map((c, i) => ({ ...c, id: `ctx-${i}`, role: c.role } as TranscriptLine)),
      ...lines.map((l, i) => ({ ...l, id: `line-${i}`, role: l.role } as TranscriptLine)),
    ];

    const suggestions: RadarSuggestion[] = [];

    const objectedSeqs = new Set<number>();
    for (const line of allContext) {
      if (line.role === "objecting") {
        const prevQ = allContext
          .filter((l) => l.role === "questioning" && l.seq < line.seq)
          .pop();
        if (prevQ) objectedSeqs.add(prevQ.seq);
      }
    }

    const isAudio = inputSource === "audio";

    for (const line of lines) {
      const lineWithId: TranscriptLine = { ...line, id: uuid() };

      if (!isAudio && lineWithId.role !== "questioning") continue;

      if (objectedSeqs.has(lineWithId.seq)) continue;

      const heuristicResults = isAudio
        ? runHeuristicsAudio(lineWithId, allContext)
        : runHeuristics(lineWithId, allContext);

      for (const hr of heuristicResults) {
        const refined = await refineSuggestion(lineWithId, allContext, hr);
        if (!refined || !refined.shouldSurface) continue;

        let confidence = refined.confidence;
        if (inputSource === "audio") {
          confidence -= AUDIO_CONFIDENCE_PENALTY;
        }

        if (confidence < CONFIDENCE_FLOOR) continue;

        suggestions.push({
          id: uuid(),
          lineSeq: lineWithId.seq,
          category: hr.category,
          subtype: hr.subtype,
          confidence: Math.round(confidence * 100) / 100,
          suggestedText: refined.suggestedText,
          rationale: refined.rationale,
          excerpt: hr.excerpt,
          source: "heuristic",
        });
      }
    }

    return NextResponse.json({
      suggestions,
      cleanSegment: suggestions.length === 0,
    });
  } catch (err) {
    console.error("Analyze error:", err);
    return NextResponse.json(
      { error: "Analysis failed", suggestions: [], cleanSegment: true },
      { status: 500 }
    );
  }
}
