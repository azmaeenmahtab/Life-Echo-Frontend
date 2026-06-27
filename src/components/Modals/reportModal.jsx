"use client";

import { useState } from "react";
import { Label, ListBox, Select } from "@heroui/react";
import toast from "react-hot-toast";
import { useReportModal } from "@/lib/contexts/reportModalContext";
import { submitReport } from "@/lib/actions/report";

const reportReasons = [
  { key: "spam", label: "Spam or misleading content" },
  { key: "harassment", label: "Harassment or bullying" },
  { key: "hate-speech", label: "Hate speech or discrimination" },
  { key: "violence", label: "Violence or harmful content" },
  { key: "misinformation", label: "Misinformation" },
  { key: "inappropriate", label: "Inappropriate or offensive content" },        
  { key: "self-harm", label: "Self-harm or suicide content" },
  { key: "other", label: "Other" },
];

export default function ReportModal() {
  const {
    isOpen,
    closeReportModal,
    isConfirm,
    setIsConfirm,
    lessonId,
    userId,
  } = useReportModal();
  const [selectedReason, setSelectedReason] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async () => {
    if (!selectedReason || submitting) return;
    if (!lessonId || !userId) {
      const msg = "Missing lesson or user information.";
      setError(msg);
      toast.error(msg);
      return;
    }

    setSubmitting(true);
    setError("");
    try {
      const result = await submitReport(lessonId, userId, selectedReason);
      if (result?.alreadyReported) {
        const msg =
          result.message || "You have already reported this lesson.";
        setError(msg);
        toast(msg, { icon: "ℹ️" });
        setSelectedReason("");
        setIsConfirm(false);
        closeReportModal();
        return;
      }

      toast.success(
        result?.message || "Report submitted successfully. Thank you!",
      );
      setSelectedReason("");
      setIsConfirm(false);
      closeReportModal();
    } catch (err) {
      console.error("[ReportModal] submit failed:", err);
      const msg = err?.message || "Failed to submit report";
      setError(msg);
      toast.error(msg);
    } finally {
      setSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    // 1. Fixed Backdrop Dark Overlay
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      {/* Invisible layer to close modal when clicking outside the box */}
      <div className="absolute inset-0" onClick={closeReportModal} />

      {/* 2. Styled Modal Box */}
      <div className="relative z-10 w-full max-w-md rounded-lg border border-[#EBE7D9] bg-[#FAF8F3] p-6 shadow-xl font-sans">
        {/* Content Area */}
        <h3 className="text-lg font-bold text-[#1E2E24] mb-2">
          Report Confirmation
        </h3>
        <p className="text-sm text-[#556359] mb-6">
          Are you sure you want to report this post? Select the most relevant
          reason.
        </p>

        {error && (
          <div
            role="alert"
            className="mb-4 rounded-md border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700"
          >
            {error}
          </div>
        )}

        {isConfirm && (
          <div className="mb-6">
            <Select
              className="w-full flex flex-col gap-1.5"
              placeholder="Select a reason"
              // Controls selection key state dynamically. HeroUI's Select
              // passes either a single Key or a Set of Keys depending on
              // the selection mode, so normalise both into a plain string.
              onChange={(value) => {
                let key = null;
                if (value == null) {
                  key = null;
                } else if (
                  typeof value === "string" ||
                  typeof value === "number"
                ) {
                  key = value;
                } else if (
                  typeof value === "object" &&
                  Symbol.iterator in value
                ) {
                  key = Array.from(value)[0];
                } else if (typeof value === "object" && "currentKey" in value) {
                  key = value.currentKey;
                }
                setSelectedReason(key != null ? String(key) : "");
              }}
            >
              <Label className="text-xs font-bold uppercase tracking-wider text-[#556359]">
                Reason for reporting
              </Label>

              {/* Styled Trigger Element */}
              <Select.Trigger className="flex w-full items-center justify-between rounded-lg border border-[#EBE7D9] bg-white px-3 py-2.5 text-sm text-[#1E2E24] shadow-sm outline-none transition focus:border-[#1E2E24] focus:ring-1 focus:ring-[#1E2E24] text-left">
                <Select.Value className="block truncate" />
                {/* Custom layout indicator dropdown arrow */}
                <Select.Indicator className="text-[#556359] ml-2">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="m6 9 6 6 6-6" />
                  </svg>
                </Select.Indicator>
              </Select.Trigger>

              {/* Styled Popover - Vital z-60 value added to display on top of modal */}
              <Select.Popover className="z-60 mt-1 max-h-60 w-(--trigger-width) overflow-auto rounded-lg border border-[#EBE7D9] bg-white shadow-lg outline-none">
                <ListBox className="p-1 outline-none">
                  {reportReasons.map((reason) => (
                    <ListBox.Item
                      key={reason.key}
                      id={reason.key}
                      textValue={reason.label}
                      className="flex cursor-pointer items-center justify-between rounded-md px-3 py-2 text-sm text-[#4a5568] outline-none transition hover:bg-[#FAF8F3] hover:text-[#1E2E24] focus:bg-[#FAF8F3] aria-selected:bg-[#e2f2e9] aria-selected:text-[#2e7d32] aria-selected:font-medium"
                    >
                      <span>{reason.label}</span>
                      {/* <ListBox.ItemIndicator className="text-[#2e7d32]">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="14"
                          height="14"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2.5"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        >
                          <path d="M20 6 9 17l-5-5" />
                        </svg>
                      </ListBox.ItemIndicator> */}
                    </ListBox.Item>
                  ))}
                </ListBox>
              </Select.Popover>
            </Select>
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex justify-end gap-2">
          <button
            type="button"
            onClick={closeReportModal}
            className="rounded px-4 py-2 text-sm font-medium text-gray-600 transition hover:bg-gray-100"
          >
            Close
          </button>
          {isConfirm ? (
            <button
              type="button"
              onClick={handleSubmit}
              disabled={!selectedReason || submitting}
              className="rounded bg-[#1E2E24] px-4 py-2 text-sm font-medium text-white transition hover:bg-[#2A3F33] disabled:cursor-not-allowed disabled:opacity-50"
            >
              {submitting ? "Submitting…" : "Submit Report"}
            </button>
          ) : (
            <button
              type="button"
              onClick={() => setIsConfirm(true)}
              className="rounded bg-[#1E2E24] px-5 py-2 text-sm font-medium text-white transition hover:bg-[#2A3F33]"
            >
              Yes
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

export { ReportModal };
