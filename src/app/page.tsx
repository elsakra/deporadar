import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { PricingCards } from "@/components/landing/PricingCards";
import {
  Shield,
  AlertTriangle,
  FileText,
  ArrowRight,
  Zap,
  Eye,
  Clock,
} from "lucide-react";

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-zinc-950">
      {/* Nav */}
      <nav className="flex items-center justify-between px-6 py-4 border-b border-zinc-900">
        <div className="flex items-center gap-2">
          <Shield className="h-5 w-5 text-amber-400" />
          <span className="font-bold text-zinc-100">DepoRadar</span>
        </div>
        <div className="flex items-center gap-4">
          <Link
            href="/demo"
            className="text-sm text-zinc-400 hover:text-zinc-200 transition-colors"
          >
            Demo
          </Link>
          <Link
            href="/#pricing"
            className="text-sm text-zinc-400 hover:text-zinc-200 transition-colors"
          >
            Pricing
          </Link>
          <Link href="/auth">
            <Button variant="outline" size="sm" className="border-zinc-700 text-zinc-300">
              Sign in
            </Button>
          </Link>
        </div>
      </nav>

      {/* Hero */}
      <section className="px-6 pt-20 pb-16 text-center max-w-3xl mx-auto">
        <Badge className="mb-6 bg-amber-500/10 text-amber-400 border-amber-600/30">
          Built for defending counsel
        </Badge>
        <h1 className="text-4xl md:text-5xl font-bold leading-tight mb-6 text-zinc-50 tracking-tight">
          Your objection radar doesn&apos;t get tired at hour five.
        </h1>
        <p className="text-lg text-zinc-400 mb-8 max-w-2xl mx-auto leading-relaxed">
          Paste your realtime transcript. Get instant alerts for compound
          questions, privilege probes, and form defects — so you can focus on
          your client, not the wording.
        </p>
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <Link href="/demo">
            <Button size="lg" className="h-14 px-8 text-base font-semibold gap-2">
              Try the live demo — 90 seconds, no signup
              <ArrowRight className="h-4 w-4" />
            </Button>
          </Link>
        </div>
      </section>

      {/* Killer stat */}
      <section className="px-6 py-12 border-y border-zinc-900">
        <div className="max-w-2xl mx-auto text-center">
          <p className="text-sm text-zinc-400 leading-relaxed italic">
            &ldquo;In{" "}
            <span className="text-zinc-300">
              Orthopaedic Hospital v. DJO Global
            </span>
            , 4 minutes of testimony without a privilege objection was enough to
            waive it. DepoRadar watches every line.&rdquo;
          </p>
        </div>
      </section>

      {/* How it works */}
      <section className="px-6 py-16 max-w-4xl mx-auto">
        <h2 className="text-2xl font-bold text-center mb-12 text-zinc-100">
          Three steps. Under four seconds.
        </h2>
        <div className="grid gap-8 md:grid-cols-3">
          {[
            {
              icon: FileText,
              step: "1",
              title: "Paste from CaseViewNet",
              desc: "Copy a chunk of realtime transcript and paste it in. The parser handles Q./A. labels, line numbers, and colloquy automatically.",
            },
            {
              icon: AlertTriangle,
              step: "2",
              title: 'Radar catches issues',
              desc: '"Object to form — compound." Alerts appear in the 2-second window before the witness answers. 8 precision detectors.',
            },
            {
              icon: Eye,
              step: "3",
              title: "Review digest after",
              desc: "AI-generated summary with key admissions, privilege risks, impeachment opportunities — each citing specific line numbers.",
            },
          ].map((item) => (
            <div key={item.step} className="text-center">
              <div className="flex items-center justify-center mb-4">
                <div className="h-12 w-12 rounded-full bg-zinc-900 border border-zinc-800 flex items-center justify-center">
                  <item.icon className="h-5 w-5 text-amber-400" />
                </div>
              </div>
              <h3 className="font-semibold text-zinc-200 mb-2">{item.title}</h3>
              <p className="text-sm text-zinc-500 leading-relaxed">{item.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Competitor positioning */}
      <section className="px-6 py-12 border-t border-zinc-900">
        <div className="max-w-2xl mx-auto text-center">
          <p className="text-sm text-zinc-500 leading-relaxed">
            Deposely and Filevine help deposing counsel track goals.{" "}
            <span className="text-zinc-300 font-medium">
              DepoRadar is the only tool built for the other side of the table
            </span>{" "}
            — catching the objections you can&apos;t afford to miss.
          </p>
        </div>
      </section>

      {/* Features */}
      <section className="px-6 py-16 max-w-4xl mx-auto">
        <div className="grid gap-6 md:grid-cols-2">
          {[
            {
              icon: Zap,
              title: "8 precision detectors",
              desc: "Compound, vague, assumes facts, mischaracterizes, privilege probe, work product, argumentative, foundation. Each tuned for zero false positives.",
            },
            {
              icon: Shield,
              title: "Privilege shield",
              desc: 'Catches attorney-client and work product probes instantly. "Privilege. Instruct not to answer." — before the witness responds.',
            },
            {
              icon: Clock,
              title: "By hour 4, everyone misses things",
              desc: "Cognitive fatigue is real. DepoRadar maintains the same precision at hour 7 that you had at hour 1.",
            },
            {
              icon: FileText,
              title: "Post-depo digest",
              desc: "AI-generated summary: admissions, impeachment material, privilege risks, follow-ups. Each citing transcript line numbers. Saves 2-3 hours.",
            },
          ].map((item) => (
            <div
              key={item.title}
              className="p-5 rounded-lg border border-zinc-800 bg-zinc-900/50"
            >
              <item.icon className="h-5 w-5 text-amber-400 mb-3" />
              <h3 className="font-semibold text-zinc-200 mb-1">{item.title}</h3>
              <p className="text-sm text-zinc-500 leading-relaxed">{item.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Trust signals */}
      <section className="px-6 py-8 border-t border-zinc-900">
        <div className="max-w-2xl mx-auto flex flex-wrap justify-center gap-6 text-xs text-zinc-600">
          <span>No audio stored</span>
          <span>•</span>
          <span>You control data retention</span>
          <span>•</span>
          <span>Assistive only — not legal advice</span>
          <span>•</span>
          <span>30-day auto-delete</span>
        </div>
      </section>

      {/* Pricing */}
      <PricingCards />

      {/* Final CTA */}
      <section className="px-6 py-16 text-center border-t border-zinc-900">
        <h2 className="text-2xl font-bold text-zinc-100 mb-4">
          See it work in 90 seconds.
        </h2>
        <Link href="/demo">
          <Button size="lg" className="h-12 px-8 gap-2">
            Try the demo
            <ArrowRight className="h-4 w-4" />
          </Button>
        </Link>
      </section>

      {/* Footer */}
      <footer className="px-6 py-8 border-t border-zinc-900 text-center">
        <div className="flex items-center justify-center gap-2 mb-2">
          <Shield className="h-4 w-4 text-amber-400" />
          <span className="font-semibold text-sm text-zinc-300">DepoRadar</span>
        </div>
        <p className="text-xs text-zinc-600">
          Assistive issue-spotting tool. Not legal advice. Not a substitute for
          professional judgment.
        </p>
      </footer>
    </div>
  );
}
