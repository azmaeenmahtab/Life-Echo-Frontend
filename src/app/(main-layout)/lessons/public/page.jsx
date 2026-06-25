import React from "react";
import PublicLessonFilter from "@/components/Lessons/PublicLessonFilter";
import PublicLessons from "@/components/Lessons/PublicLessons";
import { getPublicLessons } from "@/lib/api/lesson";

const PublicLessonsPage = async ({ searchParams }) => {
  const params = await searchParams;

  const queryPayload = {
    category: params.category || "",
    tone: params.tone || "",
    keywords: params.keywords || "",
    sortby: params.sortby || "newest",
  };

  const lessonsData = await getPublicLessons(queryPayload);

  return (
    <div className="min-h-screen bg-[#F5F2EB] py-30 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Shared Header Section */}
        <header className="text-center mb-10 space-y-3">
          <h1 className="text-4xl font-serif font-bold text-[#1E2E24] tracking-tight relative inline-block pb-3">
            Why Learning From Life Matters
            <span className="absolute bottom-0 left-1/4 right-1/4 h-[3px] bg-[#8B7E66] rounded-full"></span>
          </h1>
          <p className="text-base font-sans text-[#556359] max-w-xl mx-auto pt-1">
            Browse publicly shared wisdom from our global collective of growing
            minds.
          </p>
        </header>

        {/* Separated Filters Bar */}
        <PublicLessonFilter />

        {/* Separated Lessons Grid */}
        <PublicLessons lessonsData={lessonsData} />
      </div>
    </div>
  );
};

export default PublicLessonsPage;
