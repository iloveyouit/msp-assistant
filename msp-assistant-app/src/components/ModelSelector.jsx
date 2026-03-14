import React, { useState, useEffect, useRef } from 'react';
import { ChevronDown, Cpu, Check } from 'lucide-react';

const PROVIDER_COLORS = {
  anthropic: 'bg-orange-500',
  openai: 'bg-green-500',
  google: 'bg-blue-500',
  ollama: 'bg-purple-500'
};

const PROVIDER_NAMES = {
  anthropic: 'Anthropic',
  openai: 'OpenAI',
  google: 'Google',
  ollama: 'Ollama (Local)'
};

export default function ModelSelector({ selectedModel, onModelChange, apiUrl }) {
  const [isOpen, setIsOpen] = useState(false);
  const [models, setModels] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const dropdownRef = useRef(null);

  useEffect(() => {
    fetchModels();
  }, [apiUrl]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

  const fetchModels = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${apiUrl}/api/models`);
      if (!response.ok) throw new Error('Failed to fetch models');
      const data = await response.json();
      setModels(data.models || []);

      // Set default model if none selected
      if (!selectedModel && data.models?.length > 0) {
        onModelChange(data.models[0].fullId);
      }
      setError(null);
    } catch (err) {
      setError('Could not load models');
      console.error('Error fetching models:', err);
    } finally {
      setLoading(false);
    }
  };

  const getSelectedModelInfo = () => {
    return models.find(m => m.fullId === selectedModel) || null;
  };

  const groupedModels = models.reduce((acc, model) => {
    if (!acc[model.provider]) {
      acc[model.provider] = [];
    }
    acc[model.provider].push(model);
    return acc;
  }, {});

  const selectedInfo = getSelectedModelInfo();

  if (loading) {
    return (
      <div className="flex items-center gap-2 px-3 py-2 bg-slate-700 rounded-lg text-sm text-slate-400">
        <Cpu className="w-4 h-4 animate-pulse" />
        <span>Loading models...</span>
      </div>
    );
  }

  if (error || models.length === 0) {
    return (
      <div className="flex items-center gap-2 px-3 py-2 bg-slate-700 rounded-lg text-sm text-slate-400">
        <Cpu className="w-4 h-4" />
        <span>{error || 'No models available'}</span>
      </div>
    );
  }

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-3 py-2 bg-slate-700 hover:bg-slate-600 rounded-lg transition-colors text-sm"
      >
        {selectedInfo && (
          <span className={`w-2 h-2 rounded-full ${PROVIDER_COLORS[selectedInfo.provider]}`} />
        )}
        <Cpu className="w-4 h-4" />
        <span className="max-w-32 truncate">
          {selectedInfo?.name || 'Select Model'}
        </span>
        <ChevronDown className={`w-4 h-4 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {isOpen && (
        <div className="absolute left-0 mt-2 w-72 bg-slate-800 rounded-lg shadow-xl border border-slate-700 z-50 max-h-96 overflow-y-auto">
          {Object.entries(groupedModels).map(([provider, providerModels]) => (
            <div key={provider}>
              <div className="px-3 py-2 text-xs font-semibold text-slate-400 bg-slate-900/50 flex items-center gap-2">
                <span className={`w-2 h-2 rounded-full ${PROVIDER_COLORS[provider]}`} />
                {PROVIDER_NAMES[provider] || provider}
              </div>
              {providerModels.map((model) => (
                <button
                  key={model.fullId}
                  onClick={() => {
                    onModelChange(model.fullId);
                    setIsOpen(false);
                  }}
                  className={`w-full text-left px-4 py-2 hover:bg-slate-700 flex items-center justify-between ${
                    selectedModel === model.fullId ? 'bg-slate-700/50' : ''
                  }`}
                >
                  <div>
                    <div className="text-sm font-medium">{model.name}</div>
                    <div className="text-xs text-slate-400">{model.description}</div>
                  </div>
                  {selectedModel === model.fullId && (
                    <Check className="w-4 h-4 text-green-400" />
                  )}
                </button>
              ))}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
