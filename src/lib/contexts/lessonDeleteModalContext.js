// lib/contexts/lessonDeleteModalContext.js
"use client";

import { createContext, useContext, useState } from "react";

const LessonDeleteModalContext = createContext(null);

/**
 * Holds the lesson pending deletion plus the open/close actions and a
 * `deletedLessonId` signal so any subscribed table can drop the row from
 * its local state once the API call succeeds. Mirrors the
 * `lessonUpdateModalContext` shape so consumers can rely on the same
 * trigger pattern.
 */
export function LessonDeleteModalContextProvider({ children }) {
  const [isOpen, setIsOpen] = useState(false);
  const [lesson, setLesson] = useState(null);
  const [deletedLessonId, setDeletedLessonId] = useState(null);

  const openLessonDeleteModal = (lessonToDelete) => {
    if (!lessonToDelete) return;
    setLesson(lessonToDelete);
    setIsOpen(true);
  };

  const closeLessonDeleteModal = () => {
    setIsOpen(false);
    // Keep `lesson` for a tick so exit animations can read it; clear after.
    setTimeout(() => setLesson(null), 200);
  };

  // Called by the modal after a successful delete so any subscribed table
  // can drop the row from its local list in place.
  const notifyLessonDeleted = (id) => {
    if (id) setDeletedLessonId(id);
  };

  return (
    <LessonDeleteModalContext.Provider
      value={{
        isOpen,
        lesson,
        openLessonDeleteModal,
        closeLessonDeleteModal,
        deletedLessonId,
        notifyLessonDeleted,
      }}
    >
      {children}
    </LessonDeleteModalContext.Provider>
  );
}

export const useLessonDeleteModal = () => {
  const ctx = useContext(LessonDeleteModalContext);
  if (!ctx) {
    throw new Error(
      "useLessonDeleteModal must be used inside <LessonDeleteModalContextProvider>",
    );
  }
  return ctx;
};
