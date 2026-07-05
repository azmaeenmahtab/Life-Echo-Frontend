/**
 * Frontend API helpers for the "community showcase" sections on
 * the home page (Top Contributors of the Week + Community
 * Favorites / Most Saved Lessons).
 *
 * Both endpoints live under `/api/dashboard/...` and are wrapped
 * with `verifyJWT` on the backend, so each fetch must forward the
 * BetterAuth session cookie. Because the only consumers are server
 * components (`TopContributors.jsx`, `CommunityFavorites.jsx`), it's
 * safe to import `getAuthHeaders()` from `next/headers` here — this
 * file is never bundled to the client.
 *
 * Both fetchers fail-safe: a network or server error returns an
 * empty array so the server component can short-circuit ("render
 * nothing") instead of an error state.
 */

import { getJWTTokenServer } from "@/lib/jwt/jwtServer";
// import { getJWTClient } from "@/lib/jwt/jwt";
const BASE_URL = process.env.NEXT_PUBLIC_SERVER_URL;



/**
 * Fetches the users who authored the most lessons in the last
 * `days` days (default 7 — matches the "Top Contributors of the
 * Week" label).
 *
 * Response shape (per row):
 *   {
 *     userId:       string,
 *     name:         string | null,
 *     email:        string | null,
 *     image:        string | null,
 *     role:         "user" | "admin",
 *     title:        string | null,
 *     lessonsCount: number,
 *   }
 *
 * Returns `[]` on failure so the section can short-circuit.
 */
export const getTopWeeklyContributors = async ({
  days = 7,
  limit = 3,
} = {}) => {
  try {
    const params = new URLSearchParams({
      days: String(days),
      limit: String(limit),
    });
    const token = await getJWTTokenServer();
    if (!token) {
      throw new Error("No JWT token available for protected request");
    }
 
    const response = await fetch(
      `${BASE_URL}/api/dashboard/top-weekly-contributors?${params.toString()}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        credentials: "include",
        cache: "no-store",
      },
    );

    let data = null;
    try {
      data = await response.json();
    } catch {
      // Non-JSON body, fall through to error handling below.
    }

    if (!response.ok) {
      const error = new Error(
        data?.message || `Request failed (${response.status})`,
      );
      error.status = response.status;
      error.details = data;
      throw error;
    }

    return Array.isArray(data?.contributors) ? data.contributors : [];
  } catch (error) {
    console.error("getTopWeeklyContributors error:", error);
    return [];
  }
};

/**
 * Fetches the lessons with the highest `savesCount` (default limit
 * 3 — matches the "Community Favorites" panel).
 *
 * Response shape (per row):
 *   {
 *     lessonId:      string,
 *     title:         string,
 *     imageUrl:      string | null,
 *     savesCount:    number,
 *     likesCount:    number,
 *     category:      string,
 *     creatorName:   string | null,
 *     creatorImage:  string | null,
 *   }
 *
 * Returns `[]` on failure.
 */
export const getMostSavedLessons = async ({ limit = 3 } = {}) => {
  try {
    const token = await getJWTTokenServer();
    if (!token) {
      throw new Error("No JWT token available for protected request");
    }
 
    const response = await fetch(
      `${BASE_URL}/api/dashboard/most-saved-lessons?limit=${encodeURIComponent(limit)}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        credentials: "include",
        cache: "no-store",
      },
    );

    let data = null;
    try {
      data = await response.json();
    } catch {
      // Non-JSON body, fall through to error handling below.
    }

    if (!response.ok) {
      const error = new Error(
        data?.message || `Request failed (${response.status})`,
      );
      error.status = response.status;
      error.details = data;
      throw error;
    }

    return Array.isArray(data?.lessons) ? data.lessons : [];
  } catch (error) {
    console.error("getMostSavedLessons error:", error);
    return [];
  }
};
