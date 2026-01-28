import React, { useState, useMemo, useEffect } from 'react';
import { INITIAL_DATA, ENTITY_OPTIONS, STATUS_OPTIONS } from './constants.ts';
import { exportToCSV, generateId, getStatusBadgeClass } from './utils/helpers.ts';
import StatsCards from './components/StatsCards.tsx';
import PackFormModal from './components/PackFormModal.tsx';

export default function App() {
  // Line 9: Removed types to prevent "Missing Initializer" error
  const [packs, setPacks] = useState(() => {
    const saved = localStorage.getItem('ecmw_packs');
    return saved ? JSON.parse(saved) : INITIAL_DATA;
  });

  const [filters, setFilters] = useState({
    search: '', 
    entity: '', 
    status: ''
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

  return (
    <div className="min-h-screen bg-slate-50">
      <nav className="bg-white border-b p-4 flex justify-between items-center sticky top-0 z-50">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-blue-600 rounded flex items-center justify-center">
             <i className="fas fa-database text-white text-xs"></i>
          </div>
          <span className="font-bold text-slate-800">ECMW GLOBAL</span>
        </div>
        <button 
          onClick={() => { setEditingPack(null); setIsModalOpen(true); }}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg font-bold text-sm shadow-lg"
        >
          Add Pack
        </button>
      </nav>

      <main className="p-6 max-w-[1400px] mx-auto">
        <StatsCards packs={filteredPacks} />
        
        <div className="bg-white p-4 rounded-xl border mt-6 shadow-sm flex gap-4">
          <input 
            className="flex-1 p-2 bg-slate-50 border rounded-lg text-sm"
            placeholder="Search packs..."
            value={filters.search}
            onChange={e => setFilters(prev => ({...prev, search: e.target.value}))}
          />
          <select 
            className="p-2 bg-slate-50 border rounded-lg text-sm"
            value={filters.entity}
            onChange={e => setFilters(prev => ({...prev, entity: e.target.value}))}
          >
            <option value="">All Entities</option>
            {ENTITY_OPTIONS.map(o => <option key={o} value={o}>{o}</option>)}
          </select>
        </div>

        <div className="bg-white rounded-xl border mt-6 shadow-sm overflow-hidden">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-slate-50 text-slate-400 text-[10px] uppercase font-bold">
                <th className="p-4 border-b">Entity</th>
                <th className="p-4 border-b">Pack Name</th>
                <th className="p-4 border-b">Status</th>
                <th className="p-4 border-b text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredPacks.map(p => (
                <tr key={p.id} className="border-b hover:bg-slate-50">
                  <td className="p-4 font-bold">{p.entity}</td>
                  <td className="p-4">{p.pack}</td>
                  <td className="p-4">
                    <span className={`px-2 py-0.5 rounded text-[10px] font-bold border ${getStatusBadgeClass(p.status)}`}>
                      {p.status}
                    </span>
                  </td>
                  <td className="p-4 text-right">
                    <button onClick={() => { setEditingPack(p); setIsModalOpen(true); }} className="text-blue-600 font-bold">Edit</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
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
