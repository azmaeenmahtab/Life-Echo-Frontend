"use client";

import { removeFavoriteLesson } from "@/lib/actions/lessonActions";
import { getFavoriteLessonsByUserId } from "@/lib/api/lesson";
import React, { useEffect, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import {
  Calendar,
  Heart,
  MessageSquare,
  Search,
  X,
  Trash2,
  Eye,
  Bookmark,
} from "lucide-react";

// Keep these in sync with backend ALLOWED_CATEGORIES / ALLOWED_TONES
const CATEGORY_OPTIONS = [
  "personal-growth",
  "career",
  "relationships",
  "mindset",
  "mistakes-learned",
];

const TONE_OPTIONS = ["motivational", "sad", "realization", "gratitude"];

// Tone → pill colors (matches the screenshot palette)
const TONE_STYLES = {
  sad: "bg-amber-100 text-amber-800 border-amber-200",
  motivational: "bg-emerald-100 text-emerald-800 border-emerald-200",
  realization: "bg-orange-100 text-orange-800 border-orange-200",
  gratitude: "bg-yellow-100 text-yellow-800 border-yellow-200",
};

const CATEGORY_STYLES = {
  "personal-growth": "bg-emerald-100 text-emerald-800 border-emerald-200",
  career: "bg-emerald-100 text-emerald-800 border-emerald-200",
  relationships: "bg-emerald-100 text-emerald-800 border-emerald-200",
  mindset: "bg-emerald-100 text-emerald-800 border-emerald-200",
  "mistakes-learned": "bg-emerald-100 text-emerald-800 border-emerald-200",
};

const formatDate = (iso) => {
  if (!iso) return "—";
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return "—";
  return d.toLocaleDateString("en-US", {
    month: "short",
    day: "2-digit",
    year: "numeric",
  });
};

const formatCount = (n) => {
  if (n === null || n === undefined) return "0";
  if (n >= 1000) return `${(n / 1000).toFixed(1).replace(/\.0$/, "")}k`;
  return String(n);
};

const Pill = ({ label, className }) => (
  <span
    className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-[11px] font-semibold uppercase tracking-wide ${className}`}
  >
    {label}
  </span>
);

const MyFavorites = ({ loggedInUser }) => {
  const user = loggedInUser;
  const userId = user?._id || user?.id;
  const router = useRouter();

  const [lessons, setLessons] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [removingId, setRemovingId] = useState(null);

  const [filters, setFilters] = useState({
    category: "",
    emotionalTone: "",
  });

  const fetchFavorites = useCallback(async () => {
    if (!userId) return;
    setLoading(true);
    setError(null);
    try {
      const data = await getFavoriteLessonsByUserId(userId, filters);
      setLessons(data);
    } catch (err) {
      setError("Failed to load your favorite lessons.");
    } finally {
      setLoading(false);
    }
  }, [userId, filters]);

  useEffect(() => {
    fetchFavorites();
  }, [fetchFavorites]);

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    const normalized = typeof value === "string" ? value.toLowerCase() : value;
    setFilters((prev) => ({ ...prev, [name]: normalized }));
  };

  const clearFilters = () => {
    setFilters({ category: "", emotionalTone: "" });
  };

  const handleRemove = async (lessonId) => {
    if (!userId) return;
    setRemovingId(lessonId);
    const success = await removeFavoriteLesson(userId, lessonId);
    if (success) {
      setLessons((prev) => prev.filter((l) => l._id !== lessonId));
    } else {
      setError("Failed to remove lesson from favorites. Try again.");
    }
    setRemovingId(null);
  };

  const handleViewDetails = (lessonId) => {
    router.push(`/lessons/details/${lessonId}`);
  };

  if (!userId) {
    return (
      <div className="p-6 text-sm text-stone-600">
        Please log in to view your favorites.
      </div>
    );
  }

  const totalFavorites = lessons.length;
  const isFiltered = filters.category || filters.emotionalTone;

  return (
    <div className="min-h-screen w-full bg-[#FAF8F5] p-6 md:p-10 font-poppins text-stone-800">
      {/* Header */}
      <div className="mb-6 flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="font-poppins text-3xl font-bold text-[#1E2E24]">
            My Favorites
          </h1>
          <p className="mt-1 text-sm text-stone-500">
            Lessons you've saved for later. {totalFavorites} saved.
          </p>
        </div>

        {/* Filters */}
        <div className="flex flex-wrap items-center gap-2">
          <div className="relative">
            <Search
              size={14}
              className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-stone-400"
            />
            <select
              name="category"
              value={filters.category}
              onChange={handleFilterChange}
              className="appearance-none rounded-lg border border-stone-200 bg-white py-2 pl-8 pr-8 text-sm text-stone-700 shadow-sm transition hover:border-stone-300 focus:border-[#4D7C5D] focus:outline-none focus:ring-2 focus:ring-[#4D7C5D]/20"
            >
              <option value="">All Categories</option>
              {CATEGORY_OPTIONS.map((cat) => (
                <option key={cat} value={cat.toLowerCase()}>
                  {cat}
                </option>
              ))}
            </select>
          </div>

          <select
            name="emotionalTone"
            value={filters.emotionalTone}
            onChange={handleFilterChange}
            className="appearance-none rounded-lg border border-stone-200 bg-white px-3 py-2 pr-8 text-sm text-stone-700 shadow-sm transition hover:border-stone-300 focus:border-[#4D7C5D] focus:outline-none focus:ring-2 focus:ring-[#4D7C5D]/20"
          >
            <option value="">All Tones</option>
            {TONE_OPTIONS.map((tone) => (
              <option key={tone} value={tone.toLowerCase()}>
                {tone}
              </option>
            ))}
          </select>

          {isFiltered && (
            <button
              onClick={clearFilters}
              className="inline-flex items-center gap-1 rounded-lg border border-stone-200 bg-white px-3 py-2 text-sm font-medium text-stone-600 shadow-sm transition hover:bg-stone-50"
            >
              <X size={14} />
              Clear
            </button>
          )}
        </div>
      </div>

      {/* States */}
      {loading && (
        <div className="rounded-2xl border border-stone-200 bg-white p-10 text-center text-sm text-stone-500 shadow-sm">
          Loading your favorites...
        </div>
      )}

      {error && !loading && (
        <div className="rounded-2xl border border-rose-200 bg-rose-50 p-4 text-sm text-rose-700">
          {error}
        </div>
      )}

      {!loading && !error && lessons.length === 0 && (
        <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-stone-200 bg-white/60 p-12 text-center">
          <div className="mb-3 flex h-14 w-14 items-center justify-center rounded-full bg-emerald-50 text-emerald-700">
            <Bookmark size={22} />
          </div>
          <h3 className="font-poppins text-lg font-semibold text-[#1E2E24]">
            No saved lessons yet
          </h3>
          <p className="mt-1 max-w-sm text-sm text-stone-500">
            Browse public lessons and tap the bookmark icon to save them here for
            later.
          </p>
        </div>
      )}

      {/* Table */}
      {!loading && !error && lessons.length > 0 && (
        <div className="overflow-hidden rounded-2xl border border-stone-200 bg-white shadow-sm">
          {/* Header row */}
          <div className="hidden grid-cols-12 gap-4 border-b border-stone-100 bg-stone-50/60 px-6 py-3 text-[11px] font-semibold uppercase tracking-wider text-stone-500 md:grid">
            <div className="col-span-5">Lesson Info</div>
            <div className="col-span-2">Stats</div>
            <div className="col-span-2">Saved On</div>
            <div className="col-span-3 text-right">Actions</div>
          </div>

          <ul className="divide-y divide-stone-100">
            {lessons.map((lesson) => {
              const categoryKey = (lesson.category || "").toLowerCase();
              const toneKey = (lesson.emotionalTone || "").toLowerCase();

              return (
                <li
                  key={lesson._id}
                  className="grid grid-cols-1 gap-4 px-6 py-5 transition hover:bg-stone-50/50 md:grid-cols-12 md:items-center"
                >
                  {/* Lesson Info */}
                  <div className="md:col-span-5">
                    <div className="flex items-start gap-4">
                      <button
                        type="button"
                        onClick={() => handleViewDetails(lesson._id)}
                        className="group relative h-14 w-14 flex-shrink-0 overflow-hidden rounded-xl border border-stone-200 bg-stone-100"
                        aria-label={`View details for ${lesson.title}`}
                      >
                        {lesson.coverImage || lesson.image ? (
                          // eslint-disable-next-line @next/next/no-img-element
                          <img
                            src={lesson.coverImage || lesson.image}
                            alt={lesson.title}
                            className="h-full w-full object-cover transition group-hover:scale-105"
                          />
                        ) : (
                          <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-stone-200 to-stone-300 text-stone-500">
                            <Bookmark size={18} />
                          </div>
                        )}
                      </button>

                      <div className="min-w-0 flex-1">
                        <button
                          type="button"
                          onClick={() => handleViewDetails(lesson._id)}
                          className="block text-left"
                        >
                          <h3 className="truncate font-poppins text-base font-semibold text-[#1E2E24] hover:text-[#2D6A4F]">
                            {lesson.title}
                          </h3>
                        </button>

                        {lesson.description && (
                          <p className="mt-1 line-clamp-2 text-sm text-stone-500">
                            {lesson.description}
                          </p>
                        )}

                        <div className="mt-2 flex flex-wrap items-center gap-1.5">
                          {categoryKey && (
                            <Pill
                              label={categoryKey}
                              className={
                                CATEGORY_STYLES[categoryKey] ||
                                "bg-stone-100 text-stone-700 border-stone-200"
                              }
                            />
                          )}
                          {toneKey && (
                            <Pill
                              label={toneKey}
                              className={
                                TONE_STYLES[toneKey] ||
                                "bg-stone-100 text-stone-700 border-stone-200"
                              }
                            />
                          )}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Stats */}
                  <div className="md:col-span-2">
                    <div className="flex items-center gap-4 text-sm text-stone-600">
                      <span
                        className="inline-flex items-center gap-1.5"
                        title="Likes"
                      >
                        <Heart size={14} className="text-rose-500" />
                        <span className="font-medium">
                          {formatCount(lesson.likesCount)}
                        </span>
                      </span>
                      <span
                        className="inline-flex items-center gap-1.5"
                        title="Comments"
                      >
                        <MessageSquare size={14} className="text-sky-500" />
                        <span className="font-medium">
                          {formatCount(lesson.commentsCount)}
                        </span>
                      </span>
                    </div>

                    {/* Creator line */}
                    <div className="mt-2 flex items-center gap-2">
                      {lesson.creatorProfilePic ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img
                          src={lesson.creatorProfilePic}
                          alt={lesson.creatorName || "Creator"}
                          className="h-5 w-5 rounded-full object-cover ring-1 ring-stone-200"
                        />
                      ) : (
                        <div className="flex h-5 w-5 items-center justify-center rounded-full bg-stone-200 text-[10px] font-semibold text-stone-600">
                          {(lesson.creatorName || "?").charAt(0).toUpperCase()}
                        </div>
                      )}
                      <span className="truncate text-xs text-stone-500">
                        {lesson.creatorName || "Unknown"}
                      </span>
                    </div>
                  </div>

                  {/* Saved on */}
                  <div className="md:col-span-2">
                    <div className="inline-flex items-center gap-1.5 text-sm text-stone-600">
                      <Calendar size={14} className="text-stone-400" />
                      <span>{formatDate(lesson.savedAt || lesson.createdAt)}</span>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center justify-start gap-1 md:col-span-3 md:justify-end">
                    <button
                      type="button"
                      onClick={() => handleViewDetails(lesson._id)}
                      className="inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-sm font-medium text-stone-600 transition hover:bg-stone-100 hover:text-[#2D6A4F]"
                    >
                      <Eye size={15} />
                      View
                    </button>

                    <button
                      type="button"
                      onClick={() => handleRemove(lesson._id)}
                      disabled={removingId === lesson._id}
                      className="inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-sm font-medium text-stone-500 transition hover:bg-rose-50 hover:text-rose-600 disabled:cursor-not-allowed disabled:opacity-50"
                      aria-label="Remove from favorites"
                    >
                      <Trash2 size={15} />
                      {removingId === lesson._id ? "Removing…" : "Remove"}
                    </button>
                  </div>
                </li>
              );
            })}
          </ul>
        </div>
      )}
    </div>
  );
};

export default MyFavorites;
