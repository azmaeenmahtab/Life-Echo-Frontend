/**
 * Frontend API client for the dashboard endpoints.
 *
 * Mirrors the convention used by `lesson.js` and `profile.js`:
 * BASE_URL is read from the public env var, credentials are sent
 * for better-auth session cookies, non-2xx responses throw with the
 * server's `message` attached.
 *
 * Both helpers tolerate a missing `userId` by returning sensible
 * empty defaults — that lets the dashboard mount before auth has
 * resolved and render the skeleton cleanly.
 */

 
const BASE_URL = process.env.NEXT_PUBLIC_SERVER_URL;

const buildUrl = (path, params = {}) => {
  const query = new URLSearchParams();
  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== "") {
      query.set(key, String(value));
    }
  });
  const qs = query.toString();
  return `${BASE_URL}${path}${qs ? `?${qs}` : ""}`;
};

const getJson = async (url) => {
   const response = await fetch(url, {
    method: "GET",

    credentials: "include",
    cache: "no-store",
  });

  let data = null;
  try {
    data = await response.json();
  } catch {
    // Non-JSON body, fall through to the generic error below.
  }

  if (!response.ok) {
    const error = new Error(
      data?.message || `Request failed (${response.status})`,
    );
    error.status = response.status;
    error.details = data;
    throw error;
  }

  return data;
};

/**
 * Fetches the three top-of-dashboard stat cards.
 *
 * `userId` is required — pass the logged-in user's id. `windowDays`
 * defaults to 30 to match the backend default.
 *
 * Returns null on failure so the dashboard can render a "couldn't
 * load stats" state without throwing.
 */
export const getDashboardStats = async (userId, { windowDays = 30 } = {}) => {
  if (!userId) return null;

  try {
    const data = await getJson(
      buildUrl("/api/dashboard/stats", { userId, windowDays }),
    );
    return {
      totalLessons: Number(data?.totalLessons ?? 0),
      totalSaves: Number(data?.totalSaves ?? 0),
      recentlyAdded: Number(data?.recentlyAdded ?? 0),
      lastAddedAt: data?.lastAddedAt ?? null,
      hasRecentActivity: Boolean(data?.hasRecentActivity),
      recentActivityWindowDays:
        Number(data?.recentActivityWindowDays ?? windowDays) || windowDays,
    };
  } catch (error) {
    console.error("getDashboardStats error:", error);
    return null;
  }
};

/**
 * Fetches the five totals rendered by the activity chart.
 *
 * Pass `days` to scope the counts to a rolling window (e.g. 7 for
 * "this week"). Omit it (or pass null) for all-time totals, which
 * is what the current chart wants.
 */
export const getDashboardActivity = async (userId, { days = null } = {}) => {
  if (!userId) return null;

  try {
    const data = await getJson(
      buildUrl("/api/dashboard/activity", { userId, days }),
    );
    const totals = data?.totals ?? {};
    return {
      totals: {
        saves: Number(totals.saves ?? 0),
        comments: Number(totals.comments ?? 0),
        likes: Number(totals.likes ?? 0),
        reports: Number(totals.reports ?? 0),
        lessonsPosted: Number(totals.lessonsPosted ?? 0),
      },
      range: data?.range ?? null,
    };
  } catch (error) {
    console.error("getDashboardActivity error:", error);
    return null;
  }
};
