import React, { useState } from 'react';
import { Copy, Download, Check, FileText } from 'lucide-react';

const formatMessage = (content) => {
  return content
    .split('\n')
    .map((line, i) => {
      if (line.startsWith('```')) {
        return null;
      }
      if (line.startsWith('# ')) {
        return <h2 key={i} className="text-xl font-bold mt-4 mb-2">{line.slice(2)}</h2>;
      }
      if (line.startsWith('## ')) {
        return <h3 key={i} className="text-lg font-semibold mt-3 mb-2">{line.slice(3)}</h3>;
      }
      if (line.startsWith('### ')) {
        return <h4 key={i} className="text-md font-semibold mt-2 mb-1">{line.slice(4)}</h4>;
      }
      if (line.startsWith('- ')) {
        return <li key={i} className="ml-4">{line.slice(2)}</li>;
      }
      if (line.match(/^\d+\. /)) {
        return <li key={i} className="ml-4 list-decimal">{line.replace(/^\d+\. /, '')}</li>;
      }
      if (line.startsWith('**') && line.endsWith('**')) {
        return <p key={i} className="font-semibold mt-2">{line.slice(2, -2)}</p>;
      }
      if (line.includes('*') || line.includes('**')) {
        return <p key={i} className="text-blue-300 italic mb-2">{line}</p>;
      }
      return line ? <p key={i} className="mb-2">{line}</p> : <br key={i} />;
    });
};

export default function Message({ message }) {
  const isUser = message.role === 'user';
  const [copied, setCopied] = useState(false);
  const [showActions, setShowActions] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(message.content);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  const handleCopyCode = async (code) => {
    try {
      await navigator.clipboard.writeText(code);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy code:', err);
    }
  };

  const handleDownload = (format) => {
    const timestamp = message.timestamp
      ? new Date(message.timestamp).toISOString().split('T')[0]
      : new Date().toISOString().split('T')[0];

    let content = '';
    let filename = '';
    let mimeType = '';

    if (format === 'md') {
      content = `# Assistant Response\n\n**Date:** ${new Date(message.timestamp || Date.now()).toLocaleString()}\n\n---\n\n${message.content}`;
      filename = `response-${timestamp}.md`;
      mimeType = 'text/markdown';
    } else if (format === 'txt') {
      // Convert markdown to plain text
      content = message.content
        .replace(/\*\*(.*?)\*\*/g, '$1')  // Remove bold
        .replace(/\*(.*?)\*/g, '$1')       // Remove italic
        .replace(/^#+\s/gm, '')            // Remove headers
        .replace(/```[\s\S]*?```/g, (match) => {
          // Keep code blocks but remove backticks
          return match.replace(/```\w*\n?/g, '\n').trim();
        });
      content = `Assistant Response\nDate: ${new Date(message.timestamp || Date.now()).toLocaleString()}\n${'='.repeat(50)}\n\n${content}`;
      filename = `response-${timestamp}.txt`;
      mimeType = 'text/plain';
    }

    const blob = new Blob([content], { type: mimeType });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div
      className={`flex ${isUser ? 'justify-end' : 'justify-start'} group`}
      onMouseEnter={() => setShowActions(true)}
      onMouseLeave={() => setShowActions(false)}
    >
      <div className="relative">
        <div
          className={`max-w-3xl rounded-lg px-4 py-3 ${
            isUser
              ? 'bg-blue-600 text-white'
              : 'bg-slate-800/70 text-slate-100'
          }`}
        >
          {message.file && (
            <div className="mb-2 text-xs bg-slate-900/50 px-2 py-1 rounded">
              {message.file.name}
            </div>
          )}
          {!isUser ? (
            <div className="prose prose-invert prose-sm max-w-none">
              {message.content.split('```').map((part, i) => {
                if (i % 2 === 1) {
                  const lines = part.split('\n');
                  const language = lines[0];
                  const code = lines.slice(1).join('\n') || part;
                  return (
                    <div key={i} className="relative group/code">
                      <pre className="bg-slate-900 p-3 rounded-lg overflow-x-auto mt-2 mb-2">
                        {language && (
                          <div className="text-xs text-slate-500 mb-2">{language}</div>
                        )}
                        <code className="text-sm text-green-400">{code}</code>
                      </pre>
                      <button
                        onClick={() => handleCopyCode(code)}
                        className="absolute top-2 right-2 p-1.5 bg-slate-700 hover:bg-slate-600 rounded opacity-0 group-hover/code:opacity-100 transition-opacity"
                        title="Copy code"
                      >
                        {copied ? (
                          <Check className="w-3.5 h-3.5 text-green-400" />
                        ) : (
                          <Copy className="w-3.5 h-3.5 text-slate-300" />
                        )}
                      </button>
                    </div>
                  );
                }
                return <div key={i}>{formatMessage(part)}</div>;
              })}
            </div>
          ) : (
            <p className="whitespace-pre-wrap">{message.content}</p>
          )}
          {message.timestamp && (
            <p className="text-xs opacity-50 mt-2">
              {new Date(message.timestamp).toLocaleTimeString()}
            </p>
          )}
        </div>

        {/* Action buttons - show on hover for assistant messages */}
        {!isUser && showActions && (
          <div className="absolute -top-2 right-2 flex gap-1 bg-slate-700 rounded-lg p-1 shadow-lg border border-slate-600">
            <button
              onClick={handleCopy}
              className="p-1.5 hover:bg-slate-600 rounded transition-colors"
              title="Copy response"
            >
              {copied ? (
                <Check className="w-4 h-4 text-green-400" />
              ) : (
                <Copy className="w-4 h-4 text-slate-300" />
              )}
            </button>
            <button
              onClick={() => handleDownload('md')}
              className="p-1.5 hover:bg-slate-600 rounded transition-colors"
              title="Download as Markdown"
            >
              <Download className="w-4 h-4 text-slate-300" />
            </button>
            <button
              onClick={() => handleDownload('txt')}
              className="p-1.5 hover:bg-slate-600 rounded transition-colors"
              title="Download as Text"
            >
              <FileText className="w-4 h-4 text-slate-300" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
