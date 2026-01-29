import React, { useState, useEffect } from 'https://esm.sh/react@18.2.0';
import { ENTITY_OPTIONS, PLATFORM_OPTIONS, TEAM_OPTIONS, STATUS_OPTIONS, LOCATION_OPTIONS } from '../constants.js';

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
        backup: 'Non'
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

  const inputClass = "w-full rounded-lg border-slate-200 text-sm py-2 focus:ring-2 focus:ring-blue-500 outline-none border";

  return React.createElement('div', { className: "fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4" },
    React.createElement('div', { className: "bg-white rounded-2xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-hidden flex flex-col" },
      // Header
      React.createElement('div', { className: "px-6 py-4 border-b border-slate-100 flex justify-between items-center bg-slate-50" },
        React.createElement('h2', { className: "text-xl font-bold text-slate-800" }, 
          initialData ? 'Edit Pack Configuration' : 'Add New Pack Configuration'
        ),
        React.createElement('button', { onClick: onClose, className: "text-slate-400 hover:text-slate-600" },
          React.createElement('i', { className: "fas fa-times text-xl" })
        )
      ),

      // Form
      React.createElement('form', { onSubmit: handleSubmit, className: "flex-1 overflow-y-auto p-6 space-y-6 custom-scrollbar" },
        // Grid Row 1
        React.createElement('div', { className: "grid grid-cols-1 md:grid-cols-3 gap-4" },
          React.createElement('div', null,
            React.createElement('label', { className: "block text-sm font-semibold text-slate-700 mb-1" }, "Entity"),
            React.createElement('select', { name: "entity", value: formData.entity, onChange: handleChange, className: inputClass },
              ENTITY_OPTIONS.map(opt => React.createElement('option', { key: opt, value: opt }, opt))
            )
          ),
          React.createElement('div', null,
            React.createElement('label', { className: "block text-sm font-semibold text-slate-700 mb-1" }, "Entity Prod"),
            React.createElement('input', { type: "text", name: "entityProd", value: formData.entityProd || '', onChange: handleChange, className: inputClass, required: true })
          ),
          React.createElement('div', null,
            React.createElement('label', { className: "block text-sm font-semibold text-slate-700 mb-1" }, "Platform"),
            React.createElement('select', { name: "platform", value: formData.platform, onChange: handleChange, className: inputClass },
              PLATFORM_OPTIONS.map(opt => React.createElement('option', { key: opt, value: opt }, opt))
            )
          )
        ),

        // Grid Row 2
        React.createElement('div', { className: "grid grid-cols-1 md:grid-cols-3 gap-4" },
          React.createElement('div', null,
            React.createElement('label', { className: "block text-sm font-semibold text-slate-700 mb-1" }, "Pack Name"),
            React.createElement('input', { type: "text", name: "pack", value: formData.pack || '', onChange: handleChange, className: inputClass, required: true })
          ),
          React.createElement('div', null,
            React.createElement('label', { className: "block text-sm font-semibold text-slate-700 mb-1" }, "Server"),
            React.createElement('input', { type: "text", name: "server", value: formData.server || '', onChange: handleChange, className: inputClass })
          ),
          React.createElement('div', null,
            React.createElement('label', { className: "block text-sm font-semibold text-slate-700 mb-1" }, "Status"),
            React.createElement('select', { name: "status", value: formData.status, onChange: handleChange, className: inputClass },
              STATUS_OPTIONS.map(opt => React.createElement('option', { key: opt, value: opt }, opt))
            )
          )
        )
      ),

      // Footer
      React.createElement('div', { className: "px-6 py-4 border-t border-slate-100 bg-slate-50 flex justify-end gap-3" },
        React.createElement('button', { onClick: onClose, type: "button", className: "px-4 py-2 text-sm font-medium text-slate-600 hover:bg-slate-200 rounded-lg" }, "Cancel"),
        React.createElement('button', { onClick: handleSubmit, type: "submit", className: "px-6 py-2 text-sm font-bold text-white bg-blue-600 hover:bg-blue-700 rounded-lg shadow-md" }, 
          initialData ? 'Save Changes' : 'Create Pack'
        )
      )
    )
  );
};

export default PackFormModal;
