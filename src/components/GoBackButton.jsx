"use client";

import React from "react";

/**
 * The "Go back" CTA on the global 404 page. Extracted into its own
 * client component because it needs an `onClick` handler to call
 * `window.history.back()`, and event handlers cannot be passed from
 * Server Components.
 *
 * The rest of `not-found.jsx` stays a Server Component so the page
 * streams without shipping any JS for the static layout, gradient
 * panel, and "Back to home" link.
 */
const GoBackButton = () => {
  return (
    <button
      type="button"
      onClick={() => {
        if (typeof window !== "undefined") {
          window.history.back();
        }
      }}
      className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-full bg-white hover:bg-[#FAF8F5] border border-[#EBE7D9] text-[#1E2E24] text-sm font-semibold transition-colors"
    >
      <svg
        className="w-4 h-4"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
        aria-hidden="true"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M10 19l-7-7m0 0l7-7m-7 7h18"
        />
      </svg>
      Go back
    </button>
  );
};

export default GoBackButton;
