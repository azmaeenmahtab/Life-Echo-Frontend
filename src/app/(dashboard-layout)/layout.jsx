import DashboardNavbar from "@/components/Dashboard/DashboardNavbar";
import { Sidebar } from "@/components/Dashboard/Sidebar";
import React from "react";

const DashboardLayout = ({ children }) => {
  return (
    <div className="min-h-screen bg-[#F5F2EB]">
      <div className="mx-auto flex w-full max-w-380 gap-6 py-5 px-4 md:px-8">
        {/* Persistent desktop sidebar / mobile drawer trigger */}
        <Sidebar />

        {/* Main column */}
        <main className="flex min-w-0 flex-1 flex-col">
          <DashboardNavbar />
          <div className="flex-1">{children}</div>
        </main>
      </div>
      {/* footer */}
    </div>
  );
};

export default DashboardLayout;
