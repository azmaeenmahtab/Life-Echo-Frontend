"use client";

import { useState, useTransition } from "react";
import { ChevronDown } from "lucide-react";
import toast from "react-hot-toast";

/**
 * Inline role chip + dropdown for the admin /dashboard/admin/manage/users
 * table. Lets an admin flip a target user's role between "user" and
 * "admin" without leaving the page.
 *
 * Calls the route handler at `/api/admin/users/role`, which delegates
 * to `auth.api.setRole` on the better-auth admin plugin. The plugin
 * enforces admin-only access server-side, so a non-admin caller will
 * see the toast error and the chip will roll back to its previous
 * value.
 *
 * When `isSelf` is true (admin changing their own role to "user"), a
 * confirmation modal is shown first to prevent accidental self-demote.
 *
 * Props:
 *   - userId:   string, the target user's id
 *   - role:     string, the current role ("user" | "admin")
 *   - isSelf:   boolean, true when this row represents the logged-in admin
 *   - onChange: optional callback receiving the new role after the
 *               server confirms the update. Used by the parent table
 *               to keep its in-memory row in sync.
 */
const ROLE_OPTIONS = ["user", "admin"];

export default function RoleSelector({ userId, role, isSelf, onChange }) {
  const initial = (role || "user").toString().toLowerCase();
  const [current, setCurrent] = useState(initial);
  const [open, setOpen] = useState(false);
  const [pending, startTransition] = useTransition();
  // Pending demote that needs confirmation before we hit the API.
  const [pendingSelfDemote, setPendingSelfDemote] = useState(null);

  const isAdmin = current === "admin";

  // Actual PATCH against the route handler.
  const submitRoleChange = (next, previous) => {
    startTransition(async () => {
      try {
        const res = await fetch("/api/admin/users/role", {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ userId, role: next }),
        });
        if (!res.ok) {
          let message = "Failed to update role";
          try {
            const errBody = await res.json();
            if (errBody?.error) message = errBody.error;
          } catch (_) {}
          throw new Error(message);
        }
        toast.success(`Role updated to ${next}`);
        onChange?.(next);
      } catch (error) {
        // Roll back on failure (e.g. caller isn't an admin, target id
        // not found, plugin rejected the request).
        setCurrent(previous);
        console.error("changeUserRole failed:", error);
        toast.error(error?.message || "Failed to update role");
      }
    });
  };

  const handleSelect = (next) => {
    if (!next || next === current) {
      setOpen(false);
      return;
    }
    setOpen(false);
    const previous = current;

    // If an admin is demoting themselves, force a confirmation step.
    if (isSelf && isAdmin && next === "user") {
      setPendingSelfDemote({ next, previous });
      return;
    }

    // Optimistic flip so the chip swaps immediately.
    setCurrent(next);
    submitRoleChange(next, previous);
  };

  const confirmSelfDemote = () => {
    if (!pendingSelfDemote) return;
    const { next, previous } = pendingSelfDemote;
    setPendingSelfDemote(null);
    setCurrent(next);
    submitRoleChange(next, previous);
  };

  const cancelSelfDemote = () => {
    setPendingSelfDemote(null);
  };

  return (
    <div className="relative inline-flex flex-col items-start gap-1">
      <span
        className={
          "inline-flex items-center px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider border " +
          (isAdmin
            ? "bg-[#f5e9d4] text-[#a17236] border-[#e8d6b4]"
            : "bg-[#e2f2e9] text-[#2e7d32] border-[#cfe5d3]")
        }
      >
        {current}
      </span>
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        disabled={pending}
        className="inline-flex items-center gap-0.5 text-[10px] font-bold text-[#556359] hover:text-[#2e7d32] transition-colors ml-1 uppercase tracking-wider disabled:opacity-50 disabled:cursor-not-allowed"
      >
        Change
        <ChevronDown
          size={11}
          className={`transition-transform duration-200 ${open ? "rotate-180" : ""}`}
        />
      </button>

      {open && (
        <div
          className="absolute left-0 top-full mt-1 z-20 min-w-[140px] bg-[#FAF8F3] border border-[#EBE7D9] rounded-xl shadow-xl py-1"
          onMouseLeave={() => setOpen(false)}
        >
          {ROLE_OPTIONS.map((option) => {
            const isActive = current === option;
            return (
              <button
                key={option}
                type="button"
                disabled={pending}
                onClick={() => handleSelect(option)}
                className={
                  "w-full text-left px-3 py-1.5 text-[10px] font-bold uppercase tracking-wider transition-colors flex items-center justify-between " +
                  (isActive
                    ? "text-[#2e7d32] bg-emerald-50"
                    : "text-[#556359] hover:bg-[#F2EFE6] hover:text-[#1E2E24]") +
                  " disabled:opacity-50 disabled:cursor-not-allowed"
                }
              >
                <span>{option}</span>
                {isActive && <span className="text-[#2e7d32]">✓</span>}
              </button>
            );
          })}
        </div>
      )}

      {pendingSelfDemote && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm px-4"
          role="dialog"
          aria-modal="true"
          aria-labelledby="self-demote-title"
          onClick={cancelSelfDemote}
        >
          <div
            className="w-full max-w-md bg-[#FAF8F3] border border-[#EBE7D9] rounded-2xl shadow-2xl p-6"
            onClick={(e) => e.stopPropagation()}
          >
            <h3
              id="self-demote-title"
              className="font-serif font-bold text-lg text-[#1E2E24]"
            >
              Demote yourself to user?
            </h3>
            <p className="mt-2 text-sm text-[#556359] leading-relaxed">
              You&apos;re about to change your own role from{" "}
              <span className="font-bold text-[#a17236]">admin</span> to{" "}
              <span className="font-bold text-[#2e7d32]">user</span>.
              You&apos;ll lose access to the admin dashboard, user management,
              and any moderation tools. Another admin will need to restore your
              role afterward.
            </p>

            <div className="mt-6 flex items-center justify-end gap-2">
              <button
                type="button"
                onClick={cancelSelfDemote}
                disabled={pending}
                className="px-4 py-2 rounded-xl text-xs font-bold uppercase tracking-wider border border-[#EBE7D9] bg-white text-[#556359] hover:bg-[#F2EFE6] hover:text-[#1E2E24] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={confirmSelfDemote}
                disabled={pending}
                className="px-4 py-2 rounded-xl  text-xs font-bold uppercase tracking-wider bg-[#1E2E24] text-red-500 hover:bg-[#142019] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {pending ? "Updating…" : "Yes, demote me"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
