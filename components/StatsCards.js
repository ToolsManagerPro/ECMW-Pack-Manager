import React, { useState, useEffect } from 'https://esm.sh/react@18.2.0';

const StatsCards = ({ packs = [] }) => {
  const totalPacks = packs.length;
  const totalProfiles = packs.reduce((acc, curr) => acc + (Number(curr.countProfiles) || 0), 0);
  const reportingPacks = packs.filter(p => (p.status || "").toLowerCase().includes('repot')).length;
  
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
      <div className="bg-white p-6 rounded-xl border border-slate-200">
        <p className="text-slate-500 text-sm">Total Packs</p>
        <p className="text-2xl font-bold">{totalPacks}</p>
      </div>
      <div className="bg-white p-6 rounded-xl border border-slate-200">
        <p className="text-slate-500 text-sm">Total Profiles</p>
        <p className="text-2xl font-bold">{totalProfiles.toLocaleString()}</p>
      </div>
      <div className="bg-white p-6 rounded-xl border border-slate-200">
        <p className="text-slate-500 text-sm">Reporting Active</p>
        <p className="text-2xl font-bold text-emerald-600">{reportingPacks}</p>
      </div>
    </div>
  );
};

export default StatsCards;
