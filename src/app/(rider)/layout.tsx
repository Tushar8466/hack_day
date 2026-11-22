// app/(rider)/layout.tsx
// Placeholder shell for all Charge (rider) mode screens.
// Person 2 owns this file — replace the header internals as needed.
// Do NOT change the route group name or the ModeProvider import.

import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { createServerClient } from "@/lib/supabase/server";
import Link from "next/link";
import { Zap } from "lucide-react";
import { ModeProvider } from "@/lib/mode-context";
import { ModeSwitcher } from "@/components/chargemate";
import { SignOutButton } from "@/components/auth/sign-out-button";

export const metadata: Metadata = {
  title: {
    default: "Charge — ChargeMate",
    template: "%s | Charge · ChargeMate",
  },
};

export default async function RiderLayout({ children }: { children: React.ReactNode }) {
  if (process.env.NEXT_PUBLIC_USE_MOCK !== "true") {
    const supabase = await createServerClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) redirect("/login");
  }
  return (
    <ModeProvider defaultMode="charge">
      <div className="min-h-screen bg-background flex flex-col">

        {/* ── Header — Person 2: replace internals, keep outer shell ── */}
        <header
          id="rider-header"
          className="sticky top-0 z-40 bg-card border-b border-border shadow-sm"
        >
          <div className="max-w-screen-md mx-auto px-gutter h-14 flex items-center justify-between gap-4">
            {/* Logo / wordmark */}
            <Link
              href="/charge"
              className="flex items-center gap-2 font-heading text-headline-sm text-forest"
              aria-label="ChargeMate home"
            >
              <Zap className="size-5 text-charge" aria-hidden />
              ChargeMate
            </Link>

            {/* Mode switcher pill — syncs across rider + host layouts */}
            <div className="flex items-center gap-3">
              <ModeSwitcher />
              <SignOutButton />
            </div>
          </div>
        </header>

        {/* ── Page content ── */}
        <main id="rider-main" className="flex-1">
          {children}
        </main>

        {/* ── Bottom navigation — Person 2: fill this in ── */}
        <nav
          id="rider-bottom-nav"
          aria-label="Rider navigation"
          className="sticky bottom-0 z-40 bg-card border-t border-border"
        >
          <div className="max-w-screen-md mx-auto px-gutter h-16 flex items-center justify-around gap-2">
            {/* TODO Person 2: Map | Active Session | Garage | Profile tabs */}
            <span className="font-body text-body-sm text-muted-foreground italic">
              Nav — Person 2
            </span>
          </div>
        </nav>

      </div>
    </ModeProvider>
  );
}
