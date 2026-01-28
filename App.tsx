import React, { useState, useMemo, useEffect } from 'react';
import { Pack, FilterState, SortConfig } from './types.ts';
import { INITIAL_DATA, ENTITY_OPTIONS, STATUS_OPTIONS, PLATFORM_OPTIONS, TEAM_OPTIONS, LOCATION_OPTIONS } from './constants.ts';
import { exportToCSV, generateId, getStatusBadgeClass } from './utils/helpers.ts';
import StatsCards from './components/StatsCards.tsx';
import PackFormModal from './components/PackFormModal.tsx';

export default function App() {
  const [packs, setPacks] = useState<Pack[]>(() => {
    const saved = localStorage.getItem('ecmw_packs');
    return saved ? JSON.parse(saved) : INITIAL_DATA;
  });

  const [filters, setFilters] = useState<FilterState>({
    search: '', entity: '', status: '', platform: '', localExternal: '', team: ''
  });

  const [sortConfig, setSortConfig] = useState<SortConfig>({ key: 'pack', direction: 'asc' });
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingPack, setEditingPack] = useState<Pack | null>(null);

  useEffect(() => {
    localStorage.setItem('ecmw_packs', JSON.stringify(packs));
  }, [packs]);

  const filteredPacks = useMemo(() => {
    let result = packs.filter(p => {
      const matchesSearch = Object.values(p).some(val => String(val).toLowerCase().includes(filters.search.toLowerCase()));
      const matchesEntity = !filters.entity || p.entity === filters.entity;
      const matchesStatus = !filters.status || p.status === filters.status;
      return matchesSearch && matchesEntity && matchesStatus;
    });
    return result;
  }, [packs, filters]);

  const handleAddPack = (newPack: Pack) => {
    setPacks(prev => [{ ...newPack, id: generateId() }, ...prev]);
  };

  const handleUpdatePack = (updatedPack: Pack) => {
    setPacks(prev => prev.map(p => p.id === updatedPack.id ? updatedPack : p));
  };

  return (
    <div className="min-h-screen bg-slate-50">
      <nav className="bg-white border-b p-4 flex justify-between items-center sticky top-0 z-50">
        <h1 className="font-bold text-xl text-blue-600">ECMW MANAGER</h1>
        <button onClick={() => { setEditingPack(null); setIsModalOpen(true); }} className="bg-blue-600 text-white px-4 py-2 rounded-lg font-bold">Add Pack</button>
      </nav>
      <main className="p-6 max-w-[1400px] mx-auto">
        <StatsCards packs={filteredPacks} />
        <div className="bg-white p-4 rounded-xl border mt-6 shadow-sm overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="text-slate-400 text-xs uppercase">
                <th className="p-3">Entity</th>
                <th className="p-3">Pack</th>
                <th className="p-3">Server</th>
                <th className="p-3">Status</th>
                <th className="p-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredPacks.map(p => (
                <tr key={p.id} className="border-t hover:bg-slate-50">
                  <td className="p-3 font-bold">{p.entity}</td>
                  <td className="p-3">{p.pack}</td>
                  <td className="p-3 font-mono text-xs">{p.server}</td>
                  <td className="p-3">
                    <span className={`px-2 py-1 rounded text-[10px] font-bold border ${getStatusBadgeClass(p.status)}`}>{p.status}</span>
                  </td>
                  <td className="p-3 text-right">
                    <button onClick={() => { setEditingPack(p); setIsModalOpen(true); }} className="text-blue-600 font-bold mr-2">Edit</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </main>
      <PackFormModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} onSubmit={editingPack ? handleUpdatePack : handleAddPack} initialData={editingPack} />
    </div>
  );
}
