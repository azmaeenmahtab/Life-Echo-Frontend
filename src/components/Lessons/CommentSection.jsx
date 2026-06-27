"use client";

import { useState } from "react";
import { Input, Button } from "@heroui/react";
import { PostComment } from "@/lib/api/comment";

export const CommentSection = ({ lessonId, userId }) => {
  const [comment, setComment] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    const trimmed = comment.trim();
    if (!trimmed) return;

    try {
      const result = await PostComment(lessonId, userId, trimmed);
      console.log("comment post result ", result);
      setComment("");
    } catch (err) {
      console.error("Failed to post comment:", err);
    }
  };

  return (
    <div className="py-6 space-y-3">
      <h1 className="text-xl font-bold text-[#1E2E24]">Comments</h1>

      <form
        onSubmit={handleSubmit}
        className="flex flex-col sm:flex-row items-stretch sm:items-end gap-3 bg-white p-4 rounded-2xl border border-[#EBE7D9] shadow-sm"
      >
        <div className="flex-1 flex flex-col gap-1.5">
          <label
            htmlFor="comment-text"
            className="text-[10px] font-bold text-gray-500 uppercase tracking-wider"
          >
            Comment
          </label>
          <Input
            id="comment-text"
            name="comment"
            aria-label="Comment"
            placeholder="Share your thoughts…"
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            className="rounded-lg bg-[#FAF8F3] border border-[#EBE7D9] hover:border-[#4D7C5D] focus-within:border-[#4D7C5D] h-11 text-sm text-gray-700 placeholder:text-gray-400 px-3"
          />
        </div>

        <Button
          type="submit"
          isDisabled={!comment.trim()}
          className="bg-[#4D7C5D] text-white font-semibold px-6 h-11 rounded-xl hover:bg-[#2D6A4F] active:scale-95 transition-all"
        >
          Post
        </Button>
      </form>

      <div className="bg-amber-50" />
    </div>
  );
};
