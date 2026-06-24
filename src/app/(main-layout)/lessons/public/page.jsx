import React from "react";
import PublicLessons from "@/components/Lessons/PublicLessons";
import { getPublicLessons } from "@/lib/api/lesson";

const PublicLessonsPage = async () => {
  // Fetch on the server so the grid is rendered with real data on first
  // paint and `lessonsData` is never undefined.
  const lessonsData = await getPublicLessons();

  return (
    <div className="py-20">
      <PublicLessons lessonsData={lessonsData} />
    </div>
  );
};

export default PublicLessonsPage;
