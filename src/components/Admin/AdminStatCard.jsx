import React from "react";

/**
 * One stat card used in the admin overview row (total users,
 * total public lessons, total reported lessons). Kept presentation
 * only — every value comes in as a prop so the page stays a
 * server component.
 *
 * Visual style matches the existing "Reported Lessons" card on
 * the admin page so the row reads as one consistent strip.
 */
const AdminStatCard = ({ label, value }) => {
  return (
    <div className="rounded-2xl border border-stone-200 bg-white p-6 shadow-sm hover:shadow-md transition-shadow">
      <p className="text-[11px] font-sans font-bold tracking-widest text-[#707E74] uppercase mb-2">
        {label}
      </p>
      <h2 className="text-4xl font-serif font-bold text-[#1E2E24] leading-none">
        {value}
      </h2>
    </div>
  );
};

export default AdminStatCard;
