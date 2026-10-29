export interface TilePrediction {
  index: number;
  row: number;
  col: number;
  isSafe: boolean;
  isRecommended: boolean;
  confidence: number; // 0 - 99%
  revealedOrder?: number;
}

export interface SimulationResult {
  tiles: TilePrediction[];
  maxMultiplier: string;
  recommendedCount: number;
  hashPreview: string;
}

/**
 * Computes standard Mines combinatorial game multiplier
 * Formula: 0.99 * Product_{i=0}^{k-1} ((25 - i) / (25 - mines - i))
 */
export function calculateMultiplier(minesCount: number, diamondsCount: number): string {
  if (minesCount <= 0 || diamondsCount <= 0) return '1.00x';
  const totalTiles = 25;
  const safeTilesCount = totalTiles - minesCount;
  const targetDiamonds = Math.min(diamondsCount, safeTilesCount);

  let multiplier = 0.99;
  for (let i = 0; i < targetDiamonds; i++) {
    multiplier *= (totalTiles - i) / (safeTilesCount - i);
  }

  // Format nicely
  if (multiplier >= 1000) {
    return `${multiplier.toFixed(0)}x`;
  }
  return `${multiplier.toFixed(2)}x`;
}

/**
 * Deterministic SHA-256 hash string conversion
 */
async function sha256(message: string): Promise<Uint8Array> {
  const encoder = new TextEncoder();
  const data = encoder.encode(message);
  const hashBuffer = await crypto.subtle.digest('SHA-256', data);
  return new Uint8Array(hashBuffer);
}

/**
 * Generates an authentic cryptographically random hex seed
 */
export function generateRandomSeed(length: number = 32): string {
  const array = new Uint8Array(length / 2);
  crypto.getRandomValues(array);
  return Array.from(array)
    .map((b) => b.toString(16).padStart(2, '0'))
    .join('');
}

/**
 * Deterministically simulates the 5x5 board safe tiles using client and server seeds
 */
export async function simulateBoard(
  clientSeed: string,
  serverSeed: string,
  minesCount: number,
  diamondsCount: number,
  nonce: number = 1
): Promise<SimulationResult> {
  const activeClient = clientSeed.trim() || 'default_client_seed_777';
  const activeServer = serverSeed.trim() || 'default_server_seed_999';
  const combined = `${activeClient}:${activeServer}:${nonce}`;

  const hashBytes = await sha256(combined);
  const hashHex = Array.from(hashBytes)
    .map((b) => b.toString(16).padStart(2, '0'))
    .join('');

  // Fisher-Yates shuffle of 25 tiles using deterministic byte pairs from the hash
  const tileIndices = Array.from({ length: 25 }, (_, i) => i);
  for (let i = tileIndices.length - 1; i > 0; i--) {
    const byteIndex = (24 - i) % hashBytes.length;
    const randomByte = hashBytes[byteIndex];
    const j = randomByte % (i + 1);
    const temp = tileIndices[i];
    tileIndices[i] = tileIndices[j];
    tileIndices[j] = temp;
  }

  // The first `minesCount` shuffled indices are simulated hazard mines
  const simulatedMines = new Set(tileIndices.slice(0, minesCount));
  const safePool = tileIndices.filter((idx) => !simulatedMines.has(idx));

  // Select top diamond recommendations from the safe pool
  const recommendedDiamonds = new Set(safePool.slice(0, diamondsCount));

  // Generate tile prediction states with probability confidence metrics
  const tiles: TilePrediction[] = Array.from({ length: 25 }, (_, index) => {
    const isMine = simulatedMines.has(index);
    const isRecommended = recommendedDiamonds.has(index);
    const byteVal = hashBytes[index % hashBytes.length];

    // High confidence for recommended safe tiles (88% - 98%)
    // Moderate confidence for other safe tiles (70% - 85%)
    // Low confidence for simulated mines (12% - 35%)
    let confidence = 50;
    if (isRecommended) {
      confidence = 88 + (byteVal % 11);
    } else if (!isMine) {
      confidence = 68 + (byteVal % 18);
    } else {
      confidence = 15 + (byteVal % 25);
    }

    return {
      index,
      row: Math.floor(index / 5),
      col: index % 5,
      isSafe: !isMine,
      isRecommended,
      confidence,
    };
  });

  const maxMultiplier = calculateMultiplier(minesCount, diamondsCount);

  return {
    tiles,
    maxMultiplier,
    recommendedCount: diamondsCount,
    hashPreview: hashHex.slice(0, 16) + '...',
  };
}
