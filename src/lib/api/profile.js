import { getUserSessionServer } from "../actions/userSession";
import { cookies } from "next/headers";

const BASE_URL = process.env.NEXT_PUBLIC_SERVER_URL;

/**
 * Fetches the creator profile bundle (user info + lessons + totals) for a
 * given user id / slug. Throws on network or non-OK responses so the caller
 * can render an error state.
 */
export const getProfileBySlug = async (slug) => {
  if (!slug) {
    throw new Error("Profile slug is required");
  }

  const url = `${BASE_URL}/api/profile/${encodeURIComponent(slug)}`;

  const session = await getUserSessionServer();
  console.log("session ", session);

  try {
    const headers = { "Content-Type": "application/json" };

    // BetterAuth stores the session in an httpOnly cookie. Read it server-side
    // and forward it to the backend so verifyJWT can call auth.api.getSession.
    const cookieStore = await cookies();
    const sessionCookie = cookieStore.get("better-auth.session_token")?.value;
    if (sessionCookie) {
      headers.Cookie = `better-auth.session_token=${sessionCookie}`;
    }
    if (session?.user?.id) {
      headers["x-user-id"] = session.user.id;
    }

    const response = await fetch(url, {
      method: "GET",
      headers,
      cache: "no-store",
    });

    const data = await response.json().catch(() => ({}));

    if (!response.ok) {
      throw new Error(
        data?.message || `Failed to load profile (${response.status})`,
      );
    }

    return {
      user: data.user ?? null,
      lessons: Array.isArray(data.lessons) ? data.lessons : [],
      lessonsCount: data.lessonsCount ?? 0,
      totalSaves: data.totalSaves ?? 0,
      totalLikes: data.totalLikes ?? 0,
      totalViews: data.totalViews ?? 0,
      totals: data.totals ?? null,
      message: data.message,
    };
  } catch (error) {
    console.error("getProfileBySlug error:", error);
    throw error;
  }
};
