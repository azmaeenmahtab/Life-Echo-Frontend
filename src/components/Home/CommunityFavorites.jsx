import React from "react";
import Link from "next/link";
import { Bookmark, Heart, ArrowUpRight } from "lucide-react";
import { getMostSavedLessons } from "@/lib/api/admin/community";

/**
 * Home "Community Favorites (Dynamic)" section.
 *
 * Server component. Fetches the top lessons ranked by `savesCount`
 * via `/api/dashboard/most-saved-lessons` and renders the first three
 * as horizontal thumbnail cards: 4:3 cover image, title, "by
 * {creator}", and a heart-icon save count.
 *
 * Visual palette mirrors `Featured` and `TopContributors`:
 *   - bg `#F7F5F0`, border `#E8E2D2`
 *   - forest `#2C5E3B` for headings, brown `#8B7355` for accents
 *
 * Renders nothing when the list is empty.
 */
export default async function CommunityFavorites() {
  const lessons = await getMostSavedLessons({ limit: 3 });

  if (!Array.isArray(lessons) || lessons.length === 0) {
    return null;
  }

  const cards = lessons.slice(0, 3);
  const topSaves = Number(cards[0]?.savesCount ?? 0);

  return (
    <section className="bg-[#F7F5F0] rounded-2xl border border-[#E8E2D2] p-6 md:p-8 flex flex-col h-full">
      {/* Header — eyebrow badge + title + brown underline + caption. */}
      <div className="mb-6">
        <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#E8EFE6] text-[#2C5E3B] text-[10px] font-bold uppercase tracking-widest font-sans mb-4">
          <Bookmark size={13} strokeWidth={2} />
          Most Saved
        </span>
        <h3 className="text-2xl md:text-3xl font-serif font-bold text-[#2C5E3B] mb-3 leading-tight">
          Community Favorites
        </h3>
        <div className="w-20 h-0.75 bg-[#8B7355] rounded-full mb-3" />
        <p className="text-sm text-[#555555] font-sans">
          <span className="font-serif font-bold text-[#1E2E24]">
            {formatCount(topSaves)}
          </span>{" "}
          saves on our most-loved story this week.
        </p>
      </div>

      {/* Three thumbnail cards, stacked vertically. */}
      <ul className="space-y-4 flex-1">
        {cards.map((row, index) => {
          const lessonId = row.lessonId ?? row._id ?? row.id ?? null;
          const title = row.title?.trim() || "Untitled lesson";
          const creatorName = row.creatorName?.trim() || "Anonymous";
          const creatorImage = row.creatorImage || null;
          const initial = creatorName.charAt(0).toUpperCase();
          const imageUrl = row.imageUrl || null;
          const saves = Number(row.savesCount ?? 0);

          const href = lessonId ? `/lessons/details/${lessonId}` : "/lessons";

          return (
            <li key={lessonId ?? `${title}-${index}`}>
              <Link
                href={href}
                className="group flex items-center gap-4 p-3 rounded-xl bg-white border border-[#E8E2D2] hover:border-[#8B7355] hover:shadow-md transition-all duration-200"
                aria-label={`Read ${title} by ${creatorName}`}
              >
                {/* 4:3 thumbnail with initial fallback. */}
                <span className="relative shrink-0 w-24 h-20 rounded-lg overflow-hidden bg-[#EBE7D9] flex items-center justify-center text-[#8B7355] font-serif italic">
                  {imageUrl ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={imageUrl}
                      alt={title}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                      loading="lazy"
                    />
                  ) : (
                    <span className="text-2xl">{initial}</span>
                  )}
                </span>

                {/* Title + creator + save count */}
                <div className="flex-1 min-w-0">
                  <h4 className="text-sm md:text-base font-serif font-bold text-[#1E2E24] leading-snug line-clamp-2 group-hover:text-[#2C5E3B] transition-colors">
                    {title}
                  </h4>
                  <div className="mt-1 flex items-center gap-2 min-w-0">
                    <span className="shrink-0 w-5 h-5 rounded-full overflow-hidden bg-[#1c2f24] text-[#e2f2e9] flex items-center justify-center font-serif font-bold text-[10px] border border-[#E3DFD3]">
                      {creatorImage ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img
                          src={creatorImage}
                          alt={creatorName}
                          className="w-full h-full object-cover"
                          loading="lazy"
                        />
                      ) : (
                        initial
                      )}
                    </span>
                    <span className="text-xs font-sans text-[#707E74] truncate">
                      by{" "}
                      <span className="font-bold text-[#1E2E24]">
                        {creatorName}
                      </span>
                    </span>
                  </div>
                </div>

                {/* Save count chip + arrow (visible on hover) */}
                <span className="shrink-0 flex flex-col items-center gap-1 min-w-[60px]">
                  <span className="inline-flex items-center justify-center gap-1 px-2.5 py-1 rounded-full bg-[#F2EFE6] border border-[#E3DFD3] text-[#8B7355] text-[11px] font-bold font-sans">
                    <Heart
                      size={12}
                      strokeWidth={2.25}
                      className="fill-current"
                    />
                    {formatCount(saves)}
                  </span>
                  <ArrowUpRight
                    size={14}
                    strokeWidth={2}
                    className="text-[#707E74] opacity-0 group-hover:opacity-100 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all duration-200"
                  />
                </span>
              </Link>
            </li>
          );
        })}
      </ul>
    </section>
  );
}

/**
 * Compact counter renderer for the save-count chip:
 *   999      -> "999"
 *   1_200    -> "1.2k"
 *   12_500   -> "12.5k"
 *   250_000  -> "250k"
 *   1_500_000 -> "1.5M"
 *
 * Returns "0" when the value is missing or non-numeric.
 */
function formatCount(value) {
  const n = Number(value);
  if (!Number.isFinite(n) || n <= 0) return "0";
  if (n < 1_000) return String(n);

  if (n < 1_000_000) {
    const divided = n / 1_000;
    // Cap to one decimal, strip trailing ".0".
    const fixed = divided.toFixed(1).replace(/\.0$/, "");
    return `${fixed}k`;
  }

  const divided = n / 1_000_000;
  const fixed = divided.toFixed(1).replace(/\.0$/, "");
  return `${fixed}M`;
}
