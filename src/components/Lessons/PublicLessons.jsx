"use client";

import React from "react";
import { Card, Button } from "@heroui/react";
import { Lock, ArrowUpRight } from "lucide-react";
import Link from "next/link"; // Or use "react-router-dom" depending on your framework
import { authClient } from "@/lib/auth-client";

export default function PublicLessons({ lessonsData }) {
  // Read the current session so premium gating reflects the real user plan
  // rather than a hardcoded stub. Falls back to "free" while the session
  // is resolving or for guests.

  console.log("lessons :", lessonsData);
  const { data: session } = authClient.useSession();
  const currentPlan = session?.user?.plan ?? "free";
  const isCurrentPremium = currentPlan === "premium" || currentPlan === "pro";

  // Defensive: tolerate undefined/missing props so the page never crashes
  // when data hasn't been resolved yet (e.g. slow fetches or RSC fallback).
  const safeLessons = Array.isArray(lessonsData) ? lessonsData : [];

  // Tolerant date parser: the backend may hand us a Date instance, an ISO
  // string, a timestamp number, or the Mongo extended-JSON shape ({ $date }).
  // We unwrap and validate so an unexpected shape never surfaces "Invalid Date".
  const parseLessonDate = (value) => {
    if (!value) return null;
    if (value instanceof Date)
      return Number.isNaN(value.getTime()) ? null : value;
    if (typeof value === "string" || typeof value === "number") {
      const d = new Date(value);
      return Number.isNaN(d.getTime()) ? null : d;
    }
    if (typeof value === "object") {
      const inner = value.$date ?? value.createdAt ?? null;
      if (!inner) return null;
      const d = new Date(inner);
      return Number.isNaN(d.getTime()) ? null : d;
    }
    return null;
  };

  const formatDate = (dateStr) => {
    const d = parseLessonDate(dateStr);
    if (!d) return "—";
    return d.toLocaleDateString("en-US", {
      month: "short",
      day: "2-digit",
      year: "numeric",
    });
  };

  return (
    <div className="min-h-screen bg-[#F5F2EB] py-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Header Section */}
        <header className="text-center mb-16 space-y-3">
          <h1 className="text-4xl font-serif font-bold text-[#1E2E24] tracking-tight relative inline-block pb-3">
            Why Learning From Life Matters
            <span className="absolute bottom-0 left-1/4 right-1/4 h-[3px] bg-[#8B7E66] rounded-full"></span>
          </h1>
          <p className="text-base font-sans text-[#556359] max-w-xl mx-auto pt-1">
            Browse publicly shared wisdom from our global collective of growing
            minds.
          </p>
        </header>

        {/* 3-Column Content Layout Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {safeLessons.map((lesson) => {
            const isLocked =
              lesson.accessLevel === "premium" && !isCurrentPremium;

            // Creator info comes exclusively from the backend `$lookup` join.
            const creatorName = lesson.creatorName;
            const creatorAvatar = lesson.creatorProfilePic;

            // Safe extraction of the hex string ID from Mongo object metadata
            const lessonId = lesson._id;
            console.log("lesson ", lesson);
            console.log(isCurrentPremium);

            return (
              <Card
                key={lessonId}
                shadow="none"
                className="bg-[#FAF8F3] border border-[#EBE7D9] rounded-[24px] p-6 relative flex flex-col justify-between min-h-[290px] overflow-hidden transition-all duration-300 hover:shadow-md group"
              >
                {/* Premium Blurred Blocking Layer */}
                {isLocked && (
                  <div className="absolute inset-0 bg-[#FAF8F3]/60 backdrop-blur-[14px] z-20 flex flex-col items-center justify-center p-6 text-center animate-in fade-in duration-300">
                    <div className="w-12 h-12 rounded-full bg-[#FAF8F3] border border-[#EBE7D9] flex items-center justify-center text-[#8C6D3D] shadow-sm mb-3">
                      <Lock size={18} />
                    </div>
                    <h3 className="text-lg font-serif font-bold text-[#1E2E24] mb-1">
                      Exclusive Wisdom
                    </h3>
                    <p className="text-xs font-sans text-[#707E74] mb-5 max-w-[200px]">
                      This lesson is part of our Premium Collection.
                    </p>
                    <Button className="bg-[#467856] hover:bg-[#386145] text-white font-sans font-semibold text-xs px-5 py-4 h-9 rounded-xl shadow-sm transition-all active:scale-95">
                      Upgrade to view
                    </Button>
                  </div>
                )}

                {/* Card Main Body Content Wrapper */}
                <div
                  className={
                    isLocked
                      ? "select-none blur-[1px] opacity-40 pointer-events-none"
                      : ""
                  }
                >
                  {/* Top Row Indicators */}
                  <div className="flex items-center justify-between mb-4">
                    <span className="bg-[#FFF4E0] text-[#A0702A] text-[11px] font-sans font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full border border-[#F2E4CC]">
                      {lesson.accessLevel}
                    </span>
                    <span className="text-xs font-sans text-[#A0AEA4] font-medium">
                      {formatDate(lesson.createdAt)}
                    </span>
                  </div>

                  {/* Title Link Override */}
                  <Link href={`/lessons/details?id=${lessonId}`}>
                    <h2 className="text-xl font-serif font-bold text-[#1E2E24] line-clamp-1 mb-2 tracking-tight hover:text-[#467856] transition-colors cursor-pointer">
                      {lesson.title}
                    </h2>
                  </Link>

                  {/* Body Copy Text Snippet Preview */}
                  <p className="text-sm font-sans text-[#556359] leading-relaxed line-clamp-3 mb-6">
                    {lesson.story}
                  </p>

                  {/* Thematic Meta Tags */}
                  <div className="flex flex-wrap gap-2 mb-6">
                    <span className="bg-[#EBE7D9]/60 text-[#556359] text-[10px] font-sans font-bold uppercase tracking-wider px-2.5 py-1 rounded-md border border-[#E3DFD3]/40">
                      {lesson.category}
                    </span>
                    <span className="bg-[#EBE7D9]/60 text-[#556359] text-[10px] font-sans font-bold uppercase tracking-wider px-2.5 py-1 rounded-md border border-[#E3DFD3]/40">
                      {lesson.emotionalTone}
                    </span>
                  </div>
                </div>

                {/* Lower Footer Action Row Container */}
                <div
                  className={`flex items-center justify-between pt-4 border-t border-[#E3DFD3]/40 mt-auto ${isLocked ? "select-none blur-[1px] opacity-40 pointer-events-none" : ""}`}
                >
                  {/* Identity Bio Card */}
                  <div className="flex items-center gap-2.5">
                    <img
                      src={creatorAvatar}
                      alt={creatorName}
                      className="w-8 h-8 rounded-full object-cover border border-[#E3DFD3]"
                    />
                    <span className="text-sm font-sans font-bold text-[#1E2E24]">
                      {creatorName}
                    </span>
                  </div>

                  {/* Clean Semantic Query Params Navigation Link */}
                  <Link
                    href={`/lessons/details?id=${lessonId}`}
                    className="flex items-center gap-1 text-sm font-sans font-bold text-[#467856] hover:text-[#386145] transition-colors group/btn"
                  >
                    See Details
                    <ArrowUpRight
                      size={15}
                      className="transition-transform duration-200 group-hover/btn:translate-x-0.5 group-hover/btn:-translate-y-0.5"
                    />
                  </Link>
                </div>
              </Card>
            );
          })}
        </div>
      </div>
    </div>
  );
}
