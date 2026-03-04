import { NextRequest, NextResponse } from "next/server";
import { createServerSupabaseClient } from "@/lib/supabase/server";

export async function GET() {
  const supabase = await createServerSupabaseClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { data, error } = await supabase
    .from("sessions")
    .select("*")
    .eq("user_id", user.id)
    .order("created_at", { ascending: false });

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json(data);
}

export async function POST(req: NextRequest) {
  const supabase = await createServerSupabaseClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await req.json();
  const { title, matter, deponent, mode } = body;

  // Check usage gate
  const { data: profile } = await supabase
    .from("profiles")
    .select("session_count, subscription_status")
    .eq("id", user.id)
    .single();

  if (
    profile &&
    profile.subscription_status === "free" &&
    profile.session_count >= 2
  ) {
    return NextResponse.json(
      { error: "Free session limit reached. Upgrade to continue." },
      { status: 403 }
    );
  }

  const { data, error } = await supabase
    .from("sessions")
    .insert({
      user_id: user.id,
      title: title || "Untitled Session",
      matter,
      deponent,
      mode: mode || "text",
    })
    .select()
    .single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  // Increment session count
  try {
    await supabase
      .from("profiles")
      .update({ session_count: (profile?.session_count ?? 0) + 1 })
      .eq("id", user.id);
  } catch {
    // Non-critical -- session was already created
  }

  return NextResponse.json(data, { status: 201 });
}
