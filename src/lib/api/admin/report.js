/**
 * Admin-facing report helpers.
 *
 * Mirrors the convention used by `comment.js` and `dashboard.js`:
 * - BASE_URL is read from the public env var
 * - credentials are sent so admin session cookies flow through
 * - non-2xx responses throw with the server's `message` attached
 *
 * These endpoints are read-only and meant for the admin dashboard.
 * The server doesn't yet gate them on `role === "admin"` — that
 * is a follow-up, the proxy layer currently lets the admin layout
 * through.
 */

const BASE_URL = process.env.NEXT_PUBLIC_SERVER_URL;

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
 * Returns the full list of reports joined with the lesson title and
 * the reporter's name/email, newest first.
 *
 * Shape: `{ total: number, reports: ReportRow[] }`. Returns the
 * empty defaults on failure so the admin page can render an
 * "empty" state without an extra null check.
 */
export const getAllReports = async () => {
  try {
    const data = await getJson(`${BASE_URL}/api/report`);
    const reports = Array.isArray(data?.reports) ? data.reports : [];
    return { total: Number(data?.total ?? reports.length), reports };
  } catch (error) {
    console.error("getAllReports error:", error);
    return { total: 0, reports: [] };
  }
};

/**
 * Returns just the count of reports. Used by the admin dashboard
 * stat card so it can refresh the badge without re-fetching the
 * full joined list.
 *
 * Returns 0 on failure so the stat card can render a stable
 * skeleton/empty state.
 */
export const getReportedLessonsCount = async () => {
  try {
    const data = await getJson(`${BASE_URL}/api/report/count`);
    return Number(data?.total ?? 0);
  } catch (error) {
    console.error("getReportedLessonsCount error:", error);
    return 0;
  }
};
