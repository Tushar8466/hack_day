# ChargeMate Supabase setup

The existing initial migration creates the schema, storage buckets, row-level security policies, booking state-machine functions, and Realtime publication. The follow-up `20260802000000_002_backend_hardening.sql` closes policy gaps and aligns the nearby-spots RPC with its required named arguments. The app remains in mock mode (`NEXT_PUBLIC_USE_MOCK=true`).

## Apply migrations

The Supabase project is `mcxgzdvesmibodjsphye` in `ap-south-1` (Mumbai). Choose one method:

1. In the Supabase SQL Editor, run `20260801000000_init.sql` first, then `20260802000000_002_backend_hardening.sql`, in that order.
2. Or link the CLI and push both migrations:

   ```sh
   npx supabase login
   npx supabase link --project-ref mcxgzdvesmibodjsphye
   npx supabase db push
   ```

The CLI may ask for the database password. Enter it in the CLI prompt; do not put it in a file or command argument.

## Configure local environment

Copy `.env.local.example` to `.env.local` and fill in the project URL, anon key, and service-role key from the Supabase dashboard. Keep `NEXT_PUBLIC_USE_MOCK=true` until the real-data integration is switched on deliberately. `.env.local` is ignored by Git.

## Seed demo data

Only run this after the migrations are applied and the real keys are in `.env.local`:

```sh
npx tsx scripts/seed.ts
```

The script creates 20 host users and five rider users, their profiles and wallets, host profiles, vehicles, charging spots, and 30 completed booking/payment/review records. It removes and recreates only Auth users with emails ending in `@seed.chargemate.test`; all generated profiles and related rows cascade from those Auth users. Spot ratings and review counts are maintained by the database trigger.

## Verify and generate types

Use the SQL checks in `supabase/VERIFY.md` after applying the migrations and seeding.

After the migration is applied, generate current Supabase client types into the new `types/` directory:

```sh
mkdir -p types
npx supabase gen types typescript --project-id mcxgzdvesmibodjsphye > types/supabase.ts
```

Keep `src/types/db.ts` unchanged. The current application type uses `reviews.reply`, while the schema adds the required `reviews.host_reply` and keeps `reply` synchronized for compatibility. Generated database types will expose both columns.
