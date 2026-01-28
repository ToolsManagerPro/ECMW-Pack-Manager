import React from 'react';
import { Pack } from '../types.ts';

interface StatsCardsProps {
  packs: Pack[];
}

const StatsCards: React.FC<StatsCardsProps> = ({ packs }) => {
  const totalProfiles = packs.reduce((acc, p) => acc + Number(p.countProfiles || 0), 0);
  const activePacks = packs.filter(p => p.status.toLowerCase().includes('repot') || p.status.toLowerCase().includes('active')).length;
  const errorPacks = packs.filter(p => p.status.toLowerCase().includes('error') || p.status.toLowerCase().includes('down')).length;

  const stats = [
    { label: 'Total Packs', value: packs.length, icon: 'fa-box', color: 'text-blue-600', bg: 'bg-blue-50' },
    { label: 'Total Profiles', value: totalProfiles.toLocaleString(), icon: 'fa-users', color: 'text-purple-600', bg: 'bg-purple-50' },
    { label: 'Active/Reporting', value: activePacks, icon: 'fa-check-circle', color: 'text-emerald-600', bg: 'bg-emerald-50' },
    { label: 'Issues/Down', value: errorPacks, icon: 'fa-exclamation-triangle', color: 'text-rose-600', bg: 'bg-rose-50' }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {stats.map((stat, i) => (
        <div key={i} className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex items-center gap-5">
          <div className={`w-12 h-12 ${stat.bg} ${stat.color} rounded-xl flex items-center justify-center text-xl`}>
            <i className={`fas ${stat.icon}`}></i>
          </div>
          <div>
            <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">{stat.label}</p>
            <p className="text-2xl font-black text-slate-800">{stat.value}</p>
          </div>
        </div>
      ))}
    </div>
  );
};

export default StatsCards;
