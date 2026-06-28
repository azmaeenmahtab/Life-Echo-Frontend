"use client";

import { useEffect, useMemo, useState } from "react";
import { Card, Skeleton } from "@heroui/react";
import { Bookmark, MessageCircle, Heart, Flag, BookOpen } from "lucide-react";
import { authClient } from "@/lib/auth-client";
import { getDashboardActivity } from "@/lib/api/dashboard";

/**
 * Maps each metric to its own icon and label. The bar heights are
 * normalised against the largest value across all five so the chart
 * keeps its shape even when one metric dominates (e.g. likes >> reports).
 */
const METRICS = [
  { key: "lessonsPosted", label: "Lessons", icon: BookOpen },
  { key: "saves", label: "Saves", icon: Bookmark },
  { key: "comments", label: "Comments", icon: MessageCircle },
  { key: "likes", label: "Likes", icon: Heart },
  { key: "reports", label: "Reports", icon: Flag },
];

const formatNumber = (n) => {
  const v = Number(n ?? 0);
  if (v < 1000) return String(v);
  if (v < 1_000_000) return `${(v / 1000).toFixed(v < 10_000 ? 1 : 0)}K`;
  return `${(v / 1_000_000).toFixed(1)}M`;
};

/**
 * Renders the activity chart as five labelled vertical bars, one
 * per metric, normalised against the largest value so the chart is
 * always readable regardless of the absolute scale.
 *
 * Empty state: when every metric is 0, renders a dashed-border
 * "No activity yet" message instead of five flat bars, which would
 * otherwise look like the chart is broken.
 */
export default function ActivityChart() {
  const { data: session, isPending: sessionPending } = authClient.useSession();
  const userId = session?.user?.id ?? null;

  const [totals, setTotals] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let cancelled = false;
    if (sessionPending) return undefined;

    const load = async () => {
      if (!userId) {
        setTotals(null);
        setIsLoading(false);
        return;
      }
      setIsLoading(true);
      const result = await getDashboardActivity(userId);
      if (cancelled) return;
      if (!result) {
        setError("Couldn't load activity");
        setTotals(null);
      } else {
        setTotals(result.totals);
        setError("");
      }
      setIsLoading(false);
    };
    load();
    return () => {
      cancelled = true;
    };
  }, [userId, sessionPending]);

  // Pre-compute the bar series so we don't re-derive during render.
  const series = useMemo(() => {
    if (!totals) return [];
    const maxValue = Math.max(
      ...METRICS.map((m) => Number(totals[m.key] ?? 0)),
      0,
    );
    return METRICS.map((metric) => {
      const value = Number(totals[metric.key] ?? 0);
      // Use a tiny floor so a 0 metric still renders a thin sliver
      // and the user can see the category exists. If everything is 0
      // we hide the bars entirely in the empty state below.
      const pct = maxValue === 0 ? 0 : Math.max(2, (value / maxValue) * 100);
      return { ...metric, value, pct };
    });
  }, [totals]);

  const isEmpty = !isLoading && !error && series.every((s) => s.value === 0);
  const showSkeleton = sessionPending || isLoading;

  return (
    <Card
      shadow="none"
      className="bg-[#FAF8F3] border border-[#EBE7D9]/60 rounded-4xl p-6 md:p-8 w-full max-w-3xl"
    >
      <div className="flex justify-between items-start mb-12">
        <div>
          <h3 className="text-2xl font-serif font-bold text-[#1E2E24] mb-1">
            Activity Overview
          </h3>
          <p className="text-sm font-sans text-[#707E74]">
            Your actions across the platform
          </p>
        </div>

        <div className="flex items-center gap-2 mt-2">
          <div className="w-3 h-3 rounded-full bg-[#467856]" />
          <span className="text-xs font-sans font-bold tracking-wider text-[#1E2E24] uppercase">
            Engagement
          </span>
        </div>
      </div>

      {error && (
        <div
          role="alert"
          className="rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700"
        >
          {error}
        </div>
      )}

      {showSkeleton ? (
        <div className="flex justify-between items-end gap-3 md:gap-6 h-48 px-2">
          {METRICS.map((metric) => (
            <div
              key={metric.key}
              className="flex flex-col items-center flex-1 h-full gap-3"
            >
              <Skeleton className="w-full h-full rounded-[20px]" />
              <Skeleton className="h-3 w-12 rounded" />
            </div>
          ))}
        </div>
      ) : isEmpty ? (
        <div className="h-48 flex items-center justify-center rounded-2xl border border-dashed border-[#EBE7D9] bg-white text-sm text-[#707E74]">
          No activity yet. Start by saving, commenting, or posting your first
          lesson.
        </div>
      ) : (
        <div className="flex justify-between items-end gap-3 md:gap-6 h-48 px-2">
          {series.map((item) => {
            const Icon = item.icon;
            return (
              <div
                key={item.key}
                className="flex flex-col items-center flex-1 h-full group"
              >
                <span className="text-[11px] font-sans font-bold tracking-wider text-[#1E2E24] mb-2">
                  {formatNumber(item.value)}
                </span>
                <div className="relative w-full h-full bg-[#D4DEC9]/50 rounded-t-[20px] rounded-b-[20px] overflow-hidden">
                  <div
                    style={{ height: `${item.pct}%` }}
                    className="absolute bottom-0 left-0 right-0 bg-[#467856] rounded-t-[20px] rounded-b-[20px] transition-all duration-500 ease-out flex items-start justify-center pt-2"
                  ></div>
                </div>

                <span className="mt-4 text-sm font-sans font-medium text-[#707E74]">
                  {item.label}
                </span>
              </div>
            );
          })}
        </div>
      )}
    </Card>
  );
}
