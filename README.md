# The Spending Game

A 60-second interactive game showing where every £100 of UK tax goes — and how the share to **debt interest** has grown over six years.

Built as a Logos London Circle campaign asset on the UK national debt. Designed in the Union Jack palette. Vanilla HTML / CSS / JS — no build step, no framework, no dependencies.

> **Live:** [https://logos.co/ukdebt](https://logos.co/ukdebt) *(coming soon)*

---

## What's in this repo

```
.
├── index.html      Markup + screen structure (cover → rounds → predict → end → takeaways)
├── styles.css      Union Jack palette, responsive layout, animations
├── app.js          Data, render logic, cascade animation, share handlers
├── copy.md         Editable copy sheet — every text the user sees
├── README.md       This file
├── LICENSE         MIT
└── .gitignore      Standard ignores
```

## Run locally

```bash
git clone https://github.com/roxanneen/the-spending-game.git
cd the-spending-game
python3 -m http.server 8000
```

Then open `http://localhost:8000`.

That's it. No `npm install`, no build, no compilation. Three flat files served from disk.

## Game flow

1. **Cover** — *"Where does every £100 tax bill go to?"* with a question-mark visualisation on a 10×10 grid of Union Jack–coloured squares
2. **Six round screens** — one per year (2021–2026), each cascading the grid into category colours and revealing a stat strip (Top 6 / Debt / Civic)
3. **Predict** — slider for the player's 2030 guess
4. **End** — animated reveal of the OBR-implied 2030 figure (£130bn), trajectory chart, and shift card
5. **Takeaways** — three shareable stat cards (79% top 6, 12% debt, 4% civic) each with its own X share button

## Fork & customise

### Change the headline copy

All user-facing text lives in `copy.md`. Edit the sections you want, then port matching strings into `index.html` and `app.js`. Conventions documented at the top of `copy.md`.

### Change the data

All numeric data is at the top of `app.js`:

```js
const BASELINE_YEAR = '2021';
const BASELINE_BN   = 73;       // £bn — 2021 debt-interest bill
const FORECAST_YEAR = '2030';
const FORECAST_BN   = 130;      // £bn — 2030 OBR-implied
const CAMPAIGN_URL  = 'https://logos.co/ukdebt';
const CAMPAIGN_LIVE = false;    // flip to true once campaign page is live
```

The per-year breakdown is in the `YEARS` array further down. Each year has:

- `debtBillBn` — absolute £bn for debt interest
- `tmeBn` — UK Total Managed Expenditure that year (£bn)
- `categories` — array of `{ name, share, group }` summing to 100%

To adapt this to **another country's tax data**, swap the `YEARS` array entirely. Keep the four group names (`major`, `debt`, `civic`, `other`, `unknown`) and the math + colours work unchanged.

### Change the colours

Top of `styles.css`:

```css
:root {
  --alarm:        #C8102E;   /* UK flag red — debt + accents */
  --major-blue:   #012169;   /* UK flag blue — top 6 lines */
  --civic-white:  #FFFFFF;   /* white panels — civic society */
  --gray-light:   #C0BAAB;   /* everything else */
}
```

Replace with another country's flag palette to retheme.

## Deploy

Static files. Drop the folder onto any of:

| Host | Best for |
|---|---|
| [Netlify Drop](https://app.netlify.com/drop) | Instant testing — drag the folder, get a URL in seconds |
| [GitHub Pages](https://pages.github.com/) | Long-term hosting, version-controlled, free custom domain |
| [Cloudflare Pages](https://pages.cloudflare.com/) | Same as GitHub Pages but fastest CDN |
| [Vercel](https://vercel.com/) | If you already use it |

For a custom domain (e.g. `ukdebt.example.com`), add a CNAME record in your DNS pointing at the host, then add the custom domain in the host's dashboard. HTTPS is auto-provisioned.

## Data sources

All figures cite published government data — no original analysis is performed in the app, only allocation and visualisation.

- **HMRC Annual Tax Summary methodology** — [gov.uk → How public spending was calculated in your tax summary](https://www.gov.uk/government/publications/how-public-spending-was-calculated-in-your-tax-summary)
- **HMRC personal tax summary tool** — [tax.service.gov.uk/annual-tax-summary/](https://www.tax.service.gov.uk/annual-tax-summary/) (requires HMRC login)
- **OBR Economic and Fiscal Outlook (November 2025)** — [obr.uk/efo/economic-and-fiscal-outlook-november-2025/](https://obr.uk/efo/economic-and-fiscal-outlook-november-2025/)
- **OBR detailed forecast tables (XLSX)** — [obr.uk/data/](https://obr.uk/data/)
- **UK Public Expenditure Statistical Analyses (PESA)** — [gov.uk PESA collection](https://www.gov.uk/government/collections/public-expenditure-statistical-analyses-pesa)

No public REST APIs exist for these data; they're published as PDFs and supplementary XLSX/CSV files. To get raw numbers for your own visualisation, download the OBR data tables and the latest PESA spreadsheet.

## Tech notes

- **No framework, no build step.** Everything is vanilla.
- **One CSS file, one JS file.** Both single-source-of-truth.
- **CSS variables** drive the palette — re-theme by changing six values.
- **Roboto + Roboto Mono** from Google Fonts.
- **Responsive** — mobile-first, desktop layouts kick in at `min-width: 720px`.
- **No analytics, no cookies, no localStorage** by default. The game is fully ephemeral.
- **`prefers-reduced-motion`** respected — cascade animations skip for users who've opted out.

## Credits

- **Concept & campaign:** [Logos London Circle](https://logos.co/circles)
- **Design & build:** [IP3 Studio](https://x.com/ip3studio)
- **Data:** HMRC, OBR (Office for Budget Responsibility)

## License

MIT. See `LICENSE`. You can fork, modify, and redistribute freely. Attribution appreciated but not required.
