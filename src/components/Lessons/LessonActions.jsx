"use client";

import { useRef, useState } from "react";
import { Heart, Bookmark, Flag } from "lucide-react";
// 1. Corrected hook consumption to match openReportModal
import { useReportModal } from "@/lib/contexts/reportModalContext";

import {
  toggleLikeLesson,
  toggleSaveLesson,
  reportLesson,
} from "@/lib/actions/lessonActions";
import { setEngagementStats } from "@/components/Lessons/engagementStore";

export default function LessonActions({
  lessonId,
  userId,
  initialLikesCount = 0,
  initialSavesCount = 0,
  initialViewsCount = 0,
  initialIsLiked = false,
  initialIsSaved = false,
}) {
  const [likesCount, setLikesCount] = useState(initialLikesCount);
  const [savesCount, setSavesCount] = useState(initialSavesCount);
  const [viewsCount] = useState(initialViewsCount);
  const [isLiked, setIsLiked] = useState(initialIsLiked);
  const [isSaved, setIsSaved] = useState(initialIsSaved);
  const [reported, setReported] = useState(false);
  const [busy, setBusy] = useState({ like: false, save: false, report: false });

  // FIX: Destructure openReportModal instead of openModal
  const { openReportModal } = useReportModal();

  const countersRef = useRef({ likesCount, savesCount, viewsCount });
  countersRef.current = { likesCount, savesCount, viewsCount };

  const publish = (overrides = {}) => {
    const latest = countersRef.current;
    setEngagementStats(lessonId, {
      likesCount: overrides.likesCount ?? latest.likesCount,
      savesCount: overrides.savesCount ?? latest.savesCount,
      viewsCount: overrides.viewsCount ?? latest.viewsCount,
    });
  };

  const canInteract = Boolean(userId);

  const handleToggle = async ({
    verb,
    busyKey,
    prevSnapshot,
    applyOptimistic,
    applyServer,
  }) => {
    if (!canInteract || busy[busyKey]) return;
    if (verb === "report" && reported) return;

    setBusy((b) => ({ ...b, [busyKey]: true }));
    applyOptimistic();
    publish();
    try {
      const data = await (verb === "like"
        ? toggleLikeLesson({ lessonId, userId })
        : verb === "save"
          ? toggleSaveLesson({ lessonId, userId })
          : reportLesson({ lessonId, userId }));
      if (applyServer) applyServer(data);
      publish();
    } catch (err) {
      prevSnapshot();
      publish();
      console.error(`[LessonActions] ${verb} failed:`, err);
    } finally {
      setBusy((b) => ({ ...b, [busyKey]: false }));
    }
  };

  const onLike = () =>
    handleToggle({
      verb: "like",
      busyKey: "like",
      prevSnapshot: () => {
        setLikesCount((c) => c - (isLiked ? 1 : -1));
        setIsLiked((v) => !v);
      },
      applyOptimistic: () => {
        setIsLiked((v) => !v);
        setLikesCount((c) => c + (isLiked ? -1 : 1));
      },
      applyServer: (data) => {
        if (typeof data?.likesCount === "number")
          setLikesCount(data.likesCount);
        if (typeof data?.isLiked === "boolean") setIsLiked(data.isLiked);
      },
    });

  const onSave = () =>
    handleToggle({
      verb: "save",
      busyKey: "save",
      prevSnapshot: () => {
        setSavesCount((c) => c - (isSaved ? 1 : -1));
        setIsSaved((v) => !v);
      },
      applyOptimistic: () => {
        setIsSaved((v) => !v);
        setSavesCount((c) => c + (isSaved ? -1 : 1));
      },
      applyServer: (data) => {
        if (typeof data?.savesCount === "number")
          setSavesCount(data.savesCount);
        if (typeof data?.isSaved === "boolean") setIsSaved(data.isSaved);
      },
    });

  const onReport = () => {
    if (!canInteract || reported) return;

    // Pure target execution: Trigger the basic text modal open function
    openReportModal();
  };

  return (
    <div className="flex flex-wrap gap-3 border-t border-[#e2e8f0] pt-6">
      {/* LIKE BUTTON */}
      <button
        type="button"
        onClick={onLike}
        disabled={!canInteract}
        className={`inline-flex items-center gap-2 px-4 h-10 font-medium rounded-xl transition-all text-sm ${
          isLiked
            ? "bg-[#e2f2e9] text-[#2e7d32]"
            : "bg-white border border-[#cbd5e1] text-[#475569] hover:bg-slate-50"
        } disabled:opacity-50`}
      >
        <Heart
          size={18}
          className={busy.like ? "opacity-60" : ""}
          fill={isLiked ? "currentColor" : "none"}
        />
        {isLiked ? "Liked" : "Like"}
      </button>

      {/* SAVE BUTTON */}
      <button
        type="button"
        onClick={onSave}
        disabled={!canInteract}
        className={`inline-flex items-center gap-2 px-4 h-10 font-medium rounded-xl transition-all text-sm ${
          isSaved
            ? "bg-[#e2f2e9] text-[#2e7d32]"
            : "bg-white border border-[#cbd5e1] text-[#475569] hover:bg-slate-50"
        } disabled:opacity-50`}
      >
        <Bookmark
          size={18}
          className={busy.save ? "opacity-60" : ""}
          fill={isSaved ? "currentColor" : "none"}
        />
        Save to Favorites
      </button>

      {/* REPORT BUTTON */}
      <button
        type="button"
        onClick={onReport}
        disabled={!canInteract || reported}
        className={`inline-flex items-center gap-2 px-4 h-10 font-medium rounded-xl transition-all text-sm ${
          reported
            ? "text-red-600 bg-red-50"
            : "text-[#475569] hover:bg-slate-100"
        } disabled:opacity-50`}
      >
        <Flag
          size={18}
          className={busy.report ? "opacity-60" : ""}
          fill={reported ? "currentColor" : "none"}
        />
        {reported ? "Reported" : "Report"}
      </button>
    </div>
  );
}
