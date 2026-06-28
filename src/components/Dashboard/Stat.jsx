"use client";

import { useEffect, useMemo, useState } from "react";
import { Card, Chip, Button, Skeleton } from "@heroui/react";
import { BookOpen, Bookmark, History, ArrowRight } from "lucide-react";
import { authClient } from "@/lib/auth-client";
import { getDashboardStats } from "@/lib/api/dashboard";

/**
 * Formats a relative-time window label for the "Recently added" card
 * badge. Falls back to "JUST NOW" / "X DAYS AGO" when the timestamp
 * is on the same calendar day / within a week.
 */
const formatLastAdded = (lastAddedAt) => {
  if (!lastAddedAt) return null;
  const then = new Date(lastAddedAt);
  if (Number.isNaN(then.getTime())) return null;

  const diffMs = Date.now() - then.getTime();
  const diffMin = Math.round(diffMs / (1000 * 60));
  const diffHr = Math.round(diffMs / (1000 * 60 * 60));
  const diffDay = Math.round(diffMs / (1000 * 60 * 60 * 24));

  if (diffMin < 60) return "JUST NOW";
  if (diffHr < 24) return `${diffHr}H AGO`;
  if (diffDay === 1) return "YESTERDAY";
  if (diffDay < 7) return `${diffDay} DAYS AGO`;
  if (diffDay < 30) return `${diffDay} DAYS AGO`;
  return then.toLocaleDateString(undefined, { month: "short", day: "numeric" });
};

/**
 * Renders the three top-of-dashboard stat cards from real data:
 *   - TOTAL LESSONS: how many lessons the user has authored.
 *   - TOTAL SAVED:   how many lessons the user has bookmarked.
 *   - RECENTLY ADDED: lessons authored in the last 30 days; if zero,
 *                     shows the "no recent activity" state.
 *
 * Loading state renders skeletons in the same shape as the cards so
 * the layout doesn't jump when the data lands.
 */
export default function DashboardStats() {
  const { data: session, isPending: sessionPending } = authClient.useSession();
  const userId = session?.user?.id ?? null;

  const [stats, setStats] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let cancelled = false;
    // Don't fire the request until better-auth has resolved; otherwise
    // we'd issue two calls back-to-back (anon → authed) and flicker.
    if (sessionPending) return undefined;

    const load = async () => {
      if (!userId) {
        setStats(null);
        setIsLoading(false);
        return;
      }
      setIsLoading(true);
      const result = await getDashboardStats(userId, { windowDays: 30 });
      if (cancelled) return;
      setStats(result);
      setIsLoading(!result ? "Couldn't load stats" : "");
      setIsLoading(false);
    };
    load();
    return () => {
      cancelled = true;
    };
  }, [userId, sessionPending]);

  // Build the card descriptors from real data. `badge` is shown
  // small in the corner of each card and degrades gracefully when
  // there's nothing meaningful to say.
  const cards = useMemo(() => {
    if (!stats) {
      return [];
    }
    const recentlyBadge = stats.hasRecentActivity
      ? {
          text: formatLastAdded(stats.lastAddedAt) || `${stats.recentlyAdded} NEW`,
          color: "bg-[#EBE7D9] text-[#707E74]",
        }
      : {
          text: `NO ACTIVITY • ${stats.recentActivityWindowDays}D`,
          color: "bg-[#F2EFE6] text-[#8B7355]",
        };

    return [
      {
        title: "TOTAL LESSONS",
        value: stats.totalLessons,
        icon: BookOpen,
        badge: {
          text: stats.totalLessons > 0 ? "AUTHORED" : "GET STARTED",
          color: "bg-[#E2F0E7] text-[#467856]",
        },
      },
      {
        title: "TOTAL SAVED",
        value: stats.totalSaves,
        icon: Bookmark,
        badge: {
          text: stats.totalSaves > 0 ? "BOOKMARKED" : "NOTHING YET",
          color: "bg-[#F2EFE6] text-[#8B7355]",
        },
      },
      {
        title: "RECENTLY ADDED",
        value: stats.recentlyAdded,
        icon: History,
        badge: recentlyBadge,
      },
    ];
  }, [stats]);

  const showSkeleton = sessionPending || isLoading;
  const showError = !showSkeleton && Boolean(error);

  return (
    <section className="w-full max-w-7xl mx-auto px-4 pb-6 pt-4">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 w-full">
        {showError ? (
          // Render skeletons in the same shape so the row stays
          // visually stable while still telling the user something
          // went wrong.
          <div className="col-span-full rounded-2xl border border-[#EBE7D9] bg-[#FAF8F3] p-4 text-sm text-[#8B7355]">
            {error}
          </div>
        ) : null}

        {showSkeleton
          ? Array.from({ length: 3 }).map((_, index) => (
              <Card
                key={`skeleton-${index}`}
                shadow="none"
                className="bg-[#FAF8F3] border border-[#EBE7D9]/60 rounded-[24px] p-6 flex flex-col justify-between min-h-[180px]"
              >
                <Skeleton className="w-12 h-12 rounded-full" />
                <div className="space-y-2 mt-6">
                  <Skeleton className="h-3 w-24 rounded" />
                  <Skeleton className="h-8 w-16 rounded" />
                </div>
              </Card>
            ))
          : cards.map((stat, index) => {
              const Icon = stat.icon;
              return (
                <Card
                  key={index}
                  shadow="none"
                  className="bg-[#FAF8F3] border border-[#EBE7D9]/60 rounded-[24px] p-6 flex flex-col justify-between min-h-[180px]"
                >
                  <div>
                    <div className="flex justify-between items-start w-full mb-6">
                      <div className="w-12 h-12 rounded-full bg-[#F2EFE6] flex items-center justify-center text-[#467856]">
                        <Icon size={22} strokeWidth={1.75} />
                      </div>
                      <Chip
                        size="sm"
                        variant="flat"
                        className={`${stat.badge.color} font-sans font-bold text-[10px] tracking-wider px-2 border-none`}
                      >
                        {stat.badge.text}
                      </Chip>
                    </div>

                    <p className="text-[11px] font-sans font-bold tracking-widest text-[#707E74] uppercase mb-1">
                      {stat.title}
                    </p>
                  </div>
                  <h3 className="text-4xl font-serif font-bold text-[#1E2E24] leading-none">
                    {stat.value}
                  </h3>
                </Card>
              );
            })}

        {/* Action Link Banner Card (Green Container) */}
        <Card
          shadow="none"
          className="bg-[#467856] text-white rounded-[24px] p-6 flex flex-col justify-between min-h-[180px] transition-transform duration-300 hover:-translate-y-1"
        >
          <h3 className="text-2xl font-sans font-bold leading-tight max-w-[200px] mt-2">
            Ready to reflect on today?
          </h3>

          <Button
            as="a"
            href="/dashboard/add-lesson"
            variant="light"
            className="w-full justify-between items-center p-0 bg-transparent text-white hover:bg-transparent min-w-0 font-sans font-semibold text-base group"
            endContent={
              <ArrowRight
                size={20}
                className="transition-transform duration-200 group-hover:translate-x-1"
              />
            }
          >
            Add New Lesson
          </Button>
        </Card>
      </div>
    </section>
  );
}
