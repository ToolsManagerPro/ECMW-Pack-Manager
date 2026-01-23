
import React, { useState, useEffect } from 'react';
import { Pack } from '../types';
import { ENTITY_OPTIONS, PLATFORM_OPTIONS, TEAM_OPTIONS, STATUS_OPTIONS, LOCATION_OPTIONS } from '../constants';

interface PackFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (pack: Pack) => void;
  initialData?: Pack | null;
}

const PackFormModal: React.FC<PackFormModalProps> = ({ isOpen, onClose, onSubmit, initialData }) => {
  const [formData, setFormData] = useState<Partial<Pack>>({});

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
        backup: 'Non'
      });
    }
  }, [initialData, isOpen]);

  if (!isOpen) return null;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData as Pack);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-hidden flex flex-col">
        <div className="px-6 py-4 border-b border-slate-100 flex justify-between items-center bg-slate-50">
          <h2 className="text-xl font-bold text-slate-800">
            {initialData ? 'Edit Pack Configuration' : 'Add New Pack Configuration'}
          </h2>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600 transition-colors">
            <i className="fas fa-times text-xl"></i>
          </button>
        </div>

        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-6 space-y-6 custom-scrollbar">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-1">Entity</label>
              <select name="entity" value={formData.entity} onChange={handleChange} className="w-full rounded-lg border-slate-200 focus:ring-blue-500 focus:border-blue-500 text-sm py-2">
                {ENTITY_OPTIONS.map(opt => <option key={opt} value={opt}>{opt}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-1">Entity Prod</label>
              <input type="text" name="entityProd" value={formData.entityProd || ''} onChange={handleChange} className="w-full rounded-lg border-slate-200 text-sm py-2" required />
            </div>
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-1">Platform</label>
              <select name="platform" value={formData.platform} onChange={handleChange} className="w-full rounded-lg border-slate-200 text-sm py-2">
                {PLATFORM_OPTIONS.map(opt => <option key={opt} value={opt}>{opt}</option>)}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-1">Team</label>
              <select name="team" value={formData.team} onChange={handleChange} className="w-full rounded-lg border-slate-200 text-sm py-2">
                {TEAM_OPTIONS.map(opt => <option key={opt} value={opt}>{opt}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-1">Location</label>
              <select name="localExternal" value={formData.localExternal} onChange={handleChange} className="w-full rounded-lg border-slate-200 text-sm py-2">
                {LOCATION_OPTIONS.map(opt => <option key={opt} value={opt}>{opt}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-1">Pack Name</label>
              <input type="text" name="pack" value={formData.pack || ''} onChange={handleChange} className="w-full rounded-lg border-slate-200 text-sm py-2" required />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-1">Server IP/Name</label>
              <input type="text" name="server" value={formData.server || ''} onChange={handleChange} className="w-full rounded-lg border-slate-200 text-sm py-2" />
            </div>
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-1">RDPS Session</label>
              <input type="text" name="rdps" value={formData.rdps || ''} onChange={handleChange} className="w-full rounded-lg border-slate-200 text-sm py-2" />
            </div>
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-1">Password</label>
              <input type="text" name="password" value={formData.password || ''} onChange={handleChange} className="w-full rounded-lg border-slate-200 text-sm py-2" />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-1">Profiles Count</label>
              <input type="number" name="countProfiles" value={formData.countProfiles || ''} onChange={handleChange} className="w-full rounded-lg border-slate-200 text-sm py-2" />
            </div>
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-1">Interval</label>
              <input type="text" name="interval" value={formData.interval || ''} onChange={handleChange} className="w-full rounded-lg border-slate-200 text-sm py-2" />
            </div>
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-1">Status</label>
              <select name="status" value={formData.status} onChange={handleChange} className="w-full rounded-lg border-slate-200 text-sm py-2">
                {STATUS_OPTIONS.map(opt => <option key={opt} value={opt}>{opt}</option>)}
              </select>
            </div>
          </div>

          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-1">Notes</label>
            <textarea name="notes" value={formData.notes || ''} onChange={handleChange} rows={3} className="w-full rounded-lg border-slate-200 text-sm py-2" placeholder="Internal comments..."></textarea>
          </div>
        </form>

        <div className="px-6 py-4 border-t border-slate-100 bg-slate-50 flex justify-end gap-3">
          <button onClick={onClose} type="button" className="px-4 py-2 text-sm font-medium text-slate-600 hover:bg-slate-200 rounded-lg transition-colors">
            Cancel
          </button>
          <button onClick={handleSubmit} type="submit" className="px-6 py-2 text-sm font-bold text-white bg-blue-600 hover:bg-blue-700 rounded-lg shadow-md transition-all active:scale-95">
            {initialData ? 'Save Changes' : 'Create Pack'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default PackFormModal;
