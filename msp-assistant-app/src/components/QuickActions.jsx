import React from 'react';
import { Cloud, Terminal, FileText, Zap } from 'lucide-react';

const quickActions = [
  { icon: Cloud, label: 'Azure VM Issue', prompt: 'Help me troubleshoot an Azure VM that\'s not responding' },
  { icon: Terminal, label: 'PowerShell Script', prompt: 'Generate a PowerShell script to check disk space across multiple servers' },
  { icon: FileText, label: 'Incident Report', prompt: 'Help me document an incident for a client' },
  { icon: Zap, label: 'AD Password Reset', prompt: 'Walk me through password reset troubleshooting in AD' }
];

export default function QuickActions({ onSelectAction }) {
  return (
    <div className="px-6 py-4 bg-slate-800/30">
      <p className="text-sm text-slate-400 mb-3">Quick Actions:</p>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
        {quickActions.map((action, idx) => (
          <button
            key={idx}
            onClick={() => onSelectAction(action.prompt)}
            className="flex items-center gap-2 px-3 py-2 bg-slate-700/50 hover:bg-slate-700 rounded-lg transition-colors text-sm"
          >
            <action.icon className="w-4 h-4 text-blue-400" />
            <span>{action.label}</span>
          </button>
        ))}
      </div>
    </div>
  );
}
