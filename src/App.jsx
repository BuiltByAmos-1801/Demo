import { useEffect, useState } from 'react'
import MgAlphaPanel from './MgAlphaPanel'

const ACTIVATION_IDS = ['8757603560']

export default function App() {
  const [loading, setLoading] = useState(true)
  const [code, setCode] = useState('')
  const [status, setStatus] = useState('')
  const [activated, setActivated] = useState(false)
  const [landingAction, setLandingAction] = useState('')
  const [panelOpen, setPanelOpen] = useState(false)

  useEffect(() => {
    const timer = window.setTimeout(() => setLoading(false), 2200)
    return () => window.clearTimeout(timer)
  }, [])

  function handleCodeChange(event) {
    setCode(event.target.value.replace(/[^0-9]/g, '').slice(0, 10))
    setStatus('')
  }

  function handleSubmit(event) {
    event.preventDefault()

    if (!ACTIVATION_IDS.includes(code)) {
      setStatus(code.length === 10 ? 'Invalid activation code' : 'Enter the complete 10-digit code')
      return
    }

    setStatus('Activation code accepted')
    window.setTimeout(() => setActivated(true), 350)
  }

  return (
    <>
      {activated ? (
        <main className="landing-page">
          <div className="landing-glow" aria-hidden="true" />
          <section className="landing-card" aria-labelledby="landing-title">
            <img className="landing-logo" src="/images/stake-full.B38fTPet.svg" alt="Stake" />
            <div className="verified-badge">✓ Code Activated</div>
            <h1 id="landing-title">Welcome to Stake</h1>
            <p>Choose where you want to go.</p>
            <div className="landing-actions">
              <button type="button" className="start-panel-button" onClick={() => { setLandingAction(''); setPanelOpen(true) }}>Start Panel</button>
              <button
                type="button"
                className="enter-game-button"
                onClick={() => window.open('https://stake.mba/?offer=mg2&c=MG2', '_blank', 'noopener,noreferrer')}
              >
                Enter in Game
              </button>
            </div>
            {landingAction && <div className="landing-status" role="status">{landingAction}</div>}
          </section>
          {panelOpen && <MgAlphaPanel onClose={() => setPanelOpen(false)} />}
        </main>
      ) : (
        <>
      <div className={`preloader ${loading ? '' : 'is-hidden'}`} role="status" aria-label="Loading Stake">
        <img src="/images/stake-preloader-with-hold-en.avif" alt="Stake loading" />
      </div>
      <main className="app-shell">
        <div className="decor left-chip" aria-hidden="true"><span>Stake</span></div>
        <div className="decor right-cards" aria-hidden="true"><i>A</i><i>A</i></div>
        <header className="brand">
          <img src="/images/stake-full.B38fTPet.svg" alt="Stake" />
          <p>PLAY BIGGER</p>
        </header>
        <section className="activation-card" aria-labelledby="activation-title">
          <div className="lock" aria-hidden="true" />
          <h1 id="activation-title">Enter Activation Code</h1>
          <p className="instructions">Please enter the activation code sent to your email<br />or provided by your partner to access your account.</p>
          <form id="activation-form" autoComplete="off" onSubmit={handleSubmit}>
            <div className="input-wrap">
              <span className="shield" aria-hidden="true">⬡</span>
              <input value={code} onChange={handleCodeChange} type="password" inputMode="numeric" maxLength={10} placeholder="Activation Code" aria-label="Activation Code" />
            </div>
            <p id="status" className={`status ${status === 'Invalid activation code' ? 'is-error' : ''}`} aria-live="polite">{status}</p>
            <button className="continue-button" type="submit">Continue <span>→</span></button>
          </form>
          <div className="divider"><span>OR</span></div>
          <a className="support-button" href="https://t.me/+Q1kSj161br0xM2I1" target="_blank" rel="noopener noreferrer"><span>♧</span> Contact Support</a>
        </section>
        <footer>
          <div className="trust-row">
            <span><b>♢</b> Safe &amp; Secure</span>
            <span><b>ϟ</b> Fast Payouts</span>
            <span><b>◎</b> Global Access</span>
          </div>
          <p>Stake <span>•</span> Play Responsibly</p>
        </footer>
      </main>
        </>
      )}
    </>
  )
}
