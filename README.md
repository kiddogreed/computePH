# 🧮₱ ComputePH — Calculate Better. Plan Smarter.

A free, fast, installable static web app with everyday financial calculators and a QR code
generator. Built with plain **HTML, CSS (Tailwind via CDN), and vanilla JavaScript**
— no build step, no backend, deploys straight to **GitHub Pages** (and also works if you
just double-click `index.html` locally, since it avoids ES module imports that browsers
block over `file://`).

**Live tools:**
- 💰 Salary Calculator (monthly ⇄ annual ⇄ hourly ⇄ daily + overtime)
- 🏦 Loan Calculator (monthly payment, total interest, year-by-year breakdown)
- 🧑‍💻 Freelance Rate Calculator (hourly/daily rate from income goals)
- 🐖 Savings Goal Calculator (time-to-goal estimator with compound interest)
- 🔳 QR Code Generator (text/URL → downloadable PNG)

## ✨ Features

- Modern card-based, mobile-first, responsive UI (Tailwind CSS)
- Full dark mode support (persisted, respects system preference)
- Multi-currency display: **PHP / USD / EUR**
- Copy-to-clipboard and shareable result links (URL query params rehydrate a calculator)
- Per-tool calculation history saved in `localStorage` (last 5 entries, clearable)
- Installable Progressive Web App (manifest + service worker, offline app shell)
- SEO: meta tags, Open Graph/Twitter cards, JSON-LD (`WebApplication`, `FAQPage`), sitemap, robots.txt
- Accessible: semantic landmarks, skip link, labeled fields, `aria-live` results, focus-visible states
- Reserved AdSense slots, affiliate recommendation boxes, newsletter signup, premium upsell CTA

## 📁 Project structure

```
computePH/
├── index.html              # Single-page app shell, all tool markup, SEO/meta tags
├── styles.css               # Custom component styles layered on Tailwind CDN utilities
├── script.js                # App entry point — wires up all features on load
├── manifest.json            # PWA manifest
├── sw.js                    # Service worker — offline app-shell caching
├── robots.txt
├── sitemap.xml
├── js/
│   ├── utils.js              # formatting, clipboard, toast, debounce helpers
│   ├── storage.js             # localStorage wrapper (preferences + history)
│   ├── theme.js                # dark mode toggle
│   ├── currency.js              # PHP/USD/EUR selection, shared across calculators
│   ├── share.js                  # copy-to-clipboard + shareable link generation
│   ├── pwa.js                     # service worker registration + install prompt
│   ├── qrcode.js                   # QR generator UI (drives the vendored qrcode.js library)
│   ├── vendor/
│   │   └── qrcode.js                # self-hosted QR encoder (davidshimjs/qrcodejs, MIT) — no CDN dependency
│   └── calculators/
│       ├── salary.js
│       ├── loan.js
│       ├── freelance.js
│       └── savings.js
└── assets/
    ├── icons/                # SVG app icons (favicon, standard, maskable)
    └── og-image.svg           # Social share banner (convert to PNG for best compatibility)
```

## 🚀 Deploying to GitHub Pages

1. Push this folder to a GitHub repository (e.g. `computeph.github.io` for a user site, or any repo name for a project site).
2. In the repo, go to **Settings → Pages**, set **Source** to the `main` branch, root folder.
3. Update the canonical/OG URLs in [`index.html`](index.html) and the `Sitemap:` line in [`robots.txt`](robots.txt) to match your actual Pages URL.
4. Wait a minute for the first deploy, then visit `https://<your-username>.github.io/<repo>/`.

No build tools, `npm install`, or server config required — it's plain static files.

### Local development

Just open `index.html` in a browser, or serve the folder locally so the service worker and ES
module imports behave like production:

```bash
npx serve .
# or
python -m http.server 8080
```

## 🔧 Customizing

- **AdSense**: replace the placeholder `<div class="ad-slot">` blocks in `index.html` with your
  AdSense `<ins>` snippet once your account is approved (see placements below).
- **Affiliate links**: swap the `href="#"` placeholders inside each `.affiliate-box` with your
  real affiliate/referral links (keep `rel="sponsored nofollow noopener"`).
- **Newsletter**: `initNewsletter()` in `script.js` currently just shows a confirmation toast —
  point the form at Mailchimp, ConvertKit, Buttondown, or a Google Form endpoint.
- **OG image**: `assets/og-image.svg` is provided as an editable source; export a 1200×630 PNG
  (e.g. via a design tool or `rsvg-convert`) for best compatibility with Facebook/Twitter/LinkedIn
  crawlers, which don't reliably render SVG `og:image` tags.
- **Currency**: the selector changes formatting/symbols only — it does **not** fetch live FX
  rates (no backend, per the project requirements). Wire in a free FX API if live conversion
  between currencies is needed later.
- **QR library**: `js/vendor/qrcode.js` is a vendored copy of [davidshimjs/qrcodejs](https://github.com/davidshimjs/qrcodejs)
  (MIT licensed) included directly in this repo — no CDN or build step needed, and it's cached
  by the service worker for offline use.

## 📈 Monetization & SEO recommendations

### SEO keywords to target
- `salary calculator philippines`, `monthly to annual salary converter`
- `loan calculator philippines`, `car loan calculator`, `housing loan calculator`
- `freelance rate calculator`, `how much should I charge as a freelancer`
- `savings goal calculator`, `emergency fund calculator`
- `free qr code generator`, `qr code generator no sign up`, `qr code maker online free`
- Long-tail: `overtime pay calculator philippines`, `13th month pay calculator`, `hourly rate calculator freelancer philippines`

### AdSense placement
- **Top banner** (728×90 / responsive leaderboard) below the hero — high visibility, low intrusion.
- **Mid-content rectangle** (336×280) between the calculators and the QR generator — sits at a
  natural scroll-pause point after users get a result.
- Avoid ads directly inside forms or results panels (hurts UX and can violate AdSense placement
  policies); keep at least one calculator's height between ad units.
- Consider a sticky mobile anchor ad once traffic justifies it — test against bounce rate first.

### Affiliate programs worth applying to
- **Fintech/remittance**: Wise, Payoneer, Remitly (referral programs for global payments).
- **Digital banks/investing (PH)**: GCash, Maya, CIMB, ING, digital investment apps — many run
  referral/affiliate schemes.
- **Freelance platforms**: Upwork, Fiverr affiliate program, invoicing tools (Wave, Bonsai).
- **Credit/loans**: local loan comparison marketplaces, credit score monitoring services.
- **Printing/QR**: sticker/signage print-on-demand services (Vistaprint, Canva Print) for the
  QR code generator's business-use audience.

### Traffic acquisition strategy
1. **SEO content hub**: add blog-style landing pages ("How to compute 13th month pay", "How
   much loan can I afford") that internally link to the relevant calculator — calculators rank
   well but blog posts capture more long-tail search intent.
2. **Backlinks**: submit to free-tool directories (AlternativeTo, Product Hunt, Slant, personal
   finance subreddits/forums with tool-friendly rules).
3. **Social**: short video demos (TikTok/Reels/Shorts) showing "how much you'd earn" using the
   salary/freelance calculators — utility content performs well organically.
4. **Community seeding**: share in Filipino freelancer/OFW Facebook groups and Reddit communities
   (r/phinvest, r/PersonalFinancePH) where these exact calculators solve real questions.
5. **PWA installs**: the "Install App" prompt encourages repeat visits without relying on search
   traffic each time — improves retention metrics that also help SEO indirectly (return visits,
   session duration).

### Estimated monetization potential
Rough, conservative ballpark for a niche utility site once indexed and getting organic traffic
(actual results vary widely by niche competition, geography, and ad network approval):

| Monthly sessions | Est. AdSense RPM (₱/USD blended) | Est. monthly ad revenue | Notes |
|---:|---:|---:|---|
| 5,000 | $2–4 | $10–20 | Early stage, still building backlinks/authority |
| 25,000 | $3–6 | $75–150 | Consistent SEO content + some backlinks |
| 100,000 | $4–8 | $400–800 | Established authority, good page speed/Core Web Vitals |

Affiliate income is typically **less predictable but higher-value per conversion** (e.g. a single
approved loan or digital bank signup can pay more than thousands of ad impressions) — expect
affiliate revenue to eventually exceed AdSense revenue once a few programs are performing well.
Premium tool upsells (PDF export, ad-free, saved history sync) are a longer-term revenue lever
once there's a returning user base to convert.

## ⚖️ Disclaimer

All calculators provide estimates for general informational purposes only and do not constitute
financial, legal, or tax advice. Some links are affiliate/sponsored links — ComputePH may earn a
commission at no extra cost to you.

## 📄 License

MIT — free to use, modify, and deploy.
