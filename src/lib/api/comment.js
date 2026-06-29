import { getAuthHeaders } from "./authHeaders";

const BASE_URL = process.env.NEXT_PUBLIC_SERVER_URL;

export const PostComment = async (lessonId, userId, text) => {
  if (!lessonId) {
    throw new Error("lessonId is required to post a comment");
  }
  if (!userId) {
    throw new Error("userId is required to post a comment");
  }
  if (!text || !text.trim()) {
    throw new Error("Comment text cannot be empty");
  }

  const params = new URLSearchParams({ lessonId, userId });
  console.log("thisis the query param for comment post :", params.toString());

  const url = `${BASE_URL}/api/comment/add?${params.toString()}`;

  const headers = await getAuthHeaders();
  const response = await fetch(url, {
    method: "POST",
    headers,
    credentials: "include",
    body: JSON.stringify({ comment: text.trim() }),
  });

  let data = null;
  try {
    data = await response.json();
  } catch {
    // Non-JSON body; fall through to the generic error below.
  }

  if (!response.ok) {
    const message = data?.message || "Failed to post comment";
    const error = new Error(message);
    error.status = response.status;
    error.details = data;
    throw error;
  }

  return data?.comment ? data : { comment: data };
};

/**
 * Fetches every comment for a lesson, newest first. Each row comes back
 * with denormalised author fields (authorId, authorName, authorProfilePic)
 * so the UI can render the list in a single round-trip.
 *
 * Returns `[]` on any failure so callers can iterate without an extra
 * null check.
 */
export const getComments = async (lessonId) => {
  if (!lessonId) {
    throw new Error("lessonId is required to fetch comments");
  }

  try {
    const params = new URLSearchParams({ lessonId });
    const url = `${BASE_URL}/api/comment/all?${params.toString()}`;

    const response = await fetch(url, {
      method: "GET",
      credentials: "include",
      cache: "no-store",
    });

    let data = null;
    try {
      data = await response.json();
    } catch {
      // Non-JSON body; treat as empty list.
    }

    if (!response.ok) {
      const error = new Error(data?.message || "Failed to load comments");
      error.status = response.status;
      error.details = data;
      throw error;
    }

    if (Array.isArray(data)) return data;
    if (Array.isArray(data?.comments)) return data.comments;
    return [];
  } catch (error) {
    console.error("getComments error:", error);
    return [];
  }
};
