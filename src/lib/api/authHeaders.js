"use server";

import { cookies } from "next/headers";

/**
 * Build the headers object the backend expects on protected routes.
 *
 * The backend `verifyJWT` middleware accepts either a Bearer token OR a
 * forwarded BetterAuth session cookie. BetterAuth's session payload does
 * not expose a JWT, so the canonical way for a Next.js server component
 * to talk to the API is to forward the cookie.
 *
 * Returns a plain object suitable for spreading into `fetch({ headers })`.
 */
export async function getAuthHeaders(extra = {}) {
  const headers = {
    "Content-Type": "application/json",
    ...extra,
  };

  try {
    const cookieStore = await cookies();
    const sessionToken = cookieStore.get("better-auth.session_token")?.value;
    if (sessionToken) {
      headers.Cookie = `better-auth.session_token=${sessionToken}`;
    }
  } catch {
    // `cookies()` is only available in server components / server actions.
    // On the client side, the browser will send the cookie automatically
    // when `credentials: "include"` is used.
  }

  return headers;
}
