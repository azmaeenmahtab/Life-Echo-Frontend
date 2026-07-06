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

import { getAuthedHeaders } from "../api/authed";

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
    headers: await getAuthedHeaders(),
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
    headers: await getAuthedHeaders(),
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
    headers: await getAuthedHeaders(),
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
      headers: await getAuthedHeaders(),
      credentials: "include",
      body: JSON.stringify({ userId, visibility }),
    },
  );

  return readJson(response);
};

export const changeLessonAccessLevel = async ({
  lessonId,
  userId,
  accessLevel,
}) => {
  if (!lessonId)
    throw new Error("changeLessonAccessLevel: lessonId is required");
  if (!userId) throw new Error("changeLessonAccessLevel: userId is required");
  if (!accessLevel)
    throw new Error("changeLessonAccessLevel: accessLevel is required");

  const response = await fetch(
    `${BASE_URL}/api/lessons/${lessonId}/access-level/change`,
    {
      method: "PATCH",
      headers: await getAuthedHeaders(),
      credentials: "include",
      body: JSON.stringify({ userId, accessLevel }),
    },
  );

  return readJson(response);
};

/**
 * Set the admin-moderation review status of a lesson.
 *
 * PATCH /api/lessons/:id/review-status/change with body
 *   { userId, status }
 * where `status` is one of "pending" | "reviewed" | "rejected".
 *
 * The backend cascades on `rejected` — visibility is forced to "private"
 * and isFeatured to false in the same update — and the response includes
 * the post-cascade values so the admin list and the owner view can
 * reconcile state in one round-trip.
 *
 * Response shape:
 *   {
 *     message:      "Lesson review status updated",
 *     lessonId:     string,
 *     userId:       string,
 *     reviewStatus: "pending" | "reviewed" | "rejected",
 *     visibility:   "public" | "private" | null,
 *     isFeatured:   boolean,
 *     changed:      boolean,
 *   }
 */
export const setLessonReviewStatus = async ({ lessonId, userId, status }) => {
  if (!lessonId)
    throw new Error("setLessonReviewStatus: lessonId is required");
  if (!userId)
    throw new Error("setLessonReviewStatus: userId is required");
  if (!status)
    throw new Error("setLessonReviewStatus: status is required");

  const response = await fetch(
    `${BASE_URL}/api/lessons/${lessonId}/review-status/change`,
    {
      method: "PATCH",
      headers: await getAuthedHeaders(),
      credentials: "include",
      body: JSON.stringify({ userId, status }),
    },
  );

  return readJson(response);
};

/**
 * Toggle the `isFeatured` flag on a lesson (admin moderation).
 *
 * PATCH /api/lessons/:id/featured/toggle with body
 *   { userId, isFeatured? }
 *
 * `isFeatured` is optional — when omitted the backend flips the current
 * value (true toggle). Pass an explicit boolean to force a state.
 *
 * The backend enforces two guardrails and returns 409 when violated:
 *   - a lesson with `reviewStatus === "rejected"` cannot be featured
 *   - a `private` lesson cannot be featured
 *
 * Response shape:
 *   {
 *     message:    "Lesson featured successfully" | "Lesson unfeatured successfully",
 *     lessonId:   string,
 *     isFeatured: boolean,   // post-toggle
 *     changed:    boolean,
 *   }
 */
export const toggleLessonFeatured = async ({ lessonId, userId, isFeatured }) => {
  if (!lessonId)
    throw new Error("toggleLessonFeatured: lessonId is required");
  if (!userId)
    throw new Error("toggleLessonFeatured: userId is required");

  const response = await fetch(
    `${BASE_URL}/api/lessons/${lessonId}/featured/toggle`,
    {
      method: "PATCH",
      headers: await getAuthedHeaders(),
      credentials: "include",
      body: JSON.stringify({ userId, isFeatured }),
    },
  );

  return readJson(response);
};

/**
 * PUT /api/lessons/:id with the merged lesson update payload.
 *
 * Caller contract (lessonUpdateModal.jsx):
 *   updateLesson({ lessonId, userId, ...updates })
 *     - `updates` is a flat field map (title, story, category,
 *       emotionalTone, accessLevel, imageUrl, …) — any subset of the
 *       lesson shape the modal is allowed to edit.
 *     - The backend validates ownership before persisting, so we still
 *       forward `userId` so the server can match the caller to the doc.
 *
 * Server response shape:
 *   { message: "Lesson updated", lessonId: string, lesson: <updated doc> }
 * If the server is older and doesn't return `lesson`, callers can fall
 * back to `{ lessonId, ...updates }` — the modal already does this.
 */
export const updateLesson = async ({ lessonId, userId, ...patch }) => {
  if (!lessonId) throw new Error("updateLesson: lessonId is required");
  if (!userId) throw new Error("updateLesson: userId is required");

  const response = await fetch(`${BASE_URL}/api/lessons/${lessonId}`, {
    method: "PUT",
    headers: await getAuthedHeaders(),
    credentials: "include",
    body: JSON.stringify({ userId, ...patch }),
  });

  return readJson(response);
};

/**
 * Sends DELETE /api/lessons/:id with `userId` in the body so the backend
 * can enforce owner-only deletion. Returns the server's
 * `{ message, lessonId }` payload on success.
 */
export const deleteLesson = async ({ lessonId, userId }) => {
  if (!lessonId) throw new Error("deleteLesson: lessonId is required");
  if (!userId) throw new Error("deleteLesson: userId is required");

  const response = await fetch(`${BASE_URL}/api/lessons/${lessonId}`, {
    method: "DELETE",
    headers: await getAuthedHeaders(),
    credentials: "include",
    body: JSON.stringify({ userId }),
  });

  return readJson(response);
};

export const removeFavoriteLesson = async (userId, lessonId) => {
  try {
    const url = `${BASE_URL}/api/lessons/user/${encodeURIComponent(
      userId,
    )}/favorites/${encodeURIComponent(lessonId)}`;

    const response = await fetch(url, {
      method: "DELETE",
      headers: await getAuthedHeaders(),
      credentials: "include",
    });

    let data = null;
    try {
      data = await response.json();
    } catch {
      // Non-JSON body
    }

    if (!response.ok) {
      const error = new Error(data?.message || "Failed to remove favorite");
      error.status = response.status;
      throw error;
    }

    return true;
  } catch (error) {
    console.error("removeFavoriteLesson error:", error);
    return false;
  }
};
