import { auth } from "@/lib/auth";
import { headers } from "next/headers";

const BASE_URL = process.env.NEXT_PUBLIC_SERVER_URL;

export const getAllUsers = async () => {
  const users = await auth.api.listUsers({
    query: {
      sortBy: "createdAt",
      sortDirection: "desc",
    },
    // This endpoint requires session cookies.
    headers: await headers(),
  });

  return users;
};

/**
 * Returns the top contributors ranked by lessons authored.
 *
 * Shape: `{ total: number, contributors: ContributorRow[] }`.
 * Each row:
 *   {
 *     userId:       string,
 *     name:         string | null,
 *     email:        string | null,
 *     image:        string | null,
 *     role:         "user" | "admin",
 *     lessonsCount: number,
 *   }
 *
 * Returns empty defaults on failure so the dashboard card can
 * render its "no contributors" state without a null check.
 */
export const getTopContributors = async ({ limit = 5 } = {}) => {
  try {
    const response = await fetch(
      `${BASE_URL}/api/dashboard/top-contributors?limit=${encodeURIComponent(limit)}`,
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
      // Non-JSON body, fall through to the error branch below.
    }

    if (!response.ok) {
      const error = new Error(
        data?.message || `Request failed (${response.status})`,
      );
      error.status = response.status;
      error.details = data;
      throw error;
    }

    const contributors = Array.isArray(data?.contributors)
      ? data.contributors
      : [];
    return {
      total: Number(data?.total ?? contributors.length),
      contributors,
    };
  } catch (error) {
    console.error("getTopContributors error:", error);
    return { total: 0, contributors: [] };
  }
};

/**
 * Fetches the cumulative user signup count bucketed by day, used by
 * the "User growth" line chart on /dashboard/admin.
 *
 * Returns `{ total, windowDays, series }` where `series` is:
 *   Array<{ date: ISO string, count: number, cumulative: number }>
 *
 * `total` is the lifetime user count (not the count over the window)
 * so the headline number on the card stays stable as the window
 * slides.
 *
 * Falls back to an empty series on any error so the chart can render
 * its empty state without a null check.
 */
export const getUserGrowth = async ({ days = 30 } = {}) => {
  try {
    const response = await fetch(
      `${BASE_URL}/api/dashboard/user-growth?days=${encodeURIComponent(days)}`,
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
    console.error("getUserGrowth error:", error);
    return { total: 0, windowDays: days, series: [] };
  }
};
