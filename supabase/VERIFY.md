# Supabase verification checklist

Run these queries in the Supabase SQL Editor after applying the migrations. The seed-dependent nearby search check requires the seed script to have completed.

## Confirm the eight tables and RLS

This query returns one row per required table. Every row should have `exists = true` and `rls_enabled = true`.

```sql
WITH required(table_name) AS (
  VALUES
    ('profiles'), ('vehicles'), ('host_profiles'), ('charging_spots'),
    ('bookings'), ('payments'), ('reviews'), ('wallets')
)
SELECT required.table_name,
       tables.tablename IS NOT NULL AS exists,
       COALESCE(tables.rowsecurity, false) AS rls_enabled
FROM required
LEFT JOIN pg_tables AS tables
  ON tables.schemaname = 'public'
 AND tables.tablename = required.table_name
ORDER BY required.table_name;
```

## Confirm the nearby search returns seed spots

Expected: at least one row near Bengaluru coordinates after seeding.

```sql
SELECT id, title, locality, city, distance_km
FROM public.nearby_spots(12.97, 77.64, 10);
```

## Confirm storage buckets

This query should return `id-documents` as private and `spot-photos` and `avatars` as public.

```sql
SELECT id, name, public
FROM storage.buckets
WHERE id IN ('id-documents', 'spot-photos', 'avatars')
ORDER BY id;
```

## Optional: inspect booking access policies

There should be no `UPDATE` policy on bookings, and rider inserts must require `requested` status.

```sql
SELECT policyname, cmd, qual, with_check
FROM pg_policies
WHERE schemaname = 'public' AND tablename = 'bookings'
ORDER BY cmd, policyname;
```
