"use client";

import DashboardNavbar from "@/components/Dashboard/DashboardNavbar";
import { Sidebar } from "@/components/Dashboard/Sidebar";
import React, { createContext, useContext } from "react";
import { authClient } from "@/lib/auth-client";

/**
 * Single source of truth for the Better-Auth session inside the dashboard.
 * Children can either receive the raw `session`/`isPending` props or read the
 * shared values from `DashboardSessionContext` without re-fetching.
 */
const DashboardSessionContext = createContext({
  session: null,
  isPending: true,
  error: null,
});

export const useDashboardSession = () => useContext(DashboardSessionContext);

const DashboardLayout = ({ children }) => {
  // Fetch the session exactly once for the whole dashboard tree.
  const { data: session, isPending, error } = authClient.useSession();

  return (
    <DashboardSessionContext.Provider value={{ session, isPending, error }}>
      <div className="min-h-screen bg-[#F5F2EB]">
        <div className="mx-auto flex w-full max-w-380 gap-6 py-5 px-4 md:px-8">
          {/* Persistent desktop sidebar / mobile drawer trigger */}
          <Sidebar />

          {/* Main column */}
          <main className="flex min-w-0 flex-1 flex-col">
            <DashboardNavbar session={session} isPending={isPending} />
            <div className="flex-1">{children}</div>
          </main>
        </div>
        {/* footer */}
      </div>
    </DashboardSessionContext.Provider>
  );
};

export default DashboardLayout;
