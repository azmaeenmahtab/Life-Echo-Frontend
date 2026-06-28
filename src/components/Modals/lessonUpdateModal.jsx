"use client";

import { useEffect, useState } from "react";
import { X, UploadCloud, Lock } from "lucide-react";
import toast from "react-hot-toast";
import { useLessonUpdateModal } from "@/lib/contexts/lessonUpdateModalContext";
import { updateLesson } from "@/lib/actions/lessonActions";

const categories = [
  { key: "personal-growth", label: "Personal Growth" },
  { key: "career", label: "Career" },
  { key: "relationships", label: "Relationships" },
  { key: "mindset", label: "Mindset" },
  { key: "mistakes-learned", label: "Mistakes Learned" },
];

const emotionalTones = [
  { key: "motivational", label: "Motivational" },
  { key: "sad", label: "Sad" },
  { key: "realization", label: "Realization" },
  { key: "gratitude", label: "Gratitude" },
];

export function LessonUpdateModal({ session }) {
  const {
    isOpen,
    lesson,
    closeLessonUpdateModal,
    notifyLessonUpdated,
  } = useLessonUpdateModal();

  const [title, setTitle] = useState("");
  const [category, setCategory] = useState("personal-growth");
  const [emotionalTone, setEmotionalTone] = useState("motivational");
  const [story, setStory] = useState("");
  const [accessLevel, setAccessLevel] = useState("free");

  const [selectedFile, setSelectedFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null); // either new dataURL or existing imageUrl
  const [isUploading, setIsUploading] = useState(false);

  const [submitting, setSubmitting] = useState(false);

  const isPremiumUser = session?.user?.plan === "pro";
  const userId = session?.user?.id;

  // Hydrate the form whenever a new lesson is loaded into the modal.
  useEffect(() => {
    if (!lesson) return;
    setTitle(lesson.title ?? "");
    setCategory(lesson.category ?? "personal-growth");
    setEmotionalTone(lesson.emotionalTone ?? "motivational");
    setStory(lesson.story ?? "");
    setAccessLevel(lesson.accessLevel === "premium" ? "premium" : "free");
    setSelectedFile(null);
    setPreviewUrl(lesson.imageUrl ?? null);
  }, [lesson]);

  // Clean up object URLs we created from FileReader to avoid leaks.
  useEffect(() => {
    return () => {
      if (previewUrl && previewUrl.startsWith("blob:")) {
        URL.revokeObjectURL(previewUrl);
      }
    };
  }, [previewUrl]);

  if (!isOpen || !lesson) return null;

  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (previewUrl && previewUrl.startsWith("blob:")) {
      URL.revokeObjectURL(previewUrl);
    }
    setSelectedFile(file);
    setPreviewUrl(URL.createObjectURL(file));
  };

  const uploadLessonImage = async (file) => {
    const formData = new FormData();
    formData.append("image", file);
    setIsUploading(true);
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_SERVER_URL}/api/images/upload`,
        { method: "POST", body: formData },
      );
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data?.message || "Image upload failed");
      }
      return data?.image?.url ?? null;
    } catch (err) {
      console.error("imgbb upload error:", err);
      toast.error(err.message || "Failed to upload image");
      return null;
    } finally {
      setIsUploading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (submitting) return;

    if (!title.trim() || !story.trim()) {
      toast.error("Please fill out the Lesson Title and Story insights!");
      return;
    }
    if (!userId) {
      toast.error("You must be signed in to update a lesson.");
      return;
    }

    let nextImageUrl = lesson.imageUrl ?? null;
    if (selectedFile) {
      const uploaded = await uploadLessonImage(selectedFile);
      if (!uploaded) return;
      nextImageUrl = uploaded;
    }

    // Build only the changed fields so backend $set stays minimal.
    const updates = {};
    if (title !== lesson.title) updates.title = title.trim();
    if (category !== lesson.category) updates.category = category;
    if (emotionalTone !== lesson.emotionalTone)
      updates.emotionalTone = emotionalTone;
    if (story !== lesson.story) updates.story = story;
    if (nextImageUrl !== (lesson.imageUrl ?? null))
      updates.imageUrl = nextImageUrl;

    // Premium gate: only Pro subscribers may move to "premium".
    const nextAccessLevel = isPremiumUser ? accessLevel : "free";
    if (nextAccessLevel !== lesson.accessLevel)
      updates.accessLevel = nextAccessLevel;

    if (Object.keys(updates).length === 0) {
      toast("Nothing to update.", { icon: "ℹ️" });
      closeLessonUpdateModal();
      return;
    }

    setSubmitting(true);
    try {
      const updated = await updateLesson({
        lessonId: lesson._id,
        userId,
        ...updates,
      });
      toast.success(updated?.message || "Lesson updated successfully!");
      notifyLessonUpdated(updated?.lesson ?? { _id: lesson._id, ...updates });
      closeLessonUpdateModal();
    } catch (err) {
      console.error("updateLesson error:", err);
      toast.error(err?.message || "Failed to update lesson");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      {/* Close on backdrop click */}
      <div className="absolute inset-0" onClick={closeLessonUpdateModal} />

      <div className="relative z-10 w-full max-w-2xl rounded-lg border border-[#EBE7D9] bg-[#FAF8F3] p-6 shadow-xl font-sans max-h-[90vh] overflow-y-auto">
        {/* Close X */}
        <button
          type="button"
          onClick={closeLessonUpdateModal}
          className="absolute right-3 top-3 rounded p-1 text-[#556359] transition hover:bg-[#EFEBDE] hover:text-[#1E2E24]"
          aria-label="Close modal"
        >
          <X size={18} />
        </button>

        <h3 className="text-lg font-bold text-[#1E2E24] mb-1">
          Update Lesson
        </h3>
        <p className="text-sm text-[#556359] mb-6">
          Edit any field below and save. User identity is locked to the lesson
          owner.
        </p>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          {/* Title */}
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-bold uppercase tracking-wider text-[#556359]">
              Title
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              maxLength={200}
              required
              className="w-full rounded-lg border border-[#EBE7D9] bg-white px-3 py-2.5 text-sm text-[#1E2E24] shadow-sm outline-none transition focus:border-[#1E2E24] focus:ring-1 focus:ring-[#1E2E24]"
              placeholder="A short, memorable title"
            />
          </div>

          {/* Story */}
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-bold uppercase tracking-wider text-[#556359]">
              Story / Insight
            </label>
            <textarea
              value={story}
              onChange={(e) => setStory(e.target.value)}
              required
              rows={5}
              className="w-full resize-y rounded-lg border border-[#EBE7D9] bg-white px-3 py-2.5 text-sm text-[#1E2E24] shadow-sm outline-none transition focus:border-[#1E2E24] focus:ring-1 focus:ring-[#1E2E24]"
              placeholder="Share what you learned..."
            />
          </div>

          {/* Category + Emotional Tone side-by-side */}
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-bold uppercase tracking-wider text-[#556359]">
                Category
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full rounded-lg border border-[#EBE7D9] bg-white px-3 py-2.5 text-sm text-[#1E2E24] shadow-sm outline-none transition focus:border-[#1E2E24] focus:ring-1 focus:ring-[#1E2E24]"
              >
                {categories.map((c) => (
                  <option key={c.key} value={c.key}>
                    {c.label}
                  </option>
                ))}
              </select>
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-bold uppercase tracking-wider text-[#556359]">
                Emotional Tone
              </label>
              <select
                value={emotionalTone}
                onChange={(e) => setEmotionalTone(e.target.value)}
                className="w-full rounded-lg border border-[#EBE7D9] bg-white px-3 py-2.5 text-sm text-[#1E2E24] shadow-sm outline-none transition focus:border-[#1E2E24] focus:ring-1 focus:ring-[#1E2E24]"
              >
                {emotionalTones.map((t) => (
                  <option key={t.key} value={t.key}>
                    {t.label}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Access Level */}
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-bold uppercase tracking-wider text-[#556359]">
              Access Level
            </label>
            <div className="flex items-center gap-3">
              <select
                value={accessLevel}
                onChange={(e) => setAccessLevel(e.target.value)}
                disabled={!isPremiumUser}
                className="w-full rounded-lg border border-[#EBE7D9] bg-white px-3 py-2.5 text-sm text-[#1E2E24] shadow-sm outline-none transition focus:border-[#1E2E24] focus:ring-1 focus:ring-[#1E2E24] disabled:cursor-not-allowed disabled:opacity-60"
              >
                <option value="free">Free</option>
                <option value="premium" disabled={!isPremiumUser}>
                  Premium
                </option>
              </select>
              {!isPremiumUser && (
                <span className="inline-flex shrink-0 items-center gap-1 rounded-full bg-[#EFEBDE] px-2 py-1 text-xs font-medium text-[#556359]">
                  <Lock size={12} />
                  Pro only
                </span>
              )}
            </div>
            {!isPremiumUser && (
              <p className="text-xs text-[#556359]">
                Upgrade to a Pro plan to publish premium lessons.
              </p>
            )}
          </div>

          {/* Image (optional re-upload) */}
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-bold uppercase tracking-wider text-[#556359]">
              Cover Image (optional re-upload)
            </label>
            <div className="flex items-start gap-4">
              {previewUrl ? (
                <img
                  src={previewUrl}
                  alt="Lesson preview"
                  className="h-24 w-32 rounded-md object-cover border border-[#EBE7D9]"
                />
              ) : (
                <div className="flex h-24 w-32 items-center justify-center rounded-md border border-dashed border-[#EBE7D9] bg-white text-xs text-[#556359]">
                  No image
                </div>
              )}

              <label className="inline-flex cursor-pointer items-center gap-2 rounded-lg border border-[#EBE7D9] bg-white px-3 py-2 text-sm text-[#1E2E24] shadow-sm transition hover:bg-[#F5F2EB]">
                <UploadCloud size={16} />
                {selectedFile ? "Replace image" : "Upload new image"}
                <input
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={handleFileChange}
                />
              </label>

              {selectedFile && (
                <button
                  type="button"
                  onClick={() => {
                    if (previewUrl && previewUrl.startsWith("blob:")) {
                      URL.revokeObjectURL(previewUrl);
                    }
                    setSelectedFile(null);
                    setPreviewUrl(lesson.imageUrl ?? null);
                  }}
                  className="rounded px-2 py-1 text-xs text-[#556359] underline-offset-2 hover:underline"
                >
                  Undo
                </button>
              )}
            </div>
          </div>

          {/* Action buttons */}
          <div className="mt-2 flex justify-end gap-2">
            <button
              type="button"
              onClick={closeLessonUpdateModal}
              className="rounded px-4 py-2 text-sm font-medium text-[#556359] transition hover:bg-[#EFEBDE]"
              disabled={submitting || isUploading}
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={submitting || isUploading}
              className="rounded bg-[#1E2E24] px-5 py-2 text-sm font-medium text-white transition hover:bg-[#2A3F33] disabled:cursor-not-allowed disabled:opacity-50"
            >
              {submitting
                ? "Saving…"
                : isUploading
                  ? "Uploading image…"
                  : "Save Changes"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default LessonUpdateModal;
