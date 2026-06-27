"use client";

import { useEffect } from "react";

import LessonActions from "@/components/Lessons/LessonActions";
import { setEngagementStats } from "@/components/Lessons/engagementStore";

/**
 * Thin client wrapper around the Like/Save/Report buttons that also
 * seeds the shared engagement store with the lesson's initial counts.
 *
 * The actual social-stats Card stays in the sidebar (server page) and
 * reads from the store via `useEngagementStats`, so this component
 * just needs to publish the starting snapshot once on mount.
 */
export default function LessonEngagement({
  lessonId,
  currentUserId,
  initialLikesCount,
  initialSavesCount,
  initialViewsCount = 0,
  initialIsLiked,
  initialIsSaved,
}) {
  useEffect(() => {
    setEngagementStats(lessonId, {
      likesCount: initialLikesCount,
      savesCount: initialSavesCount,
      viewsCount: initialViewsCount,
    });
  }, [lessonId, initialLikesCount, initialSavesCount, initialViewsCount]);

  return (
    <div className="mt-12 pt-6 border-t border-[#e2e8f0]">
      <LessonActions
        lessonId={lessonId}
        userId={currentUserId}
        initialLikesCount={initialLikesCount}
        initialSavesCount={initialSavesCount}
        initialIsLiked={initialIsLiked}
        initialIsSaved={initialIsSaved}
      />
    </div>
  );
}
