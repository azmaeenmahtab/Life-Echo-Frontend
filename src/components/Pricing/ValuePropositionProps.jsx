import { Card } from '@heroui/react'; 
import { ShieldCheck, Heart } from 'lucide-react';


export const ValuePropositionProps = () => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6 max-w-5xl w-full">
      <Card className="bg-[#FCEFCA]/60 border border-[#F5E1A4] shadow-none p-5 rounded-2xl">
        <div className="p-0 flex flex-row items-start gap-4">
          <div className="text-[#78590A] mt-1">
            <Heart size={20} className="fill-none" />
          </div>
          <div>
            <h4 className="font-sans font-bold text-sm text-[#4A3B12] mb-1">Support the Mission</h4>
            <p className="font-sans text-xs text-[#6B5A2B] leading-relaxed">
              Your contribution helps us keep high-quality wisdom accessible for everyone.
            </p>
          </div>
        </div>
      </Card>

      <Card className="bg-[#E2F0E7]/80 border border-[#C5E2CF] shadow-none p-5 rounded-2xl">
        <div className="p-0 flex flex-row items-start gap-4">
          <div className="text-[#1B5E3A] mt-1">
            <ShieldCheck size={22} />
          </div>
          <div>
            <h4 className="font-sans font-bold text-sm text-[#143D26] mb-1">Lifetime Value</h4>
            <p className="font-sans text-xs text-[#2A5C3F] leading-relaxed">
              Pay once, grow forever. No monthly subscriptions or hidden fees.
            </p>
          </div>
        </div>
      </Card>
    </div>
  );
};