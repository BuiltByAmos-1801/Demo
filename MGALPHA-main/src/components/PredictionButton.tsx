import React from 'react';
import { Sparkles, Loader2, Cpu, RotateCcw, Lock } from 'lucide-react';
import { soundFx } from '../utils/audio';

interface PredictionButtonProps {
  isPredicting: boolean;
  hasPredicted?: boolean;
  countdown?: number | null;
  onPredict: () => void;
  onReset?: () => void;
  disabled?: boolean;
  disabledReason?: string;
}

export const PredictionButton: React.FC<PredictionButtonProps> = ({
  isPredicting,
  hasPredicted = false,
  countdown = null,
  onPredict,
  onReset,
  disabled = false,
  disabledReason,
}) => {
  const handleClick = () => {
    if (isPredicting || disabled) return;
    if (hasPredicted && onReset) {
      soundFx.playClick();
      onReset();
      return;
    }
    soundFx.playSweep();
    onPredict();
  };

  return (
    <button
      type="button"
      onClick={handleClick}
      disabled={isPredicting || disabled}
      title={disabled ? disabledReason : undefined}
      className={`group relative w-full flex items-center justify-center gap-2 py-2 sm:py-2.5 px-4 rounded-xl font-bold text-xs sm:text-sm tracking-wide text-white transition-all overflow-hidden ${
        disabled
          ? 'bg-[#14232e] border border-[#213743] text-slate-500 cursor-not-allowed opacity-60'
          : isPredicting
          ? 'bg-sky-950/60 border border-sky-800/40 text-slate-400 cursor-not-allowed'
          : hasPredicted
          ? 'bg-gradient-to-r from-emerald-600 via-teal-600 to-cyan-600 hover:from-emerald-500 hover:to-cyan-500 border border-emerald-400/50 shadow-[0_0_20px_rgba(16,185,129,0.35)] cursor-pointer'
          : 'bg-gradient-to-r from-sky-600 via-blue-600 to-cyan-500 hover:from-sky-500 hover:via-blue-500 hover:to-cyan-400 active:scale-[0.99] border border-sky-400/40 shadow-[0_0_20px_rgba(56,189,248,0.35)] hover:shadow-[0_0_25px_rgba(56,189,248,0.5)] cursor-pointer'
      }`}
    >
      {isPredicting ? (
        <>
          <Loader2 className="w-4 h-4 text-sky-300 animate-spin" />
          <span className="text-sky-200">Analyzing Matrix...</span>
        </>
      ) : hasPredicted ? (
        <>
          <RotateCcw className="w-3.5 h-3.5 text-emerald-200 group-hover:rotate-180 transition-transform duration-500" />
          <span>New Seeds ({countdown ?? 0}s)</span>
        </>
      ) : disabled ? (
        <>
          <Lock className="w-3.5 h-3.5 text-slate-500" />
          <span>Enter Seeds to Predict</span>
        </>
      ) : (
        <>
          <div className="relative">
            <Cpu className="w-4 h-4 text-cyan-200 group-hover:scale-110 transition-transform" />
            <Sparkles className="w-2.5 h-2.5 text-yellow-300 absolute -top-1 -right-1 animate-pulse" />
          </div>
          <span>Run Safe Prediction</span>
        </>
      )}
    </button>
  );
};
