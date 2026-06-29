"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import {
  ExternalLink,
  Trash2,
  ChevronDown,
  Eye,
  EyeOff,
  Pencil,
  Star,
} from "lucide-react";
import toast from "react-hot-toast";
import { getPublicLessons } from "@/lib/api/lesson";
import {
  changeLessonVisibility,
  setLessonReviewStatus,
} from "@/lib/actions/lessonActions";
import { useLessonDeleteModal } from "@/lib/contexts/lessonDeleteModalContext";

/**
 * Admin-side lessons table.
 *
 * Lists every lesson on the platform and exposes the controls admins
 * need to moderate content directly from /dashboard/admin/manage/lessons:
 *   - View the lesson detail page
 *   - Toggle visibility (public / private)
 *   - Delete the lesson
 *
 * The delete action goes through the existing delete modal context.
 * Visibility flips use the `changeLessonVisibility` server action.
 *
 * What we are NOT wiring yet:
 *   - Force-delete bypassing the owner check (backend currently enforces
 *     owner-only delete).
 *   - Inline access-level toggle (requires the admin's plan to be "pro",
 *     which is not a guaranteed property of the admin session).
 *   - An inline edit affordance (the lesson update modal still exists
 *     for owner flows in MyLessons.jsx).
 *   - A real `toggleLessonFeatured` server action + `isFeatured` field
 *     on the lesson schema. The Featured column is wired UI-only; the
 *     toggle currently logs the intent and updates the local row so the
 *     surface is in place when the backend lands.
 * Those land in a follow-up pass.
 */

const VISIBILITY_OPTIONS = ["public", "private"];
const REVIEW_STATUS_OPTIONS = ["pending", "reviewed", "rejected"];

export default function LessonsList({ initialLessons }) {
  const { openLessonDeleteModal, deletedLessonId } = useLessonDeleteModal();

  const [lessons, setLessons] = useState(
    Array.isArray(initialLessons) ? initialLessons : [],
  );
  const [loading, setLoading] = useState(!Array.isArray(initialLessons));
  const [openVisibilityId, setOpenVisibilityId] = useState(null);
  const [openReviewId, setOpenReviewId] = useState(null);
  const [updatingId, setUpdatingId] = useState(null);

  // Fetch on mount only when no SSR seed was provided.
  useEffect(() => {
    if (Array.isArray(initialLessons) && initialLessons.length > 0) {
      setLoading(false);
      return;
    }
    let cancelled = false;
    (async () => {
      try {
        setLoading(true);
        const data = await getPublicLessons();
        if (!cancelled) setLessons(Array.isArray(data) ? data : []);
      } catch (error) {
        console.error("LessonsList: failed to fetch lessons", error);
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Drop the row whenever the delete modal reports a successful delete.
  useEffect(() => {
    if (!deletedLessonId) return;
    setLessons((prev) => prev.filter((l) => l._id !== deletedLessonId));
  }, [deletedLessonId]);

  const total = useMemo(() => lessons.length, [lessons]);

  const handleFeaturedToggle = (lesson) => {
    if (!lesson?._id) return;
    // UI-only stub. When the backend ships, swap this for a real
    // `toggleLessonFeatured({ lessonId, userId })` server action that
    // returns the updated `isFeatured` flag, mirroring the pattern used
    // by `changeLessonVisibility` directly below.
    const next = !lesson.isFeatured;
    setLessons((prev) =>
      prev.map((l) =>
        l._id === lesson._id ? { ...l, isFeatured: next } : l,
      ),
    );
    toast.success(
      next ? "Lesson marked as featured" : "Lesson unfeatured",
    );
  };

  const handleVisibilitySelect = async (lesson, next) => {
    if (!lesson?._id || !next) return;
    if ((lesson.visibility || "public") === next) {
      setOpenVisibilityId(null);
      return;
    }
    try {
      setUpdatingId(lesson._id);
      // Admin-side: we don't yet have an admin-owned override, so for
      // now the action will succeed only when the admin is also the
      // lesson owner (same path MyLessons uses). The UI surface is here
      // so the wiring lands in one place when the admin override ships.
      const result = await changeLessonVisibility({
        lessonId: lesson._id,
        userId: lesson.creatorId || lesson.userId,
        visibility: next,
      });
      setLessons((prev) =>
        prev.map((l) =>
          l._id === lesson._id
            ? { ...l, visibility: result?.visibility ?? next }
            : l,
        ),
      );
      toast.success(`Visibility set to ${result?.visibility ?? next}`);
    } catch (error) {
      console.error("Failed to update visibility:", error);
      toast.error(error?.message || "Failed to update visibility");
    } finally {
      setUpdatingId(null);
      setOpenVisibilityId(null);
    }
  };

  const handleReviewSelect = async (lesson, next) => {
    if (!lesson?._id || !next) return;
    const current = (lesson.reviewStatus || "pending").toLowerCase();
    if (current === next) {
      setOpenReviewId(null);
      return;
    }
    try {
      setUpdatingId(lesson._id);
      const result = await setLessonReviewStatus({
        lessonId: lesson._id,
        userId: lesson.creatorId || lesson.userId,
        status: next,
      });
      setLessons((prev) =>
        prev.map((l) =>
          l._id === lesson._id
            ? {
                ...l,
                reviewStatus: result?.reviewStatus ?? next,
                // Reject cascades server-side. If the server returned the
                // post-cascade values, mirror them on the row so Visibility
                // and Featured stay in sync without a refetch.
                ...(result?.visibility ? { visibility: result.visibility } : {}),
                ...(typeof result?.isFeatured === "boolean"
                  ? { isFeatured: result.isFeatured }
                  : {}),
              }
            : l,
        ),
      );
      toast.success(`Review status set to ${result?.reviewStatus ?? next}`);
      if ((result?.reviewStatus ?? next) === "rejected") {
        toast(
          "Rejected lessons are forced to private and unfeatured.",
          { icon: "⚠️" },
        );
      }
    } catch (error) {
      console.error("Failed to update review status:", error);
      toast.error(error?.message || "Failed to update review status");
    } finally {
      setUpdatingId(null);
      setOpenReviewId(null);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[240px] rounded-2xl border border-[#EBE7D9] bg-white text-sm font-medium text-[#556359]">
        Loading lessons…
      </div>
    );
  }

  if (total === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-16 px-6 rounded-2xl border border-dashed border-[#EBE7D9] bg-[#FAF8F3] text-center">
        <p className="font-serif font-bold text-lg text-[#1E2E24]">
          No lessons yet
        </p>
        <p className="text-sm text-[#556359] mt-1">
          Lessons authored on the platform will appear here for moderation.
        </p>
      </div>
    );
  }

  return (
    <div className="bg-white border border-[#eae6df] rounded-3xl shadow-sm overflow-hidden">
      <div className="overflow-x-auto">
        <table className="min-w-full text-left text-sm">
          <thead className="bg-[#FAF8F3] text-[10px] uppercase tracking-wider text-[#556359] font-bold border-b border-[#EBE7D9]">
            <tr>
              <th className="px-5 py-3 whitespace-nowrap">Lesson</th>
              <th className="px-5 py-3 whitespace-nowrap">Access</th>
              <th className="px-5 py-3 whitespace-nowrap">Visibility</th>
              <th className="px-5 py-3 whitespace-nowrap">Featured</th>
              <th className="px-5 py-3 whitespace-nowrap">Review</th>
              <th className="px-5 py-3 whitespace-nowrap">Creator</th>
              <th className="px-5 py-3 whitespace-nowrap text-right">
                Actions
              </th>
            </tr>
          </thead>
          <tbody>
            {lessons.map((lesson) => {
              const key = lesson._id?.toString?.() ?? lesson.id;
              const isPremium =
                (lesson.accessLevel || "").toLowerCase() === "premium";
              const visibility = (lesson.visibility || "public").toLowerCase();
              const visibilityIsPublic = visibility === "public";
              const reviewStatus = (lesson.reviewStatus || "pending").toLowerCase();

              return (
                <tr
                  key={key}
                  className="border-b border-[#EBE7D9]/60 last:border-0 hover:bg-[#FAF8F3]/60 transition-colors"
                >
                  {/* Lesson (cover thumbnail + title + category + tone chips) */}
                  <td className="px-5 py-3">
                    <div className="flex items-center gap-3 max-w-[18rem]">
                      <span className="w-12 h-12 rounded-xl overflow-hidden bg-[#1c2f24] text-[#e2f2e9] flex items-center justify-center font-serif font-bold shrink-0 border border-[#eae6df]">
                        {lesson.imageUrl ? (
                          // eslint-disable-next-line @next/next/no-img-element
                          <img
                            src={lesson.imageUrl}
                            alt={lesson.title || "Lesson cover"}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          (lesson.title || "?").charAt(0).toUpperCase()
                        )}
                      </span>
                      <div className="min-w-0">
                        <p className="font-semibold text-[#1E2E24] truncate">
                          {lesson.title || "Untitled lesson"}
                        </p>
                        <div className="flex flex-wrap items-center gap-1 mt-1">
                          {lesson.category && (
                            <span className="inline-flex items-center px-2 py-0.5 rounded-md text-[10px] font-bold uppercase tracking-wider border bg-[#EBE7D9]/60 text-[#556359] border-[#E3DFD3]/40">
                              {lesson.category}
                            </span>
                          )}
                          {lesson.emotionalTone && (
                            <span className="inline-flex items-center px-2 py-0.5 rounded-md text-[10px] font-bold uppercase tracking-wider border bg-[#fef3d6] text-[#b27b00] border-[#f4e3b1]">
                              {lesson.emotionalTone}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  </td>

                  {/* Access level */}
                  <td className="px-5 py-3">
                    <span
                      className={
                        "inline-flex items-center px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider border " +
                        (isPremium
                          ? "bg-[#f5e9d4] text-[#a17236] border-[#e8d6b4]"
                          : "bg-[#e2f2e9] text-[#2e7d32] border-[#cfe5d3]")
                      }
                    >
                      {isPremium ? "premium" : "free"}
                    </span>
                  </td>

                  {/* Visibility (with inline toggle) */}
                  <td className="px-5 py-3 whitespace-nowrap">
                    <div className="relative inline-flex flex-col items-start gap-1">
                      <span
                        className={
                          "inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider border " +
                          (visibilityIsPublic
                            ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                            : "bg-slate-100 text-slate-600 border-slate-200")
                        }
                      >
                        {visibilityIsPublic ? (
                          <Eye size={11} className="opacity-70" />
                        ) : (
                          <EyeOff size={11} className="opacity-70" />
                        )}
                        {visibility}
                      </span>
                      <button
                        type="button"
                        onClick={() =>
                          setOpenVisibilityId(
                            openVisibilityId === lesson._id ? null : lesson._id,
                          )
                        }
                        className="inline-flex items-center gap-0.5 text-[10px] font-bold text-[#556359] hover:text-[#2e7d32] transition-colors ml-1 uppercase tracking-wider"
                      >
                        Change
                        <ChevronDown
                          size={11}
                          className={`transition-transform duration-200 ${
                            openVisibilityId === lesson._id ? "rotate-180" : ""
                          }`}
                        />
                      </button>

                      {openVisibilityId === lesson._id && (
                        <div
                          className="absolute left-0 top-full mt-1 z-20 min-w-[140px] bg-[#FAF8F3] border border-[#EBE7D9] rounded-xl shadow-xl py-1"
                          onMouseLeave={() => setOpenVisibilityId(null)}
                        >
                          {VISIBILITY_OPTIONS.map((option) => {
                            const isActive = visibility === option;
                            return (
                              <button
                                key={option}
                                type="button"
                                disabled={updatingId === lesson._id}
                                onClick={() =>
                                  handleVisibilitySelect(lesson, option)
                                }
                                className={
                                  "w-full text-left px-3 py-1.5 text-[10px] font-bold uppercase tracking-wider transition-colors flex items-center justify-between " +
                                  (isActive
                                    ? "text-[#2e7d32] bg-emerald-50"
                                    : "text-[#556359] hover:bg-[#F2EFE6] hover:text-[#1E2E24]") +
                                  " disabled:opacity-50 disabled:cursor-not-allowed"
                                }
                              >
                                <span>{option}</span>
                                {isActive && (
                                  <span className="text-[#2e7d32]">✓</span>
                                )}
                              </button>
                            );
                          })}
                        </div>
                      )}
                    </div>
                  </td>

                  {/* Featured (admin toggle) */}
                  <td className="px-5 py-3 whitespace-nowrap">
                    <button
                      type="button"
                      onClick={() => handleFeaturedToggle(lesson)}
                      title={
                        lesson.isFeatured
                          ? "Unfeature this lesson"
                          : "Feature this lesson"
                      }
                      aria-label={
                        lesson.isFeatured
                          ? "Unfeature lesson"
                          : "Feature lesson"
                      }
                      aria-pressed={Boolean(lesson.isFeatured)}
                      className={
                        "inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider border transition-colors " +
                        (lesson.isFeatured
                          ? "bg-amber-50 text-amber-800 border-amber-200 hover:bg-amber-100"
                          : "bg-slate-50 text-slate-500 border-slate-200 hover:text-amber-700 hover:border-amber-200")
                      }
                    >
                      <Star
                        size={11}
                        className={
                          lesson.isFeatured
                            ? "fill-amber-500 text-amber-500"
                            : "text-slate-400"
                        }
                      />
                      {lesson.isFeatured ? "Featured" : "Feature"}
                    </button>
                  </td>

                  {/* Review status (admin moderation, mirrors Visibility) */}
                  <td className="px-5 py-3 whitespace-nowrap">
                    <div className="relative inline-flex flex-col items-start gap-1">
                      <span
                        className={
                          "inline-flex items-center px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider border " +
                          (reviewStatus === "reviewed"
                            ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                            : reviewStatus === "rejected"
                            ? "bg-red-50 text-red-700 border-red-200"
                            : "bg-amber-50 text-amber-800 border-amber-200")
                        }
                      >
                        {reviewStatus}
                      </span>
                      <button
                        type="button"
                        onClick={() =>
                          setOpenReviewId(
                            openReviewId === lesson._id ? null : lesson._id,
                          )
                        }
                        className="inline-flex items-center gap-0.5 text-[10px] font-bold text-[#556359] hover:text-[#2e7d32] transition-colors ml-1 uppercase tracking-wider"
                      >
                        Change
                        <ChevronDown
                          size={11}
                          className={`transition-transform duration-200 ${
                            openReviewId === lesson._id ? "rotate-180" : ""
                          }`}
                        />
                      </button>

                      {openReviewId === lesson._id && (
                        <div
                          className="absolute left-0 top-full mt-1 z-20 min-w-[140px] bg-[#FAF8F3] border border-[#EBE7D9] rounded-xl shadow-xl py-1"
                          onMouseLeave={() => setOpenReviewId(null)}
                        >
                          {REVIEW_STATUS_OPTIONS.map((option) => {
                            const isActive = reviewStatus === option;
                            return (
                              <button
                                key={option}
                                type="button"
                                disabled={updatingId === lesson._id}
                                onClick={() =>
                                  handleReviewSelect(lesson, option)
                                }
                                className={
                                  "w-full text-left px-3 py-1.5 text-[10px] font-bold uppercase tracking-wider transition-colors flex items-center justify-between " +
                                  (isActive
                                    ? "text-[#2e7d32] bg-emerald-50"
                                    : "text-[#556359] hover:bg-[#F2EFE6] hover:text-[#1E2E24]") +
                                  " disabled:opacity-50 disabled:cursor-not-allowed"
                                }
                              >
                                <span>{option}</span>
                                {isActive && (
                                  <span className="text-[#2e7d32]">✓</span>
                                )}
                              </button>
                            );
                          })}
                        </div>
                      )}
                    </div>
                  </td>

                  {/* Creator (avatar + name) */}
                  <td className="px-5 py-3">
                    <div className="flex items-center gap-2">
                      <span className="w-8 h-8 rounded-full overflow-hidden bg-[#1c2f24] text-[#e2f2e9] flex items-center justify-center font-serif font-bold text-xs shrink-0 border border-[#eae6df]">
                        {lesson.creatorProfilePic ? (
                          // eslint-disable-next-line @next/next/no-img-element
                          <img
                            src={lesson.creatorProfilePic}
                            alt={lesson.creatorName || "Creator avatar"}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          (lesson.creatorName || "?").charAt(0).toUpperCase()
                        )}
                      </span>
                      <span className="font-medium text-[#1E2E24] truncate max-w-[12rem]">
                        {lesson.creatorName || "Unknown"}
                      </span>
                    </div>
                  </td>

                  {/* Actions: View / Delete */}
                  <td className="px-5 py-3 text-right whitespace-nowrap">
                    <div className="inline-flex items-center justify-end gap-1">
                      <Link
                        href={`/lessons/details/${lesson._id}`}
                        title="View lesson"
                        aria-label="View lesson"
                        className="inline-flex items-center justify-center w-8 h-8 rounded-lg text-slate-500 hover:text-[#1E2E24] hover:bg-slate-100 transition-colors"
                      >
                        <ExternalLink size={15} />
                      </Link>
                      {/* <button
                        type="button"
                        title="Edit lesson"
                        aria-label="Edit lesson"
                        onClick={() => openLessonUpdateModal(lesson)}
                        className="inline-flex items-center justify-center w-8 h-8 rounded-lg text-slate-500 hover:text-[#2e7d32] hover:bg-emerald-50 transition-colors"
                      >
                        <Pencil size={15} />
                      </button> */}
                      <button
                        type="button"
                        title="Delete lesson"
                        aria-label="Delete lesson"
                        onClick={() => openLessonDeleteModal(lesson)}
                        className="inline-flex items-center justify-center w-8 h-8 rounded-lg text-slate-500 hover:text-red-600 hover:bg-red-50 transition-colors"
                      >
                        <Trash2 size={15} />
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
