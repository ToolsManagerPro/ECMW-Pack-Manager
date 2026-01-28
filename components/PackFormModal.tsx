import React, { useState, useEffect } from 'react';
import { Pack } from '../types.ts';
import { ENTITY_OPTIONS, STATUS_OPTIONS, PLATFORM_OPTIONS, TEAM_OPTIONS, LOCATION_OPTIONS } from '../constants.ts';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (pack: Pack) => void;
  initialData: Pack | null;
}

const PackFormModal: React.FC<ModalProps> = ({ isOpen, onClose, onSubmit, initialData }) => {
  const [formData, setFormData] = useState<Partial<Pack>>({});

  useEffect(() => {
    if (initialData) setFormData(initialData);
    else setFormData({ status: 'Reporting', platform: 'ECM_APP', team: 'A', localExternal: 'Local' });
  }, [initialData, isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <div className="p-6 border-b sticky top-0 bg-white z-10 flex justify-between items-center">
          <h2 className="text-xl font-bold">{initialData ? 'Edit Pack' : 'Add New Pack'}</h2>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600"><i className="fas fa-times"></i></button>
        </div>
        <form className="p-6 grid grid-cols-1 md:grid-cols-2 gap-4" onSubmit={(e) => {
          e.preventDefault();
          onSubmit(formData as Pack);
          onClose();
        }}>
          <div>
            <label className="block text-xs font-bold mb-1">Entity</label>
            <select className="w-full p-2 border rounded-lg" value={formData.entity || ''} onChange={e => setFormData({...formData, entity: e.target.value})}>
              <option value="">Select Entity</option>
              {ENTITY_OPTIONS.map(o => <option key={o} value={o}>{o}</option>)}
            </select>
          </div>
          <div>
            <label className="block text-xs font-bold mb-1">Pack Name</label>
            <input type="text" className="w-full p-2 border rounded-lg" value={formData.pack || ''} onChange={e => setFormData({...formData, pack: e.target.value})} />
          </div>
          <div>
            <label className="block text-xs font-bold mb-1">Server IP</label>
            <input type="text" className="w-full p-2 border rounded-lg" value={formData.server || ''} onChange={e => setFormData({...formData, server: e.target.value})} />
          </div>
          <div>
            <label className="block text-xs font-bold mb-1">Profile Count</label>
            <input type="number" className="w-full p-2 border rounded-lg" value={formData.countProfiles || ''} onChange={e => setFormData({...formData, countProfiles: e.target.value})} />
          </div>
          <div className="md:col-span-2 mt-4 flex gap-3">
            <button type="submit" className="flex-1 py-3 bg-blue-600 text-white rounded-xl font-bold">Save Configuration</button>
            <button type="button" onClick={onClose} className="flex-1 py-3 bg-slate-100 text-slate-600 rounded-xl font-bold">Cancel</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default PackFormModal;
