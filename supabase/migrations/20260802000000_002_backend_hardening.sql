-- Tighten policies and align the original schema with the backend requirements.

-- Keep both spellings while the app still uses `reply`; new database consumers
-- can use the clearer `host_reply` name. A trigger keeps either field writable.
ALTER TABLE public.reviews ADD COLUMN IF NOT EXISTS host_reply text;
UPDATE public.reviews SET host_reply = reply WHERE host_reply IS NULL AND reply IS NOT NULL;

CREATE OR REPLACE FUNCTION public.sync_review_reply_columns()
RETURNS trigger
LANGUAGE plpgsql
AS $$
BEGIN
  IF TG_OP = 'INSERT' THEN
    IF NEW.host_reply IS NULL THEN
      NEW.host_reply := NEW.reply;
    ELSIF NEW.reply IS NULL THEN
      NEW.reply := NEW.host_reply;
    END IF;
  ELSIF NEW.host_reply IS DISTINCT FROM OLD.host_reply THEN
    NEW.reply := NEW.host_reply;
  ELSIF NEW.reply IS DISTINCT FROM OLD.reply THEN
    NEW.host_reply := NEW.reply;
  END IF;
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS trg_sync_review_reply_columns ON public.reviews;
CREATE TRIGGER trg_sync_review_reply_columns
  BEFORE INSERT OR UPDATE OF reply, host_reply ON public.reviews
  FOR EACH ROW EXECUTE FUNCTION public.sync_review_reply_columns();

-- nearby_spots must respect caller RLS and expose named arguments for RPC calls.
DROP FUNCTION IF EXISTS public.nearby_spots(double precision, double precision, double precision, public.connector_type, boolean);
CREATE FUNCTION public.nearby_spots(
  p_lat double precision,
  p_lng double precision,
  p_radius_km double precision DEFAULT 10,
  p_connector public.connector_type DEFAULT NULL,
  p_only_online boolean DEFAULT true
) RETURNS TABLE (
  id uuid, host_id uuid, title text, lat numeric, lng numeric,
  address text, locality text, city text, power_kw numeric,
  connector public.connector_type, price_per_kwh numeric, photos text[],
  rules text, available_from time, available_to time,
  is_online boolean, rating numeric, review_count integer,
  created_at timestamptz, updated_at timestamptz, distance_km double precision
)
LANGUAGE sql STABLE SECURITY INVOKER
SET search_path = public, extensions
AS $$
  SELECT cs.id, cs.host_id, cs.title, cs.lat, cs.lng,
    cs.address, cs.locality, cs.city, cs.power_kw, cs.connector,
    cs.price_per_kwh, cs.photos, cs.rules, cs.available_from, cs.available_to,
    cs.is_online, cs.rating, cs.review_count, cs.created_at, cs.updated_at,
    (ST_Distance(cs.location, ST_SetSRID(ST_MakePoint(p_lng, p_lat), 4326)::geography) / 1000.0)::double precision
  FROM public.charging_spots AS cs
  WHERE ST_DWithin(
      cs.location,
      ST_SetSRID(ST_MakePoint(p_lng, p_lat), 4326)::geography,
      p_radius_km * 1000.0
    )
    AND (NOT p_only_online OR cs.is_online)
    AND (p_connector IS NULL OR cs.connector = p_connector)
  ORDER BY ST_Distance(cs.location, ST_SetSRID(ST_MakePoint(p_lng, p_lat), 4326)::geography);
$$;
REVOKE ALL ON FUNCTION public.nearby_spots(double precision, double precision, double precision, public.connector_type, boolean) FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION public.nearby_spots(double precision, double precision, double precision, public.connector_type, boolean) TO authenticated;

-- Riders can request only new bookings. State transitions stay in RPC functions.
DROP POLICY IF EXISTS "bookings: rider insert" ON public.bookings;
CREATE POLICY "bookings: rider insert requested" ON public.bookings
  FOR INSERT WITH CHECK (auth.uid() = rider_id AND status = 'requested');
DROP POLICY IF EXISTS "bookings: rider update own" ON public.bookings;
DROP POLICY IF EXISTS "bookings: host update own spots" ON public.bookings;

-- Give hosts only the rider identity and selected vehicle attached to their bookings.
CREATE POLICY "profiles: host read booking rider" ON public.profiles FOR SELECT
  USING (EXISTS (
    SELECT 1 FROM public.bookings b
    JOIN public.charging_spots s ON s.id = b.spot_id
    WHERE b.rider_id = profiles.id AND s.host_id = auth.uid()
  ));
CREATE POLICY "vehicles: host read booking vehicle" ON public.vehicles FOR SELECT
  USING (EXISTS (
    SELECT 1 FROM public.bookings b
    JOIN public.charging_spots s ON s.id = b.spot_id
    WHERE b.vehicle_id = vehicles.id AND s.host_id = auth.uid()
  ));

-- Wallets are client-readable by their owner; mutations are server-side only.
DROP POLICY IF EXISTS "wallets: owner update" ON public.wallets;

-- Storage updates are writes too, so they must stay inside the owner's folder.
CREATE POLICY "id-docs: owner update" ON storage.objects FOR UPDATE
  USING (bucket_id = 'id-documents' AND auth.uid()::text = (storage.foldername(name))[1])
  WITH CHECK (bucket_id = 'id-documents' AND auth.uid()::text = (storage.foldername(name))[1]);
CREATE POLICY "spots: owner update" ON storage.objects FOR UPDATE
  USING (bucket_id = 'spot-photos' AND auth.uid()::text = (storage.foldername(name))[1])
  WITH CHECK (bucket_id = 'spot-photos' AND auth.uid()::text = (storage.foldername(name))[1]);
CREATE POLICY "avatars: owner update" ON storage.objects FOR UPDATE
  USING (bucket_id = 'avatars' AND auth.uid()::text = (storage.foldername(name))[1])
  WITH CHECK (bucket_id = 'avatars' AND auth.uid()::text = (storage.foldername(name))[1]);

-- Recalculate aggregates for inserts, edits, booking reassignment, and deletes.
CREATE OR REPLACE FUNCTION public.refresh_spot_rating()
RETURNS trigger LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
DECLARE
  v_spot_to_refresh uuid;
  v_spot_id uuid;
  v_old_spot_id uuid;
BEGIN
  IF TG_OP <> 'INSERT' THEN
    SELECT b.spot_id INTO v_old_spot_id FROM public.bookings b WHERE b.id = OLD.booking_id;
  END IF;
  IF TG_OP <> 'DELETE' THEN
    SELECT b.spot_id INTO v_spot_id FROM public.bookings b WHERE b.id = NEW.booking_id;
  END IF;

  FOR v_spot_to_refresh IN
    SELECT DISTINCT affected.spot_id
    FROM unnest(ARRAY[v_spot_id, v_old_spot_id]) AS affected(spot_id)
    WHERE affected.spot_id IS NOT NULL
  LOOP
    UPDATE public.charging_spots AS s SET
      rating = COALESCE((
        SELECT ROUND(AVG(r.rating)::numeric, 1)
        FROM public.reviews r JOIN public.bookings b ON b.id = r.booking_id
        WHERE b.spot_id = v_spot_to_refresh
      ), 0),
      review_count = (
        SELECT COUNT(*)::integer
        FROM public.reviews r JOIN public.bookings b ON b.id = r.booking_id
        WHERE b.spot_id = v_spot_to_refresh
      )
    WHERE s.id = v_spot_to_refresh;
  END LOOP;
  IF TG_OP = 'DELETE' THEN RETURN OLD; END IF;
  RETURN NEW;
END;
$$;
DROP TRIGGER IF EXISTS trg_refresh_spot_rating ON public.reviews;
CREATE TRIGGER trg_refresh_spot_rating
  AFTER INSERT OR UPDATE OF rating, booking_id OR DELETE ON public.reviews
  FOR EACH ROW EXECUTE FUNCTION public.refresh_spot_rating();
