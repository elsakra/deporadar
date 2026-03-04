"use client";

import { useState, useEffect } from "react";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Shield, Plus, Clock, FileText } from "lucide-react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import type { Session, Profile } from "@/types";
import { FREE_SESSION_LIMIT } from "@/types";

export default function SessionsPage() {
  const router = useRouter();
  const [sessions, setSessions] = useState<Session[]>([]);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);
  const [creating, setCreating] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [title, setTitle] = useState("");
  const [deponent, setDeponent] = useState("");
  const [matter, setMatter] = useState("");

  useEffect(() => {
    const load = async () => {
      const supabase = createClient();
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        router.push("/auth");
        return;
      }

      const [sessionsRes, profileRes] = await Promise.all([
        fetch("/api/sessions"),
        supabase.from("profiles").select("*").eq("id", user.id).single(),
      ]);

      if (sessionsRes.ok) {
        setSessions(await sessionsRes.json());
      }
      if (profileRes.data) {
        setProfile(profileRes.data as Profile);
      }
      setLoading(false);
    };
    load();
  }, [router]);

  const handleCreate = async () => {
    if (!title.trim()) return;
    setCreating(true);

    const res = await fetch("/api/sessions", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        title: title.trim(),
        deponent: deponent.trim() || undefined,
        matter: matter.trim() || undefined,
        mode: "text",
      }),
    });

    if (res.ok) {
      const session = await res.json();
      router.push(`/session/${session.id}`);
    } else if (res.status === 403) {
      const priceId = process.env.NEXT_PUBLIC_STRIPE_PRO_PRICE_ID;
      if (priceId) {
        const checkoutRes = await fetch("/api/stripe/checkout", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ priceId }),
        });
        if (checkoutRes.ok) {
          const { url } = await checkoutRes.json();
          if (url) window.location.href = url;
          return;
        }
      }
      alert("Free session limit reached. Please upgrade to continue.");
    }
    setCreating(false);
  };

  const usedSessions = profile?.session_count ?? 0;
  const isFree = profile?.subscription_status === "free";

  if (loading) {
    return (
      <div className="min-h-screen bg-zinc-950 flex items-center justify-center">
        <div className="animate-pulse text-zinc-500">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-zinc-950">
      <nav className="flex items-center justify-between px-6 py-4 border-b border-zinc-900">
        <Link href="/" className="flex items-center gap-2">
          <Shield className="h-5 w-5 text-amber-400" />
          <span className="font-bold text-zinc-100">DepoRadar</span>
        </Link>
        <div className="flex items-center gap-3">
          {isFree ? (
            <Badge
              variant="outline"
              className="border-zinc-700 text-zinc-400 text-[10px]"
            >
              {usedSessions} of {FREE_SESSION_LIMIT} free sessions used
            </Badge>
          ) : (
            <Badge className="bg-amber-500/10 text-amber-400 border-amber-600/30 text-[10px]">
              {profile?.subscription_status?.toUpperCase()} — unlimited
            </Badge>
          )}
        </div>
      </nav>

      <div className="max-w-2xl mx-auto px-6 py-8">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-xl font-bold text-zinc-100">Sessions</h1>
          <Button
            onClick={() => setShowForm(!showForm)}
            size="sm"
            className="gap-2"
          >
            <Plus className="h-4 w-4" />
            New Session
          </Button>
        </div>

        {showForm && (
          <div className="mb-6 p-4 rounded-lg border border-zinc-800 bg-zinc-900/50 space-y-3">
            <Input
              placeholder="Session title (e.g., Smith v. Jones - Plaintiff Depo)"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="bg-zinc-900 border-zinc-800 text-zinc-200"
            />
            <div className="grid grid-cols-2 gap-3">
              <Input
                placeholder="Deponent name"
                value={deponent}
                onChange={(e) => setDeponent(e.target.value)}
                className="bg-zinc-900 border-zinc-800 text-zinc-200"
              />
              <Input
                placeholder="Matter / case number"
                value={matter}
                onChange={(e) => setMatter(e.target.value)}
                className="bg-zinc-900 border-zinc-800 text-zinc-200"
              />
            </div>
            <div className="flex justify-end gap-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowForm(false)}
              >
                Cancel
              </Button>
              <Button
                size="sm"
                onClick={handleCreate}
                disabled={!title.trim() || creating}
              >
                {creating ? "Creating..." : "Start Session"}
              </Button>
            </div>
          </div>
        )}

        {sessions.length === 0 ? (
          <div className="text-center py-16">
            <FileText className="h-10 w-10 text-zinc-700 mx-auto mb-4" />
            <h2 className="text-lg font-medium text-zinc-400 mb-2">
              Your first deposition session is 30 seconds away
            </h2>
            <p className="text-sm text-zinc-600 mb-6">
              Create a session, paste transcript, and watch the radar work.
            </p>
            <Button onClick={() => setShowForm(true)} className="gap-2">
              <Plus className="h-4 w-4" />
              Start Your First Session
            </Button>
          </div>
        ) : (
          <div className="space-y-2">
            {sessions.map((session) => (
              <Link
                key={session.id}
                href={
                  session.ended_at
                    ? `/session/${session.id}/review`
                    : `/session/${session.id}`
                }
                className="block p-4 rounded-lg border border-zinc-800 hover:border-zinc-700 bg-zinc-900/50 hover:bg-zinc-900 transition-colors"
              >
                <div className="flex items-center justify-between">
                  <div className="min-w-0">
                    <h3 className="font-medium text-zinc-200 truncate">
                      {session.title}
                    </h3>
                    <div className="flex items-center gap-3 mt-1 text-xs text-zinc-500">
                      {session.deponent && <span>{session.deponent}</span>}
                      <span className="flex items-center gap-1">
                        <Clock className="h-3 w-3" />
                        {new Date(session.created_at).toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                  <Badge
                    variant="outline"
                    className={`text-[10px] shrink-0 ${
                      session.ended_at
                        ? "border-zinc-700 text-zinc-500"
                        : "border-emerald-700 text-emerald-400"
                    }`}
                  >
                    {session.ended_at ? "Ended" : "Active"}
                  </Badge>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
