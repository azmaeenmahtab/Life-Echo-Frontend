import React from "react";
import { Card, Chip } from "@heroui/react";
import { Crown, BookOpen } from "lucide-react";

/**
 * Renders the "Most active contributors" card on /dashboard/admin.
 *
 * Lists the top users ranked by number of lessons authored, with:
 *   - avatar + name
 *   - lessons count
 *   - admin badge when the contributor is an admin
 *
 * Designed to slot into the same card row as the existing stat
 * cards. Uses the project's forest/brown palette (`#1E2E24`,
 * `#FAF8F3`, `#EBE7D9`, `#a17236`) so the visual weight matches the
 * dashboard's other stat tiles.
 *
 * Props:
 *   - contributors: ContributorRow[] from
 *     `lib/api/admin/user#getTopContributors`.
 */
const MostActiveContributors = ({ contributors }) => {
  const list = Array.isArray(contributors) ? contributors : [];

  if (list.length === 0) {
    return (
      <Card
        shadow="none"
        className="bg-[#FAF8F3] border border-[#EBE7D9]/60 rounded-[24px] p-6 min-h-[180px]"
      >
        <div className="flex items-start justify-between w-full mb-6">
          <div className="w-12 h-12 rounded-full bg-[#F2EFE6] flex items-center justify-center text-[#a17236]">
            <Crown size={22} strokeWidth={1.75} />
          </div>
          <Chip
            size="sm"
            variant="flat"
            className="bg-[#F2EFE6] text-[#8B7355] font-sans font-bold text-[10px] tracking-wider px-2 border-none"
          >
            NO DATA YET
          </Chip>
        </div>
        <p className="text-[11px] font-sans font-bold tracking-widest text-[#707E74] uppercase mb-1">
          Most active contributors
        </p>
        <p className="text-sm text-[#556359] mt-2">
          Once authors start publishing, they&apos;ll be ranked here.
        </p>
      </Card>
    );
  }

  const topCount = Number(list[0]?.lessonsCount ?? 0);

  return (
    <Card
      shadow="none"
      className="bg-[#FAF8F3] border border-[#EBE7D9]/60 rounded-[24px] p-6 flex flex-col min-h-[180px]"
    >
      <div className="flex items-start justify-between w-full mb-6">
        <div className="flex items-center gap-4 justify-center">
          <div className="w-12 h-12 rounded-full bg-[#F2EFE6] flex items-center justify-center text-[#a17236]">
            <Crown size={22} strokeWidth={1.75} />
          </div>
          <div>
            <p className="text-[11px] font-sans font-bold tracking-widest text-[#707E74] uppercase mb-1">
              Most active contributors
            </p>
            <p className="text-sm text-[#556359] ">
              <span className="font-serif font-bold text-[#1E2E24] text-base">
                {topCount}
              </span>{" "}
              {topCount === 1 ? "lesson" : "lessons"} by the top author
            </p>
          </div>
        </div>
        <Chip
          size="sm"
          variant="flat"
          className="bg-[#f5e9d4] text-[#a17236] font-sans font-bold text-[10px] tracking-wider px-2 border-none"
        >
          TOP {list.length}
        </Chip>
      </div>

      <ul className="space-y-2 mt-auto">
        {list.map((row, index) => {
          const isAdmin = row.role === "admin";
          const displayName = row.name || row.email || "Unnamed author";
          const initial = (row.name || row.email || "?")
            .charAt(0)
            .toUpperCase();
          const count = Number(row.lessonsCount ?? 0);

          return (
            <li
              key={row.userId ?? `${row.email}-${index}`}
              className="flex items-center gap-3"
            >
              <span className="relative shrink-0 w-9 h-9 rounded-full overflow-hidden bg-[#1c2f24] text-[#e2f2e9] flex items-center justify-center font-serif font-bold text-sm border border-[#EBE7D9]">
                {row.image ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={row.image}
                    alt={displayName}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  initial
                )}
              </span>

              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <span className="font-semibold text-[#1E2E24] truncate text-sm">
                    {displayName}
                  </span>
                  {isAdmin ? (
                    <span className="inline-flex items-center px-1.5 py-0.5 rounded-full text-[9px] font-bold uppercase tracking-wider border bg-[#f5e9d4] text-[#a17236] border-[#e8d6b4]">
                      Admin
                    </span>
                  ) : null}
                </div>
                <p className="text-[11px] text-[#707E74] truncate">
                  {row.email || "—"}
                </p>
              </div>

              <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full bg-white border border-[#EBE7D9] text-[10px] font-bold text-[#1E2E24] uppercase tracking-wider shrink-0">
                <BookOpen size={11} strokeWidth={2} />
                {count}
              </span>
            </li>
          );
        })}
      </ul>
    </Card>
  );
};

export default MostActiveContributors;
