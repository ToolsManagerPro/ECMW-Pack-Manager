
import React, { useState, useMemo, useEffect } from 'react'; // NO URL HERE
import { INITIAL_DATA, ... } from './constants.js'; // Keep the .js
import StatsCards from './components/StatsCards.js';
import PackFormModal from './components/PackFormModal.js';

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
      search: '',
      entity: '',
      status: '',
      platform: '',
      localExternal: '',
      team: '',
      disk: '',
      dataSeeds: ''
    });
  };

  const handleRestoreDefault = () => {
    if (window.confirm('This will reset your local changes and restore all 131 original pack configurations. Continue?')) {
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
                  placeholder="Search servers, packs, disks, notes..." 
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
              <div>
                <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">Status</label>
                <select value={filters.status} onChange={e => setFilters(prev => ({ ...prev, status: e.target.value }))} className="w-full bg-slate-50 border-transparent focus:border-blue-500 rounded-lg text-xs font-semibold py-2">
                  <option value="">Statuses</option>
                  {STATUS_OPTIONS.map(opt => <option key={opt} value={opt}>{opt}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">Platform</label>
                <select value={filters.platform} onChange={e => setFilters(prev => ({ ...prev, platform: e.target.value }))} className="w-full bg-slate-50 border-transparent focus:border-blue-500 rounded-lg text-xs font-semibold py-2">
                  <option value="">Platforms</option>
                  {PLATFORM_OPTIONS.map(opt => <option key={opt} value={opt}>{opt}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">Team</label>
                <select value={filters.team} onChange={e => setFilters(prev => ({ ...prev, team: e.target.value }))} className="w-full bg-slate-50 border-transparent focus:border-blue-500 rounded-lg text-xs font-semibold py-2">
                  <option value="">Teams</option>
                  {TEAM_OPTIONS.map(opt => <option key={opt} value={opt}>{opt}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">Hosting Mix</label>
                <select value={filters.localExternal} onChange={e => setFilters(prev => ({ ...prev, localExternal: e.target.value }))} className="w-full bg-slate-50 border-transparent focus:border-blue-500 rounded-lg text-xs font-semibold py-2">
                  <option value="">Local/External</option>
                  {LOCATION_OPTIONS.map(opt => <option key={opt} value={opt}>{opt}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">Disk</label>
                <select value={filters.disk} onChange={e => setFilters(prev => ({ ...prev, disk: e.target.value }))} className="w-full bg-slate-50 border-transparent focus:border-blue-500 rounded-lg text-xs font-semibold py-2">
                  <option value="">Disk</option>
                  {DISK_OPTIONS.map(opt => <option key={opt} value={opt}>{opt}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">Data Seeds</label>
                <select value={filters.dataSeeds} onChange={e => setFilters(prev => ({ ...prev, dataSeeds: e.target.value }))} className="w-full bg-slate-50 border-transparent focus:border-blue-500 rounded-lg text-xs font-semibold py-2">
                  <option value="">Seeds</option>
                  {DATA_SEEDS_OPTIONS.map(opt => <option key={opt} value={opt}>{opt}</option>)}
                </select>
              </div>
              <div className="flex items-end">
                <button onClick={handleResetFilters} className="w-full py-2 px-3 text-xs font-bold text-rose-500 hover:bg-rose-50 rounded-lg transition-colors border border-rose-100">
                   Reset
                </button>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
          <div className="overflow-x-auto custom-scrollbar">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50/50 border-b border-slate-200">
                  <th className="px-4 py-4 w-10 text-center"><i className="fas fa-info-circle text-slate-300 text-xs"></i></th>
                  <th onClick={() => handleSort('pack')} className="px-4 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest cursor-pointer hover:text-blue-600 transition-colors">Asset Instance</th>
                  <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Environment</th>
                  <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Access Nodes</th>
                  <th onClick={() => handleSort('status')} className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest cursor-pointer hover:text-blue-600 transition-colors text-center">System Status</th>
                  <th onClick={() => handleSort('countProfiles')} className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest cursor-pointer hover:text-blue-600 transition-colors text-center">Count Profile</th>
                  <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Notes</th>
                  <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredPacks.length > 0 ? (
                  filteredPacks.map(pack => (
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
                            <span className={`w-1 h-1 rounded-full bg-current mr-1.5 ${pack.status.toLowerCase().includes('repot') ? 'animate-pulse' : ''}`}></span>
                            {pack.status}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-center font-black text-slate-700 text-xs">
                          {pack.countProfiles ? Number(pack.countProfiles).toLocaleString() : '—'}
                        </td>
                        <td className="px-6 py-4">
                          <div className="text-[10px] text-slate-500 italic max-w-[200px] truncate" title={pack.notes}>
                            {pack.notes || '—'}
                          </div>
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
                      {expandedPackId === pack.id && (
                        <tr className="bg-slate-50/40">
                          <td colSpan={8} className="px-12 py-6 border-b border-slate-200/60 shadow-inner">
                            <div className="flex flex-col gap-4">
                              <div className="flex items-start gap-4">
                                <div className="w-10 h-10 bg-white rounded-xl shadow-sm border border-slate-100 flex items-center justify-center text-blue-500">
                                  <i className="fas fa-sticky-note"></i>
                                </div>
                                <div className="flex-1">
                                  <h4 className="text-[10px] font-black uppercase text-slate-400 tracking-widest mb-1.5">Asset Technical Documentation</h4>
                                  {pack.notes ? (
                                    <p className="text-sm text-slate-600 whitespace-pre-wrap leading-relaxed max-w-5xl">{pack.notes}</p>
                                  ) : (
                                    <p className="text-sm text-slate-400 italic">No operational logs provided for this instance.</p>
                                  )}
                                </div>
                              </div>
                              <div className="grid grid-cols-2 md:grid-cols-4 gap-6 pt-4 border-t border-slate-200/50">
                                 <div><div className="text-[9px] font-black text-slate-400 uppercase mb-1">Disk Partition</div><div className="text-xs font-bold text-slate-700">{pack.disk || 'N/A'}</div></div>
                                 <div><div className="text-[9px] font-black text-slate-400 uppercase mb-1">Data Seeds</div><div className="text-xs font-bold text-slate-700 uppercase">{pack.dataSeeds || 'N/A'}</div></div>
                                 <div><div className="text-[9px] font-black text-slate-400 uppercase mb-1">Browser Node</div><div className="text-xs font-bold text-slate-700">{pack.browser || 'N/A'}</div></div>
                                 <div><div className="text-[9px] font-black text-slate-400 uppercase mb-1">Access Credential</div><div className="text-xs font-mono font-bold text-blue-600">{pack.password || 'REDACTED'}</div></div>
                              </div>
                            </div>
                          </td>
                        </tr>
                      )}
                    </React.Fragment>
                  ))
                ) : (
                  <tr>
                    <td colSpan={8} className="px-6 py-20 text-center text-slate-400">
                      <div className="flex flex-col items-center gap-3">
                        <i className="fas fa-ghost text-4xl text-slate-200"></i>
                        <p className="font-medium">Registry search yielded no results.</p>
                        <button onClick={handleResetFilters} className="text-blue-600 text-sm font-bold hover:underline">Clear scan filters</button>
                      </div>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
          <div className="bg-slate-50 px-6 py-4 border-t border-slate-100 flex items-center justify-between text-[10px] font-bold text-slate-400 uppercase tracking-widest">
            <p>Fleet Database Registry &bull; Total Assets: {packs.length}</p>
            <p>Filtered View: {filteredPacks.length}</p>
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
