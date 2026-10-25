// src/lib/fonts.ts
import { GeistSans } from "geist/font/sans";

// Same export names, so layout.tsx keeps working.
// GeistSans.variable defines --font-geist-sans, so we alias it below.
export const heading = GeistSans;
export const body = GeistSans;