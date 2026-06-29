import { headers } from "next/headers";
import { revalidatePath } from "next/cache";
import { auth } from "@/lib/auth";

/**
 * PATCH /api/admin/users/role
 *   body: { userId: string, role: "user" | "admin" }
 *
 * Forwards to better-auth's admin plugin (`auth.api.setRole`) which
 * already enforces admin-only access server-side. Returns the plugin
 * response as JSON, or `{ error }` on failure.
 */
export async function PATCH(request) {
  let body;
  try {
    body = await request.json();
  } catch (_) {
    return Response.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  const { userId, role } = body || {};
  if (!userId || !role) {
    return Response.json(
      { error: "userId and role are required" },
      { status: 400 },
    );
  }

  try {
    const data = await auth.api.setRole({
      body: { userId, role },
      headers: await headers(),
    });

    // Best-effort: refresh any server-rendered admin tables.
    try {
      revalidatePath("/dashboard");
      revalidatePath("/dashboard/users");
    } catch (_) {
      // revalidation may not always apply
    }

    return Response.json({ success: true, data });
  } catch (error) {
    console.error("PATCH /api/admin/users/role failed:", error);
    return Response.json(
      { error: error?.message || "Failed to update role" },
      { status: 500 },
    );
  }
}
