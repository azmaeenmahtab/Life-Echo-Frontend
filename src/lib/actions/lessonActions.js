/**
 * Frontend helpers that POST to the lesson interaction endpoints.
 *
 * Each function is a thin wrapper around `fetch` that:
 *   - targets `${NEXT_PUBLIC_SERVER_URL}/api/lessons/:id/<verb>`
 *   - sends the current viewer's userId in the JSON body
 *     (the backend will read the better-auth session and trust this payload
 *      only once the endpoint is implemented; for now we forward it so the
 *      contract is already in place).
 *   - returns the server's normalised response shape:
 *       { message, lessonId, action, isLiked, isSaved, likesCount, savesCount }
 *     `action` is one of "like" | "unlike" | "save" | "unsave" | "report",
 *     letting the UI know whether the call toggled the state on or off.
 *
 * Every helper throws an Error whose `.message` is the server's message
 * when the response is not ok, mirroring the convention used by
 * `lib/api/lesson.js`.
 */

const BASE_URL = process.env.NEXT_PUBLIC_SERVER_URL;

/**
 * Normalise a fetch response: parses JSON when possible, attaches `status`
 * and `details` to thrown errors so callers can branch on HTTP code
 * (e.g. 401 → redirect to login).
 */
async function readJson(response) {
  let data = null;
  try {
    data = await response.json();
  } catch {
    // Non-JSON body; leave `data` as null.
  }
  if (!response.ok) {
    const message =
      data?.message || `Request failed with status ${response.status}`;
    const error = new Error(message);
    error.status = response.status;
    error.details = data;
    throw error;
  }
  return data;
}

/**
 * POSTs a like / unlike toggle for the given lesson.
 *
 * The endpoint is expected to be idempotent per (userId, lessonId):
 * hitting it twice removes the like. The returned `isLiked` reflects the
 * post-toggle state.
 */
export const toggleLikeLesson = async ({ lessonId, userId }) => {
  if (!lessonId) throw new Error("toggleLikeLesson: lessonId is required");
  if (!userId) throw new Error("toggleLikeLesson: userId is required");

  const response = await fetch(`${BASE_URL}/api/lessons/${lessonId}/like`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
    body: JSON.stringify({ userId }),
  });

  return readJson(response);
};

/**
 * POSTs a save / unsave toggle for the given lesson. Same contract as
 * `toggleLikeLesson` but targets the `/save` endpoint.
 */
export const toggleSaveLesson = async ({ lessonId, userId }) => {
  if (!lessonId) throw new Error("toggleSaveLesson: lessonId is required");
  if (!userId) throw new Error("toggleSaveLesson: userId is required");

  const response = await fetch(`${BASE_URL}/api/lessons/${lessonId}/save`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
    body: JSON.stringify({ userId }),
  });

  return readJson(response);
};

/**
 * POSTs a report against the given lesson. Reports are append-only — the
 * backend will record the report and bump `reportsCount`, but will not
 * toggle state. A `reason` string is optional; the backend can default it
 * if missing.
 */
export const reportLesson = async ({ lessonId, userId, reason }) => {
  if (!lessonId) throw new Error("reportLesson: lessonId is required");
  if (!userId) throw new Error("reportLesson: userId is required");

  const response = await fetch(`${BASE_URL}/api/lessons/${lessonId}/report`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
    body: JSON.stringify({ userId, reason }),
  });

  return readJson(response);
};

export const changeLessonVisibility = async ({
  lessonId,
  userId,
  visibility,
}) => {
  if (!lessonId)
    throw new Error("changeLessonVisibility: lessonId is required");
  if (!userId) throw new Error("changeLessonVisibility: userId is required");

  const response = await fetch(
    `${BASE_URL}/api/lessons/${lessonId}/visibility/change`,
    {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify({ userId, visibility }),
    },
  );

  return readJson(response);
};
