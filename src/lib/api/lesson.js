/**
 * Frontend API client for the lesson endpoints.
 *
 * Centralises every fetch to /api/lessons/* so the form components stay
 * presentation-only. Throws on non-2xx responses with the server's
 * `message` attached for easier toasting in the UI.
 */

const BASE_URL = process.env.NEXT_PUBLIC_SERVER_URL;

/**
 * POSTs a new lesson to the backend. Accepts the full lesson payload
 * assembled by the form (title, story, category, emotionalTone, imageUrl,
 * accessLevel, userId) and returns the persisted lesson document.
 *
 * Throws an Error whose `.message` is the server's error message when the
 * response is not ok.
 */
export const createLesson = async (payload) => {
  const response = await fetch(`${BASE_URL}/api/lessons/create`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
    credentials: "include",
  });

  let data = null;
  try {
    data = await response.json();
  } catch {
    // Non-JSON body; fall through to the generic error below.
  }

  if (!response.ok) {
    const message = data?.message || "Failed to create lesson";
    const error = new Error(message);
    error.status = response.status;
    error.details = data;
    throw error;
  }

  return data?.lesson ?? data;
};
