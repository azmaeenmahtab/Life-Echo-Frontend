"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { Input, Button } from "@heroui/react";
import { PostComment, getComments } from "@/lib/api/comment";

// Group consecutive identical timestamps into a stable key when the same
// author posts multiple comments in the same millisecond (rare, but
// possible in tests and dev).
const formatCommentTime = (value) => {
  if (!value) return "";
  const d = new Date(value);
  if (Number.isNaN(d.getTime())) return "";
  return d.toLocaleString(undefined, {
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
};

export const CommentSection = ({ lessonId, userId }) => {
  const [comment, setComment] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [comments, setComments] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  const fetchComments = async () => {
    if (!lessonId) return;
    setIsLoading(true);
    const list = await getComments(lessonId);
    setComments(list);
    setIsLoading(false);
  };

  useEffect(() => {
    fetchComments();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [lessonId]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const trimmed = comment.trim();
    if (!trimmed) return;

    try {
      const result = await PostComment(lessonId, userId, trimmed);
      console.log("comment post result ", result);
      setComment("");
      setError("");
      setSuccess("Comment posted successfully!");
      // Refetch so the new comment carries its denormalized
      // author fields (authorName, authorProfilePic) from the
      // server-side aggregation pipeline.
      await fetchComments();
    } catch (err) {
      setError(err.message);
      setSuccess("");
      console.error("Failed to post comment:", err);
    }
  };

  return (
    <div className="py-6 space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-bold text-[#1E2E24]">Comments</h1>
        <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
          {comments.length} {comments.length === 1 ? "comment" : "comments"}
        </span>
      </div>

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
            onChange={(e) => {
              setComment(e.target.value);
              if (error) setError("");
              if (success) setSuccess("");
            }}
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

      {error && (
        <p
          role="alert"
          className="text-xs font-medium text-red-600 bg-red-50 border border-red-200 rounded-lg px-3 py-2"
        >
          {error}
        </p>
      )}

      {success && (
        <p
          role="status"
          className="text-xs font-medium text-green-700 bg-green-50 border border-green-200 rounded-lg px-3 py-2"
        >
          {success}
        </p>
      )}

      <div className="space-y-3">
        {isLoading && comments.length === 0 ? (
          <div className="text-sm text-gray-500 italic px-2">
            Loading comments…
          </div>
        ) : comments.length === 0 ? (
          <div className="text-sm text-gray-500 italic px-2 py-3 bg-white rounded-2xl border border-dashed border-[#EBE7D9] text-center">
            No comments yet. Be the first to share your thoughts.
          </div>
        ) : (
          comments.map((c) => (
            <article
              key={c._id}
              className="flex items-start gap-3 bg-white p-4 rounded-2xl border border-[#EBE7D9] shadow-sm"
            >
              <span className="w-9 h-9 shrink-0 rounded-full overflow-hidden bg-[#FAF8F3] border border-[#EBE7D9] flex items-center justify-center">
                {c.authorProfilePic ? (
                  <Image
                    src={c.authorProfilePic}
                    alt={c.authorName || "User"}
                    width={36}
                    height={36}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <span className="text-xs font-bold text-[#4D7C5D]">
                    {(c.authorName || "?").slice(0, 1).toUpperCase()}
                  </span>
                )}
              </span>

              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between gap-2">
                  <p className="text-sm font-semibold text-[#1E2E24] truncate">
                    {c.authorName || "Anonymous"}
                  </p>
                  <time
                    dateTime={c.createdAt}
                    className="text-[10px] font-medium text-gray-400 uppercase tracking-wider shrink-0"
                  >
                    {formatCommentTime(c.createdAt)}
                  </time>
                </div>
                <p className="text-sm text-gray-700 mt-1 wrap-break-word whitespace-pre-wrap">
                  {c.comment}
                </p>
              </div>
            </article>
          ))
        )}
      </div>
    </div>
  );
};
