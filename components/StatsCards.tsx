import React from 'react';

export default function StatsCards({ packs }) {
  const totalProfiles = packs.reduce((acc, p) => acc + Number(p.countProfiles || 0), 0);
  
  const stats = [
    { label: 'Total Packs', value: packs.length, icon: 'fa-box', color: 'text-blue-600' },
    { label: 'Total Profiles', value: totalProfiles.toLocaleString(), icon: 'fa-users', color: 'text-purple-600' }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {stats.map((stat, i) => (
        <div key={i} className="bg-white p-6 rounded-2xl border shadow-sm flex items-center gap-4">
          <div className={`w-12 h-12 rounded-xl bg-slate-50 flex items-center justify-center ${stat.color}`}>
            <i className={`fas ${stat.icon}`}></i>
          </div>
          <div>
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{stat.label}</p>
            <p className="text-2xl font-black">{stat.value}</p>
          </div>
        </div>
      ))}
    </div>
  );
}
