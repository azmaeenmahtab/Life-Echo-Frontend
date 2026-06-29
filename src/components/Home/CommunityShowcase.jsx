import React from "react";
import TopContributors from "./TopContributors";
import CommunityFavorites from "./CommunityFavorites";

/**
 * Home "community showcase" container.
 *
 * Renders the two dynamic home-page panels side-by-side:
 *   - left:  TopContributors (top weekly authors by lessons)
 *   - right: CommunityFavorites (most-saved lessons)
 *
 * Both children are async server components; this wrapper itself
 * is a plain server component so it can pass-through their data
 * fetches without any client-side boundary.
 *
 * The outer grid collapses to a single column on mobile
 * (Tailwind `grid-cols-1 md:grid-cols-2`) so each panel gets full
 * width on small screens. The 1px gap creates breathing room
 * between the two cream panels against the page background.
 *
 * If both children render `null` (no data yet), the outer wrapper
 * still renders nothing visible thanks to the empty `gap-6`
 * container — but having an empty section header above the grid
 * would be jarring, so we leave `mt-*` off and let the children
 * surface their own headers.
 */
export default function CommunityShowcase() {
  return (
    <section className="py-16 px-4 max-w-7xl mx-auto">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-stretch">
        <TopContributors />
        <CommunityFavorites />
      </div>
    </section>
  );
}
