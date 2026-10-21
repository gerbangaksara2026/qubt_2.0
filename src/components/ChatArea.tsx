import React, { useState, useRef, useEffect } from 'react';
import { 
  Send, 
  Bot, 
  Sparkles, 
  Terminal, 
  LayoutDashboard, 
  Volume2, 
  VolumeX, 
  Mic, 
  MicOff, 
  Shield, 
  RotateCcw, 
  Check, 
  ChevronDown, 
  Clock, 
  Play, 
  Pause,
  AtSign,
  UserCheck
} from 'lucide-react';
import { Agent, EnvironmentType, Message, ModelId, ApprovalPolicy } from '../types';
import { ApprovalCard } from './ApprovalCard';

interface ChatAreaProps {
  agent: Agent;
  allAgents: Agent[];
  messages: Message[];
  onSendMessage: (text: string) => void;
  onApproveToolCall: (toolCallId: string) => void;
  onRejectToolCall: (toolCallId: string) => void;
  onModifyToolCall?: (toolCallId: string, updatedArgs: Record<string, any>) => void;
  onUpdateAgentModel: (agentId: string, model: ModelId) => void;
  onUpdateAgentEnvironment: (agentId: string, env: EnvironmentType) => void;
  onUpdateAgentApprovalPolicy: (agentId: string, policy: ApprovalPolicy) => void;
  onToggleWorkspace: () => void;
  isWorkspaceOpen: boolean;
  onClearHistory: () => void;
}

export const ChatArea: React.FC<ChatAreaProps> = ({
  agent,
  allAgents,
  messages,
  onSendMessage,
  onApproveToolCall,
  onRejectToolCall,
  onModifyToolCall,
  onUpdateAgentModel,
  onUpdateAgentEnvironment,
  onUpdateAgentApprovalPolicy,
  onToggleWorkspace,
  isWorkspaceOpen,
  onClearHistory
}) => {
  const [inputText, setInputText] = useState('');
  const [isRecording, setIsRecording] = useState(false);
  const [playingMessageId, setPlayingMessageId] = useState<string | null>(null);
  const [expandedReasonings, setExpandedReasonings] = useState<Record<string, boolean>>({});
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

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
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

  const toggleReasoning = (msgId: string) => {
    setExpandedReasonings(prev => ({ ...prev, [msgId]: !prev[msgId] }));
  };

  // Text-to-speech audio synthesis simulation
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
      utterance.pitch = 1.0;
      utterance.onend = () => setPlayingMessageId(null);
      utterance.onerror = () => setPlayingMessageId(null);
      setPlayingMessageId(messageId);
      window.speechSynthesis.speak(utterance);
    } else {
      alert('Speech synthesis is not supported in this browser.');
    }
  };

  // Voice recording toggle using Web Speech API
  const handleToggleVoiceRecord = () => {
    if (!('webkitSpeechRecognition' in window) && !('SpeechRecognition' in window)) {
      alert('Speech recognition is not supported in this browser. Please type your message.');
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

  const quickSuggestions = agent.category === 'engineering'
    ? ['Run automated test suite', 'Check git status & commit diff', 'Create runner configuration file']
    : agent.category === 'operations'
    ? ['Scan inbox for unread VIP emails', 'Schedule sync meeting on Google Calendar', 'Summarize meeting notes into Notion']
    : ['Scrape trending AI agent repos on GitHub', 'Extract competitor pricing tables', 'Compile research brief to markdown'];

  return (
    <main className="flex-1 flex flex-col h-screen bg-zinc-950 overflow-hidden relative">
      {/* Top Navigation & Agent Controls */}
      <header className="px-5 py-3 border-b border-zinc-800/80 bg-zinc-950/80 backdrop-blur-md flex items-center justify-between gap-4 z-10 select-none">
        {/* Agent Info */}
        <div className="flex items-center gap-3 min-w-0">
          <div className="relative">
            <div className="w-10 h-10 rounded-xl bg-zinc-800/90 border border-zinc-700/60 flex items-center justify-center text-xl shadow-md">
              {agent.avatar}
            </div>
            <span className="absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full bg-emerald-400 border-2 border-zinc-950" />
          </div>

          <div className="min-w-0">
            <div className="flex items-center gap-2">
              <h1 className="font-bold text-sm text-zinc-100 truncate font-sans">
                {agent.name}
              </h1>
              <span className="text-xs font-mono text-zinc-500">
                {agent.handle}
              </span>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-cyan-500/10 text-cyan-400 border border-cyan-500/20 font-medium">
                {agent.role}
              </span>
            </div>
            <p className="text-[11px] text-zinc-400 truncate mt-0.5">
              {agent.tagline}
            </p>
          </div>
        </div>

        {/* Model, Environment & Action Controls */}
        <div className="flex items-center gap-2 flex-wrap justify-end">
          {/* Model Switcher */}
          <div className="relative group">
            <select
              value={agent.model}
              onChange={(e) => onUpdateAgentModel(agent.id, e.target.value as ModelId)}
              className="bg-zinc-900 border border-zinc-800 hover:border-zinc-700 rounded-lg px-2.5 py-1.5 text-xs text-zinc-200 font-mono focus:outline-none focus:ring-1 focus:ring-cyan-500 cursor-pointer"
            >
              <option value="gemini-3.8-flash">Gemini 3.8 Flash (Default)</option>
              <option value="gemini-4-argon">Gemini 4 Argon (Reasoning)</option>
              <option value="claude-3-7-sonnet">Claude 3.7 Sonnet</option>
              <option value="grok-3">Grok 3 (CLI)</option>
              <option value="codex-cli">Codex CLI</option>
              <option value="llama-3.3-70b-local">Local Llama 3.3</option>
              <option value="deepseek-r1">DeepSeek R1</option>
            </select>
          </div>

          {/* Environment Selector */}
          <div className="relative">
            <select
              value={agent.environment}
              onChange={(e) => onUpdateAgentEnvironment(agent.id, e.target.value as EnvironmentType)}
              className="bg-zinc-900 border border-zinc-800 hover:border-zinc-700 rounded-lg px-2.5 py-1.5 text-xs text-zinc-300 font-mono focus:outline-none focus:ring-1 focus:ring-cyan-500 cursor-pointer"
            >
              <option value="local-mac">Local Machine (~/.qubot)</option>
              <option value="docker-sandbox">Podman / Docker Sandbox</option>
              <option value="cloud-vm">Cloud Linux VM (Ubuntu)</option>
              <option value="headless-browser">Chromium Headless</option>
            </select>
          </div>

          {/* Approval Policy Badge / Switcher */}
          <button
            onClick={() => {
              const next: ApprovalPolicy = agent.approvalPolicy === 'approval-required' 
                ? 'autonomous' 
                : agent.approvalPolicy === 'autonomous' 
                ? 'strict-read-only' 
                : 'approval-required';
              onUpdateAgentApprovalPolicy(agent.id, next);
            }}
            className={`px-2.5 py-1.5 rounded-lg text-xs font-medium border flex items-center gap-1.5 transition-all cursor-pointer ${
              agent.approvalPolicy === 'approval-required'
                ? 'bg-amber-500/10 text-amber-300 border-amber-500/30 hover:bg-amber-500/20'
                : agent.approvalPolicy === 'autonomous'
                ? 'bg-cyan-500/10 text-cyan-300 border-cyan-500/30 hover:bg-cyan-500/20'
                : 'bg-zinc-800 text-zinc-300 border-zinc-700'
            }`}
            title="Click to toggle Human-In-The-Loop approval policy"
          >
            <Shield className="w-3.5 h-3.5" />
            <span className="capitalize text-[11px] font-mono">
              {agent.approvalPolicy === 'approval-required' ? 'Approval Loop' : agent.approvalPolicy}
            </span>
          </button>

          {/* Workspace & VM Split View Button */}
          <button
            onClick={onToggleWorkspace}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer shadow-sm ${
              isWorkspaceOpen
                ? 'bg-cyan-500 text-zinc-950 ring-2 ring-cyan-400/40'
                : 'bg-zinc-900 text-zinc-200 hover:bg-zinc-800 border border-zinc-700/60'
            }`}
            title="Toggle Live VM & Workspace Inspector"
          >
            <Terminal className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Workspace & VM</span>
          </button>

          {/* Reset chat */}
          <button
            onClick={onClearHistory}
            className="p-1.5 rounded-lg text-zinc-500 hover:text-zinc-300 hover:bg-zinc-800 transition-colors cursor-pointer"
            title="Clear Chat History"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
        </div>
      </header>

      {/* Messages Scroll Area */}
      <div className="flex-1 overflow-y-auto p-4 md:p-6 space-y-6">
        {messages.map((message) => {
          const isAgent = message.sender === 'agent';
          const isUser = message.sender === 'user';
          const isPlayingThis = playingMessageId === message.id;

          return (
            <div
              key={message.id}
              className={`flex gap-3 max-w-4xl ${isUser ? 'ml-auto justify-end' : 'mr-auto justify-start'}`}
            >
              {isAgent && (
                <div className="w-8 h-8 rounded-lg bg-zinc-800 border border-zinc-700/60 flex items-center justify-center text-sm flex-shrink-0 mt-1 shadow">
                  {agent.avatar}
                </div>
              )}

              <div className={`space-y-2 max-w-2xl ${isUser ? 'items-end' : 'items-start'}`}>
                {/* Reasoning Accordion (if agent has thoughts) */}
                {isAgent && message.reasoning && (
                  <div className="rounded-lg bg-zinc-900/60 border border-zinc-800/80 overflow-hidden text-xs">
                    <button
                      onClick={() => toggleReasoning(message.id)}
                      className="w-full px-3 py-1.5 bg-zinc-900/90 hover:bg-zinc-800/80 text-zinc-400 hover:text-zinc-200 flex items-center justify-between transition-colors cursor-pointer"
                    >
                      <span className="flex items-center gap-1.5 font-mono text-[11px] text-zinc-400">
                        <Sparkles className="w-3 h-3 text-cyan-400" />
                        Thought Process & Action Planning
                      </span>
                      <ChevronDown
                        className={`w-3.5 h-3.5 transition-transform ${
                          expandedReasonings[message.id] ? 'rotate-180' : ''
                        }`}
                      />
                    </button>
                    {expandedReasonings[message.id] && (
                      <div className="p-3 font-mono text-zinc-400 text-[11px] bg-black/40 border-t border-zinc-800 whitespace-pre-wrap leading-relaxed">
                        {message.reasoning}
                      </div>
                    )}
                  </div>
                )}

                {/* Main Message Bubble */}
                <div
                  className={`p-4 rounded-2xl text-sm leading-relaxed shadow-md select-text ${
                    isUser
                      ? 'bg-gradient-to-r from-cyan-600 to-indigo-600 text-white rounded-tr-xs'
                      : 'bg-zinc-900 border border-zinc-800/80 text-zinc-200 rounded-tl-xs'
                  }`}
                >
                  <div className="whitespace-pre-wrap space-y-2">
                    {message.content}
                  </div>
                  
                  {/* Message footer with timestamp and TTS voice button */}
                  <div className={`text-[10px] mt-2.5 font-mono flex items-center gap-2 ${
                    isUser ? 'text-cyan-200 justify-end' : 'text-zinc-500 justify-between'
                  }`}>
                    {isAgent && (
                      <button
                        onClick={() => handlePlayAudio(message.id, message.content)}
                        className={`flex items-center gap-1 px-2 py-0.5 rounded transition-colors cursor-pointer ${
                          isPlayingThis
                            ? 'bg-cyan-500/20 text-cyan-400 border border-cyan-500/30'
                            : 'hover:bg-zinc-800 text-zinc-400 hover:text-zinc-200'
                        }`}
                        title="ElevenLabs-style Voice Playback"
                      >
                        {isPlayingThis ? <Pause className="w-3 h-3" /> : <Volume2 className="w-3 h-3" />}
                        <span>{isPlayingThis ? 'Playing Voice...' : 'Play Voice'}</span>
                      </button>
                    )}

                    <div className="flex items-center gap-1 ml-auto">
                      <Clock className="w-2.5 h-2.5" />
                      <span>{message.timestamp}</span>
                    </div>
                  </div>
                </div>

                {/* Tool Calls & Approval Cards */}
                {message.toolCalls && message.toolCalls.length > 0 && (
                  <div className="w-full space-y-2 pt-1">
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

              {isUser && (
                <div className="w-8 h-8 rounded-lg bg-cyan-600 flex items-center justify-center text-xs font-bold text-white flex-shrink-0 mt-1 shadow">
                  U
                </div>
              )}
            </div>
          );
        })}

        <div ref={messagesEndRef} />
      </div>

      {/* Mention Auto-Suggest Popup */}
      {showMentionPopup && (
        <div className="absolute bottom-28 left-6 z-30 w-72 bg-zinc-900 border border-zinc-700 rounded-xl shadow-2xl p-2 space-y-1">
          <div className="text-[10px] font-mono uppercase text-zinc-400 px-2 py-1">
            Delegate Task to Another Agent (@mention)
          </div>
          {allAgents.filter(a => a.id !== agent.id).map(other => (
            <button
              key={other.id}
              onClick={() => handleSelectMention(other)}
              className="w-full p-2 rounded-lg hover:bg-zinc-800 flex items-center gap-2 text-left cursor-pointer transition-colors"
            >
              <div className="w-6 h-6 rounded bg-zinc-800 flex items-center justify-center text-xs">
                {other.avatar}
              </div>
              <div className="truncate flex-1">
                <div className="text-xs font-bold text-zinc-200 truncate">{other.name}</div>
                <div className="text-[10px] text-zinc-400 font-mono truncate">{other.handle} • {other.role}</div>
              </div>
            </button>
          ))}
        </div>
      )}

      {/* Bottom Area: Suggestions + Input Bar */}
      <div className="p-4 border-t border-zinc-800/80 bg-zinc-950/95">
        {/* Suggestion Chips */}
        <div className="flex items-center gap-2 overflow-x-auto pb-2.5 no-scrollbar">
          <span className="text-[10px] font-mono text-zinc-500 uppercase flex-shrink-0">
            Suggested:
          </span>
          {quickSuggestions.map((suggestion, idx) => (
            <button
              key={idx}
              onClick={() => onSendMessage(suggestion)}
              className="px-2.5 py-1 rounded-full text-xs bg-zinc-900 hover:bg-zinc-800 text-zinc-300 hover:text-white border border-zinc-800 hover:border-zinc-700 whitespace-nowrap transition-colors cursor-pointer flex items-center gap-1"
            >
              <Sparkles className="w-3 h-3 text-cyan-400" />
              <span>{suggestion}</span>
            </button>
          ))}
        </div>

        {/* Input Bar */}
        <form onSubmit={handleSubmit} className="relative flex items-center gap-2 bg-zinc-900/90 border border-zinc-800 rounded-xl p-2 shadow-lg focus-within:border-cyan-500/70 focus-within:ring-1 focus-within:ring-cyan-500/40 transition-all">
          {/* Voice button */}
          <button
            type="button"
            onClick={handleToggleVoiceRecord}
            className={`p-2 rounded-lg transition-colors cursor-pointer ${
              isRecording
                ? 'bg-red-500/20 text-red-400 animate-pulse'
                : 'text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800'
            }`}
            title={isRecording ? 'Listening... click to stop' : 'Voice input'}
          >
            {isRecording ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
          </button>

          <textarea
            value={inputText}
            onChange={handleInputChange}
            onKeyDown={handleKeyDown}
            placeholder={`Message ${agent.name} (${agent.role})... Type @ to delegate or Shift+Enter for new line`}
            rows={1}
            className="flex-1 bg-transparent border-none outline-none text-sm text-zinc-100 placeholder-zinc-500 resize-none max-h-32 py-1"
          />

          <button
            type="submit"
            disabled={!inputText.trim()}
            className={`p-2 rounded-lg font-medium transition-all flex items-center justify-center cursor-pointer ${
              inputText.trim()
                ? 'bg-gradient-to-r from-cyan-500 to-indigo-600 hover:from-cyan-400 hover:to-indigo-500 text-white shadow-md shadow-cyan-500/20'
                : 'text-zinc-600 bg-zinc-800/40 cursor-not-allowed'
            }`}
          >
            <Send className="w-4 h-4" />
          </button>
        </form>

        <div className="mt-2 flex items-center justify-between text-[10px] text-zinc-500 font-mono">
          <span>QUBOT Engine • Local-First Sandbox • Approvals Enforced</span>
          <span>Shift + Enter for multiline • Type @ for multi-agent delegation</span>
        </div>
      </div>
    </main>
  );
};
