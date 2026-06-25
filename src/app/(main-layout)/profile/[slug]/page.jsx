import { Card } from "@heroui/react";

const ProfilePage = async ({ params }) => {
  const { slug } = await params;

  return (
    <main className="min-h-screen bg-[#faf7f2] px-6 py-30 font-sans selection:bg-[#dfd3c3]">
      <div className="max-w-3xl mx-auto">
        {/* Eyebrow label */}
        <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#2e7d32] mb-3">
          Profile
        </p>

        {/* Slug heading */}
        <h1 className="text-4xl md:text-5xl font-serif font-bold leading-tight text-[#1c2833] mb-3 tracking-wide break-all">
          {slug}
        </h1>

        <p className="text-sm text-slate-500 mb-10">
          Public profile identified by{" "}
          <code className="px-1.5 py-0.5 rounded-md bg-[#eae6df] text-[#334155] font-mono text-[12px]">
            /profile/{slug}
          </code>
        </p>

        {/* Placeholder content card */}
        <Card className="p-8 bg-white border border-[#eae6df] shadow-sm rounded-2xl">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-full bg-[#e2f2e9] text-[#2e7d32] flex items-center justify-center font-serif font-bold text-2xl border border-[#eae6df]">
              {slug ? slug.charAt(0).toUpperCase() : "?"}
            </div>

            <div>
              <h2 className="font-serif font-bold text-xl text-[#1c2833]">
                {slug}
              </h2>
              <p className="text-xs text-slate-400 mt-1 font-medium">
                Slug from the URL path
              </p>
            </div>
          </div>

          <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
            <div className="p-4 rounded-xl border border-[#eae6df] bg-[#faf7f2]">
              <p className="text-[10px] uppercase tracking-wider text-slate-400 font-bold mb-1">
                Raw slug
              </p>
              <p className="font-semibold text-[#334155] break-all">{slug}</p>
            </div>
            <div className="p-4 rounded-xl border border-[#eae6df] bg-[#faf7f2]">
              <p className="text-[10px] uppercase tracking-wider text-slate-400 font-bold mb-1">
                Length
              </p>
              <p className="font-semibold text-[#334155]">
                {slug ? slug.length : 0} characters
              </p>
            </div>
          </div>
        </Card>
      </div>
    </main>
  );
};

export default ProfilePage;