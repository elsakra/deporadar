import type { TranscriptLine, DigestData } from "@/types";
import { redactPII } from "@/lib/radar/pii-redactor";
import { DIGEST_SYSTEM_PROMPT } from "@/lib/radar/prompts";

async function callLLMForDigest(
  transcript: TranscriptLine[]
): Promise<DigestData | null> {
  const redactedLines = transcript
    .map((l) => `Line ${l.seq} [${l.role}] ${l.speaker}: ${redactPII(l.text)}`)
    .join("\n");

  const userMessage = `Generate a post-deposition digest for the following transcript:\n\n${redactedLines}`;

  // Try Anthropic
  const anthropicKey = process.env.ANTHROPIC_API_KEY;
  if (anthropicKey) {
    try {
      const res = await fetch("https://api.anthropic.com/v1/messages", {
        method: "POST",
        headers: {
          "x-api-key": anthropicKey,
          "anthropic-version": "2023-06-01",
          "content-type": "application/json",
        },
        body: JSON.stringify({
          model: "claude-3-haiku-20240307",
          max_tokens: 2000,
          system: DIGEST_SYSTEM_PROMPT,
          messages: [{ role: "user", content: userMessage }],
        }),
      });
      if (res.ok) {
        const data = await res.json();
        const text = data.content?.[0]?.text;
        if (text) {
          const parsed = JSON.parse(text);
          return {
            sections: parsed.sections,
            generatedAt: new Date().toISOString(),
            lineCount: transcript.length,
            suggestionCount: 0,
          };
        }
      }
    } catch {}
  }

  // Try OpenAI
  const openaiKey = process.env.OPENAI_API_KEY;
  if (openaiKey) {
    try {
      const res = await fetch("https://api.openai.com/v1/chat/completions", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${openaiKey}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          model: "gpt-4o-mini",
          max_tokens: 2000,
          response_format: { type: "json_object" },
          messages: [
            { role: "system", content: DIGEST_SYSTEM_PROMPT },
            { role: "user", content: userMessage },
          ],
        }),
      });
      if (res.ok) {
        const data = await res.json();
        const text = data.choices?.[0]?.message?.content;
        if (text) {
          const parsed = JSON.parse(text);
          return {
            sections: parsed.sections,
            generatedAt: new Date().toISOString(),
            lineCount: transcript.length,
            suggestionCount: 0,
          };
        }
      }
    } catch {}
  }

  return null;
}

export async function generateDigest(
  transcript: TranscriptLine[]
): Promise<DigestData | null> {
  return callLLMForDigest(transcript);
}
