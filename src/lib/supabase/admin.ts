// Server-only Supabase service-role client. Never import this module in browser code.
import { createClient } from "@supabase/supabase-js";
import type { Database } from "./types";

if (typeof window !== "undefined") {
  throw new Error("The Supabase service-role client must only be imported in server code.");
}

export function createAdminClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !key) throw new Error("Missing Supabase admin env vars.");

  return createClient<Database>(url, key, {
    auth: { autoRefreshToken: false, persistSession: false },
  });
}
