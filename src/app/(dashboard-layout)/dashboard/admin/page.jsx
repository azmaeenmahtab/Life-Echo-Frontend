import UserList from "@/components/Admin/UserList";
import { getAllUsers } from "@/lib/api/admin/user";
import { getReportedLessonsCount } from "@/lib/api/admin/report";
import { getPublicLessons } from "@/lib/api/lesson";
import React from "react";

const AdminDashboardPage = async () => {
  const data = await getAllUsers();
  const lessons = await getPublicLessons();
  const reportedCount = await getReportedLessonsCount();

  return (
    <div className="space-y-8">
      <h1 className="text-3xl font-serif font-bold text-[#1E2E24]">
        Admin Dashboard
      </h1>

      {/* Stat card row — designs land later, for now we just want to
          see the number come through end-to-end. */}
      <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="rounded-2xl border border-[#EBE7D9] bg-[#FAF8F3] p-6">
          <p className="text-[11px] font-sans font-bold tracking-widest text-[#707E74] uppercase mb-2">
            Reported Lessons
          </p>
          <h2 className="text-4xl font-serif font-bold text-[#1E2E24] leading-none">
            {reportedCount}
          </h2>
        </div>
      </section>

      {/* <UserList users={data?.users ?? []} /> */}
    </div>
  );
};

export default AdminDashboardPage;
