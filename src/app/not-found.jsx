import React from "react";
import Link from "next/link";
import GoBackButton from "../components/GoBackButton";

/**
 * Global 404 — Next.js renders this for every unmatched route in the
 * App Router. Lives at `src/app/not-found.jsx` so it gets picked up
 * automatically; no per-route setup needed.
 *
 * Visual style intentionally mirrors the auth screens (see
 * `Login.jsx` / `SignUp.jsx`):
 *   - cream page background (`#FAF8F5`)
 *   - forest/sage gradient hero panel for the "404" mark
 *   - glassmorphic card, ambient blurred glows, font-poppins
 *   - rounded-3xl, sand border, the same shadow recipe
 *
 * Two CTAs — "Back to home" and "Go back" — give the visitor an exit
 * even when JavaScript / hydration hasn't run yet (e.g. on a hard
 * server-rendered miss).
 */
const NotFound = () => {
  return (
    <div className="min-h-screen bg-[#FAF8F5] flex items-center justify-center px-4 py-16 relative overflow-hidden selection:bg-[#4D7C5D]/20 font-poppins">
      {/* Ambient blurred glows — same recipe used on the auth pages */}
      <div className="absolute top-1/4 -left-20 w-80 h-80 bg-[#4D7C5D]/10 rounded-full blur-[100px] pointer-events-none" />
      <div className="absolute bottom-1/4 -right-20 w-80 h-80 bg-[#2D6A4F]/10 rounded-full blur-[100px] pointer-events-none" />

      <div className="relative z-10 w-full max-w-2xl bg-white/60 backdrop-blur-2xl rounded-3xl border border-[#EBE7D9] shadow-[0_20px_50px_rgba(0,0,0,0.06)] overflow-hidden grid grid-cols-1 md:grid-cols-12">
        {/* Left panel: the "404" mark on the forest gradient.
            Same gradient as the auth hero panels so the visual
            language stays consistent across the app. */}
        <div className="md:col-span-5 bg-linear-to-b from-[#C9D6EA]/60 to-[#4D7C5D]/90 p-8 flex flex-col items-center justify-center text-white relative">
          <div className="absolute inset-0 bg-white/5 backdrop-blur-[2px] pointer-events-none" />

          <div className="relative z-10 text-center">
            <p className="text-[10px] font-sans font-bold tracking-[0.3em] uppercase text-white/80 mb-3">
              Error 404
            </p>
            <h1 className="text-7xl font-serif font-black tracking-tight leading-none text-white drop-shadow-sm">
              4
              <span className="inline-block mx-1 align-middle text-white/80">
                0
              </span>
              4
            </h1>
            <p className="mt-4 text-xs text-white/90 leading-relaxed font-normal max-w-50 mx-auto">
              The page you&apos;re looking for has wandered off the path.
            </p>
          </div>
        </div>

        {/* Right panel: copy + CTAs */}
        <div className="md:col-span-7 p-8 md:p-10 flex flex-col justify-center bg-white/40">
          <p className="text-[11px] font-sans font-bold tracking-[0.25em] uppercase text-[#4D7C5D] mb-3">
            Lost in the echo
          </p>

          <h2 className="text-3xl md:text-4xl font-serif font-bold text-[#1E2E24] leading-tight mb-3">
            We couldn&apos;t find that page.
          </h2>

          <p className="text-sm text-[#556359] leading-relaxed mb-8 max-w-md">
            The link may be broken, the page may have been moved, or it may
            never have existed. Let&apos;s get you back to something that does.
          </p>

          <div className="flex flex-col sm:flex-row gap-3">
            <Link
              href="/"
              className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-full bg-[#1E2E24] hover:bg-[#2D6A4F] text-white text-sm font-semibold transition-colors shadow-sm"
            >
              <svg
                className="w-4 h-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
                />
              </svg>
              Back to home
            </Link>

            <GoBackButton />
          </div>

          <p className="mt-8 text-[11px] text-[#707E74] tracking-wide">
            Need help?{" "}
            <Link
              href="/home"
              className="text-[#4D7C5D] hover:text-[#2D6A4F] font-semibold underline-offset-2 hover:underline"
            >
              Browse lessons
            </Link>{" "}
            or{" "}
            <Link
              href="/pricing"
              className="text-[#4D7C5D] hover:text-[#2D6A4F] font-semibold underline-offset-2 hover:underline"
            >
              view pricing
            </Link>
            .
          </p>
        </div>
      </div>
    </div>
  );
};

export default NotFound;
