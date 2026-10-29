import React, { useState } from 'react';
import { Eye, EyeOff, Copy, Check, RefreshCw, KeyRound, Server } from 'lucide-react';
import { soundFx } from '../utils/audio';

interface SeedFieldsProps {
  clientSeed: string;
  serverSeed: string;
  onClientSeedChange: (value: string) => void;
  onServerSeedChange: (value: string) => void;
  onRegenerateSeeds: () => void;
}

export const SeedFields: React.FC<SeedFieldsProps> = ({
  clientSeed,
  serverSeed,
  onClientSeedChange,
  onServerSeedChange,
  onRegenerateSeeds,
}) => {
  const [showClientSeed, setShowClientSeed] = useState(false);
  const [showServerSeed, setShowServerSeed] = useState(false);
  const [copiedField, setCopiedField] = useState<'client' | 'server' | null>(null);

  const handleCopy = async (text: string, field: 'client' | 'server') => {
    if (!text) return;
    try {
      await navigator.clipboard.writeText(text);
      setCopiedField(field);
      soundFx.playSuccess();
      setTimeout(() => {
        setCopiedField(null);
      }, 2000);
    } catch {
      // Fallback
    }
  };

  return (
    <div className="space-y-2">
      {/* Header with Regenerate action */}
      <div className="flex items-center justify-between">
        <span className="text-[10px] font-semibold text-slate-300 uppercase tracking-wider flex items-center gap-1">
          <KeyRound className="w-2.5 h-2.5 text-sky-400" />
          Provably Fair Seeds
        </span>
        <button
          type="button"
          onClick={() => {
            onRegenerateSeeds();
            soundFx.playClick();
          }}
          className="flex items-center gap-1 text-[10px] text-sky-400 hover:text-sky-300 transition-colors py-0.5 px-1.5 rounded hover:bg-sky-950/40"
          title="Generate fresh seeds"
        >
          <RefreshCw className="w-2.5 h-2.5" />
          <span>New</span>
        </button>
      </div>

      {/* New Client (Replaced 'Active Client Seed' with 'New Client' as requested) */}
      <div className="space-y-0.5">
        <label
          htmlFor="client-seed-input"
          className="block text-[10px] font-medium text-slate-400"
        >
          New Client
        </label>
        <div className="relative flex items-center">
          <input
            id="client-seed-input"
            type={showClientSeed ? 'text' : 'password'}
            value={clientSeed}
            onChange={(e) => onClientSeedChange(e.target.value)}
            placeholder="Enter client seed"
            className="w-full bg-[#071824] text-slate-100 text-xs font-mono rounded-lg border border-[#213743] focus:border-sky-400 focus:outline-none focus:ring-1 focus:ring-sky-400/50 pl-2.5 pr-14 py-1 sm:py-1.5 transition-all shadow-inner placeholder:text-slate-600"
          />

          <div className="absolute right-1 flex items-center gap-0.5">
            <button
              type="button"
              onClick={() => {
                setShowClientSeed(!showClientSeed);
                soundFx.playClick();
              }}
              className="p-1 rounded text-slate-400 hover:text-sky-400 transition-colors"
              title={showClientSeed ? 'Hide seed' : 'Show seed'}
              aria-label={showClientSeed ? 'Hide client seed' : 'Show client seed'}
            >
              {showClientSeed ? <EyeOff className="w-3 h-3" /> : <Eye className="w-3 h-3" />}
            </button>

            <button
              type="button"
              onClick={() => handleCopy(clientSeed, 'client')}
              disabled={!clientSeed}
              className="p-1 rounded text-slate-400 hover:text-sky-400 transition-colors disabled:opacity-40"
              title="Copy client seed"
              aria-label="Copy client seed"
            >
              {copiedField === 'client' ? (
                <Check className="w-3 h-3 text-emerald-400" />
              ) : (
                <Copy className="w-3 h-3" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Active Server Seed */}
      <div className="space-y-0.5">
        <label
          htmlFor="server-seed-input"
          className="block text-[10px] font-medium text-slate-400 flex items-center gap-1"
        >
          <Server className="w-2.5 h-2.5 text-slate-500" />
          Active Server Seed
        </label>
        <div className="relative flex items-center">
          <input
            id="server-seed-input"
            type={showServerSeed ? 'text' : 'password'}
            value={serverSeed}
            onChange={(e) => onServerSeedChange(e.target.value)}
            placeholder="Enter server seed"
            className="w-full bg-[#071824] text-slate-100 text-xs font-mono rounded-lg border border-[#213743] focus:border-sky-400 focus:outline-none focus:ring-1 focus:ring-sky-400/50 pl-2.5 pr-14 py-1 sm:py-1.5 transition-all shadow-inner placeholder:text-slate-600"
          />

          <div className="absolute right-1 flex items-center gap-0.5">
            <button
              type="button"
              onClick={() => {
                setShowServerSeed(!showServerSeed);
                soundFx.playClick();
              }}
              className="p-1 rounded text-slate-400 hover:text-sky-400 transition-colors"
              title={showServerSeed ? 'Hide seed' : 'Show seed'}
              aria-label={showServerSeed ? 'Hide server seed' : 'Show server seed'}
            >
              {showServerSeed ? <EyeOff className="w-3 h-3" /> : <Eye className="w-3 h-3" />}
            </button>

            <button
              type="button"
              onClick={() => handleCopy(serverSeed, 'server')}
              disabled={!serverSeed}
              className="p-1 rounded text-slate-400 hover:text-sky-400 transition-colors disabled:opacity-40"
              title="Copy server seed"
              aria-label="Copy server seed"
            >
              {copiedField === 'server' ? (
                <Check className="w-3 h-3 text-emerald-400" />
              ) : (
                <Copy className="w-3 h-3" />
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
