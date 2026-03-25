import { useState, useEffect } from 'react'

const steps = [
  { icon: '📋', text: 'Paste your code into the editor' },
  { icon: '🔥', text: 'Hit the button and pray' },
  { icon: '😭', text: 'Read the roast. Feel the pain.' },
  { icon: '💀', text: 'Cry, refactor, repeat' },
]

const warnings = [
  'Senior Dev Bhai has ZERO chill.',
  'Your code will be judged. Harshly.',
  'No mercy. No sugarcoating.',
  'Not responsible for existential crises.',
]

export const MODES = [
  {
    id: 'hinglish',
    label: '🔥 Hinglish',
    desc: 'Hindi + English mix. Classic savage.',
  },
  {
    id: 'desi_uncle',
    label: '👴 Desi Uncle',
    desc: 'Full Hindi. Disappointed. Very loud.',
  },
  {
    id: 'bihari',
    label: '🌾 Bihari Bhaiya',
    desc: 'Bhojpuri-flavoured destruction.',
  },
  {
    id: 'tapori',
    label: '😎 Mumbai Tapori',
    desc: 'Aye aye aye. Ekdum mast roast.',
  },
  {
    id: 'corporate',
    label: '💼 Corporate Lodu',
    desc: 'Passive aggressive manager energy.',
  },
  {
    id: 'bengali',
    label: '🎭 Bengali Dada',
    desc: 'Intellectual. Dramatic. Devastated.',
  },
]

export default function IntroScreen({ onEnter }) {
  const [mounted, setMounted] = useState(false)
  const [warningIdx, setWarningIdx] = useState(0)
  const [stepsVisible, setStepsVisible] = useState([])
  const [btnReady, setBtnReady] = useState(false)
  const [selectedMode, setSelectedMode] = useState('hinglish')

  useEffect(() => {
    setTimeout(() => setMounted(true), 100)
    steps.forEach((_, i) => {
      setTimeout(() => setStepsVisible(prev => [...prev, i]), 400 + i * 200)
    })
    setTimeout(() => setBtnReady(true), 400 + steps.length * 200 + 200)
    const interval = setInterval(() => {
      setWarningIdx(i => (i + 1) % warnings.length)
    }, 2000)
    return () => clearInterval(interval)
  }, [])

  return (
    <div className={`intro-screen ${mounted ? 'intro-mounted' : ''}`}>
      <div className="intro-card">
        <div className="intro-logo-wrap">
          <IntroDonut />
          <div className="intro-fire">🔥</div>
        </div>

        <h1 className="intro-title">Chodu Intern</h1>
        <p className="intro-subtitle">by Lodu Manager</p>

        <div className="intro-warning-wrap">
          <span className="intro-warning-badge">⚠ WARNING</span>
          <span className="intro-warning-text" key={warningIdx}>
            {warnings[warningIdx]}
          </span>
        </div>

        {/* Mode selector */}
        <div className="mode-section">
          <p className="intro-steps-title">Choose your roast style</p>
          <div className="mode-grid">
            {MODES.map(mode => (
              <button
                key={mode.id}
                className={`mode-card ${selectedMode === mode.id ? 'mode-selected' : ''}`}
                onClick={() => setSelectedMode(mode.id)}
              >
                <span className="mode-label">{mode.label}</span>
                <span className="mode-desc">{mode.desc}</span>
              </button>
            ))}
          </div>
        </div>

        <div className="intro-steps">
          <p className="intro-steps-title">How it works</p>
          {steps.map((step, i) => (
            <div
              key={i}
              className={`intro-step ${stepsVisible.includes(i) ? 'step-visible' : ''}`}
            >
              <span className="step-icon">{step.icon}</span>
              <span className="step-text">{step.text}</span>
            </div>
          ))}
        </div>

        <button
          className={`intro-btn ${btnReady ? 'btn-ready' : ''}`}
          onClick={() => onEnter(selectedMode)}
          disabled={!btnReady}
        >
          I'm Ready to be Destroyed →
        </button>

        <p className="intro-disclaimer">
          Roasts are about code only. No personal attacks. Just pure, unfiltered dev shame.
        </p>
      </div>
    </div>
  )
}

function IntroDonut() {
  return (
    <svg width="80" height="80" viewBox="0 0 56 56" fill="none" xmlns="http://www.w3.org/2000/svg" className="intro-donut-svg">
      <circle cx="28" cy="28" r="22" fill="#2a1a0e" stroke="#c0622a" strokeWidth="2" />
      <circle cx="28" cy="28" r="9" fill="#111" />
      <path d="M6 28 A22 22 0 1 0 46 14 L40 18 A16 16 0 1 1 12 28 Z" fill="#e8855a" opacity="0.9" />
      <rect x="18" y="20" width="4" height="2" rx="1" fill="#f9e04b" transform="rotate(-30 18 20)" />
      <rect x="30" y="32" width="4" height="2" rx="1" fill="#7ed6a0" transform="rotate(20 30 32)" />
      <rect x="22" y="34" width="3" height="2" rx="1" fill="#f97bbd" transform="rotate(-10 22 34)" />
      <rect x="34" y="22" width="3" height="2" rx="1" fill="#7ec8f9" transform="rotate(40 34 22)" />
      <rect x="26" y="16" width="3" height="2" rx="1" fill="#f9a84b" transform="rotate(15 26 16)" />
      <polygon points="44,10 50,6 54,14 50,20 44,16" fill="#111" />
      <circle cx="52" cy="22" r="1.5" fill="#c0622a" opacity="0.7" />
      <circle cx="55" cy="17" r="1" fill="#e8855a" opacity="0.6" />
    </svg>
  )
}
