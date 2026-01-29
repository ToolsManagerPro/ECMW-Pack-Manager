import React from 'react';
import { STATUS_OPTIONS, ENTITY_OPTIONS, PLATFORM_OPTIONS, TEAM_OPTIONS } from '../constants.ts';

export default function PackFormModal({ isOpen, onClose, onSubmit, initialData }) {
  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const data = Object.fromEntries(formData.entries());
    
    // If we are editing, preserve the original ID
    onSubmit(initialData ? { ...initialData, ...data } : data);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm">
      <div className="bg-white rounded-3xl shadow-2xl w-full max-w-xl overflow-hidden">
        <div className="px-8 py-6 border-b flex justify-between items-center bg-slate-50">
          <h2 className="text-xl font-black text-slate-800 uppercase tracking-tight">
            {initialData ? 'Update Configuration' : 'Install New Pack'}
          </h2>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600 text-2xl">&times;</button>
        </div>

        <form onSubmit={handleSubmit} className="p-8 grid grid-cols-2 gap-4">
          <div className="col-span-1">
            <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1">Entity</label>
            <select name="entity" defaultValue={initialData?.entity} className="w-full p-2.5 bg-slate-50 border rounded-xl font-bold">
              {ENTITY_OPTIONS.map(o => <option key={o} value={o}>{o}</option>)}
            </select>
          </div>

          <div className="col-span-1">
            <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1">Status</label>
            <select name="status" defaultValue={initialData?.status} className="w-full p-2.5 bg-slate-50 border rounded-xl font-bold">
              {STATUS_OPTIONS.map(o => <option key={o} value={o}>{o}</option>)}
            </select>
          </div>

          <div className="col-span-2">
            <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1">Pack Name</label>
            <input name="pack" defaultValue={initialData?.pack} required className="w-full p-2.5 bg-slate-50 border rounded-xl font-bold outline-none focus:ring-2 focus:ring-blue-500" />
          </div>

          <div className="col-span-2">
            <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1">Server IP</label>
            <input name="server" defaultValue={initialData?.server} required className="w-full p-2.5 bg-slate-50 border rounded-xl font-mono text-sm outline-none focus:ring-2 focus:ring-blue-500" />
          </div>

          <div className="col-span-1">
            <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1">Profiles</label>
            <input name="countProfiles" type="number" defaultValue={initialData?.countProfiles} className="w-full p-2.5 bg-slate-50 border rounded-xl font-bold" />
          </div>

          <div className="col-span-1">
            <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1">Platform</label>
            <select name="platform" defaultValue={initialData?.platform} className="w-full p-2.5 bg-slate-50 border rounded-xl font-bold">
              {PLATFORM_OPTIONS.map(o => <option key={o} value={o}>{o}</option>)}
            </select>
          </div>

          <button type="submit" className="col-span-2 mt-4 py-4 bg-blue-600 hover:bg-blue-700 text-white rounded-2xl font-black uppercase tracking-widest transition-all active:scale-[0.98] shadow-lg shadow-blue-100">
            Save Configuration
          </button>
        </form>
      </div>
    </div>
  );
}
