import React from "react";
import { Card, Button } from "@heroui/react";
import { AlertCircle, ArrowRight } from "lucide-react";

export default function PaymentCancelled() {
  return (
    <div className="min-h-screen bg-[#F5F2EB] flex flex-col items-center justify-center p-4">
      {/* Main Container Card */}
      <Card 
        shadow="md" 
        className="bg-[#FAF8F3] border border-[#EBE7D9] rounded-[32px] w-full max-w-[480px] p-8 md:p-12 text-center flex flex-col items-center justify-center"
      >
        {/* Error Icon Wrapper */}
        <div className="w-16 h-16 bg-[#FCE8E6] rounded-full flex items-center justify-center text-[#D9383A] mb-8 animate-pulse">
          <AlertCircle size={32} strokeWidth={1.5} />
        </div>

        {/* Heading */}
        <h1 className="text-3xl md:text-4xl font-serif font-bold text-[#1E2E24] mb-4 tracking-tight">
          Payment Cancelled
        </h1>

        {/* Description Description */}
        <p className="text-[#556359] text-base leading-relaxed font-sans mb-10 px-2">
          Your payment process was cancelled and your account has not been upgraded. 
          If this was a mistake, you can try again from the pricing page.
        </p>

        {/* Action Buttons */}
        <div className="w-full space-y-3 mb-8">
          <Button
            as="a"
            href="/pricing" // Adjust route to your pricing page
            className="w-full bg-[#467856] hover:bg-[#386145] text-white font-sans font-semibold py-6 rounded-2xl shadow-sm transition-all flex items-center justify-center gap-2 text-base"
            endContent={<ArrowRight size={18} />}
          >
            Back to Pricing
          </Button>
          
          <Button
            as="a"
            href="/dashboard" // Adjust route to your user dashboard
            variant="bordered"
            className="w-full bg-transparent border border-[#E3DFD3] hover:bg-[#F2EFE6] text-[#467856] font-sans font-semibold py-6 rounded-2xl transition-all text-base"
          >
            Go to Dashboard
          </Button>
        </div>

        {/* Divider line matching the UI layout */}
        <div className="w-full h-[1px] bg-[#EBE7D9]/70 mb-6" />

        {/* Support Link */}
        <p className="text-sm font-sans text-[#707E74]">
          Need help?{" "}
          <a href="/support" className="underline font-medium hover:text-[#467856] transition-colors">
            Contact our support team
          </a>
        </p>
      </Card>

      {/* Footer Branding text */}
      <footer className="mt-8 text-center">
        <span className="text-xs font-sans tracking-[0.2em] font-medium text-[#A2AFA6] uppercase">
          LIFE ECHO — ORGANIC LIVING
        </span>
      </footer>
    </div>
  );
}