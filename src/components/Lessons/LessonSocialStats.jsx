"use client";

import { Card } from "@heroui/react";
import { Eye, Heart, Bookmark } from "lucide-react";

import { useEngagementStats } from "@/components/Lessons/engagementStore";

/**
 * Sidebar card that shows live Likes / Saved / Views counts for a
 * lesson. It subscribes to the shared engagement store (mutated by
 * `LessonActions` when buttons are toggled) so updates are instant
 * without a page refresh.
 *
 * `initialValues` are the SSR-rendered numbers from the server page;
 * the store hydrates itself when `LessonEngagement` mounts, so this
 * component stays in sync from the very first paint.
 */
export default function LessonSocialStats({
  lessonId,
  initialLikesCount = 0,
  initialSavesCount = 0,
  initialViewsCount = 0,
}) {
  const stats = useEngagementStats(lessonId, {
    likesCount: initialLikesCount,
    savesCount: initialSavesCount,
    viewsCount: initialViewsCount,
  });

  return (
    <Card className="p-5 bg-white border border-[#eae6df] shadow-sm rounded-2xl">
      <div className="grid grid-cols-3 divide-x divide-slate-100 text-center">
        <Stat
          icon={<Heart size={20} className="text-emerald-600 mb-1 mx-auto" />}
          value={formatStat(stats.likesCount)}
          label="Likes"
        />
        <Stat
          icon={
            <Bookmark size={20} className="text-emerald-600 mb-1 mx-auto" />
          }
          value={formatStat(stats.savesCount)}
          label="Saved"
        />
        <Stat
          icon={<Eye size={20} className="text-emerald-600 mb-1 mx-auto" />}
          value={formatStat(stats.viewsCount)}
          label="Views"
        />
      </div>
    </Card>
  );
}

function Stat({ icon, value, label }) {
  return (
    <div className="flex flex-col justify-center items-center p-1">
      {icon}
      <p className="font-bold text-slate-800 text-[16px] leading-tight mt-1">
        {value}
      </p>
      <p className="text-[11px] text-slate-400 font-medium">{label}</p>
    </div>
  );
}

function formatStat(value) {
  if (value == null || value === "" || Number.isNaN(Number(value))) {
    return "N/A";
  }
  const num = Number(value);
  if (num < 1000) return num.toString();
  if (num < 1_000_000) return (num / 1000).toFixed(1).replace(/\.0$/, "") + "K";
  return (num / 1_000_000).toFixed(1).replace(/\.0$/, "") + "M";
}
