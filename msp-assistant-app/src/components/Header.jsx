import React, { useRef, useState, useEffect } from 'react';
import { Terminal, Upload, History, Save, Download, Plus } from 'lucide-react';
import ModelSelector from './ModelSelector';

export default function Header({
  onFileUpload,
  onToggleHistory,
  onSave,
  onNewChat,
  messages,
  selectedModel,
  onModelChange,
  apiUrl
}) {
  const fileInputRef = useRef(null);
  const [showExportMenu, setShowExportMenu] = useState(false);
  const exportMenuRef = useRef(null);

  // Close export menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (exportMenuRef.current && !exportMenuRef.current.contains(event.target)) {
        setShowExportMenu(false);
      }
    };

    if (showExportMenu) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showExportMenu]);

  const exportToMarkdown = () => {
    let markdown = `# MSP Operations Assistant - Conversation Export\n\n`;
    markdown += `**Date:** ${new Date().toLocaleString()}\n\n`;
    markdown += `---\n\n`;

    messages.forEach(msg => {
      const role = msg.role === 'user' ? '**You**' : '**Assistant**';
      const time = msg.timestamp ? new Date(msg.timestamp).toLocaleTimeString() : '';
      markdown += `### ${role} ${time ? `(${time})` : ''}\n\n`;
      markdown += `${msg.content}\n\n`;
      markdown += `---\n\n`;
    });

    const blob = new Blob([markdown], { type: 'text/markdown' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `msp-conversation-${new Date().toISOString().split('T')[0]}.md`;
    a.click();
    URL.revokeObjectURL(url); // Fix memory leak
    setShowExportMenu(false);
  };

  const exportToDocx = () => {
    alert('DOCX export coming soon! For now, use Markdown export.');
    setShowExportMenu(false);
  };

  return (
    <div className="bg-slate-800/50 backdrop-blur border-b border-slate-700 px-6 py-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="bg-blue-500 p-2 rounded-lg">
            <Terminal className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-xl font-bold">MSP Operations Assistant Pro</h1>
            <p className="text-sm text-slate-400">Azure | PowerShell | Windows Server | Log Analysis</p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={onNewChat}
            className="flex items-center gap-2 px-3 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors"
            title="Start new conversation"
          >
            <Plus className="w-4 h-4" />
            <span className="text-sm">New Chat</span>
          </button>

          <ModelSelector
            selectedModel={selectedModel}
            onModelChange={onModelChange}
            apiUrl={apiUrl}
          />

          <button
            onClick={() => fileInputRef.current?.click()}
            className="flex items-center gap-2 px-3 py-2 bg-slate-700 hover:bg-slate-600 rounded-lg transition-colors"
            title="Upload log file"
          >
            <Upload className="w-4 h-4" />
            <span className="text-sm">Upload</span>
          </button>
          <input
            ref={fileInputRef}
            type="file"
            onChange={onFileUpload}
            accept=".log,.txt,.csv,.evtx"
            className="hidden"
          />

          <button
            onClick={onToggleHistory}
            className="flex items-center gap-2 px-3 py-2 bg-slate-700 hover:bg-slate-600 rounded-lg transition-colors"
            title="View saved conversations"
          >
            <History className="w-4 h-4" />
            <span className="text-sm">History</span>
          </button>

          <button
            onClick={onSave}
            className="flex items-center gap-2 px-3 py-2 bg-slate-700 hover:bg-slate-600 rounded-lg transition-colors"
            title="Save conversation"
          >
            <Save className="w-4 h-4" />
            <span className="text-sm">Save</span>
          </button>

          <div className="relative" ref={exportMenuRef}>
            <button
              onClick={() => setShowExportMenu(!showExportMenu)}
              className="flex items-center gap-2 px-3 py-2 bg-green-600 hover:bg-green-700 rounded-lg transition-colors"
              title="Export conversation"
            >
              <Download className="w-4 h-4" />
              <span className="text-sm">Export</span>
            </button>

            {showExportMenu && (
              <div className="absolute right-0 mt-2 w-48 bg-slate-800 rounded-lg shadow-xl border border-slate-700 z-50">
                <button
                  onClick={exportToMarkdown}
                  className="w-full text-left px-4 py-2 hover:bg-slate-700 rounded-t-lg"
                >
                  Export as Markdown
                </button>
                <button
                  onClick={exportToDocx}
                  className="w-full text-left px-4 py-2 hover:bg-slate-700 rounded-b-lg"
                >
                  Export as DOCX
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
