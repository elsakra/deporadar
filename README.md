# DepoRadar

Real-time objection radar for defending counsel. AI-powered detection of compound questions, privilege probes, and form defects during depositions.

## Quick Start

```bash
pnpm install
cp .env.local.example .env.local
# Fill in your Supabase, Stripe, and optional LLM keys
pnpm dev
```

## Architecture

- **Next.js 15** (App Router, React 19)
- **Tailwind CSS + shadcn/ui** (dark-first, mobile-optimized)
- **Supabase** (Auth, Postgres, RLS)
- **Stripe** (self-serve checkout, webhooks)
- **OpenAI / Anthropic** (LLM refiner + digest generation, optional)
- **Deepgram** (audio mode, optional)
- **PostHog** (analytics, optional)

## Database Setup

Run `docs/supabase.sql` in the Supabase SQL Editor to create tables and RLS policies.

## Key Screens

| Route | Purpose |
|-------|---------|
| `/` | Landing page with demo CTA and pricing |
| `/demo` | 90-second interactive demo (no signup) |
| `/auth` | Magic link + Google OAuth sign-in |
| `/sessions` | Session dashboard |
| `/session/[id]` | Live deposition session |
| `/session/[id]/review` | Post-session digest + export |

## How It Works

1. Attorney pastes transcript text from CaseViewNet (real-time court reporter feed)
2. Speaker-label parser handles Q./A., line numbers, colloquy, all standard formats
3. 8 heuristic matchers analyze each question line (compound, vague, privilege probe, etc.)
4. Optional LLM refiner suppresses false positives and refines rationale
5. Radar alerts appear using exact attorney phrasing ("Object to form -- compound.")
6. Post-session: AI-generated digest with key admissions, privilege risks, and follow-ups

## Environment Variables

See `.env.local.example` for all required and optional variables.

## Deploy

```bash
# Vercel (recommended)
vercel deploy
```

Set environment variables in Vercel dashboard. Supabase project on free tier works for MVP.
