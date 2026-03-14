import React, { useState, useEffect } from 'react';
import {
  Header,
  MessageList,
  ChatInput,
  QuickActions,
  SaveDialog,
  HistorySidebar
} from './components';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3010';

const INITIAL_MESSAGE = {
  role: 'assistant',
  content: '**MSP Operations Assistant Pro Ready**\n\nI can help you with:\n- Azure VM & Entra ID troubleshooting\n- PowerShell automation scripts\n- Windows Server diagnostics\n- Incident analysis & documentation\n- Log file analysis (upload Event Logs, IIS logs, etc.)\n- Auto-log incidents to Notion\n- Current Microsoft KB article research\n\nWhat are you working on?',
  timestamp: new Date().toISOString()
};

const SYSTEM_PROMPT = `You are an expert MSP Operations Assistant specializing in:
- Azure infrastructure (VMs, Entra ID, networking, Update Management)
- Windows Server administration and troubleshooting
- PowerShell automation for MSP environments
- Active Directory and hybrid identity
- Incident response and documentation
- Log file analysis (Windows Event Logs, IIS logs, Application logs)

When responding:
1. Provide clear, actionable troubleshooting steps
2. Generate PowerShell scripts with proper error handling
3. Reference current Microsoft documentation when relevant
4. Format responses professionally for MSP documentation
5. Ask clarifying questions when needed (client name, error messages, environment details)
6. When analyzing logs, identify critical errors, warnings, and patterns
7. After resolving incidents, offer to log them to Notion with full details

User context: Rob Loftin, Senior IT Infrastructure Consultant at Long View Systems (143IT), managing 500+ endpoints and 600+ servers across hybrid Azure/on-prem environments for MSP clients including GR Energy, McLeod, Deer Park, Canes Midstream, and Lab Central.

Available clients: GR Energy, McLeod, Deer Park, Canes Midstream, Lab Central.`;

export default function App() {
  const [messages, setMessages] = useState([{ ...INITIAL_MESSAGE }]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [uploadedFile, setUploadedFile] = useState(null);
  const [showHistory, setShowHistory] = useState(false);
  const [showSaveDialog, setShowSaveDialog] = useState(false);
  const [savedConversations, setSavedConversations] = useState([]);
  const [selectedModel, setSelectedModel] = useState(null);

  // Load saved conversations from localStorage
  useEffect(() => {
    const saved = localStorage.getItem('msp_conversations');
    if (saved) {
      try {
        setSavedConversations(JSON.parse(saved));
      } catch (e) {
        console.error('Failed to load saved conversations:', e);
      }
    }
  }, []);

  const handleFileUpload = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    if (file.size > 5 * 1024 * 1024) {
      alert('File too large. Please upload files under 5MB.');
      return;
    }

    const reader = new FileReader();
    reader.onload = async (e) => {
      const content = e.target.result;
      setUploadedFile({ name: file.name, content, type: file.type });
      setInput(`I've uploaded a file: **${file.name}**\n\nPlease analyze this log file and identify any critical issues, errors, or patterns.`);
    };

    if (file.type.includes('text') || file.name.endsWith('.log') || file.name.endsWith('.txt') || file.name.endsWith('.csv')) {
      reader.readAsText(file);
    } else {
      reader.readAsDataURL(file);
    }

    // Reset file input
    event.target.value = '';
  };

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;

    let messageContent = input;
    if (uploadedFile) {
      const truncatedContent = uploadedFile.content.substring(0, 10000);
      const isTruncated = uploadedFile.content.length > 10000;
      messageContent = `${input}\n\n--- FILE CONTENT: ${uploadedFile.name} ${isTruncated ? '(truncated to 10,000 chars)' : ''} ---\n${truncatedContent}\n--- END FILE ---`;
    }

    const userMessage = {
      role: 'user',
      content: input, // Display the original input
      timestamp: new Date().toISOString(),
      file: uploadedFile ? { name: uploadedFile.name } : null
    };

    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    try {
      // Build messages array for API (include file content in the actual message)
      const apiMessages = messages
        .filter(m => m.role !== 'system')
        .map(m => ({ role: m.role, content: m.content }));

      apiMessages.push({ role: 'user', content: messageContent });

      const response = await fetch(`${API_URL}/api/chat`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          messages: apiMessages,
          systemPrompt: SYSTEM_PROMPT,
          model: selectedModel
        })
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || `Server error: ${response.status}`);
      }

      const data = await response.json();

      let assistantContent = '';
      for (const block of data.content) {
        if (block.type === 'text') {
          assistantContent += block.text;
        }
      }

      const assistantMessage = {
        role: 'assistant',
        content: assistantContent.trim(),
        timestamp: new Date().toISOString()
      };

      setMessages(prev => [...prev, assistantMessage]);
      setUploadedFile(null);
    } catch (error) {
      console.error('Chat error:', error);
      setMessages(prev => [...prev, {
        role: 'assistant',
        content: `**Error:** ${error.message}\n\nPlease check that the backend server is running and try again.`,
        timestamp: new Date().toISOString()
      }]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleNewChat = () => {
    setMessages([{ ...INITIAL_MESSAGE, timestamp: new Date().toISOString() }]);
    setInput('');
    setUploadedFile(null);
    setShowHistory(false);
  };

  const handleSaveConversation = (name) => {
    const conversation = {
      id: Date.now(),
      name,
      messages,
      timestamp: new Date().toISOString()
    };

    const updated = [...savedConversations, conversation];
    setSavedConversations(updated);
    localStorage.setItem('msp_conversations', JSON.stringify(updated));
    setShowSaveDialog(false);
  };

  const handleLoadConversation = (conversation) => {
    setMessages(conversation.messages);
    setShowHistory(false);
  };

  const handleDeleteConversation = (id) => {
    const updated = savedConversations.filter(c => c.id !== id);
    setSavedConversations(updated);
    localStorage.setItem('msp_conversations', JSON.stringify(updated));
  };

  return (
    <div className="flex flex-col h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 text-white">
      <Header
        onFileUpload={handleFileUpload}
        onToggleHistory={() => setShowHistory(!showHistory)}
        onSave={() => setShowSaveDialog(true)}
        onNewChat={handleNewChat}
        messages={messages}
        selectedModel={selectedModel}
        onModelChange={setSelectedModel}
        apiUrl={API_URL}
      />

      {showHistory && (
        <HistorySidebar
          conversations={savedConversations}
          onLoad={handleLoadConversation}
          onDelete={handleDeleteConversation}
          onClose={() => setShowHistory(false)}
        />
      )}

      {showSaveDialog && (
        <SaveDialog
          onSave={handleSaveConversation}
          onClose={() => setShowSaveDialog(false)}
        />
      )}

      {messages.length === 1 && (
        <QuickActions onSelectAction={setInput} />
      )}

      <MessageList messages={messages} isLoading={isLoading} />

      <ChatInput
        input={input}
        setInput={setInput}
        onSend={handleSend}
        isLoading={isLoading}
        uploadedFile={uploadedFile}
        onClearFile={() => setUploadedFile(null)}
      />
    </div>
  );
}
