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

/**
 * Fetches the list of publicly-shared lessons. Returns an array (empty
 * on error) so callers can safely iterate without an extra null check.
 */
export const getPublicLessons = async (query = {}) => {
  try {
    const params = new URLSearchParams();
    if (query.category) params.set("category", query.category);
    if (query.tone) params.set("tone", query.tone);
    if (query.keywords) params.set("keywords", query.keywords);
    if (query.sortby) params.set("sortby", query.sortby);

    const queryString = params.toString();
    const url = `${BASE_URL}/api/lessons/public${
      queryString ? `?${queryString}` : ""
    }`;

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
      const error = new Error(data?.message || "Failed to load lessons");
      error.status = response.status;
      error.details = data;
      throw error;
    }

    if (Array.isArray(data)) return data;
    if (Array.isArray(data?.lessons)) return data.lessons;
    return [];
  } catch (error) {
    console.error("getPublicLessons error:", error);
    return [];
  }
};

/**
 * Fetches every lesson authored by the given user. Returns an array
 * (empty on error) using the same shape-tolerant parsing as
 * `getPublicLessons` so callers can iterate without null checks.
 */
export const getLessonsByUserId = async (userId) => {
  if (!userId) return [];

  try {
    const response = await fetch(
      `${BASE_URL}/api/lessons/user/${encodeURIComponent(userId)}`,
      {
        method: "GET",
        credentials: "include",
        cache: "no-store",
      },
    );

    let data = null;
    try {
      data = await response.json();
    } catch {
      // Non-JSON body; treat as empty list.
    }

    if (!response.ok) {
      const error = new Error(data?.message || "Failed to load user lessons");
      error.status = response.status;
      error.details = data;
      throw error;
    }

    if (Array.isArray(data)) return data;
    if (Array.isArray(data?.lessons)) return data.lessons;
    return [];
  } catch (error) {
    console.error("getLessonsByUserId error:", error);
    return [];
  }
};

/**
 * Fetches every lesson the given user has bookmarked. Optional filters:
 *   - category       (must match an ALLOWED_CATEGORIES entry server-side)
 *   - emotionalTone  (must match an ALLOWED_TONES entry server-side)
 *
 * Returns an array (empty on error) using the same shape-tolerant parsing
 * as `getLessonsByUserId` so the table component can iterate without
 * null-checks.
 */
export const getFavoriteLessonsByUserId = async (userId, filters = {}) => {
  if (!userId) return [];

  try {
    const params = new URLSearchParams();
    if (filters.category) params.set("category", filters.category);
    if (filters.emotionalTone) params.set("emotionalTone", filters.emotionalTone);

    const queryString = params.toString();
    const url = `${BASE_URL}/api/lessons/user/${encodeURIComponent(
      userId,
    )}/favorites${queryString ? `?${queryString}` : ""}`;

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
      const error = new Error(
        data?.message || "Failed to load favorite lessons",
      );
      error.status = response.status;
      error.details = data;
      throw error;
    }

    if (Array.isArray(data)) return data;
    if (Array.isArray(data?.lessons)) return data.lessons;
    return [];
  } catch (error) {
    console.error("getFavoriteLessonsByUserId error:", error);
    return [];
  }
};

export const getLessonById = async (id) => {
  try {
    const response = await fetch(`${BASE_URL}/api/lessons/${id}`, {
      method: "GET",
      credentials: "include",
      cache: "no-store",
    });

    let data = null;
    try {
      data = await response.json();
    } catch {
      // Non-JSON body; fall through to the generic error below.
    }

    if (!response.ok) {
      const error = new Error(data?.message || "Failed to load lesson");
      error.status = response.status;
      error.details = data;
      throw error;
    }

    return data?.lesson ?? data;
  } catch (error) {
    console.error("getLessonById error:", error);
    return null;
  }
};
