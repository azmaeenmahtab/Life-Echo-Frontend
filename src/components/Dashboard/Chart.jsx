import React from "react";
import { Card } from "@heroui/react";

export default function WeeklyReflectionChart() {
  // Percentages representing the filled portion of each day's bar
  const data = [
    { day: "Mon", value: 60 },
    { day: "Tue", value: 35 },
    { day: "Wed", value: 85 },
    { day: "Thu", value: 25 },
    { day: "Fri", value: 100 },
    { day: "Sat", value: 70 },
    { day: "Sun", value: 55 },
  ];

  return (
    <Card
      shadow="none"
      className="bg-[#FAF8F3] border border-[#EBE7D9]/60 rounded-[32px] p-6 md:p-8 w-full max-w-3xl"
    >
      {/* Header */}
      <div className="flex justify-between items-start mb-12">
        <div>
          <h3 className="text-2xl font-serif font-bold text-[#1E2E24] mb-1">
            Weekly Reflection
          </h3>
          <p className="text-sm font-sans text-[#707E74]">
            Engagement with personal growth goals
          </p>
        </div>

        {/* Legend */}
        <div className="flex items-center gap-2 mt-2">
          <div className="w-3 h-3 rounded-full bg-[#467856]" />
          <span className="text-xs font-sans font-bold tracking-wider text-[#1E2E24] uppercase">
            Consistency
          </span>
        </div>
      </div>

      {/* Chart Bars Container */}
      <div className="flex justify-between items-end gap-3 md:gap-6 h-48 px-2">
        {data.map((item, index) => (
          <div
            key={index}
            className="flex flex-col items-center flex-1 h-full group"
          >
            {/* The Bar Track */}
            <div className="relative w-full h-full bg-[#D4DEC9]/50 rounded-t-[20px] rounded-b-[20px] overflow-hidden">
              {/* The Active Filled Value Bar */}
              <div
                style={{ height: `${item.value}%` }}
                className="absolute bottom-0 left-0 right-0 bg-[#467856] rounded-t-[20px] rounded-b-[20px] transition-all duration-500 ease-out"
              />
            </div>

            {/* Day Label */}
            <span className="mt-4 text-sm font-sans font-medium text-[#707E74]">
              {item.day}
            </span>
          </div>
        ))}
      </div>
    </Card>
  );
}
