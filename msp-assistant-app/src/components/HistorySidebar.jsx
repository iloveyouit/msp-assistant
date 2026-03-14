import React from 'react';
import { X } from 'lucide-react';

export default function HistorySidebar({
  conversations,
  onLoad,
  onDelete,
  onClose
}) {
  const handleDelete = (id, name) => {
    if (window.confirm(`Delete conversation "${name}"?`)) {
      onDelete(id);
    }
  };

  return (
    <div className="absolute right-0 top-20 w-80 h-[calc(100vh-5rem)] bg-slate-800 border-l border-slate-700 z-40 overflow-y-auto">
      <div className="p-4">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold">Saved Conversations</h3>
          <button onClick={onClose} className="hover:bg-slate-700 p-1 rounded">
            <X className="w-5 h-5" />
          </button>
        </div>

        {conversations.length === 0 ? (
          <p className="text-slate-400 text-sm">No saved conversations yet.</p>
        ) : (
          <div className="space-y-2">
            {conversations.map(conv => (
              <div key={conv.id} className="bg-slate-700 p-3 rounded-lg">
                <div className="flex items-start justify-between">
                  <div
                    className="flex-1 cursor-pointer hover:text-blue-300"
                    onClick={() => onLoad(conv)}
                  >
                    <p className="font-semibold text-sm">{conv.name}</p>
                    <p className="text-xs text-slate-400">
                      {new Date(conv.timestamp).toLocaleString()}
                    </p>
                    <p className="text-xs text-slate-400 mt-1">
                      {conv.messages.length} messages
                    </p>
                  </div>
                  <button
                    onClick={() => handleDelete(conv.id, conv.name)}
                    className="text-red-400 hover:text-red-300 hover:bg-slate-600 p-1 rounded"
                    title="Delete conversation"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
