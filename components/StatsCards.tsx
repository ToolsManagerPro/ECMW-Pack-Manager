import React from 'react';

export default function StatsCards({ packs }) {
  const totalPacks = packs.length;
  const totalProfiles = packs.reduce((acc, p) => acc + (parseInt(p.countProfiles) || 0), 0);
  const issues = packs.filter(p => {
    const s = (p.status || '').toLowerCase();
    return s.includes('down') || s.includes('hold');
  }).length;

  const stats = [
    { label: 'Total Packs', value: totalPacks, icon: 'fa-box', color: 'text-blue-600', bg: 'bg-blue-50' },
    { label: 'Active Profiles', value: totalProfiles.toLocaleString(), icon: 'fa-users', color: 'text-indigo-600', bg: 'bg-indigo-50' },
    { label: 'System Issues', value: issues, icon: 'fa-triangle-exclamation', color: 'text-rose-600', bg: 'bg-rose-50' }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      {stats.map((s, i) => (
        <div key={i} className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex items-center gap-5">
          <div className={`w-12 h-12 ${s.bg} ${s.color} rounded-xl flex items-center justify-center text-lg`}>
            <i className={`fas ${s.icon}`}></i>
          </div>
          <div>
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{s.label}</p>
            <p className="text-2xl font-black text-slate-800">{s.value}</p>
          </div>
        </div>
      ))}
    </div>
  );
}
