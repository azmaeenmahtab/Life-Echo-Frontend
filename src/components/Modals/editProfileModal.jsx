"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { X, Camera } from "lucide-react";
import toast from "react-hot-toast";

import { useEditProfileModal } from "@/lib/contexts/editProfileModalContext";
import { authClient } from "@/lib/auth-client";

export default function EditProfileModal() {
  const { isOpen, initial, closeEditProfileModal } = useEditProfileModal();
  const router = useRouter();

  const [name, setName] = useState("");
  const [imageUrl, setImageUrl] = useState("");

  const [submitting, setSubmitting] = useState(false);

  // Hydrate whenever the modal opens with a new snapshot.
  useEffect(() => {
    if (!isOpen) return;
    setName(initial?.name ?? "");
    setImageUrl(initial?.image ?? "");
  }, [isOpen, initial]);

  if (!isOpen) return null;

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (submitting) return;

    const trimmedName = name.trim();
    if (!trimmedName) {
      toast.error("Display name cannot be empty.");
      return;
    }

    const updates = {};
    if (trimmedName !== (initial?.name ?? "")) updates.name = trimmedName;

    const trimmedImage = imageUrl.trim();
    const initialImage = initial?.image ?? "";
    if (trimmedImage !== initialImage) {
      updates.image = trimmedImage === "" ? null : trimmedImage;
    }

    if (Object.keys(updates).length === 0) {
      toast("Nothing to update.", { icon: "ℹ️" });
      closeEditProfileModal();
      return;
    }

    setSubmitting(true);
    try {
      const { error } = await authClient.updateUser(updates);
      if (error) {
        throw new Error(error?.message || "Failed to update profile");
      }
      toast.success("Profile updated successfully!");
      // Server Components don't auto-refresh after a client mutation,
      // so nudge Next to re-render the page (which reads the profile).
      router.refresh();
      closeEditProfileModal();
    } catch (err) {
      console.error("[EditProfileModal] update failed:", err);
      toast.error(err?.message || "Failed to update profile");
    } finally {
      setSubmitting(false);
    }
  };

  const fallbackInitial = (name || initial?.name || "?").charAt(0).toUpperCase();
  const previewSrc = imageUrl.trim() === "" ? null : imageUrl.trim();

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      {/* Close on backdrop click */}
      <div className="absolute inset-0" onClick={closeEditProfileModal} />

      <div className="relative z-10 w-full max-w-md rounded-lg border border-[#EBE7D9] bg-[#FAF8F3] p-6 shadow-xl font-sans max-h-[90vh] overflow-y-auto">
        <button
          type="button"
          onClick={closeEditProfileModal}
          className="absolute right-3 top-3 rounded p-1 text-[#556359] transition hover:bg-[#EFEBDE] hover:text-[#1E2E24]"
          aria-label="Close modal"
        >
          <X size={18} />
        </button>

        <h3 className="text-lg font-bold text-[#1E2E24] mb-1">Edit Profile</h3>
        <p className="text-sm text-[#556359] mb-6">
          Update your display name and photo URL. Changes go live immediately.
        </p>

        <form onSubmit={handleSubmit} className="flex flex-col gap-5">
          {/* Avatar preview */}
          <div className="flex flex-col items-center gap-3">
            <div className="relative">
              <div className="w-24 h-24 rounded-full bg-[#1c2f24] text-[#e2f2e9] flex items-center justify-center font-serif font-bold text-3xl border-4 border-white shadow-md overflow-hidden">
                {previewSrc ? (
                  <img
                    src={previewSrc}
                    alt="Profile preview"
                    className="w-full h-full object-cover"
                  />
                ) : (
                  fallbackInitial
                )}
              </div>
              <div className="absolute -bottom-1 -right-1 w-8 h-8 rounded-full bg-white border-2 border-[#eae6df] shadow-md flex items-center justify-center text-[#2e7d32]">
                <Camera size={14} />
              </div>
            </div>
          </div>

          {/* Display name */}
          <div className="flex flex-col gap-1.5">
            <label
              htmlFor="edit-profile-name"
              className="text-xs font-bold uppercase tracking-wider text-[#556359]"
            >
              Display Name
            </label>
            <input
              id="edit-profile-name"
              type="text"
              value={name}
              onChange={(event) => setName(event.target.value)}
              maxLength={100}
              required
              className="w-full rounded-lg border border-[#EBE7D9] bg-white px-3 py-2.5 text-sm text-[#1E2E24] shadow-sm outline-none transition focus:border-[#1E2E24] focus:ring-1 focus:ring-[#1E2E24]"
              placeholder="How should we show you on Life Echo?"
            />
          </div>

          {/* Image URL */}
          <div className="flex flex-col gap-1.5">
            <label
              htmlFor="edit-profile-image"
              className="text-xs font-bold uppercase tracking-wider text-[#556359]"
            >
              Profile Image URL
            </label>
            <input
              id="edit-profile-image"
              type="url"
              value={imageUrl}
              onChange={(event) => setImageUrl(event.target.value)}
              maxLength={2000}
              className="w-full rounded-lg border border-[#EBE7D9] bg-white px-3 py-2.5 text-sm text-[#1E2E24] shadow-sm outline-none transition focus:border-[#1E2E24] focus:ring-1 focus:ring-[#1E2E24]"
              placeholder="https://example.com/avatar.jpg"
            />
            <p className="text-[11px] text-[#556359]">
              Paste a public image URL. Leave blank to remove your photo.
            </p>
          </div>

          {/* Actions */}
          <div className="flex justify-end gap-2 pt-2">
            <button
              type="button"
              onClick={closeEditProfileModal}
              disabled={submitting}
              className="rounded px-4 py-2 text-sm font-medium text-[#556359] transition hover:bg-[#EFEBDE] disabled:opacity-60"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={submitting}
              className="rounded bg-[#1E2E24] px-5 py-2 text-sm font-medium text-white transition hover:bg-[#2A3F33] disabled:cursor-not-allowed disabled:opacity-50"
            >
              {submitting ? "Saving…" : "Save Changes"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}