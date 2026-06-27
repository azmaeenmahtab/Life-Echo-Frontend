// lib/contexts/reportModalContext.js
"use client";

import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
} from "react";

const ReportModalContext = createContext(null);

export function ReportModalContextProvider({ children }) {
  const [isOpen, setIsOpen] = useState(false);
  const [payload, setPayload] = useState(null);

  const openReportModal = useCallback((nextPayload) => {
    setPayload(nextPayload ?? null); // was missing — payload never got stored
    setIsOpen(true);
  }, []);

  const closeReportModal = useCallback(() => {
    setIsOpen(false);
  }, []);

  const value = useMemo(
    () => ({ isOpen, payload, openReportModal, closeReportModal }),
    [isOpen, payload, openReportModal, closeReportModal],
  );

  return (
    <ReportModalContext.Provider value={value}>
      {children}
    </ReportModalContext.Provider>
  );
}

export function useReportModal() {
  const ctx = useContext(ReportModalContext);
  if (!ctx) {
    throw new Error(
      "useReportModal must be used inside a <ReportModalContextProvider>",
    );
  }
  return ctx;
}
