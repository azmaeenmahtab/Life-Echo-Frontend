"use client";

import { useRef, useState } from "react";
// Swapped FontAwesome for Lucide icons to fix the rendering issue
import { Heart, Bookmark, Flag } from "lucide-react";
import { Button } from "@heroui/react";

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

  // Publish the latest stats to the shared store on every mutation so
  // the sidebar's social stats card (separate React tree, same lesson)
  // re-renders in lockstep with these buttons. `getCounters` reads the
  // freshest values from a ref to avoid stale-closure bugs (React state
  // captured at handler-creation time can lag behind optimistic updates).
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

  const onReport = () =>
    handleToggle({
      verb: "report",
      busyKey: "report",
      prevSnapshot: () => setReported(false),
      applyOptimistic: () => setReported(true),
      applyServer: null,
    });

  return (
    <div className="flex flex-wrap gap-3 border-t border-[#e2e8f0] pt-6 mt-12">
      {/* LIKE BUTTON */}
      <Button
        size="md"
        className={`font-medium rounded-xl transition-all ${
          isLiked
            ? "bg-[#e2f2e9] text-[#2e7d32]"
            : "bg-white border border-[#cbd5e1] text-[#475569] hover:bg-slate-50"
        }`}
        variant={isLiked ? "flat" : "bordered"}
        startContent={
          <Heart
            size={18}
            className={busy.like ? "opacity-60" : ""}
            // Fills the heart when active to mimic the "Solid" version
            fill={isLiked ? "currentColor" : "none"}
          />
        }
        onPress={onLike}
        isDisabled={!canInteract}
        aria-pressed={isLiked}
      >
        {isLiked ? "Liked" : "Like"}
      </Button>

      {/* SAVE BUTTON */}
      <Button
        size="md"
        className={`font-medium rounded-xl transition-all ${
          isSaved
            ? "bg-[#e2f2e9] text-[#2e7d32]"
            : "bg-white border border-[#cbd5e1] text-[#475569] hover:bg-slate-50"
        }`}
        variant={isSaved ? "flat" : "bordered"}
        startContent={
          <Bookmark
            size={18}
            className={busy.save ? "opacity-60" : ""}
            fill={isSaved ? "currentColor" : "none"}
          />
        }
        onPress={onSave}
        isDisabled={!canInteract}
        aria-pressed={isSaved}
      >
        Save to Favorites
      </Button>

      {/* SHARE BUTTON (Matches design alignment) */}
      {/* <Button
        size="md"
        variant="light"
        className="font-medium text-[#475569] hover:bg-slate-100 rounded-xl transition-all"
        startContent={
          <svg
            xmlns="http://www.w3.org/2000/svg"
            size={18}
            width="18"
            height="18"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v8"></path>
            <polyline points="16 6 12 2 8 6"></polyline>
            <line x1="12" y1="2" x2="12" y2="15"></line>
          </svg>
        }
      >
        Share
      </Button> */}

      {/* REPORT BUTTON */}
      <Button
        size="md"
        variant="light"
        className={`font-medium rounded-xl transition-all ${
          reported ? "text-danger" : "text-[#475569] hover:bg-slate-100"
        }`}
        startContent={
          <Flag
            size={18}
            className={busy.report ? "opacity-60" : ""}
            fill={reported ? "currentColor" : "none"}
          />
        }
        onPress={onReport}
        isDisabled={!canInteract || reported}
      >
        {reported ? "Reported" : "Report"}
      </Button>
    </div>
  );
}
