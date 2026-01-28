import React, { useState, useMemo, useEffect } from 'react';
import { INITIAL_DATA, ENTITY_OPTIONS, STATUS_OPTIONS, PLATFORM_OPTIONS, TEAM_OPTIONS, LOCATION_OPTIONS } from './constants.ts';
import { exportToCSV, generateId, getStatusBadgeClass } from './utils/helpers.ts';
import StatsCards from './components/StatsCards.tsx';
import PackFormModal from './components/PackFormModal.tsx';

export default function App() {
  // Removed <Pack[]> to prevent Babel parsing errors
  const [packs, setPacks] = useState(() => {
    const saved = localStorage.getItem('ecmw_packs');
    return saved ? JSON.parse(saved) : INITIAL_DATA;
  });

  const [filters, setFilters] = useState({
    search: '', entity: '', status: '', platform: '', localExternal: '', team: ''
  });

  const [sortConfig, setSortConfig] = useState({ key: 'pack', direction: 'asc' });
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
    if (window.confirm('Are you sure you want to delete this?')) {
      setPacks(prev => prev.filter(p => p.id !== id));
    }
  };

  return (
    <div className="min-h-screen bg-slate-50">
      <nav className="bg-white border-b p-4 flex justify-between items-center sticky top-0 z-50 shadow-sm">
        <h1 className="font-bold text-xl text-blue-600">ECMW GLOBAL</h1>
        <button 
          onClick={() => { setEditingPack(null); setIsModalOpen(true); }}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg font-bold shadow-lg shadow-blue-100"
        >
          Add Pack
        </button>
      </nav>

      <main className="p-6 max-w-[1400px] mx-auto">
        <StatsCards packs={filteredPacks} />
        
        <div className="bg-white p-4 rounded-xl border mt-8 shadow-sm overflow-hidden">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-slate-50 text-slate-400 text-xs uppercase">
                <th className="p-4 border-b">Entity</th>
                <th className="p-4 border-b">Pack</th>
                <th className="p-4 border-b">Server</th>
                <th className="p-4 border-b">Status</th>
                <th className="p-4 border-b text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredPacks.map(p => (
                <tr key={p.id} className="border-b hover:bg-slate-50 transition-colors">
                  <td className="p-4 font-bold">{p.entity}</td>
                  <td className="p-4">{p.pack}</td>
                  <td className="p-4 font-mono text-xs">{p.server}</td>
                  <td className="p-4">
                    <span className={`px-2 py-1 rounded-full text-[10px] font-bold border ${getStatusBadgeClass(p.status)}`}>
                      {p.status}
                    </span>
                  </td>
                  <td className="p-4 text-right">
                    <button onClick={() => { setEditingPack(p); setIsModalOpen(true); }} className="text-blue-600 font-bold mr-3">Edit</button>
                    <button onClick={() => handleDeletePack(p.id)} className="text-rose-500 font-bold">Delete</button>
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
