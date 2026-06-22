"use client";

import { PlanComparisonTable } from './ComparisonTable';
import { PremiumCheckoutCard } from './CheckoutCard';
import { ValuePropositionProps } from './ValuePropositionProps';
import { Chip } from '@heroui/react';
import { Crown } from 'lucide-react';
import { authClient } from '@/lib/auth-client';

export default function PricingIndex() {
  const { data: session } = authClient.useSession();
  const isPro = session?.user?.plan === 'pro';

  return (
    <div className="min-h-screen bg-[#F6F4EB] pb-16 pt-30 px-4 sm:px-6 lg:px-8 flex flex-col items-center justify-center">
      
      {/* Header Section */}
      <div className="text-center max-w-2xl mx-auto mb-12">
        {/* <Chip 
          className="bg-[#E2F0E7] text-[#1B5E3A] font-sans font-bold text-[10px] tracking-wider mb-4 border-none px-3 py-1"
          endcontent={<span className="text-xs">👁</span>}
        >
          PREMIUM ACCESS
        </Chip> */}

        {isPro && (
          <div className='mb-6'>
<Chip
            startcontent={<Crown size={14} className="text-amber-600 fill-amber-600" />}
            variant="flat"
            className="bg-linear-to-r from-amber-50 to-amber-100  text-amber-800 border border-amber-200/60 font-sans font-semibold text-[11px] tracking-wider uppercase mb-4 px-3 py-1 shadow-sm"
          >
            Premium Member · You already have lifetime access
          </Chip>
          </div>
          
        )}
        <h1 className="text-4xl md:text-5xl font-serif font-black text-[#1E2E24] tracking-tight mb-4">
          Unlock Lifetime Wisdom
        </h1>
        <p className="font-sans text-[#506055] text-base md:text-lg max-w-xl mx-auto leading-relaxed">
          Deepen your journey with Terra. Invest once in your personal growth and access a garden of knowledge that never stops blooming.
        </p>
      </div>

      {/* Main Container */}
      <div className="max-w-5xl w-full flex flex-col lg:flex-row gap-6 items-stretch">
        <PlanComparisonTable />
        <PremiumCheckoutCard />
      </div>

      {/* Footer Value Badges */}
      <ValuePropositionProps />

    </div>
  );
}