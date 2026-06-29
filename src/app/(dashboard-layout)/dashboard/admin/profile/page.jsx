import { redirect } from "next/navigation";

import { getUserSessionServer } from "@/lib/actions/userSession";

/**
 * Index route for the admin profile section.
 *
 * The admin `Sidebar` links to the literal `/dashboard/admin/profile`,
 * but the actual profile view lives at
 * `/dashboard/admin/profile/[slug]` (it expects a user id slug to load
 * the right account). Without this page, the literal link 404s.
 *
 * Resolve the signed-in admin's id from the session and forward to
 * the slug route so the existing `AdminProfilePage` renders for the
 * correct user. If there's no session, push them to the auth page so
 * they can sign in instead of getting a confusing 404.
 */
const AdminProfileIndexPage = async () => {
  const session = await getUserSessionServer();
  const userId = session?.user?.id;

  if (!userId) {
    redirect("/auth/login");
  }

  redirect(`/dashboard/admin/profile/${userId}`);
};

export default AdminProfileIndexPage;
