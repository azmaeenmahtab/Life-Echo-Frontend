import React from "react";
import { Card, Chip } from "@heroui/react";
import { Sparkles, Clock, Image as ImageIcon } from "lucide-react";

/**
 * Format a timestamp into a compact "time-ago" label
 * (e.g. "12m ago", "3h ago", "yesterday"). Falls back to the
 * locale date string for anything older than a day so the label
 * never shows "NaN ago".
 */
const formatTimeAgo = (iso) => {
  if (!iso) return "—";
  const then = new Date(iso).getTime();
  if (Number.isNaN(then)) return "—";

  const diffMs = Date.now() - then;
  const minutes = Math.round(diffMs / 60000);
  if (minutes < 1) return "just now";
  if (minutes < 60) return `${minutes}m ago`;

  const hours = Math.round(minutes / 60);
  if (hours < 24) return `${hours}h ago`;

  const days = Math.round(hours / 24);
  if (days === 1) return "yesterday";
  if (days < 7) return `${days}d ago`;

  return new Date(iso).toLocaleDateString();
};

/**
 * Maps a category slug to a human-friendly label. Falls back to the
 * raw slug when the value isn't recognised so we never render
 * "undefined" to admins.
 */
const formatCategory = (slug) => {
  if (!slug) return null;
  const map = {
    "personal-growth": "Personal Growth",
    career: "Career",
    relationships: "Relationships",
    mindset: "Mindset",
    "mistakes-learned": "Mistakes Learned",
  };
  return map[slug] ?? slug;
};

/**
 * Visual badge styles for the lesson's review status. Mirrors the
 * status badge palette used on the admin `LessonsList` page so the
 * two views stay consistent.
 */
const REVIEW_BADGE_STYLES = {
  pending: "bg-[#F5E9D4] text-[#A17236]",
  reviewed: "bg-[#E2F2E9] text-[#2E7D32]",
  rejected: "bg-[#FDE4E2] text-[#A72D2D]",
};

const REVIEW_LABELS = {
  pending: "PENDING",
  reviewed: "APPROVED",
  rejected: "REJECTED",
};

/**
 * Renders the "Today's new lessons" card on /dashboard/admin.
 *
 * Shows a big number (lessons authored in the last 24h) plus a
 * compact list of the most recent ones with:
 *   - thumbnail (or placeholder)
 *   - title + author
 *   - category chip + time-ago
 *   - review-status badge
 *
 * Styled to match `MostActiveContributors` so the two cards feel like
 * a single panel row on the admin home.
 *
 * Props:
 *   - total:   number  — lessons authored in the last 24h
 *   - lessons: array   — most recent lessons (see fetcher docstring)
 */
const TodaysLessons = ({ total = 0, lessons = [] }) => {
  const safeTotal = Number(total) || 0;
  const list = Array.isArray(lessons) ? lessons : [];

  if (safeTotal === 0) {
    return (
      <Card
        shadow="none"
        className="bg-[#FAF8F3] border border-[#EBE7D9]/60 rounded-[24px] p-6 min-h-[180px] flex flex-col"
      >
        <div className="flex items-start justify-between w-full mb-6">
          <div className="w-12 h-12 rounded-full bg-[#F2EFE6] flex items-center justify-center text-[#467856]">
            <Sparkles size={22} strokeWidth={1.75} />
          </div>
          <Chip
            size="sm"
            variant="flat"
            className="bg-[#F2EFE6] text-[#8B7355] font-sans font-bold text-[10px] tracking-wider px-2 border-none"
          >
            NO NEW LESSONS
          </Chip>
        </div>

        <p className="text-[11px] font-sans font-bold tracking-widest text-[#707E74] uppercase mb-1">
          Today&apos;s new lessons
        </p>
        <p className="text-sm text-[#556359] mt-2">
          No lessons were authored in the last 24 hours. Check back later.
        </p>
      </Card>
    );
  }

  return (
    <Card
      shadow="none"
      className="bg-[#FAF8F3] border border-[#EBE7D9]/60 rounded-[24px] p-6 flex flex-col min-h-[180px]"
    >
      <div className="flex items-start justify-between w-full mb-6">
        <div className="w-12 h-12 rounded-full bg-[#F2EFE6] flex items-center justify-center text-[#467856]">
          <Sparkles size={22} strokeWidth={1.75} />
        </div>
        <Chip
          size="sm"
          variant="flat"
          className="bg-[#E2F2E9] text-[#2E7D32] font-sans font-bold text-[10px] tracking-wider px-2 border-none"
        >
          LAST 24H
        </Chip>
      </div>

      <p className="text-[11px] font-sans font-bold tracking-widest text-[#707E74] uppercase mb-1">
        Today&apos;s new lessons
      </p>
      <p className="text-sm text-[#556359] mb-4">
        <span className="font-serif font-bold text-[#1E2E24] text-base">
          {safeTotal}
        </span>{" "}
        {safeTotal === 1 ? "lesson" : "lessons"} authored in the last 24 hours
      </p>

      <ul className="space-y-3 mt-auto">
        {list.map((lesson, index) => {
          const status = (lesson.reviewStatus || "pending").toLowerCase();
          const badgeStyle =
            REVIEW_BADGE_STYLES[status] ?? REVIEW_BADGE_STYLES.pending;
          const badgeLabel = REVIEW_LABELS[status] ?? "PENDING";
          const categoryLabel = formatCategory(lesson.category);

          return (
            <li
              key={lesson.lessonId ?? `${lesson.title}-${index}`}
              className="flex items-start gap-3"
            >
              <span className="relative shrink-0 w-12 h-12 rounded-xl overflow-hidden bg-[#F2EFE6] border border-[#EBE7D9] flex items-center justify-center text-[#a17236]">
                {lesson.imageUrl ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={lesson.imageUrl}
                    alt={lesson.title}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <ImageIcon size={18} strokeWidth={1.5} />
                )}
              </span>

              <div className="flex-1 min-w-0">
                <p className="font-semibold text-[#1E2E24] truncate text-sm">
                  {lesson.title || "(untitled)"}
                </p>
                <p className="text-[11px] text-[#707E74] truncate">
                  by{" "}
                  <span className="text-[#556359] font-medium">
                    {lesson.creatorName || "Unknown author"}
                  </span>
                </p>
                <div className="flex items-center gap-1.5 mt-1.5 flex-wrap">
                  {categoryLabel ? (
                    <span className="inline-flex items-center px-1.5 py-0.5 rounded-full text-[9px] font-bold uppercase tracking-wider border bg-white text-[#556359] border-[#EBE7D9]">
                      {categoryLabel}
                    </span>
                  ) : null}
                  <span
                    className={`inline-flex items-center px-1.5 py-0.5 rounded-full text-[9px] font-bold uppercase tracking-wider ${badgeStyle}`}
                  >
                    {badgeLabel}
                  </span>
                  <span className="inline-flex items-center gap-1 text-[10px] text-[#707E74]">
                    <Clock size={10} strokeWidth={2} />
                    {formatTimeAgo(lesson.createdAt)}
                  </span>
                </div>
              </div>
            </li>
          );
        })}
      </ul>
    </Card>
  );
};

export default TodaysLessons;