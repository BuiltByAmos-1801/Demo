import React, { useState } from 'react';
import { TilePrediction } from '../utils/provablyFair';
import { StakeDiamond, StakeBomb } from './StakeIcons';
import { soundFx } from '../utils/audio';

interface BoardProps {
  tiles: TilePrediction[];
  isPredicting: boolean;
  hasPredicted: boolean;
  maxMultiplier: string;
  numberOfMines: number;
  onResetBoard: () => void;
  countdown?: number | null;
  onResetNow?: () => void;
}

export const Board: React.FC<BoardProps> = ({
  tiles,
  isPredicting,
  hasPredicted,
  maxMultiplier,
  countdown = null,
  onResetNow,
}) => {
  const [selectedTileIndex, setSelectedTileIndex] = useState<number | null>(null);

  const handleTileClick = (tile: TilePrediction) => {
    setSelectedTileIndex(tile.index);
    if (tile.isRecommended) {
      soundFx.playDiamondChime(1.1);
    } else {
      soundFx.playClick();
    }
  };

  return (
    <div className="bg-[#0f212e]/90 backdrop-blur-md rounded-xl border border-[#213743] p-2.5 sm:p-3 shadow-md flex flex-col items-center justify-between gap-2.5 w-full">
      {/* 5x5 Tiles Grid Container - Small compact size */}
      <div className="relative w-full max-w-[270px] sm:max-w-[290px] mx-auto py-0.5">
        {/* Radar Scanning Overlay during Prediction */}
        {isPredicting && (
          <div className="absolute inset-0 z-20 flex flex-col items-center justify-center bg-[#071824]/85 backdrop-blur-[2px] rounded-lg border border-sky-400/40">
            <div className="relative flex items-center justify-center w-14 h-14">
              <div className="absolute inset-0 rounded-full border border-emerald-500/30 animate-ping" />
              <div className="w-10 h-10 rounded-full border-2 border-t-emerald-400 border-r-transparent border-b-emerald-400 border-l-transparent animate-spin" />
              <StakeDiamond className="w-5 h-5 absolute" />
            </div>
            <span className="mt-1.5 text-[10px] font-mono font-semibold tracking-wider text-emerald-400">
              SCANNING SEED...
            </span>
          </div>
        )}

        {/* 5-Column Grid with authentic Stake tile styling */}
        <div className="grid grid-cols-5 gap-1 sm:gap-1.5 w-full">
          {tiles.map((tile) => {
            const isSelected = selectedTileIndex === tile.index;
            const isRecommended = hasPredicted && tile.isRecommended;

            return (
              <button
                key={tile.index}
                type="button"
                onClick={() => handleTileClick(tile)}
                className={`relative aspect-square w-full rounded-md sm:rounded-lg flex items-center justify-center transition-all duration-150 select-none cursor-pointer focus:outline-none ${
                  isRecommended
                    ? 'bg-[#071824] shadow-inner border border-[#1a2c38] scale-[1.02] z-10'
                    : isSelected && !tile.isSafe
                    ? 'bg-[#071824] border border-rose-900/60'
                    : 'bg-[#2f4553] hover:bg-[#385263] border-b-[2px] sm:border-b-[3px] border-[#213743] active:translate-y-[1px] active:border-b-[1px] shadow-sm'
                }`}
              >
                {/* When Predicted: Show the authentic Stake Diamond */}
                {isRecommended ? (
                  <StakeDiamond className="w-5 h-5 sm:w-7 sm:h-7" />
                ) : hasPredicted && !tile.isSafe && isSelected ? (
                  <StakeBomb className="w-5 h-5 sm:w-7 sm:h-7" />
                ) : null}
              </button>
            );
          })}
        </div>
      </div>

      {/* Bottom Area: Clean Stake-style Max Multiplier Pill Badge & Auto-Refresh Countdown */}
      <div className="flex flex-col items-center gap-1.5 w-full pt-0.5">
        <div className="px-3.5 py-1 rounded-full bg-[#213743] border border-[#2f4553] shadow-sm flex items-center justify-center">
          <span className="text-[11px] sm:text-xs font-bold text-slate-100 tracking-wide font-sans">
            Max Multiplier {hasPredicted ? maxMultiplier : '24.75x'}
          </span>
        </div>

        {/* 10-Second Auto Refresh Indicator */}
        {countdown !== null && countdown > 0 && (
          <div className="flex items-center gap-1.5 py-0.5 px-2.5 rounded-full bg-[#071824] border border-[#213743] text-slate-300 text-[10px] font-mono animate-in fade-in duration-200">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
            <span>
              Auto new seeds in <span className="text-emerald-400 font-bold">{countdown}s</span>
            </span>
            {onResetNow && (
              <button
                type="button"
                onClick={onResetNow}
                className="ml-1 text-[9px] text-sky-400 hover:text-sky-300 underline font-sans font-semibold cursor-pointer"
              >
                Reset now
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
