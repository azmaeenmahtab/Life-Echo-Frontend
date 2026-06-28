"use client";

import { useEffect, useState } from "react";
import { redirect } from "next/navigation";
import { Chip, Button } from "@heroui/react";
import {
  Eye,
  Pencil,
  Trash2,
  ExternalLink,
  ThumbsUp,
  Bookmark,
  Calendar,
  ChevronDown,
} from "lucide-react";
import Link from "next/link";
import { getLessonsByUserId } from "@/lib/api/lesson";
import {
  changeLessonVisibility,
  changeLessonAccessLevel,
} from "@/lib/actions/lessonActions";
import toast from "react-hot-toast";

export function MyLessonsTable({ user }) {
  const userId = user?.id;
  if (!user) {
    redirect("/auth/login");
  }

  const [lessons, setLessons] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadLessons = async () => {
      try {
        setLoading(true);
        const data = await getLessonsByUserId(user.id);
        setLessons(Array.isArray(data) ? data : []);
      } catch (error) {
        console.error("Failed to fetch lessons:", error);
      } finally {
        setLoading(false);
      }
    };

    loadLessons();
  }, [user.id]);

  // Track which lesson's visibility dropdown is open
  const [openVisibilityId, setOpenVisibilityId] = useState(null);
  // Track which lesson's access-level dropdown is open
  const [openAccessLevelId, setOpenAccessLevelId] = useState(null);
  const [updatingId, setUpdatingId] = useState(null);

  const isPremiumUser = user?.plan === "pro";

  const handleVisibilityChange = async (lessonId, newVisibility) => {
    if (!newVisibility) return;
    try {
      setUpdatingId(lessonId);
      const result = await changeLessonVisibility({
        lessonId,
        userId,
        visibility: newVisibility,
      });

      // Optimistically reflect the new visibility in the local list
      setLessons((prev) =>
        prev.map((l) =>
          l._id === lessonId ? { ...l, visibility: newVisibility } : l,
        ),
      );

      console.log(
        `Visibility updated for lesson ${lessonId}: ${result?.visibility ?? newVisibility}`,
      );
    } catch (error) {
      console.error("Failed to update visibility:", error);
    } finally {
      setUpdatingId(null);
      setOpenVisibilityId(null);
    }
  };

  const handleAccessLevelChange = async (lessonId, currentAccessLevel) => {
    // Toggling back to "free" is always allowed.
    // Upgrading to "premium" requires the Pro plan.
    if (currentAccessLevel !== "premium" && !isPremiumUser) {
      toast.error("u must upgrade to access this feature");
      setOpenAccessLevelId(null);
      return;
    }

    if (openAccessLevelId === lessonId) {
      setOpenAccessLevelId(null);
      return;
    }
    setOpenAccessLevelId(lessonId);
  };

  const handleAccessLevelSelect = async (lessonId, newAccessLevel) => {
    if (!newAccessLevel) return;
    try {
      setUpdatingId(lessonId);
      const result = await changeLessonAccessLevel({
        lessonId,
        userId,
        accessLevel: newAccessLevel,
      });

      setLessons((prev) =>
        prev.map((l) =>
          l._id === lessonId
            ? { ...l, accessLevel: result?.accessLevel ?? newAccessLevel }
            : l,
        ),
      );

      toast.success(
        `Lesson marked as ${result?.accessLevel ?? newAccessLevel}`,
      );
    } catch (error) {
      console.error("Failed to update access level:", error);
      const message =
        error?.message || "Failed to update access level. Please try again.";
      toast.error(message);
    } finally {
      setUpdatingId(null);
      setOpenAccessLevelId(null);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[200px] text-sm font-medium text-[#556359]">
        Loading your lessons...
      </div>
    );
  }

  if (lessons.length === 0) {
    return (
      <div className="text-center py-12 border-2 border-dashed border-[#EBE7D9] rounded-2xl bg-white p-6">
        <p className="text-sm font-medium text-[#556359] mb-4">
          You haven't created any lessons yet.
        </p>
        <Link
          href="/dashboard/add-lesson"
          className="inline-flex items-center justify-center px-4 h-10 rounded-xl bg-[#1E2E24] text-white text-sm font-medium hover:bg-[#2A3F33] transition-all"
        >
          Create your first lesson
        </Link>
      </div>
    );
  }

  return (
    <div className="w-full overflow-hidden rounded-2xl border border-[#EBE7D9] bg-white shadow-sm">
      <div className="overflow-x-auto">
        <table className="w-full border-collapse text-left text-sm text-[#1E2E24]">
          <thead className="bg-[#FAF8F3] border-b border-[#EBE7D9] text-[11px] font-bold uppercase tracking-wider text-[#556359]">
            <tr>
              <th scope="col" className="px-6 py-4 font-bold">
                Lesson Info
              </th>
              <th scope="col" className="px-6 py-4 font-bold">
                Stats
              </th>
              <th scope="col" className="px-6 py-4 font-bold">
                Visibility
              </th>
              <th scope="col" className="px-6 py-4 font-bold">
                Access Level
              </th>
              <th scope="col" className="px-6 py-4 font-bold text-right">
                Actions
              </th>
            </tr>
          </thead>

          <tbody className="divide-y divide-[#EBE7D9]/60">
            {lessons.map((lesson) => {
              const formattedDate = lesson.createdAt
                ? new Date(lesson.createdAt).toLocaleDateString("en-US", {
                    month: "short",
                    day: "numeric",
                    year: "numeric",
                  })
                : "N/A";

              return (
                <tr
                  key={lesson._id}
                  className="hover:bg-[#FAF8F3]/40 transition-colors"
                >
                  {/* 1. Lesson Info Banner */}
                  <td className="px-6 py-4 max-w-sm">
                    <div className="flex gap-4 items-start">
                      <div className="h-14 w-20 shrink-0 overflow-hidden rounded-lg border border-[#EBE7D9] bg-slate-50">
                        <img
                          src={
                            lesson.imageUrl ||
                            "https://images.unsplash.com/photo-1506126613408-eca07ce68773?q=80&w=200"
                          }
                          alt={lesson.title}
                          className="h-full w-full object-cover"
                        />
                      </div>
                      <div className="space-y-1">
                        <h4 className="font-serif font-bold text-base text-[#1E2E24] line-clamp-1">
                          {lesson.title || "Untitled Lesson"}
                        </h4>
                        <p className="text-xs text-[#556359] line-clamp-1 mb-1.5">
                          {lesson.story}
                        </p>
                        <div className="flex flex-wrap gap-1">
                          {lesson.category && (
                            <Chip
                              size="sm"
                              className="bg-[#e2f2e9] text-[#2e7d32] font-semibold text-[9px] uppercase tracking-wider rounded-md h-5 px-1.5"
                            >
                              {lesson.category}
                            </Chip>
                          )}
                          {lesson.emotionalTone && (
                            <Chip
                              size="sm"
                              className="bg-[#fef3d6] text-[#b27b00] font-semibold text-[9px] uppercase tracking-wider rounded-md h-5 px-1.5"
                            >
                              {lesson.emotionalTone}
                            </Chip>
                          )}
                        </div>
                      </div>
                    </div>
                  </td>

                  {/* 2. Micro Statistics */}
                  <td className="px-6 py-4 whitespace-nowrap text-xs text-[#556359] space-y-1.5">
                    <div className="flex items-center gap-1.5">
                      <Calendar size={13} className="text-slate-400" />
                      <span>{formattedDate}</span>
                    </div>
                    <div className="flex items-center gap-4 text-slate-400">
                      <div className="flex items-center gap-1">
                        <ThumbsUp size={12} />
                        <span className="font-semibold text-[#1E2E24]">
                          {lesson.likesCount ?? 0}
                        </span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Bookmark size={12} />
                        <span className="font-semibold text-[#1E2E24]">
                          {lesson.savesCount ?? 0}
                        </span>
                      </div>
                    </div>
                  </td>

                  {/* 3. Visibility Column with Change Trigger */}
                  <td className="px-6 py-4 whitespace-nowrap header-group vertical-align">
                    <div className="flex flex-col items-start gap-1.5 relative">
                      <Chip
                        size="sm"
                        variant="flat"
                        className={`font-semibold text-[10px] uppercase tracking-wider rounded-full h-6 px-2.5 ${
                          lesson.visibility === "public"
                            ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                            : "bg-slate-100 text-slate-600 border border-slate-200"
                        }`}
                      >
                        {lesson.visibility || "public"}
                      </Chip>
                      <button
                        type="button"
                        onClick={() =>
                          setOpenVisibilityId(
                            openVisibilityId === lesson._id ? null : lesson._id,
                          )
                        }
                        className="inline-flex items-center gap-0.5 text-[11px] font-bold text-[#556359] hover:text-[#2e7d32] transition-colors ml-1 uppercase tracking-wider"
                      >
                        Change
                        <ChevronDown
                          size={12}
                          className={`transition-transform duration-200 ${
                            openVisibilityId === lesson._id ? "rotate-180" : ""
                          }`}
                        />
                      </button>

                      {openVisibilityId === lesson._id && (
                        <div
                          className="absolute left-0 top-full mt-1 z-20 min-w-[140px] bg-[#FAF8F3] border border-[#EBE7D9] rounded-xl shadow-xl py-1 animate-in fade-in slide-in-from-top-1 duration-150"
                          onMouseLeave={() => setOpenVisibilityId(null)}
                        >
                          {["public", "private"].map((option) => {
                            const isActive =
                              (lesson.visibility || "public") === option;
                            return (
                              <button
                                key={option}
                                type="button"
                                disabled={updatingId === lesson._id}
                                onClick={() =>
                                  handleVisibilityChange(lesson._id, option)
                                }
                                className={`w-full text-left px-3 py-1.5 text-[11px] font-bold uppercase tracking-wider transition-colors flex items-center justify-between ${
                                  isActive
                                    ? "text-[#2e7d32] bg-emerald-50"
                                    : "text-[#556359] hover:bg-[#F2EFE6] hover:text-[#1E2E24]"
                                } disabled:opacity-50 disabled:cursor-not-allowed`}
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

                  {/* 4. Access Level Column with Change Trigger */}
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex flex-col items-start gap-1.5 relative">
                      <Chip
                        size="sm"
                        variant="flat"
                        className={`font-semibold text-[10px] uppercase tracking-wider rounded-full h-6 px-2.5 ${
                          lesson.accessLevel === "premium"
                            ? "bg-amber-50 text-amber-700 border border-amber-200"
                            : "bg-blue-50 text-blue-700 border border-blue-200"
                        }`}
                      >
                        {lesson.accessLevel || "free"}
                      </Chip>
                      <button
                        type="button"
                        onClick={() =>
                          handleAccessLevelChange(
                            lesson._id,
                            lesson.accessLevel || "free",
                          )
                        }
                        className="inline-flex items-center gap-0.5 text-[11px] font-bold text-[#556359] hover:text-[#b27b00] transition-colors ml-1 uppercase tracking-wider"
                      >
                        Change
                        <ChevronDown
                          size={12}
                          className={`transition-transform duration-200 ${
                            openAccessLevelId === lesson._id ? "rotate-180" : ""
                          }`}
                        />
                      </button>

                      {openAccessLevelId === lesson._id && (
                        <div
                          className="absolute left-0 top-full mt-1 z-20 min-w-[140px] bg-[#FAF8F3] border border-[#EBE7D9] rounded-xl shadow-xl py-1 animate-in fade-in slide-in-from-top-1 duration-150"
                          onMouseLeave={() => setOpenAccessLevelId(null)}
                        >
                          {["free", "premium"].map((option) => {
                            const isActive =
                              (lesson.accessLevel || "free") === option;
                            const isLocked =
                              option === "premium" && !isPremiumUser;
                            return (
                              <button
                                key={option}
                                type="button"
                                disabled={updatingId === lesson._id || isLocked}
                                onClick={() =>
                                  handleAccessLevelSelect(lesson._id, option)
                                }
                                className={`w-full text-left px-3 py-1.5 text-[11px] font-bold uppercase tracking-wider transition-colors flex items-center justify-between ${
                                  isActive
                                    ? "text-[#b27b00] bg-amber-50"
                                    : isLocked
                                      ? "text-[#A0AEA4] cursor-not-allowed"
                                      : "text-[#556359] hover:bg-[#F2EFE6] hover:text-[#1E2E24]"
                                } disabled:opacity-50 disabled:cursor-not-allowed`}
                              >
                                <span className="inline-flex items-center gap-1.5">
                                  {option}
                                  {isLocked && (
                                    <span
                                      title="Upgrade to Pro"
                                      className="inline-flex items-center justify-center text-[8px] font-bold bg-[#FAF8F3] border border-[#EBE7D9] text-[#b27b00] rounded px-1 py-0.5"
                                    >
                                      PRO
                                    </span>
                                  )}
                                </span>
                                {isActive && (
                                  <span className="text-[#b27b00]">✓</span>
                                )}
                              </button>
                            );
                          })}
                        </div>
                      )}
                    </div>
                  </td>

                  {/* 5. Actions row */}
                  <td className="px-6 py-4 whitespace-nowrap text-right">
                    <div className="flex items-center justify-end gap-1.5">
                      <Link href={`/lessons/details/${lesson._id}`}>
                        <Button
                          isIconOnly
                          size="sm"
                          variant="light"
                          className="text-slate-400 hover:text-[#1E2E24] hover:bg-slate-100 rounded-lg"
                        >
                          <ExternalLink size={16} />
                        </Button>
                      </Link>

                      <Link href={`/dashboard/edit-lesson/${lesson._id}`}>
                        <Button
                          isIconOnly
                          size="sm"
                          variant="light"
                          className="text-slate-400 hover:text-[#2e7d32] hover:bg-slate-100 rounded-lg"
                        >
                          <Pencil size={16} />
                        </Button>
                      </Link>

                      <Button
                        isIconOnly
                        size="sm"
                        variant="light"
                        className="text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg"
                      >
                        <Trash2 size={16} />
                      </Button>
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
