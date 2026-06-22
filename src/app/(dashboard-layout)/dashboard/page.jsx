import WeeklyReflectionChart from "@/components/Dashboard/Chart";
import DashboardStats from "@/components/Dashboard/Stat";
import React from "react";

const DashboardPage = () => {
  return (
    <div>
      <DashboardStats />
      <WeeklyReflectionChart />
    </div>
  );
};

export default DashboardPage;
