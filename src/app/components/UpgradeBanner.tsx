import { useState } from 'react';
import { useNavigate } from 'react-router';
import { Zap, X } from 'lucide-react';

export function UpgradeBanner() {
  const [dismissed, setDismissed] = useState(false);
  const navigate = useNavigate();

  if (dismissed) return null;

  return (
    <div className="flex items-center gap-3 px-4 py-2.5 sm:px-5 border-b border-primary/20 shrink-0 bg-[linear-gradient(90deg,rgba(8,28,69,0.08)_0%,rgba(14,47,115,0.05)_100%)]">
      <div className="w-8 h-8 rounded-md bg-primary/10 border border-primary/20 flex items-center justify-center shrink-0">
        <Zap size={13} className="text-primary fill-primary" />
      </div>
      <span className="flex-1 text-[12px] font-medium text-slate-600 leading-relaxed">
        You're on the{' '}
        <strong className="text-slate-900 font-semibold">Free plan</strong>
        <span className="hidden sm:inline">
          {' '}— unlock unlimited links, custom domains, advanced analytics, and more.
        </span>
      </span>
      <button
        onClick={() => navigate('/subscription')}
        className="shrink-0 flex items-center gap-1.5 px-3.5 py-1.5 rounded-md bg-gradient-to-br from-[#081C45] to-[#0E2F73] text-white text-[12px] font-bold shadow-[0_2px_8px_rgba(8,28,69,0.3)] hover:shadow-[0_4px_12px_rgba(8,28,69,0.4)] hover:brightness-110 active:scale-[0.98] transition-all cursor-pointer whitespace-nowrap border-none"
      >
        <Zap size={11} className="fill-white text-white" />
        Upgrade now
      </button>
      <button
        onClick={() => setDismissed(true)}
        title="Dismiss"
        className="shrink-0 w-[26px] h-[26px] rounded-[6px] text-slate-400 hover:text-slate-600 hover:bg-slate-100 flex items-center justify-center cursor-pointer transition-colors p-0 border-none bg-transparent"
      >
        <X size={13} />
      </button>
    </div>
  );
}


