import React from "react";
import Link from "next/link";
import { Sparkles, ArrowUpRight } from "lucide-react";
import { getFeaturedLessons } from "@/lib/api/lesson";

/**
 * Home "Featured Lessons" section.
 *
 * Server component — fetches the lessons an admin has marked with
 * `isFeatured: true` and renders the first three as editorial-style
 * cards. When the collection is empty (no featured lessons yet, or the
 * backend is unreachable) the section renders nothing so the home
 * layout doesn't show a hollow heading.
 */
export default async function Featured() {
  const featured = await getFeaturedLessons({ limit: 3 });

  if (!Array.isArray(featured) || featured.length === 0) {
    return null;
  }

  const cards = featured.slice(0, 3);

  return (
    <section className="py-16 px-4 max-w-7xl mx-auto flex flex-col items-center">
      {/* Section header — mirrors WhyItMatters for visual rhythm. */}
      <div className="text-center mb-12">
        <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#E8EFE6] text-[#2C5E3B] text-xs font-bold uppercase tracking-widest font-sans mb-4">
          <Sparkles size={14} strokeWidth={2} />
          Editor&apos;s Picks
        </span>
        <h2 className="text-3xl md:text-4xl font-serif font-bold text-[#2C5E3B] mb-3">
          Featured Lessons
        </h2>
        <div className="w-24 h-0.75 bg-[#8B7355] mx-auto rounded-full" />
        <p className="text-sm md:text-base text-[#555555] font-sans mt-4 max-w-2xl mx-auto">
          Hand-picked stories our community has found unforgettable.
        </p>
      </div>

      {/* Card grid — three columns on desktop, stacks on mobile. */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full">
        {cards.map((lesson) => {
          const lessonId = lesson?._id ?? lesson?.id;
          const title = lesson?.title ?? "Untitled lesson";
          const story = lesson?.story ?? "";
          const description = stripExcerpt(story, 160);
          const category = lesson?.category ?? "lesson";
          const tone = lesson?.emotionalTone;
          const imageUrl = lesson?.imageUrl;
          const creatorName = lesson?.creatorName ?? "Anonymous";
          const creatorAvatar =
            lesson?.creatorProfilePic ??
            lesson?.creatorImage ??
            "/default-avatar.png";

          return (
            <article
              key={lessonId}
              className="group bg-[#F7F5F0] rounded-2xl overflow-hidden border border-[#E8E2D2] transition-all duration-300 hover:-translate-y-1 hover:shadow-lg flex flex-col"
            >
              {/* Cover image with category badge overlay. */}
              <div className="relative w-full aspect-4/3 overflow-hidden bg-[#EBE7D9]">
                {imageUrl ? (
                  <img
                    src={imageUrl}
                    alt={title}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                    loading="lazy"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-[#8B7355] font-serif italic text-lg">
                    {title}
                  </div>
                )}

                <span className="absolute top-3 left-3 inline-flex items-center px-2.5 py-1 rounded-full bg-white/90 backdrop-blur-sm text-[10px] font-bold uppercase tracking-widest text-[#2C5E3B] font-sans">
                  {formatCategory(category)}
                </span>
              </div>

              {/* Card body */}
              <div className="flex flex-col gap-3 p-5 flex-1">
                <h3 className="text-lg font-serif font-bold text-[#1C1C1C] leading-snug line-clamp-2">
                  {title}
                </h3>

                <p className="text-sm text-[#555555] font-sans leading-relaxed line-clamp-2">
                  {description}
                </p>

                {tone ? (
                  <span className="self-start text-[10px] font-bold uppercase tracking-widest text-[#8B7355] font-sans">
                    {tone}
                  </span>
                ) : null}

                {/* Footer: creator avatar + name, plus details link. */}
                <div className="mt-auto pt-4 border-t border-[#E8E2D2] flex items-center justify-between gap-3">
                  <div className="flex items-center gap-2.5 min-w-0">
                    <img
                      src={creatorAvatar}
                      alt={creatorName}
                      className="w-8 h-8 rounded-full object-cover border border-[#E3DFD3] bg-white"
                    />
                    <span className="text-sm font-sans font-bold text-[#1E2E24] truncate">
                      {creatorName}
                    </span>
                  </div>

                  {lessonId ? (
                    <Link
                      href={`/lessons/details/${lessonId}`}
                      className="inline-flex items-center gap-1 text-sm font-sans font-bold text-[#2C5E3B] hover:text-[#1C3F26] transition-colors shrink-0"
                      aria-label={`See details for ${title}`}
                    >
                      Read
                      <ArrowUpRight
                        size={15}
                        strokeWidth={2.25}
                        className="transition-transform duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                      />
                    </Link>
                  ) : null}
                </div>
              </div>
            </article>
          );
        })}
      </div>
    </section>
  );
}

/**
 * Converts a "personal-growth" / "mistakes-learned" slug into a Title
 * Cased label for the badge. Falls back to the original string when
 * the slug isn't recognised.
 */
function formatCategory(slug) {
  if (!slug) return "Lesson";
  return slug
    .toString()
    .split("-")
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ");
}

/**
 * Trims the story to roughly two lines (~160 chars) and appends an
 * ellipsis if anything was cut. Returns an empty string when the story
 * is missing so the card body still renders cleanly.
 */
function stripExcerpt(story, maxLength) {
  const text = (story ?? "").toString().trim();
  if (!text) return "";
  if (text.length <= maxLength) return text;
  return `${text.slice(0, maxLength).trimEnd()}…`;
}
