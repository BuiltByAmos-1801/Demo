import { useState, useEffect } from 'react';
import { SetupForm, SAFE_BOXES_MAP } from './components/SetupForm';
import { Board } from './components/Board';
import {
  generateRandomSeed,
  simulateBoard,
  TilePrediction,
} from './utils/provablyFair';
import { soundFx } from './utils/audio';

export default function App() {
  const [betAmount, setBetAmount] = useState<number>(10.0);
  const [numberOfMines, setNumberOfMines] = useState<number>(5);
  // Empty by default: user must enter or generate seeds before prediction
  const [clientSeed, setClientSeed] = useState<string>('');
  const [serverSeed, setServerSeed] = useState<string>('');

  const [soundMuted, setSoundMuted] = useState<boolean>(false);
  const [isPredicting, setIsPredicting] = useState<boolean>(false);
  const [hasPredicted, setHasPredicted] = useState<boolean>(false);
  const [maxMultiplier, setMaxMultiplier] = useState<string>('24.75x');
  const [countdown, setCountdown] = useState<number | null>(null);

  // Initial clean 25 tiles
  const [tiles, setTiles] = useState<TilePrediction[]>(() =>
    Array.from({ length: 25 }, (_, index) => ({
      index,
      row: Math.floor(index / 5),
      col: index % 5,
      isSafe: true,
      isRecommended: false,
      confidence: 50,
    }))
  );

  const toggleSound = () => {
    const nextState = !soundMuted;
    setSoundMuted(nextState);
    soundFx.setMuted(nextState);
  };

  const handleRegenerateSeeds = () => {
    setClientSeed(generateRandomSeed(12));
    setServerSeed(generateRandomSeed(64));
  };

  const handleResetBoard = () => {
    setHasPredicted(false);
    setCountdown(null);
    setTiles(
      Array.from({ length: 25 }, (_, index) => ({
        index,
        row: Math.floor(index / 5),
        col: index % 5,
        isSafe: true,
        isRecommended: false,
        confidence: 50,
      }))
    );
  };

  const handleAutoRefreshNewSeeds = () => {
    // Reset seeds and board
    setClientSeed('');
    setServerSeed('');
    setHasPredicted(false);
    setMaxMultiplier('24.75x');
    setCountdown(null);
    setTiles(
      Array.from({ length: 25 }, (_, index) => ({
        index,
        row: Math.floor(index / 5),
        col: index % 5,
        isSafe: true,
        isRecommended: false,
        confidence: 50,
      }))
    );

    soundFx.playSuccess();
  };

  const handlePredict = async () => {
    // Bina seed enter kiye prediction button kaam nahi karega
    const activeClient = clientSeed.trim();
    const activeServer = serverSeed.trim();

    if (activeClient.length < 10 || activeServer.length !== 64) {
      return;
    }

    setIsPredicting(true);
    setCountdown(null);

    try {
      // User mapping:
      // 1 mine -> 9 boxes
      // 2 mines -> 4 boxes
      // 3 mines -> 4 boxes
      // 4 mines -> 3 boxes
      // 5 mines -> 2 boxes
      const targetSafeDiamonds = SAFE_BOXES_MAP[numberOfMines] ?? 2;

      const result = await simulateBoard(
        activeClient,
        activeServer,
        numberOfMines,
        targetSafeDiamonds
      );

      setTimeout(() => {
        setTiles(result.tiles);
        setMaxMultiplier(result.maxMultiplier);
        setHasPredicted(true);
        setIsPredicting(false);

        // Clear out seeds once prediction is active so no old text lingers
        setClientSeed('');
        setServerSeed('');

        // Play sequence of chime sounds for revealed diamonds
        const recommendedCount = result.tiles.filter((t) => t.isRecommended).length;
        for (let i = 0; i < Math.min(recommendedCount, 5); i++) {
          setTimeout(() => {
            soundFx.playDiamondChime(1.0 + i * 0.15);
          }, i * 90);
        }
      }, 700);
    } catch {
      setIsPredicting(false);
    }
  };

  // 20-second auto refresh timer
  useEffect(() => {
    if (!hasPredicted) {
      setCountdown(null);
      return;
    }

    setCountdown(20);
    const timer = setInterval(() => {
      setCountdown((prev) => {
        if (prev === null) return null;
        if (prev <= 1) {
          clearInterval(timer);
          handleAutoRefreshNewSeeds();
          return null;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [hasPredicted]);

  // Keyboard shortcut: Spacebar to predict only when valid seeds are entered
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (
        e.code === 'Space' &&
        document.activeElement?.tagName !== 'INPUT' &&
        document.activeElement?.tagName !== 'SELECT' &&
        !isPredicting &&
        !hasPredicted &&
        clientSeed.trim().length >= 10 &&
        serverSeed.trim().length === 64
      ) {
        e.preventDefault();
        handlePredict();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [clientSeed, serverSeed, numberOfMines, isPredicting, hasPredicted]);

  return (
    <div className="min-h-screen bg-[#071824] text-slate-100 flex flex-col items-center justify-center p-2 sm:p-3 selection:bg-emerald-500/30 selection:text-emerald-200">
      {/* Background Subtle Ambience */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden -z-10">
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[400px] h-[250px] bg-emerald-500/5 blur-[100px] rounded-full" />
        <div className="absolute bottom-10 right-10 w-[300px] h-[200px] bg-sky-600/5 blur-[100px] rounded-full" />
      </div>

      {/* Main Small & Compact Container (max-w-[620px]) */}
      <div className="w-full max-w-[620px] mx-auto flex flex-col gap-2 py-0.5">
        {/* 2-Column Snug Small Layout */}
        <main className="grid grid-cols-1 md:grid-cols-12 gap-2.5 items-start">
          {/* Left Column: Game Setup Form (5 of 12 cols) */}
          <section className="md:col-span-5 w-full">
            <SetupForm
              betAmount={betAmount}
              onBetAmountChange={setBetAmount}
              numberOfMines={numberOfMines}
              onNumberOfMinesChange={setNumberOfMines}
              clientSeed={clientSeed}
              serverSeed={serverSeed}
              onClientSeedChange={setClientSeed}
              onServerSeedChange={setServerSeed}
              onRegenerateSeeds={handleRegenerateSeeds}
              isPredicting={isPredicting}
              hasPredicted={hasPredicted}
              countdown={countdown}
              onPredict={handlePredict}
              onResetNow={handleAutoRefreshNewSeeds}
            />
          </section>

          {/* Right Column: Mines Board (7 of 12 cols) */}
          <section className="md:col-span-7 w-full flex justify-center">
            <Board
              tiles={tiles}
              isPredicting={isPredicting}
              hasPredicted={hasPredicted}
              maxMultiplier={maxMultiplier}
              numberOfMines={numberOfMines}
              onResetBoard={handleResetBoard}
              countdown={countdown}
              onResetNow={handleAutoRefreshNewSeeds}
            />
          </section>
        </main>
      </div>
    </div>
  );
}
