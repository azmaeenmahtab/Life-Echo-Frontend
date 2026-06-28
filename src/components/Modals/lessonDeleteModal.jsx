"use client";

import { useState } from "react";
import { X, Trash2, AlertTriangle } from "lucide-react";
import toast from "react-hot-toast";
import { useLessonDeleteModal } from "@/lib/contexts/lessonDeleteModalContext";
import { deleteLesson } from "@/lib/actions/lessonActions";

/**
 * Confirmation popup for deleting a lesson.
 *
 * Triggered from anywhere in the dashboard tree via
 * `openLessonDeleteModal(lesson)`. The Trash2 icon in MyLessons.jsx is the
 * primary caller, but the same modal can be reused from other surfaces.
 *
 * On confirm: hits DELETE /api/lessons/:id, surfaces a success/error
 * toast, broadcasts the deleted id through context so subscribers can
 * drop the row, and closes the modal.
 */
export function LessonDeleteModal({ session }) {
  const { isOpen, lesson, closeLessonDeleteModal, notifyLessonDeleted } =
    useLessonDeleteModal();

  const [submitting, setSubmitting] = useState(false);

  if (!isOpen || !lesson) return null;

  const userId = session?.user?.id;

  const handleConfirm = async () => {
    if (submitting) return;
    if (!userId) {
      toast.error("You must be signed in to delete a lesson.");
      return;
    }

    setSubmitting(true);
    try {
      const result = await deleteLesson({ lessonId: lesson._id, userId });
      toast.success(result?.message || "Lesson deleted successfully");
      notifyLessonDeleted(lesson._id);
      closeLessonDeleteModal();
    } catch (err) {
      console.error("deleteLesson error:", err);
      toast.error(err?.message || "Failed to delete lesson");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      {/* Close on backdrop click */}
      <div className="absolute inset-0" onClick={closeLessonDeleteModal} />

      <div className="relative z-10 w-full max-w-md rounded-lg border border-[#EBE7D9] bg-[#FAF8F3] p-6 shadow-xl font-sans">
        {/* Close X */}
        <button
          type="button"
          onClick={closeLessonDeleteModal}
          className="absolute right-3 top-3 rounded p-1 text-[#556359] transition hover:bg-[#EFEBDE] hover:text-[#1E2E24]"
          aria-label="Close modal"
          disabled={submitting}
        >
          <X size={18} />
        </button>

        <div className="flex items-start gap-3">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-red-50 text-red-600">
            <AlertTriangle size={20} />
          </div>
          <div className="flex-1">
            <h3 className="text-lg font-bold text-[#1E2E24]">Delete lesson?</h3>
            <p className="mt-1 text-sm text-[#556359]">
              This action cannot be undone. The lesson will be permanently
              removed from your library.
            </p>
          </div>
        </div>

        {/* Lesson preview */}
        <div className="mt-5 flex items-start gap-3 rounded-lg border border-[#EBE7D9] bg-white p-3">
          {lesson.imageUrl ? (
            <img
              src={lesson.imageUrl}
              alt={lesson.title}
              className="h-14 w-20 shrink-0 rounded-md object-cover border border-[#EBE7D9]"
            />
          ) : (
            <div className="flex h-14 w-20 shrink-0 items-center justify-center rounded-md border border-dashed border-[#EBE7D9] bg-slate-50 text-[10px] text-[#556359]">
              No image
            </div>
          )}
          <div className="min-w-0 flex-1">
            <p className="font-serif font-bold text-sm text-[#1E2E24] line-clamp-1">
              {lesson.title || "Untitled Lesson"}
            </p>
            <p className="mt-0.5 text-xs text-[#556359] line-clamp-2">
              {lesson.story || "No story content"}
            </p>
          </div>
        </div>

        {/* Action buttons */}
        <div className="mt-6 flex justify-end gap-2">
          <button
            type="button"
            onClick={closeLessonDeleteModal}
            disabled={submitting}
            className="rounded px-4 py-2 text-sm font-medium text-[#556359] transition hover:bg-[#EFEBDE] disabled:cursor-not-allowed disabled:opacity-50"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleConfirm}
            disabled={submitting}
            className="inline-flex items-center gap-1.5 rounded bg-red-600 px-5 py-2 text-sm font-medium text-white transition hover:bg-red-700 disabled:cursor-not-allowed disabled:opacity-60"
          >
            <Trash2 size={14} />
            {submitting ? "Deleting…" : "Delete lesson"}
          </button>
        </div>
      </div>
    </div>
  );
}

export default LessonDeleteModal;
