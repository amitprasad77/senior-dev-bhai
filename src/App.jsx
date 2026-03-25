import { useState, useEffect, useRef } from 'react'
import html2canvas from 'html2canvas'
import IntroScreen, { MODES } from './IntroScreen'

const btnLabels = [
  "🔥 Teri Waaat Lagao",
  "💀 Barbad Kar Code Ko",
  "🤡 Dikhao Aukat",
  "😤 Senior Dev Ko Bulao",
  "🧨 Code Blast Karo",
  "🪓 Coding Career Khatam Karo",
  "💩 Ye Kya Likha Hai Bhai",
  "🤮 Dekh Ke Ulti Aa Rahi Hai",
  "☠️ RIP Tera Logic",
  "🫵 Sharam Karo Thodi",
]

const stickers = ['🤡','💩','☠️','🪓','😤','🤮','💀','🫵','🧨','😭','🤦','👎','🗑️','🔥','😂']
const adultStickers = ['🍆','🍑','💦','🌶️','🫦','🍌','🥵','😈','🍒','🫀','🌮','🍗','🎷','🪄','🍭','🧃','🫸','🍾','🎉','🥒']

function randomSticker() {
  const pool = [...stickers, ...adultStickers]
  return pool[Math.floor(Math.random() * pool.length)]
}

function injectStickers(text) {
  return text.replace(/([.!?।]+\s)/g, (match) => {
    if (Math.random() > 0.45) return match
    return match + randomSticker() + ' '
  })
}

export default function App() {
  const [showIntro, setShowIntro] = useState(true)
  const [mode, setMode] = useState('hinglish')
  const [code, setCode] = useState('')
  const [roast, setRoast] = useState('')
  const [displayRoast, setDisplayRoast] = useState('')
  const [streaming, setStreaming] = useState(false)
  const [error, setError] = useState('')
  const [visible, setVisible] = useState(false)
  const [btnLabel, setBtnLabel] = useState(btnLabels[0])
  const [btnAnim, setBtnAnim] = useState(false)
  const [copied, setCopied] = useState(false)
  const [saving, setSaving] = useState(false)
  const outputRef = useRef(null)
  const receiptRef = useRef(null)
  const btnInterval = useRef(null)
  const streamInterval = useRef(null)
  const floaterInterval = useRef(null)

  const modeInfo = MODES.find(m => m.id === mode) || MODES[0]

  useEffect(() => {
    if (!showIntro) setTimeout(() => setVisible(true), 50)
  }, [showIntro])

  useEffect(() => {
    if (streaming) return
    let idx = 0
    btnInterval.current = setInterval(() => {
      idx = (idx + 1) % btnLabels.length
      setBtnAnim(true)
      setTimeout(() => { setBtnLabel(btnLabels[idx]); setBtnAnim(false) }, 200)
    }, 2200)
    return () => clearInterval(btnInterval.current)
  }, [streaming])

  useEffect(() => {
    if (outputRef.current) outputRef.current.scrollTop = outputRef.current.scrollHeight
  }, [displayRoast])

  const stopStreaming = () => {
    clearInterval(streamInterval.current)
    clearInterval(floaterInterval.current)
    setStreaming(false)
  }

  const handleRoast = async () => {
    if (!code.trim() || streaming) return
    setStreaming(true)
    setRoast('')
    setDisplayRoast('')
    setError('')
    setCopied(false)

    try {
      const res = await fetch('/api/roast-stream', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ code, mode }),
      })

      const data = await res.json()
      if (!res.ok) throw new Error(data.error || 'Something went wrong')

      const text = injectStickers(data.roast)
      setRoast(text)
      let i = 0

      streamInterval.current = setInterval(() => {
        if (i < text.length) {
          setDisplayRoast(text.slice(0, i + 1))
          i++
        } else {
          clearInterval(streamInterval.current)
          clearInterval(floaterInterval.current)
          setStreaming(false)
        }
      }, 35)
    } catch (err) {
      setError(err.message)
      setStreaming(false)
    }
  }

  const handleCopy = () => {
    navigator.clipboard.writeText(roast).then(() => {
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    })
  }

  const handleSaveImage = async () => {
    if (!receiptRef.current) return
    setSaving(true)
    try {
      const canvas = await html2canvas(receiptRef.current, {
        backgroundColor: '#111',
        scale: 2,
        useCORS: true,
        padding: 24,
      })
      const link = document.createElement('a')
      link.download = 'lodu-manager-roast.png'
      link.href = canvas.toDataURL('image/png')
      link.click()
    } catch (e) {
      console.error(e)
    }
    setSaving(false)
  }

  const isDone = !streaming && (roast || displayRoast) && !error
  // short preview of code for receipt (first 3 lines, max 120 chars)
  const codePreview = code.split('\n').slice(0, 3).join('\n').slice(0, 120)

  if (showIntro) return <IntroScreen onEnter={(m) => { setMode(m); setShowIntro(false) }} />

  return (
    <div className={`container ${visible ? 'fade-in' : ''}`}>
      <header>
        <div className="logo-wrap"><DonutLogo /></div>
        <h1>Chodu Intern</h1>
        <p>Paste your code. Brace yourself.</p>
      </header>

      <div className="editor-wrap">
        <div className="editor-bar">
          <span className="dot red" />
          <span className="dot yellow" />
          <span className="dot green" />
          <span className="editor-label">paste-your-garbage.js</span>
        </div>
        <textarea
          className="code-input"
          placeholder="// paste your code here..."
          value={code}
          onChange={e => setCode(e.target.value)}
          spellCheck={false}
        />
      </div>

      <div className="btn-row">
        <button
          className={`roast-btn ${streaming ? 'loading' : ''}`}
          onClick={handleRoast}
          disabled={streaming || !code.trim()}
        >
          {streaming ? (
            <span className="btn-inner"><span className="spinner" /> Teri Waaat Lag Rahi Hai...</span>
          ) : (
            <span className={`btn-inner btn-label ${btnAnim ? 'btn-label-exit' : 'btn-label-enter'}`}>
              {btnLabel}
            </span>
          )}
        </button>
        {streaming && (
          <button className="stop-btn" onClick={stopStreaming} title="Stop">
            ⏹
          </button>
        )}
      </div>

      {(displayRoast || error || streaming) && (
        <div className={`output-box ${error ? 'error' : ''} ${streaming && !displayRoast ? 'pulse' : ''}`}>
          <div className="output-label">
            {error ? '⚠ Error' : `${modeInfo.label}`}
            {streaming && <span className="live-badge">LIVE</span>}
          </div>

          {/* receipt card — captured as image */}
          <div className="receipt-card" ref={receiptRef}>
            <div className="receipt-header">
              <span className="receipt-logo">🍩</span>
              <div>
                <div className="receipt-title">{modeInfo.label.toUpperCase()}</div>
                <div className="receipt-sub">Official Code Review Receipt</div>
              </div>
            </div>
            <div className="receipt-divider">- - - - - - - - - - - - - - - - - - - -</div>
            {codePreview && (
              <div className="receipt-code-preview">
                <div className="receipt-code-label">YOUR CODE (exhibit A):</div>
                <pre className="receipt-code-snippet">{codePreview}{code.length > 120 ? '\n...' : ''}</pre>
              </div>
            )}
            <div className="receipt-divider">- - - - - - - - - - - - - - - - - - - -</div>
            <div className="output-text" ref={outputRef}>
              {error || displayRoast}
              {streaming && <span className="cursor-blink">▌</span>}
            </div>
            <div className="receipt-divider">- - - - - - - - - - - - - - - - - - - -</div>
            <div className="receipt-footer">
              <span>chodu-intern.netlify.app</span>
              <span>verdict: 💀 SKILL ISSUE</span>
            </div>
          </div>

          {isDone && (
            <div className="action-row">
              <button className="action-btn" onClick={handleCopy}>
                {copied ? '✅ Copied!' : '📋 Copy Roast'}
              </button>
              <button className="action-btn action-btn-primary" onClick={handleSaveImage} disabled={saving}>
                {saving ? 'Saving...' : '🖼️ Save as Image'}
              </button>
            </div>
          )}
          {isDone && (
            <div className="action-row action-row-secondary">
              <button className="action-btn" onClick={() => { setShowIntro(true); setRoast(''); setDisplayRoast(''); setError('') }}>
                ← Back
              </button>
              <button className="action-btn" onClick={() => { setRoast(''); setDisplayRoast(''); setError(''); setTimeout(handleRoast, 0) }}>
                🔁 Repeat
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  )
}

function DonutLogo() {
  return (
    <svg width="56" height="56" viewBox="0 0 56 56" fill="none" xmlns="http://www.w3.org/2000/svg" className="donut-logo">
      <circle cx="28" cy="28" r="22" fill="#2a1a0e" stroke="#c0622a" strokeWidth="2" />
      <circle cx="28" cy="28" r="9" fill="#0d0d0d" />
      <path d="M6 28 A22 22 0 1 0 46 14 L40 18 A16 16 0 1 1 12 28 Z" fill="#e8855a" opacity="0.9" />
      <rect x="18" y="20" width="4" height="2" rx="1" fill="#f9e04b" transform="rotate(-30 18 20)" />
      <rect x="30" y="32" width="4" height="2" rx="1" fill="#7ed6a0" transform="rotate(20 30 32)" />
      <rect x="22" y="34" width="3" height="2" rx="1" fill="#f97bbd" transform="rotate(-10 22 34)" />
      <rect x="34" y="22" width="3" height="2" rx="1" fill="#7ec8f9" transform="rotate(40 34 22)" />
      <rect x="26" y="16" width="3" height="2" rx="1" fill="#f9a84b" transform="rotate(15 26 16)" />
      <polygon points="44,10 50,6 54,14 50,20 44,16" fill="#0d0d0d" />
      <circle cx="52" cy="22" r="1.5" fill="#c0622a" opacity="0.7" />
      <circle cx="55" cy="17" r="1" fill="#e8855a" opacity="0.6" />
      <circle cx="49" cy="25" r="1" fill="#c0622a" opacity="0.5" />
    </svg>
  )
}
