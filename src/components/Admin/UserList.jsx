import React from "react";
import RoleSelector from "./RoleSelector";

const UserList = async ({ users, currentUserId }) => {
  const list = Array.isArray(users) ? users : [];

  if (list.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-16 px-6 rounded-2xl border border-dashed border-[#EBE7D9] bg-[#FAF8F3] text-center">
        <p className="font-serif font-bold text-lg text-[#1E2E24]">
          No users yet
        </p>
        <p className="text-sm text-[#556359] mt-1">
          New signups will appear here once they create an account.
        </p>
      </div>
    );
  }

  return (
    <div className="bg-white border border-[#eae6df] rounded-3xl shadow-sm overflow-hidden">
      <div className="overflow-x-auto">
        <table className="min-w-full text-left text-sm">
          <thead className="bg-[#FAF8F3] text-[10px] uppercase tracking-wider text-[#556359] font-bold border-b border-[#EBE7D9]">
            <tr>
              <th className="px-5 py-3 whitespace-nowrap">User</th>
              <th className="px-5 py-3 whitespace-nowrap">Email</th>
              <th className="px-5 py-3 whitespace-nowrap">Role</th>
              <th className="px-5 py-3 whitespace-nowrap">Plan</th>
              <th className="px-5 py-3 whitespace-nowrap">Verified</th>
              <th className="px-5 py-3 whitespace-nowrap">Joined</th>
            </tr>
          </thead>
          <tbody>
            {list.map((user) => {
              const isAdmin = user.role === "admin";
              const isPremium =
                user.plan === "premium" ||
                user.plan === "pro" ||
                user.plan === "Pro";

              return (
                <tr
                  key={user.id ?? user._id ?? user.email}
                  className="border-b border-[#EBE7D9]/60 last:border-0 hover:bg-[#FAF8F3]/60 transition-colors"
                >
                  {/* User (avatar + name) */}
                  <td className="px-5 py-3 whitespace-nowrap">
                    <div className="flex items-center gap-3">
                      <span className="w-9 h-9 rounded-full overflow-hidden bg-[#1c2f24] text-[#e2f2e9] flex items-center justify-center font-serif font-bold text-sm shrink-0 border border-[#eae6df]">
                        {user.image ? (
                          // eslint-disable-next-line @next/next/no-img-element
                          <img
                            src={user.image}
                            alt={user.name || "User avatar"}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          (user.name || user.email || "?")
                            .charAt(0)
                            .toUpperCase()
                        )}
                      </span>
                      <span className="font-semibold text-[#1E2E24] truncate max-w-[12rem]">
                        {user.name || "Unnamed"}
                      </span>
                    </div>
                  </td>

                  {/* Email */}
                  <td className="px-5 py-3 text-[#556359] truncate max-w-[18rem]">
                    {user.email || "—"}
                  </td>

                  {/* Role */}
                  <td className="px-5 py-3">
                    <RoleSelector
                      userId={user.id ?? user._id}
                      role={user.role || "user"}
                      isSelf={Boolean(
                        currentUserId &&
                          (user.id === currentUserId ||
                            user._id === currentUserId)
                      )}
                    />
                  </td>

                  {/* Plan */}
                  <td className="px-5 py-3">
                    <span
                      className={
                        "inline-flex items-center px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider border " +
                        (isPremium
                          ? "bg-[#f5e9d4] text-[#a17236] border-[#e8d6b4]"
                          : "bg-white text-[#556359] border-[#EBE7D9]")
                      }
                    >
                      {user.plan || "free"}
                    </span>
                  </td>

                  {/* Email verified */}
                  <td className="px-5 py-3">
                    {user.emailVerified ? (
                      <span className="inline-flex items-center px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider border bg-[#e2f2e9] text-[#2e7d32] border-[#cfe5d3]">
                        Verified
                      </span>
                    ) : (
                      <span className="inline-flex items-center px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider border bg-white text-[#556359] border-[#EBE7D9]">
                        Pending
                      </span>
                    )}
                  </td>

                  {/* Joined */}
                  <td className="px-5 py-3 text-[#556359] whitespace-nowrap">
                    {formatJoined(user.createdAt)}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};

function formatJoined(value) {
  if (!value) return "—";
  const date = value instanceof Date ? value : new Date(value);
  if (Number.isNaN(date.getTime())) return "—";
  return date.toLocaleDateString(undefined, {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

export default UserList;
