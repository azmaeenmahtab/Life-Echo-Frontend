"use client";

import { Card, Chip } from "@heroui/react";
import { FileWarning, ShieldAlert, Layers } from "lucide-react";

/**
 * Format a stat number with thousands separators so totals like
 * 1,234 render cleanly instead of "1234".
 */
const formatNumber = (value) => {
  const safe = Number(value) || 0;
  return safe.toLocaleString();
};

/**
 * Three summary cards above the reported-lessons table:
 *   - Reported lessons: distinct lessons with at least one report
 *   - Total reports:    raw report count across those lessons
 *   - Pending review:   same as "Reported lessons" — surfaced as a
 *                       glanceable reminder for the admin
 *
 * Styled to match the existing dashboard `Stat` cards so the admin
 * pages feel cohesive (cream surface, brown-grey labels, forest
 * numbers, chip badges in the upper-right).
 *
 * Renders zeros gracefully — when there's nothing to review the
 * admin still gets a stable empty view instead of a layout jump.
 */
export default function ReportedLessonsStats({
  reportedLessons = 0,
  totalReports = 0,
}) {
  const lessons = Number(reportedLessons) || 0;
  const reports = Number(totalReports) || 0;

  const cards = [
    {
      title: "REPORTED LESSONS",
      value: lessons,
      icon: Layers,
      badge: {
        text: lessons > 0 ? "PENDING REVIEW" : "ALL CLEAR",
        color:
          lessons > 0
            ? "bg-[#FDE4E2] text-[#A72D2D]"
            : "bg-[#E2F2E9] text-[#2E7D32]",
      },
    },
    {
      title: "TOTAL REPORTS",
      value: reports,
      icon: FileWarning,
      badge: {
        text: reports > 0 ? "FILED" : "NONE FILED",
        color:
          reports > 0
            ? "bg-[#F5E9D4] text-[#A17236]"
            : "bg-[#F2EFE6] text-[#8B7355]",
      },
    },
    {
      title: "AVERAGE PER LESSON",
      value: lessons > 0 ? Math.round((reports / lessons) * 10) / 10 : 0,
      icon: ShieldAlert,
      badge: {
        text: lessons > 0 ? "REPEATED FLAGS" : "NO FLAGS",
        color:
          lessons > 0
            ? "bg-[#F5E9D4] text-[#A17236]"
            : "bg-[#F2EFE6] text-[#8B7355]",
      },
    },
  ];

  return (
    <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      {cards.map((stat) => {
        const Icon = stat.icon;
        return (
          <Card
            key={stat.title}
            shadow="none"
            className="bg-[#FAF8F3] border border-[#EBE7D9]/60 rounded-[24px] p-6 flex flex-col justify-between min-h-[180px]"
          >
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
            <h3 className="text-4xl font-serif font-bold text-[#1E2E24] leading-none">
              {formatNumber(stat.value)}
            </h3>
          </Card>
        );
      })}
    </section>
  );
}
