"use client";

import React, { useState, useEffect } from "react";
import { Card, Input, Label, ListBox, Select } from "@heroui/react";
import { Search, ChevronDown, Check } from "lucide-react";
import { useRouter, usePathname, useSearchParams } from "next/navigation";

const CATEGORY_OPTIONS = [
  { key: "all", label: "All Categories" },
  { key: "career", label: "Career" },
  { key: "relationships", label: "Relationships" },
  { key: "mindset", label: "Mindset" },
  { key: "mistakes-learned", label: "Mistakes Learned" },
  { key: "personal-growth", label: "Personal Growth" },
];

const TONE_OPTIONS = [
  { key: "all", label: "All Tones" },
  { key: "realization", label: "Realization" },
  { key: "sad", label: "Sad" },
  { key: "motivational", label: "Motivational" },
  { key: "gratitude", label: "Gratitude" },
];

const SORT_OPTIONS = [
  { key: "newest", label: "Sort by Newest" },
  { key: "mostsaved", label: "Most Saved" },
];

export default function PublicLessonsFilters() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const currentCategory = searchParams.get("category") || "all";
  const currentTone = searchParams.get("tone") || "all";
  const currentSortBy = searchParams.get("sortby") || "newest";
  const currentKeywords = searchParams.get("keywords") || "";

  const [keywordInput, setKeywordInput] = useState(currentKeywords);

  useEffect(() => {
    setKeywordInput(currentKeywords);
  }, [currentKeywords]);

  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      updateUrlParam("keywords", keywordInput);
    }, 400);
    return () => clearTimeout(delayDebounceFn);
  }, [keywordInput]);

  const updateUrlParam = (key, value) => {
    const params = new URLSearchParams(window.location.search);
    if (!value || value === "all") {
      params.delete(key);
    } else {
      params.set(key, value);
    }
    router.push(`${pathname}?${params.toString()}`, { scroll: false });
  };

  // Shared wrapper class for custom styling the Select components
  const selectWrapperClass = "w-full flex flex-col gap-1";

  // Custom styling rules matching your pixel-perfect theme aesthetics
  const triggerClass =
    "flex items-center justify-between bg-[#F2EFE6] hover:bg-[#EBE7D9] data-[pressed=true]:bg-[#E3DFD3] border border-[#E3DFD3] rounded-xl h-11 px-3 text-sm font-sans font-medium text-[#1E2E24] transition-all cursor-pointer outline-none w-full";
  const popoverClass =
    "bg-[#FAF8F3] border border-[#EBE7D9] rounded-xl shadow-lg p-1 min-w-[200px]";
  const itemClass =
    "flex items-center justify-between px-3 py-2 text-sm font-sans font-medium text-[#556359] hover:bg-[#F2EFE6] hover:text-[#1E2E24] rounded-lg cursor-pointer transition-colors outline-none data-[focus=true]:bg-[#F2EFE6]";

  return (
    <div className="px-4 lg:px-8">
      <Card
        shadow="none"
        className="bg-[#FAF8F3] border border-[#EBE7D9] rounded-[24px] p-5 mb-10"
      >
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-12 gap-4 items-center">
          {/* Keywords Input */}
          {/* Keywords Input */}
          <div className="lg:col-span-5">
            <div className="relative w-full">
              <Search
                size={18}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-[#A0AEA4] pointer-events-none"
              />
              <Input
                type="text"
                placeholder="Search by title or keyword..."
                value={keywordInput}
                onChange={(e) => setKeywordInput(e.target.value)}
                className="w-full bg-[#F2EFE6] hover:bg-[#EBE7D9] border border-[#E3DFD3] rounded-xl h-11 pl-10 pr-4 shadow-none text-sm font-sans text-[#1E2E24] placeholder-[#A0AEA4] transition-all focus-visible:bg-[#FAF8F3] focus-visible:border-[#467856] outline-none"
              />
            </div>
          </div>

          {/* Hero UI Select: Category */}
          <div className="lg:col-span-2">
            <Select
              className={selectWrapperClass}
              placeholder="Category"
              aria-label="Search lessons by title or keyword"
              selectedKey={currentCategory}
              onChange={(key) => updateUrlParam("category", key)}
            >
              <Select.Trigger className={triggerClass}>
                <Select.Value />
                <ChevronDown size={16} className="text-[#556359]" />
              </Select.Trigger>
              <Select.Popover className={popoverClass}>
                <ListBox>
                  {CATEGORY_OPTIONS.map((opt) => (
                    <ListBox.Item
                      id={opt.key}
                      key={opt.key}
                      textValue={opt.label}
                      className={itemClass}
                    >
                      {opt.label}
                    </ListBox.Item>
                  ))}
                </ListBox>
              </Select.Popover>
            </Select>
          </div>

          {/* Hero UI Select: Emotional Tone */}
          <div className="lg:col-span-2">
            <Select
              className={selectWrapperClass}
              placeholder="Tone"
              selectedKey={currentTone}
              onChange={(key) => updateUrlParam("tone", key)}
            >
              <Select.Trigger className={triggerClass}>
                <Select.Value />
                <ChevronDown size={16} className="text-[#556359]" />
              </Select.Trigger>
              <Select.Popover className={popoverClass}>
                <ListBox>
                  {TONE_OPTIONS.map((opt) => (
                    <ListBox.Item
                      id={opt.key}
                      key={opt.key}
                      textValue={opt.label}
                      className={itemClass}
                    >
                      {opt.label}
                    </ListBox.Item>
                  ))}
                </ListBox>
              </Select.Popover>
            </Select>
          </div>

          {/* Hero UI Select: Sort By */}
          <div className="lg:col-span-3">
            <Select
              className={selectWrapperClass}
              placeholder="Sort By"
              selectedKey={currentSortBy}
              onChange={(key) => updateUrlParam("sortby", key)}
            >
              <Select.Trigger className={triggerClass}>
                <Select.Value />
                <ChevronDown size={16} className="text-[#556359]" />
              </Select.Trigger>
              <Select.Popover className={popoverClass}>
                <ListBox>
                  {SORT_OPTIONS.map((opt) => (
                    <ListBox.Item
                      id={opt.key}
                      key={opt.key}
                      textValue={opt.label}
                      className={itemClass}
                    >
                      {opt.label}
                    </ListBox.Item>
                  ))}
                </ListBox>
              </Select.Popover>
            </Select>
          </div>
        </div>

        {/* Quick Interactive Recommended Tags */}
        <div className="flex items-center gap-2.5 mt-4 flex-wrap pt-1">
          {["Resilience", "Leadership", "Habits"].map((tag) => (
            <button
              key={tag}
              type="button"
              onClick={() => setKeywordInput(tag)}
              className={`text-xs font-sans px-3 py-1 rounded-full border transition-all ${
                keywordInput.toLowerCase() === tag.toLowerCase()
                  ? "bg-[#E2F0E7] text-[#2D6A4F] border-[#A3D2B5] font-semibold"
                  : "bg-[#F2EFE6]/50 text-[#556359] border-[#E3DFD3] hover:bg-[#EBE7D9]"
              }`}
            >
              #{tag}
            </button>
          ))}
        </div>
      </Card>
    </div>
  );
}
