"use client";

import { useReportModal } from "@/lib/contexts/reportModalContext";

export default function ReportModal() {
  const { isOpen, closeReportModal } = useReportModal();

  // If the context state is closed, do not render anything
  if (!isOpen) return null;

  return (
    // 1. Fixed Backdrop Dark Overlay
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      {/* Invisible layer to close modal when clicking outside the box */}
      <div className="absolute inset-0" onClick={closeReportModal} />

      {/* 2. Simple Modal Box */}
      <div className="relative z-10 w-full max-w-md rounded-lg border border-[#EBE7D9] bg-[#FAF8F3] p-6 shadow-xl font-sans">
        {/* Content Area */}
        <h3 className="text-lg font-bold text-[#1E2E24] mb-2">Report Modal</h3>
        <p className="text-sm text-[#556359] mb-6">
          The context is working perfectly! You can replace this text with your
          form or action components later.
        </p>

        {/* Action Buttons */}
        <div className="flex justify-end gap-2">
          <button
            type="button"
            onClick={closeReportModal}
            className="rounded px-4 py-2 text-sm font-medium text-gray-600 transition hover:bg-gray-100"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}

export { ReportModal };
