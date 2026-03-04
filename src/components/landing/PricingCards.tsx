"use client";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Check } from "lucide-react";
import Link from "next/link";

const plans = [
  {
    name: "Pro",
    price: "$99",
    period: "/mo",
    description: "For individual attorneys",
    features: [
      "Unlimited deposition sessions",
      "Real-time radar alerts (8 detectors)",
      "Post-session AI digest with line citations",
      "PDF export",
      "Text feed + audio mode",
      "Email digest sharing",
    ],
    cta: "Start free — 2 sessions",
    popular: true,
  },
  {
    name: "Team",
    price: "$249",
    period: "/mo",
    description: "Up to 5 attorneys",
    features: [
      "Everything in Pro",
      "5 seats included",
      "Shared session library",
      "Team admin dashboard",
      "Priority support",
    ],
    cta: "Start free — 2 sessions",
    popular: false,
  },
];

export function PricingCards() {
  return (
    <div id="pricing" className="py-16 px-4">
      <div className="text-center mb-10">
        <h2 className="text-2xl font-bold text-zinc-100 mb-2">
          Simple pricing. Cancel anytime.
        </h2>
        <p className="text-sm text-zinc-500">
          Less than what most firms pay per attorney for case management.
        </p>
      </div>
      <div className="max-w-3xl mx-auto grid gap-6 md:grid-cols-2">
        {plans.map((plan) => (
          <div
            key={plan.name}
            className={`rounded-xl border p-6 ${
              plan.popular
                ? "border-amber-600/50 bg-amber-950/10"
                : "border-zinc-800 bg-zinc-900/50"
            }`}
          >
            <div className="flex items-center gap-2 mb-3">
              <h3 className="text-lg font-bold text-zinc-100">{plan.name}</h3>
              {plan.popular && (
                <Badge className="bg-amber-500/10 text-amber-400 border-amber-600/30 text-[10px]">
                  MOST POPULAR
                </Badge>
              )}
            </div>
            <div className="mb-1">
              <span className="text-3xl font-bold text-zinc-100">
                {plan.price}
              </span>
              <span className="text-zinc-500">{plan.period}</span>
            </div>
            <p className="text-xs text-zinc-500 mb-4">{plan.description}</p>
            <Badge
              variant="outline"
              className="mb-4 text-[10px] border-zinc-700 text-zinc-400"
            >
              Launch pricing — locks in your rate
            </Badge>
            <ul className="space-y-2 mb-6">
              {plan.features.map((f) => (
                <li key={f} className="flex items-start gap-2 text-sm text-zinc-400">
                  <Check className="h-4 w-4 text-emerald-500 shrink-0 mt-0.5" />
                  {f}
                </li>
              ))}
            </ul>
            <Link href="/auth">
              <Button
                className={`w-full ${
                  plan.popular
                    ? ""
                    : "bg-zinc-800 hover:bg-zinc-700 text-zinc-200"
                }`}
              >
                {plan.cta}
              </Button>
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
}
