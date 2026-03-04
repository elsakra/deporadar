"use client";

import { useState, useEffect, use } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Shield, FileText, Mail, Trash2, ArrowLeft, Loader2 } from "lucide-react";
import Link from "next/link";
import type { Session, DigestData } from "@/types";

export default function ReviewPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const router = useRouter();
  const [session, setSession] = useState<Session | null>(null);
  const [digest, setDigest] = useState<DigestData | null>(null);
  const [loading, setLoading] = useState(true);
  const [generating, setGenerating] = useState(false);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    const load = async () => {
      const supabase = createClient();
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        router.push("/auth");
        return;
      }

      const res = await fetch(`/api/sessions/${id}`);
      if (res.ok) {
        const data = await res.json();
        setSession(data);
        if (data.digest_json) {
          setDigest(data.digest_json);
        }
      }
      setLoading(false);
    };
    load();
  }, [id, router]);

  const handleGenerateDigest = async () => {
    setGenerating(true);
    const res = await fetch(`/api/sessions/${id}/digest`, { method: "POST" });
    if (res.ok) {
      const data = await res.json();
      setDigest(data.digest);
    }
    setGenerating(false);
  };

  const handleDelete = async () => {
    if (!confirm("Delete this session and all associated data? This cannot be undone.")) return;
    setDeleting(true);
    await fetch(`/api/sessions/${id}`, { method: "DELETE" });
    router.push("/sessions");
  };

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
        <Link href="/sessions" className="flex items-center gap-2 text-zinc-400 hover:text-zinc-200 transition-colors">
          <ArrowLeft className="h-4 w-4" />
          <span className="text-sm">Sessions</span>
        </Link>
        <div className="flex items-center gap-2">
          <Shield className="h-4 w-4 text-amber-400" />
          <span className="font-semibold text-sm text-zinc-200">DepoRadar</span>
        </div>
      </nav>

      <div className="max-w-2xl mx-auto px-6 py-8">
        <div className="mb-8">
          <h1 className="text-xl font-bold text-zinc-100 mb-1">
            {session?.title}
          </h1>
          <div className="flex items-center gap-3 text-xs text-zinc-500">
            {session?.deponent && <span>Deponent: {session.deponent}</span>}
            {session?.matter && <span>Matter: {session.matter}</span>}
            <Badge variant="outline" className="text-[10px] border-zinc-700">
              Ended
            </Badge>
          </div>
        </div>

        {/* Digest */}
        {digest ? (
          <div className="space-y-6 mb-8">
            <h2 className="text-lg font-semibold text-zinc-200 flex items-center gap-2">
              <FileText className="h-5 w-5 text-amber-400" />
              Session Digest
            </h2>
            {digest.sections.map((section) => (
              <div key={section.title}>
                <h3 className="text-xs font-bold text-zinc-500 tracking-wider mb-3">
                  {section.title}
                </h3>
                <div className="space-y-2">
                  {section.items.map((item, i) => (
                    <div
                      key={i}
                      className="p-3 rounded border border-zinc-800 bg-zinc-900/50"
                    >
                      <p className="text-sm text-zinc-300">
                        {item.lineRef && (
                          <span className="text-zinc-600 font-mono text-xs mr-2">
                            Line {item.lineRef}
                          </span>
                        )}
                        {item.text}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12 mb-8">
            <FileText className="h-10 w-10 text-zinc-700 mx-auto mb-4" />
            <h2 className="text-lg font-medium text-zinc-400 mb-2">
              Generate your session digest
            </h2>
            <p className="text-sm text-zinc-600 mb-6">
              AI-powered summary with key admissions, privilege risks,
              impeachment opportunities, and recommended follow-ups.
            </p>
            <Button
              onClick={handleGenerateDigest}
              disabled={generating}
              size="lg"
              className="gap-2"
            >
              {generating ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Analyzing transcript...
                </>
              ) : (
                <>
                  <FileText className="h-4 w-4" />
                  Generate Digest
                </>
              )}
            </Button>
          </div>
        )}

        {/* Actions */}
        <div className="border-t border-zinc-800 pt-6 space-y-3">
          <div className="grid grid-cols-2 gap-3">
            <Button
              variant="outline"
              className="border-zinc-700 text-zinc-300 gap-2"
              disabled
            >
              <FileText className="h-4 w-4" />
              Export PDF
            </Button>
            <Button
              variant="outline"
              className="border-zinc-700 text-zinc-300 gap-2"
              disabled
            >
              <Mail className="h-4 w-4" />
              Email Digest
            </Button>
          </div>
          <Button
            variant="ghost"
            className="w-full text-red-400 hover:text-red-300 hover:bg-red-950/30 gap-2"
            onClick={handleDelete}
            disabled={deleting}
          >
            <Trash2 className="h-4 w-4" />
            {deleting ? "Deleting..." : "Delete Session"}
          </Button>
        </div>
      </div>
    </div>
  );
}
