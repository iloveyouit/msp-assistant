import React from 'react';
import { Send, Loader2, FileText, X } from 'lucide-react';

export default function ChatInput({
  input,
  setInput,
  onSend,
  isLoading,
  uploadedFile,
  onClearFile
}) {
  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      onSend();
    }
  };

  return (
    <div className="bg-slate-800/50 backdrop-blur border-t border-slate-700 px-6 py-4">
      {uploadedFile && (
        <div className="mb-3 px-3 py-2 bg-blue-900/30 border border-blue-800 rounded-lg">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <FileText className="w-4 h-4 text-blue-400" />
              <span className="text-sm">File ready: {uploadedFile.name}</span>
            </div>
            <button
              onClick={onClearFile}
              className="text-slate-400 hover:text-white"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}
      <div className="flex gap-2">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Describe your issue, upload logs, or ask for help..."
          className="flex-1 bg-slate-700 text-white placeholder-slate-400 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
          disabled={isLoading}
        />
        <button
          onClick={onSend}
          disabled={isLoading || !input.trim()}
          className="bg-blue-600 hover:bg-blue-700 disabled:bg-slate-700 disabled:cursor-not-allowed px-6 py-3 rounded-lg transition-colors flex items-center gap-2"
        >
          {isLoading ? (
            <Loader2 className="w-5 h-5 animate-spin" />
          ) : (
            <Send className="w-5 h-5" />
          )}
        </button>
      </div>
      <p className="text-xs text-slate-500 mt-2">
        Try: "Azure VM performance issue" | Upload Event Logs | "Create Notion incident for SQL outage"
      </p>
    </div>
  );
}
