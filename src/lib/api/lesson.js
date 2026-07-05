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
    const url = `${BASE_URL}/api/lessons/public${queryString ? `?${queryString}` : ""
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
 *
 * Optional `query` mirrors the public-list filter shape:
 *   - category   single value, must match a server-allowed slug
 *   - tone       single value, must match a server-allowed tone
 *   - keywords   case-insensitive partial match across title + story
 *   - sortby     "newest" (default) | "mostsaved"
 */
export const getLessonsByUserId = async (userId, query = {}) => {
  if (!userId) return [];

  try {
    const params = new URLSearchParams();
    if (query.category) params.set("category", query.category);
    if (query.tone) params.set("tone", query.tone);
    if (query.keywords) params.set("keywords", query.keywords);
    if (query.sortby) params.set("sortby", query.sortby);

    const queryString = params.toString();
    const url = `${BASE_URL}/api/lessons/user/${encodeURIComponent(userId)}${queryString ? `?${queryString}` : ""
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
 * Fetches lessons authored in the last 24 hours, used by the
 * "Today's new lessons" card on /dashboard/admin.
 *
 * Returns `{ total, lessons }` where:
 *   - total:   number   — count of lessons created in the last 24h
 *   - lessons: array    — most recent `limit` of them
 */
export const getTodaysLessons = async ({ limit = 5 } = {}) => {
  try {
    const response = await fetch(
      `${BASE_URL}/api/dashboard/today-lessons?limit=${encodeURIComponent(limit)}`,
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
      // Non-JSON body; fall through to the error branch below.
    }

    if (!response.ok) {
      const error = new Error(
        data?.message || `Request failed (${response.status})`,
      );
      error.status = response.status;
      error.details = data;
      throw error;
    }

    const lessons = Array.isArray(data?.lessons) ? data.lessons : [];
    return {
      total: Number(data?.total ?? lessons.length),
      lessons,
    };
  } catch (error) {
    console.error("getTodaysLessons error:", error);
    return { total: 0, lessons: [] };
  }
};

/**
 * Fetches the cumulative lesson count bucketed by day, used by the
 * "Lesson growth" line chart on /dashboard/admin.
 *
 * Returns `{ total, windowDays, series }` where `series` is:
 *   Array<{ date: ISO string, count: number, cumulative: number }>
 */
export const getLessonGrowth = async ({ days = 30 } = {}) => {
  try {
    const response = await fetch(
      `${BASE_URL}/api/dashboard/lesson-growth?days=${encodeURIComponent(days)}`,
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
      // Non-JSON body; fall through to the error branch below.
    }

    if (!response.ok) {
      const error = new Error(
        data?.message || `Request failed (${response.status})`,
      );
      error.status = response.status;
      error.details = data;
      throw error;
    }

    const series = Array.isArray(data?.series) ? data.series : [];
    return {
      total: Number(data?.total ?? 0),
      windowDays: Number(data?.windowDays ?? days),
      series,
    };
  } catch (error) {
    console.error("getLessonGrowth error:", error);
    return { total: 0, windowDays: days, series: [] };
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
    if (filters.emotionalTone)
      params.set("emotionalTone", filters.emotionalTone);

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

/**
 * Fetches the lessons an admin has marked with `isFeatured: true`,
 * used by the home "Featured Lessons" section.
 *
 * Returns the parsed lesson array (empty on error) so the section can
 * render its empty state without a null check.
 */
export const getFeaturedLessons = async ({ limit } = {}) => {
  try {
    const params = new URLSearchParams();
    params.set("featured", "true");
    params.set("sortby", "newest");
    if (limit) params.set("limit", String(limit));

    const response = await fetch(
      `${BASE_URL}/api/lessons/public?${params.toString()}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
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
      const error = new Error(
        data?.message || "Failed to load featured lessons",
      );
      error.status = response.status;
      error.details = data;
      throw error;
    }

    if (Array.isArray(data)) return data;
    if (Array.isArray(data?.lessons)) return data.lessons;
    return [];
  } catch (error) {
    console.error("getFeaturedLessons error:", error);
    return [];
  }
};
