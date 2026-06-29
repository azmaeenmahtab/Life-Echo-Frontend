import React from "react";
import { Card } from "@heroui/react";
import { BookOpen, Leaf, Users } from "lucide-react";

const features = [
  {
    icon: BookOpen,
    title: "Preserve Wisdom",
    description:
      "Ensure your hardest-earned insights aren't lost to time, but structured for longevity.",
  },
  {
    icon: Leaf,
    title: "Mindful Reflection",
    description:
      "The act of writing is the act of healing. Reflect deeply on your daily experiences.",
  },
  {
    icon: Users,
    title: "Community Growth",
    description:
      "Learn from a global collective of mentors who share their real-world experiences.",
  },
  {
    icon: Leaf,
    title: "Personal Legacy",
    description:
      "Leave behind more than just memories; leave a roadmap for those who follow you.",
  },
];

export default function WhyItMatters() {
  return (
    <section className="py-12 sm:py-16 px-4 max-w-7xl mx-auto flex flex-col items-center">
      {/* Header Section */}
      <div className="text-center mb-10 sm:mb-12">
        <h2 className="text-2xl sm:text-3xl md:text-4xl font-serif font-bold text-[#2C5E3B] mb-3">
          Why Learning From Life Matters
        </h2>
        <div className="w-24 h-[3px] bg-[#8B7355] mx-auto rounded-full" />
      </div>

      {/* Grid Layout */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 sm:gap-6 w-full">
        {features.map((feature, index) => {
          const Icon = feature.icon;
          return (
            <Card
              key={index}
              shadow="none"
              className="bg-[#F7F5F0] border-none rounded-2xl transition-transform duration-300 hover:-translate-y-1"
            >
              {/* Clean div container replacing CardBody */}
              <div className="flex flex-col items-start gap-4 p-5 sm:p-6">
                {/* Icon Wrapper */}
                <div className="text-[#2C5E3B]">
                  <Icon size={28} strokeWidth={1.75} />
                </div>

                {/* Content */}
                <div className="space-y-2">
                  <h3 className="text-lg sm:text-xl font-bold font-serif text-[#1C1C1C]">
                    {feature.title}
                  </h3>
                  <p className="text-sm text-[#555555] leading-relaxed font-sans">
                    {feature.description}
                  </p>
                </div>
              </div>
            </Card>
          );
        })}
      </div>
    </section>
  );
}
