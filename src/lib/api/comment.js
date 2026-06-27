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
  console.log("tisis the query param for comment post :", params);

  const url = `${BASE_URL}/api/comment/add?${params.toString()}`;

  const response = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
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
