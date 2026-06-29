"use client";

import { TrendingUp } from "lucide-react";

/**
 * Reusable dependency-free SVG line chart for cumulative growth
 * series. Used by both the "Lesson growth" card and the "User
 * growth" card on /dashboard/admin.
 *
 * Props:
 *   - title:    string                   — card title
 *   - subtitle: string?                  — small label under the title
 *   - total:    number                   — current total (the headline number)
 *   - delta:    string?                  — small chip text, e.g. "+12 this week"
 *   - windowDays: number                 — e.g. 30
 *   - series:   Array<{ date, count, cumulative }>
 *   - color:    string?                  — stroke color (default: warm brown)
 *   - fillColor: string?                 — area fill color
 *   - icon:     ReactNode?               — header icon (defaults to TrendingUp)
 *
 * The component is fully responsive via viewBox and uses a 320 x 160
 * coordinate space. The series is plotted by cumulative value so the
 * line is always non-decreasing.
 */

// ViewBox dimensions — keep these in sync with the math below.
const VB_W = 320;
const VB_H = 160;
const PAD_LEFT = 28; // room for y-axis labels
const PAD_RIGHT = 8;
const PAD_TOP = 10;
const PAD_BOTTOM = 22; // room for x-axis labels

const formatDateLabel = (iso) => {
  if (!iso) return "";
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return "";
  return d.toLocaleDateString("en-US", { month: "short", day: "numeric" });
};

const formatCompactNumber = (n) => {
  if (typeof n !== "number" || Number.isNaN(n)) return "0";
  if (n >= 1_000_000)
    return `${(n / 1_000_000).toFixed(1).replace(/\.0$/, "")}M`;
  if (n >= 1_000) return `${(n / 1_000).toFixed(1).replace(/\.0$/, "")}k`;
  return String(n);
};

const buildPath = (points) => {
  if (!points.length) return "";
  return points
    .map((p, i) => `${i === 0 ? "M" : "L"} ${p.x.toFixed(2)} ${p.y.toFixed(2)}`)
    .join(" ");
};

const buildAreaPath = (points, baselineY) => {
  if (!points.length) return "";
  const head = points
    .map((p, i) => `${i === 0 ? "M" : "L"} ${p.x.toFixed(2)} ${p.y.toFixed(2)}`)
    .join(" ");
  const last = points[points.length - 1];
  const first = points[0];
  return `${head} L ${last.x.toFixed(2)} ${baselineY.toFixed(2)} L ${first.x.toFixed(2)} ${baselineY.toFixed(2)} Z`;
};

export default function GrowthLineChart({
  title,
  subtitle,
  total = 0,
  delta,
  windowDays = 30,
  series = [],
  color = "#a17236",
  fillColor = "rgba(161, 114, 54, 0.14)",
  icon,
}) {
  // Build the x/y projection from the cumulative series.
  const points = (() => {
    if (!series.length) return [];

    const innerW = VB_W - PAD_LEFT - PAD_RIGHT;
    const innerH = VB_H - PAD_TOP - PAD_BOTTOM;

    const ys = series.map((d) => Number(d.cumulative) || 0);
    const minY = Math.min(...ys);
    const maxYRaw = Math.max(...ys);
    // Always start the y-axis at 0 so a fresh chart with all-zero data
    // still renders a flat baseline at the bottom of the plot area.
    const maxY = Math.max(maxYRaw, 1);
    // Give a touch of headroom above the highest point.
    const yRange = maxY - 0 || 1;

    const n = series.length;
    const xStep = n > 1 ? innerW / (n - 1) : 0;

    return series.map((d, i) => {
      const yVal = Number(d.cumulative) || 0;
      const x = PAD_LEFT + (n > 1 ? i * xStep : innerW / 2);
      const y = PAD_TOP + innerH - (yVal / yRange) * innerH;
      return { x, y, date: d.date, value: yVal };
    });
  })();

  const innerH = VB_H - PAD_TOP - PAD_BOTTOM;
  const baselineY = PAD_TOP + innerH;
  const linePath = buildPath(points);
  const areaPath = buildAreaPath(points, baselineY);

  const ys = points.map((p) => p.value);
  const minYValue = ys.length ? Math.min(...ys) : 0;
  const maxYValue = ys.length ? Math.max(...ys) : 0;

  // X-axis label positions: first, middle, last.
  const xLabels = (() => {
    if (!points.length) return [];
    if (points.length === 1) {
      return [{ x: points[0].x, label: formatDateLabel(points[0].date) }];
    }
    const mid = points[Math.floor(points.length / 2)];
    return [
      { x: points[0].x, label: formatDateLabel(points[0].date) },
      { x: mid.x, label: formatDateLabel(mid.date) },
      {
        x: points[points.length - 1].x,
        label: formatDateLabel(points[points.length - 1].date),
      },
    ];
  })();

  const lastPoint = points.length ? points[points.length - 1] : null;

  return (
    <div className="bg-[#FAF8F3] border border-[#EBE7D9] rounded-2xl p-5 shadow-sm">
      <header className="flex items-start justify-between w-full mb-4">
        <div className="flex items-center gap-3">
          <div className="w-11 h-11 rounded-full bg-[#F2EFE6] flex items-center justify-center text-[#467856]">
            {icon ?? <TrendingUp size={20} strokeWidth={1.75} />}
          </div>
          <div>
            <p className="text-[11px] font-sans font-bold tracking-widest text-[#707E74] uppercase">
              {title}
            </p>
            {subtitle ? (
              <p className="text-xs text-[#8B7355] mt-0.5">{subtitle}</p>
            ) : null}
          </div>
        </div>

        <div className="flex flex-col items-end gap-1">
          <span className="text-2xl font-serif font-bold text-[#1E2E24] leading-none">
            {formatCompactNumber(total)}
          </span>
          {delta ? (
            <span className="text-[10px] font-sans font-bold tracking-wider text-[#467856] uppercase">
              {delta}
            </span>
          ) : (
            <span className="text-[10px] font-sans font-bold tracking-wider text-[#707E74] uppercase">
              last {windowDays}d
            </span>
          )}
        </div>
      </header>

      <div className="w-full">
        <svg
          viewBox={`0 0 ${VB_W} ${VB_H}`}
          className="w-full h-40"
          role="img"
          aria-label={`${title} over the last ${windowDays} days`}
        >
          {/* Subtle horizontal gridlines at min, mid, max of the y-range. */}
          <g stroke="#EBE7D9" strokeWidth="1">
            <line
              x1={PAD_LEFT}
              x2={VB_W - PAD_RIGHT}
              y1={PAD_TOP}
              y2={PAD_TOP}
            />
            <line
              x1={PAD_LEFT}
              x2={VB_W - PAD_RIGHT}
              y1={PAD_TOP + innerH / 2}
              y2={PAD_TOP + innerH / 2}
            />
            <line
              x1={PAD_LEFT}
              x2={VB_W - PAD_RIGHT}
              y1={baselineY}
              y2={baselineY}
            />
          </g>

          {/* Y-axis labels (min / max only, kept minimal). */}
          <g
            fill="#8B7355"
            fontSize="8"
            fontFamily="ui-sans-serif, system-ui, sans-serif"
          >
            <text x={PAD_LEFT - 4} y={PAD_TOP + 3} textAnchor="end">
              {formatCompactNumber(maxYValue)}
            </text>
            <text x={PAD_LEFT - 4} y={baselineY} textAnchor="end">
              {formatCompactNumber(minYValue)}
            </text>
          </g>

          {/* X-axis labels (first / mid / last). */}
          <g
            fill="#8B7355"
            fontSize="8"
            fontFamily="ui-sans-serif, system-ui, sans-serif"
          >
            {xLabels.map((l, i) => (
              <text
                key={`xl-${i}`}
                x={l.x}
                y={VB_H - 6}
                textAnchor={
                  i === 0
                    ? "start"
                    : i === xLabels.length - 1
                      ? "end"
                      : "middle"
                }
              >
                {l.label}
              </text>
            ))}
          </g>

          {points.length === 0 ? (
            <text
              x={VB_W / 2}
              y={VB_H / 2}
              textAnchor="middle"
              fill="#8B7355"
              fontSize="9"
              fontFamily="ui-sans-serif, system-ui, sans-serif"
            >
              No data in this window yet
            </text>
          ) : (
            <>
              <path d={areaPath} fill={fillColor} stroke="none" />
              <path
                d={linePath}
                fill="none"
                stroke={color}
                strokeWidth="2"
                strokeLinejoin="round"
                strokeLinecap="round"
              />
              {lastPoint ? (
                <circle
                  cx={lastPoint.x}
                  cy={lastPoint.y}
                  r="3"
                  fill={color}
                  stroke="#FAF8F3"
                  strokeWidth="1.5"
                />
              ) : null}
            </>
          )}
        </svg>
      </div>
    </div>
  );
}
