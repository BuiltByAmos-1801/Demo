import React from 'react';
import { SeedFields } from './SeedFields';
import { PredictionButton } from './PredictionButton';
import { soundFx } from '../utils/audio';
import { Bomb, Coins, Sparkles, Clock } from 'lucide-react';

export const SAFE_BOXES_MAP: Record<number, number> = {
  1: 9, // 1 mine -> 9 boxes
  2: 4, // 2 mines -> 4 boxes
  3: 4, // 3 mines -> 4 boxes
  4: 3, // 4 mines -> 3 boxes
  5: 2, // 5 mines -> 2 boxes
};

interface SetupFormProps {
  betAmount: number;
  onBetAmountChange: (value: number) => void;
  numberOfMines: number;
  onNumberOfMinesChange: (value: number) => void;
  clientSeed: string;
  serverSeed: string;
  onClientSeedChange: (value: string) => void;
  onServerSeedChange: (value: string) => void;
  onRegenerateSeeds: () => void;
  isPredicting: boolean;
  hasPredicted: boolean;
  countdown: number | null;
  onPredict: () => void;
  onResetNow: () => void;
}

export const SetupForm: React.FC<SetupFormProps> = ({
  betAmount,
  onBetAmountChange,
  numberOfMines,
  onNumberOfMinesChange,
  clientSeed,
  serverSeed,
  onClientSeedChange,
  onServerSeedChange,
  onRegenerateSeeds,
  isPredicting,
  hasPredicted,
  countdown,
  onPredict,
  onResetNow,
}) => {
  const handleMinesChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newMines = parseInt(e.target.value, 10);
    soundFx.playClick();
    onNumberOfMinesChange(newMines);
  };

  const handleQuickBet = (amount: number) => {
    soundFx.playClick();
    onBetAmountChange(amount);
  };

  const handleBetInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = parseFloat(e.target.value);
    if (!isNaN(val) && val >= 0) {
      onBetAmountChange(val);
    } else if (e.target.value === '') {
      onBetAmountChange(0);
    }
  };

  const handleMultiplyBet = (factor: number) => {
    soundFx.playClick();
    const newAmount = Math.max(1, Math.round(betAmount * factor * 100) / 100);
    onBetAmountChange(newAmount);
  };

  // Both client seed and server seed must be entered for prediction to work
  const hasValidSeeds = Boolean(clientSeed.trim() && serverSeed.trim());

  return (
    <div className="bg-[#0f212e]/90 backdrop-blur-md rounded-xl border border-[#213743] p-2.5 sm:p-3 shadow-md flex flex-col justify-between gap-2.5 w-full">
      <div className="space-y-2 sm:space-y-2.5">
        {/* Card Header */}
        <div className="flex items-center justify-between pb-1.5 border-b border-[#213743]">
          <span className="text-[11px] font-bold text-sky-400 uppercase tracking-wider flex items-center gap-1">
            <Coins className="w-3 h-3 text-sky-400" />
            Game Setup
          </span>
          <span className="text-[10px] text-slate-400 font-mono">
            5 × 5
          </span>
        </div>

        {/* 1. Bet Amount */}
        <div className="space-y-1">
          <div className="flex items-center justify-between">
            <label
              htmlFor="bet-amount-input"
              className="text-[10px] sm:text-[11px] font-medium text-slate-300 flex items-center gap-1"
            >
              Bet Amount
            </label>
            <span className="text-[11px] text-sky-400 font-mono font-semibold">
              ₹{betAmount.toFixed(2)}
            </span>
          </div>

          <div className="relative flex items-center">
            <span className="absolute left-2.5 text-sky-400 font-bold text-xs pointer-events-none">
              ₹
            </span>
            <input
              id="bet-amount-input"
              type="number"
              min="0.1"
              step="1"
              value={betAmount === 0 ? '' : betAmount}
              onChange={handleBetInputChange}
              className="w-full bg-[#071824] text-white font-mono text-xs font-semibold rounded-lg border border-[#213743] focus:border-sky-400 focus:outline-none focus:ring-1 focus:ring-sky-400/50 pl-6 pr-20 py-1 sm:py-1.5 transition-all shadow-inner"
            />
            <div className="absolute right-1 flex items-center gap-1">
              <button
                type="button"
                onClick={() => handleMultiplyBet(0.5)}
                className="px-1 py-0.5 text-[10px] font-mono font-bold rounded bg-[#213743] text-slate-300 hover:text-sky-300 transition-colors"
                title="Half bet"
              >
                ½
              </button>
              <button
                type="button"
                onClick={() => handleMultiplyBet(2)}
                className="px-1 py-0.5 text-[10px] font-mono font-bold rounded bg-[#213743] text-slate-300 hover:text-sky-300 transition-colors"
                title="Double bet"
              >
                2×
              </button>
            </div>
          </div>

          {/* Quick Selection Buttons */}
          <div className="grid grid-cols-3 gap-1 pt-0.5">
            {[10, 50, 100].map((amt) => {
              const isSelected = Math.abs(betAmount - amt) < 0.001;
              return (
                <button
                  key={amt}
                  type="button"
                  onClick={() => handleQuickBet(amt)}
                  className={`py-1 px-1.5 rounded-md text-[11px] font-bold font-mono transition-all flex items-center justify-center ${
                    isSelected
                      ? 'bg-sky-500/20 text-sky-300 border border-sky-400/60 shadow-[0_0_6px_rgba(56,189,248,0.25)]'
                      : 'bg-[#213743] text-slate-300 border border-transparent hover:bg-[#2c4756] hover:text-white'
                  }`}
                >
                  ₹{amt}
                </button>
              );
            })}
          </div>
        </div>

        {/* 2. Number of Mines Dropdown (clean display: 1 Mine, 2 Mines... without revealing internal box counts) */}
        <div className="space-y-0.5">
          <div className="flex items-center justify-between">
            <label
              htmlFor="mines-dropdown"
              className="text-[10px] sm:text-[11px] font-medium text-slate-300 flex items-center gap-1"
            >
              <Bomb className="w-2.5 h-2.5 text-rose-400" />
              Mines
            </label>
          </div>
          <div className="relative">
            <select
              id="mines-dropdown"
              value={numberOfMines}
              onChange={handleMinesChange}
              disabled={isPredicting || hasPredicted}
              className="w-full bg-[#071824] text-white font-mono text-xs rounded-lg border border-[#213743] focus:border-sky-400 focus:outline-none focus:ring-1 focus:ring-sky-400/50 px-2.5 py-1 sm:py-1.5 appearance-none cursor-pointer disabled:opacity-60"
            >
              {[1, 2, 3, 4, 5].map((num) => (
                <option key={num} value={num} className="bg-[#0f212e] text-white">
                  {num} {num === 1 ? 'Mine' : 'Mines'}
                </option>
              ))}
            </select>
            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-sky-400">
              <svg className="w-3 h-3 fill-current" viewBox="0 0 20 20">
                <path d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" />
              </svg>
            </div>
          </div>
        </div>

        {/* 3. Seeds Section: When prediction runs, this input section resets and is removed */}
        {!hasPredicted ? (
          <div className="animate-in fade-in duration-200">
            <SeedFields
              clientSeed={clientSeed}
              serverSeed={serverSeed}
              onClientSeedChange={onClientSeedChange}
              onServerSeedChange={onServerSeedChange}
              onRegenerateSeeds={onRegenerateSeeds}
            />
          </div>
        ) : (
          /* Active Round Countdown Banner */
          <div className="p-2 rounded-lg bg-[#071824] border border-emerald-500/30 flex flex-col items-center justify-center gap-1.5 text-center animate-in fade-in zoom-in-95 duration-200 shadow-inner">
            <div className="flex items-center gap-1">
              <Sparkles className="w-3 h-3 text-emerald-400 animate-pulse" />
              <span className="text-[11px] font-bold text-emerald-400 uppercase tracking-wide">
                Prediction Active
              </span>
            </div>

            <p className="text-[10px] text-slate-300 flex items-center gap-1 font-mono">
              <Clock className="w-2.5 h-2.5 text-slate-400" />
              <span>
                New seeds in <strong className="text-emerald-400">{countdown ?? 0}s</strong>
              </span>
            </p>

            <div className="w-full bg-[#1b2b34] h-1 rounded-full overflow-hidden">
              <div
                className="bg-gradient-to-r from-emerald-500 to-cyan-400 h-full transition-all duration-1000 ease-linear rounded-full"
                style={{ width: `${Math.max(0, Math.min(100, ((countdown ?? 0) / 10) * 100))}%` }}
              />
            </div>
          </div>
        )}
      </div>

      {/* 4. Prediction Action Button (Disabled if seeds are not entered) */}
      <div className="pt-0.5">
        <PredictionButton
          isPredicting={isPredicting}
          hasPredicted={hasPredicted}
          countdown={countdown}
          disabled={!hasPredicted && !hasValidSeeds}
          disabledReason="Please enter client and server seeds to run prediction"
          onPredict={onPredict}
          onReset={onResetNow}
        />
      </div>
    </div>
  );
};
