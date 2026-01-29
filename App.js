import React from 'react'; // This now works because of the Import Map!
// IMPORTANT: Notice the .ts and .tsx extensions below
import { INITIAL_DATA, ENTITY_OPTIONS, STATUS_OPTIONS } from './constants.ts';
import { generateId, getStatusBadgeClass } from './utils/helpers.ts';
import StatsCards from './components/StatsCards.tsx';
import PackFormModal from './components/PackFormModal.tsx';

export default function App() {
  // Removed the <Pack[]> generic to prevent Babel "Missing Initializer" errors
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

  const handleDeletePack = (id) => {
    if(window.confirm("Delete this pack?")) {
        setPacks(prev => prev.filter(p => p.id !== id));
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 font-sans">
      <nav className="bg-white border-b p-4 flex justify-between items-center sticky top-0 z-50 shadow-sm">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-blue-600 rounded flex items-center justify-center">
            <i className="fas fa-database text-white text-xs"></i>
          </div>
          <span className="font-bold text-slate-800 tracking-tight">ECMW GLOBAL</span>
        </div>
        <button 
          onClick={() => { setEditingPack(null); setIsModalOpen(true); }}
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-bold text-sm transition-all shadow-md shadow-blue-100"
        >
          Add Pack
        </button>
      </nav>

      <main className="p-6 max-w-[1400px] mx-auto">
        <StatsCards packs={filteredPacks} />
        
        <div className="bg-white p-4 rounded-xl border mt-6 shadow-sm flex flex-wrap gap-4">
          <div className="flex-1 min-w-[300px] relative">
            <i className="fas fa-search absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-sm"></i>
            <input 
              className="w-full pl-10 pr-4 py-2 bg-slate-50 border rounded-lg text-sm outline-none focus:ring-2 focus:ring-blue-500 transition-all"
              placeholder="Search packs..."
              value={filters.search}
              onChange={e => setFilters(prev => ({...prev, search: e.target.value}))}
            />
          </div>
          <select 
            className="p-2 bg-slate-50 border rounded-lg text-sm font-bold outline-none cursor-pointer"
            value={filters.entity}
            onChange={e => setFilters(prev => ({...prev, entity: e.target.value}))}
          >
            <option value="">All Entities</option>
            {ENTITY_OPTIONS.map(o => <option key={o} value={o}>{o}</option>)}
          </select>
        </div>

        <div className="bg-white rounded-xl border mt-6 shadow-sm overflow-hidden overflow-x-auto">
          <table className="w-full text-left border-collapse min-w-[800px]">
            <thead>
              <tr className="bg-slate-50 text-slate-400 text-[10px] uppercase font-bold tracking-widest">
                <th className="p-4 border-b">Entity</th>
                <th className="p-4 border-b">Pack Name</th>
                <th className="p-4 border-b">Status</th>
                <th className="p-4 border-b text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredPacks.map(p => (
                <tr key={p.id} className="hover:bg-slate-50/50 transition-colors group">
                  <td className="p-4 font-black text-blue-600">{p.entity}</td>
                  <td className="p-4">
                    <div className="font-bold text-slate-700">{p.pack}</div>
                    <div className="text-[10px] text-slate-400">{p.server}</div>
                  </td>
                  <td className="p-4">
                    <span className={`px-2 py-1 rounded text-[10px] font-bold border shadow-sm ${getStatusBadgeClass(p.status)}`}>
                      {p.status}
                    </span>
                  </td>
                  <td className="p-4 text-right space-x-2">
                    <button 
                      onClick={() => { setEditingPack(p); setIsModalOpen(true); }} 
                      className="text-blue-600 hover:text-blue-800 font-bold text-sm"
                    >
                      Edit
                    </button>
                    <button 
                      onClick={() => handleDeletePack(p.id)}
                      className="text-rose-500 hover:text-rose-700 font-bold text-sm"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </main>

      {isModalOpen && (
        <PackFormModal 
          isOpen={isModalOpen} 
          onClose={() => setIsModalOpen(false)} 
          onSubmit={editingPack ? handleUpdatePack : handleAddPack} 
          initialData={editingPack} 
        />
      )}
    </div>
  );
}
