import Link from "next/link";

import { Card, Chip } from "@heroui/react";

import { getProfileBySlug } from "@/lib/api/profile";
import { getUserSessionServer } from "@/lib/actions/userSession";

const ProfilePage = async ({ params }) => {
  const { slug } = await params;

  const session = await getUserSessionServer();
  const isOwner = session?.user?.id === slug;

  let profile = null;
  let loadError = null;
  try {
    profile = await getProfileBySlug(slug);
  } catch (err) {
    loadError = err.message || "Failed to load profile";
  }

  if (loadError || !profile) {
    return (
      <main className="min-h-screen bg-[#faf7f2] px-6 py-30 font-sans">
        <div className="max-w-3xl mx-auto text-center">
          <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#2e7d32] mb-3">
            Profile
          </p>
          <h1 className="text-3xl font-serif font-bold text-[#1c2833] mb-3">
            {loadError || "Profile not found"}
          </h1>
          <p className="text-sm text-slate-500">
            We couldn&rsquo;t load the profile for{" "}
            <code className="px-1.5 py-0.5 rounded-md bg-[#eae6df] text-[#334155] font-mono text-[12px]">
              /profile/{slug}
            </code>
            .
          </p>
        </div>
      </main>
    );
  }

  const { user, lessons, totals } = profile;

  return (
    <main className="min-h-screen bg-[#faf7f2] px-6 py-30 font-sans selection:bg-[#dfd3c3]">
      <div className="max-w-5xl mx-auto space-y-6">
        {/* Header */}
        <header className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#2e7d32] mb-3">
              Profile
            </p>
            <h1 className="text-4xl font-serif font-bold leading-tight text-[#1c2833]">
              {user?.name || slug}
            </h1>
            <p className="text-sm text-slate-500 mt-1">
              {user?.bio || user?.authorTitle || "Member of Life Echo"}
            </p>
          </div>

          {isOwner && (
            <Link
              href="/dashboard/add-lesson"
              className="inline-flex items-center justify-center px-4 h-10 rounded-xl bg-[#1c2833] text-white text-sm font-medium hover:bg-[#2e7d32] transition-all"
            >
              + Add lesson
            </Link>
          )}
        </header>

        {/* User info card */}
        <Card className="p-6 bg-white border border-[#eae6df] shadow-sm rounded-2xl">
          <div className="flex flex-col sm:flex-row gap-6 sm:items-center">
            <div className="w-20 h-20 rounded-full bg-[#e2f2e9] text-[#2e7d32] flex items-center justify-center font-serif font-bold text-2xl border border-[#eae6df] overflow-hidden shrink-0">
              {user?.image ? (
                <img
                  src={user.image}
                  alt={user?.name || "Profile"}
                  className="w-full h-full object-cover"
                />
              ) : (
                (user?.name || slug || "?").charAt(0).toUpperCase()
              )}
            </div>

            <div className="flex-1 grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
              <Field label="Name" value={user?.name || "N/A"} />
              <Field label="Email" value={user?.email || "N/A"} />
              <Field label="Plan" value={user?.plan || "free"} />
              <Field label="Author Title" value={user?.authorTitle || "N/A"} />
              <Field
                label="Lessons on profile"
                value={user?.lessonsCount ?? "N/A"}
              />
              <Field label="Students" value={user?.studentsCount ?? "N/A"} />
            </div>
          </div>
        </Card>

        {/* Totals row */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <Stat label="Lessons" value={totals?.totalLessons ?? 0} />
          <Stat label="Saves" value={totals?.totalSaves ?? 0} />
          <Stat label="Likes" value={totals?.totalLikes ?? 0} />
          <Stat label="Views" value={totals?.totalViews ?? 0} />
        </div>

        {/* Lessons list */}
        <Card className="p-6 bg-white border border-[#eae6df] shadow-sm rounded-2xl">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-serif font-bold text-lg text-[#1c2833]">
              Lessons ({lessons.length})
            </h2>
            {isOwner && (
              <Link
                href="/dashboard/my-lessons"
                className="text-xs font-semibold text-[#2e7d32] hover:underline"
              >
                Manage lessons →
              </Link>
            )}
          </div>

          {lessons.length === 0 ? (
            <p className="text-sm text-slate-500">No lessons yet.</p>
          ) : (
            <ul className="divide-y divide-[#eae6df]">
              {lessons.map((lesson) => (
                <li
                  key={lesson._id}
                  className="py-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2"
                >
                  <div className="min-w-0">
                    <Link
                      href={`/lessons/details/${lesson._id}`}
                      className="font-semibold text-[#1c2833] hover:text-[#2e7d32] block truncate"
                    >
                      {lesson.title || "Untitled lesson"}
                    </Link>
                    <p className="text-xs text-slate-500 mt-1 line-clamp-2">
                      {lesson.story}
                    </p>
                    <div className="flex flex-wrap gap-2 mt-2">
                      {lesson.category && (
                        <Chip
                          size="sm"
                          className="bg-[#e2f2e9] text-[#2e7d32] uppercase text-[10px] tracking-wider rounded-md"
                        >
                          {lesson.category}
                        </Chip>
                      )}
                      {lesson.emotionalTone && (
                        <Chip
                          size="sm"
                          className="bg-[#fef3d6] text-[#b27b00] uppercase text-[10px] tracking-wider rounded-md"
                        >
                          {lesson.emotionalTone}
                        </Chip>
                      )}
                      {lesson.accessLevel && (
                        <Chip
                          size="sm"
                          variant="flat"
                          className="uppercase text-[10px] tracking-wider rounded-md"
                        >
                          {lesson.accessLevel}
                        </Chip>
                      )}
                    </div>
                  </div>

                  <div className="flex gap-4 text-xs text-slate-500 shrink-0">
                    <span>♥ {lesson.likesCount ?? 0}</span>
                    <span>★ {lesson.savesCount ?? 0}</span>
                    <span>👁 {lesson.viewsCount ?? 0}</span>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </Card>
      </div>
    </main>
  );
};

/* ----------------- Local helpers ----------------- */

function Field({ label, value }) {
  return (
    <div>
      <p className="text-[10px] uppercase tracking-wider text-slate-400 font-bold mb-1">
        {label}
      </p>
      <p className="font-semibold text-[#334155] break-words">
        {value === null || value === undefined || value === "" ? "N/A" : value}
      </p>
    </div>
  );
}

function Stat({ label, value }) {
  return (
    <div className="p-4 bg-white border border-[#eae6df] rounded-2xl shadow-sm">
      <p className="text-[10px] uppercase tracking-wider text-slate-400 font-bold">
        {label}
      </p>
      <p className="font-bold text-[#1c2833] text-2xl mt-1">
        {value === null || value === undefined ? "N/A" : value}
      </p>
    </div>
  );
}

export default ProfilePage;
