"use server";

import { getJWTTokenServer } from "../jwt/jwtServer";

/**
 * Builds the standard `Authorization: Bearer <jwt>` header object that
 * every protected backend call expects. Throws if no JWT is available
 * (the caller decides whether to short-circuit or surface a toast).
 *
 * Use as:
 *   const headers = await getAuthedHeaders();
 *   await fetch(url, { method: "GET", headers, credentials: "include" });
 */
export async function getAuthedHeaders(extra = {}) {
  const token = await getJWTTokenServer();
  if (!token) {
    throw new Error("No JWT token available for protected request");
  }
  return {
    "Content-Type": "application/json",
    Authorization: `Bearer ${token}`,
    ...extra,
  };
}
