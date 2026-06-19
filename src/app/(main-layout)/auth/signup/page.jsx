"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";

export default function SignUpPage() {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <div className="min-h-screen bg-[#FAF8F5] pt-28 pb-16 px-4 flex flex-col items-center justify-center relative overflow-hidden selection:bg-[#4D7C5D]/20 font-poppins">
      {/* Ambient background glowing elements */}
      <div className="absolute top-1/4 -left-20 w-80 h-80 bg-[#4D7C5D]/10 rounded-full blur-[100px] pointer-events-none" />
      <div className="absolute bottom-1/4 -right-20 w-80 h-80 bg-[#2D6A4F]/10 rounded-full blur-[100px] pointer-events-none" />

      {/* Main Glassmorphic Container */}
      <div className="w-full max-w-4xl bg-white/[0.35] dark:bg-black/[0.15] backdrop-blur-2xl rounded-3xl border border-white/[0.3] shadow-[0_20px_50px_rgba(0,0,0,0.05)] overflow-hidden grid grid-cols-1 md:grid-cols-12 min-h-[650px] relative z-10">
        
        {/* Left Panel: Hero Graphics & Quote */}
        <div className="md:col-span-5 bg-gradient-to-b from-[#C9D6EA]/60 to-[#4D7C5D]/90 p-8 flex flex-col justify-between relative text-white">
          <div className="absolute inset-0 bg-white/[0.05] backdrop-blur-[2px] pointer-events-none" />
          
          {/* Placeholder Image Center Icon from image_2f385d.png */}
          <div className="relative z-10 flex-1 flex items-center justify-center opacity-70">
            <svg className="w-24 h-24 text-white/80" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 002-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
          </div>

          {/* Typography Bottom Section */}
          <div className="relative z-10 space-y-3">
            <h3 className="text-2xl font-bold font-serif leading-tight tracking-wide">
              &ldquo;Growth is a journey, not a destination.&rdquo;
            </h3>
            <p className="text-xs text-white/90 leading-relaxed font-normal">
              Join 10,000+ wisdom seekers mapping their personal evolution.
            </p>
          </div>
        </div>

        {/* Right Panel: Content Form */}
        <div className="md:col-span-7 p-8 md:p-10 flex flex-col justify-center">
          <div className="text-center md:text-left mb-6">
            {/* Kept font-serif exactly as you requested for your main header */}
            <h2 className="text-3xl font-bold font-serif text-[#2D6A4F] tracking-wide mb-1">
              Create Account
            </h2>
            <p className="text-xs text-gray-500 font-normal">
              Join our community of wisdom seekers
            </p>
          </div>

          <form className="space-y-4" onSubmit={(e) => e.preventDefault()}>
            {/* Full Name */}
            <div>
              <label className="block text-[10px] font-bold text-gray-500 uppercase tracking-wider mb-1.5">Full Name</label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-400">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg>
                </span>
                <input type="text" placeholder="Jane Doe" className="w-full bg-white/50 border border-gray-200/50 rounded-xl py-2.5 pl-10 pr-4 text-sm text-gray-700 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#4D7C5D]/30 focus:bg-white transition-all font-normal" />
              </div>
            </div>

            {/* Email */}
            <div>
              <label className="block text-[10px] font-bold text-gray-500 uppercase tracking-wider mb-1.5">Email Address</label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-400">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>
                </span>
                <input type="email" placeholder="jane@example.com" className="w-full bg-white/50 border border-gray-200/50 rounded-xl py-2.5 pl-10 pr-4 text-sm text-gray-700 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#4D7C5D]/30 focus:bg-white transition-all font-normal" />
              </div>
            </div>

            {/* Photo URL */}
            <div>
              <label className="block text-[10px] font-bold text-gray-500 uppercase tracking-wider mb-1.5">Photo URL (Optional)</label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-400">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
                </span>
                <input type="text" placeholder="https://..." className="w-full bg-white/50 border border-gray-200/50 rounded-xl py-2.5 pl-10 pr-4 text-sm text-gray-700 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#4D7C5D]/30 focus:bg-white transition-all font-normal" />
              </div>
            </div>

            {/* Password */}
            <div>
              <label className="block text-[10px] font-bold text-gray-500 uppercase tracking-wider mb-1.5">Password</label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-400">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" /></svg>
                </span>
                <input type={showPassword ? "text" : "password"} placeholder="••••••••" className="w-full bg-white/50 border border-gray-200/50 rounded-xl py-2.5 pl-10 pr-10 text-sm text-gray-700 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#4D7C5D]/30 focus:bg-white transition-all tracking-widest" />
                <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-400 hover:text-gray-600">
                  {showPassword ? (
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l18 18" /></svg>
                  ) : (
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" /></svg>
                  )}
                </button>
              </div>
            </div>

            {/* Validation Display box */}
            <div className="bg-white/40 border border-gray-100/50 rounded-xl p-3 space-y-1.5 text-[11px] font-normal text-gray-500">
              <div className="flex items-center gap-2"><div className="w-1.5 h-1.5 rounded-full bg-gray-300" /> Must have an uppercase letter</div>
              <div className="flex items-center gap-2"><div className="w-1.5 h-1.5 rounded-full bg-gray-300" /> Must have a lowercase letter</div>
              <div className="flex items-center gap-2"><div className="w-1.5 h-1.5 rounded-full bg-gray-300" /> Length must be at least 8 characters</div>
            </div>

            {/* Action Submit Button */}
            <button type="submit" className="w-full bg-[#4D7C5D] hover:bg-[#3D634A] text-white font-semibold text-sm py-2.5 rounded-xl flex items-center justify-center gap-2 transition-all shadow-md active:scale-[0.99]">
              Sign Up 
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3" /></svg>
            </button>
          </form>

          {/* Divider line style */}
          <div className="relative my-5">
            <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-gray-200/60" /></div>
            <div className="relative flex justify-center text-[10px] font-bold uppercase tracking-wider"><span className="bg-transparent px-3 text-gray-400">OR</span></div>
          </div>

          {/* OAuth Google button */}
          <button className="w-full bg-white/80 hover:bg-white border border-gray-200 text-gray-700 font-semibold text-sm py-2.5 rounded-xl flex items-center justify-center gap-2 transition-all shadow-sm">
            <svg className="w-4 h-4" viewBox="0 0 24 24">
              <path fill="#4285F4" d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v3.92h6.61a5.66 5.66 0 0 1-2.45 3.72v3.08h3.95c2.31-2.13 3.63-5.27 3.63-8.65z"/>
              <path fill="#34A853" d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.95-3.08c-1.1.74-2.51 1.18-3.98 1.18-3.07 0-5.67-2.08-6.6-4.88H1.42v3.18A11.94 11.94 0 0 0 12 24z"/>
              <path fill="#FBBC05" d="M5.4 14.31A7.17 7.17 0 0 1 5 12c0-.8.14-1.58.4-2.31V6.51H1.42A11.94 11.94 0 0 0 0 12c0 1.92.45 3.74 1.26 5.37l4.14-3.06z"/>
              <path fill="#EA4335" d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.34 0 3.31 2.67 1.42 6.51l4.14 3.18c.93-2.8 3.53-4.94 6.6-4.94z"/>
            </svg>
            Continue with Google
          </button>

          {/* Bottom redirection element */}
          <p className="text-center text-xs text-gray-500 font-normal mt-5">
            Already have an account?{" "}
            <Link href="/auth/login" className="text-[#2D6A4F] font-bold hover:underline">
              Log In
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}