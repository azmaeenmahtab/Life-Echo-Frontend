"use client"


import { useState } from 'react';
import { Button, Card, CardBody, Chip } from '@heroui/react';
import { Check,  Lock } from 'lucide-react';


export const PremiumCheckoutCard = () => {
  const [isLoading, setIsLoading] = useState(false);

  const checkoutFeatures = [
    "Lifetime Unlimited Lessons",
    "Exclusive Premium-Only Content",
    "Zero Ad Interruptions",
    "Verified Community Badge"
  ];

const handleCheckout = () => {
  setIsLoading(true);
}

  return (
    <Card className="bg-[#FAF8F0] border border-[#EBE7D9] shadow-md p-6 md:p-8 rounded-2xl w-full lg:w-[420px] shrink-0 self-start">
      <div className="p-0 flex flex-col h-full">
        <div className="flex justify-between items-start mb-1">
          <h3 className="text-2xl font-serif font-bold text-[#1E2E24]">Premium Member</h3>
          <div className="text-right">
            <span className="text-3xl font-serif font-black text-[#1B5E3A] flex items-center justify-end gap-0.5">
              <span className="text-2xl font-sans">৳</span>1500
            </span>
          </div>
        </div>
        <div className="flex justify-between items-center text-xs font-sans text-[#606E66] mb-8 border-b border-[#EBE7D9] pb-4">
          <p>Complete knowledge sovereignty</p>
          <span className="font-bold tracking-wider text-[10px]">ONE-TIME PAYMENT</span>
        </div>

        <div className="space-y-4 mb-8">
          <p className="text-xs font-sans font-bold tracking-wider text-[#606E66]">LIFETIME ACCESS INCLUDED</p>
          {checkoutFeatures.map((text, i) => (
            <div key={i} className="flex items-center gap-3 text-sm font-sans text-[#2E3D34]">
              <div className="bg-[#E2F0E7] p-1 rounded-full text-[#1B5E3A]">
                <Check size={14} strokeWidth={3} />
              </div>
              <p className="font-medium">{text}</p>
            </div>
          ))}
        </div>
        <form action="/api/checkout_sessions" method="POST" onSubmit={handleCheckout}>
          <Button
            type="submit"
            isLoading={isLoading}
            className="w-full bg-[#417453] hover:bg-[#345D42] text-white font-sans font-semibold py-6 rounded-xl shadow-sm transition-all flex items-center justify-center gap-2 mb-4"
            endContent={!isLoading ? <span className="text-lg">→</span> : null}
          >
            {isLoading ? "Redirecting..." : "Upgrade to Premium"}
          </Button>
        </form>

        {/* Social Proof */}
        <div className="flex items-center gap-3 justify-center mb-6">
          <div className="flex -space-x-2 overflow-hidden">
            <img className="inline-block h-7 w-7 rounded-full ring-2 ring-[#FAF8F0]" src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=32&h=32&q=80" alt="User" />
            <img className="inline-block h-7 w-7 rounded-full ring-2 ring-[#FAF8F0]" src="https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=32&h=32&q=80" alt="User" />
            <img className="inline-block h-7 w-7 rounded-full ring-2 ring-[#FAF8F0]" src="https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&w=32&h=32&q=80" alt="User" />
          </div>
          <p className="text-xs font-sans italic text-[#606E66]">Joined by 12,000+ wisdom seekers</p>
        </div>

        {/* Secure badge */}
        <div className="flex justify-between items-center text-[11px] font-sans font-bold tracking-wider text-[#909E96] mt-auto border-t border-[#EBE7D9]/60 pt-4">
          <span>SECURE STRIPE PAYMENT</span>
          <div className="flex items-center gap-1">
            <Lock size={12} />
          </div>
        </div>
      </div>
    </Card>
  );
};