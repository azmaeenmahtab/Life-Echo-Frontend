"use client";

import Image from "next/image";
import Link from "next/link";
import { useState, useRef, useEffect, useSyncExternalStore } from "react";
import logo from "@/assets/logo-lifeecho.png";
import { authClient } from "@/lib/auth-client";
import { useRouter } from "next/navigation";
import {
  faCircleUser,
  faPieChart,
  faArrowRightFromBracket,
  faStar,
  faBars,
  faXmark,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

export default function Navbar() {
  const router = useRouter();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const dropdownRef = useRef(null);
  const mobileMenuRef = useRef(null);

  // `useSyncExternalStore` with a server snapshot of `false` and a
  // client snapshot of `true` is the recommended way to detect "we are
  // on the client" without triggering an extra render or causing a
  // hydration mismatch.
  const mounted = useSyncExternalStore(
    () => () => {},
    () => true,
    () => false,
  );

  // Better-Auth Session management hook.
  // `error` covers both "not authenticated" (session missing/expired) and
  // network/server failures — either way, treat the user as logged out
  // and stop showing the loading spinner once the request settles.
  const { data: session, isPending, error } = authClient.useSession();
  const user = session?.user;

  // Once the session check settles (success or failure), we're done —
  // a non-null `error` simply means there's no active session, so render
  // the unauthenticated UI.
  const sessionResolved = !isPending;
  const hasSessionError = !!error;
  const showLoggedIn = sessionResolved && !hasSessionError && !!session;

  // Attach the outside-click listener. The `mounted` flag (from
  // useSyncExternalStore above) defers any auth-dependent UI to the
  // client only — SSR can't read better-auth's cookies, so rendering
  // different markup on the server vs. the initial client pass would
  // produce a hydration mismatch.
  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDropdownOpen(false);
      }
      if (
        mobileMenuRef.current &&
        !mobileMenuRef.current.contains(event.target)
      ) {
        setMobileMenuOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Close the mobile menu automatically on viewport resize past the `md`
  // breakpoint, so it doesn't stay open (and out of sync) if a user
  // rotates a device or resizes a browser window.
  useEffect(() => {
    function handleResize() {
      if (window.innerWidth >= 768) {
        setMobileMenuOpen(false);
      }
    }
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Handle Logout trigger
  const handleLogout = async () => {
    await authClient.signOut({
      fetchOptions: {
        onSuccess: () => {
          setDropdownOpen(false);
          setMobileMenuOpen(false);
          router.push("/auth/login");
        },
      },
    });
  };

  const navLinks = (
    <>
      <Link
        href="/"
        onClick={() => setMobileMenuOpen(false)}
        className="relative px-4 py-2 text-[#2D6A4F] font-semibold bg-[#2D6A4F]/10 rounded-full md:rounded-full transition-all duration-200"
      >
        Home
      </Link>
      <Link
        href="/lessons/public"
        onClick={() => setMobileMenuOpen(false)}
        className="px-4 py-2 rounded-full text-gray-600 hover:text-[#2D6A4F] hover:bg-white/40 transition-all duration-200"
      >
        Public Lessons
      </Link>
      {user?.plan == "free" && (
        <Link
          href="/pricing"
          onClick={() => setMobileMenuOpen(false)}
          className="px-4 py-2 rounded-full text-gray-600 hover:text-[#2D6A4F] hover:bg-white/40 transition-all duration-200"
        >
          Pricing
        </Link>
      )}
      <Link
        href="/dashboard/add-lesson"
        onClick={() => setMobileMenuOpen(false)}
        className="px-4 py-2 rounded-full text-gray-600 hover:text-[#2D6A4F] hover:bg-white/40 transition-all duration-200"
      >
        Add Lessons
      </Link>
      <Link
        href="/dashboard/my-lessons"
        onClick={() => setMobileMenuOpen(false)}
        className="px-4 py-2 rounded-full text-gray-600 hover:text-[#2D6A4F] hover:bg-white/40 transition-all duration-200"
      >
        My Lessons
      </Link>
    </>
  );

  // Shared auth-actions block (avatar dropdown OR sign-in/sign-up links).
  // Rendered once and reused for both desktop and mobile so the
  // session-state logic never has to be duplicated/forked.
  const authSection =
    !mounted || isPending ? (
      // Stable placeholder rendered on both the server and the
      // initial client pass to keep the SSR and client trees
      // identical (prevents hydration mismatches).
      <div
        className="flex items-center gap-2 px-3 sm:px-4 py-2 rounded-full bg-white/40 text-sm font-semibold text-gray-500 cursor-not-allowed select-none"
        aria-busy="true"
        aria-live="polite"
      >
        <span className="w-4 h-4 rounded-full border-2 border-gray-300 border-t-[#4D7C5D] animate-spin" />
        <span className="hidden sm:inline">Loading…</span>
      </div>
    ) : showLoggedIn ? (
      <div className="relative" ref={dropdownRef}>
        {user?.plan == "pro" && (
          <div className="absolute bg-transparent -top-2 -right-2 font-bold w-5 h-5 flex items-center justify-center">
            <FontAwesomeIcon
              icon={faStar}
              style={{ color: "rgb(255, 212, 59)" }}
            />
          </div>
        )}
        {/* Trigger: Avatar + Name */}
        <button
          onClick={() => setDropdownOpen(!dropdownOpen)}
          className="flex items-center gap-2 pl-1.5 pr-1.5 sm:pr-3 py-1.5 rounded-full bg-white/80 text-gray-700 shadow-sm transition-all hover:border-[#4D7C5D] hover:text-[#2D6A4F] focus:outline-none"
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
          <span className="hidden sm:inline text-sm font-semibold max-w-30 truncate">
            {user?.name || "Wisdom Seeker"}
          </span>
        </button>

        {/* Dropdown */}
        {dropdownOpen && (
          <div className="absolute right-0 sm:-right-10 -top-10 mt-2 w-50 bg-white dark:bg-zinc-900 rounded-3xl shadow-lg py-2 px-1.5 flex flex-col justify-start z-50 text-left animate-in fade-in slide-in-from-top-2 duration-200">
            <div className="px-3 py-2.5 mb-1 border-b border-gray-100 dark:border-gray-800 w-full">
              <p className="text-sm font-bold text-gray-800 dark:text-gray-100 truncate">
                {user?.name || "Wisdom Seeker"}
              </p>
              <p className="text-xs text-gray-500 dark:text-gray-400 truncate mt-0.5">
                {user?.email}
              </p>
            </div>

            <Link
              href={user?.role === "admin" ? "/dashboard/admin" : "/dashboard"}
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
              <FontAwesomeIcon icon={faArrowRightFromBracket} className="w-4" />
              Log Out
            </button>
          </div>
        )}
      </div>
    ) : (
      <div className="flex items-center gap-2 sm:gap-4">
        <Link
          href="/auth/login"
          className="text-sm font-semibold text-gray-700 hover:text-[#2D6A4F] px-3 sm:px-4 py-2 rounded-full hover:bg-white/30 transition-all duration-200"
        >
          Sign In
        </Link>
        <Link
          href="/auth/signup"
          className="relative group bg-[#4D7C5D] text-white text-sm font-semibold px-4 sm:px-6 py-2.5 rounded-full overflow-hidden transition-all duration-300 hover:scale-105 active:scale-98 shadow-sm hover:shadow-[0_4px_20px_rgba(77,124,93,0.4)]"
        >
          <span className="absolute inset-0 w-full h-full bg-linear-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:animate-[shimmer_1.5s_infinite]" />
          <span className="relative z-10">Sign Up</span>
        </Link>
      </div>
    );

  return (
    <div className="fixed top-4 left-0 right-0 z-50 w-full max-w-7xl mx-auto px-4 md:px-6 pointer-events-none">
      <div className="pointer-events-auto" ref={mobileMenuRef}>
        <nav className="w-full bg-white/40 dark:bg-black/20 backdrop-blur-xl px-4 sm:px-6 py-3.5 flex items-center justify-between rounded-full shadow-[0_8px_32px_0_rgba(31,38,135,0.07)] transition-all duration-300 hover:shadow-[0_8px_32px_0_rgba(77,124,93,0.15)]">
          {/* Left: Logo */}
          <Link
            href="/"
            className="flex items-center gap-2 transition-transform duration-200 hover:scale-102 shrink-0"
          >
            <Image
              src={logo}
              alt="Life Echo Logo"
              width={140}
              height={22}
              className="object-contain w-28 sm:w-32 md:w-35 h-auto"
              priority
            />
          </Link>

          {/* Center: Navigation Links (md and up) */}
          <div className="hidden md:flex items-center gap-1 text-sm font-medium text-gray-700">
            {navLinks}
          </div>

          {/* Right: Auth Actions + Mobile Menu Toggle */}
          <div className="flex items-center gap-1 sm:gap-2">
            {authSection}

            {/* Hamburger toggle — small/md devices only */}
            <button
              onClick={() => setMobileMenuOpen((open) => !open)}
              aria-label={mobileMenuOpen ? "Close menu" : "Open menu"}
              aria-expanded={mobileMenuOpen}
              className="md:hidden flex items-center justify-center w-9 h-9 rounded-full bg-white/60 text-gray-700 hover:bg-white/90 hover:text-[#2D6A4F] transition-all duration-200 shrink-0"
            >
              <FontAwesomeIcon
                icon={mobileMenuOpen ? faXmark : faBars}
                className="text-base"
              />
            </button>
          </div>
        </nav>

        {/* Mobile nav-links panel */}
        {mobileMenuOpen && (
          <div className="md:hidden mt-2 bg-white/90 dark:bg-zinc-900/90 backdrop-blur-xl rounded-3xl shadow-[0_8px_32px_0_rgba(31,38,135,0.1)] p-2 flex flex-col gap-0.5 text-sm font-medium text-gray-700 animate-in fade-in slide-in-from-top-2 duration-200">
            {navLinks}
          </div>
        )}
      </div>
    </div>
  );
}
