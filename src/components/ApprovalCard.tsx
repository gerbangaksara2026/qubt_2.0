import React, { useState } from 'react';
import { 
  CheckCircle, 
  XCircle, 
  AlertTriangle, 
  Terminal, 
  Folder, 
  Globe, 
  Mail, 
  Calendar, 
  GitPullRequest, 
  FileText, 
  MessageSquare,
  Clock,
  ChevronDown,
  ChevronUp,
  Play,
  RotateCw,
  Edit2
} from 'lucide-react';
import { ToolCall } from '../types';

interface ApprovalCardProps {
  toolCall: ToolCall;
  onApprove: (toolCallId: string) => void;
  onReject: (toolCallId: string) => void;
  onModify?: (toolCallId: string, updatedArgs: Record<string, any>) => void;
}

export const ApprovalCard: React.FC<ApprovalCardProps> = ({
  toolCall,
  onApprove,
  onReject,
  onModify
}) => {
  const [isExpanded, setIsExpanded] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [editedArgsJson, setEditedArgsJson] = useState(JSON.stringify(toolCall.arguments, null, 2));

  const getToolIcon = () => {
    switch (toolCall.category) {
      case 'system':
        return toolCall.toolName.includes('file') ? <Folder className="w-4 h-4 text-amber-500" /> : <Terminal className="w-4 h-4 text-emerald-600" />;
      case 'browser':
        return <Globe className="w-4 h-4 text-sky-500" />;
      case 'email':
        return <Mail className="w-4 h-4 text-rose-500" />;
      case 'calendar':
        return <Calendar className="w-4 h-4 text-blue-500" />;
      case 'dev':
        return <GitPullRequest className="w-4 h-4 text-purple-600" />;
      case 'productivity':
        return <FileText className="w-4 h-4 text-amber-500" />;
      case 'communication':
        return <MessageSquare className="w-4 h-4 text-emerald-600" />;
      default:
        return <Terminal className="w-4 h-4 text-sky-600" />;
    }
  };

  const getRiskBadge = () => {
    switch (toolCall.riskLevel) {
      case 'high':
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-semibold bg-red-50 text-red-700 border border-red-200">
            <AlertTriangle className="w-3 h-3" />
            High Risk
          </span>
        );
      case 'moderate':
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-semibold bg-amber-50 text-amber-800 border border-amber-200">
            <AlertTriangle className="w-3 h-3" />
            Needs Approval
          </span>
        );
      case 'safe':
      default:
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
            <CheckCircle className="w-3 h-3" />
            Safe Action
          </span>
        );
    }
  };

  const handleSaveEdit = () => {
    try {
      const parsed = JSON.parse(editedArgsJson);
      if (onModify) onModify(toolCall.id, parsed);
      setIsEditing(false);
    } catch {
      alert('Invalid JSON in arguments. Please correct syntax.');
    }
  };

  return (
    <div className={`my-2.5 rounded-2xl border transition-all duration-200 overflow-hidden shadow-xs ${
      toolCall.status === 'pending'
        ? 'border-amber-300 bg-white ring-2 ring-amber-100'
        : toolCall.status === 'executing'
        ? 'border-sky-300 bg-white ring-2 ring-sky-100'
        : toolCall.status === 'completed'
        ? 'border-emerald-200 bg-white'
        : 'border-red-200 bg-white'
    }`}>
      {/* Header bar */}
      <div className="px-4 py-2.5 bg-zinc-50 border-b border-zinc-200/70 flex items-center justify-between gap-3">
        <div className="flex items-center gap-2.5">
          <div className="w-7 h-7 rounded-lg bg-white flex items-center justify-center border border-zinc-200 shadow-2xs">
            {getToolIcon()}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-zinc-900 tracking-tight">
                {toolCall.appName}
              </span>
              <span className="text-[11px] font-mono text-zinc-600 bg-zinc-200/60 px-1.5 py-0.5 rounded">
                {toolCall.toolName}
              </span>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {getRiskBadge()}
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="p-1 text-zinc-400 hover:text-zinc-700 rounded-lg hover:bg-zinc-200/50 transition-colors"
          >
            {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="p-4 space-y-3">
        <div className="text-xs font-semibold text-zinc-900 flex items-center justify-between">
          <span>{toolCall.actionSummary}</span>
          <span className="text-[10px] text-zinc-400 font-mono flex items-center gap-1">
            <Clock className="w-3 h-3" />
            {toolCall.timestamp}
          </span>
        </div>

        {isExpanded && (
          <>
            {/* Diff or Code/Command View */}
            {toolCall.diffOrPreview ? (
              <div className="rounded-xl bg-zinc-950 border border-zinc-800 p-3 font-mono text-xs overflow-x-auto text-zinc-200">
                <div className="text-[10px] uppercase text-zinc-400 mb-1 font-semibold tracking-wider">
                  Target Diff / Preview
                </div>
                <pre className="whitespace-pre-wrap leading-relaxed">{toolCall.diffOrPreview}</pre>
              </div>
            ) : null}

            {/* Arguments inspector */}
            {!toolCall.diffOrPreview && (
              <div className="rounded-xl bg-zinc-950 border border-zinc-800 p-3 font-mono text-xs overflow-x-auto">
                <div className="flex items-center justify-between text-[10px] uppercase text-zinc-400 mb-1.5 font-semibold tracking-wider">
                  <span>Arguments</span>
                  {toolCall.status === 'pending' && !isEditing && (
                    <button
                      onClick={() => setIsEditing(true)}
                      className="text-sky-400 hover:text-sky-300 flex items-center gap-1 lowercase text-xs"
                    >
                      <Edit2 className="w-3 h-3" /> edit
                    </button>
                  )}
                </div>

                {isEditing ? (
                  <div className="space-y-2">
                    <textarea
                      value={editedArgsJson}
                      onChange={(e) => setEditedArgsJson(e.target.value)}
                      rows={4}
                      className="w-full bg-zinc-900 border border-zinc-700 rounded-lg p-2 text-zinc-100 font-mono text-xs outline-none"
                    />
                    <div className="flex justify-end gap-2">
                      <button
                        onClick={() => setIsEditing(false)}
                        className="px-2.5 py-1 text-xs text-zinc-400 hover:text-zinc-200"
                      >
                        Cancel
                      </button>
                      <button
                        onClick={handleSaveEdit}
                        className="px-3 py-1 text-xs bg-sky-600 text-white rounded-lg hover:bg-sky-500 font-semibold"
                      >
                        Apply Edit
                      </button>
                    </div>
                  </div>
                ) : (
                  <pre className="text-zinc-200 whitespace-pre-wrap leading-relaxed">
                    {JSON.stringify(toolCall.arguments, null, 2)}
                  </pre>
                )}
              </div>
            )}

            {/* Execution Output */}
            {toolCall.executionOutput && (
              <div className="rounded-xl bg-black/90 border border-emerald-500/30 p-3 font-mono text-xs overflow-x-auto">
                <div className="flex items-center justify-between text-[10px] uppercase text-emerald-400 mb-1 font-semibold tracking-wider">
                  <span className="flex items-center gap-1.5">
                    <CheckCircle className="w-3 h-3 text-emerald-400" />
                    Output Result
                  </span>
                  {toolCall.executionDurationMs && (
                    <span className="text-zinc-400 font-normal">
                      {toolCall.executionDurationMs}ms
                    </span>
                  )}
                </div>
                <pre className="text-zinc-200 whitespace-pre-wrap leading-relaxed">
                  {toolCall.executionOutput}
                </pre>
              </div>
            )}
          </>
        )}

        {/* Action Controls / Status Footer */}
        <div className="pt-2 border-t border-zinc-200 flex items-center justify-between">
          {toolCall.status === 'pending' && (
            <>
              <div className="text-xs text-zinc-500 flex items-center gap-1.5 font-medium">
                <span className="w-2 h-2 rounded-full bg-amber-500 animate-pulse"></span>
                Human sign-off required
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => onReject(toolCall.id)}
                  className="px-3 py-1.5 rounded-xl text-xs font-semibold text-zinc-600 hover:text-red-600 hover:bg-red-50 border border-zinc-200 transition-colors flex items-center gap-1.5 cursor-pointer"
                >
                  <XCircle className="w-3.5 h-3.5" />
                  Reject
                </button>
                <button
                  onClick={() => onApprove(toolCall.id)}
                  className="px-4 py-1.5 rounded-xl text-xs font-bold text-white bg-black hover:bg-zinc-800 shadow-xs transition-all flex items-center gap-1.5 cursor-pointer"
                >
                  <Play className="w-3.5 h-3.5 fill-current" />
                  Approve & Run
                </button>
              </div>
            </>
          )}

          {toolCall.status === 'executing' && (
            <div className="w-full flex items-center justify-between text-xs text-sky-600 py-1 font-medium">
              <span className="flex items-center gap-2 font-mono">
                <RotateCw className="w-3.5 h-3.5 animate-spin text-sky-600" />
                Executing in VM sandbox container...
              </span>
              <span className="text-[11px] text-zinc-400">Stream attached</span>
            </div>
          )}

          {toolCall.status === 'completed' && (
            <div className="w-full flex items-center justify-between text-xs text-emerald-600 font-medium">
              <span className="flex items-center gap-1.5">
                <CheckCircle className="w-3.5 h-3.5" />
                Executed with approval
              </span>
              <span className="text-[11px] font-mono text-zinc-500">Exit Code 0</span>
            </div>
          )}

          {toolCall.status === 'rejected' && (
            <div className="w-full flex items-center justify-between text-xs text-red-600 font-medium">
              <span className="flex items-center gap-1.5">
                <XCircle className="w-3.5 h-3.5" />
                Action rejected by user
              </span>
              <span className="text-[11px] text-zinc-400">Aborted</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
