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

  const openReportModal = () => setIsOpen(true);
  const closeReportModal = () => setIsOpen(false);

  return (
    <ReportModalContext.Provider
      value={{ isOpen, openReportModal, closeReportModal }}
    >
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
