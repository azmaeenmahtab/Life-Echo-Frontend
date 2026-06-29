import UserList from "@/components/Admin/UserList";
import { getAllUsers } from "@/lib/api/admin/user";
import { headers } from "next/headers";
import { auth } from "@/lib/auth";
import React from "react";

const ManageUsersPage = async () => {
  const data = await getAllUsers();

  // Identify the logged-in admin so the row can mark `isSelf` and
  // surface a confirmation modal before a self-demote.
  let currentUserId = null;
  try {
    const session = await auth.api.getSession({ headers: await headers() });
    currentUserId = session?.user?.id ?? null;
  } catch (_) {
    currentUserId = null;
  }

  return (
    <div>
      AdminDashboardPage
      <UserList users={data?.users ?? []} currentUserId={currentUserId} />
    </div>
  );
};

export default ManageUsersPage;
