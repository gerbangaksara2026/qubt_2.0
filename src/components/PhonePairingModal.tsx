import React, { useState } from 'react';
import { 
  X, 
  Smartphone, 
  ShieldCheck, 
  Copy, 
  Check, 
  Bell, 
  Lock,
  QrCode
} from 'lucide-react';
import { MascotAvatar } from './MascotAvatar';

interface PhonePairingModalProps {
  isOpen: boolean;
  onClose: () => void;
  pendingApprovalsCount: number;
}

export const PhonePairingModal: React.FC<PhonePairingModalProps> = ({
  isOpen,
  onClose,
  pendingApprovalsCount
}) => {
  const [pairingKey, setPairingKey] = useState('QUBOT-7429-MOBI');
  const [copied, setCopied] = useState(false);
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);

  if (!isOpen) return null;

  const handleCopy = () => {
    navigator.clipboard.writeText(pairingKey);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm select-none">
      <div className="w-full max-w-lg bg-white/95 backdrop-blur-2xl border border-zinc-200/90 rounded-3xl shadow-2xl overflow-hidden flex flex-col">
        {/* Header */}
        <div className="px-6 py-4 border-b border-zinc-200/70 flex items-center justify-between bg-zinc-50/70">
          <div className="flex items-center gap-3">
            <MascotAvatar size="sm" />
            <div>
              <h2 className="text-sm font-bold text-zinc-900 font-sans">QUBOT Phone Companion (PWA)</h2>
              <p className="text-xs text-zinc-500">Approve actions & chat with bots directly on your phone</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-full text-zinc-400 hover:text-zinc-800 hover:bg-zinc-200/60 transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-6 space-y-5 text-xs text-zinc-700">
          <div className="p-5 rounded-2xl bg-zinc-50 border border-zinc-200/80 flex flex-col items-center text-center space-y-3">
            <div className="w-44 h-44 bg-white p-3 rounded-2xl flex items-center justify-center shadow-md relative border border-zinc-200">
              <div className="w-full h-full bg-zinc-950 rounded-xl p-2.5 flex flex-col justify-between border-2 border-zinc-900">
                <div className="flex justify-between">
                  <div className="w-7 h-7 bg-white border-2 border-zinc-800"></div>
                  <div className="w-7 h-7 bg-white border-2 border-zinc-800"></div>
                </div>
                <div className="text-center font-black text-sky-400 text-xs tracking-widest font-mono">
                  QUBOT-PWA
                </div>
                <div className="flex justify-between items-end">
                  <div className="w-7 h-7 bg-white border-2 border-zinc-800"></div>
                  <div className="w-4 h-4 bg-sky-400 rounded-sm"></div>
                </div>
              </div>
            </div>

            <div>
              <div className="font-bold text-zinc-900 text-sm">Scan with Phone Camera</div>
              <p className="text-[11px] text-zinc-500 mt-0.5">
                Launches the standalone web app with encrypted local device pairing
              </p>
            </div>

            <div className="w-full pt-3 border-t border-zinc-200 flex items-center justify-between">
              <div className="text-left">
                <span className="text-[10px] text-zinc-400 uppercase font-mono">Pairing Token</span>
                <div className="font-mono text-zinc-900 font-bold text-xs">{pairingKey}</div>
              </div>

              <button
                onClick={handleCopy}
                className="px-3 py-1.5 rounded-xl bg-white hover:bg-zinc-100 text-zinc-800 border border-zinc-200 flex items-center gap-1.5 transition-colors cursor-pointer shadow-2xs font-medium"
              >
                {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copied ? 'Copied' : 'Copy Token'}</span>
              </button>
            </div>
          </div>

          <div className="space-y-2">
            <div className="p-3 rounded-2xl bg-zinc-50 border border-zinc-200 flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <ShieldCheck className="w-4 h-4 text-emerald-600" />
                <div>
                  <div className="font-semibold text-zinc-900">Remote Human-in-the-Loop Approvals</div>
                  <div className="text-[10px] text-zinc-500">Review and authorize bash commands on the go</div>
                </div>
              </div>
              <span className="text-[10px] font-mono text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded-full font-semibold">
                Active
              </span>
            </div>

            <div className="p-3 rounded-2xl bg-zinc-50 border border-zinc-200 flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <Bell className="w-4 h-4 text-sky-600" />
                <div>
                  <div className="font-semibold text-zinc-900">Push Notifications for Finished Routines</div>
                  <div className="text-[10px] text-zinc-500">Alerts when inbox zero or code builds finish</div>
                </div>
              </div>
              <button
                onClick={() => setNotificationsEnabled(!notificationsEnabled)}
                className={`w-9 h-5 rounded-full transition-colors relative cursor-pointer ${
                  notificationsEnabled ? 'bg-black' : 'bg-zinc-300'
                }`}
              >
                <span className={`w-3.5 h-3.5 rounded-full bg-white absolute top-0.5 transition-transform ${
                  notificationsEnabled ? 'left-4.5' : 'left-1'
                }`} />
              </button>
            </div>
          </div>

          {pendingApprovalsCount > 0 && (
            <div className="p-3 rounded-2xl bg-amber-50 border border-amber-200 text-amber-800 flex items-center gap-2 font-medium">
              <Lock className="w-4 h-4 text-amber-600 flex-shrink-0" />
              <span>You have {pendingApprovalsCount} pending action(s) waiting for sign-off!</span>
            </div>
          )}
        </div>

        <div className="px-6 py-3 border-t border-zinc-200 bg-zinc-50/70 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl bg-black hover:bg-zinc-800 text-white font-medium cursor-pointer"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
