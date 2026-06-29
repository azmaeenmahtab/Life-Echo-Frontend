import ReportedLessonsList from "@/components/Admin/ReportedLessonsList";
import ReportedLessonsStats from "@/components/Admin/ReportedLessonsStats";
import { getReportedLessons } from "@/lib/api/admin/report";
import React from "react";

// Force dynamic rendering: `getReportedLessons` calls the backend with
// `cache: "no-store"`, and the page depends on the current admin
// session, so it must run at request time, not at build time.
export const dynamic = "force-dynamic";

/**
 * Admin page that lists reported lessons grouped by lesson.
 *
 * The fetch is grouped server-side (one row per lesson with its
 * report count + a snapshot of recent reasons). The detailed "View
 * reasons" modal then calls `getLessonReports(lessonId)` on demand
 * so the table query stays cheap and doesn't materialise every
 * report row up-front.
 */
const ReportedLessonsPage = async () => {
  const { total, totalReports, lessons } = await getReportedLessons();

  return (
    <div className="space-y-6">
      <header>
        <h1 className="text-3xl font-serif font-bold text-[#1E2E24]">
          Reported Lessons
        </h1>
      </header>

      <ReportedLessonsStats
        reportedLessons={total}
        totalReports={totalReports}
      />

      <ReportedLessonsList lessons={lessons} />
    </div>
  );
};

export default ReportedLessonsPage;
