import UserList from "@/components/Admin/UserList";
import MostActiveContributors from "@/components/Admin/MostActiveContributors";
import TodaysLessons from "@/components/Admin/TodaysLessons";
import LessonGrowthCard from "@/components/Admin/LessonGrowthCard";
import UserGrowthCard from "@/components/Admin/UserGrowthCard";
import AdminStatCard from "@/components/Admin/AdminStatCard";
import { getAllUsers, getTopContributors } from "@/lib/api/admin/user";
import { getReportedLessonsCount } from "@/lib/api/admin/report";
import { getPublicLessons, getTodaysLessons } from "@/lib/api/lesson";
import React from "react";

// Every dashboard call below uses `cache: "no-store"`, so the page
// must opt out of static prerendering or the Vercel build fails.
export const dynamic = "force-dynamic";

const AdminDashboardPage = async () => {
  const data = await getAllUsers();
  const lessons = await getPublicLessons();
  const reportedCount = await getReportedLessonsCount();
  const topContributors = await getTopContributors({ limit: 5 });
  const todaysLessons = await getTodaysLessons({ limit: 5 });

  const totalUsers = Array.isArray(data?.users) ? data.users.length : 0;
  const totalPublicLessons = Array.isArray(lessons) ? lessons.length : 0;

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 space-y-8 bg-[#FAFAF9] rounded-2xl min-h-screen antialiased">
      {/* Header Section */}
      <header className="border-b border-stone-200 pb-5">
        <h1 className="text-2xl font-serif font-black tracking-tight text-[#1E2E24]">
          Admin Dashboard
        </h1>
        <p className="text-sm text-stone-500 mt-1 font-sans">
          Overview of platform activity, growth metrics, and content management.
        </p>
      </header>

      {/* Top-of-page stat strip — Fixed to 3 columns to eliminate the awkward trailing empty space */}
      <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        <AdminStatCard label="Total Users" value={totalUsers} />
        <AdminStatCard
          label="Total Public Lessons"
          value={totalPublicLessons}
        />
        {/* If 'reportedCount' is a concern, you can conditionally style its card inside AdminStatCard component */}
        <AdminStatCard label="Reported Lessons" value={reportedCount} />
      </section>

      {/* Wide cards row: Side-by-side execution for proper visual balance */}
      <section className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-stretch">
        <MostActiveContributors contributors={topContributors.contributors} />
        <TodaysLessons
          total={todaysLessons.total}
          lessons={todaysLessons.lessons}
        />
      </section>

      {/* Growth charts row: Clean split view */}
      <section className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <LessonGrowthCard days={30} />
        <UserGrowthCard days={30} />
      </section>

      {/* Optional User Table hidden by default */}
      {/* 
      <section className="bg-white rounded-xl shadow-sm border border-stone-100 p-6">
        <UserList users={data?.users ?? []} /> 
      </section>
      */}
    </div>
  );
};

export default AdminDashboardPage;
