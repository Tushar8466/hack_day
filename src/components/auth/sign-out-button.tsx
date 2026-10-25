"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createBrowserClient } from "@/lib/supabase/client";
import { signOut as signOutMock } from "@/lib/data/auth";
import { useAuth } from "@/lib/auth-context";

const USE_MOCK = process.env.NEXT_PUBLIC_USE_MOCK === "true";

export function SignOutButton() {
  const router = useRouter();
  const { setUser } = useAuth();
  const [error, setError] = useState("");

  async function handleSignOut() {
    setError("");
    try {
      if (USE_MOCK) {
        await signOutMock();
      } else {
        const { error: signOutError } = await createBrowserClient().auth.signOut();
        if (signOutError) throw signOutError;
      }
      setUser(null);
      router.replace("/login");
      router.refresh();
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : "Could not sign out. Please try again.");
    }
  }

  return (
    <div className="flex flex-col items-end">
      <button
        type="button"
        onClick={handleSignOut}
        className="rounded-lg px-3 py-2 text-sm font-medium text-muted-foreground hover:bg-recessed hover:text-foreground transition-colors"
      >
        Sign out
      </button>
      {error && <span role="alert" className="text-xs text-destructive">{error}</span>}
    </div>
  );
}
