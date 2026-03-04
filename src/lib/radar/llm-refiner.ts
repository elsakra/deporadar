import type { HeuristicResult, TranscriptLine, LLMRefinerOutput } from "@/types";
import { LLMRefinerOutputSchema } from "@/types";
import { redactPII } from "./pii-redactor";
import { REFINER_SYSTEM_PROMPT } from "./prompts";

async function callAnthropic(
  userMessage: string
): Promise<LLMRefinerOutput | null> {
  const key = process.env.ANTHROPIC_API_KEY;
  if (!key) return null;

  try {
    const res = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "x-api-key": key,
        "anthropic-version": "2023-06-01",
        "content-type": "application/json",
      },
      body: JSON.stringify({
        model: "claude-3-haiku-20240307",
        max_tokens: 300,
        system: REFINER_SYSTEM_PROMPT,
        messages: [{ role: "user", content: userMessage }],
      }),
    });

    if (!res.ok) return null;
    const data = await res.json();
    const text = data.content?.[0]?.text;
    if (!text) return null;

    const parsed = JSON.parse(text);
    const validated = LLMRefinerOutputSchema.parse(parsed);
    return validated;
  } catch {
    return null;
  }
}

async function callOpenAI(
  userMessage: string
): Promise<LLMRefinerOutput | null> {
  const key = process.env.OPENAI_API_KEY;
  if (!key) return null;

  try {
    const res = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${key}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "gpt-4o-mini",
        max_tokens: 300,
        response_format: { type: "json_object" },
        messages: [
          { role: "system", content: REFINER_SYSTEM_PROMPT },
          { role: "user", content: userMessage },
        ],
      }),
    });

    if (!res.ok) return null;
    const data = await res.json();
    const text = data.choices?.[0]?.message?.content;
    if (!text) return null;

    const parsed = JSON.parse(text);
    const validated = LLMRefinerOutputSchema.parse(parsed);
    return validated;
  } catch {
    return null;
  }
}

function buildPrompt(
  line: TranscriptLine,
  context: TranscriptLine[],
  heuristic: HeuristicResult
): string {
  const contextText = context
    .slice(-15)
    .map((l) => `[${l.role}] ${l.speaker}: ${redactPII(l.text)}`)
    .join("\n");

  return `HEURISTIC TRIGGER: ${heuristic.subtype} (confidence: ${heuristic.confidence})
SUGGESTED TEXT: ${heuristic.suggestedText}

CURRENT QUESTION:
${redactPII(line.text)}

CONTEXT (last 15 lines):
${contextText}

Should this objection be surfaced to defending counsel? Evaluate and respond with JSON.`;
}

export async function refineSuggestion(
  line: TranscriptLine,
  context: TranscriptLine[],
  heuristic: HeuristicResult
): Promise<{
  shouldSurface: boolean;
  confidence: number;
  suggestedText: string;
  rationale: string;
} | null> {
  const prompt = buildPrompt(line, context, heuristic);

  // Try Anthropic first, fall back to OpenAI, fall back to heuristic-only
  const llmResult =
    (await callAnthropic(prompt)) ?? (await callOpenAI(prompt));

  if (!llmResult) {
    // No LLM available -- pass through heuristic result
    return {
      shouldSurface: true,
      confidence: heuristic.confidence,
      suggestedText: heuristic.suggestedText,
      rationale: `Heuristic detection: ${heuristic.subtype}.`,
    };
  }

  if (!llmResult.shouldSurface) return null;

  const adjustedConf = Math.min(
    llmResult.adjustedConfidence ?? heuristic.confidence,
    0.95
  );

  return {
    shouldSurface: true,
    confidence: adjustedConf,
    suggestedText: llmResult.refinedSuggestedText ?? heuristic.suggestedText,
    rationale: llmResult.rationale,
  };
}
