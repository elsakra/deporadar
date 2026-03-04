# Production Checklist

## Security
- [ ] All API routes check auth (Supabase JWT)
- [ ] RLS policies enabled on all tables
- [ ] Service role key never exposed to client
- [ ] Stripe webhook signature verified
- [ ] PII redacted before LLM calls
- [ ] No raw audio stored

## Privacy
- [ ] 30-day data retention default
- [ ] One-tap session delete (cascade to all child records)
- [ ] Attorney affirmation on signup
- [ ] Audio compliance gate with checkbox consent
- [ ] Persistent banner during audio transcription

## Legal Disclaimers
- [ ] "Assistive issue-spotting only. Not legal advice." on auth + landing
- [ ] "Not a substitute for professional judgment" in footer
- [ ] No claims of legal accuracy in marketing copy
- [ ] Audio mode labeled "Beta"

## Payments
- [ ] Stripe Checkout session creation tested
- [ ] Webhook handles checkout.session.completed
- [ ] Webhook handles customer.subscription.deleted
- [ ] Usage gate blocks session 3 for free users
- [ ] Subscription status persisted in profiles table

## Analytics
- [ ] PostHog initialized in root layout
- [ ] Key events tracked: demo_started, demo_completed, signup_completed, first_paste, first_alert_fired, checkout_completed
- [ ] Funnels configured in PostHog dashboard

## Performance
- [ ] Analyze API responds in < 4 seconds
- [ ] LLM calls with timeout (10s max)
- [ ] Speaker parser handles 100+ line pastes
- [ ] Transcript feed scrolls smoothly with 500+ lines
