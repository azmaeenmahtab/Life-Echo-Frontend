import LessonsList from "@/components/Admin/LessonsList";
import { getPublicLessons } from "@/lib/api/lesson";
import React from "react";

// `getPublicLessons` uses `cache: "no-store"`, so this admin page
// must opt out of static prerendering.
export const dynamic = "force-dynamic";

const ManageLessonsPage = async () => {
  const lessons = await getPublicLessons();
  const total = Array.isArray(lessons) ? lessons.length : 0;

  return (
    <div className="space-y-6">
      <header className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="font-serif font-bold text-3xl text-[#1E2E24]">
            Manage Lessons
          </h1>
          <p className="mt-1 text-sm text-[#556359]">
            Review and moderate every lesson published on the platform.
          </p>
        </div>
        <span className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#FAF8F3] border border-[#EBE7D9] text-[#1E2E24] text-xs font-bold uppercase tracking-wider">
          <span className="w-1.5 h-1.5 rounded-full bg-[#2e7d32]" />
          {total} {total === 1 ? "lesson" : "lessons"}
        </span>
      </header>

      <LessonsList initialLessons={lessons} />
    </div>
  );
};

export default ManageLessonsPage;
