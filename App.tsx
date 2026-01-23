
import React, { useState, useMemo, useEffect } from 'react';
import { Pack, SortConfig, FilterState } from './types';
import { INITIAL_DATA, ENTITY_OPTIONS, STATUS_OPTIONS, PLATFORM_OPTIONS, TEAM_OPTIONS, LOCATION_OPTIONS } from './constants';
import { exportToCSV, generateId, getStatusBadgeClass } from './utils/helpers';
import StatsCards from './components/StatsCards';
import PackFormModal from './components/PackFormModal';

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

  const handleResetFilters = () => {
    setFilters({
      search: '',
      entity: '',
      status: '',
      platform: '',
      localExternal: '',
      team: ''
    });
  };

  return (
    <div className="min-h-screen pb-12">
      {/* Navbar */}
      <nav className="bg-white border-b border-slate-200 px-6 py-4 flex items-center justify-between sticky top-0 z-40 shadow-sm">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center shadow-lg shadow-blue-200">
            <i className="fas fa-database text-white text-xl"></i>
          </div>
          <div>
            <h1 className="text-xl font-bold text-slate-800 tracking-tight">ECMW GLOBAL</h1>
            <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest leading-none">Pack Fleet Manager</p>
          </div>
        </div>
        
        <div className="flex items-center gap-4">
          <button 
            onClick={() => exportToCSV(filteredPacks)}
            className="hidden md:flex items-center gap-2 px-4 py-2 text-slate-600 hover:text-slate-800 hover:bg-slate-100 rounded-lg transition-all font-semibold text-sm"
          >
            <i className="fas fa-download"></i> Export CSV
          </button>
          <button 
            onClick={() => { setEditingPack(null); setIsModalOpen(true); }}
            className="flex items-center gap-2 px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl shadow-lg shadow-blue-100 transition-all active:scale-95 font-bold text-sm"
          >
            <i className="fas fa-plus"></i> Add Pack
          </button>
        </div>
      </nav>

      <main className="container mx-auto px-4 mt-8 max-w-[1600px]">
        {/* Stats Section */}
        <StatsCards packs={filteredPacks} />

        {/* Filters & Controls */}
        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6 mb-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-end">
            <div className="lg:col-span-4 relative">
              <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Search Registry</label>
              <div className="relative">
                <i className="fas fa-search absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"></i>
                <input 
                  type="text" 
                  placeholder="Search servers, packs, IDs..." 
                  value={filters.search}
                  onChange={e => setFilters(prev => ({ ...prev, search: e.target.value }))}
                  className="w-full pl-11 pr-4 py-2.5 bg-slate-50 border-transparent focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-50/50 rounded-xl text-sm transition-all"
                />
              </div>
            </div>

            <div className="lg:col-span-8 grid grid-cols-2 md:grid-cols-5 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Entity</label>
                <select 
                  value={filters.entity} 
                  onChange={e => setFilters(prev => ({ ...prev, entity: e.target.value }))}
                  className="w-full bg-slate-50 border-transparent focus:border-blue-500 rounded-lg text-sm"
                >
                  <option value="">All</option>
                  {ENTITY_OPTIONS.map(opt => <option key={opt} value={opt}>{opt}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Status</label>
                <select 
                  value={filters.status} 
                  onChange={e => setFilters(prev => ({ ...prev, status: e.target.value }))}
                  className="w-full bg-slate-50 border-transparent focus:border-blue-500 rounded-lg text-sm"
                >
                  <option value="">All</option>
                  {STATUS_OPTIONS.map(opt => <option key={opt} value={opt}>{opt}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Platform</label>
                <select 
                  value={filters.platform} 
                  onChange={e => setFilters(prev => ({ ...prev, platform: e.target.value }))}
                  className="w-full bg-slate-50 border-transparent focus:border-blue-500 rounded-lg text-sm"
                >
                  <option value="">All</option>
                  {PLATFORM_OPTIONS.map(opt => <option key={opt} value={opt}>{opt}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Team</label>
                <select 
                  value={filters.team} 
                  onChange={e => setFilters(prev => ({ ...prev, team: e.target.value }))}
                  className="w-full bg-slate-50 border-transparent focus:border-blue-500 rounded-lg text-sm"
                >
                  <option value="">All</option>
                  {TEAM_OPTIONS.map(opt => <option key={opt} value={opt}>{opt}</option>)}
                </select>
              </div>
              <div className="flex items-end">
                <button 
                  onClick={handleResetFilters}
                  className="w-full py-2 px-4 text-sm font-semibold text-rose-500 hover:bg-rose-50 rounded-lg transition-colors border border-rose-100"
                >
                  <i className="fas fa-redo-alt mr-2"></i> Reset
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Data Table */}
        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
          <div className="overflow-x-auto custom-scrollbar">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50/50 border-b border-slate-200">
                  <th onClick={() => handleSort('entity')} className="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-widest cursor-pointer hover:text-blue-600 transition-colors">
                    Entity {sortConfig.key === 'entity' && (sortConfig.direction === 'asc' ? '↑' : '↓')}
                  </th>
                  <th onClick={() => handleSort('platform')} className="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-widest cursor-pointer hover:text-blue-600 transition-colors">
                    Platform
                  </th>
                  <th onClick={() => handleSort('pack')} className="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-widest cursor-pointer hover:text-blue-600 transition-colors">
                    Pack Name
                  </th>
                  <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-widest">Server / RDP</th>
                  <th onClick={() => handleSort('status')} className="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-widest cursor-pointer hover:text-blue-600 transition-colors">
                    Status
                  </th>
                  <th onClick={() => handleSort('countProfiles')} className="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-widest cursor-pointer hover:text-blue-600 transition-colors">
                    Profiles
                  </th>
                  <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-widest">Location</th>
                  <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-widest text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredPacks.length > 0 ? (
                  filteredPacks.map(pack => (
                    <tr key={pack.id} className="hover:bg-slate-50/80 transition-colors group">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="font-bold text-slate-700">{pack.entity}</div>
                        <div className="text-[10px] text-slate-400 uppercase font-medium">{pack.entityProd}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-2 py-1 rounded text-[10px] font-black uppercase ${pack.platform === 'ECM_APP' ? 'bg-blue-100 text-blue-700' : 'bg-amber-100 text-amber-700'}`}>
                          {pack.platform}
                        </span>
                      </td>
                      <td 
                        className="px-6 py-4 whitespace-nowrap cursor-pointer hover:bg-blue-50/50 transition-colors"
                        onClick={() => { setEditingPack(pack); setIsModalOpen(true); }}
                      >
                        <div className="font-semibold text-slate-800 flex items-center gap-1.5 group/title">
                          {pack.pack}
                          <i className="fas fa-pencil text-[10px] text-blue-400 opacity-0 group-hover/title:opacity-100 transition-opacity"></i>
                        </div>
                        <div className="text-xs text-slate-400 italic">{pack.interval}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center gap-2">
                           <i className="fas fa-globe text-slate-300 text-xs"></i>
                           <code className="text-xs text-slate-600">{pack.server}</code>
                        </div>
                        <div className="text-xs text-blue-500 font-medium">{pack.rdps}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold border ${getStatusBadgeClass(pack.status)}`}>
                          <span className="w-1.5 h-1.5 rounded-full bg-current mr-1.5 animate-pulse"></span>
                          {pack.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap font-bold text-slate-700">
                        {Number(pack.countProfiles).toLocaleString()}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`text-[10px] font-bold uppercase tracking-tighter ${pack.localExternal === 'Local' ? 'text-slate-500' : 'text-rose-500'}`}>
                          {pack.localExternal}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right">
                        <div className="flex items-center justify-end gap-2">
                          <button 
                            onClick={() => { setEditingPack(pack); setIsModalOpen(true); }}
                            className="flex items-center gap-1.5 px-3 py-1.5 text-blue-600 bg-blue-50 hover:bg-blue-100 rounded-lg transition-all text-xs font-bold"
                            title="Edit Configuration"
                          >
                            <i className="fas fa-edit"></i>
                            <span className="hidden sm:inline">Edit</span>
                          </button>
                          <button 
                            onClick={() => handleDeletePack(pack.id)}
                            className="p-2 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-all"
                            title="Delete Pack"
                          >
                            <i className="fas fa-trash-alt"></i>
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={8} className="px-6 py-20 text-center text-slate-400">
                      <div className="flex flex-col items-center gap-3">
                        <i className="fas fa-ghost text-4xl text-slate-200"></i>
                        <p className="font-medium">No matching configuration found.</p>
                        <button onClick={handleResetFilters} className="text-blue-600 text-sm font-bold hover:underline">Clear all filters</button>
                      </div>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
          
          <div className="bg-slate-50 px-6 py-4 border-t border-slate-100 flex items-center justify-between">
            <p className="text-xs font-medium text-slate-500">
              Showing <span className="text-slate-900 font-bold">{filteredPacks.length}</span> of <span className="text-slate-900 font-bold">{packs.length}</span> configurations
            </p>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="mt-12 text-center text-slate-400 text-xs font-medium">
        &copy; {new Date().getFullYear()} ECMW Global Systems. All rights reserved.
      </footer>

      {/* Modal */}
      <PackFormModal 
        isOpen={isModalOpen}
        onClose={() => { setIsModalOpen(false); setEditingPack(null); }}
        onSubmit={editingPack ? handleUpdatePack : handleAddPack}
        initialData={editingPack}
      />
    </div>
  );
};

export default App;
