import { NextRequest, NextResponse } from "next/server";
import { createServerSupabaseClient } from "@/lib/supabase/server";
import { generateDigest } from "@/lib/export/digest";
import type { TranscriptLine } from "@/types";

export async function POST(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const supabase = await createServerSupabaseClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { data: lines, error } = await supabase
    .from("transcript_lines")
    .select("*")
    .eq("session_id", id)
    .order("seq", { ascending: true });

  if (error || !lines?.length) {
    return NextResponse.json({ error: "No transcript lines found" }, { status: 400 });
  }

  const transcriptLines: TranscriptLine[] = lines.map((l) => ({
    id: l.id,
    seq: l.seq,
    speaker: l.speaker || "UNKNOWN",
    text: l.text,
    role: l.role || "answering",
  }));

  const digest = await generateDigest(transcriptLines);
  if (!digest) {
    return NextResponse.json({ error: "Digest generation failed" }, { status: 500 });
  }

  const markdown = digest.sections
    .map((s) => {
      const items = s.items
        .map((i) => `- ${i.lineRef ? `Line ${i.lineRef}: ` : ""}${i.text}`)
        .join("\n");
      return `## ${s.title}\n${items}`;
    })
    .join("\n\n");

  await supabase
    .from("sessions")
    .update({ digest_json: digest, digest_markdown: markdown })
    .eq("id", id);

  return NextResponse.json({ digest, markdown });
}
