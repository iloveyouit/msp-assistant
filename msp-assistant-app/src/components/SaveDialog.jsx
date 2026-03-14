import React, { useState } from 'react';

export default function SaveDialog({ onSave, onClose }) {
  const [name, setName] = useState('');

  const handleSave = () => {
    if (!name.trim()) {
      alert('Please enter a conversation name');
      return;
    }
    onSave(name.trim());
    setName('');
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      handleSave();
    } else if (e.key === 'Escape') {
      onClose();
    }
  };

  return (
    <div className="absolute inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-slate-800 p-6 rounded-lg w-96 border border-slate-700">
        <h3 className="text-lg font-semibold mb-4">Save Conversation</h3>
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Enter conversation name..."
          className="w-full bg-slate-700 text-white placeholder-slate-400 rounded-lg px-4 py-2 mb-4 focus:outline-none focus:ring-2 focus:ring-blue-500"
          onKeyDown={handleKeyDown}
          autoFocus
        />
        <div className="flex gap-2">
          <button
            onClick={handleSave}
            className="flex-1 bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded-lg"
          >
            Save
          </button>
          <button
            onClick={onClose}
            className="flex-1 bg-slate-700 hover:bg-slate-600 px-4 py-2 rounded-lg"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}
