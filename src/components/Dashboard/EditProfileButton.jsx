"use client";

import { Pencil } from "lucide-react";

import { useEditProfileModal } from "@/lib/contexts/editProfileModalContext";

/**
 * Tiny client-side wrapper that fires the Edit Profile modal.
 * Kept separate from the server-rendered profile page so the page
 * can stay a Server Component (it only needs `useRouter` style refresh).
 */
export default function EditProfileButton({ user }) {
  const { openEditProfileModal } = useEditProfileModal();

  if (!user?._id) return null;

  const handleClick = () => {
    openEditProfileModal({
      _id: user._id,
      name: user.name ?? "",
      image: user.image ?? null,
    });
  };

  return (
    <button
      type="button"
      onClick={handleClick}
      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full border border-[#2e7d32] text-[#2e7d32] text-xs font-semibold hover:bg-[#e2f2e9] transition"
    >
      <Pencil size={12} />
      Edit Profile
    </button>
  );
}