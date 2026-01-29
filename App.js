import React, { useState, useEffect } from 'https://esm.sh/react@18.2.0';
import { INITIAL_DATA } from './constants.js';
import StatsCards from './components/StatsCards.js';
import PackFormModal from './components/PackFormModal.js';
import { exportToCSV } from './utils/helpers.js';

const App = () => {
  const [packs, setPacks] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingPack, setEditingPack] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    const saved = localStorage.getItem('ecmw_packs');
    if (saved) {
      setPacks(JSON.parse(saved));
    } else {
      setPacks(INITIAL_DATA);
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('ecmw_packs', JSON.stringify(packs));
  }, [packs]);

  const handleAddPack = (newPack) => {
    if (editingPack) {
      setPacks(packs.map(p => p.id === editingPack.id ? { ...newPack, id: p.id } : p));
    } else {
      setPacks([...packs, { ...newPack, id: Date.now().toString() }]);
    }
    setEditingPack(null);
  };

  const deletePack = (id) => {
    if (window.confirm('Are you sure you want to delete this configuration?')) {
      setPacks(packs.filter(p => p.id !== id));
    }
  };

  const filteredPacks = packs.filter(p => 
    p.pack.toLowerCase().includes(searchTerm.toLowerCase()) ||
    p.entity.toLowerCase().includes(searchTerm.toLowerCase()) ||
    p.server.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return React.createElement('div', { className: "min-h-screen bg-slate-50 font-sans" }, 
    // Header
    React.createElement('nav', { className: "bg-white border-b border-slate-200 sticky top-0 z-30" },
      React.createElement('div', { className: "max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center" },
        React.createElement('div', { className: "flex items-center gap-3" },
          React.createElement('div', { className: "bg-blue-600 p-2 rounded-lg" }, 
            React.createElement('i', { className: "fas fa-server text-white text-xl" })
          ),
          React.createElement('h1', { className: "text-xl font-bold text-slate-800 tracking-tight" }, "ECMW Global Pack Manager")
        ),
        React.createElement('button', { 
          onClick: () => exportToCSV(packs),
          className: "text-slate-500 hover:text-blue-600 transition-colors"
        }, React.createElement('i', { className: "fas fa-download text-lg" }))
      )
    ),

    React.createElement('main', { className: "max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8" },
      React.createElement(StatsCards, { packs: packs }),

      // Search & Actions
      React.createElement('div', { className: "flex flex-col md:flex-row gap-4 mb-6" },
        React.createElement('div', { className: "relative flex-1" },
          React.createElement('i', { className: "fas fa-search absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" }),
          React.createElement('input', {
            type: "text",
            placeholder: "Search packs, entities, or servers...",
            className: "w-full pl-10 pr-4 py-2.5 bg-white border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition-all",
            value: searchTerm,
            onChange: (e) => setSearchTerm(e.target.value)
          })
        ),
        React.createElement('button', {
          onClick: () => { setEditingPack(null); setIsModalOpen(true); },
          className: "bg-blue-600 hover:bg-blue-700 text-white px-6 py-2.5 rounded-xl font-semibold flex items-center justify-center gap-2 transition-all shadow-lg shadow-blue-200 active:scale-95"
        }, 
          React.createElement('i', { className: "fas fa-plus" }),
          "Add New Pack"
        )
      ),

      // Table Container
      React.createElement('div', { className: "bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden" },
        React.createElement('div', { className: "overflow-x-auto custom-scrollbar" },
          React.createElement('table', { className: "w-full text-left border-collapse" },
            React.createElement('thead', { className: "bg-slate-50 border-b border-slate-200" },
              React.createElement('tr', null,
                ['Entity', 'Platform', 'Team', 'Pack Name', 'Server', 'Status', 'Actions'].map(header => 
                  React.createElement('th', { key: header, className: "px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider" }, header)
                )
              )
            ),
            React.createElement('tbody', { className: "divide-y divide-slate-100" },
              filteredPacks.map(pack => 
                React.createElement('tr', { key: pack.id, className: "hover:bg-slate-50/50 transition-colors group" },
                  React.createElement('td', { className: "px-6 py-4" }, 
                    React.createElement('span', { className: "font-medium text-slate-700" }, pack.entity),
                    React.createElement('p', { className: "text-xs text-slate-400" }, pack.entityProd)
                  ),
                  React.createElement('td', { className: "px-6 py-4 text-sm text-slate-600" }, pack.platform),
                  React.createElement('td', { className: "px-6 py-4" },
                    React.createElement('span', { className: "px-2.5 py-1 rounded-md bg-slate-100 text-slate-600 text-xs font-medium" }, pack.team)
                  ),
                  React.createElement('td', { className: "px-6 py-4 font-semibold text-blue-600 text-sm" }, pack.pack),
                  React.createElement('td', { className: "px-6 py-4 text-sm text-slate-500" }, pack.server),
                  React.createElement('td', { className: "px-6 py-4" },
                    React.createElement('span', { className: `px-2.5 py-1 rounded-full text-xs font-bold ${
                      pack.status === 'Active' ? 'bg-green-100 text-green-700' : 
                      pack.status === 'Testing' ? 'bg-amber-100 text-amber-700' : 'bg-slate-100 text-slate-600'
                    }` }, pack.status)
                  ),
                  React.createElement('td', { className: "px-6 py-4" },
                    React.createElement('div', { className: "flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity" },
                      React.createElement('button', { 
                        onClick: () => { setEditingPack(pack); setIsModalOpen(true); },
                        className: "p-2 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all"
                      }, React.createElement('i', { className: "fas fa-edit" })),
                      React.createElement('button', { 
                        onClick: () => deletePack(pack.id),
                        className: "p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all"
                      }, React.createElement('i', { className: "fas fa-trash" }))
                    )
                  )
                )
              )
            )
          )
        )
      )
    ),

    React.createElement(PackFormModal, {
      isOpen: isModalOpen,
      onClose: () => { setIsModalOpen(false); setEditingPack(null); },
      onSubmit: handleAddPack,
      initialData: editingPack
    })
  );
};

export default App;
