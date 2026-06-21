import React from 'react';
// Assuming Hero UI (NextUI) components are installed
import {  Card, CardBody, Chip } from '@heroui/react'; 
import {   Sparkles  } from 'lucide-react';

// ==========================================
// 1. SUB-COMPONENTS (For a cleaner codebase)
// ==========================================

export const PlanComparisonTable = () => {
  const features = [
    { name: "Number of lessons that can be created", free: "5 lessons", premium: "Unlimited", highlight: true },
    { name: "Premium lesson creation access", free: "No", premium: "Yes" },
    { name: "Ad-free experience", free: "No", premium: "Yes" },
    { name: "Priority listing in public lessons", free: "No", premium: "Yes" },
    { name: "Access to premium content from other users", free: "No", premium: "Yes" },
    { name: "Community badge / verified status", free: "No", premium: "Yes" },
  ];

  return (
    <Card className="bg-[#FAF8F0] border border-[#EBE7D9] shadow-none p-6 md:p-8 rounded-2xl flex-1">
      <CardBody className="p-0 overflow-x-auto">
        <div className="flex justify-between items-center mb-8 min-w-[400px]">
          <h3 className="text-2xl font-serif font-bold text-[#1E2E24]">Compare Plans</h3>
          <Chip 
            startContent={<Sparkles size={14} className="text-amber-600 fill-amber-600" />}
            className="bg-[#FCEFCA] text-[#78590A] border-none font-sans font-medium text-xs"
          >
            Premium Status
          </Chip>
        </div>

        <table className="w-full text-left font-sans text-sm min-w-[400px]">
          <thead>
            <tr className="text-[#606E66] border-b border-[#EBE7D9] pb-4">
              <th className="font-semibold pb-4 w-1/2">Features</th>
              <th className="font-semibold pb-4 text-center">Free</th>
              <th className="font-semibold pb-4 text-right text-[#1B5E3A]">Premium</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#EBE7D9]/60">
            {features.map((feature, index) => (
              <tr key={index} className="hover:bg-[#F4F1E6]/50 transition-colors">
                <td className="py-4 text-[#2E3D34] font-medium">{feature.name}</td>
                <td className="py-4 text-center text-[#606E66]">{feature.free}</td>
                <td className={`py-4 text-right font-semibold ${feature.highlight ? 'text-[#1B5E3A]' : 'text-[#1B5E3A]'}`}>
                  {feature.premium}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </CardBody>
    </Card>
  );
};