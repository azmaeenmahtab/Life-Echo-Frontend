import { Users } from "lucide-react";
import { getUserGrowth } from "@/lib/api/admin/user";
import GrowthLineChart from "./GrowthLineChart";

/**
 * Server component that fetches the user signup growth series and
 * hands it off to the reusable `GrowthLineChart`. The fetcher is the
 * single source of truth for the shape of the data, and the chart
 * component doesn't need to know anything about cookies or the API
 * surface.
 *
 * Renders a 30-day window by default. The `total` shown on the card
 * is the lifetime user count (stable, not a sliding window number).
 */
export default async function UserGrowthCard({ days = 30 } = {}) {
  const { total, windowDays, series } = await getUserGrowth({ days });

  // Sum of all `count` entries == net new signups in the window.
  const newInWindow = series.reduce(
    (acc, d) => acc + (Number(d?.count) || 0),
    0,
  );

  return (
    <GrowthLineChart
      title="User growth"
      subtitle="Cumulative signups over time"
      total={total}
      delta={
        newInWindow > 0 ? `+${newInWindow} in last ${windowDays}d` : undefined
      }
      windowDays={windowDays}
      series={series}
      color="#467856"
      fillColor="rgba(70, 120, 86, 0.14)"
      icon={<Users size={20} strokeWidth={1.75} />}
    />
  );
}
