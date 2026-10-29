import { useEffect, useRef, useState } from 'react'

const MINE_SAFE_BOXES = { 1: 9, 2: 4, 3: 4, 4: 3, 5: 2 }

async function sha256(message) {
  const digest = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(message))
  return new Uint8Array(digest)
}

function randomSeed(length) {
  const bytes = new Uint8Array(length / 2)
  crypto.getRandomValues(bytes)
  return Array.from(bytes, byte => byte.toString(16).padStart(2, '0')).join('')
}

async function predictBoard(clientSeed, serverSeed, minesCount) {
  const hash = await sha256(`${clientSeed}:${serverSeed}:${1}`)
  const indices = Array.from({ length: 25 }, (_, index) => index)

  for (let i = indices.length - 1; i > 0; i--) {
    const randomByte = hash[(24 - i) % hash.length]
    const j = randomByte % (i + 1)
    ;[indices[i], indices[j]] = [indices[j], indices[i]]
  }

  const mines = new Set(indices.slice(0, minesCount))
  const safePool = indices.filter(index => !mines.has(index))
  const diamonds = new Set(safePool.slice(0, MINE_SAFE_BOXES[minesCount]))

  return Array.from({ length: 25 }, (_, index) => ({
    index,
    isMine: mines.has(index),
    isDiamond: diamonds.has(index),
  }))
}

function EyeIcon({ hidden }) {
  return hidden ? '◉' : '○'
}

export default function MgAlphaPanel({ onClose }) {
  const closeButtonRef = useRef(null)
  const panelRef = useRef(null)
  const dragRef = useRef(null)
  const [panelOffset, setPanelOffset] = useState({ x: 0, y: 0 })
  const [betAmount, setBetAmount] = useState(10)
  const [mines, setMines] = useState(5)
  const [clientSeed, setClientSeed] = useState('')
  const [serverSeed, setServerSeed] = useState('')
  const [showClient, setShowClient] = useState(false)
  const [showServer, setShowServer] = useState(false)
  const [copied, setCopied] = useState('')
  const [predicting, setPredicting] = useState(false)
  const [tiles, setTiles] = useState(() => Array.from({ length: 25 }, (_, index) => ({ index, isMine: false, isDiamond: false })))
  const [predicted, setPredicted] = useState(false)

  useEffect(() => {
    closeButtonRef.current?.focus()

    function handleKeyDown(event) {
      if (event.key === 'Escape') onClose()
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => {
      window.removeEventListener('keydown', handleKeyDown)
    }
  }, [onClose])

  function regenerateSeeds() {
    setClientSeed(randomSeed(12))
    setServerSeed(randomSeed(32))
  }

  function clampOffset(x, y) {
    const panel = panelRef.current
    if (!panel) return { x, y }

    const rect = panel.getBoundingClientRect()
    const maxX = Math.max(0, (window.innerWidth - rect.width) / 2 - 8)
    const maxY = Math.max(0, (window.innerHeight - rect.height) / 2 - 8)

    return {
      x: Math.max(-maxX, Math.min(maxX, x)),
      y: Math.max(-maxY, Math.min(maxY, y)),
    }
  }

  function startDrag(event) {
    if (event.target.closest('button')) return
    dragRef.current = {
      pointerId: event.pointerId,
      startX: event.clientX,
      startY: event.clientY,
      offsetX: panelOffset.x,
      offsetY: panelOffset.y,
    }
    event.currentTarget.setPointerCapture(event.pointerId)
  }

  function moveDrag(event) {
    const drag = dragRef.current
    if (!drag || drag.pointerId !== event.pointerId) return
    const nextOffset = clampOffset(
      drag.offsetX + event.clientX - drag.startX,
      drag.offsetY + event.clientY - drag.startY,
    )
    setPanelOffset(nextOffset)
  }

  function stopDrag(event) {
    if (dragRef.current?.pointerId !== event.pointerId) return
    dragRef.current = null
    if (event.currentTarget.hasPointerCapture(event.pointerId)) {
      event.currentTarget.releasePointerCapture(event.pointerId)
    }
  }

  function moveWithKeyboard(event) {
    const distance = event.shiftKey ? 20 : 5
    const movement = {
      ArrowLeft: [-distance, 0],
      ArrowRight: [distance, 0],
      ArrowUp: [0, -distance],
      ArrowDown: [0, distance],
    }[event.key]
    if (!movement) return
    event.preventDefault()
    setPanelOffset(offset => clampOffset(offset.x + movement[0], offset.y + movement[1]))
  }

  async function copySeed(seed, field) {
    if (!seed) return
    try {
      await navigator.clipboard.writeText(seed)
      setCopied(field)
      window.setTimeout(() => setCopied(''), 1600)
    } catch {
      setCopied('')
    }
  }

  async function runPrediction() {
    if (!clientSeed.trim() || !serverSeed.trim()) return
    setPredicting(true)
    await new Promise(resolve => window.setTimeout(resolve, 700))
    const result = await predictBoard(clientSeed.trim(), serverSeed.trim(), mines)
    setTiles(result)
    setPredicted(true)
    setPredicting(false)
  }

  const seedsReady = Boolean(clientSeed.trim() && serverSeed.trim())

  return (
    <div className="panel-modal" role="presentation">
      <section ref={panelRef} className="mg-panel" style={{ transform: `translate(${panelOffset.x}px, ${panelOffset.y}px)` }} role="dialog" aria-labelledby="mg-panel-title">
        <header
          className="mg-panel-header"
          onPointerDown={startDrag}
          onPointerMove={moveDrag}
          onPointerUp={stopDrag}
          onPointerCancel={stopDrag}
          onKeyDown={moveWithKeyboard}
          tabIndex={0}
          aria-label="Drag MG ALPHA MOD panel. Use arrow keys to move it."
        >
          <div className="mg-logo" aria-hidden="true">S</div>
          <h2 id="mg-panel-title">MG ALPHA MOD</h2>
          <button ref={closeButtonRef} className="mg-close-button" type="button" onClick={onClose} aria-label="Close MG ALPHA MOD panel">×</button>
        </header>

        <div className="mg-panel-body">
          <section className="game-setup">
            <div className="mg-section-heading">
              <span>◆ Game Setup</span>
              <small>5 × 5</small>
            </div>

            <label htmlFor="panel-bet-amount">Bet Amount</label>
            <div className="bet-input-row">
              <span>₹</span>
              <input id="panel-bet-amount" type="number" min="0" step="0.01" value={betAmount} onChange={event => setBetAmount(Number(event.target.value) || 0)} />
              <button type="button" onClick={() => setBetAmount(Math.max(1, betAmount / 2))}>½</button>
              <button type="button" onClick={() => setBetAmount(betAmount * 2)}>2×</button>
            </div>
            <div className="bet-presets">
              {[10, 50, 100].map(amount => (
                <button type="button" key={amount} className={betAmount === amount ? 'active' : ''} onClick={() => setBetAmount(amount)}>₹{amount}</button>
              ))}
            </div>

            <label htmlFor="panel-mines">Mines</label>
            <select id="panel-mines" value={mines} disabled={predicting || predicted} onChange={event => setMines(Number(event.target.value))}>
              {[1, 2, 3, 4, 5].map(amount => <option key={amount} value={amount}>{amount} {amount === 1 ? 'Mine' : 'Mines'}</option>)}
            </select>

            {!predicted && (
              <div className="seed-section">
                <div className="seed-heading">
                  <span>Provably Fair Seeds</span>
                  <button type="button" onClick={regenerateSeeds}>↻ New</button>
                </div>

                <label htmlFor="panel-client-seed">New Client Seed</label>
                <div className="seed-field">
                  <input id="panel-client-seed" type={showClient ? 'text' : 'password'} value={clientSeed} onChange={event => setClientSeed(event.target.value)} placeholder="Enter client seed" />
                  <button type="button" onClick={() => setShowClient(value => !value)} aria-label={`${showClient ? 'Hide' : 'Show'} client seed`}><EyeIcon hidden={showClient} /></button>
                  <button type="button" onClick={() => copySeed(clientSeed, 'client')} disabled={!clientSeed} aria-label="Copy client seed">{copied === 'client' ? '✓' : '▢'}</button>
                </div>

                <label htmlFor="panel-server-seed">Active Server Seed</label>
                <div className="seed-field">
                  <input id="panel-server-seed" type={showServer ? 'text' : 'password'} value={serverSeed} onChange={event => setServerSeed(event.target.value)} placeholder="Enter server seed" />
                  <button type="button" onClick={() => setShowServer(value => !value)} aria-label={`${showServer ? 'Hide' : 'Show'} server seed`}><EyeIcon hidden={showServer} /></button>
                  <button type="button" onClick={() => copySeed(serverSeed, 'server')} disabled={!serverSeed} aria-label="Copy server seed">{copied === 'server' ? '✓' : '▢'}</button>
                </div>
              </div>
            )}

            <button className="prediction-button" type="button" disabled={!seedsReady || predicting || predicted} onClick={runPrediction}>
              {predicting ? 'Analyzing Matrix...' : predicted ? 'Prediction Active' : 'Run Safe Prediction'}
            </button>
          </section>

          <section className="mg-board-section" aria-label="Mines prediction board">
            <div className="mg-board">
              {tiles.map(tile => (
                <button
                  key={tile.index}
                  type="button"
                  className={`mg-board-tile${predicted && tile.isDiamond ? ' diamond' : ''}`}
                  aria-label={predicted && tile.isDiamond ? 'Recommended safe tile' : `Board tile ${tile.index + 1}`}
                  disabled={predicting}
                >
                  {predicted && tile.isDiamond && <span aria-hidden="true">◆</span>}
                </button>
              ))}
            </div>
            <div className="multiplier-badge">Max Multiplier 24.75x</div>
          </section>
        </div>
      </section>
    </div>
  )
}
