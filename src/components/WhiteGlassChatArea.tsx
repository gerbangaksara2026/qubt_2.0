import React, { useState, useRef, useEffect } from 'react';
import { 
  Send, 
  Plus, 
  Mic, 
  MicOff, 
  FileText, 
  ArrowUpRight, 
  Sliders, 
  ChevronDown, 
  Volume2, 
  VolumeX, 
  Share2, 
  X, 
  Sparkles,
  Terminal,
  Clock,
  Pause,
  Play,
  RotateCcw
} from 'lucide-react';
import { Agent, EnvironmentType, Message, ModelId, ApprovalPolicy } from '../types';
import { AgentPebbleAvatar } from './AgentPebbleAvatar';
import { ApprovalCard } from './ApprovalCard';

interface WhiteGlassChatAreaProps {
  agent: Agent;
  allAgents: Agent[];
  messages: Message[];
  onSendMessage: (text: string) => void;
  onApproveToolCall: (toolCallId: string) => void;
  onRejectToolCall: (toolCallId: string) => void;
  onModifyToolCall?: (toolCallId: string, updatedArgs: Record<string, any>) => void;
  onUpdateAgentModel: (agentId: string, model: ModelId) => void;
  onOpenBotProfile?: () => void;
  onToggleWorkspace: () => void;
  isWorkspaceOpen: boolean;
  onClearHistory: () => void;
}

export const WhiteGlassChatArea: React.FC<WhiteGlassChatAreaProps> = ({
  agent,
  allAgents,
  messages,
  onSendMessage,
  onApproveToolCall,
  onRejectToolCall,
  onModifyToolCall,
  onUpdateAgentModel,
  onOpenBotProfile,
  onToggleWorkspace,
  isWorkspaceOpen,
  onClearHistory
}) => {
  const [inputText, setInputText] = useState('');
  const [isRecording, setIsRecording] = useState(false);
  const [playingMessageId, setPlayingMessageId] = useState<string | null>(null);
  const [showMentionPopup, setShowMentionPopup] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim()) return;
    onSendMessage(inputText.trim());
    setInputText('');
    setShowMentionPopup(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setInputText(val);

    if (val.endsWith('@')) {
      setShowMentionPopup(true);
    } else if (!val.includes('@') || val.endsWith(' ')) {
      setShowMentionPopup(false);
    }
  };

  const handleSelectMention = (otherAgent: Agent) => {
    setInputText(prev => prev.replace(/@\w*$/, `${otherAgent.handle} `));
    setShowMentionPopup(false);
  };

  // Text-to-speech audio synthesis
  const handlePlayAudio = (messageId: string, text: string) => {
    if (playingMessageId === messageId) {
      window.speechSynthesis.cancel();
      setPlayingMessageId(null);
      return;
    }

    window.speechSynthesis.cancel();
    if ('speechSynthesis' in window) {
      const cleanText = text.replace(/[*#`_]/g, '');
      const utterance = new SpeechSynthesisUtterance(cleanText);
      utterance.rate = 1.05;
      utterance.onend = () => setPlayingMessageId(null);
      utterance.onerror = () => setPlayingMessageId(null);
      setPlayingMessageId(messageId);
      window.speechSynthesis.speak(utterance);
    }
  };

  // Voice recording toggle using Web Speech API
  const handleToggleVoiceRecord = () => {
    if (!('webkitSpeechRecognition' in window) && !('SpeechRecognition' in window)) {
      alert('Speech recognition is not supported in this browser.');
      return;
    }

    if (isRecording) {
      setIsRecording(false);
      return;
    }

    try {
      const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
      const recognition = new SpeechRecognition();
      recognition.continuous = false;
      recognition.interimResults = false;
      recognition.lang = 'en-US';

      recognition.onstart = () => setIsRecording(true);
      recognition.onresult = (event: any) => {
        const transcript = event.results[0][0].transcript;
        setInputText(prev => (prev ? `${prev} ${transcript}` : transcript));
        setIsRecording(false);
      };
      recognition.onerror = () => setIsRecording(false);
      recognition.onend = () => setIsRecording(false);

      recognition.start();
    } catch {
      setIsRecording(false);
    }
  };

  return (
    <main className="flex-1 flex flex-col h-full bg-white/40 backdrop-blur-md relative overflow-hidden select-none">
      {/* Top Header matching reference UI */}
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

        <div className="flex items-center gap-2 text-zinc-400">
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
        </div>
      </header>

      {/* Messages Scroll Area */}
      <div className="flex-1 overflow-y-auto p-4 md:p-6 space-y-4 select-text">
        {/* Centered Time Pill like screenshot */}
        <div className="flex justify-center my-1 select-none">
          <span className="text-[11px] font-medium text-zinc-400 bg-white/70 px-2.5 py-0.5 rounded-full border border-zinc-200/40 shadow-2xs">
            9:41 AM
          </span>
        </div>

        {messages.map((message) => {
          const isUser = message.sender === 'user';
          const isAgent = message.sender === 'agent';
          const isPlayingThis = playingMessageId === message.id;
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
                        <div className="text-xs font-semibold text-zinc-900 leading-snug">
                          {message.attachment.name}
                        </div>
                        <div className="text-[10px] text-zinc-400">
                          {message.attachment.pages} pages • {message.attachment.size}
                        </div>
                      </div>
                    </div>
                    <ArrowUpRight className="w-4 h-4 text-zinc-400" />
                  </div>
                )}
              </div>

              {/* Message Footer */}
              <div className="flex items-center gap-2 mt-1 px-1">
                {isAgent && (
                  <button
                    onClick={() => handlePlayAudio(message.id, message.content)}
                    className="text-[10px] text-zinc-400 hover:text-zinc-700 flex items-center gap-1 transition-colors cursor-pointer"
                  >
                    {isPlayingThis ? <Pause className="w-3 h-3" /> : <Volume2 className="w-3 h-3" />}
                    <span>{isPlayingThis ? 'Playing' : 'Voice'}</span>
                  </button>
                )}
                <span className="text-[10px] text-zinc-400 font-mono">
                  {message.timestamp}
                </span>
              </div>

              {/* Tool Calls & Approval Cards */}
              {message.toolCalls && message.toolCalls.length > 0 && (
                <div className="w-full space-y-2 mt-2">
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
          );
        })}

        <div ref={messagesEndRef} />
      </div>

      {/* Mention Auto-Suggest Popup */}
      {showMentionPopup && (
        <div className="absolute bottom-20 left-6 z-30 w-72 bg-white border border-zinc-200 rounded-2xl shadow-xl p-2 space-y-1">
          <div className="text-[10px] font-mono uppercase text-zinc-400 px-2 py-1">
            Delegate Task to Another Agent (@mention)
          </div>
          {allAgents.filter(a => a.id !== agent.id).map(other => (
            <button
              key={other.id}
              onClick={() => handleSelectMention(other)}
              className="w-full p-2 rounded-xl hover:bg-zinc-100 flex items-center gap-2.5 text-left cursor-pointer transition-colors"
            >
              <AgentPebbleAvatar agent={other} size="sm" />
              <div className="truncate flex-1">
                <div className="text-xs font-semibold text-zinc-900 truncate">{other.name}</div>
                <div className="text-[10px] text-zinc-500 font-mono truncate">{other.handle} • {other.role}</div>
              </div>
            </button>
          ))}
        </div>
      )}

      {/* Bottom Input Bar - Exactly matching reference UI */}
      <div className="p-4 bg-transparent select-none">
        <form 
          onSubmit={handleSubmit}
          className="bg-white/95 backdrop-blur-md rounded-2xl border border-zinc-200/90 shadow-sm p-1.5 pl-3 flex items-center gap-2.5 transition-all focus-within:ring-2 focus-within:ring-zinc-900/10 focus-within:border-zinc-300"
        >
          {/* Plus action icon */}
          <button
            type="button"
            onClick={() => {
              setInputText(prev => prev ? `${prev} @` : '@');
              setShowMentionPopup(true);
            }}
            className="w-6 h-6 rounded-full hover:bg-zinc-100 text-zinc-400 hover:text-zinc-800 flex items-center justify-center transition-colors cursor-pointer"
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
            placeholder={`Message ${agent.name}`}
            className="flex-1 bg-transparent border-none outline-none text-xs text-zinc-900 placeholder-zinc-400"
          />

          {/* Black Circular Voice Microphone / Send Button matching screenshot */}
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
