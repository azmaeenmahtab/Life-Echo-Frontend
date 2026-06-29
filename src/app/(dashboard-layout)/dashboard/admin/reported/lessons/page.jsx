import ReportedLessonsList from "@/components/Admin/ReportedLessonsList";
import { getAllReports } from "@/lib/api/admin/report";
import React from "react";

const ReportedLessonsPage = async () => {
  const { total, reports } = await getAllReports();

  return (
    <div className="space-y-6">
      <header>
        <h1 className="text-3xl font-serif font-bold text-[#1E2E24]">
          Reported Lessons
        </h1>
        <p className="text-sm text-[#707E74] mt-1">
          {total} report{total === 1 ? "" : "s"} total
        </p>
      </header>

      <ReportedLessonsList reports={reports} />
    </div>
  );
};

export default ReportedLessonsPage;
