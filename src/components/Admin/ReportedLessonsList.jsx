"use client";

import React, { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Eye,
  Loader2,
  ShieldOff,
  Trash2,
  User,
  X,
  FileWarning,
} from "lucide-react";
import toast from "react-hot-toast";

import { useLessonDeleteModal } from "@/lib/contexts/lessonDeleteModalContext";
import { getLessonReports, ignoreLessonReports } from "@/lib/api/admin/report";

/**
 * Human-readable label per reason key. Kept in sync with the
 * backend allowlist in `backend/services/report.service.js` and the
 * dropdown options in `components/Modals/reportModal.jsx`.
 */
const REASON_LABELS = {
  spam: "Spam or misleading",
  harassment: "Harassment or bullying",
  "hate-speech": "Hate speech",
  violence: "Violence or harmful",
  misinformation: "Misinformation",
  inappropriate: "Inappropriate or offensive",
  "self-harm": "Self-harm",
  other: "Other",
};

/** Pill colors per reason so urgent categories stand out. */
const REASON_STYLE = {
  spam: "bg-white text-[#556359] border-[#EBE7D9]",
  harassment: "bg-[#f5e9d4] text-[#a17236] border-[#e8d6b4]",
  "hate-speech": "bg-[#f5e9d4] text-[#a17236] border-[#e8d6b4]",
  violence: "bg-[#f5e9d4] text-[#a17236] border-[#e8d6b4]",
  misinformation: "bg-[#f5e9d4] text-[#a17236] border-[#e8d6b4]",
  inappropriate: "bg-[#f5e9d4] text-[#a17236] border-[#e8d6b4]",
  "self-harm": "bg-[#f5e9d4] text-[#a17236] border-[#e8d6b4]",
  other: "bg-white text-[#556359] border-[#EBE7D9]",
};

const reasonLabelOf = (key) => {
  const lowered = String(key || "").toLowerCase();
  return REASON_LABELS[lowered] ?? key ?? "—";
};

const reasonClassOf = (key) => {
  const lowered = String(key || "").toLowerCase();
  return REASON_STYLE[lowered] ?? "bg-white text-[#556359] border-[#EBE7D9]";
};

/**
 * Admin table of lessons that have at least one user report.
 *
 * One row per lesson with:
 *   - Cover thumbnail + title
 *   - Category chip + access level chip
 *   - Report count + a quick scan of unique recent reasons
 *   - "View reports" button that opens a modal listing every report
 *     (reason, reporter info, submitted time)
 *   - "Delete" button that routes through the existing lesson delete
 *     modal context (admin override enabled on the server)
 *   - "Ignore" button that drops every report for the lesson while
 *     leaving the lesson itself live
 *
 * The data shape comes from
 * `backend/services/report.service.js#getReportedLessonsGrouped`,
 * surfaced via `lib/api/admin/report.js#getReportedLessons`.
 */
const ReportedLessonsList = ({ lessons: initialLessons }) => {
  const router = useRouter();
  const { openLessonDeleteModal, deletedLessonId } = useLessonDeleteModal();

  // SSR-provided seed (re-derived each render so we never mirror
  // it through an effect — avoids the React 19 "setState inside
  // effect" anti-pattern).
  const safeSeed = useMemo(
    () => (Array.isArray(initialLessons) ? initialLessons : []),
    [initialLessons],
  );

  // Optimistic base list — trimmed by handleIgnore. Re-seeded
  // from `safeSeed` whenever the seed changes (e.g. after
  // `router.refresh()`) without going through an effect.
  const [baseList, setBaseList] = useState(safeSeed);
  const [lastSeed, setLastSeed] = useState(safeSeed);
  if (safeSeed !== lastSeed) {
    setLastSeed(safeSeed);
    setBaseList(safeSeed);
  }

  // "View reports" modal state. Declared before the deleted-id
  // effect so the effect can close the modal mid-render.
  const [reportsLesson, setReportsLesson] = useState(null);
  const [reportRows, setReportRows] = useState([]);
  const [reportsLoading, setReportsLoading] = useState(false);
  const [reportsError, setReportsError] = useState("");

  // State-tracked set of lessonIds removed by the delete modal.
  // This is a legitimate "sync external state (the modal context)
  // into local state" use case, so we use a setState-in-effect
  // pattern below with the appropriate lint opt-out.
  const [removedIds, setRemovedIds] = useState(() => new Set());

  // The delete modal context pushes a new `deletedLessonId` after
  // the server roundtrip; we sync it into local state so the row
  // disappears immediately without waiting for the next refresh.
  /* eslint-disable react-hooks/set-state-in-effect */
  useEffect(() => {
    if (!deletedLessonId) return;
    const removedId = String(deletedLessonId);
    setRemovedIds((prev) => {
      if (prev.has(removedId)) return prev;
      const next = new Set(prev);
      next.add(removedId);
      return next;
    });
    // Also close the reports modal if it was open on the deleted lesson.
    setReportsLesson((prev) =>
      prev && String(prev.lessonId) === removedId ? null : prev,
    );
  }, [deletedLessonId]);
  /* eslint-enable react-hooks/set-state-in-effect */

  // Filtered list — the authoritative rows the table renders.
  const list = useMemo(
    () => baseList.filter((row) => !removedIds.has(String(row.lessonId))),
    [baseList, removedIds],
  );

  // Per-row loading state for Ignore; keyed by lessonId.
  const [ignoringId, setIgnoringId] = useState(null);

  const totalRows = useMemo(() => list.length, [list]);

  /**
   * Map a grouped row to the lesson shape the existing delete-modal
   * expects (`_id`, `title`, `imageUrl`, `story`).
   */
  const toDeletePayload = (row) => ({
    _id: row.lessonId,
    title: row.lessonTitle || "Untitled lesson",
    imageUrl: row.lessonImage || "",
    // The grouped endpoint doesn't carry the lesson body, so the modal
    // gets a placeholder. The delete UX needs the title + image,
    // not the body.
    story: "",
  });

  const handleDelete = (row) => {
    if (!row?.lessonId) return;
    openLessonDeleteModal(toDeletePayload(row));
  };

  // Row currently staged for the ignore confirmation modal.
  const [ignorePrompt, setIgnorePrompt] = useState(null);

  const handleIgnore = async (row) => {
    if (!row?.lessonId || ignoringId === row.lessonId) return;
    // Open the custom confirmation modal instead of relying on the
    // blocking browser `window.confirm` dialog.
    setIgnorePrompt(row);
  };

  const confirmIgnore = async () => {
    const row = ignorePrompt;
    if (!row?.lessonId) {
      setIgnorePrompt(null);
      return;
    }
    const lessonId = String(row.lessonId);
    const previousBase = baseList;
    setIgnorePrompt(null);
    setIgnoringId(lessonId);

    // Optimistic removal so the row disappears immediately.
    setBaseList((prev) => prev.filter((r) => String(r.lessonId) !== lessonId));

    try {
      const result = await ignoreLessonReports(lessonId);
      toast.success(
        result?.message ||
          `Ignored ${result?.deletedCount ?? 0} report${result?.deletedCount === 1 ? "" : "s"}`,
      );
      router.refresh();
    } catch (error) {
      // Roll back the optimistic update on failure.
      console.error("ignoreLessonReports error:", error);
      toast.error(error?.message || "Failed to ignore reports");
      setBaseList(previousBase);
    } finally {
      setIgnoringId((current) => (current === lessonId ? null : current));
    }
  };

  const openReportsModal = async (row) => {
    if (!row?.lessonId) return;
    setReportsLesson(row);
    setReportRows([]);
    setReportsError("");
    setReportsLoading(true);
    try {
      const data = await getLessonReports(row.lessonId);
      setReportRows(Array.isArray(data?.reports) ? data.reports : []);
    } catch (error) {
      console.error("getLessonReports error:", error);
      const msg = error?.message || "Failed to load reports";
      setReportsError(msg);
      toast.error(msg);
    } finally {
      setReportsLoading(false);
    }
  };

  const closeReportsModal = () => {
    setReportsLesson(null);
    setReportRows([]);
    setReportsError("");
    setReportsLoading(false);
  };

  // ------------------------- Render --------------------------------

  if (totalRows === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-16 px-6 rounded-2xl border border-dashed border-[#EBE7D9] bg-[#FAF8F3] text-center">
        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[#f5e9d4] text-[#a17236] mb-3">
          <ShieldOff size={20} />
        </div>
        <p className="font-serif font-bold text-lg text-[#1E2E24]">
          No reports filed
        </p>
        <p className="text-sm text-[#556359] mt-1">
          Reports submitted from lessons will appear here for review.
        </p>
      </div>
    );
  }

  return (
    <>
      <div className="bg-white border border-[#eae6df] rounded-3xl shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full text-left text-sm">
            <thead className="bg-[#FAF8F3] text-[10px] uppercase tracking-wider text-[#556359] font-bold border-b border-[#EBE7D9]">
              <tr>
                <th className="px-5 py-3 whitespace-nowrap">Lesson</th>
                <th className="px-5 py-3 whitespace-nowrap">Category</th>
                <th className="px-5 py-3 whitespace-nowrap">Access</th>
                <th className="px-5 py-3 whitespace-nowrap">Reports</th>
                <th className="px-5 py-3 whitespace-nowrap">Last reported</th>
                <th className="px-5 py-3 whitespace-nowrap text-right">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {list.map((row) => {
                const lessonId = row.lessonId?.toString?.() ?? row.lessonId;
                const reasonChips = Array.isArray(row.recentReasons)
                  ? row.recentReasons
                  : [];
                const isPremium =
                  (row.lessonAccessLevel || "").toLowerCase() === "premium";
                const isIgnoring = ignoringId === lessonId;

                return (
                  <tr
                    key={lessonId}
                    className="border-b border-[#EBE7D9]/60 last:border-0 hover:bg-[#FAF8F3]/60 transition-colors"
                  >
                    {/* Lesson (cover thumbnail + title) */}
                    <td className="px-5 py-3">
                      <div className="flex items-center gap-3">
                        <span className="w-10 h-10 rounded-xl overflow-hidden bg-[#1c2f24] text-[#e2f2e9] flex items-center justify-center font-serif font-bold text-sm shrink-0 border border-[#eae6df]">
                          {row.lessonImage ? (
                            // eslint-disable-next-line @next/next/no-img-element
                            <img
                              src={row.lessonImage}
                              alt={row.lessonTitle || "Lesson cover"}
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            (row.lessonTitle || "?").charAt(0).toUpperCase()
                          )}
                        </span>
                        <div className="min-w-0">
                          <p className="font-semibold text-[#1E2E24] truncate max-w-[16rem]">
                            {row.lessonTitle || "Untitled lesson"}
                          </p>
                          <p className="text-[10px] text-[#556359] truncate">
                            ID: {lessonId}
                          </p>
                        </div>
                      </div>
                    </td>

                    {/* Category */}
                    <td className="px-5 py-3 text-[#556359] capitalize whitespace-nowrap">
                      {row.lessonCategory || "—"}
                    </td>

                    {/* Access level */}
                    <td className="px-5 py-3 whitespace-nowrap">
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

                    {/* Reports: count + quick-scan reason chips */}
                    <td className="px-5 py-3 whitespace-nowrap">
                      <div className="flex flex-col items-start gap-1">
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider border bg-[#fde4e2] text-[#a72d2d] border-[#f7c7c1]">
                          <FileWarning size={11} className="opacity-80" />
                          {row.reportCount} report
                          {row.reportCount === 1 ? "" : "s"}
                        </span>
                        {reasonChips.length > 0 && (
                          <div className="flex flex-wrap gap-1 max-w-56">
                            {reasonChips.slice(0, 3).map((reason) => (
                              <span
                                key={reason}
                                className={
                                  "inline-flex items-center px-2 py-0.5 rounded-md text-[9px] font-bold uppercase tracking-wider border " +
                                  reasonClassOf(reason)
                                }
                                title={reasonLabelOf(reason)}
                              >
                                {reasonLabelOf(reason)}
                              </span>
                            ))}
                            {reasonChips.length > 3 && (
                              <span className="inline-flex items-center px-2 py-0.5 rounded-md text-[9px] font-bold uppercase tracking-wider border bg-white text-[#556359] border-[#EBE7D9]">
                                +{reasonChips.length - 3}
                              </span>
                            )}
                          </div>
                        )}
                      </div>
                    </td>

                    {/* Last reported timestamp */}
                    <td className="px-5 py-3 text-[#556359] whitespace-nowrap">
                      {formatSubmitted(row.lastSubmittedAt)}
                    </td>

                    {/* Actions */}
                    <td className="px-5 py-3 text-right whitespace-nowrap">
                      <div className="inline-flex items-center justify-end gap-1">
                        <Link
                          href={`/lessons/details/${lessonId}`}
                          title="Open lesson"
                          aria-label="Open lesson"
                          className="inline-flex items-center justify-center w-8 h-8 rounded-lg text-slate-500 hover:text-[#1E2E24] hover:bg-slate-100 transition-colors"
                        >
                          <Eye size={15} />
                        </Link>
                        <button
                          type="button"
                          onClick={() => openReportsModal(row)}
                          title="View reports"
                          aria-label="View reports"
                          className="inline-flex items-center justify-center w-8 h-8 rounded-lg text-slate-500 hover:text-[#2e7d32] hover:bg-emerald-50 transition-colors"
                        >
                          <User size={15} />
                        </button>
                        <button
                          type="button"
                          onClick={() => handleIgnore(row)}
                          disabled={isIgnoring}
                          title="Ignore reports"
                          aria-label="Ignore reports"
                          className="inline-flex items-center justify-center w-8 h-8 rounded-lg text-slate-500 hover:text-amber-700 hover:bg-amber-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          {isIgnoring ? (
                            <Loader2 size={15} className="animate-spin" />
                          ) : (
                            <ShieldOff size={15} />
                          )}
                        </button>
                        <button
                          type="button"
                          onClick={() => handleDelete(row)}
                          title="Delete lesson"
                          aria-label="Delete lesson"
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

      {/* "View reports" modal */}
      {reportsLesson && (
        <ReportsModal
          lesson={reportsLesson}
          rows={reportRows}
          loading={reportsLoading}
          error={reportsError}
          onClose={closeReportsModal}
        />
      )}

      {/* "Ignore reports" confirmation modal */}
      {ignorePrompt && (
        <IgnoreConfirmModal
          lesson={ignorePrompt}
          onCancel={() => setIgnorePrompt(null)}
          onConfirm={confirmIgnore}
        />
      )}
    </>
  );
};

/**
 * Reasons + reporter modal. One row per report with reason pill,
 * reporter avatar/name/email, and submission time. Reports the
 * lesson itself at the top so the admin has the context they need
 * to decide between Ignore and Delete.
 */
function ReportsModal({ lesson, rows, loading, error, onClose }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      {/* Backdrop closes the modal */}
      <div className="absolute inset-0" onClick={onClose} />

      <div className="relative z-10 w-full max-w-xl rounded-lg border border-[#EBE7D9] bg-[#FAF8F3] shadow-xl font-sans">
        {/* Header */}
        <div className="flex items-start justify-between gap-3 border-b border-[#EBE7D9] px-5 py-4">
          <div className="flex items-start gap-3">
            <span className="w-10 h-10 rounded-xl overflow-hidden bg-[#1c2f24] text-[#e2f2e9] flex items-center justify-center font-serif font-bold text-sm shrink-0 border border-[#eae6df]">
              {lesson.lessonImage ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={lesson.lessonImage}
                  alt={lesson.lessonTitle || "Lesson cover"}
                  className="w-full h-full object-cover"
                />
              ) : (
                (lesson.lessonTitle || "?").charAt(0).toUpperCase()
              )}
            </span>
            <div className="min-w-0">
              <p className="text-xs uppercase tracking-wider font-bold text-[#556359]">
                Reported lesson
              </p>
              <p className="font-serif font-bold text-base text-[#1E2E24] truncate">
                {lesson.lessonTitle || "Untitled lesson"}
              </p>
              <p className="text-[11px] text-[#556359] mt-0.5">
                {lesson.reportCount} report
                {lesson.reportCount === 1 ? "" : "s"} filed
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close modal"
            className="rounded p-1 text-[#556359] transition hover:bg-[#EFEBDE] hover:text-[#1E2E24]"
          >
            <X size={18} />
          </button>
        </div>

        {/* Body */}
        <div className="max-h-[60vh] overflow-y-auto px-5 py-4">
          {loading && (
            <div className="flex items-center justify-center gap-2 py-10 text-sm text-[#556359]">
              <Loader2 size={16} className="animate-spin" />
              Loading reports…
            </div>
          )}

          {!loading && error && (
            <div className="rounded-md border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
              {error}
            </div>
          )}

          {!loading && !error && rows.length === 0 && (
            <div className="rounded-md border border-dashed border-[#EBE7D9] bg-white px-4 py-6 text-center text-sm text-[#556359]">
              No reports have been filed for this lesson.
            </div>
          )}

          {!loading && !error && rows.length > 0 && (
            <ul className="space-y-3">
              {rows.map((report) => {
                const key =
                  report._id?.toString?.() ??
                  `${report.lessonId}-${report.userId}-${report.submittedAt}`;
                const reasonLabel = reasonLabelOf(report.reason);
                const reasonClass = reasonClassOf(report.reason);
                return (
                  <li
                    key={key}
                    className="rounded-lg border border-[#EBE7D9] bg-white p-4"
                  >
                    <div className="flex items-start justify-between gap-3">
                      <span
                        className={
                          "inline-flex items-center px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider border " +
                          reasonClass
                        }
                      >
                        {reasonLabel}
                      </span>
                      <span className="text-[10px] text-[#556359]">
                        {formatSubmitted(report.submittedAt)}
                      </span>
                    </div>
                    <div className="mt-3 flex items-center gap-3">
                      <span className="w-9 h-9 rounded-full overflow-hidden bg-[#1c2f24] text-[#e2f2e9] flex items-center justify-center font-serif font-bold text-sm shrink-0 border border-[#eae6df]">
                        {report.reporterImage ? (
                          // eslint-disable-next-line @next/next/no-img-element
                          <img
                            src={report.reporterImage}
                            alt={report.reporterName || "Reporter avatar"}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          (report.reporterName || report.reporterEmail || "?")
                            .charAt(0)
                            .toUpperCase()
                        )}
                      </span>
                      <div className="min-w-0">
                        <p className="font-semibold text-sm text-[#1E2E24] truncate">
                          {report.reporterName || "Unknown reporter"}
                        </p>
                        <p className="text-xs text-[#556359] truncate">
                          {report.reporterEmail || "No email on file"}
                        </p>
                      </div>
                    </div>
                  </li>
                );
              })}
            </ul>
          )}
        </div>

        {/* Footer */}
        <div className="flex justify-end gap-2 border-t border-[#EBE7D9] px-5 py-3">
          <button
            type="button"
            onClick={onClose}
            className="rounded px-4 py-2 text-sm font-medium text-[#556359] transition hover:bg-[#EFEBDE]"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}

/**
 * Styled confirmation dialog that replaces the native `window.confirm`
 * for the Ignore action. Keeps the admin on the reported-lessons page
 * and matches the visual language of `ReportsModal` above.
 */
function IgnoreConfirmModal({ lesson, onCancel, onConfirm }) {
  const title = lesson?.lessonTitle || "this lesson";
  const reportCount = Number(lesson?.reportCount) || 0;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      {/* Backdrop closes the modal */}
      <div className="absolute inset-0" onClick={onCancel} />

      <div
        role="alertdialog"
        aria-modal="true"
        aria-labelledby="ignore-confirm-title"
        aria-describedby="ignore-confirm-desc"
        className="relative z-10 w-full max-w-xl rounded-lg border border-[#EBE7D9] bg-[#FAF8F3] shadow-xl font-sans"
      >
        {/* Header — same shape as `ReportsModal` so the two feel like siblings. */}
        <div className="flex items-start justify-between gap-3 border-b border-[#EBE7D9] px-5 py-4">
          <div className="flex items-start gap-3">
            <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-[#EBE7D9] bg-white text-[#a17236]">
              <ShieldOff size={18} />
            </span>
            <div className="min-w-0">
              <p className="text-xs uppercase tracking-wider font-bold text-[#556359]">
                Ignore reports
              </p>
              <p
                id="ignore-confirm-title"
                className="font-serif font-bold text-base text-[#1E2E24] truncate"
              >
                {title}
              </p>
              <p className="text-[11px] text-[#556359] mt-0.5">
                {reportCount} report
                {reportCount === 1 ? "" : "s"} filed
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onCancel}
            aria-label="Close confirmation"
            className="rounded p-1 text-[#556359] transition hover:bg-[#EFEBDE] hover:text-red-500"
          >
            <X size={18} />
          </button>
        </div>

        {/* Body */}
        <p
          id="ignore-confirm-desc"
          className="px-5 py-4 text-sm text-[#556359]"
        >
          Are you sure you want to ignore every report filed against{" "}
          <span className="font-semibold text-[#1E2E24]">
            &ldquo;{title}&rdquo;
          </span>
          ? The lesson will stay live; only the report entries will be removed
          from the queue. This action cannot be undone.
        </p>

        {/* Footer */}
        <div className="flex justify-end gap-2 border-t border-[#EBE7D9] px-5 py-3">
          <button
            type="button"
            onClick={onCancel}
            className="rounded px-4 py-2 text-sm font-medium text-[#556359] transition hover:bg-[#EFEBDE]"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={onConfirm}
            className="inline-flex items-center gap-2 rounded px-4 py-2 text-sm font-semibold text-white border border-[#1E2E24] bg-[#1E2E24] hover:bg-[#2A3F33] transition-colors"
          >
            <ShieldOff size={14} />
            Ignore reports
          </button>
        </div>
      </div>
    </div>
  );
}

function formatSubmitted(value) {
  if (!value) return "—";
  const date = value instanceof Date ? value : new Date(value);
  if (Number.isNaN(date.getTime())) return "—";
  return date.toLocaleDateString(undefined, {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

export default ReportedLessonsList;
