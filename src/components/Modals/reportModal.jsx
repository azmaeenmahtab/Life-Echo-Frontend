"use client";

import { useState } from "react";
import { Modal, Button } from "@heroui/react";
import { AlertTriangle } from "lucide-react";

import { useReportModal } from "@/lib/contexts/reportModalContext";

export default function ReportModal() {
  const { isOpen, payload, closeReportModal } = useReportModal();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleCancel = () => {
    closeReportModal();
  };

  const handleConfirm = async () => {
    if (!payload?.onConfirm) {
      closeReportModal();
      return;
    }

    setIsSubmitting(true);

    try {
      await payload.onConfirm();
    } finally {
      setIsSubmitting(false);
      closeReportModal();
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onOpenChange={(open) => {
        if (!open) {
          closeReportModal();
        }
      }}
    >
      <Modal.Backdrop variant="opaque">
        <Modal.Container size="sm">
          <Modal.Dialog className="bg-[#FAF8F3] border border-[#EBE7D9]">
            <Modal.Header className="flex items-center gap-2 font-sans text-[#1E2E24] border-b border-[#EBE7D9]">
              <AlertTriangle size={18} className="text-warning" />
              <Modal.Heading>Report this lesson?</Modal.Heading>
            </Modal.Header>

            <Modal.Body className="py-5">
              <p className="text-sm text-[#556359] font-sans leading-relaxed">
                Are you sure you want to report this lesson? Our moderation team
                will review it.
              </p>
            </Modal.Body>

            <Modal.Footer className="gap-2 border-t border-[#EBE7D9]">
              <Button
                variant="light"
                onPress={handleCancel}
                isDisabled={isSubmitting}
              >
                Cancel
              </Button>

              <Button
                variant="danger"
                onPress={handleConfirm}
                isDisabled={isSubmitting}
              >
                {isSubmitting ? "Reporting..." : "Yes, continue"}
              </Button>
            </Modal.Footer>
          </Modal.Dialog>
        </Modal.Container>
      </Modal.Backdrop>
    </Modal>
  );
}

export { ReportModal };
