import React from "react";
import { Card, Chip, Button } from "@heroui/react";
import { BookOpen, Bookmark, History, ArrowRight } from "lucide-react";

export default function DashboardStats() {
  const stats = [
    {
      title: "TOTAL LESSONS",
      value: "42",
      icon: BookOpen,
      badge: { text: "+12%", color: "bg-[#E2F0E7] text-[#467856]" },
    },
    {
      title: "TOTAL SAVED",
      value: "128",
      icon: Bookmark,
      badge: { text: "+3", color: "bg-[#F2EFE6] text-[#8B7355]" },
    },
    {
      title: "RECENTLY ADDED",
      value: "3",
      icon: History,
      badge: { text: "YESTERDAY", color: "bg-[#EBE7D9] text-[#707E74]" },
    },
  ];

  return (
    <section className="w-full max-w-7xl mx-auto px-4 pb-6 pt-4">
      {/* 4-Column Grid: 3 Stat Cards + 1 Primary CTA Card */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 w-full">
        {/* Dynamic Stat Cards */}
        {stats.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <Card
              key={index}
              shadow="none"
              className="bg-[#FAF8F3] border border-[#EBE7D9]/60 rounded-[24px] p-6 flex flex-col justify-between min-h-[180px]"
            >
              <div>
                {/* Card Top: Icon and Badge Status */}
                <div className="flex justify-between items-start w-full mb-6">
                  <div className="w-12 h-12 rounded-full bg-[#F2EFE6] flex items-center justify-center text-[#467856]">
                    <Icon size={22} strokeWidth={1.75} />
                  </div>
                  <Chip
                    size="sm"
                    variant="flat"
                    className={`${stat.badge.color} font-sans font-bold text-[10px] tracking-wider px-2 border-none`}
                  >
                    {stat.badge.text}
                  </Chip>
                </div>

                {/* Card Bottom: Metadata Label & Large Figure */}
                <p className="text-[11px] font-sans font-bold tracking-widest text-[#707E74] uppercase mb-1">
                  {stat.title}
                </p>
              </div>
              <h3 className="text-4xl font-serif font-bold text-[#1E2E24] leading-none">
                {stat.value}
              </h3>
            </Card>
          );
        })}

        {/* Action Link Banner Card (Green Container) */}
        <Card
          shadow="none"
          className="bg-[#467856] text-white rounded-[24px] p-6 flex flex-col justify-between min-h-[180px] transition-transform duration-300 hover:-translate-y-1"
        >
          {/* Headline Display */}
          <h3 className="text-2xl font-sans font-bold leading-tight max-w-[200px] mt-2">
            Ready to reflect on today?
          </h3>

          {/* Trigger Button Link */}
          <Button
            as="a"
            href="/lessons/new" // Target path for creating entry setups later
            variant="light"
            className="w-full justify-between items-center p-0 bg-transparent text-white hover:bg-transparent min-w-0 font-sans font-semibold text-base group"
            endContent={
              <ArrowRight
                size={20}
                className="transition-transform duration-200 group-hover:translate-x-1"
              />
            }
          >
            Add New Lesson
          </Button>
        </Card>
      </div>
    </section>
  );
}
