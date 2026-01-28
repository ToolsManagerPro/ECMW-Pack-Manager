import React, { useState, useMemo, useEffect } from 'react';
import { Pack, FilterState, SortConfig } from './types.ts';
import { INITIAL_DATA, ENTITY_OPTIONS, STATUS_OPTIONS, PLATFORM_OPTIONS, TEAM_OPTIONS } from './constants.ts';
import { exportToCSV, generateId, getStatusBadgeClass } from './utils/helpers.ts';
import StatsCards from './components/StatsCards.tsx';
import PackFormModal from './components/PackFormModal.tsx';

const App: React.FC = () => {
  const [packs, setPacks] = useState<Pack[]>(() => {
    const saved = localStorage.getItem('ecmw_packs');
    return saved ? JSON.parse(saved) : INITIAL_DATA;
  });

  const [filters, setFilters] = useState<FilterState>({
    search: '',
    entity: '',
    status: '',
    platform: '',
    localExternal: '',
    team: ''
  });

  const [sortConfig, setSortConfig] = useState<SortConfig>({ key: 'pack', direction: 'asc' });
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingPack, setEditingPack] = useState<Pack | null>(null);

  useEffect(() => {
    localStorage.setItem('ecmw_packs', JSON.stringify(packs));
  }, [packs]);

  const filteredPacks = useMemo(() => {
    let result = packs.filter(p => {
      const matchesSearch = Object.values(p).some(val => 
        String(val).toLowerCase().includes(filters.search.toLowerCase())
      );
      const matchesEntity = !filters.entity || p.entity === filters.entity;
      const matchesStatus = !filters.status || p.status === filters.status;
      const matchesPlatform = !filters.platform || p.platform === filters.platform;
      const matchesLocation = !filters.localExternal || p.localExternal === filters.localExternal;
      const matchesTeam = !filters.team || p.team === filters.team;
      return matchesSearch && matchesEntity && matchesStatus && matchesPlatform && matchesLocation && matchesTeam;
    });

    result.sort((a, b) => {
      const aVal = a[sortConfig.key];
      const bVal = b[sortConfig.key];
      if (typeof aVal === 'number' && typeof bVal === 'number') {
        return sortConfig.direction === 'asc' ? aVal - bVal : bVal - aVal;
      }
      const aStr = String(aVal).toLowerCase();
      const bStr = String(bVal).toLowerCase();
      if (aStr < bStr) return sortConfig.direction === 'asc' ? -1 : 1;
      if (aStr > bStr) return sortConfig.direction === 'asc' ? 1 : -1;
      return 0;
    });
    return result;
  }, [packs, filters, sortConfig]);

  const handleSort = (key: keyof Pack) => {
    setSortConfig(prev => ({
      key,
      direction: prev.key === key && prev.direction === 'asc' ? 'desc' : 'asc'
    }));
  };

  const handleAddPack = (newPack: Pack) => {
    const packWithId = { ...newPack, id: generateId() };
    setPacks(prev => [packWithId, ...prev]);
  };

  const handleUpdatePack = (updatedPack: Pack) => {
    setPacks(prev => prev.map(p => p.id === updatedPack.id ? updatedPack : p));
  };

  const handleDeletePack = (id: string) => {
    if (window.confirm('Are you sure you want to delete this pack?')) {
      setPacks(prev => prev.filter(p => p.id !== id));
    }
  };

  return (
    <div className="min-h-screen pb-12 font-sans">
      <nav className="bg-white border-b border-slate-200 px-6 py-4 flex items-center justify-between sticky top-0 z-40 shadow-sm">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center">
            <i className="fas fa-database text-white text-xl"></i>
          </div>
          <div>
            <h1 className="text-xl font-bold text-slate-800">ECMW GLOBAL</h1>
            <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">Fleet Manager</p>
          </div>
        </div>
        <div className="flex gap-4">
          <button onClick={() => exportToCSV(filteredPacks)} className="px-4 py-2 text-slate-600 hover:bg-slate-100 rounded-lg font-semibold text-sm">
            Export CSV
          </button>
          <button onClick={() => { setEditingPack(null); setIsModalOpen(true); }} className="px-5 py-2 bg-blue-600 text-white rounded-xl font-bold text-sm shadow-lg shadow-blue-100">
            Add Pack
          </button>
        </div>
      </nav>

      <main className="container mx-auto px-4 mt-8 max-w-[1600px]">
        <StatsCards packs={filteredPacks} />

        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6 mb-8 mt-8">
           <div className="grid grid-cols-1 md:grid-cols-4 lg:grid-cols-6 gap-4">
              <input 
                type="text" 
                placeholder="Search..." 
                className="md:col-span-2 p-2 bg-slate-50 border rounded-lg"
                value={filters.search}
                onChange={e => setFilters(prev => ({...prev, search: e.target.value}))}
              />
              <select className="p-2 bg-slate-50 border rounded-lg" value={filters.entity} onChange={e => setFilters(prev => ({...prev, entity: e.target.value}))}>
                <option value="">All Entities</option>
                {ENTITY_OPTIONS.map(o => <option key={o} value={o}>{o}</option>)}
              </select>
              <select className="p-2 bg-slate-50 border rounded-lg" value={filters.status} onChange={e => setFilters(prev => ({...prev, status: e.target.value}))}>
                <option value="">All Statuses</option>
                {STATUS_OPTIONS.map(o => <option key={o} value={o}>{o}</option>)}
              </select>
           </div>
        </div>

        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
          <table className="w-full text-left">
            <thead className="bg-slate-50 border-b border-slate-200">
              <tr>
                <th onClick={() => handleSort('entity')} className="px-6 py-4 text-xs font-bold uppercase cursor-pointer">Entity</th>
                <th className="px-6 py-4 text-xs font-bold uppercase">Pack Name</th>
                <th className="px-6 py-4 text-xs font-bold uppercase">Status</th>
                <th className="px-6 py-4 text-xs font-bold uppercase text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredPacks.map(pack => (
                <tr key={pack.id} className="border-b border-slate-100 hover:bg-slate-50">
                  <td className="px-6 py-4 font-bold">{pack.entity}</td>
                  <td className="px-6 py-4 font-medium text-slate-800">{pack.pack}</td>
                  <td className="px-6 py-4">
                    <span className={`px-2.5 py-0.5 rounded-full text-xs font-bold border ${getStatusBadgeClass(pack.status)}`}>
                      {pack.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <button onClick={() => { setEditingPack(pack); setIsModalOpen(true); }} className="text-blue-600 mr-4 font-bold">Edit</button>
                    <button onClick={() => handleDeletePack(pack.id)} className="text-rose-500 font-bold">Delete</button>
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
};

export default App;
