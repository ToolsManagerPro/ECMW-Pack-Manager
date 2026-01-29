// App.js
import React, { useState, useMemo, useEffect } from 'https://esm.sh/react@18.2.0';
import { INITIAL_DATA, ENTITY_OPTIONS, STATUS_OPTIONS, PLATFORM_OPTIONS, TEAM_OPTIONS, LOCATION_OPTIONS, DISK_OPTIONS, DATA_SEEDS_OPTIONS } from './constants.js';
import { exportToCSV, generateId, getStatusBadgeClass } from './utils/helpers.js';
import StatsCards from './components/StatsCards.js';
import PackFormModal from './components/PackFormModal.js';

// ... rest of your App code remains exactly the same ...
const App = () => {
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

  const [sortConfig, setSortConfig] = useState({ key: 'pack', direction: 'asc' });
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingPack, setEditingPack] = useState(null);
  const [expandedPackId, setExpandedPackId] = useState(null);

  useEffect(() => {
    localStorage.setItem('ecmw_packs', JSON.stringify(packs));
  }, [packs]);

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
      const aStr = String(aVal).toLowerCase();
      const bStr = String(bVal).toLowerCase();
      if (aStr < bStr) return sortConfig.direction === 'asc' ? -1 : 1;
      if (aStr > bStr) return sortConfig.direction === 'asc' ? 1 : -1;
      return 0;
    });

    return result;
  }, [packs, filters, sortConfig]);

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

  const handleRestoreDefault = () => {
    if (window.confirm('Restore all 131 original pack configurations?')) {
      setPacks(INITIAL_DATA);
    }
  };

  return (
    <div className="min-h-screen pb-12 bg-slate-50">
      <nav className="bg-white border-b border-slate-200 px-6 py-4 flex items-center justify-between sticky top-0 z-40 shadow-sm">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center shadow-lg shadow-blue-200">
            <i className="fas fa-database text-white text-xl"></i>
          </div>
          <div>
            <h1 className="text-xl font-bold text-slate-800 tracking-tight uppercase">ECMW FLEET</h1>
            <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest leading-none">Global Systems Control</p>
          </div>
        </div>
        
        <div className="flex items-center gap-4">
          <button onClick={handleRestoreDefault} className="hidden lg:flex items-center gap-2 px-4 py-2 text-slate-400 hover:text-slate-600 hover:bg-slate-50 rounded-lg transition-all font-semibold text-xs">
            <i className="fas fa-sync-alt"></i> Restore Defaults
          </button>
          <button onClick={() => exportToCSV(filteredPacks)} className="hidden md:flex items-center gap-2 px-4 py-2 text-slate-600 hover:text-slate-800 hover:bg-slate-100 rounded-lg transition-all font-semibold text-sm">
            <i className="fas fa-download"></i> Export CSV
          </button>
          <button onClick={() => { setEditingPack(null); setIsModalOpen(true); }} className="flex items-center gap-2 px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl shadow-lg shadow-blue-100 transition-all active:scale-95 font-bold text-sm">
            <i className="fas fa-plus"></i> Add Pack
          </button>
        </div>
      </nav>

      <main className="container mx-auto px-4 mt-8 max-w-[1700px]">
        <StatsCards packs={filteredPacks} />

        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6 mb-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-end">
            <div className="lg:col-span-3 relative">
              <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Search Registry</label>
              <div className="relative">
                <i className="fas fa-search absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"></i>
                <input 
                  type="text" 
                  placeholder="Search servers, packs..." 
                  value={filters.search}
                  onChange={e => setFilters(prev => ({ ...prev, search: e.target.value }))}
                  className="w-full pl-11 pr-4 py-2.5 bg-slate-50 border-transparent focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-50/50 rounded-xl text-sm transition-all"
                />
              </div>
            </div>

            <div className="lg:col-span-9 grid grid-cols-2 md:grid-cols-4 lg:grid-cols-8 gap-3">
              <div>
                <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">Entity</label>
                <select value={filters.entity} onChange={e => setFilters(prev => ({ ...prev, entity: e.target.value }))} className="w-full bg-slate-50 border-transparent focus:border-blue-500 rounded-lg text-xs font-semibold py-2">
                  <option value="">Entities</option>
                  {ENTITY_OPTIONS.map(opt => <option key={opt} value={opt}>{opt}</option>)}
                </select>
              </div>
              {/* ... other filters ... */}
              <div className="flex items-end">
                <button onClick={handleResetFilters} className="w-full py-2 px-3 text-xs font-bold text-rose-500 hover:bg-rose-50 rounded-lg transition-colors border border-rose-100">
                   Reset
                </button>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50/50 border-b border-slate-200">
                  <th className="px-4 py-4 w-10 text-center"><i className="fas fa-info-circle text-slate-300 text-xs"></i></th>
                  <th onClick={() => handleSort('pack')} className="px-4 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest cursor-pointer hover:text-blue-600 transition-colors">Asset Instance</th>
                  <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Environment</th>
                  <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Access Nodes</th>
                  <th onClick={() => handleSort('status')} className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest cursor-pointer hover:text-blue-600 transition-colors text-center">Status</th>
                  <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest text-center">Profiles</th>
                  <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Notes</th>
                  <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredPacks.map(pack => (
                  <React.Fragment key={pack.id}>
                    <tr className={`hover:bg-slate-50/80 transition-colors group ${expandedPackId === pack.id ? 'bg-blue-50/30' : ''}`}>
                      <td className="px-4 py-4 text-center">
                        <button onClick={() => toggleExpand(pack.id)} className={`w-8 h-8 rounded-lg flex items-center justify-center transition-all ${pack.notes ? 'text-blue-600 bg-blue-50' : 'text-slate-300 hover:bg-slate-100'}`}>
                          <i className={`fas fa-chevron-${expandedPackId === pack.id ? 'down' : 'right'} text-[10px]`}></i>
                        </button>
                      </td>
                      <td className="px-4 py-4 whitespace-nowrap">
                        <div className="font-black text-slate-800">{pack.pack}</div>
                        <div className="text-[10px] text-slate-400 uppercase font-black tracking-widest">{pack.interval || 'NO INTERVAL'}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                         <div className="flex flex-col">
                           <div className="flex items-center gap-2">
                             <span className="text-xs font-black text-slate-700">{pack.entity}</span>
                             <span className="text-[9px] bg-slate-100 px-1.5 py-0.5 rounded text-slate-400 font-bold">{pack.platform}</span>
                           </div>
                           <div className="text-[9px] font-black text-slate-400 uppercase tracking-tighter mt-1">Team {pack.team}</div>
                         </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-xs font-mono font-bold text-slate-600 bg-slate-50 w-fit px-2 py-0.5 rounded border border-slate-100">{pack.server}</div>
                        <div className="text-[10px] font-black text-blue-500 mt-1 truncate max-w-[120px] uppercase">{pack.rdps}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-center">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[9px] font-black border uppercase tracking-widest ${getStatusBadgeClass(pack.status)}`}>
                          {pack.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-center font-black text-slate-700 text-xs">
                        {pack.countProfiles ? Number(pack.countProfiles).toLocaleString() : '—'}
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-[10px] text-slate-500 italic max-w-[200px] truncate">{pack.notes || '—'}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right">
                        <div className="flex items-center justify-end gap-2">
                          <button onClick={() => { setEditingPack(pack); setIsModalOpen(true); }} className="w-8 h-8 flex items-center justify-center rounded-lg text-slate-400 hover:text-blue-600 hover:bg-blue-50 transition-all">
                            <i className="fas fa-edit text-xs"></i>
                          </button>
                          <button onClick={() => handleDeletePack(pack.id)} className="w-8 h-8 flex items-center justify-center rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-all">
                            <i className="fas fa-trash-alt text-xs"></i>
                          </button>
                        </div>
                      </td>
                    </tr>
                  </React.Fragment>
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
