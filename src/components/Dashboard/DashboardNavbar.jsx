"use client";

import { useState, useRef, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ChevronDown, Sprout } from "lucide-react";
import { useDashboardSession } from "@/app/(dashboard-layout)/layout";
import { authClient } from "@/lib/auth-client";

export default function DashboardNavbar() {
  const router = useRouter();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  // Reuse the session resolved by the dashboard layout instead of refetching.
  const { session, isPending } = useDashboardSession();
  const user = session?.user;

  // Derive a friendly first name for the greeting
  const firstName = user?.name?.split(" ")[0] || "there";
  const planLabel =
    user?.plan === "pro"
      ? "Pro Plan"
      : user?.plan === "premium"
        ? "Premium Plan"
        : "Free Plan";

  // Close dropdown on outside click
  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDropdownOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLogout = async () => {
    await authClient.signOut({
      fetchOptions: {
        onSuccess: () => {
          setDropdownOpen(false);
          router.push("/auth/login");
        },
      },
    });
  };

  return (
    <header className="w-full bg-transparent">
      <div className="flex items-center justify-between w-full px-6 md:px-10 pb-5">
        {/* Left: Greeting */}
        <div className="flex items-center gap-3">
          <h1 className="text-2xl md:text-3xl font-serif font-bold text-[#1E2E24] tracking-tight">
            {isPending ? "Welcome back" : `Welcome back, ${firstName}`}
          </h1>
          <Sprout
            className="w-7 h-7 md:w-8 md:h-8 text-[#467856]"
            strokeWidth={2}
          />
        </div>

        {/* Right: User profile (no notification) */}
        <div className="relative" ref={dropdownRef}>
          {isPending ? (
            <div
              className="flex items-center gap-2 px-4 py-2 rounded-full bg-white/40 text-sm font-semibold text-gray-500 cursor-not-allowed select-none"
              aria-busy="true"
              aria-live="polite"
            >
              <span className="w-4 h-4 rounded-full border-2 border-gray-300 border-t-[#4D7C5D] animate-spin" />
              <span>Loading…</span>
            </div>
          ) : session ? (
            <button
              onClick={() => setDropdownOpen((prev) => !prev)}
              className="flex items-center gap-3 group"
              type="button"
              aria-haspopup="menu"
              aria-expanded={dropdownOpen}
            >
              {/* Name + Plan (right-aligned) */}
              <div className="hidden sm:flex flex-col items-end leading-tight">
                <span className="text-sm md:text-base font-serif font-semibold text-[#1E2E24] group-hover:text-[#2D6A4F] transition-colors">
                  {user?.name || "User"}
                </span>
                <span className="text-[11px] md:text-xs text-[#7A8A80] font-medium">
                  {planLabel}
                </span>
              </div>

              {/* Avatar */}
              <span className="relative w-10 h-10 md:w-11 md:h-11 rounded-full overflow-hidden bg-gray-100 ring-2 ring-white shadow-sm shrink-0">
                {user?.image ? (
                  <Image
                    src={user.image}
                    alt={user.name || "User Avatar"}
                    width={44}
                    height={44}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <span className="w-full h-full flex items-center justify-center bg-gradient-to-br from-[#4D7C5D] to-[#2D6A4F] text-white font-semibold">
                    {(user?.name || "U").charAt(0).toUpperCase()}
                  </span>
                )}
              </span>

              <ChevronDown
                className={`w-4 h-4 text-[#7A8A80] transition-transform duration-200 ${
                  dropdownOpen ? "rotate-180" : ""
                }`}
              />
            </button>
          ) : null}

          {/* Dropdown Menu */}
          {dropdownOpen && session && (
            <div
              role="menu"
              className="absolute right-0 mt-4 w-56 rounded-2xl bg-white border border-[#EBE7D9] shadow-lg overflow-hidden z-50"
            >
              <div className="px-4 py-3 border-b border-[#F0EDE3]">
                <p className="text-sm font-semibold text-[#1E2E24] truncate">
                  {user?.name || "User"}
                </p>
                <p className="text-xs text-[#7A8A80] truncate">{user?.email}</p>
              </div>
              <div className="py-1">
                <Link
                  href="/dashboard/profile"
                  onClick={() => setDropdownOpen(false)}
                  className="block px-4 py-2 text-sm text-[#1E2E24] hover:bg-[#F5F2EB] transition-colors"
                >
                  Profile
                </Link>
                <Link
                  href="/dashboard/settings"
                  onClick={() => setDropdownOpen(false)}
                  className="block px-4 py-2 text-sm text-[#1E2E24] hover:bg-[#F5F2EB] transition-colors"
                >
                  Settings
                </Link>
                <Link
                  href="/pricing"
                  onClick={() => setDropdownOpen(false)}
                  className="block px-4 py-2 text-sm text-[#1E2E24] hover:bg-[#F5F2EB] transition-colors"
                >
                  {user?.plan === "pro" ? "Manage Plan" : "Upgrade Plan"}
                </Link>
              </div>
              <div className="border-t border-[#F0EDE3] py-1">
                <button
                  type="button"
                  onClick={handleLogout}
                  className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors"
                >
                  Log out
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
