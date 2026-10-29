# Mines Prediction Responsive Panel

A modern, responsive Mines Prediction gaming dashboard featuring an authentic dark navy aesthetic, neon cyan-blue accents, interactive 5x5 prediction board, configurable bet and seed controls, and realistic cryptographic simulation feedback.

### User Review & Critical Decisions

> [!IMPORTANT]
> The following decisions were clarified and confirmed during Phase 1:
> - **Branding & Header**: Minimalist Stake logo placeholder with neon cyan accents alongside the "Mines Prediction" title and subtitle.
> - **Prediction Presentation**: Simulated safe-tile heatmap powered by deterministic cryptographic seed hashing (SHA-256 simulation with client/server seeds) showing high-confidence diamond locations and estimated multipliers.
> - **Audio Feedback**: Synthesized Web Audio API sound effects (subtle cyber clicks, tile reveal chimes, error buzzers) with a top-bar mute toggle for zero-friction user control.
> - **Strict Labeling Compliance**: Absolutely zero occurrences of the word "optional" or bracketed explanatory text across any labels, inputs, tooltips, or placeholders.

---

### 1. Overview & Core Concept

- **What It Does**: Provides an interactive, high-precision prediction dashboard for the popular Mines casino game format. Players configure their bet amount (in INR ₹), adjust mine count (1–24) and safe diamond targets, enter client and server seeds with one-click copy and toggle-visibility controls, and generate visual probability predictions across a 5x5 tile grid.
- **Target Audience / Persona**: Online gaming enthusiasts, crypto casino analytics followers, and players analyzing provably-fair seed interactions in a clean, professional dark-mode simulator.
- **Key Value**: Delivers a focused, responsive interface that works on mobile screens (without 5-column horizontal grid overflow) while maintaining provably-fair simulation transparency and responsible disclosure that results are educational simulations.

---

### 2. User Experience & Visual Design

- **Key User Flows**:
  1. *Setup Flow*: User reviews default bet (₹10.00), taps quick chips (₹10, ₹50, ₹100), or types a custom amount.
  2. *Configuration Flow*: User selects mine count (1–24). The diamond dropdown immediately re-evaluates its valid bounds ($25 - \text{mines}$) to prevent impossible game states.
  3. *Seed Management Flow*: User views or modifies Client and Server seeds. Eye icon toggles secret masking; copy button provides instant clipboard feedback.
  4. *Prediction Trigger Flow*: User clicks the full-width "Predict Safe Tiles" button. Button transitions to an animated pulsating glowing state. Sound effects trigger an analytical sweep, followed by sequential tile reveals highlighting safe tiles with neon diamond glows and probability confidence scores.
  5. *Board Reset / Iteration*: User can tap on individual tiles to inspect cell odds or trigger new seed permutations.

- **Visual Identity & Theme**:
  - *Aesthetic Direction*: Dark cyberpunk-casino console. Deep navy-blue canvas (`#0b1329` to `#0f1b3b`), subtle radial glow behind the grid, sleek border styling (`border-sky-500/20`), and vivid electric-blue (`#00f0ff` / `#38bdf8`) active states.
  - *Color Palette & Mood*:
    - Canvas (60%): `#0a0f1d` to `#0d172e`
    - Structural Panels (30%): `#132042` with 1px border `rgba(56, 189, 248, 0.15)`
    - Accent Highlights (10%): Electric cyan `#00f0ff`, neon sky `#38bdf8`, and emerald `#10b981`
  - *Typography & Hierarchy*:
    - Title & Headings: `Plus Jakarta Sans` / `Outfit` with crisp tracking
    - Data & Multipliers: Tabular monospace figures (`font-mono tabular-nums`)
    - Scale: Display title (22px mobile / 28px desktop), Card titles (15px bold), Form labels (13px medium muted `#94a3b8`), Tile indicators (14px bold)
  - *Component Styling & Layout*:
    - Mobile-first single-column stacked layout on `< 768px`; balanced two-column side-by-side cockpit layout on `≥ 1024px` desktop (Controls Panel on left, 5x5 Mines Board on right).
    - Outer container padding strictly exceeds inner element spacing (`p-6` vs `gap-3`).
    - Nested radius discipline: Outer card `rounded-2xl`, inner input boxes `rounded-xl`, quick chips `rounded-lg`.

- **Interactive Feedback & Motion**:
  - Predict button: Loading spinner with animated neon border beam.
  - 5x5 Grid tiles: Smooth flip and scale transition (`transform: scale(1.04)`) with glowing cyan diamond icon reveals and confidence badges.
  - Clipboard copy: Micro toast tooltip "Copied to clipboard!" with checkmark.

---

### 3. Key Product Decisions & Trade-Offs

- **Decision 1: Provably-Fair Cryptographic Simulation Algorithm**
  - *Chosen Approach*: Deterministic pseudo-random number generator (PRNG) seeded by hashing `clientSeed + ":" + serverSeed + ":" + nonce` using browser-native SHA-256 (via `crypto.subtle`). If seeds are left blank, randomized entropy seeds are generated.
  - *Why*: Ensures consistent, deterministic results when the same seeds are entered, mimicking real provably-fair casino mechanics while respecting the requirement to not claim actual future gambling omniscience.
  - *Alternatives Considered*: Pure random numbers (lacks seed reproducibility) or fake fixed coordinates (breaks replayability).

- **Decision 2: Strict Exclusion of "Optional" Text**
  - *Chosen Approach*: Zero occurrences of the word "optional" in labels, placeholders, aria-labels, tooltips, or documentation. Seed placeholders are strictly "Enter client seed" and "Enter server seed".
  - *Why*: Explicit negative constraint in the user prompt.

- **Decision 3: Web Audio API Synthesizer vs External MP3s**
  - *Chosen Approach*: Lightweight Web Audio API synthesizer for clean futuristic beeps, chimes, and clicks with an interactive sound toggle in the header.
  - *Why*: 100% reliable offline, zero external audio asset loading errors or network latency, silky smooth playback.
  - *Alternatives Considered*: External audio files (prone to 404s or CORS blocks in iframe sandboxes).

---

### 4. Technical Architecture & Data Strategy

#### Architecture & Component Diagram

```
┌────────────────────────────────────────────────────────────────────────┐
│                               App.tsx                                  │
│             (Root State: Bet, Mines, Diamonds, Seeds, Audio)           │
└──────────────────────────────────┬─────────────────────────────────────┘
                                   │
         ┌─────────────────────────┴─────────────────────────┐
         ▼                                                   ▼
┌─────────────────────────────────┐         ┌─────────────────────────────────┐
│           Header.tsx            │         │          Board.tsx              │
│ - Minimalist Stake Logo mark    │         │ - 5x5 Responsive Grid           │
│ - "Mines Prediction" Title      │         │ - Diamond / Safe Heatmap Tiles  │
│ - Subtitle & Sound Toggle       │         │ - Max Multiplier 24.75x Badge   │
└─────────────────────────────────┘         │ - Tile Probability Tooltip      │
                                            └─────────────────────────────────┘
                                   ▲
                                   │
         ┌─────────────────────────┴─────────────────────────┐
         ▼                                                   ▼
┌─────────────────────────────────┐         ┌─────────────────────────────────┐
│         SetupForm.tsx           │         │         SeedFields.tsx          │
│ - Bet Input with Currency (₹)   │         │ - Client Seed Input & Eye Mask  │
│ - Quick Chips (₹10, ₹50, ₹100)  │         │ - Server Seed Input & Eye Mask  │
│ - Mines Dropdown (1-24)         │         │ - Copy-to-Clipboard Buttons     │
│ - Diamonds Dropdown (Dynamic)   │         │ - No "Optional" Text            │
└────────────────┬────────────────┘         └─────────────────────────────────┘
                 │
                 ▼
┌─────────────────────────────────┐
│      PredictionButton.tsx       │
│ - Full-width Cyan Gradient      │
│ - Pulse & Loading State         │
│ - Synthesized Audio Trigger     │
└─────────────────────────────────┘
```

#### Data Model & State

```typescript
interface GameSetupState {
  betAmount: number;             // Default: 10.00
  numberOfMines: number;         // Default: 5 (range 1-24)
  numberOfDiamonds: number;      // Default: 5 (valid: 1 to 25 - mines)
  clientSeed: string;            // Default: custom hex string
  serverSeed: string;            // Default: custom hex string
  isPredicting: boolean;         // Loading state
  predictions: PredictedTile[];  // Array of 25 tile states
  soundEnabled: boolean;         // Audio feedback toggle
}

interface PredictedTile {
  index: number;                 // 0 to 24
  status: 'hidden' | 'diamond' | 'mine' | 'recommended';
  confidence: number;            // 0% - 99%
  revealedOrder?: number;
}
```

#### Interactive Component & State Mapping

- `Bet Amount`: Formatted to 2 decimal places with INR currency symbol ₹. Quick chips `[₹10, ₹50, ₹100]` update the value instantly and trigger tactile click audio.
- `Number of Mines`: Dropdown from 1 to 24. Changing mines dynamically updates `maxDiamonds = 25 - numberOfMines`. If current `numberOfDiamonds > maxDiamonds`, automatically clamp it to `maxDiamonds`.
- `Number of Diamonds`: Dropdown strictly rendering `1` to `25 - numberOfMines` to prevent invalid game setups.
- `Seed Fields`: Includes visibility toggle (Show/Hide text) and Copy button with 2-second confirmation checkmark.
- `Prediction Action`: Generates deterministic tile predictions using SHA-256 hash digest of the inputs. Board updates with smooth sequential reveal animations, playing high-pitched crystal chimes for diamond tiles.
- `Bottom Badge`: Displays `"Max Multiplier 24.75x"` with neon border accent as specified.
