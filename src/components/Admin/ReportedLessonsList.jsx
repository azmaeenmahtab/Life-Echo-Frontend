import React from "react";

/**
 * Tabular listing of every lesson-report on the platform.
 *
 * Each row represents a single report (one user filing one reason
 * against one lesson). The backend pre-joins the lesson title /
 * image / category / access-level and the reporter's name / email /
 * profile image, so this component is purely presentational.
 *
 * Functionalities (resolve / dismiss / ban lesson, take action on
 * reporter, deep-link into the lesson) come later — for now the
 * Actions column ships a placeholder so the layout reads as a
 * proper table.
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

/**
 * Visual emphasis per reason. Severe categories get warmer tones
 * so the admin can scan the table for urgent reports at a glance.
 */
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

const ReportedLessonsList = ({ reports }) => {
  const list = Array.isArray(reports) ? reports : [];

  if (list.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-16 px-6 rounded-2xl border border-dashed border-[#EBE7D9] bg-[#FAF8F3] text-center">
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
    <div className="bg-white border border-[#eae6df] rounded-3xl shadow-sm overflow-hidden">
      <div className="overflow-x-auto">
        <table className="min-w-full text-left text-sm">
          <thead className="bg-[#FAF8F3] text-[10px] uppercase tracking-wider text-[#556359] font-bold border-b border-[#EBE7D9]">
            <tr>
              <th className="px-5 py-3 whitespace-nowrap">Lesson</th>
              <th className="px-5 py-3 whitespace-nowrap">Category</th>
              <th className="px-5 py-3 whitespace-nowrap">Access</th>
              <th className="px-5 py-3 whitespace-nowrap">Reason</th>
              <th className="px-5 py-3 whitespace-nowrap">Reporter</th>
              <th className="px-5 py-3 whitespace-nowrap">Submitted</th>
              <th className="px-5 py-3 whitespace-nowrap text-right">
                Actions
              </th>
            </tr>
          </thead>
          <tbody>
            {list.map((report) => {
              const key =
                report._id?.toString?.() ??
                `${report.lessonId}-${report.userId}-${report.submittedAt}`;
              const reasonKey = (report.reason || "").toLowerCase();
              const reasonLabel = REASON_LABELS[reasonKey] ?? report.reason ?? "—";
              const reasonClass =
                REASON_STYLE[reasonKey] ??
                "bg-white text-[#556359] border-[#EBE7D9]";
              const isPremium =
                (report.lessonAccessLevel || "").toLowerCase() === "premium";

              return (
                <tr
                  key={key}
                  className="border-b border-[#EBE7D9]/60 last:border-0 hover:bg-[#FAF8F3]/60 transition-colors"
                >
                  {/* Lesson (cover thumbnail + title) */}
                  <td className="px-5 py-3">
                    <div className="flex items-center gap-3">
                      <span className="w-9 h-9 rounded-xl overflow-hidden bg-[#1c2f24] text-[#e2f2e9] flex items-center justify-center font-serif font-bold text-sm shrink-0 border border-[#eae6df]">
                        {report.lessonImage ? (
                          // eslint-disable-next-line @next/next/no-img-element
                          <img
                            src={report.lessonImage}
                            alt={report.lessonTitle || "Lesson cover"}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          (report.lessonTitle || "?")
                            .charAt(0)
                            .toUpperCase()
                        )}
                      </span>
                      <span className="font-semibold text-[#1E2E24] truncate max-w-[14rem]">
                        {report.lessonTitle || "Untitled lesson"}
                      </span>
                    </div>
                  </td>

                  {/* Category */}
                  <td className="px-5 py-3 text-[#556359] capitalize whitespace-nowrap">
                    {report.lessonCategory || "—"}
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

                  {/* Reason */}
                  <td className="px-5 py-3">
                    <span
                      className={
                        "inline-flex items-center px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider border " +
                        reasonClass
                      }
                    >
                      {reasonLabel}
                    </span>
                  </td>

                  {/* Reporter (avatar + name) */}
                  <td className="px-5 py-3">
                    <div className="flex items-center gap-3">
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
                      <span className="font-semibold text-[#1E2E24] truncate max-w-[14rem]">
                        {report.reporterName || report.reporterEmail || "Unknown"}
                      </span>
                    </div>
                  </td>

                  {/* Submitted timestamp */}
                  <td className="px-5 py-3 text-[#556359] whitespace-nowrap">
                    {formatSubmitted(report.submittedAt)}
                  </td>

                  {/* Placeholder actions — functionality lands later */}
                  <td className="px-5 py-3 text-right whitespace-nowrap">
                    <button
                      type="button"
                      disabled
                      className="inline-flex items-center px-3 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-wider border border-[#EBE7D9] bg-white text-[#556359] cursor-not-allowed"
                      title="Coming soon"
                    >
                      Review
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};

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
