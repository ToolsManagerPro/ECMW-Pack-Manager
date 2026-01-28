import React, { useState, useMemo, useEffect } from 'react';
import { INITIAL_DATA, ENTITY_OPTIONS, STATUS_OPTIONS, PLATFORM_OPTIONS, TEAM_OPTIONS, LOCATION_OPTIONS } from './constants.ts';
import { exportToCSV, generateId, getStatusBadgeClass } from './utils/helpers.ts';
import StatsCards from './components/StatsCards.tsx';
import PackFormModal from './components/PackFormModal.tsx';

export default function App() {
  // Simplified state declarations to avoid Babel parsing errors
  const [packs, setPacks] = useState(() => {
    const saved = localStorage.getItem('ecmw_packs');
    return saved ? JSON.parse(saved) : INITIAL_DATA;
  });

  const [filters, setFilters] = useState({
    search: '', 
    entity: '', 
    status: '', 
    platform: '', 
    localExternal: '', 
    team: ''
  });

  const [sortConfig, setSortConfig] = useState({ 
    key: 'pack', 
    direction: 'asc' 
  });
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingPack, setEditingPack] = useState(null);

  useEffect(() => {
    localStorage.setItem('ecmw_packs', JSON.stringify(packs));
  }, [packs]);

  const filteredPacks = useMemo(() => {
    return packs.filter(p => {
      const matchesSearch = Object.values(p).some(val => 
        String(val).toLowerCase().includes(filters.search.toLowerCase())
      );
      const matchesEntity = !filters.entity || p.entity === filters.entity;
      const matchesStatus = !filters.status || p.status === filters.status;
      return matchesSearch && matchesEntity && matchesStatus;
    });
  }, [packs, filters]);

  const handleAddPack = (newPack) => {
    setPacks(prev => [{ ...newPack, id: generateId() }, ...prev]);
  };

  const handleUpdatePack = (updatedPack) => {
    setPacks(prev => prev.map(p => p.id === updatedPack.id ? updatedPack : p));
  };

  const handleDeletePack = (id) => {
    if (window.confirm('Are you sure you want to delete this pack?')) {
      setPacks(prev => prev.filter(p => p.id !== id));
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 font-sans">
      {/* Navbar */}
      <nav className="bg-white border-b p-4 flex justify-between items-center sticky top-0 z-50 shadow-sm">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-blue-600 rounded flex items-center justify-center">
            <i className="fas fa-server text-white text-sm"></i>
          </div>
          <h1 className="font-bold text-lg text-slate-800 tracking-tight">ECMW GLOBAL</h1>
        </div>
        <div className="flex gap-3">
          <button 
            onClick={() => exportToCSV(filteredPacks)} 
            className="px-3 py-1.5 text-slate-600 hover:bg-slate-100 rounded-lg text-sm font-semibold transition-colors"
          >
            <i className="fas fa-file-csv mr-2"></i>Export
          </button>
          <button 
            onClick={() => { setEditingPack(null); setIsModalOpen(true); }} 
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-bold text-sm shadow-md transition-all active:scale-95"
          >
            <i className="fas fa-plus mr-2"></i>Add Pack
          </button>
        </div>
      </nav>

      <main className="p-6 max-w-[1400px] mx-auto">
        <StatsCards packs={filteredPacks} />

        {/* Filter Bar */}
        <div className="bg-white p-4 rounded-xl border mt-6 shadow-sm flex flex-wrap gap-4">
          <div className="flex-1 min-w-[200px] relative">
            <i className="fas fa-search absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"></i>
            <input 
              type="text" 
              placeholder="Search packs..." 
              className="w-full pl-10 pr-4 py-2 bg-slate-50 border rounded-lg text-sm focus:ring-2 focus:ring-blue-500 outline-none"
              value={filters.search}
              onChange={e => setFilters(prev => ({...prev, search: e.target.value}))}
            />
          </div>
          <select 
            className="p-2 bg-slate-50 border rounded-lg text-sm outline-none" 
            value={filters.entity} 
            onChange={e => setFilters(prev => ({...prev, entity: e.target.value}))}
          >
            <option value="">All Entities</option>
            {ENTITY_OPTIONS.map(o => <option key={o} value={o}>{o}</option>)}
          </select>
          <select 
            className="p-2 bg-slate-50 border rounded-lg text-sm outline-none" 
            value={filters.status} 
            onChange={e => setFilters(prev => ({...prev, status: e.target.value}))}
          >
            <option value="">All Statuses</option>
            {STATUS_OPTIONS.map(o => <option key={o} value={o}>{o}</option>)}
          </select>
        </div>

        {/* Table */}
        <div className="bg-white rounded-xl border mt-6 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50 text-slate-500 text-[11px] font-bold uppercase tracking-wider">
                  <th className="p-4 border-b">Entity</th>
                  <th className="p-4 border-b">Pack Name</th>
                  <th className="p-4 border-b">Server / IP</th>
                  <th className="p-4 border-b">Status</th>
                  <th className="p-4 border-b text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="text-sm divide-y">
                {filteredPacks.map(p => (
                  <tr key={p.id} className="hover:bg-slate-50/50 transition-colors">
                    <td className="p-4 font-bold text-slate-700">{p.entity}</td>
                    <td className="p-4 font-medium">{p.pack}</td>
                    <td className="p-4 font-mono text-xs text-slate-500">{p.server}</td>
                    <td className="p-4">
                      <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold border ${getStatusBadgeClass(p.status)}`}>
                        {p.status}
                      </span>
                    </td>
                    <td className="p-4 text-right">
                      <div className="flex justify-end gap-2">
                        <button 
                          onClick={() => { setEditingPack(p); setIsModalOpen(true); }} 
                          className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                        >
                          <i className="fas fa-edit"></i>
                        </button>
                        <button 
                          onClick={() => handleDeletePack(p.id)} 
                          className="p-2 text-rose-500 hover:bg-rose-50 rounded-lg transition-colors"
                        >
                          <i className="fas fa-trash-alt"></i>
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </main>

      <PackFormModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        onSubmit={editingPack ? handleUpdatePack : handleAddPack} 
        initialData={editingPack} 
      />
    </div>
  );
}
