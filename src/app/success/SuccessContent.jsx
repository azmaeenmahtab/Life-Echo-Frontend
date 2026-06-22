"use client";

import Link from "next/link";
import { Card, Button } from "@heroui/react";
import { Check, ArrowRight } from "lucide-react";

export default function SuccessContent({ customerEmail, planUpgraded, isAuthenticated, sessionId }) {
  return (
    <div className="min-h-screen bg-[#F5F2EB] flex flex-col items-center justify-center p-4">
      {/* Main Container Card */}
      <Card
        shadow="md"
        className="bg-[#FAF8F3] border border-[#EBE7D9] rounded-[32px] w-full max-w-[480px] p-8 md:p-12 text-center flex flex-col items-center justify-center"
      >
        {/* Success Checkmark Icon */}
        <div className="w-16 h-16 bg-[#E2F0E7] rounded-full flex items-center justify-center text-[#467856] mb-8">
          <Check size={32} strokeWidth={2.5} />
        </div>

        {/* Heading */}
        <h1 className="text-3xl md:text-4xl font-serif font-bold text-[#1E2E24] mb-4 tracking-tight leading-tight">
          Thank you for your purchase!
        </h1>

        {/* Subtext description & email feedback */}
        <p className="text-[#556359] text-base leading-relaxed font-sans mb-2 px-2">
          A receipt has been sent to {customerEmail ? <span className="font-medium text-[#1E2E24]">{customerEmail}</span> : "your email"}.
          {" "}
          {planUpgraded ? (
            <>Your account has been upgraded to <span className="font-semibold text-[#467856]">Premium</span>.</>
          ) : isAuthenticated ? (
            <>Your account has been upgraded to <span className="font-semibold text-[#467856]">Premium</span>.</>
          ) : (
            <span className="text-amber-700 block mt-2 font-medium">
              Please log in to apply your Premium features.
            </span>
          )}
        </p>

        {/* Muted Transaction ID dynamically injected using Stripe's returned ID */}
        <p className="text-xs font-sans tracking-wide uppercase text-[#A0AEA4] font-medium mb-10">
          Transaction ID: #{sessionId.substring(0, 12).toUpperCase()}
        </p>

        {/* Action Buttons */}
        <div className="w-full flex flex-col gap-3 mb-8">
            <Link href="/dashboard">
          <Button
            as={Link}
            
            className="w-full bg-[#467856] hover:bg-[#386145] text-white font-sans font-semibold py-6 rounded-2xl shadow-sm transition-all flex items-center justify-center gap-2 text-base"
            endContent={<ArrowRight size={18} />}
          >
            Go back to Dashboard
          </Button>           
            </Link>
           

          {/* <Link href="https://dashboard.stripe.com/receipts/invoices">
<Button
            as={Link}
             target="_blank"
            variant="bordered"
            className="w-full bg-transparent border border-[#E3DFD3] hover:bg-[#F2EFE6] text-[#467856] font-sans font-semibold py-6 rounded-2xl transition-all text-base"
          >
            View Transaction Details
          </Button>
          </Link> */}
          
        </div>

        {/* Page Indicators */}
        {/* <div className="flex gap-1.5 justify-center items-center mt-2">
          <div className="w-1.5 h-1.5 rounded-full bg-[#E3DFD3]" />
          <div className="w-1.5 h-1.5 rounded-full bg-[#E3DFD3]" />
          <div className="w-1.5 h-1.5 rounded-full bg-[#467856]" />
        </div> */}
      </Card>

      {/* Footer Text */}
      <footer className="mt-8 text-center space-y-1">
        <p className="text-sm font-serif font-bold tracking-wide text-[#467856]">
          LIFE ECHO
        </p>
        <p className="text-[10px] font-sans tracking-[0.2em] font-bold text-[#A2AFA6] uppercase">
         Rooted in Wisdom
        </p>
      </footer>
    </div>
  );
}