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
  const [isConfirm, setIsConfirm] = useState(false);
  const [lessonId, setLessonId] = useState(null);
  const [userId, setUserId] = useState(null);

  const openReportModal = ({ lessonId: lId, userId: uId } = {}) => {
    if (lId) setLessonId(lId);
    if (uId) setUserId(uId);
    setIsOpen(true);
  };
  const closeReportModal = () => {
    setIsOpen(false);
    setIsConfirm(false);
    setLessonId(null);
    setUserId(null);
  };

  return (
    <ReportModalContext.Provider
      value={{
        isOpen,
        openReportModal,
        closeReportModal,
        isConfirm,
        setIsConfirm,
        lessonId,
        userId,
      }}
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
