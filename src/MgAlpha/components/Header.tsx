import React from 'react';
import { Volume2, VolumeX } from 'lucide-react';
import { soundFx } from '../utils/audio';

interface HeaderProps {
  soundMuted: boolean;
  onToggleSound: () => void;
}

export const Header: React.FC<HeaderProps> = ({ soundMuted, onToggleSound }) => {
  return (
    <header className="relative w-full flex items-center justify-between py-2 px-1 sm:px-2 border-b border-[#213743]">
      {/* Left Zone: Stake Logo */}
      <div className="flex items-center z-10">
        <div className="relative flex items-center justify-center w-7 h-7 sm:w-8 sm:h-8 rounded-lg bg-gradient-to-br from-[#071824] to-[#1a2c38] border border-sky-500/30 shadow-[0_0_10px_rgba(56,189,248,0.25)] shrink-0">
          <svg
            className="w-4 h-4 text-sky-400"
            viewBox="0 0 24 24"
            fill="currentColor"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M16.5 5.5H8.8C6.9 5.5 5.5 6.9 5.5 8.8C5.5 10.7 6.9 12.1 8.8 12.1H15.2C17.1 12.1 18.5 13.5 18.5 15.4C18.5 17.3 17.1 18.7 15.2 18.7H7.5"
              stroke="currentColor"
              strokeWidth="2.8"
              strokeLinecap="round"
              strokeLinejoin="round"
              fill="none"
            />
            <circle cx="17.5" cy="5.5" r="1.5" fill="#38bdf8" />
            <circle cx="6.5" cy="18.5" r="1.5" fill="#38bdf8" />
          </svg>
        </div>
      </div>

      {/* Center Zone: MG ALPHA MOD Title centered horizontally */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        <h1 className="text-sm sm:text-base md:text-lg font-extrabold tracking-wider pointer-events-auto">
          <span className="bg-gradient-to-r from-sky-400 via-cyan-300 to-white bg-clip-text text-transparent">
            MG ALPHA MOD
          </span>
        </h1>
      </div>

      {/* Right Zone: Audio Toggle */}
      <div className="flex items-center gap-2 z-10">
        <button
          onClick={() => {
            onToggleSound();
            soundFx.playClick();
          }}
          type="button"
          aria-label={soundMuted ? 'Unmute audio' : 'Mute audio'}
          className={`relative p-1.5 rounded-lg border transition-all cursor-pointer ${
            soundMuted
              ? 'bg-[#071824] border-[#213743] text-slate-500 hover:text-slate-300'
              : 'bg-sky-950/50 border-sky-500/40 text-sky-400 shadow-[0_0_8px_rgba(56,189,248,0.2)]'
          }`}
          title={soundMuted ? 'Enable sound' : 'Mute sound'}
        >
          {soundMuted ? <VolumeX className="w-3.5 h-3.5" /> : <Volume2 className="w-3.5 h-3.5" />}
        </button>
      </div>
    </header>
  );
};
