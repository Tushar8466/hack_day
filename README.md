# ChargeMate ⚡

**Peer-to-peer EV charging for India.** Electric scooter and car owners find, book and pay for charging at verified households nearby, and home-charger owners earn by hosting.

Built for **Hacktoberfest Hack Day 2026** (NST, Pune) · **Track 1: Best Open-Source AI Project**

---

## The problem

Public EV charging in India is built mostly around cars. Many e-scooter owners rely on a portable charger and a normal home socket, but when the battery runs low they have nowhere to charge. Meanwhile, many households have spare sockets and a charger sitting idle.

## The idea

When a rider's charge is low, they open ChargeMate and see verified charging spots nearby. They book a slot, charge, pay and review. Hosts list their charger, set a price and get paid.

## Features

- Rider and Host modes in one account
- Map and list of nearby charging spots (OpenStreetMap)
- Booking flow with status tracking and double-booking protection
- Host profiles, reviews and ratings
- Wallet and payment records
- Vehicle profiles for riders
- Phone OTP and Google sign-in (Supabase Auth)
- Realtime booking updates (Supabase Realtime)
- Mock mode (`NEXT_PUBLIC_USE_MOCK=true`) so the demo works without a network

## Open-source AI

> **TODO before submitting: fill this in with what you actually built. Judges score this section (25%).**

| Item | Details |
|---|---|
| What the AI does | `<e.g. analyzes a photo of the host's socket and returns a safety score with reasons>` |
| Model | `<e.g. Qwen2-VL-7B-Instruct>` |
| Model license | `<e.g. Apache-2.0, check the model card>` |
| How it runs | `<Ollama locally / Hugging Face / Groq / OpenRouter>` |
| Why this model | `<one or two sentences>` |
| Where in the code | `<file path>` |

Only list models that are really used in the project.

## Tech stack and licenses

| Tool | Purpose | License |
|---|---|---|
| Next.js 14 | Web framework | MIT |
| React | UI library | MIT |
| TypeScript | Language | Apache-2.0 |
| Tailwind CSS | Styling | MIT |
| shadcn/ui, tw-animate-css | UI components, animations | MIT |
| lucide-react | Icons | ISC |
| Supabase (Postgres, Auth, Realtime, Storage) | Backend | Apache-2.0 |
| @supabase/supabase-js, @supabase/ssr | Client libraries | MIT |
| PostGIS | Geospatial queries (via Supabase) | GPL-2.0 |
| OpenStreetMap | Map data (© OpenStreetMap contributors) | ODbL |
| Geist | Font | SIL OFL 1.1 |
| Vitest | Tests | MIT |
| `<AI model / runtime>` | `<fill in>` | `<fill in>` |

Hosting: Vercel (not open source). Please verify any license above you are unsure about on the project's own page.

## Getting started

```bash
git clone <ADD GITHUB URL>
cd <repo-folder>
npm install
```

Create `.env.local` in the project root:

```
NEXT_PUBLIC_USE_MOCK=true
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-publishable-key
```

Run the app:

```bash
npm run dev
```

Open `http://localhost:3000`.

### Using a real database

1. Create a free project at [supabase.com](https://supabase.com).
2. In the SQL Editor (set to **Database**), run `supabase/migrations/20260801000000_init.sql`, then `supabase/seed.sql`.
3. Put your project URL and **publishable** key in `.env.local` and set `NEXT_PUBLIC_USE_MOCK=false`.
4. In Authentication > Providers, enable Phone (add a test number such as `919999999999=123456`) and/or Google.
5. Restart `npm run dev`.

Never commit `.env.local` and never use a Supabase secret key in frontend code.

## Project structure

```
src/
  app/          Next.js routes (login, search, host, bookings, ...)
  components/   UI components (landing, chargemate, host, ui)
  lib/          Supabase clients, data layer, auth and mode context
  mock/         Mock data for demo mode
  types/        Shared TypeScript types
supabase/
  migrations/   Database schema, policies, triggers
  seed.sql      Demo data (20 charging spots in Bengaluru and Pune)
```

## Safety note

Home charging carries electrical risk. Hosts should use a protected circuit with proper earthing. ChargeMate is a hackathon prototype and not a certified safety system.

## Team

- Tushar Singla
- Sunny Kushwaha
- Adhyatm Mudgal
- Dipendra Senapati

Newton School of Technology, Pune (NST, ADYPU)

## Disclosure on AI tools

AI coding assistants were used during development. These are **development tools, not part of the shipped product**, and some are not open source:

| Tool | Used for | Open source? |
|---|---|---|
| Claude Code | Scaffolding, debugging, Supabase setup review | No |
| Claude (chat) | Planning, prompts, troubleshooting | No |
| Antigravity | Code editing | No |

The team can explain the architecture, the database design and how each part works.

## License

Released under the MIT License. See [LICENSE](LICENSE).
