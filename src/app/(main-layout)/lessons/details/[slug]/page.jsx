import { getLessonById } from "@/lib/api/lesson";
import { getUserSessionServer } from "@/lib/actions/userSession";
import { redirect } from "next/navigation";

import { CalendarDays, Clock, Eye } from "lucide-react";

import { Card, Chip, Avatar } from "@heroui/react";
import Link from "next/link";
import LessonEngagement from "@/components/Lessons/LessonEngagement";
import LessonSocialStats from "@/components/Lessons/LessonSocialStats";
import { CommentSection } from "@/components/Lessons/CommentSection";

const LessonDetailsPage = async ({ params }) => {
  const { slug } = await params;
  const lesson = await getLessonById(slug);
  console.log("lesson ", lesson);

  if (!lesson) {
    return <div className="text-center p-10 font-sans">Lesson not found</div>;
  }

  const session = await getUserSessionServer();
  const userPlan = session?.user?.plan ?? "free";
  const currentUserId = session?.user?.id ?? null;

  // Normalise membership checks: both `likedBy`/`savedBy` on the lesson and
  // the session's user id may arrive as strings or as objects with a string
  // `_id`, so coerce everything to a string before comparing.
  const toIdString = (value) => {
    if (!value) return null;
    if (typeof value === "string") return value;
    if (typeof value === "object" && value._id) return value._id.toString();
    return value.toString();
  };

  const uid = toIdString(currentUserId);
  const likedBy = Array.isArray(lesson?.likedBy) ? lesson.likedBy : [];
  const savedBy = Array.isArray(lesson?.savedBy) ? lesson.savedBy : [];
  const initialIsLiked = uid
    ? likedBy.some((id) => toIdString(id) === uid)
    : false;
  const initialIsSaved = uid
    ? savedBy.some((id) => toIdString(id) === uid)
    : false;
  const initialLikesCount =
    typeof lesson?.likesCount === "number" ? lesson.likesCount : likedBy.length;
  const initialSavesCount =
    typeof lesson?.savesCount === "number" ? lesson.savesCount : savedBy.length;

  if (userPlan === "free" && lesson.accessLevel === "premium") {
    redirect("/pricing");
  }

  return (
    <main className="min-h-screen bg-[#faf7f2] px-6 py-30 font-sans selection:bg-[#dfd3c3]">
      <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-[1fr_300px] gap-12 items-start">
        {/* LEFT ARTICLE SECTION */}
        <section>
          {/* Tags */}
          <div className="flex gap-2 mb-4">
            <Chip
              size="sm"
              className="bg-[#e2f2e9] text-[#2e7d32] font-semibold uppercase text-[10px] tracking-wider rounded-md px-2 py-0.5"
            >
              {lesson.category || "MINDSET"}
            </Chip>
            <Chip
              size="sm"
              className="bg-[#fef3d6] text-[#b27b00] font-semibold uppercase text-[10px] tracking-wider rounded-md px-2 py-0.5"
            >
              {lesson.emotionalTone || "MOTIVATIONAL"}
            </Chip>
          </div>

          {/* Heading */}
          <h1 className="text-4xl md:text-[44px] font-serif font-bold leading-tight text-[#1c2833] mb-6 tracking-wide">
            {lesson.title || "The Art of Patience in a Fast-Paced World"}
          </h1>

          {/* Banner Image */}
          <img
            src={lesson.imageUrl}
            alt={lesson.title}
            className="w-full h-[400px] object-cover rounded-2xl shadow-sm mb-8"
          />

          {/* Article Text Content */}
          <div className="space-y-6 text-[#4a5568] text-[16px] leading-relaxed font-normal">
            <p className="italic text-lg text-[#334155] font-serif antialiased">
              {lesson.story}
            </p>

            {/* Fallback to dynamic array/paragraphs if available, otherwise renders text perfectly */}
            {lesson.paragraphs ? (
              lesson.paragraphs.map((p, i) => <p key={i}>{p}</p>)
            ) : (
              <>
                <p>
                  Cultivating patience isn't merely about waiting; it's about
                  how we behave while we wait. When we rush into
                  decisions—whether they are professional pivots or personal
                  commitments—we often ignore the subtle signals that nature
                  provides. Digital life encourages a 'refresh' culture, where
                  if something doesn't work in seconds, we seek an alternative.
                </p>
                <p>
                  This lesson explores the physiological and psychological
                  benefits of slowing down. By grounding ourselves in the
                  present moment, much like the roots of a forest, we allow our
                  internal ecosystem to catch up with our external ambitions. We
                  will discuss techniques for breathing through the urge to
                  hurry and finding beauty in the gradual unfolding of our
                  life's path.
                </p>
                <p>
                  True wisdom is rooted in the understanding that the best
                  things in life take time to mature. Like a fine oak or a
                  well-steeped tea, our character requires the passage of time
                  to reach its full potential.
                </p>
              </>
            )}
          </div>

          {/* Action Buttons (Liked, Save to Favorites, Share, Report) +
             Social Stats — both share live state via LessonEngagement */}
          <LessonEngagement
            lessonId={lesson._id ?? lesson.id}
            currentUserId={currentUserId}
            initialLikesCount={initialLikesCount}
            initialSavesCount={initialSavesCount}
            initialViewsCount={
              typeof lesson?.viewsCount === "number" ? lesson.viewsCount : 0
            }
            initialIsLiked={initialIsLiked}
            initialIsSaved={initialIsSaved}
          />

          <CommentSection
            lessonId={lesson._id ?? lesson.id}
            userId={currentUserId}
          />
        </section>

        {/* RIGHT SIDEBAR */}
        <aside className="space-y-6">
          {/* Card 1: Lesson Info */}
          <Card className="p-6 bg-white border border-[#eae6df] shadow-sm rounded-2xl">
            <h3 className="font-serif font-bold text-lg text-[#1c2833] mb-5">
              Lesson Info
            </h3>

            <div className="space-y-4">
              <Info
                icon={<CalendarDays size={18} className="text-[#64748b]" />}
                label="Created"
                value={
                  lesson.createdAt
                    ? new Date(lesson.createdAt).toLocaleDateString("en-US", {
                        month: "long",
                        day: "numeric",
                        year: "numeric",
                      })
                    : "October 12, 2023"
                }
              />

              <Info
                icon={<Clock size={18} className="text-[#64748b]" />}
                label="Last Updated"
                value="2 days ago"
              />

              <Info
                icon={<Eye size={18} className="text-[#64748b]" />}
                label="Visibility"
                value={
                  lesson.accessLevel === "premium"
                    ? "Premium Lesson"
                    : "Public Lesson"
                }
              />

              <Info
                icon={<Clock size={18} className="text-[#64748b]" />}
                label="Reading Time"
                value="5 min read"
              />
            </div>
          </Card>

          {/* Card 2: Author Info */}
          <Card className="p-6 bg-white border border-[#eae6df] shadow-sm rounded-2xl flex flex-col items-center text-center">
            <div className="relative w-20 h-20 mb-3">
              {lesson.creatorProfilePic ? (
                <img
                  src={lesson.creatorProfilePic}
                  alt={lesson.creatorName || "Author"}
                  className="w-full h-full rounded-full object-cover border border-[#eae6df]"
                />
              ) : (
                <div className="w-full h-full rounded-full bg-[#e2f2e9] text-[#2e7d32] flex items-center justify-center font-serif font-bold text-2xl border border-[#eae6df]">
                  {(lesson.creatorName || "A").trim().charAt(0).toUpperCase()}
                </div>
              )}
            </div>

            <h3 className="font-serif font-bold text-xl text-[#1c2833]">
              {lesson.creatorName || "Sarah Jenkins"}
            </h3>

            <p className="text-xs text-slate-400 mt-1 mb-4 font-medium">
              {lesson.authorTitle || "Mindfulness Educator & Author"}
            </p>

            {/* Author Quick Metrics */}
            <div className="flex gap-6 justify-center w-full my-2 border-t border-b border-slate-100 py-3">
              <div>
                <p className="font-bold text-[#1c2833] text-lg">
                  {formatStat(lesson.creatorLessonsCount)}
                </p>
                <p className="text-[10px] uppercase tracking-wider text-slate-400 font-semibold">
                  Lessons
                </p>
              </div>
              <div className="border-l border-slate-100" />
              <div>
                <p className="font-bold text-[#1c2833] text-lg">
                  {formatStat(lesson.creatorStudentsCount)}
                </p>
                <p className="text-[10px] uppercase tracking-wider text-slate-400 font-semibold">
                  Students
                </p>
              </div>
            </div>

            <Link
              href={`/profile/${lesson.creatorId ?? lesson.creatorName ?? ""}`}
              className="mt-4 w-full inline-flex items-center justify-center px-4 h-10 border border-[#cbd5e1] text-[#475569] font-medium hover:bg-slate-50 rounded-xl transition-all text-sm"
            >
              View all lessons
            </Link>
          </Card>

          {/* Card 3: Social Engagement Stats (lives in the sidebar but
             reads live counts from the shared engagement store so the
             Like/Save buttons in the main column update it instantly). */}
          <LessonSocialStats
            lessonId={lesson._id ?? lesson.id}
            initialLikesCount={initialLikesCount}
            initialSavesCount={initialSavesCount}
            initialViewsCount={
              typeof lesson?.viewsCount === "number" ? lesson.viewsCount : 0
            }
          />
        </aside>
      </div>
    </main>
  );
};

/* Helper Subcomponents formatting exactly matching layout */
function Info({ icon, label, value }) {
  return (
    <div className="flex gap-4 items-start">
      <div className="mt-0.5">{icon}</div>
      <div>
        <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider leading-none mb-1">
          {label}
        </p>
        <p className="text-sm font-semibold text-[#334155]">{value}</p>
      </div>
    </div>
  );
}

/**
 * Compact numeric formatter used by the Author metrics card:
 *  - missing / non-number → "N/A"
 *  - < 1000              → raw integer (e.g. 342)
 *  - >= 1000             → "1.2K" / "1.5M"
 */
function formatStat(value) {
  if (value == null || value === "" || Number.isNaN(Number(value))) {
    return "N/A";
  }
  const num = Number(value);
  if (num < 1000) return num.toString();
  if (num < 1_000_000) return (num / 1000).toFixed(1).replace(/\.0$/, "") + "K";
  return (num / 1_000_000).toFixed(1).replace(/\.0$/, "") + "M";
}

export default LessonDetailsPage;
