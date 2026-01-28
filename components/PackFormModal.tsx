import React, { useState, useEffect } from 'react';
import { ENTITY_OPTIONS, STATUS_OPTIONS } from '../constants.ts';

export default function PackFormModal({ isOpen, onClose, onSubmit, initialData }) {
  const [formData, setFormData] = useState({});

  useEffect(() => {
    if (initialData) setFormData(initialData);
    else setFormData({ entity: 'ECM4', status: 'Repoting' });
  }, [initialData, isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-md">
        <div className="p-6 border-b flex justify-between items-center">
          <h2 className="font-bold">Pack Settings</h2>
          <button onClick={onClose} className="text-slate-400">&times;</button>
        </div>
        <form className="p-6 space-y-4" onSubmit={(e) => {
          e.preventDefault();
          onSubmit(formData);
          onClose();
        }}>
          <div>
            <label className="block text-[10px] font-bold uppercase mb-1">Pack Name</label>
            <input 
              className="w-full p-2 border rounded-lg" 
              value={formData.pack || ''} 
              onChange={e => setFormData({...formData, pack: e.target.value})}
            />
          </div>
          <button type="submit" className="w-full py-3 bg-blue-600 text-white rounded-xl font-bold">
            Save Changes
          </button>
        </form>
      </div>
    </div>
  );
}
