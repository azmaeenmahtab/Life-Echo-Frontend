// lib/contexts/lessonUpdateModalContext.js
"use client";

import { createContext, useContext, useState } from "react";

const LessonUpdateModalContext = createContext(null);

/**
 * Holds the lesson currently being edited plus the open/close actions.
 * Mirrors reportModalContext so the rest of the dashboard tree can
 * trigger the modal from anywhere without prop drilling.
 */
export function LessonUpdateModalContextProvider({ children }) {
  const [isOpen, setIsOpen] = useState(false);
  const [lesson, setLesson] = useState(null);
  const [updatedLesson, setUpdatedLesson] = useState(null);

  const openLessonUpdateModal = (lessonToEdit) => {
    if (!lessonToEdit) return;
    setLesson(lessonToEdit);
    setIsOpen(true);
  };

  const closeLessonUpdateModal = () => {
    setIsOpen(false);
    // Keep `lesson` for a tick so exit animations can read it; clear after.
    setTimeout(() => setLesson(null), 200);
  };

  // Called by the modal after a successful save so any subscribed table
  // can refresh or patch its local row in place.
  const notifyLessonUpdated = (next) => {
    if (next) setUpdatedLesson(next);
  };

  return (
    <LessonUpdateModalContext.Provider
      value={{
        isOpen,
        lesson,
        openLessonUpdateModal,
        closeLessonUpdateModal,
        updatedLesson,
        notifyLessonUpdated,
      }}
    >
      {children}
    </LessonUpdateModalContext.Provider>
  );
}

export const useLessonUpdateModal = () => {
  const ctx = useContext(LessonUpdateModalContext);
  if (!ctx) {
    throw new Error(
      "useLessonUpdateModal must be used inside <LessonUpdateModalContextProvider>",
    );
  }
  return ctx;
};
