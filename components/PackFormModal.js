
import React, { useState, useEffect } from 'react';
import { ENTITY_OPTIONS, PLATFORM_OPTIONS, TEAM_OPTIONS, STATUS_OPTIONS, LOCATION_OPTIONS, DISK_OPTIONS, DATA_SEEDS_OPTIONS, BROWSER_OPTIONS } from '../constants.js';

const PackFormModal = ({ isOpen, onClose, onSubmit, initialData }) => {
  const [formData, setFormData] = useState({});

  useEffect(() => {
    if (initialData) {
      setFormData(initialData);
    } else {
      setFormData({
        entity: ENTITY_OPTIONS[0],
        platform: PLATFORM_OPTIONS[0],
        team: TEAM_OPTIONS[0],
        localExternal: LOCATION_OPTIONS[0],
        status: STATUS_OPTIONS[0],
        dataSeeds: 'non',
        disk: 'externe',
        browser: 'Chrome',
        backup: 'Non',
        notes: ''
      });
    }
  }, [initialData, isOpen]);

  if (!isOpen) return null;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
      <div className="bg-white rounded-3xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-hidden flex flex-col border border-slate-200">
        <div className="px-8 py-5 border-b border-slate-100 flex justify-between items-center bg-slate-50">
          <h2 className="text-xl font-black text-slate-800 tracking-tight">{initialData ? 'Update Infrastructure Asset' : 'Register New Fleet Asset'}</h2>
          <button onClick={onClose} className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-slate-200 transition-colors">
            <i className="fas fa-times text-slate-500 text-lg"></i>
          </button>
        </div>

        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-8 space-y-8 custom-scrollbar">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div><label className="block text-[10px] font-black uppercase text-slate-400 mb-2">Entity</label><select name="entity" value={formData.entity} onChange={handleChange} className="w-full bg-slate-50 border-0 rounded-xl py-3 px-4 focus:ring-2 focus:ring-blue-500 text-sm font-semibold">{ENTITY_OPTIONS.map(opt => <option key={opt} value={opt}>{opt}</option>)}</select></div>
            <div><label className="block text-[10px] font-black uppercase text-slate-400 mb-2">Product Tag</label><input type="text" name="entityProd" value={formData.entityProd || ''} onChange={handleChange} className="w-full bg-slate-50 border-0 rounded-xl py-3 px-4 focus:ring-2 focus:ring-blue-500 text-sm font-semibold" required /></div>
            <div><label className="block text-[10px] font-black uppercase text-slate-400 mb-2">Platform</label><select name="platform" value={formData.platform} onChange={handleChange} className="w-full bg-slate-50 border-0 rounded-xl py-3 px-4 focus:ring-2 focus:ring-blue-500 text-sm font-semibold">{PLATFORM_OPTIONS.map(opt => <option key={opt} value={opt}>{opt}</option>)}</select></div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div><label className="block text-[10px] font-black uppercase text-slate-400 mb-2">Team Assignment</label><select name="team" value={formData.team} onChange={handleChange} className="w-full bg-slate-50 border-0 rounded-xl py-3 px-4 focus:ring-2 focus:ring-blue-500 text-sm font-semibold">{TEAM_OPTIONS.map(opt => <option key={opt} value={opt}>{opt}</option>)}</select></div>
            <div><label className="block text-[10px] font-black uppercase text-slate-400 mb-2">Hosting Type</label><select name="localExternal" value={formData.localExternal} onChange={handleChange} className="w-full bg-slate-50 border-0 rounded-xl py-3 px-4 focus:ring-2 focus:ring-blue-500 text-sm font-semibold">{LOCATION_OPTIONS.map(opt => <option key={opt} value={opt}>{opt}</option>)}</select></div>
            <div><label className="block text-[10px] font-black uppercase text-slate-400 mb-2">Pack UID</label><input type="text" name="pack" value={formData.pack || ''} onChange={handleChange} className="w-full bg-slate-50 border-0 rounded-xl py-3 px-4 focus:ring-2 focus:ring-blue-500 text-sm font-semibold" required /></div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div><label className="block text-[10px] font-black uppercase text-slate-400 mb-2">Access Node (IP)</label><input type="text" name="server" value={formData.server || ''} onChange={handleChange} className="w-full bg-slate-50 border-0 rounded-xl py-3 px-4 focus:ring-2 focus:ring-blue-500 text-sm font-semibold" /></div>
            <div><label className="block text-[10px] font-black uppercase text-slate-400 mb-2">Session ID (RDPS)</label><input type="text" name="rdps" value={formData.rdps || ''} onChange={handleChange} className="w-full bg-slate-50 border-0 rounded-xl py-3 px-4 focus:ring-2 focus:ring-blue-500 text-sm font-semibold" /></div>
            <div><label className="block text-[10px] font-black uppercase text-slate-400 mb-2">Access Key (Password)</label><input type="text" name="password" value={formData.password || ''} onChange={handleChange} className="w-full bg-slate-50 border-0 rounded-xl py-3 px-4 focus:ring-2 focus:ring-blue-500 text-sm font-semibold" /></div>
          </div>
          <div className="bg-slate-50 rounded-2xl p-6 border border-slate-100 shadow-inner">
            <label className="block text-[10px] font-black uppercase text-slate-400 mb-3"><i className="fas fa-sticky-note mr-2 text-blue-500"></i>Fleet Notes</label>
            <textarea name="notes" value={formData.notes || ''} onChange={handleChange} rows={5} className="w-full bg-white border border-slate-200 rounded-xl py-4 px-5 focus:ring-4 focus:ring-blue-50 focus:border-blue-500 text-sm text-slate-700 leading-relaxed transition-all resize-none shadow-sm" placeholder="Detailed logs..."></textarea>
          </div>
        </form>

        <div className="px-8 py-5 border-t border-slate-100 bg-slate-50 flex justify-end gap-4">
          <button onClick={onClose} type="button" className="px-6 py-2.5 text-sm font-bold text-slate-500 hover:text-slate-800 transition-colors">Cancel</button>
          <button onClick={handleSubmit} type="submit" className="px-10 py-2.5 text-sm font-black text-white bg-blue-600 hover:bg-blue-700 rounded-xl shadow-lg shadow-blue-100 transition-all active:scale-95 uppercase tracking-widest">{initialData ? 'Save Changes' : 'Register Pack'}</button>
        </div>
      </div>
    </div>
  );
};

export default PackFormModal;
