import UserList from "@/components/Admin/UserList";
import { getAllUsers } from "@/lib/api/admin/user";
import React from "react";

const ManageUsersPage = async () => {
  const data = await getAllUsers();

  return (
    <div>
      AdminDashboardPage
      <UserList users={data?.users ?? []} />
    </div>
  );
};

export default ManageUsersPage;
