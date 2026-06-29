import { BookOpen } from "lucide-react";
import { getLessonGrowth } from "@/lib/api/lesson";
import GrowthLineChart from "./GrowthLineChart";

/**
 * Server component that fetches the lesson growth series and hands it
 * off to the reusable `GrowthLineChart`. The fetcher is the single
 * source of truth for the shape of the data, and the chart component
 * doesn't need to know anything about cookies or the API surface.
 *
 * Renders a 30-day window by default.
 */
export default async function LessonGrowthCard({ days = 30 } = {}) {
  const { total, windowDays, series } = await getLessonGrowth({ days });

  // Sum of all `count` entries == net new lessons in the window.
  const newInWindow = series.reduce(
    (acc, d) => acc + (Number(d?.count) || 0),
    0,
  );

  return (
    <GrowthLineChart
      title="Lesson growth"
      subtitle="Cumulative count over time"
      total={total}
      delta={newInWindow > 0 ? `+${newInWindow} in last ${windowDays}d` : undefined}
      windowDays={windowDays}
      series={series}
      color="#a17236"
      fillColor="rgba(161, 114, 54, 0.14)"
      icon={<BookOpen size={20} strokeWidth={1.75} />}
    />
  );
}
