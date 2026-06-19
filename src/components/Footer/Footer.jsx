import Link from "next/link";

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="w-full bg-[#E5E2DC]/60 backdrop-blur-md border-t border-gray-300/30 py-8 px-6 md:px-12 flex flex-col sm:flex-row items-center justify-between gap-4 select-none font-poppins">
      
      {/* Left Column: Brand Labeling info */}
      <div className="flex flex-col items-center sm:items-start space-y-1 text-center sm:text-left">
        <span className="text-base font-bold text-[#2D6A4F] tracking-wide font-serif">
          Terra
        </span>
        <p className="text-[11px] font-normal text-gray-500/90 tracking-wide">
          &copy; {currentYear} Terra Lessons. Rooted in wisdom.
        </p>
      </div>

      {/* Center Links Section */}
      <div className="flex items-center gap-6 text-[11px] font-bold text-gray-600/90 tracking-wider uppercase">
        <Link href="/contact" className="hover:text-[#2D6A4F] transition-colors">
          Contact
        </Link>
        <Link href="/privacy" className="hover:text-[#2D6A4F] transition-colors">
          Privacy Policy
        </Link>
        <Link href="/terms" className="hover:text-[#2D6A4F] transition-colors">
          Terms of Service
        </Link>
      </div>

      {/* Right Column */}
      <div className="flex items-center gap-4 text-gray-500/80">
        <button className="hover:text-[#2D6A4F] transition-colors" aria-label="Accessibility Settings">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
          </svg>
        </button>
        <button className="hover:text-[#2D6A4F] transition-colors" aria-label="Language Selector">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9" />
          </svg>
        </button>
      </div>

    </footer>
  );
}