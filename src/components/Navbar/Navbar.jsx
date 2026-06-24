"use client";

import Image from "next/image";
import Link from "next/link";
import { useState, useRef, useEffect } from "react";
import logo from "@/assets/logo-lifeecho.png";
import { authClient } from "@/lib/auth-client";
import { useRouter } from "next/navigation";
import {
  faCircleUser,
  faPieChart,
  faArrowRightFromBracket,
  faStar,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

export default function Navbar() {
  const router = useRouter();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  // Better-Auth Session management hook
  const { data: session, isPending } = authClient.useSession();
  console.log("session ", session);
  const user = session?.user;
  console.log("Current User Session:", user);

  // Handle outside click closures to automatically shut the dialogue box
  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDropdownOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Handle Logout trigger
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
    <div className="fixed top-4 left-0 right-0 z-50 w-full max-w-7xl mx-auto px-4 md:px-6 pointer-events-none">
      <nav className="pointer-events-auto w-full bg-white/40 dark:bg-black/20 backdrop-blur-xl px-6 py-3.5 flex items-center justify-between rounded-full shadow-[0_8px_32px_0_rgba(31,38,135,0.07)] transition-all duration-300 hover:shadow-[0_8px_32px_0_rgba(77,124,93,0.15)]">
        {/* Left: Logo */}
        <Link
          href="/"
          className="flex items-center gap-2 transition-transform duration-200 hover:scale-102"
        >
          <Image
            src={logo}
            alt="Terra Logo"
            width={140}
            height={22}
            className="object-contain"
            priority
          />
        </Link>

        {/* Center: Navigation Links */}
        <div className="hidden md:flex items-center gap-1 text-sm font-medium text-gray-700">
          <Link
            href="/"
            className="relative px-4 py-2 text-[#2D6A4F] font-semibold bg-[#2D6A4F]/10 rounded-full transition-all duration-200"
          >
            Home
          </Link>
          <Link
            href="/lessons/public"
            className="px-4 py-2 rounded-full text-gray-600 hover:text-[#2D6A4F] hover:bg-white/40 transition-all duration-200"
          >
            Public Lessons
          </Link>
          {user?.plan == "free" && (
            <Link
              href="/pricing"
              className="px-4 py-2 rounded-full text-gray-600 hover:text-[#2D6A4F] hover:bg-white/40 transition-all duration-200"
            >
              Pricing
            </Link>
          )}

          <Link
            href="/dashboard/add-lesson"
            className="px-4 py-2 rounded-full text-gray-600 hover:text-[#2D6A4F] hover:bg-white/40 transition-all duration-200"
          >
            Add Lessons
          </Link>
          <Link
            href="/dashboard/my-lessons"
            className="px-4 py-2 rounded-full text-gray-600 hover:text-[#2D6A4F] hover:bg-white/40 transition-all duration-200"
          >
            My Lessons
          </Link>
        </div>

        {/* Right: Auth Actions with Dropdown */}
        <div className=" " ref={dropdownRef}>
          {isPending ? (
            // Prevent any auth action while the session is still resolving
            <div
              className="flex items-center gap-2 px-4 py-2 rounded-full bg-white/40 text-sm font-semibold text-gray-500 cursor-not-allowed select-none"
              aria-busy="true"
              aria-live="polite"
            >
              <span className="w-4 h-4 rounded-full border-2 border-gray-300 border-t-[#4D7C5D] animate-spin" />
              <span>Loading…</span>
            </div>
          ) : session ? (
            <div className="relative">
              {user?.plan == "pro" && (
                <div className="absolute bg-transparent -top-2 -right-2  font-bold  w-5 h-5 flex items-center justify-center ">
                  <FontAwesomeIcon
                    icon={faStar}
                    style={{ color: "rgb(255, 212, 59)" }}
                  />
                </div>
              )}
              {/* Trigger: Avatar + Name */}
              <button
                onClick={() => setDropdownOpen(!dropdownOpen)}
                className="flex items-center gap-2 pl-1.5 pr-3 py-1.5 rounded-full bg-white/80 text-gray-700 shadow-sm transition-all hover:border-[#4D7C5D] hover:text-[#2D6A4F] focus:outline-none"
              >
                <span className="w-8 h-8 rounded-full overflow-hidden bg-gray-100 flex items-center justify-center shrink-0">
                  {user?.image ? (
                    <Image
                      src={user.image}
                      alt={user.name || "User Avatar"}
                      width={32}
                      height={32}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <FontAwesomeIcon icon={faCircleUser} className="text-xl" />
                  )}
                </span>
                <span className="text-sm font-semibold max-w-30 truncate">
                  {user?.name || "Wisdom Seeker"}
                </span>
              </button>

              {/* Dropdown */}
              {dropdownOpen && (
                <div className="absolute -right-10 -top-10 mt-2 w-50 bg-white dark:bg-zinc-900  rounded-3xl  shadow-lg py-2 px-1.5 flex flex-col justify-start z-50 text-left animate-in fade-in slide-in-from-top-2 duration-200">
                  <div className="px-3 py-2.5 mb-1 border-b border-gray-100 dark:border-gray-800 w-full">
                    <p className="text-sm font-bold text-gray-800 dark:text-gray-100 truncate">
                      {user?.name || "Wisdom Seeker"}
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-400 truncate mt-0.5">
                      {user?.email}
                    </p>
                  </div>

                  <Link
                    href="/dashboard"
                    onClick={() => setDropdownOpen(false)}
                    className="text-sm font-medium text-gray-700 dark:text-gray-300 hover:text-[#2D6A4F] hover:bg-[#2D6A4F]/10 px-3 py-2.5 rounded-xl transition-all flex items-center gap-2.5 w-full"
                  >
                    <FontAwesomeIcon icon={faPieChart} className="w-4" />
                    Dashboard
                  </Link>

                  <button
                    onClick={handleLogout}
                    className="mt-1 text-sm font-medium text-red-600 hover:bg-red-50 dark:hover:bg-red-950/30 px-3 py-2.5 rounded-xl transition-all flex items-center gap-2.5 text-left w-full"
                  >
                    <FontAwesomeIcon
                      icon={faArrowRightFromBracket}
                      className="w-4"
                    />
                    Log Out
                  </button>
                </div>
              )}
            </div>
          ) : (
            <div className="flex items-center gap-4">
              <Link
                href="/auth/login"
                className="text-sm font-semibold text-gray-700 hover:text-[#2D6A4F] px-4 py-2 rounded-full hover:bg-white/30 transition-all duration-200"
              >
                Sign In
              </Link>
              <Link
                href="/auth/signup"
                className="relative group bg-[#4D7C5D] text-white text-sm font-semibold px-6 py-2.5 rounded-full overflow-hidden transition-all duration-300 hover:scale-105 active:scale-98 shadow-sm hover:shadow-[0_4px_20px_rgba(77,124,93,0.4)]"
              >
                <span className="absolute inset-0 w-full h-full bg-linear-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:animate-[shimmer_1.5s_infinite]" />
                <span className="relative z-10">Sign Up</span>
              </Link>
            </div>
          )}
        </div>
      </nav>
    </div>
  );
}
