# The Spending Game

A 60-second interactive game showing where every tax bill goes — and how the share swallowed by **debt interest** has grown over six years.

Pick a country, then watch €100 / £100 / $100 of public spending break down square by square, across 2021 → 2026. Then guess where the debt-interest bill lands in 2030.

**Four countries:** 🇬🇧 UK · 🇺🇸 US · 🇫🇷 France · 🇮🇹 Italy

Vanilla HTML / CSS / JS — no build step, no framework, no dependencies. Each country is a data object; the whole game is one `index.html`, one `app.js`, one `styles.css`.

## Run locally

```bash
python3 -m http.server 8000
```

Then open `http://localhost:8000`. You can deep-link past the country picker with `?country=uk` (or `us`, `france`, `italy`).

## How it works

- A 10×10 grid = 100 units of each country's public spending.
- Tap any square to reveal the breakdown: **Top 6** spending lines, **Debt Interest**, and **Civic** space, each as a share per €100 / £100 / $100 and as an absolute annual total.
- Six rounds (2021–2026) trace the trajectory, then you predict the 2030 debt-interest bill and see it against the official projection.
- Three shareable takeaways close it out.

## Data sources

| Country | Primary sources |
|---|---|
| UK | HMRC Annual Tax Summary · OBR Economic & Fiscal Outlook |
| US | Treasury Combined Statement · CBO Budget & Economic Outlook |
| France | INSEE (COFOG basis) · Banque de France · PLF 2026 |
| Italy | ISTAT National Accounts · MEF DPB · Eurostat COFOG |

Figures cover 2021–2026, with a 2030 projection extrapolated from each country's recent trajectory. Full citations appear in the footer of each country's game.

## Credits

Built by [IP3 Studio](https://ip3.studio) · [X](https://x.com/ip3studio) · [GitHub](https://github.com/IP3-Studio)

## License

See [LICENSE](LICENSE).
