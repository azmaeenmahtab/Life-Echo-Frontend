import Image from 'next/image';
import Link from 'next/link';
import logo from "@/assets/logo-lifeecho.png";

export default function Navbar() {
  return (
    // Fixed wrapper with padding to give the "floating capsule" look over your content
    <div className="fixed top-4 left-0 right-0 z-50 w-full max-w-7xl mx-auto px-4 md:px-6 pointer-events-none">
      <nav className="pointer-events-auto w-full bg-white/[0.4] dark:bg-black/[0.2] backdrop-blur-xl px-6 py-3.5 flex items-center justify-between rounded-full border border-white/[0.25] shadow-[0_8px_32px_0_rgba(31,38,135,0.07)] transition-all duration-300 hover:shadow-[0_8px_32px_0_rgba(77,124,93,0.15)]">
        
        {/* Left: Logo */}
        <div className="flex items-center gap-2 transition-transform duration-200 hover:scale-102">
          <Image 
            src={logo} 
            alt="Terra Logo" 
            width={140} 
            height={22} 
            className="object-contain"
            priority 
          />
        </div>

        {/* Center: Modern Navigation Links */}
        <div className="hidden md:flex items-center gap-1 text-sm font-medium text-gray-700">
          <Link 
            href="/" 
            className="relative px-4 py-2 text-[#2D6A4F] font-semibold bg-[#2D6A4F]/10 rounded-full transition-all duration-200"
          >
            Home
          </Link>
          <Link 
            href="/public-lessons" 
            className="px-4 py-2 rounded-full text-gray-600 hover:text-[#2D6A4F] hover:bg-white/40 transition-all duration-200"
          >
            Public Lessons
          </Link>
          <Link 
            href="/pricing" 
            className="px-4 py-2 rounded-full text-gray-600 hover:text-[#2D6A4F] hover:bg-white/40 transition-all duration-200"
          >
            Pricing
          </Link>
        </div>

        {/* Right: Auth Actions with Modern Hover Physics */}
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
            {/* Subtle inner reflection glint */}
            <span className="absolute inset-0 w-full h-full bg-linear-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:animate-[shimmer_1.5s_infinite]" />
            <span className="relative z-10">Sign Up</span>
          </Link>
        </div>
      </nav>
    </div>
  );
}