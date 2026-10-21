import React, { useState, useRef, useEffect } from 'react';
import { 
  Send, 
  Plus, 
  Mic, 
  Trash2, 
  FileText, 
  ArrowUpRight, 
  Volume2, 
  VolumeX, 
  Terminal, 
  RotateCcw,
  Sparkles,
  Bot
} from 'lucide-react';
import { Agent, AppSettings, Message, ModelId } from '../types';
import { AgentPebbleAvatar } from './AgentPebbleAvatar';
import { ApprovalCard } from './ApprovalCard';
import { MascotAvatar } from './MascotAvatar';

interface WhiteGlassChatAreaProps {
  agent?: Agent;
  allAgents: Agent[];
  messages: Message[];
  settings?: AppSettings;
  onSendMessage: (text: string) => void;
  onApproveToolCall: (toolCallId: string) => void;
  onRejectToolCall: (toolCallId: string) => void;
  onModifyToolCall?: (toolCallId: string, updatedArgs: Record<string, any>) => void;
  onUpdateAgentModel: (agentId: string, model: ModelId) => void;
  onOpenBotProfile?: () => void;
  onToggleWorkspace: () => void;
  isWorkspaceOpen: boolean;
  onClearHistory: () => void;
  onDeleteAgent?: (agentId: string) => void;
  onOpenNewAgentModal?: () => void;
}

export const WhiteGlassChatArea: React.FC<WhiteGlassChatAreaProps> = ({
  agent,
  allAgents,
  messages,
  settings,
  onSendMessage,
  onApproveToolCall,
  onRejectToolCall,
  onModifyToolCall,
  onUpdateAgentModel,
  onOpenBotProfile,
  onToggleWorkspace,
  isWorkspaceOpen,
  onClearHistory,
  onDeleteAgent,
  onOpenNewAgentModal
}) => {
  const [inputText, setInputText] = useState('');
  const [isRecording, setIsRecording] = useState(false);
  const [mentionQuery, setMentionQuery] = useState<string | null>(null);
  const [cursorPosition, setCursorPosition] = useState<number>(0);
  const [playingMessageId, setPlayingMessageId] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  if (!agent) {
    return (
      <main className="flex-1 flex flex-col h-full bg-white/40 backdrop-blur-md relative overflow-hidden select-none items-center justify-center p-8 text-center">
        <div className="max-w-md w-full p-8 rounded-3xl bg-white/80 border border-zinc-200/80 shadow-xl backdrop-blur-xl space-y-4">
          <div className="flex justify-center">
            <MascotAvatar size="xl" animate glow />
          </div>
          <div>
            <h2 className="text-xl font-bold text-zinc-900 font-sans tracking-tight">
              Welcome to QUBOT
            </h2>
            <p className="text-xs text-zinc-500 mt-1 leading-relaxed">
              Your autonomous multi-model agent assistant. No bots are currently in your workspace.
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-zinc-50 border border-zinc-200 text-left text-xs text-zinc-600 space-y-2">
            <div className="font-semibold text-zinc-800 flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-sky-600" />
              What you can do:
            </div>
            <ul className="list-disc pl-4 space-y-1 text-[11px] text-zinc-500">
              <li>Create custom bots with animated QUBOT mascots and color tints</li>
              <li>Connect OpenAI (ChatGPT Plus/Pro), Claude, Gemini, Grok, or DeepSeek</li>
              <li>Enable inter-agent collaboration and subtask delegation with @mentions</li>
              <li>Execute automated bash, browser, and Composio tool workflows</li>
            </ul>
          </div>

          <div className="pt-2 flex justify-center">
            <button
              onClick={onOpenNewAgentModal}
              className="px-5 py-2.5 rounded-2xl bg-black hover:bg-zinc-800 text-white font-semibold text-xs shadow-md transition-all cursor-pointer flex items-center gap-2 hover:scale-105 active:scale-95"
            >
              <Plus className="w-4 h-4" />
              <span>Create Your First Bot</span>
            </button>
          </div>
        </div>
      </main>
    );
  }

  // Handle @mention dropdown
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    const pos = e.target.selectionStart || 0;
    setInputText(val);
    setCursorPosition(pos);

    const textBeforeCursor = val.slice(0, pos);
    const lastAtIdx = textBeforeCursor.lastIndexOf('@');
    if (lastAtIdx !== -1 && (lastAtIdx === 0 || textBeforeCursor[lastAtIdx - 1] === ' ')) {
      const query = textBeforeCursor.slice(lastAtIdx + 1);
      if (!query.includes(' ')) {
        setMentionQuery(query);
        return;
      }
    }
    setMentionQuery(null);
  };

  const handleSelectMention = (otherAgent: Agent) => {
    const textBeforeCursor = inputText.slice(0, cursorPosition);
    const textAfterCursor = inputText.slice(cursorPosition);
    const lastAtIdx = textBeforeCursor.lastIndexOf('@');
    if (lastAtIdx !== -1) {
      const newText = textBeforeCursor.slice(0, lastAtIdx) + otherAgent.handle + ' ' + textAfterCursor;
      setInputText(newText);
    }
    setMentionQuery(null);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Escape') {
      setMentionQuery(null);
    }
  };

  const mentionCandidates = allAgents.filter(a => 
    a.id !== agent.id && 
    (mentionQuery === '' || a.handle.toLowerCase().includes((mentionQuery || '').toLowerCase()) || a.name.toLowerCase().includes((mentionQuery || '').toLowerCase()))
  );

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim()) return;
    onSendMessage(inputText.trim());
    setInputText('');
    setMentionQuery(null);
  };

  const handleToggleVoiceRecord = () => {
    if (!isRecording) {
      setIsRecording(true);
      setTimeout(() => {
        setIsRecording(false);
        setInputText(prev => prev + (prev ? ' ' : '') + 'Please summarize the action items and verify the CRM sync status.');
      }, 2400);
    } else {
      setIsRecording(false);
    }
  };

  return (
    <main className="flex-1 flex flex-col h-full bg-white/40 backdrop-blur-md relative overflow-hidden select-none">
      {/* Top Header */}
      <header className="px-5 py-3 border-b border-zinc-200/60 bg-white/70 backdrop-blur-md flex items-center justify-between gap-4 select-none z-10">
        <div className="flex items-center gap-2.5">
          <button
            onClick={onOpenBotProfile}
            className="flex items-center gap-2.5 hover:opacity-85 transition-opacity cursor-pointer text-left"
            title="Edit Mascot Color & Bot Profile"
          >
            <AgentPebbleAvatar agent={agent} size="sm" />
            <div>
              <h1 className="text-sm font-semibold text-zinc-900 font-sans tracking-tight">
                {agent.name}
              </h1>
              <span className="text-[10px] text-zinc-400 font-mono">
                Click to edit mascot & memory
              </span>
            </div>
          </button>

          {/* Model Switcher Pill */}
          <select
            value={agent.model}
            onChange={(e) => onUpdateAgentModel(agent.id, e.target.value as ModelId)}
            className="ml-2 bg-zinc-100 hover:bg-zinc-200/70 border border-zinc-200/80 rounded-full px-2.5 py-0.5 text-[11px] text-zinc-600 font-mono focus:outline-none cursor-pointer transition-colors"
          >
            <option value="gemini-3.8-flash">Gemini 3.8 Flash</option>
            <option value="gemini-4-argon">Gemini 4 Argon</option>
            <option value="claude-3-7-sonnet">Claude 3.7 Sonnet</option>
            <option value="gpt-4o">GPT-4o (OpenAI)</option>
            <option value="grok-3">Grok 3 (xAI)</option>
            <option value="deepseek-r1">DeepSeek R1</option>
          </select>
        </div>

        <div className="flex items-center gap-1.5 text-zinc-400">
          <button
            onClick={onToggleWorkspace}
            className={`p-1.5 rounded-lg transition-colors cursor-pointer ${
              isWorkspaceOpen ? 'bg-zinc-200/80 text-zinc-800' : 'hover:bg-zinc-100 hover:text-zinc-700'
            }`}
            title="Toggle VM Workspace Panel"
          >
            <Terminal className="w-4 h-4" />
          </button>
          <button
            onClick={onClearHistory}
            className="p-1.5 rounded-lg hover:bg-zinc-100 hover:text-zinc-700 transition-colors cursor-pointer"
            title="Reset history"
          >
            <RotateCcw className="w-3.5 h-3.5" />
          </button>

          {/* Delete Bot Button */}
          {onDeleteAgent && (
            <button
              onClick={() => {
                if (confirm(`Are you sure you want to delete bot "${agent.name}"?`)) {
                  onDeleteAgent(agent.id);
                }
              }}
              className="p-1.5 rounded-lg hover:bg-red-50 text-zinc-400 hover:text-red-600 transition-colors cursor-pointer"
              title="Delete Bot"
            >
              <Trash2 className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      </header>

      {/* Messages Scroll Area */}
      <div className="flex-1 overflow-y-auto p-4 md:p-6 space-y-4 select-text">
        <div className="flex justify-center my-1 select-none">
          <span className="text-[11px] font-medium text-zinc-400 bg-white/70 px-2.5 py-0.5 rounded-full border border-zinc-200/40 shadow-2xs">
            Session Active
          </span>
        </div>

        {messages.map((message) => {
          const isUser = message.sender === 'user';
          const isAgent = message.sender === 'agent';
          const authorAgent = message.authorAgentId 
            ? allAgents.find(a => a.id === message.authorAgentId) 
            : (isAgent ? agent : null);

          return (
            <div
              key={message.id}
              className={`flex flex-col ${isUser ? 'items-end' : 'items-start'} max-w-xl ${isUser ? 'ml-auto' : 'mr-auto'}`}
            >
              {/* Cross-Agent Author Header if another agent joined the discussion */}
              {message.isDelegation && authorAgent && (
                <div className="flex items-center gap-1.5 mb-1 px-1">
                  <AgentPebbleAvatar agent={authorAgent} size="xs" />
                  <span className="text-xs font-bold text-zinc-800">{authorAgent.name}</span>
                  <span className="text-[10px] font-mono text-zinc-400">{authorAgent.handle}</span>
                  <span className="text-[9px] px-1.5 py-0.2 rounded-full bg-amber-100 text-amber-800 font-medium">
                    ⚡ Agent Delegated
                  </span>
                </div>
              )}

              {/* Message Bubble */}
              <div
                className={`text-sm leading-relaxed ${
                  isUser
                    ? 'bg-black text-white rounded-2xl rounded-tr-xs px-4 py-2.5 max-w-md shadow-xs'
                    : 'bg-white text-zinc-900 border border-zinc-200/70 rounded-2xl rounded-tl-xs px-4 py-3 shadow-xs'
                }`}
              >
                <div className="whitespace-pre-wrap">
                  {message.content}
                </div>

                {/* PDF Attachment preview matching reference screenshot */}
                {message.attachment && (
                  <div className="mt-3 p-2.5 bg-zinc-50 border border-zinc-200/80 rounded-xl flex items-center justify-between gap-3 text-zinc-800 cursor-pointer hover:bg-zinc-100/80 transition-colors">
                    <div className="flex items-center gap-2.5">
                      <div className="w-8 h-8 rounded-lg bg-red-500/10 border border-red-500/20 flex items-center justify-center text-red-500 font-bold text-[10px]">
                        PDF
                      </div>
                      <div>
                        <div className="text-xs font-semibold">{message.attachment.name}</div>
                        <div className="text-[10px] text-zinc-400">
                          {message.attachment.pages ? `${message.attachment.pages} pages • ` : ''}{message.attachment.size}
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* Tool calls awaiting approval or executed */}
                {message.toolCalls && message.toolCalls.length > 0 && (
                  <div className="mt-3 space-y-2">
                    {message.toolCalls.map((toolCall) => (
                      <ApprovalCard
                        key={toolCall.id}
                        toolCall={toolCall}
                        onApprove={onApproveToolCall}
                        onReject={onRejectToolCall}
                        onModify={onModifyToolCall}
                      />
                    ))}
                  </div>
                )}
              </div>

              {/* Timestamp */}
              <span className="text-[10px] text-zinc-400 mt-1 px-1">
                {message.timestamp}
              </span>
            </div>
          );
        })}
        <div ref={messagesEndRef} />
      </div>

      {/* Floating @mention suggestion dropdown */}
      {mentionQuery !== null && mentionCandidates.length > 0 && (
        <div className="absolute bottom-20 left-6 right-6 md:left-8 md:max-w-md bg-white/95 backdrop-blur-xl border border-zinc-200 rounded-2xl shadow-xl p-2 z-30">
          <div className="px-2 py-1 text-[10px] font-mono font-semibold text-zinc-400 uppercase tracking-wider">
            Mention bot to delegate task:
          </div>
          <div className="space-y-1 max-h-48 overflow-y-auto">
            {mentionCandidates.map(cand => (
              <button
                key={cand.id}
                type="button"
                onClick={() => handleSelectMention(cand)}
                className="w-full p-2 rounded-xl hover:bg-zinc-100 flex items-center gap-2.5 text-left transition-colors cursor-pointer"
              >
                <AgentPebbleAvatar agent={cand} size="xs" />
                <div className="flex-1 min-w-0">
                  <div className="text-xs font-bold text-zinc-800 truncate">{cand.name}</div>
                  <div className="text-[10px] text-zinc-500 font-mono truncate">{cand.handle} • {cand.role}</div>
                </div>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Bottom Message Input Bar */}
      <div className="p-4 bg-white/60 backdrop-blur-md border-t border-zinc-200/50">
        <form
          onSubmit={handleFormSubmit}
          className="flex items-center gap-2 bg-white/90 border border-zinc-200/90 rounded-2xl px-3 py-2 shadow-xs focus-within:border-zinc-400 transition-all"
        >
          {/* Circular Plus Button */}
          <button
            type="button"
            onClick={() => setInputText(prev => prev + '@')}
            className="w-7 h-7 rounded-full bg-zinc-100 hover:bg-zinc-200 text-zinc-600 flex items-center justify-center transition-colors cursor-pointer"
            title="Attach or Mention"
          >
            <Plus className="w-4 h-4" />
          </button>

          {/* Text Input */}
          <input
            type="text"
            value={inputText}
            onChange={handleInputChange}
            onKeyDown={handleKeyDown}
            placeholder={`Message ${agent.name} (type @ to delegate to another bot)`}
            className="flex-1 bg-transparent border-none outline-none text-xs text-zinc-900 placeholder-zinc-400"
          />

          {/* Circular Voice Microphone / Send Button */}
          {inputText.trim() ? (
            <button
              type="submit"
              className="w-8 h-8 rounded-full bg-black text-white flex items-center justify-center transition-transform hover:scale-105 cursor-pointer shadow-xs"
              title="Send message"
            >
              <Send className="w-3.5 h-3.5" />
            </button>
          ) : (
            <button
              type="button"
              onClick={handleToggleVoiceRecord}
              className={`w-8 h-8 rounded-full flex items-center justify-center transition-all cursor-pointer shadow-xs ${
                isRecording
                  ? 'bg-red-500 text-white animate-pulse'
                  : 'bg-black text-white hover:bg-zinc-800'
              }`}
              title={isRecording ? 'Listening...' : 'Voice message'}
            >
              <Mic className="w-3.5 h-3.5" />
            </button>
          )}
        </form>
      </div>
    </main>
  );
};
