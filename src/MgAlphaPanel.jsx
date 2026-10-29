import { useEffect, useRef, useState } from 'react'
import MgAlphaApp from './MgAlpha/App'
import './MgAlpha/index.css'

export default function MgAlphaPanel({ onClose }) {
  const closeButtonRef = useRef(null)
  const panelRef = useRef(null)
  const dragRef = useRef(null)
  const resizeRef = useRef(null)
  const [panelOffset, setPanelOffset] = useState({ x: 0, y: 0 })
  const [panelSize, setPanelSize] = useState({ width: 720, height: null })
  const [minimized, setMinimized] = useState(false)

  useEffect(() => {
    closeButtonRef.current?.focus()

    function handleKeyDown(event) {
      if (event.key === 'Escape') onClose()
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [onClose])

  useEffect(() => {
    function keepPanelInView() {
      setPanelOffset(offset => clampOffset(offset.x, offset.y))
    }

    window.addEventListener('resize', keepPanelInView)
    return () => window.removeEventListener('resize', keepPanelInView)
  }, [])

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

    setPanelOffset(clampOffset(
      drag.offsetX + event.clientX - drag.startX,
      drag.offsetY + event.clientY - drag.startY,
    ))
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

  function startResize(event) {
    event.preventDefault()
    const rect = panelRef.current.getBoundingClientRect()
    resizeRef.current = {
      pointerId: event.pointerId,
      startX: event.clientX,
      startY: event.clientY,
      width: rect.width,
      height: rect.height,
    }
    event.currentTarget.setPointerCapture(event.pointerId)
  }

  function moveResize(event) {
    const resize = resizeRef.current
    if (!resize || resize.pointerId !== event.pointerId) return

    const width = Math.max(320, Math.min(window.innerWidth - 16, resize.width + event.clientX - resize.startX))
    const height = Math.max(140, Math.min(window.innerHeight - 16, resize.height + event.clientY - resize.startY))
    setPanelSize({ width, height })
  }

  function stopResize(event) {
    if (resizeRef.current?.pointerId !== event.pointerId) return
    resizeRef.current = null
    if (event.currentTarget.hasPointerCapture(event.pointerId)) {
      event.currentTarget.releasePointerCapture(event.pointerId)
    }
  }

  function toggleMinimized() {
    setMinimized(value => !value)
  }

  return (
    <div className="panel-modal" role="presentation">
      <section
        ref={panelRef}
        className={`mg-panel mg-panel-imported${minimized ? ' is-minimized' : ''}`}
        style={{
          width: `${Math.min(panelSize.width, window.innerWidth - 16)}px`,
          height: minimized ? '46px' : panelSize.height ? `${panelSize.height}px` : undefined,
          transform: `translate(${panelOffset.x}px, ${panelOffset.y}px)`,
        }}
        role="dialog"
        aria-labelledby="mg-panel-title"
      >
        <header
          className="mg-panel-header mg-imported-header"
          onPointerDown={startDrag}
          onPointerMove={moveDrag}
          onPointerUp={stopDrag}
          onPointerCancel={stopDrag}
          onKeyDown={moveWithKeyboard}
          tabIndex={0}
          aria-label="Drag MG ALPHA MOD panel. Use arrow keys to move it."
        >
          <button
            type="button"
            className="mg-header-logo"
            onClick={toggleMinimized}
            aria-label={minimized ? 'Maximize MG ALPHA MOD panel' : 'Minimize MG ALPHA MOD panel'}
            title={minimized ? 'Maximize panel' : 'Minimize panel'}
          >
            <img src="/images/stake-full.B38fTPet.svg" alt="Stake" />
          </button>
          <h2 id="mg-panel-title">MG ALPHA MOD</h2>
          <button
            ref={closeButtonRef}
            className="mg-close-button"
            type="button"
            onClick={onClose}
            aria-label="Close MG ALPHA MOD panel"
          >
            ×
          </button>
        </header>
        {!minimized && <MgAlphaApp />}
        {!minimized && (
          <button
            type="button"
            className="mg-resize-handle"
            onPointerDown={startResize}
            onPointerMove={moveResize}
            onPointerUp={stopResize}
            onPointerCancel={stopResize}
            aria-label="Resize MG ALPHA MOD panel"
            title="Drag to resize"
          />
        )}
      </section>
    </div>
  )
}
