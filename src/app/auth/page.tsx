"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Shield, Mail } from "lucide-react";
import Link from "next/link";

export default function AuthPage() {
  const [email, setEmail] = useState("");
  const [affirmed, setAffirmed] = useState(false);
  const [sent, setSent] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleMagicLink = async () => {
    if (!email || !affirmed) return;
    setLoading(true);
    setError("");

    const supabase = createClient();
    const { error: authError } = await supabase.auth.signInWithOtp({
      email,
      options: {
        emailRedirectTo: `${window.location.origin}/api/auth/callback`,
      },
    });

    if (authError) {
      setError(authError.message);
    } else {
      setSent(true);
    }
    setLoading(false);
  };

  const handleGoogle = async () => {
    if (!affirmed) return;
    const supabase = createClient();
    await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: `${window.location.origin}/api/auth/callback`,
      },
    });
  };

  if (sent) {
    return (
      <div className="min-h-screen flex items-center justify-center p-6 bg-zinc-950">
        <div className="max-w-sm text-center space-y-4">
          <Mail className="h-10 w-10 text-amber-400 mx-auto" />
          <h1 className="text-xl font-bold text-zinc-100">Check your email</h1>
          <p className="text-sm text-zinc-400">
            We sent a sign-in link to{" "}
            <span className="text-zinc-200 font-medium">{email}</span>. Click
            it to continue.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-6 bg-zinc-950">
      <div className="max-w-sm w-full space-y-6">
        <div className="text-center space-y-2">
          <Link href="/" className="inline-flex items-center gap-2 mb-4">
            <Shield className="h-5 w-5 text-amber-400" />
            <span className="font-bold text-zinc-100">DepoRadar</span>
          </Link>
          <h1 className="text-xl font-bold text-zinc-100">Sign in</h1>
          <p className="text-sm text-zinc-500">
            2 free sessions. No credit card required.
          </p>
        </div>

        <div className="space-y-3">
          <Input
            type="email"
            placeholder="you@firm.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="bg-zinc-900 border-zinc-800 text-zinc-200"
          />
          <Button
            onClick={handleMagicLink}
            disabled={!email || !affirmed || loading}
            className="w-full"
          >
            {loading ? "Sending..." : "Send sign-in link"}
          </Button>

          <div className="relative py-2">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-zinc-800" />
            </div>
            <div className="relative flex justify-center text-xs">
              <span className="bg-zinc-950 px-2 text-zinc-600">or</span>
            </div>
          </div>

          <Button
            variant="outline"
            onClick={handleGoogle}
            disabled={!affirmed}
            className="w-full border-zinc-700 text-zinc-300"
          >
            Continue with Google
          </Button>
        </div>

        <label className="flex items-start gap-3 cursor-pointer">
          <input
            type="checkbox"
            checked={affirmed}
            onChange={(e) => setAffirmed(e.target.checked)}
            className="mt-1 rounded border-zinc-700 bg-zinc-900 text-amber-500 focus:ring-amber-500"
          />
          <span className="text-xs text-zinc-500 leading-relaxed">
            I am a licensed attorney or work under attorney supervision. I
            understand that DepoRadar provides assistive issue-spotting only and
            does not constitute legal advice.
          </span>
        </label>

        {error && (
          <p className="text-xs text-red-400 text-center">{error}</p>
        )}
      </div>
    </div>
  );
}
