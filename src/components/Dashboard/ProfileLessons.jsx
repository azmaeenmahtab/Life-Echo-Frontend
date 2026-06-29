"use client";

import React, { useEffect, useMemo, useState, useTransition } from "react";
import { useRouter, usePathname, useSearchParams } from "next/navigation";
import {
  Card,
  Input,
  ListBox,
  Select,
  Skeleton,
} from "@heroui/react";
import { Search, ChevronDown, Lock, ArrowUpRight } from "lucide-react";
import Link from "next/link";
import { authClient } from "@/lib/auth-client";
import { getLessonsByUserId } from "@/lib/api/lesson";

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

const formatDate = (value) => {
  const d = parseLessonDate(value);
  if (!d) return "—";
  return d.toLocaleDateString("en-US", {
    month: "short",
    day: "2-digit",
    year: "numeric",
  });
};

const triggerClass =
  "flex items-center justify-between bg-[#F2EFE6] hover:bg-[#EBE7D9] data-[pressed=true]:bg-[#E3DFD3] border border-[#E3DFD3] rounded-xl h-11 px-3 text-sm font-sans font-medium text-[#1E2E24] transition-all cursor-pointer outline-none w-full";
const popoverClass =
  "bg-[#FAF8F3] border border-[#EBE7D9] rounded-xl shadow-lg p-1 min-w-[200px]";
const itemClass =
  "flex items-center justify-between px-3 py-2 text-sm font-sans font-medium text-[#556359] hover:bg-[#F2EFE6] hover:text-[#1E2E24] rounded-lg cursor-pointer transition-colors outline-none data-[focus=true]:bg-[#F2EFE6]";
const selectWrapperClass = "w-full flex flex-col gap-1";

/**
 * Filterable, creator-scoped lesson grid. Mirrors the public lessons
 * design (cards, premium-gate blur, URL-driven filters) but only ever
 * fetches lessons authored by a single user.
 *
 * The total lesson count is passed through from the server (it is the
 * *complete* authored count, not the filtered count) so the header stays
 * stable as the user changes filters.
 */
export default function ProfileLessons({ userId, totalCount = 0 }) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const currentCategory = searchParams.get("category") || "all";
  const currentTone = searchParams.get("tone") || "all";
  const currentSortBy = searchParams.get("sortby") || "newest";
  const currentKeywords = searchParams.get("keywords") || "";

  const [keywordInput, setKeywordInput] = useState(currentKeywords);
  const [lessons, setLessons] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState("");

  useEffect(() => {
    setKeywordInput(currentKeywords);
  }, [currentKeywords]);

  // Debounce keyword typing into the URL.
  useEffect(() => {
    const id = setTimeout(() => {
      updateUrlParam("keywords", keywordInput);
    }, 400);
    return () => clearTimeout(id);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [keywordInput]);

  const updateUrlParam = (key, value) => {
    const params = new URLSearchParams(window.location.search);
    if (!value || value === "all") {
      params.delete(key);
    } else {
      params.set(key, value);
    }
    const query = params.toString();
    startTransition(() => {
      router.push(`${pathname}${query ? `?${query}` : ""}`, { scroll: false });
    });
  };

  // Refetch whenever the URL filters change.
  useEffect(() => {
    if (!userId) return;
    let cancelled = false;
    setIsLoading(true);
    setError("");

    const query = {
      category: currentCategory === "all" ? "" : currentCategory,
      tone: currentTone === "all" ? "" : currentTone,
      keywords: currentKeywords,
      sortby: currentSortBy,
    };

    getLessonsByUserId(userId, query)
      .then((data) => {
        if (cancelled) return;
        setLessons(Array.isArray(data) ? data : []);
      })
      .catch((err) => {
        if (cancelled) return;
        console.error("ProfileLessons fetch error:", err);
        setError(err?.message || "Couldn't load lessons");
        setLessons([]);
      })
      .finally(() => {
        if (cancelled) return;
        setIsLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [userId, currentCategory, currentTone, currentSortBy, currentKeywords]);

  const { data: session } = authClient.useSession();
  const currentPlan = session?.user?.plan ?? "free";
  const isCurrentPremium = currentPlan === "premium" || currentPlan === "pro";

  const showSkeleton = isLoading || isPending;
  const filteredCount = useMemo(() => lessons.length, [lessons]);

  return (
    <Card
      shadow="none"
      className="bg-white border border-[#eae6df] shadow-sm rounded-2xl p-6"
    >
      <div className="flex items-center justify-between mb-4">
        <h2 className="font-serif font-bold text-lg text-[#1c2833]">
          Lessons ({totalCount})
        </h2>
        {currentKeywords ||
        (currentCategory && currentCategory !== "all") ||
        (currentTone && currentTone !== "all") ||
        currentSortBy !== "newest" ? (
          <span className="text-xs text-slate-500">
            Showing {filteredCount} of {totalCount}
          </span>
        ) : null}
      </div>

      {/* Filter bar (mirrors PublicLessonFilter) */}
      <div className="mb-6">
        <Card
          shadow="none"
          className="bg-[#FAF8F3] border border-[#EBE7D9] rounded-3xl p-5"
        >
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-12 gap-4 items-center">
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

            <div className="lg:col-span-2">
              <Select
                className={selectWrapperClass}
                placeholder="Category"
                aria-label="Filter by category"
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

      {/* Body */}
      {error ? (
        <p className="text-sm text-red-500">{error}</p>
      ) : showSkeleton ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {Array.from({ length: 3 }).map((_, idx) => (
            <Card
              key={`skeleton-${idx}`}
              shadow="none"
              className="bg-[#FAF8F3] border border-[#EBE7D9] rounded-3xl p-6 min-h-72.5"
            >
              <Skeleton className="h-4 w-20 rounded mb-4" />
              <Skeleton className="h-6 w-3/4 rounded mb-2" />
              <Skeleton className="h-3 w-full rounded mb-1" />
              <Skeleton className="h-3 w-5/6 rounded mb-6" />
              <Skeleton className="h-8 w-1/2 rounded" />
            </Card>
          ))}
        </div>
      ) : lessons.length === 0 ? (
        <p className="text-sm text-slate-500">
          No lessons match these filters.
        </p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {lessons.map((lesson) => {
            const isLocked =
              lesson.accessLevel === "premium" && !isCurrentPremium;
            const creatorName = lesson.creatorName;
            const creatorAvatar = lesson.creatorProfilePic;
            const lessonId = lesson._id;

            return (
              <Card
                key={lessonId}
                shadow="none"
                className="bg-[#FAF8F3] border border-[#EBE7D9] rounded-3xl p-6 relative flex flex-col justify-between min-h-72.5 overflow-hidden transition-all duration-300 hover:shadow-md group"
              >
                {isLocked && (
                  <div className="absolute inset-0 bg-[#FAF8F3]/60 backdrop-blur-[14px] z-20 flex flex-col items-center justify-center p-6 text-center animate-in fade-in duration-300">
                    <div className="w-12 h-12 rounded-full bg-[#FAF8F3] border border-[#EBE7D9] flex items-center justify-center text-[#8C6D3D] shadow-sm mb-3">
                      <Lock size={18} />
                    </div>
                    <h3 className="text-lg font-serif font-bold text-[#1E2E24] mb-1">
                      Exclusive Wisdom
                    </h3>
                    <p className="text-xs font-sans text-[#707E74] mb-5 max-w-50">
                      This lesson is part of our Premium Collection.
                    </p>
                    <button
                      type="button"
                      className="bg-[#467856] hover:bg-[#386145] text-white font-sans font-semibold text-xs px-5 py-4 h-9 rounded-xl shadow-sm transition-all active:scale-95"
                    >
                      Upgrade to view
                    </button>
                  </div>
                )}

                <div
                  className={
                    isLocked
                      ? "select-none blur-[1px] opacity-40 pointer-events-none"
                      : ""
                  }
                >
                  <div className="flex items-center justify-between mb-4">
                    <span className="bg-[#FFF4E0] text-[#A0702A] text-[11px] font-sans font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full border border-[#F2E4CC]">
                      {lesson.accessLevel}
                    </span>
                    <span className="text-xs font-sans text-[#A0AEA4] font-medium">
                      {formatDate(lesson.createdAt)}
                    </span>
                  </div>

                  <Link href={`/lessons/details?id=${lessonId}`}>
                    <h2 className="text-xl font-serif font-bold text-[#1E2E24] line-clamp-1 mb-2 tracking-tight hover:text-[#467856] transition-colors cursor-pointer">
                      {lesson.title}
                    </h2>
                  </Link>

                  <p className="text-sm font-sans text-[#556359] leading-relaxed line-clamp-3 mb-6">
                    {lesson.story}
                  </p>

                  <div className="flex flex-wrap gap-2 mb-6">
                    <span className="bg-[#EBE7D9]/60 text-[#556359] text-[10px] font-sans font-bold uppercase tracking-wider px-2.5 py-1 rounded-md border border-[#E3DFD3]/40">
                      {lesson.category}
                    </span>
                    <span className="bg-[#EBE7D9]/60 text-[#556359] text-[10px] font-sans font-bold uppercase tracking-wider px-2.5 py-1 rounded-md border border-[#E3DFD3]/40">
                      {lesson.emotionalTone}
                    </span>
                  </div>
                </div>

                <div
                  className={`flex items-center justify-between pt-4 border-t border-[#E3DFD3]/40 mt-auto ${isLocked ? "select-none blur-[1px] opacity-40 pointer-events-none" : ""}`}
                >
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

                  <Link
                    href={`/lessons/details/${lessonId}`}
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
      )}
    </Card>
  );
}
