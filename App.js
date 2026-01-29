import React, { useState, useMemo, useEffect } from 'https://esm.sh/react@18.2.0';
import { 
  INITIAL_DATA, 
  ENTITY_OPTIONS, 
  STATUS_OPTIONS, 
  PLATFORM_OPTIONS, 
  TEAM_OPTIONS, 
  LOCATION_OPTIONS, 
  DISK_OPTIONS, 
  DATA_SEEDS_OPTIONS,
  BROWSER_OPTIONS 
} from './constants.js';
import { exportToCSV, generateId, getStatusBadgeClass } from './utils/helpers.js';
import StatsCards from './components/StatsCards.js';
import PackFormModal from './components/PackFormModal.js';

const App = () => {
  // --- State Persistence ---
  const [packs, setPacks] = useState(() => {
    const saved = localStorage.getItem('ecmw_packs');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        return parsed.length > 0 ? parsed : INITIAL_DATA;
      } catch (e) {
        return INITIAL_DATA;
      }
    }
    return INITIAL_DATA;
  });

  // --- Filter State ---
  const [filters, setFilters] = useState({
    search: '',
    entity: '',
    status: '',
    platform: '',
    localExternal: '',
    team: '',
    disk: '',
    dataSeeds: ''
  });

  // --- Table State ---
  const [sortConfig, setSortConfig] = useState({ key: 'pack', direction: 'asc' });
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingPack, setEditingPack] = useState(null);
  const [expandedPackId, setExpandedPackId] = useState(null);

  // --- Effects ---
  useEffect(() => {
    localStorage.setItem('ecmw_packs', JSON.stringify(packs));
  }, [packs]);

  // --- Filtering & Sorting Logic ---
  const filteredPacks = useMemo(() => {
    let result = packs.filter(p => {
      const searchStr = filters.search.toLowerCase();
      const matchesSearch = !filters.search || Object.values(p).some(val => 
        String(val).toLowerCase().includes(searchStr)
      );
      const matchesEntity = !filters.entity || p.entity === filters.entity;
      const matchesStatus = !filters.status || p.status === filters.status;
      const matchesPlatform = !filters.platform || p.platform === filters.platform;
      const matchesLocation = !filters.localExternal || p.localExternal === filters.localExternal;
      const matchesTeam = !filters.team || p.team === filters.team;
      const matchesDisk = !filters.disk || p.disk === filters.disk;
      const matchesSeeds = !filters.dataSeeds || p.dataSeeds === filters.dataSeeds;

      return matchesSearch && matchesEntity && matchesStatus && matchesPlatform && 
             matchesLocation && matchesTeam && matchesDisk && matchesSeeds;
    });

    result.sort((a, b) => {
      const aVal = a[sortConfig.key];
      const bVal = b[sortConfig.key];
      if (typeof aVal === 'number' && typeof bVal === 'number') {
        return sortConfig.direction === 'asc' ? aVal - bVal : bVal - aVal;
      }
      const aStr = String(aVal || '').toLowerCase();
      const bStr = String(bVal || '').toLowerCase();
      if (aStr < bStr) return sortConfig.direction === 'asc' ? -1 : 1;
      if (aStr > bStr) return sortConfig.direction === 'asc' ? 1 : -1;
      return 0;
    });

    return result;
  }, [packs, filters, sortConfig]);

  // --- Handlers ---
  const handleSort = (key) => {
    setSortConfig(prev => ({
      key,
      direction: prev.key === key && prev.direction === 'asc' ? 'desc' : 'asc'
    }));
  };

  const handleAddPack = (newPack) => {
    const packWithId = { ...newPack, id: generateId() };
    setPacks(prev => [packWithId, ...prev]);
  };

  const handleUpdatePack = (updatedPack) => {
    setPacks(prev => prev.map(p => p.id === updatedPack.id ? updatedPack : p));
  };

  const handleDeletePack = (id) => {
    if (window.confirm('Are you sure you want to delete this pack configuration?')) {
      setPacks(prev => prev.filter(p => p.id !== id));
    }
  };

  const toggleExpand = (id) => {
    setExpandedPackId(expandedPackId === id ? null : id);
  };

  const handleResetFilters = () => {
    setFilters({
      search: '', entity: '', status: '', platform: '',
      localExternal: '', team: '', disk: '', dataSeeds: ''
    });
  };

  return (
    <div className="min-h-screen pb-12 bg-slate-50">
      {/* Navigation */}
      <nav className="bg-white border-b border-slate-200 px-6 py-4 flex items-center justify-between sticky top-0 z-40 shadow-sm">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center shadow-lg">
            <i className="fas fa-database text-white text-xl"></i>
          </div>
          <div>
            <h1 className="text-xl font-bold text-slate-800 tracking-tight">ECMW FLEET</h1>
            <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">Global Systems Control</p>
          </div>
        </div>
        
        <div className="flex gap-4">
          <button onClick={() => exportToCSV(filteredPacks)} className="px-4 py-2 text-slate-600 hover:bg-slate-100 rounded-lg font-semibold text-sm transition-all">
            <i className="fas fa-download mr-2"></i> Export
          </button>
          <button onClick={() => { setEditingPack(null); setIsModalOpen(true); }} className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl shadow-lg transition-all active:scale-95 font-bold text-sm">
            <i className="fas fa-plus mr-2"></i> Add Pack
          </button>
        </div>
      </nav>

      <main className="container mx-auto px-4 mt-8 max-w-[1600px]">
        <StatsCards packs={filteredPacks} />

        {/* Filters Section */}
        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6 mb-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-end">
            <div className="lg:col-span-4 relative">
              <label className="block text-xs font-bold text-slate-400 uppercase mb-2">Search Registry</label>
              <div className="relative">
                <i className="fas fa-search absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"></i>
                <input 
                  type="text" 
                  placeholder="Search servers, packs..." 
                  value={filters.search}
                  onChange={e => setFilters(prev => ({ ...prev, search: e.target.value }))}
                  className="w-full pl-11 pr-4 py-2.5 bg-slate-50 border-0 focus:ring-2 focus:ring-blue-500 rounded-xl text-sm transition-all"
                />
              </div>
            </div>

            <div className="lg:col-span-8 grid grid-cols-2 md:grid-cols-4 gap-3">
              <select value={filters.entity} onChange={e => setFilters(prev => ({ ...prev, entity: e.target.value }))} className="bg-slate-50 border-0 rounded-lg text-xs font-semibold py-2">
                <option value="">Entities</option>
                {ENTITY_OPTIONS.map(opt => <option key={opt} value={opt}>{opt}</option>)}
              </select>
              <select value={filters.status} onChange={e => setFilters(prev => ({ ...prev, status: e.target.value }))} className="bg-slate-50 border-0 rounded-lg text-xs font-semibold py-2">
                <option value="">Status</option>
                {STATUS_OPTIONS.map(opt => <option key={opt} value={opt}>{opt}</option>)}
              </select>
              <button onClick={handleResetFilters} className="py-2 px-3 text-xs font-bold text-rose-500 hover:bg-rose-50 rounded-lg border border-rose-100 transition-colors">
                 Reset Filters
              </button>
            </div>
          </div>
        </div>

        {/* Assets Table */}
        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead className="bg-slate-50/50 border-b border-slate-200">
                <tr>
                  <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Asset Instance</th>
                  <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest text-center">Status</th>
                  <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Access Nodes</th>
                  <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredPacks.map(pack => (
                  <tr key={pack.id} className="hover:bg-slate-50 transition-colors group">
                    <td className="px-6 py-4">
                      <div className="font-bold text-slate-800">{pack.pack}</div>
                      <div className="text-[10px] text-slate-400 font-mono">{pack.interval}</div>
                    </td>
                    <td className="px-6 py-4 text-center">
                      <span className={`px-2.5 py-1 rounded-full text-[10px] font-black border uppercase ${getStatusBadgeClass(pack.status)}`}>
                        {pack.status}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-xs font-mono text-slate-600">{pack.server}</div>
                      <div className="text-[10px] text-blue-500 font-bold">{pack.rdps}</div>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex justify-end gap-2">
                        <button onClick={() => { setEditingPack(pack); setIsModalOpen(true); }} className="w-8 h-8 flex items-center justify-center rounded-lg text-slate-400 hover:text-blue-600 hover:bg-blue-50 transition-all">
                          <i className="fas fa-edit"></i>
                        </button>
                        <button onClick={() => handleDeletePack(pack.id)} className="w-8 h-8 flex items-center justify-center rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-all">
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
        onClose={() => { setIsModalOpen(false); setEditingPack(null); }}
        onSubmit={editingPack ? handleUpdatePack : handleAddPack}
        initialData={editingPack}
      />
    </div>
  );
};

export default App;
