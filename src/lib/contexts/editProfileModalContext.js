// lib/contexts/editProfileModalContext.js
"use client";

import {
  createContext,
  useCallback,
  useContext,
  useState,
} from "react";

const EditProfileModalContext = createContext(null);

export function EditProfileModalContextProvider({ children }) {
  const [isOpen, setIsOpen] = useState(false);

  // Snapshot of the profile when the modal was opened, so the form
  // hydrates even after a refresh and `closeEditProfileModal` can reset.
  const [initial, setInitial] = useState(null);

  const openEditProfileModal = useCallback((profile = null) => {
    setInitial(profile);
    setIsOpen(true);
  }, []);

  const closeEditProfileModal = useCallback(() => {
    setIsOpen(false);
    // Keep `initial` around briefly so any closing animation can read it,
    // then drop it so a fresh open starts from a clean slate.
    setTimeout(() => setInitial(null), 200);
  }, []);

  return (
    <EditProfileModalContext.Provider
      value={{
        isOpen,
        initial,
        openEditProfileModal,
        closeEditProfileModal,
      }}
    >
      {children}
    </EditProfileModalContext.Provider>
  );
}

export function useEditProfileModal() {
  const ctx = useContext(EditProfileModalContext);
  if (!ctx) {
    throw new Error(
      "useEditProfileModal must be used inside an <EditProfileModalContextProvider>",
    );
  }
  return ctx;
}