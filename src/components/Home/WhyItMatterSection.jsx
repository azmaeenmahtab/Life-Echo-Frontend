import React from 'react';
import { Card, CardBody } from '@heroui/react'; 
import { BookOpen, Sprout, Users, Feather } from 'lucide-react';

export default function WhyItMatters() {
  const items = [
    {
      icon: <BookOpen className="w-6 h-6 text-[#2D5A3B]" />,
      title: "Preserve Wisdom",
      description: "Ensure your hardest-earned insights aren't lost to time, but structured for longevity."
    },
    {
      icon: <Sprout className="w-6 h-6 text-[#2D5A3B]" />, // Represents Mindful/Zen Reflection
      title: "Mindful Reflection",
      description: "The act of writing is the act of healing. Reflect deeply on your daily experiences."
    },
    {
      icon: <Users className="w-6 h-6 text-[#2D5A3B]" />,
      title: "Community Growth",
      description: "Learn from a global collective of mentors who share their real-world experiences."
    },
    {
      icon: <Feather className="w-6 h-6 text-[#2D5A3B]" />, // Quill/Feather for Personal Legacy
      title: "Personal Legacy",
      description: "Leave behind more than just memories; leave a roadmap for those who follow you."
    }
  ];

  return (
    <section className="bg-[#F6F4EB] py-16 px-6 sm:px-8 flex flex-col items-center">
      {/* Section Header */}
      <div className="text-center mb-12 flex flex-col items-center">
        <h2 className="text-3xl md:text-4xl font-serif font-bold text-[#2D5A3B] tracking-tight mb-3">
          Why Learning From Life Matters
        </h2>
        {/* Visual Underline Separator from Capture.PNG */}
        <div className="w-16 h-1 bg-[#8C6D3E] rounded-full mt-1"></div>
      </div>

      {/* Features Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl w-full">
        {items.map((item, index) => (
          <Card 
            key={index} 
            className="bg-[#FAF8F0]/80 border border-[#EBE7D9]/60 shadow-none p-5 rounded-2xl hover:bg-[#FAF8F0] transition-colors"
          >
            <CardBody className="p-0 flex flex-col items-start text-left">
              {/* Icon Wrapper */}
              <div className="mb-4 p-1">
                {item.icon}
              </div>
              
              {/* Feature Title (Serif) */}
              <h3 className="font-serif font-bold text-lg text-[#1E2E24] mb-2">
                {item.title}
              </h3>
              
              {/* Feature Description (Sans / Poppins) */}
              <p className="font-sans text-sm text-[#506055] leading-relaxed">
                {item.description}
              </p>
            </CardBody>
          </Card>
        ))}
      </div>
    </section>
  );
}