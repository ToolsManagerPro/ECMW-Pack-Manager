import React from 'https://esm.sh/react@18.2.0';

const StatsCards = ({ packs }) => {
  const stats = [
    { 
      label: 'Total Packs', 
      value: packs.length, 
      icon: 'fa-box', 
      color: 'blue' 
    },
    { 
      label: 'Active Prod', 
      value: packs.filter(p => p.status === 'Active').length, 
      icon: 'fa-check-circle', 
      color: 'green' 
    },
    { 
      label: 'In Testing', 
      value: packs.filter(p => p.status === 'Testing').length, 
      icon: 'fa-vial', 
      color: 'amber' 
    },
    { 
      label: 'Teams', 
      value: new Set(packs.map(p => p.team)).size, 
      icon: 'fa-users', 
      color: 'indigo' 
    }
  ];

  return React.createElement('div', { className: "grid grid-cols-1 md:grid-cols-4 gap-4 mb-8" },
    stats.map((stat) => 
      React.createElement('div', { 
        key: stat.label, 
        className: "bg-white p-6 rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition-shadow" 
      },
        React.createElement('div', { className: "flex items-center justify-between" },
          React.createElement('div', null,
            React.createElement('p', { className: "text-sm font-medium text-slate-500 mb-1" }, stat.label),
            React.createElement('h3', { className: "text-2xl font-bold text-slate-800" }, stat.value)
          ),
          React.createElement('div', { className: `bg-${stat.color}-50 p-3 rounded-xl` },
            React.createElement('i', { className: `fas ${stat.icon} text-${stat.color}-600 text-xl` })
          )
        )
      )
    )
  );
};

export default StatsCards;
