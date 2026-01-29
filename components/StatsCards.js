
import React from 'react';

// ... rest of the component code ...

const StatsCards = ({ packs }) => {
  const totalPacks = packs.length;
  const totalProfiles = packs.reduce((acc, curr) => acc + (Number(curr.countProfiles) || 0), 0);
  const reportingPacks = packs.filter(p => p.status.toLowerCase().includes('repot')).length;
  const localPacks = packs.filter(p => p.localExternal === 'Local').length;
  const externalPacks = totalPacks - localPacks;

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
      <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
        <div className="flex items-center justify-between mb-2">
          <span className="text-slate-500 text-sm font-medium">Total Packs</span>
          <div className="w-8 h-8 bg-blue-50 rounded-lg flex items-center justify-center text-blue-600"><i className="fas fa-boxes"></i></div>
        </div>
        <div className="text-2xl font-bold text-slate-900">{totalPacks}</div>
        <div className="mt-1 text-xs text-slate-400">Total configured instances</div>
      </div>

      <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
        <div className="flex items-center justify-between mb-2">
          <span className="text-slate-500 text-sm font-medium">Total Profiles</span>
          <div className="w-8 h-8 bg-emerald-50 rounded-lg flex items-center justify-center text-emerald-600"><i className="fas fa-users"></i></div>
        </div>
        <div className="text-2xl font-bold text-slate-900">{totalProfiles.toLocaleString()}</div>
        <div className="mt-1 text-xs text-emerald-500 font-medium">Aggregated profile count</div>
      </div>

      <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
        <div className="flex items-center justify-between mb-2">
          <span className="text-slate-500 text-sm font-medium">Active Reporting</span>
          <div className="w-8 h-8 bg-indigo-50 rounded-lg flex items-center justify-center text-indigo-600"><i className="fas fa-chart-line"></i></div>
        </div>
        <div className="text-2xl font-bold text-slate-900">{reportingPacks}</div>
        <div className="mt-1 text-xs text-indigo-500 font-medium">{Math.round((reportingPacks / (totalPacks || 1)) * 100)}% active</div>
      </div>

      <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
        <div className="flex items-center justify-between mb-2">
          <span className="text-slate-500 text-sm font-medium">Hosting Mix</span>
          <div className="w-8 h-8 bg-amber-50 rounded-lg flex items-center justify-center text-amber-600"><i className="fas fa-server"></i></div>
        </div>
        <div className="flex items-baseline gap-2">
          <div className="text-2xl font-bold text-slate-900">{localPacks}</div>
          <div className="text-xs text-slate-400 font-medium">Local</div>
          <div className="text-slate-300 mx-1">/</div>
          <div className="text-2xl font-bold text-slate-900">{externalPacks}</div>
          <div className="text-xs text-slate-400 font-medium">External</div>
        </div>
        <div className="mt-1 text-xs text-slate-400">Distribution of hosting types</div>
      </div>
    </div>
  );
};

export default StatsCards;
