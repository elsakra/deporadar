import { NextResponse } from "next/server";
import { createServerSupabaseClient } from "@/lib/supabase/server";

export async function POST() {
  const supabase = await createServerSupabaseClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const apiKey = process.env.DEEPGRAM_API_KEY;
  if (!apiKey) {
    return NextResponse.json({ error: "Deepgram not configured" }, { status: 500 });
  }

  // Create a short-lived Deepgram API key
  try {
    const res = await fetch("https://api.deepgram.com/v1/projects", {
      headers: { Authorization: `Token ${apiKey}` },
    });

    if (!res.ok) {
      return NextResponse.json({ error: "Deepgram API error" }, { status: 500 });
    }

    const data = await res.json();
    const projectId = data.projects?.[0]?.project_id;

    if (!projectId) {
      // Fallback: return the API key directly (less ideal but works for MVP)
      return NextResponse.json({ key: apiKey });
    }

    const keyRes = await fetch(
      `https://api.deepgram.com/v1/projects/${projectId}/keys`,
      {
        method: "POST",
        headers: {
          Authorization: `Token ${apiKey}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          comment: `DepoRadar temp key for ${user.id}`,
          scopes: ["usage:write"],
          time_to_live_in_seconds: 600, // 10 minutes
        }),
      }
    );

    if (keyRes.ok) {
      const keyData = await keyRes.json();
      return NextResponse.json({ key: keyData.key });
    }

    // Fallback
    return NextResponse.json({ key: apiKey });
  } catch {
    return NextResponse.json({ key: apiKey });
  }
}
