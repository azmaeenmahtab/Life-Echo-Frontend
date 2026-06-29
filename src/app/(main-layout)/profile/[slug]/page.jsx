import { Camera, Diamond } from "lucide-react";

import { getProfileBySlug } from "@/lib/api/profile";
import { getUserSessionServer } from "@/lib/actions/userSession";
import ProfileLessons from "@/components/Dashboard/ProfileLessons";
import EditProfileButton from "@/components/Dashboard/EditProfileButton";

const ProfilePage = async ({ params }) => {
  const { slug } = await params;

  const session = await getUserSessionServer();
  const sessionUserId = session?.user?.id ?? null;
  const isOwner =
    Boolean(sessionUserId) &&
    (sessionUserId === slug || sessionUserId?.toString() === slug?.toString());

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

  const { user, totals } = profile;
  const isPremium =
    user?.plan === "premium" || user?.plan === "pro" || user?.plan === "Pro";

  return (
    <main className="min-h-screen bg-[#faf7f2] px-6 py-30 font-sans selection:bg-[#dfd3c3]">
      <div className="max-w-5xl mx-auto space-y-6">
        {/* Header card */}
        <header className="bg-white border border-[#eae6df] rounded-3xl p-6 sm:p-8 shadow-sm">
          <div className="flex flex-col lg:flex-row gap-8 lg:items-center">
            {/* Avatar with optional upload overlay */}
            <div className="relative shrink-0 self-start">
              <div className="w-32 h-40 sm:w-36 sm:h-44 rounded-full bg-[#1c2f24] text-[#e2f2e9] flex items-center justify-center font-serif font-bold text-5xl border-4 border-white shadow-md overflow-hidden">
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
              {isOwner && (
                <button
                  type="button"
                  aria-label="Change photo"
                  className="absolute -bottom-1 -right-1 w-9 h-9 rounded-full bg-white border-2 border-[#eae6df] shadow-md flex items-center justify-center text-[#2e7d32] hover:bg-[#e2f2e9] transition"
                >
                  <Camera size={16} />
                </button>
              )}
            </div>

            {/* Name, badges, email */}
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-3 flex-wrap">
                <h1 className="text-3xl sm:text-4xl font-serif font-bold leading-tight text-[#1c2833]">
                  {user?.name || slug}
                </h1>
                {isOwner && <EditProfileButton user={user} />}
                {isPremium && (
                  <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[#f5e9d4] text-[#a17236] text-[10px] font-bold uppercase tracking-wider border border-[#e8d6b4]">
                    <Diamond size={11} />
                    Premium
                  </span>
                )}
              </div>

              {/* Email — visible to owner, hidden to others */}
              <p className="font-serif italic text-[15px] text-[#1c2833]/70 mt-3 break-all">
                {isOwner ? user?.email || "N/A" : ""}
              </p>

              {(user?.bio || user?.authorTitle) && (
                <p className="text-sm text-slate-500 mt-1">
                  {user?.bio || user?.authorTitle}
                </p>
              )}
            </div>

            {/* Stats */}
            <div className="flex gap-8 shrink-0 lg:border-l lg:border-[#eae6df] lg:pl-8 pt-6 lg:pt-0 border-t lg:border-t-0 border-[#eae6df]">
              <div>
                <p className="text-3xl font-serif font-bold text-[#2e7d32]">
                  {totals?.totalLessons ?? 0}
                </p>
                <p className="text-[10px] uppercase tracking-wider text-slate-500 font-bold mt-1">
                  Lessons Created
                </p>
              </div>
              <div>
                <p className="text-3xl font-serif font-bold text-[#2e7d32]">
                  {totals?.totalSaves ?? 0}
                </p>
                <p className="text-[10px] uppercase tracking-wider text-slate-500 font-bold mt-1">
                  Lessons Saved
                </p>
              </div>
            </div>
          </div>
        </header>

        {/* Filterable lessons grid (mirrors public lessons design) */}
        <ProfileLessons userId={slug} totalCount={totals?.totalLessons ?? 0} />
      </div>
    </main>
  );
};

export default ProfilePage;
