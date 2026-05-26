# The Spending Game — Copy Sheet

Edit anything below. Send the file back and I'll port your changes into the app.

**Conventions:**
- Wrap a word or phrase in `*asterisks*` to make it italic UK-red (the campaign accent)
- Wrap a word in `**double asterisks**` for emphasis (currently used for the year in the predict prompt)
- Variables in `{curly braces}` are auto-filled at runtime — leave them in place
- Avoid em-dashes (—); they read as AI. Use periods, commas, or just shorter sentences.
- Palette is Union Jack on white: Top 6 = UK navy, Debt = UK red, Civic = white (with grey border), Else = warm beige. Page background is pure white (no dark mode).

---

## Masthead (top strip on every screen)

- **Title:** The Spending Game
- **Credit:** Logos London Circle (links to https://logos.co/circles)

## Site footer (bottom strip on every screen)

- **Copyright:** © 2026
- **Credit:** Created by IP3 Studio (links to https://x.com/ip3studio)

---

## Cover (animated intro)

The cover is deliberately spare — the question is the hook, the numbers are held back as the conclusion (see Takeaways at the end of this file).

### Headline (very large, top of page)
> Where does every *£100* tax bill go to?

### CTA button
> Follow the journey

---

## Round screens (one per year)

### Common — prompt above the grid
> Tap any square to see how the £100 splits, and what the UK's total bill looks like.

### Common — stat strip labels (below the grid)
- Top 6 column: `Top 6`
- Debt column: `Debt Interest`
- Civic column: `Civic Space`
- Suffix under each big £bn number: `/ £100 tax`

### Common — top-6 list eyebrow
> Top 6 lines · UK total bill ({year})

(`{year}` auto-fills with the current round's year.)

---

### 2021

- **Sublabel** (appears after "Round 1 of 7"): Tax year 2021–22 · HMRC
- **Insight** (one-line narrative below grid): In 2021, the UK paid £73 billion to debt interest (approx. £7.60 of every £100 you pay in tax).
- **Next button:** Take me to 2022

### 2022

- **Sublabel:** Tax year 2022–23 · HMRC
- **Insight:** Inflation hit 11% in autumn 2022. The debt-interest bill jumped £35 billion (across a 12mon period), to £108bn.
- **Next button:** Take me to 2023

### 2023

- **Sublabel:** Tax year 2023–24 · HMRC (interpolated)
- **Insight:** Inflation eased, but the bill kept climbing, reaching £121 billion.
- **Next button:** Take me to 2024

### 2024

- **Sublabel:** Tax year 2024–25 · HMRC (partial)
- **Insight:** £125 billion. More than the UK spends on schools, police, defence, or civic space.
- **Next button:** Take me to 2025

### 2025

- **Sublabel:** OBR projection · 2025–26
- **Insight:** OBR thinks the bill dips a bit, to £110 billion, but the floor sits well above 2021 records.
- **Next button:** Take me to the present

### 2026

- **Sublabel:** OBR projection · 2026–27
- **Insight:** And then it climbs again. £115 billion projected. 58% bigger than 2021 records.
- **Next button:** Make your prediction

---

## Predict screen ("Where will it go next?")

### Eyebrow
> Your turn · OBR forecasts to 2030

### Headline
> Where will the bill go *next?*

### Prompt
> Your guess for the UK's total debt-interest bill in **2030**. Drag, then lock it in.

### Reference cells (three small boxes below the slider)
- Box 1 — year label: `2021`, value: `£73bn`
- Box 2 — year label: `2024 peak`, value: `£125bn`
- Box 3 — year label: `2026 proj`, value: `£115bn`

### Slider end labels
- Left: `£0`
- Middle: `£100bn`
- Right: `£200bn`

### CTA button
> Lock in my guess

---

## End screen

### Eyebrow (above hero number)
> 2030 projection · OBR Nov 2025 EFO

### Caption (below hero £130bn)
> the UK's projected debt interest bill in 2030

### Adaptive comparison line (depends on the user's guess)

`{N}` is replaced with the user's guess in £bn.

- **Within £5bn of OBR (close):** Your guess: £{N}bn. Almost what the OBR thinks.
- **Higher than OBR:** Your guess: £{N}bn. Higher than the OBR forecast. If you're right, this is worse than they're admitting.
- **Lower than OBR:** Your guess: £{N}bn. Lower than the OBR forecast. Most people lowball this.

### Insight paragraph (always shown, below comparison line)
> Five years ago this bill was £73 billion. Now it's £125bn. OBR thinks it'll be £130bn by 2030. Nearly double in one decade alone. Spread across 33 million UK taxpayers, that's about £3,800 each, every year.

### Trajectory chart eyebrow
> UK debt interest, £bn · 2021 → 2030

### Shift card labels (the two-row card showing the change)
- Top row label: `2021 baseline`
- Bottom row label: `2030 projection`

### Shift summary line (under the shift card)
> An extra £{delta} billion a year. A {pct}% jump in {years} years. OBR thinks the bill stays there.

(`{delta}`, `{pct}`, `{years}` are computed from the baseline and 2030 values.)

---

## End-screen forward block (dark block, leads into Takeaways)

### Eyebrow
> One more thing.

### Headline (italic alarm-red on dark)
> The takeaways are sharper still.

### Dek (small grey text below headline)
> Three stats. Each one shareable on its own.

### CTA button
> See the takeaways

### Secondary CTA below the forward block
- Replay button: `Play again`

---

## Takeaways screen (the final conclusion)

This is where the percentages land. Held back from the cover so the player earns them by playing through. Three cards, each shareable on its own.

### Eyebrow
> The takeaways

### Headline
> Now you know where the *£100* goes.

### Prompt
> Three numbers that tell the story. Share whichever one lands hardest.

### Card 1 — Top 6 (UK navy)
- Stat: `79%`
- £-billion line: `£800bn a year`
- Name: Absorbed by 6 departments
- Detail: Health, Welfare, Pensions, Education, Debt Interest, Defence. Almost everything else competes for what's left.
- Share-on-X tweet:

```
79% of every £100 in UK tax is absorbed by just six departments: Health, Welfare, Pensions, Education, Debt Interest, Defence.

About £800bn a year.

{URL}

@Logos_network
```

### Card 2 — Debt Interest (UK red)
- Stat: `12%`
- £-billion line: `£125bn a year`
- Name: Debt interest alone
- Detail: About £3,800 per UK taxpayer, every year. To fund past decisions, not today's needs.
- Share-on-X tweet:

```
12% of every £100 in UK tax goes to debt interest.

£125bn a year. About £3,800 per taxpayer. To fund past decisions, not today's needs.

{URL}

@Logos_network
```

### Card 3 — Civic (white panel)
- Stat: `4%`
- £-billion line: `£40bn a year`
- Name: Reaches civic society
- Detail: Libraries, parks, culture, the environment. Combined. Out of more than a trillion pounds of UK spending.
- Share-on-X tweet:

```
4% of every £100 in UK tax reaches civic society — libraries, parks, culture, the environment. Combined.

About £40bn out of more than a trillion in UK spending.

{URL}

@Logos_network
```

### Secondary CTAs on Takeaways
- Contact us: `Get in touch` (mailto:uk@logos.co)
- Campaign brief link: `Read the UK debt campaign` (disabled until campaign page is live)
- Replay button: `Play again`

### Footnote on Takeaways
> £-billion figures rounded from HMRC Annual Tax Summary (2022–23, 2023–24) and OBR Nov 2025 EFO Total Managed Expenditure projections.

---

## Footnote (small grey strip at the very bottom)
> Sources: HMRC Annual Tax Summary (2021–22, 2022–23, 2024–25 partial). 2023–24 splits interpolated pending HMRC publication. 2025 / 2026 / 2030 figures derived from the OBR Economic and Fiscal Outlook (November 2025) applied to the Annual Tax Summary allocation methodology.

---

## Numeric data (changing these alters figures shown across the app)

These aren't text, but they drive everything. Edit if OBR publishes new forecasts or you spot a number that should be tweaked.

| Year | Debt bill (£bn) | UK Total Managed Expenditure (£bn) | Per £100 of tax |
|---|---|---|---|
| 2021 | 73 | 958 | £7.60 |
| 2022 | 108 | 896 | £12.00 |
| 2023 | 121 | 1026 | £11.80 |
| 2024 | 125 | 1154 | £10.80 |
| 2025 (proj) | 110 | 1158 | £9.50 |
| 2026 (proj) | 115 | 1186 | £9.70 |
| 2030 forecast | 130 | — | £9.50 |

`Per £100 of tax` is the historic Annual Tax Summary allocation. The cover snapshot uses 2023 as the typical recent year.

---

## What I'll do with your edits

When you send this file back:
1. I'll diff against the current version
2. Port each changed text to `index.html` or `app.js` as appropriate
3. Reload the preview and screenshot the affected screens so you can see the result

---

## Deployment & maintenance

Key constants live at the top of `app.js`. Edit and re-deploy:

| Constant | Current value | What it controls |
|---|---|---|
| `CAMPAIGN_URL` | `https://logos.co/ukdebt` | Where the "Read the UK debt campaign" button points |
| `CAMPAIGN_LIVE` | `false` | Toggle to `true` once the campaign page is live — the button auto-activates |
| `PROJECTION_2027` | (unused) | Legacy constant retained for compatibility |
| `FORECAST_YEAR` | `'2030'` | Year the player guesses |
| `FORECAST_BN` | `130` | OBR-implied 2030 bill, £bn. Update when OBR publishes a new EFO. |
| `BASELINE_BN` | `73` | Pre-spike baseline used on the shift card |

Other live-page wiring:
- **Contact email** lives on the "Get in touch" button in `index.html`: `mailto:uk@logos.co`
- **Browser tab title** + **meta description** in `<head>` of `index.html`
- **Fonts** loaded from Google Fonts (Roboto + Roboto Mono)

### Files in the folder

- `index.html` — markup + screen structure
- `styles.css` — Union Jack palette, layout, animations
- `app.js` — data, render logic, predict & end logic
- `copy.md` — this file (not served; just for editing)

When you publish, upload only the first three. `copy.md` stays in the source folder.
