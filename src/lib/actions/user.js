import { headers } from "next/headers";
import { revalidatePath } from "next/cache";
import { auth } from "../auth";

/**
 * Server-only helper that flips a user's role via the better-auth
 * admin plugin (`auth.api.setRole`).
 *
 * Server-side authorization:
 *   - `auth.api.setRole` is exposed by the admin plugin and is itself
 *     gated to admins on the server. We don't need to re-check the role
 *     here — the API call will throw if the caller isn't an admin.
 *   - We pass through the session cookies via `headers()` so the auth
 *     layer can identify the caller.
 *
 * Returned shape (matches `auth.api.setRole`):
 *   { success: true } on success, throws on failure (e.g. caller is
 *   not an admin, target user not found, invalid role).
 */
export const changeUserRole = async ({ userId, role }) => {
  if (!userId) throw new Error("changeUserRole: userId is required");
  if (!role) throw new Error("changeUserRole: role is required");

  const data = await auth.api.setRole({
    body: {
      userId,
      role,
    },
    headers: await headers(),
  });

  // Refresh any server-rendered admin tables so the new role shows up
  // immediately without a manual reload.
  try {
    revalidatePath("/dashboard");
    revalidatePath("/dashboard/users");
  } catch (_) {
    // best-effort: revalidation may not be wired everywhere
  }

  return data;
};
