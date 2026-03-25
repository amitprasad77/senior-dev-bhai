# 🍩 Chodu Intern

> AI-powered code roaster that judges your code like a disappointed senior dev who's seen too much.

Paste your garbage. Get brutally roasted by **Lodu Manager** — powered by Groq + Llama 3.3 70B. 6 roast modes. No mercy. No sugarcoating. Pure dev shame. 🔥💀

**Live:** [roast-dev.netlify.app](https://roast-dev.netlify.app)

---

## Features

- 6 roast modes — Hinglish, Desi Uncle, Bihari Bhaiya, Mumbai Tapori, Corporate Lodu, Bengali Dada
- Character-by-character streaming with blinking cursor
- Copy roast + Save as receipt image (with your code as exhibit A)
- Back button to switch modes, Repeat button to re-roast same code
- Stop button to kill streaming mid-way
- Animated button labels that cycle every 2s
- Intro screen with mode selector and staggered animations
- Half-eaten donut SVG logo 🍩

## Tech Stack

| Layer | Tech |
|---|---|
| Frontend | React 18 + Vite 5 |
| Backend | Netlify Functions (serverless) |
| AI | Groq API — `llama-3.3-70b-versatile` |
| Styling | Vanilla CSS, dark theme |
| Image export | html2canvas |

## Roast Modes

| Mode | Persona |
|---|---|
| 🔥 Hinglish | Battle-hardened senior dev, Hindi + English mix |
| 👴 Desi Uncle | Retired govt engineer, full Hindi, hamare zamane energy |
| 🌾 Bihari Bhaiya | Patna senior dev, Bhojpuri-flavoured destruction |
| 😎 Mumbai Tapori | Dharavi bred, street-smart, Marathi words thrown in |
| 💼 Corporate Lodu | Passive aggressive manager, LinkedIn-post English |
| 🎭 Bengali Dada | Intellectual bhadralok, Kolkata references, Tagore-level disappointment |

## Project Structure

```
/
├── src/
│   ├── App.jsx              # main app, streaming, copy/save logic
│   ├── IntroScreen.jsx      # intro splash + mode selector
│   └── index.css            # all styles
├── netlify/
│   └── functions/
│       └── roast-stream.cjs # serverless → Groq API
├── public/
│   ├── favicon.svg
│   ├── og-image.png         # add this — 1200×630px for social previews
│   ├── robots.txt
│   └── sitemap.xml
├── index.html               # SEO meta, OG tags, JSON-LD
├── vite.config.js
├── netlify.toml
└── package.json
```

## Local Setup

```bash
# 1. clone
git clone https://github.com/your-username/chodu-intern.git
cd chodu-intern

# 2. install
npm install

# 3. add your Groq API key (free at console.groq.com)
cp .env.example .env
# edit .env → GROQ_API_KEY=gsk_...

# 4. run (Netlify Dev proxies functions automatically)
npm run dev
# open http://localhost:8888
```

## Deploy to Netlify

1. Push repo to GitHub
2. Go to [netlify.com](https://netlify.com) → New site from Git
3. Build command: `npm run build` — publish dir: `dist` (already in `netlify.toml`)
4. Site Settings → Environment Variables → add `GROQ_API_KEY`
5. Deploy

After deploy, update the canonical URL in `index.html` and `sitemap.xml` with your actual Netlify domain — currently set to `roast-dev.netlify.app`.

## Environment Variables

| Variable | Required | Description |
|---|---|---|
| `GROQ_API_KEY` | Yes | Groq API key — never exposed to frontend |

Get a free key at [console.groq.com](https://console.groq.com)

## After Deploy — SEO Checklist

- [ ] Update canonical URL in `index.html` with your real domain
- [ ] Update `sitemap.xml` with your real domain
- [ ] Add `og-image.png` (1200×630px) to `/public/`
- [ ] Submit sitemap to [Google Search Console](https://search.google.com/search-console)
- [ ] Submit sitemap to [Bing Webmaster Tools](https://www.bing.com/webmasters)

## License

MIT
