# ProdLines

A dashboard that shows production code ownership across your engineering team. Connect GitHub repos and see who owns the most lines currently in production—only merged code counts.

## What it does

- **Production LOC leaderboard** — Real ownership metrics based on what’s actually shipped, not vanity stats
- **Multi-repo dashboard** — Connect several repos and see an overview across your team
- **Trend tracking** — Compare snapshots over time to see how LOC and contributor counts change
- **Notifications** — Email, Discord, and Slack alerts when stats sync
- **Read-only access** — Uses GitHub OAuth; no tokens stored and no writes to your repos

## Tech stack

- **Next.js 16** (App Router) · **React 19**
- **Supabase** — Auth (GitHub OAuth), Postgres, RLS
- **TanStack Query** · **Redux Toolkit**
- **Tailwind CSS** · **Radix UI**
- **Vercel** — Hosting & Analytics

## Getting started

1. Clone and install:

   ```bash
   npm install
   ```

2. Add environment variables (see `.env.example` if present, or create `.env.local` with `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`, and configure Supabase Auth for GitHub OAuth).

3. Run the dev server:

   ```bash
   npm run dev
   ```

4. Open [http://localhost:3000](http://localhost:3000).
