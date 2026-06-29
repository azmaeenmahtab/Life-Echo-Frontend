import React from "react";
import Link from "next/link";
import { Trophy, BookOpen, Crown } from "lucide-react";
import { getTopWeeklyContributors } from "@/lib/api/admin/community";

/**
 * Home "Top Contributors of the Week (Dynamic)" section.
 *
 * Server component. Fetches the top authors ranked by lessons
 * written in the last 7 days via the
 * `/api/dashboard/top-weekly-contributors` endpoint and renders the
 * first three as a stacked panel — rank number on the left, avatar
 * + name + role/title in the middle, lessons-count chip on the
 * right.
 *
 * Mirrors the editorial palette used across the home page
 * (`Featured`, `WhyItMatters`):
 *   - bg `#F7F5F0`, border `#E8E2D2`
 *   - forest `#2C5E3B` for headings, brown `#8B7355` for accents
 *
 * Renders nothing when the contributor list is empty or missing so
 * the home layout doesn't show a hollow heading.
 */
export default async function TopContributors() {
  const contributors = await getTopWeeklyContributors({
    days: 7,
    limit: 3,
  });

  if (!Array.isArray(contributors) || contributors.length === 0) {
    return null;
  }

  const rows = contributors.slice(0, 3);
  const topCount = Number(rows[0]?.lessonsCount ?? 0);

  return (
    <section className="bg-[#F7F5F0] rounded-2xl border border-[#E8E2D2] p-6 md:p-8 flex flex-col h-full">
      {/* Header — eyebrow badge + title + brown underline + caption. */}
      <div className="mb-6">
        <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#F2EFE6] text-[#8B7355] text-[10px] font-bold uppercase tracking-widest font-sans mb-4">
          <Trophy size={13} strokeWidth={2} />
          This Week
        </span>
        <h3 className="text-2xl md:text-3xl font-serif font-bold text-[#2C5E3B] mb-3 leading-tight">
          Top Contributors of the Week
        </h3>
        <div className="w-20 h-0.75 bg-[#8B7355] rounded-full mb-3" />
        <p className="text-sm text-[#555555] font-sans">
          <span className="font-serif font-bold text-[#1E2E24]">
            {topCount}
          </span>{" "}
          {topCount === 1 ? "lesson" : "lessons"} by this week&apos;s most
          active author.
        </p>
      </div>

      {/* Three ranked rows. */}
      <ul className="space-y-4 flex-1">
        {rows.map((row, index) => {
          const rank = index + 1;
          const userId = row.userId;
          const displayName =
            row.name?.trim() ||
            (row.email ? row.email.split("@")[0] : null) ||
            "Unnamed author";
          const roleLine =
            row.title?.trim() || (row.role === "admin" ? "Admin" : "Member");

          // Crown on rank #1, plain numbers otherwise.
          const isLeader = rank === 1;
          const rankBg = isLeader
            ? "bg-[#8B7355] text-white"
            : "bg-[#E8E2D2] text-[#2C5E3B]";
          const rankGlyph = isLeader ? (
            <Crown size={14} strokeWidth={2} />
          ) : (
            `#${rank}`
          );

          const initial = (row.name || row.email || "?")
            .charAt(0)
            .toUpperCase();
          const lessons = Number(row.lessonsCount ?? 0);

          const profileHref = userId ? `/profile/${userId}` : "/profile";

          return (
            <li
              key={userId ?? `${row.email ?? "author"}-${rank}`}
              className="flex items-center gap-4"
            >
              {/* Rank badge */}
              <span
                className={`shrink-0 w-10 h-10 rounded-full flex items-center justify-center font-serif font-bold text-sm ${rankBg}`}
                aria-label={`Rank ${rank}`}
              >
                {rankGlyph}
              </span>

              {/* Avatar */}
              <span className="relative shrink-0 w-12 h-12 rounded-full overflow-hidden bg-[#1c2f24] text-[#e2f2e9] flex items-center justify-center font-serif font-bold text-base border border-[#E3DFD3]">
                {row.image ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={row.image}
                    alt={displayName}
                    className="w-full h-full object-cover"
                    loading="lazy"
                  />
                ) : (
                  initial
                )}
              </span>

              {/* Name + role */}
              <div className="flex-1 min-w-0">
                <Link
                  href={profileHref}
                  className="block text-base font-serif font-bold text-[#1E2E24] truncate hover:text-[#2C5E3B] transition-colors"
                  title={displayName}
                >
                  {displayName}
                </Link>
                <p className="text-xs font-sans text-[#707E74] truncate">
                  {roleLine}
                </p>
              </div>

              {/* Lessons-count chip */}
              <span className="shrink-0 inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white border border-[#E3DFD3] text-[11px] font-bold text-[#1E2E24] uppercase tracking-wider font-sans">
                <BookOpen size={12} strokeWidth={2.25} />
                {lessons} {lessons === 1 ? "lesson" : "lessons"}
              </span>
            </li>
          );
        })}
      </ul>
    </section>
  );
}
