/* ============================================================
   The Spending Game, unified app.js (6 countries, data-driven)
   Vanilla JS, no build step. Open index.html in a browser.
   ============================================================ */

(() => {
  'use strict';

  // =========================================================
  // COUNTRY CONFIGS
  // Each country's data, copy, palette, and tweets live here.
  // The game logic below reads from state.country (current pick).
  // =========================================================

  const COUNTRIES = {

    // ---------------- UK ----------------
    uk: {
      id: 'uk',
      name: 'United Kingdom',
      flag: '🇬🇧',
      paletteName: 'Union Jack',
      palette: {
        alarm: '#C8102E', alarmSoft: '#FBE5E8', alarmDeep: '#6E0917',
        major: '#012169', majorSoft: '#E1E5F2',
        civic: '#FFFFFF', grayLight: '#C0BAAB',
        ringRgba: 'rgba(200, 16, 46',
      },
      currency: { symbol: '£', perUnit: 100, perUnitLabel: '£100', perUnitUsd: null },
      scale: { unit: 'bn', decimals: 0 },
      usdRate: null,
      logos: {
        contactEmail: 'uk@logos.co',
        campaignUrl: 'https://logos.co/ukdebt',
        campaignLive: true,
        campaignHidden: false,
        campaignLabel: 'Logos UK #comingsoon',
        campaignLabelLive: 'Read the UK debt campaign',
      },
      framingPhrase: 'tax bill',
      coverHeadlineUnit: '£100',
      totalLabel: 'UK total',
      baseline: { year: '2021', bn: 73, per100: 7.6 },
      forecast: { year: '2030', bn: 130, per100: 9.5 },
      tolerance: 5,
      coverBgCounts: { major: 80, civic: 4, other: 7 },
      round: {
        prompt: "Tap any square to see how the £100 splits, and what the UK's total bill looks like.",
        gridAria: '100 squares representing £100 of UK tax',
        statLabels: { top6: 'Top 6', debt: 'Debt Interest', civic: 'Civic Space' },
        statSubSuffix: 'bn UK total',
        top5Eyebrow: 'Top 6 lines · per £100 of tax',
        top5EyebrowYear: 'Top 6 lines · UK total bill ({year})',
      },
      predict: {
        eyebrow: 'Your turn · OBR forecasts to 2030',
        prompt: "Your guess for the UK's total debt-interest bill in <strong>2030</strong>. Drag, then lock it in.",
        slider: { min: 0, max: 200, step: 5 },
        sliderMarks: ['£0', '£100bn', '£200bn'],
        sliderAria: 'Your guess for the 2030 UK debt-interest bill, in pounds billion',
        unitLabel: 'bn',
        references: [
          { year: '2021', val: '£73bn' },
          { year: '2024 peak', val: '£125bn' },
          { year: '2026 proj', val: '£115bn' },
        ],
      },
      end: {
        eyebrow: '2030 projection · OBR Nov 2025 EFO',
        caption: "the UK's projected debt interest bill in 2030",
        insight: "Five years ago this bill was £73 billion. Now it's £125bn. OBR thinks it'll be £130bn by 2030. Nearly double in one decade alone. Spread across 33 million UK taxpayers, that's about £3,800 each, every year.",
        trajectoryEyebrow: 'UK debt interest, £bn · 2021 → 2030',
        unitLabel: 'bn',
        footnote: 'Sources: HMRC Annual Tax Summary (2021–22, 2022–23, 2024–25 partial). 2023–24 splits interpolated pending HMRC publication. 2025 / 2026 / 2030 figures derived from the OBR Economic and Fiscal Outlook (November 2025) applied to the Annual Tax Summary allocation methodology.',
        comparison: {
          close: "Your guess: {guess}{usd}. Almost what the OBR thinks.",
          higher: "Your guess: {guess}{usd}. Higher than the OBR forecast. If you're right, this is worse than they're admitting.",
          lower: "Your guess: {guess}{usd}. Lower than the OBR forecast. Most people lowball this.",
        },
        shiftSummary: "An extra {delta} a year. A {pct}% jump in {years} years. OBR thinks the bill stays there.",
      },
      takeaways: {
        headline: 'Now you know where the <em>£100</em> goes.',
        footnote: '£-billion figures rounded from HMRC Annual Tax Summary (2022–23, 2023–24) and OBR Nov 2025 EFO Total Managed Expenditure projections.',
        cards: {
          major: { pct: '79', bn: '£800bn a year', name: 'Absorbed by 6 departments', detail: 'Health, Welfare, Pensions, Education, Debt Interest, Defence. Almost everything else competes for what\'s left.' },
          debt: { pct: '12', bn: '£125bn a year', name: 'Debt interest alone', detail: 'About £3,800 per UK taxpayer, every year. To fund past decisions, not today\'s needs.' },
          civic: { pct: '4', bn: '£40bn a year', name: 'Reaches civic society', detail: 'Libraries, parks, culture, the environment. Combined. Out of more than a trillion pounds of UK spending.' },
        },
      },
      sources: [
        { label: 'HMRC Annual Tax Summary', url: 'https://www.gov.uk/government/publications/how-public-spending-was-calculated-in-your-tax-summary' },
        { label: 'OBR EFO Nov 2025', url: 'https://obr.uk/efo/economic-and-fiscal-outlook-november-2025/' },
        { label: 'UK PESA', url: 'https://www.gov.uk/government/collections/public-expenditure-statistical-analyses-pesa' },
      ],
      tweets: {
        main: "UK debt interest was £73bn five years ago.\nIt's £125bn now.\nOBR thinks £130bn by 2030.\n\nAbout £3,800 per taxpayer, every year. For a line nobody campaigns on.",
        major: "79% of every £100 in UK tax is absorbed by just six departments: Health, Welfare, Pensions, Education, Debt Interest, Defence.\n\nAbout £800bn a year.",
        debt: "12% of every £100 in UK tax goes to debt interest.\n\n£125bn a year. About £3,800 per taxpayer. To fund past decisions, not today's needs.",
        civic: "4% of every £100 in UK tax reaches civic society: libraries, parks, culture and the environment, combined.\n\nAbout £40bn out of more than a trillion in UK spending.",
      },
      shortNameMap: {
        'National Debt Interest': 'Debt Interest',
        'Government Administration': 'Govt. Admin.',
        'Public Order and Safety': 'Public Order',
        'Housing and Utilities': 'Housing',
      },
      defaultGuess: 115,
      years: [
        { id: '2021', label: '2021', sublabel: 'Tax year 2021–22 · HMRC', debtValue: 7.6, debtBillBn: 73, tmeBn: 958, insight: 'In 2021, the UK paid £73 billion to debt interest (approx. £7.60 of every £100 you pay in tax).', nextCta: 'Take me to 2022', categories: [
          { name: 'Health', share: 22.8, group: 'major' },
          { name: 'Welfare', share: 20.4, group: 'major' },
          { name: 'State Pensions', share: 11.0, group: 'major' },
          { name: 'Education', share: 10.5, group: 'major' },
          { name: 'National Debt Interest', share: 7.6, group: 'debt' },
          { name: 'Business and Industry', share: 5.4, group: 'other' },
          { name: 'Defence', share: 5.1, group: 'other' },
          { name: 'Transport', share: 4.7, group: 'other' },
          { name: 'Public Order and Safety', share: 4.4, group: 'other' },
          { name: 'Government Administration', share: 2.3, group: 'other' },
          { name: 'Housing and Utilities', share: 1.6, group: 'civic' },
          { name: 'Environment', share: 1.5, group: 'civic' },
          { name: 'Culture', share: 1.3, group: 'civic' },
          { name: 'EU Payments', share: 0.7, group: 'other' },
          { name: 'Overseas Aid', share: 0.6, group: 'other' },
        ]},
        { id: '2022', label: '2022', sublabel: 'Tax year 2022–23 · HMRC', debtValue: 12.0, debtBillBn: 108, tmeBn: 896, insight: 'Inflation hit 11% in autumn 2022. The debt-interest bill jumped £35 billion (across a 12mon period), to £108bn.', nextCta: 'Take me to 2023', categories: [
          { name: 'Health', share: 19.8, group: 'major' },
          { name: 'Welfare', share: 19.6, group: 'major' },
          { name: 'National Debt Interest', share: 12.0, group: 'debt' },
          { name: 'State Pensions', share: 10.3, group: 'major' },
          { name: 'Education', share: 9.9, group: 'major' },
          { name: 'Business and Industry', share: 7.6, group: 'other' },
          { name: 'Defence', share: 5.2, group: 'other' },
          { name: 'Public Order and Safety', share: 4.1, group: 'other' },
          { name: 'Transport', share: 4.1, group: 'other' },
          { name: 'Government Administration', share: 2.0, group: 'other' },
          { name: 'Housing and Utilities', share: 1.7, group: 'civic' },
          { name: 'Culture', share: 1.3, group: 'civic' },
          { name: 'Environment', share: 1.3, group: 'civic' },
          { name: 'EU Payments', share: 0.6, group: 'other' },
          { name: 'Overseas Aid', share: 0.5, group: 'other' },
        ]},
        { id: '2023', label: '2023', sublabel: 'Tax year 2023–24 · HMRC (interpolated)', debtValue: 11.8, debtBillBn: 121, tmeBn: 1026, insight: 'Inflation eased, but the bill kept climbing, reaching £121 billion.', nextCta: 'Take me to 2024', categories: [
          { name: 'Health', share: 20.5, group: 'major' },
          { name: 'Welfare', share: 20.5, group: 'major' },
          { name: 'National Debt Interest', share: 11.8, group: 'debt' },
          { name: 'State Pensions', share: 11.1, group: 'major' },
          { name: 'Education', share: 10.1, group: 'major' },
          { name: 'Defence', share: 5.4, group: 'other' },
          { name: 'Business and Industry', share: 5.0, group: 'other' },
          { name: 'Public Order and Safety', share: 4.1, group: 'other' },
          { name: 'Transport', share: 4.0, group: 'other' },
          { name: 'Government Administration', share: 2.1, group: 'other' },
          { name: 'Housing and Utilities', share: 1.7, group: 'civic' },
          { name: 'Culture', share: 1.3, group: 'civic' },
          { name: 'Environment', share: 1.3, group: 'civic' },
          { name: 'EU Payments', share: 0.6, group: 'other' },
          { name: 'Overseas Aid', share: 0.5, group: 'other' },
        ]},
        { id: '2024', label: '2024', sublabel: 'Tax year 2024–25 · HMRC (partial)', debtValue: 10.8, debtBillBn: 125, tmeBn: 1154, insight: '£125 billion. More than the UK spends on schools, police, defence, or civic space.', nextCta: 'Take me to 2025', categories: [
          { name: 'Welfare', share: 21.3, group: 'major' },
          { name: 'Health', share: 20.9, group: 'major' },
          { name: 'State Pensions', share: 11.9, group: 'major' },
          { name: 'National Debt Interest', share: 10.8, group: 'debt' },
          { name: 'Education', share: 10.3, group: 'major' },
          { name: 'Defence', share: 5.5, group: 'other' },
          { name: 'Housing and Utilities', share: 1.7, group: 'civic' },
          { name: 'Culture', share: 1.3, group: 'civic' },
          { name: 'Environment', share: 1.3, group: 'civic' },
          { name: 'Other (not yet published)', share: 15.0, group: 'unknown' },
        ]},
        { id: '2025', label: '2025', sublabel: 'OBR projection · 2025–26', debtValue: 9.5, debtBillBn: 110, tmeBn: 1158, isProjection: true, insight: 'OBR thinks the bill dips a bit, to £110 billion, but the floor sits well above 2021 records.', nextCta: 'Take me to the present', categories: [
          { name: 'Welfare', share: 21.5, group: 'major' },
          { name: 'Health', share: 21.4, group: 'major' },
          { name: 'State Pensions', share: 12.3, group: 'major' },
          { name: 'Education', share: 10.3, group: 'major' },
          { name: 'National Debt Interest', share: 9.5, group: 'debt' },
          { name: 'Defence', share: 5.5, group: 'other' },
          { name: 'Housing and Utilities', share: 1.7, group: 'civic' },
          { name: 'Culture', share: 1.3, group: 'civic' },
          { name: 'Environment', share: 1.3, group: 'civic' },
          { name: 'Other (OBR projection)', share: 15.2, group: 'unknown' },
        ]},
        { id: '2026', label: '2026', sublabel: 'OBR projection · 2026–27', debtValue: 9.7, debtBillBn: 115, tmeBn: 1186, isProjection: true, insight: 'And then it climbs again. £115 billion projected. 58% bigger than 2021 records.', nextCta: 'Make your prediction', categories: [
          { name: 'Welfare', share: 21.5, group: 'major' },
          { name: 'Health', share: 21.3, group: 'major' },
          { name: 'State Pensions', share: 12.5, group: 'major' },
          { name: 'Education', share: 10.3, group: 'major' },
          { name: 'National Debt Interest', share: 9.7, group: 'debt' },
          { name: 'Defence', share: 5.7, group: 'other' },
          { name: 'Housing and Utilities', share: 1.7, group: 'civic' },
          { name: 'Culture', share: 1.3, group: 'civic' },
          { name: 'Environment', share: 1.3, group: 'civic' },
          { name: 'Other (OBR projection)', share: 14.7, group: 'unknown' },
        ]},
      ],
    },

    // ---------------- US ----------------
    us: {
      id: 'us',
      name: 'United States',
      flag: '🇺🇸',
      paletteName: 'Stars and Stripes',
      palette: {
        alarm: '#B22234', alarmSoft: '#FBE3E6', alarmDeep: '#6E0E18',
        major: '#3C3B6E', majorSoft: '#E5E5EF',
        civic: '#FFFFFF', grayLight: '#8B9DC3',
        ringRgba: 'rgba(178, 34, 52',
      },
      currency: { symbol: '$', perUnit: 100, perUnitLabel: '$100', perUnitUsd: null },
      scale: { unit: 'bn', decimals: 0 },
      usdRate: null,
      logos: {
        contactEmail: 'us@logos.co',
        campaignUrl: 'https://logos.co/usdebt',
        campaignLive: false,
        campaignHidden: false,
        campaignLabel: 'Logos US #comingsoon',
      },
      framingPhrase: 'tax bill',
      coverHeadlineUnit: '$100',
      totalLabel: 'US total',
      baseline: { year: '2021', bn: 352, per100: 5.2 },
      forecast: { year: '2030', bn: 1400, per100: 17.0 },
      tolerance: 50,
      coverBgCounts: { major: 73, civic: 0, other: 18 },
      round: {
        prompt: "Tap any square to see how the $100 splits, and what the US total bill looks like.",
        gridAria: '100 squares representing $100 of US federal tax',
        statLabels: { top6: 'Top 6', debt: 'Net Interest', civic: 'Civic' },
        statSubSuffix: 'bn US total',
        top5Eyebrow: 'Top 6 lines · per $100 of tax',
        top5EyebrowYear: 'Top 6 lines · US total bill ({year})',
      },
      predict: {
        eyebrow: 'Your turn · CBO forecasts to 2030',
        prompt: "Your guess for the US net interest bill in <strong>2030</strong>. Drag, then lock it in.",
        slider: { min: 0, max: 2000, step: 50 },
        sliderMarks: ['$0', '$1tn', '$2tn'],
        sliderAria: 'Your guess for the 2030 US net interest bill, in dollars billion',
        unitLabel: 'bn',
        references: [
          { year: '2021', val: '$352bn' },
          { year: '2024', val: '$882bn' },
          { year: '2025 peak', val: '$1,029bn' },
        ],
      },
      end: {
        eyebrow: '2030 projection · CBO Feb 2026 baseline',
        caption: "the US's projected net interest bill in 2030",
        insight: "Five years ago this bill was $352 billion. Now it's $1 trillion. CBO thinks it'll be $1.4 trillion by 2030. Nearly 4× in a decade. Spread across 165 million US taxpayers, that's about $8,500 each, every year.",
        trajectoryEyebrow: 'US net interest, $bn · 2021 → 2030',
        unitLabel: 'bn',
        footnote: 'Sources: Treasury Combined Statement (FY2021–FY2025) for total outlays and net-interest splits, CBO Monthly Budget Review and Feb 2026 Budget and Economic Outlook for projections through 2030. Civic aggregate constructed from EPA, NPS, Smithsonian, NEA, NEH and IMLS budget lines.',
        comparison: {
          close: "Your guess: {guess}{usd}. Almost what CBO thinks.",
          higher: "Your guess: {guess}{usd}. Higher than the CBO forecast. If you're right, the squeeze is worse than they're admitting.",
          lower: "Your guess: {guess}{usd}. Lower than the CBO forecast. Most people lowball this.",
        },
        shiftSummary: "An extra {delta} a year. A {pct}% jump in {years} years. CBO thinks the bill keeps climbing.",
      },
      takeaways: {
        headline: 'Now you know where the <em>$100</em> goes.',
        footnote: '$-billion figures rounded from Treasury Combined Statement (FY2021–FY2025) and CBO Feb 2026 baseline.',
        cards: {
          major: { pct: '86', bn: '$5.8T a year', name: 'Absorbed by 6 federal lines', detail: 'Social Security, Health, Defense, Net Interest, Income Security, Veterans. Everything else competes for what\'s left.' },
          debt: { pct: '13', bn: '$1T a year', name: 'Net interest alone', detail: 'More than the Pentagon. More than Medicare. About $8,500 per US taxpayer.' },
          civic: { pct: '24¢', bn: '$16bn a year', name: 'Reaches civic society', detail: 'EPA, parks, Smithsonian, arts and libraries combined. Less than a quarter on every $100.', pctCustom: true },
        },
      },
      sources: [
        { label: 'CBO Monthly Budget Review', url: 'https://www.cbo.gov/publication/61307' },
        { label: 'Treasury Fiscal Data', url: 'https://fiscaldata.treasury.gov/' },
        { label: 'OMB Historical Tables', url: 'https://www.whitehouse.gov/omb/budget/historical-tables/' },
      ],
      tweets: {
        main: "US federal net interest was $352bn in 2021. It's $1 trillion now. CBO projects $1.4 trillion by 2030.\n\nNearly 4× in a decade. For a line nobody campaigns on.",
        major: "86% of every $100 in US federal tax goes to just six lines: Social Security, Health, Defense, Net Interest, Income Security, Veterans.\n\nAbout $5.8T a year.",
        debt: "13% of every $100 in US federal tax goes to net interest. $1 trillion a year. More than the Pentagon. More than Medicare.",
        civic: "24¢ of every $100 in US federal tax reaches civic society: EPA, parks, Smithsonian, arts and libraries combined.\n\nAbout $16bn out of $6.8 trillion in federal spending.",
      },
      shortNameMap: {
        'National Defense': 'Defense',
        'Veterans Affairs': 'Veterans',
        'Civic (EPA, NPS, arts)': 'Civic',
        'Other government': 'Other',
      },
      defaultGuess: 1200,
      years: [
        { id: '2021', label: '2021', sublabel: 'FY2021 · Treasury / CBO', debtValue: 5.2, debtBillBn: 352, tmeBn: 6818, insight: 'FY2021 saw $6.8 trillion in federal spending, inflated by COVID relief. Net interest was a relatively low $352bn (5.2¢ of every $100).', nextCta: 'Take me to 2022', categories: [
          { name: 'Income Security', share: 24.0, group: 'major' },
          { name: 'Social Security', share: 18.0, group: 'major' },
          { name: 'Health', share: 14.0, group: 'major' },
          { name: 'National Defense', share: 11.0, group: 'major' },
          { name: 'Net Interest', share: 5.2, group: 'debt' },
          { name: 'Veterans Affairs', share: 4.0, group: 'major' },
          { name: 'Civic (EPA, NPS, arts)', share: 0.2, group: 'civic' },
          { name: 'Other government', share: 23.6, group: 'other' },
        ]},
        { id: '2022', label: '2022', sublabel: 'FY2022 · Treasury / CBO', debtValue: 7.6, debtBillBn: 476, tmeBn: 6273, insight: 'Net interest jumped $124 billion in one year, to $476bn. The Fed hikes rates aggressively to fight inflation.', nextCta: 'Take me to 2023', categories: [
          { name: 'Social Security', share: 19.6, group: 'major' },
          { name: 'Health', share: 17.8, group: 'major' },
          { name: 'National Defense', share: 12.7, group: 'major' },
          { name: 'Income Security', share: 10.7, group: 'major' },
          { name: 'Net Interest', share: 7.6, group: 'debt' },
          { name: 'Veterans Affairs', share: 4.8, group: 'major' },
          { name: 'Civic (EPA, NPS, arts)', share: 0.3, group: 'civic' },
          { name: 'Other government', share: 26.5, group: 'other' },
        ]},
        { id: '2023', label: '2023', sublabel: 'FY2023 · Treasury / CBO', debtValue: 10.7, debtBillBn: 659, tmeBn: 6134, insight: 'Net interest hits $659 billion, bigger than the entire Pentagon base budget.', nextCta: 'Take me to 2024', categories: [
          { name: 'Social Security', share: 21.4, group: 'major' },
          { name: 'Health', share: 22.6, group: 'major' },
          { name: 'National Defense', share: 13.3, group: 'major' },
          { name: 'Net Interest', share: 10.7, group: 'debt' },
          { name: 'Income Security', share: 9.9, group: 'major' },
          { name: 'Veterans Affairs', share: 5.0, group: 'major' },
          { name: 'Civic (EPA, NPS, arts)', share: 0.3, group: 'civic' },
          { name: 'Other government', share: 16.8, group: 'other' },
        ]},
        { id: '2024', label: '2024', sublabel: 'FY2024 · Treasury / CBO', debtValue: 13.1, debtBillBn: 882, tmeBn: 6752, insight: '$882 billion to net interest. More than what the US spent on national defense, or Medicare alone.', nextCta: 'Take me to 2025', categories: [
          { name: 'Health', share: 24.0, group: 'major' },
          { name: 'Social Security', share: 21.6, group: 'major' },
          { name: 'Net Interest', share: 13.1, group: 'debt' },
          { name: 'National Defense', share: 13.0, group: 'major' },
          { name: 'Income Security', share: 9.9, group: 'major' },
          { name: 'Veterans Affairs', share: 4.8, group: 'major' },
          { name: 'Civic (EPA, NPS, arts)', share: 0.24, group: 'civic' },
          { name: 'Other government', share: 13.4, group: 'other' },
        ]},
        { id: '2025', label: '2025', sublabel: 'FY2025 · Treasury MTS', debtValue: 14.6, debtBillBn: 1029, tmeBn: 7025, insight: 'Net interest crosses $1 trillion for the first time. The biggest line in the federal budget after Social Security and Health.', nextCta: 'Take me to 2026', categories: [
          { name: 'Health', share: 24.0, group: 'major' },
          { name: 'Social Security', share: 21.6, group: 'major' },
          { name: 'Net Interest', share: 14.6, group: 'debt' },
          { name: 'National Defense', share: 13.0, group: 'major' },
          { name: 'Income Security', share: 9.5, group: 'major' },
          { name: 'Veterans Affairs', share: 4.8, group: 'major' },
          { name: 'Civic (EPA, NPS, arts)', share: 0.23, group: 'civic' },
          { name: 'Other government', share: 12.3, group: 'other' },
        ]},
        { id: '2026', label: '2026', sublabel: 'FY2026 · CBO Feb 2026', debtValue: 13.5, debtBillBn: 1003, tmeBn: 7400, isProjection: true, insight: 'CBO projects $1 trillion in interest costs even with rate stabilisation. The new baseline.', nextCta: 'Make your prediction', categories: [
          { name: 'Health', share: 24.5, group: 'major' },
          { name: 'Social Security', share: 22.0, group: 'major' },
          { name: 'National Defense', share: 13.5, group: 'major' },
          { name: 'Net Interest', share: 13.5, group: 'debt' },
          { name: 'Income Security', share: 9.4, group: 'major' },
          { name: 'Veterans Affairs', share: 4.8, group: 'major' },
          { name: 'Civic (EPA, NPS, arts)', share: 0.20, group: 'civic' },
          { name: 'Other government', share: 12.1, group: 'other' },
        ]},
      ],
    },

    // ---------------- FRANCE ----------------
    france: {
      id: 'france',
      name: 'France',
      flag: '🇫🇷',
      paletteName: 'Tricolore (blue)',
      palette: {
        alarm: '#EF4135', alarmSoft: '#FDE3E5', alarmDeep: '#771C20',
        major: '#0055A4', majorSoft: '#DEE9F4',
        civic: '#FFFFFF', grayLight: '#B0BFD9',
        ringRgba: 'rgba(239, 65, 53',
      },
      currency: { symbol: '€', perUnit: 100, perUnitLabel: '€100', perUnitUsd: null },
      scale: { unit: 'bn', decimals: 0 },
      usdRate: null,
      logos: {
        contactEmail: 'france@logos.co',
        campaignUrl: 'https://logos.co/francedebt',
        campaignLive: false,
        campaignHidden: false,
        campaignLabel: 'Logos France #comingsoon',
      },
      framingPhrase: 'public spending',
      coverHeadlineUnit: '€100',
      totalLabel: 'France total',
      baseline: { year: '2021', bn: 38, per100: 2.6 },
      forecast: { year: '2030', bn: 115, per100: 6.0 },
      tolerance: 5,
      coverBgCounts: { major: 81, civic: 7, other: 3 },
      round: {
        prompt: "Tap any square to see how the €100 splits, and what France's total bill looks like.",
        gridAria: '100 squares representing €100 of French public spending',
        statLabels: { top6: 'Top 6', debt: 'Debt Interest', civic: 'Civic Space' },
        statSubSuffix: 'bn France total',
        top5Eyebrow: 'Top 6 lines · per €100 of public spending',
        top5EyebrowYear: 'Top 6 lines · France total bill ({year})',
      },
      predict: {
        eyebrow: 'Your turn · Banque de France / INSEE to 2030',
        prompt: "Your guess for France's debt-interest bill in <strong>2030</strong>. Drag, then lock it in.",
        slider: { min: 0, max: 200, step: 5 },
        sliderMarks: ['€0', '€100bn', '€200bn'],
        sliderAria: 'Your guess for the 2030 France debt-interest bill, in euros billion',
        unitLabel: 'bn',
        references: [
          { year: '2021', val: '€38bn' },
          { year: '2024', val: '€60bn' },
          { year: '2026 budget', val: '€76bn' },
        ],
      },
      end: {
        eyebrow: '2030 projection · trajectory extrapolation',
        caption: "France's projected debt interest bill in 2030",
        insight: "Five years ago this bill was €38 billion. Now it's €76 billion. The trajectory points to €115 billion by 2030. Triple the 2021 figure in a single decade. France runs a structural deficit at ~5% of GDP; rising debt interest compounds the squeeze.",
        trajectoryEyebrow: 'France debt interest, €bn · 2021 → 2030',
        unitLabel: 'bn',
        footnote: 'Sources: INSEE Insee Première 2093 (Feb 2026) and INSEE Comptes des administrations publiques. Interest-charge trajectory cross-referenced with Banque de France Bulletin 259/4 and HCFP 2026 Opinion. 2026 figures from PLF 2026 (loi de finances).',
        comparison: {
          close: "Your guess: {guess}{usd}. Close to the trajectory.",
          higher: "Your guess: {guess}{usd}. Higher than the trajectory. If you're right, the squeeze is worse than Banque de France projects.",
          lower: "Your guess: {guess}{usd}. Lower than the trajectory. Most people underestimate how fast this line is rising.",
        },
        shiftSummary: "An extra {delta} a year. A {pct}% jump in {years} years.",
      },
      takeaways: {
        headline: 'Now you know where the <em>€100</em> goes.',
        footnote: '€-billion figures from INSEE general-government accounts (COFOG basis). Top 6 functions confirmed via Eurostat. 2026 figures from PLF 2026 / HCFP projection.',
        cards: {
          major: { pct: '93', bn: '€1.5T a year', name: 'Absorbed by 6 functions', detail: "Social Protection, Health, General Public Services, Economic Affairs, Education, civic life. Defence and debt interest share what's left." },
          debt: { pct: '4', bn: '€76bn a year', name: 'Debt interest', detail: "Doubled in 5 years,€38bn (2021) → €76bn (PLF 2026). Still 'only' 4% of public spending. For now." },
          civic: { pct: '7', bn: '€115bn a year', name: 'Reaches civic life', detail: 'Environment, housing, culture, recreation. Combined. Bigger than Defence and Debt interest combined.' },
        },
      },
      sources: [
        { label: 'INSEE Insee Première 2093', url: 'https://www.insee.fr/fr/statistiques/8735252' },
        { label: 'Eurostat COFOG', url: 'https://ec.europa.eu/eurostat/databrowser/view/gov_10a_exp/default/table' },
        { label: 'Banque de France 259/4', url: 'https://www.banque-france.fr/system/files/2025-07/BDF259-4_Depenses-publiques.pdf' },
      ],
      tweets: {
        main: "France's debt interest was €38bn in 2021.\nIt's €76bn now (PLF 2026 budget).\nTrajectory points to €115bn by 2030.\n\nDoubled in 5 years. Defence rising alongside. Both lines climbing.",
        major: "93% of every €100 in French public spending goes to just six functions: Social Protection, Health, General Public Services, Economic Affairs, Education, civic life.\n\nAbout €1.5T a year. Defence and debt interest share what's left.",
        debt: "France's debt interest doubled in 5 years: €38bn (2021) → €76bn (PLF 2026).\n\nStill 'only' 4% of public spending, for now. Banque de France projections keep climbing through 2030.",
        civic: "€7 of every €100 in French public spending reaches civic life, environment, housing, culture, recreation. Combined.\n\nThat's bigger than Defence (€3) and debt interest (€4) combined. For now.",
      },
      shortNameMap: {
        'Civic (environment, housing, culture)': 'Civic',
        'General Public Services': 'Public Services',
      },
      defaultGuess: 115,
      years: [
        { id: '2021', label: '2021', sublabel: 'FY2021 · INSEE / Eurostat COFOG', debtValue: 2.6, debtBillBn: 38, tmeBn: 1476, insight: "France's general government spent €1,476bn in 2021. Social Protection absorbed €42 of every €100: pensions, family allowance, unemployment, health insurance benefits. Debt interest was a modest €38bn (€2.60 per €100).", nextCta: 'Take me to 2022', categories: [
          { name: 'Social Protection', share: 42, group: 'major' },
          { name: 'Health', share: 16, group: 'major' },
          { name: 'General Public Services', share: 11, group: 'major' },
          { name: 'Economic Affairs', share: 9, group: 'major' },
          { name: 'Education', share: 8, group: 'major' },
          { name: 'Civic (environment, housing, culture)', share: 8, group: 'civic' },
          { name: 'Defence', share: 3, group: 'other' },
          { name: 'Debt Interest', share: 3, group: 'debt' },
        ]},
        { id: '2022', label: '2022', sublabel: 'FY2022 · INSEE / Eurostat COFOG', debtValue: 3.5, debtBillBn: 53, tmeBn: 1536, insight: 'Debt interest jumped 40% in a year, to €53bn. Inflation forced ECB rate hikes; the line crossed 3.5% of spending for the first time.', nextCta: 'Take me to 2023', categories: [
          { name: 'Social Protection', share: 41, group: 'major' },
          { name: 'Health', share: 16, group: 'major' },
          { name: 'General Public Services', share: 11, group: 'major' },
          { name: 'Economic Affairs', share: 9, group: 'major' },
          { name: 'Education', share: 9, group: 'major' },
          { name: 'Civic (environment, housing, culture)', share: 7, group: 'civic' },
          { name: 'Defence', share: 3, group: 'other' },
          { name: 'Debt Interest', share: 4, group: 'debt' },
        ]},
        { id: '2023', label: '2023', sublabel: 'FY2023 · INSEE / Eurostat COFOG', debtValue: 3.3, debtBillBn: 53, tmeBn: 1608, insight: "Interest plateaus at €53bn but its share dips slightly. France's structural deficit holds at ~5% of GDP.", nextCta: 'Take me to 2024', categories: [
          { name: 'Social Protection', share: 41, group: 'major' },
          { name: 'Health', share: 16, group: 'major' },
          { name: 'General Public Services', share: 11, group: 'major' },
          { name: 'Economic Affairs', share: 10, group: 'major' },
          { name: 'Education', share: 9, group: 'major' },
          { name: 'Civic (environment, housing, culture)', share: 7, group: 'civic' },
          { name: 'Defence', share: 3, group: 'other' },
          { name: 'Debt Interest', share: 3, group: 'debt' },
        ]},
        { id: '2024', label: '2024', sublabel: 'FY2024 · INSEE Insee Première 2093', debtValue: 3.6, debtBillBn: 60, tmeBn: 1672, insight: '€60bn to debt interest, already 60% bigger than 2021. INSEE confirms it: the line is on a structural rise. Civic budget (€115bn) is now nearly 2× the debt bill.', nextCta: 'Take me to 2025', categories: [
          { name: 'Social Protection', share: 40, group: 'major' },
          { name: 'Health', share: 16, group: 'major' },
          { name: 'General Public Services', share: 11, group: 'major' },
          { name: 'Economic Affairs', share: 10, group: 'major' },
          { name: 'Education', share: 9, group: 'major' },
          { name: 'Civic (environment, housing, culture)', share: 7, group: 'civic' },
          { name: 'Defence', share: 3, group: 'other' },
          { name: 'Debt Interest', share: 4, group: 'debt' },
        ]},
        { id: '2025', label: '2025', sublabel: 'FY2025 · INSEE provisional / PLF', debtValue: 4.0, debtBillBn: 67, tmeBn: 1695, insight: 'Interest crosses €67bn. Defence accelerating to ~4% under the LPM 2024-2030. Both lines now growing.', nextCta: 'Take me to 2026', categories: [
          { name: 'Social Protection', share: 39, group: 'major' },
          { name: 'Health', share: 16, group: 'major' },
          { name: 'General Public Services', share: 11, group: 'major' },
          { name: 'Economic Affairs', share: 10, group: 'major' },
          { name: 'Education', share: 9, group: 'major' },
          { name: 'Civic (environment, housing, culture)', share: 7, group: 'civic' },
          { name: 'Defence', share: 4, group: 'other' },
          { name: 'Debt Interest', share: 4, group: 'debt' },
        ]},
        { id: '2026', label: '2026', sublabel: 'FY2026 · PLF 2026 / HCFP projection', debtValue: 4.4, debtBillBn: 76, tmeBn: 1722, isProjection: true, insight: 'PLF 2026 budgets €76bn for debt interest. Defence ~€70bn. Two lines now competing, and both still climbing.', nextCta: 'Make your prediction', categories: [
          { name: 'Social Protection', share: 38, group: 'major' },
          { name: 'Health', share: 16, group: 'major' },
          { name: 'General Public Services', share: 11, group: 'major' },
          { name: 'Economic Affairs', share: 10, group: 'major' },
          { name: 'Education', share: 9, group: 'major' },
          { name: 'Civic (environment, housing, culture)', share: 7, group: 'civic' },
          { name: 'Defence', share: 4, group: 'other' },
          { name: 'Debt Interest', share: 4, group: 'debt' },
          { name: 'Other', share: 1, group: 'other' },
        ]},
      ],
    },

    // ---------------- ITALY ----------------
    italy: {
      id: 'italy',
      name: 'Italy',
      flag: '🇮🇹',
      paletteName: 'Tricolore (green)',
      palette: {
        alarm: '#CE2B37', alarmSoft: '#FBE2E5', alarmDeep: '#6E0917',
        major: '#009246', majorSoft: '#D9EDE1',
        civic: '#FFFFFF', grayLight: '#B5D8C0',
        ringRgba: 'rgba(206, 43, 55',
      },
      currency: { symbol: '€', perUnit: 100, perUnitLabel: '€100', perUnitUsd: null },
      scale: { unit: 'bn', decimals: 0 },
      usdRate: null,
      logos: {
        contactEmail: 'italy@logos.co',
        campaignUrl: 'https://logos.co/italydebt',
        campaignLive: false,
        campaignHidden: false,
        campaignLabel: 'Logos Italy #comingsoon',
      },
      framingPhrase: 'public spending',
      coverHeadlineUnit: '€100',
      totalLabel: 'Italy total',
      baseline: { year: '2021', bn: 63, per100: 6.2 },
      forecast: { year: '2030', bn: 150, per100: 11.0 },
      tolerance: 5,
      coverBgCounts: { major: 80, civic: 5, other: 6 },
      round: {
        prompt: "Tap any square to see how the €100 splits, and what Italy's total bill looks like.",
        gridAria: '100 squares representing €100 of Italian public spending',
        statLabels: { top6: 'Top 6', debt: 'Debt Interest', civic: 'Civic Space' },
        statSubSuffix: 'bn Italy total',
        top5Eyebrow: 'Top 6 lines · per €100 of public spending',
        top5EyebrowYear: 'Top 6 lines · Italy total bill ({year})',
      },
      predict: {
        eyebrow: 'Your turn · MEF / UPB trajectory to 2030',
        prompt: "Your guess for Italy's debt-interest bill in <strong>2030</strong>. Drag, then lock it in.",
        slider: { min: 0, max: 250, step: 10 },
        sliderMarks: ['€0', '€125bn', '€250bn'],
        sliderAria: 'Your guess for the 2030 Italy debt-interest bill, in euros billion',
        unitLabel: 'bn',
        references: [
          { year: '2021', val: '€63bn' },
          { year: '2024', val: '€88bn' },
          { year: '2026 budget', val: '€100bn' },
        ],
      },
      end: {
        eyebrow: '2030 projection · UPB / MEF trajectory',
        caption: "Italy's projected debt-interest bill in 2030",
        insight: "Five years ago this bill was €63 billion. Now it's €100 billion. The trajectory points to €150 billion by 2030. Nearly 2.4× the 2021 figure in a single decade. Italy's debt-to-GDP sits at ~138%, among the eurozone's highest; the squeeze compounds.",
        trajectoryEyebrow: 'Italy debt interest, €bn · 2021 → 2030',
        unitLabel: 'bn',
        footnote: 'Sources: ISTAT National Accounts (2021–2024) and MEF DPB 2025 / 2026. Interest-charge trajectory cross-referenced with UPB and OECD Government at a Glance 2025. 2023 civic line reflects Superbonus 110% Eurostat reclassification, flagged in the round insight.',
        comparison: {
          close: "Your guess: {guess}{usd}. Close to the UPB trajectory.",
          higher: "Your guess: {guess}{usd}. Higher than the trajectory. If you're right, the squeeze is worse than UPB projects.",
          lower: "Your guess: {guess}{usd}. Lower than the trajectory. Most people underestimate how fast this line is rising.",
        },
        shiftSummary: "An extra {delta} a year. A {pct}% jump in {years} years.",
      },
      takeaways: {
        headline: 'Now you know where the <em>€100</em> goes.',
        footnote: '€-billion figures from ISTAT general-government accounts (COFOG basis). Top 6 functions confirmed via Eurostat. 2025 / 2026 figures from MEF DPB.',
        cards: {
          major: { pct: '88', bn: '€975bn a year', name: 'Absorbed by 6 functions', detail: "Social Protection, Health, Economic Affairs, General Public Services, Debt Interest, Education. Civic, Defence, and Public Order share what's left." },
          debt: { pct: '8', bn: '€100bn a year', name: 'Debt interest', detail: '€63bn (2021) → €100bn (MEF 2026 budget). Among the heaviest debt loads in the eurozone, and still climbing.' },
          civic: { pct: '5', bn: '€55bn a year', name: 'Reaches civic life', detail: 'Environment, housing, culture. Combined. Less than two-thirds of the debt-interest bill.' },
        },
      },
      sources: [
        { label: 'ISTAT National Accounts', url: 'https://www.istat.it/en/national-accounts' },
        { label: 'Eurostat COFOG', url: 'https://ec.europa.eu/eurostat/databrowser/view/gov_10a_exp/default/table' },
        { label: 'MEF DPB 2026', url: 'https://www.mef.gov.it/export/sites/MEF/documenti-pubblicazioni/doc-finanza-pubblica/doc/DOCUMENTO-PROGRAMMATICO-DI-BILANCIO-2026.pdf' },
      ],
      tweets: {
        main: "Italy's debt interest was €63bn in 2021.\nIt's €100bn now (MEF 2026 budget).\nTrajectory points to €150bn by 2030.\n\nUp ~60% in 5 years. Already 8% of public spending, among the heaviest in the eurozone.",
        major: "88% of every €100 in Italian public spending goes to just six functions: Social Protection, Health, Economic Affairs, General Public Services, Debt Interest, Education.\n\nAbout €975bn a year. Civic, Defence, and Public Order share what's left.",
        debt: "Italy's debt interest: €63bn (2021) → €100bn (MEF 2026 budget).\n\n8% of every €100. Among the heaviest debt loads in the eurozone. UPB projections keep climbing through 2030.",
        civic: "€5 of every €100 in Italian public spending reaches civic life, environment, housing, culture. Combined.\n\nAbout €55bn a year. Less than two-thirds of the debt-interest bill.",
      },
      shortNameMap: {
        'Civic (environment, housing, culture)': 'Civic',
        'General Public Services': 'Public Services',
        'Public Order & Safety': 'Public Order',
      },
      defaultGuess: 150,
      years: [
        { id: '2021', label: '2021', sublabel: 'FY2021 · ISTAT / Eurostat COFOG', debtValue: 6.2, debtBillBn: 63, tmeBn: 1015, insight: "Italy's general government spent €1,015bn in 2021. Social Protection absorbed €45 of every €100: pensions, family welfare, unemployment. Interest was already €63bn (€6.20 per €100), heavy by EU standards.", nextCta: 'Take me to 2022', categories: [
          { name: 'Social Protection', share: 45, group: 'major' },
          { name: 'Health', share: 13, group: 'major' },
          { name: 'Economic Affairs', share: 11, group: 'major' },
          { name: 'General Public Services', share: 8, group: 'major' },
          { name: 'Education', share: 6, group: 'major' },
          { name: 'Debt Interest', share: 6, group: 'debt' },
          { name: 'Civic (environment, housing, culture)', share: 5, group: 'civic' },
          { name: 'Public Order & Safety', share: 3, group: 'other' },
          { name: 'Defence', share: 3, group: 'other' },
        ]},
        { id: '2022', label: '2022', sublabel: 'FY2022 · ISTAT / Eurostat COFOG', debtValue: 7.0, debtBillBn: 76, tmeBn: 1091, insight: "Interest jumped 21% in a year, to €76bn. ECB rate hikes start to bite. Italy's debt-to-GDP holds at ~138%.", nextCta: 'Take me to 2023', categories: [
          { name: 'Social Protection', share: 43, group: 'major' },
          { name: 'Health', share: 13, group: 'major' },
          { name: 'Economic Affairs', share: 11, group: 'major' },
          { name: 'General Public Services', share: 8, group: 'major' },
          { name: 'Debt Interest', share: 7, group: 'debt' },
          { name: 'Education', share: 6, group: 'major' },
          { name: 'Civic (environment, housing, culture)', share: 6, group: 'civic' },
          { name: 'Public Order & Safety', share: 3, group: 'other' },
          { name: 'Defence', share: 3, group: 'other' },
        ]},
        { id: '2023', label: '2023', sublabel: 'FY2023 · ISTAT / Eurostat COFOG', debtValue: 6.9, debtBillBn: 79, tmeBn: 1150, insight: "Civic spending balloons to €108bn, but it's a Superbonus 110% artefact (Eurostat reclassified housing tax credits as transfers). Real civic was ~€42bn. Interest holds at €79bn.", nextCta: 'Take me to 2024', categories: [
          { name: 'Social Protection', share: 40, group: 'major' },
          { name: 'Health', share: 13, group: 'major' },
          { name: 'Economic Affairs', share: 11, group: 'major' },
          { name: 'Civic (environment, housing, culture)', share: 9, group: 'civic' },
          { name: 'General Public Services', share: 8, group: 'major' },
          { name: 'Debt Interest', share: 7, group: 'debt' },
          { name: 'Education', share: 6, group: 'major' },
          { name: 'Public Order & Safety', share: 3, group: 'other' },
          { name: 'Defence', share: 3, group: 'other' },
        ]},
        { id: '2024', label: '2024', sublabel: 'FY2024 · ISTAT / MEF provisional', debtValue: 7.9, debtBillBn: 88, tmeBn: 1109, insight: '€88bn to debt interest, already 40% bigger than 2021. The structural rise is locked in. UPB warns 2025–2026 will be steeper still.', nextCta: 'Take me to 2025', categories: [
          { name: 'Social Protection', share: 42, group: 'major' },
          { name: 'Health', share: 13, group: 'major' },
          { name: 'Economic Affairs', share: 11, group: 'major' },
          { name: 'General Public Services', share: 8, group: 'major' },
          { name: 'Debt Interest', share: 8, group: 'debt' },
          { name: 'Education', share: 6, group: 'major' },
          { name: 'Civic (environment, housing, culture)', share: 5, group: 'civic' },
          { name: 'Public Order & Safety', share: 3, group: 'other' },
          { name: 'Defence', share: 3, group: 'other' },
          { name: 'Other', share: 1, group: 'other' },
        ]},
        { id: '2025', label: '2025', sublabel: 'FY2025 · MEF DPB 2025', debtValue: 8.2, debtBillBn: 95, tmeBn: 1153, insight: 'Interest crosses €95bn, the debt-interest line now bigger than Education (€69bn) and Defence (€35bn) combined. MEF DPB confirms the trajectory.', nextCta: 'Take me to 2026', categories: [
          { name: 'Social Protection', share: 41, group: 'major' },
          { name: 'Health', share: 13, group: 'major' },
          { name: 'Economic Affairs', share: 11, group: 'major' },
          { name: 'General Public Services', share: 8, group: 'major' },
          { name: 'Debt Interest', share: 8, group: 'debt' },
          { name: 'Education', share: 6, group: 'major' },
          { name: 'Civic (environment, housing, culture)', share: 5, group: 'civic' },
          { name: 'Public Order & Safety', share: 3, group: 'other' },
          { name: 'Defence', share: 3, group: 'other' },
          { name: 'Other', share: 2, group: 'other' },
        ]},
        { id: '2026', label: '2026', sublabel: 'FY2026 · MEF DPB 2026 (projection)', debtValue: 8.4, debtBillBn: 100, tmeBn: 1185, isProjection: true, insight: 'MEF budgets €100bn for debt interest in 2026. €8.40 of every €100, among the heaviest debt loads in the eurozone.', nextCta: 'Make your prediction', categories: [
          { name: 'Social Protection', share: 41, group: 'major' },
          { name: 'Health', share: 13, group: 'major' },
          { name: 'Economic Affairs', share: 11, group: 'major' },
          { name: 'General Public Services', share: 8, group: 'major' },
          { name: 'Debt Interest', share: 8, group: 'debt' },
          { name: 'Education', share: 6, group: 'major' },
          { name: 'Civic (environment, housing, culture)', share: 4, group: 'civic' },
          { name: 'Public Order & Safety', share: 3, group: 'other' },
          { name: 'Defence', share: 3, group: 'other' },
          { name: 'Other', share: 3, group: 'other' },
        ]},
      ],
    },

  };

  // =========================================================
  // STATE
  // =========================================================
  const state = {
    countryId: null,
    country: null,
    yearIdx: 0,
    userGuess: 0,
  };

  // =========================================================
  // HELPERS (parameterised by state.country)
  // =========================================================

  // Per-X-unit money formatter. UK/US/France/Italy use £/€/$X.XX with two decimals.
  // China uses ¥X (whole yuan ×10). Japan uses ¥X,XXX (whole yen ×100, comma-formatted).
  function money(n) {
    const c = state.country;
    if (!c) return '0';
    const pu = c.currency.perUnit;
    const scaled = n * pu / 100;
    if (pu === 100) return scaled.toFixed(2);
    if (pu === 1000) return Math.round(scaled).toString();
    if (pu === 10000) return Math.round(scaled).toLocaleString('en-US');
    return scaled.toString();
  }

  // Absolute X-bn (or X-tn for Japan). Whole-number rounded by default.
  function moneyBn(n) {
    const c = state.country;
    if (!c) return '0';
    if (c.scale.decimals === 0) return Math.round(n).toString();
    return n.toFixed(c.scale.decimals);
  }

  // Smart bn → T switch: anything ≥1000bn renders as "X.XT" (one-decimal
  // trillion). Below 1000bn stays as "Xbn". Japan, stored in trillions, always
  // renders as T. Returns { value, unit } so the caller can write each into
  // its own span (e.g. <span>1.4</span><span class="hero-unit">T</span>).
  // forceUnit ('T' or 'bn') overrides auto-selection, used during animations
  // so the unit doesn't switch mid-tick.
  function formatBnValue(n, forceUnit) {
    const c = state.country;
    if (!c) return { value: '0', unit: 'bn' };
    const storedInT = (c.scale.unit === 'tn' || c.scale.unit === 'T');
    let unit = forceUnit;
    if (!unit) {
      if (storedInT) unit = 'T';
      else unit = (Math.abs(n) >= 1000) ? 'T' : 'bn';
    }
    if (unit === 'T') {
      const tValue = storedInT ? n : (n / 1000);
      return { value: tValue.toFixed(1), unit: 'T' };
    }
    return { value: Math.round(n).toString(), unit: 'bn' };
  }

  // Convenience: just the combined "1.4T" or "125bn" string.
  function formatBn(n, forceUnit) {
    const f = formatBnValue(n, forceUnit);
    return f.value + f.unit;
  }

  // USD anchor. Returns '(≈$X)' string or empty if no anchor configured.
  // Input is in the country's native bn (or tn for Japan),handles the scaling.
  function usdBn(localBn) {
    const c = state.country;
    if (!c || !c.usdRate) return '';
    const localBnEquivalent = c.scale.unit === 'tn' ? localBn * 1000 : localBn;
    const dollars = localBnEquivalent / c.usdRate;
    if (dollars >= 1000) return '(≈$' + (dollars / 1000).toFixed(1) + 'tn)';
    return '(≈$' + Math.round(dollars) + 'bn)';
  }

  function shortName(name) {
    const c = state.country;
    if (!c) return name;
    return c.shortNameMap[name] || name;
  }

  // Top 6 by share, excluding the unknown/striped group.
  function topSix(categories) {
    return categories
      .filter(c => c.group !== 'unknown')
      .slice()
      .sort((a, b) => b.share - a.share)
      .slice(0, 6);
  }
  function topSixTotal(categories) {
    return topSix(categories).reduce((s, c) => s + c.share, 0);
  }
  function civicTotal(categories) {
    return categories.filter(c => c.group === 'civic').reduce((s, c) => s + c.share, 0);
  }

  // Public URL to include in the share text.
  const SHARE_URL = (typeof location !== 'undefined' && /^https?:/.test(location.protocol))
    ? location.href.split('#')[0]
    : 'https://global-spending-game.example';

  // =========================================================
  // GENERAL UI HELPERS
  // =========================================================

  function showScreen(name) {
    document.querySelectorAll('[data-screen]').forEach(el => {
      el.classList.toggle('is-hidden', el.dataset.screen !== name);
    });
    window.scrollTo({ top: 0, behavior: 'instant' });
  }

  function setProgress(n) {
    const dots = document.querySelectorAll('#progress .progress-dot');
    dots.forEach((d, i) => {
      d.classList.toggle('is-done', i < n - 1);
      d.classList.toggle('is-current', i === n - 1);
    });
  }

  function prefersReducedMotion() {
    return matchMedia('(prefers-reduced-motion: reduce)').matches;
  }

  function vibrate(pattern) {
    if (navigator.vibrate) navigator.vibrate(pattern);
  }

  // Fisher–Yates shuffle (returns a new array).
  function shuffle(arr) {
    const a = arr.slice();
    for (let i = a.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [a[i], a[j]] = [a[j], a[i]];
    }
    return a;
  }

  // Build the 100-square plan: largest-remainder rounding from per-100 shares.
  function buildSquarePlan(categories) {
    const total = 100;
    const sum = categories.reduce((s, c) => s + c.share, 0);
    const exact = categories.map(c => ({ ...c, exact: (c.share / sum) * total }));
    const floors = exact.map(c => ({ ...c, base: Math.floor(c.exact), rem: c.exact - Math.floor(c.exact) }));
    let used = floors.reduce((s, c) => s + c.base, 0);
    floors.sort((a, b) => b.rem - a.rem);
    let i = 0;
    while (used < total && i < floors.length) {
      floors[i].base += 1;
      used += 1;
      i += 1;
    }
    floors.sort((a, b) => b.share - a.share);
    const plan = [];
    floors.forEach(c => {
      for (let k = 0; k < c.base; k++) plan.push({ name: c.name, group: c.group });
    });
    return plan;
  }

  // =========================================================
  // PALETTE INJECTION
  // Set CSS custom properties on <html> so styles.css can read them.
  // =========================================================

  function applyPalette() {
    const p = state.country.palette;
    const r = document.documentElement.style;
    r.setProperty('--alarm', p.alarm);
    r.setProperty('--alarm-soft', p.alarmSoft);
    r.setProperty('--alarm-deep', p.alarmDeep);
    r.setProperty('--major-blue', p.major);
    r.setProperty('--major-blue-soft', p.majorSoft);
    r.setProperty('--civic-white', p.civic);
    r.setProperty('--gray-light', p.grayLight);
    // Extract the RGB triplet from the "rgba(R, G, B" string so CSS can
    // embed it in @keyframes ring as rgba(var(--ring-rgb), alpha).
    const rgbMatch = (p.ringRgba || '').match(/rgba\(([\d, ]+)/);
    r.setProperty('--ring-rgb', rgbMatch ? rgbMatch[1].trim() : '0, 0, 0');
    document.documentElement.setAttribute('data-country', state.countryId);
  }

  // =========================================================
  // COUNTRY PICKER
  // =========================================================

  function renderPicker() {
    const grid = document.getElementById('picker-grid');
    if (!grid) return;
    grid.innerHTML = '';
    Object.keys(COUNTRIES).forEach(id => {
      const c = COUNTRIES[id];
      const tile = document.createElement('button');
      tile.className = 'picker-tile';
      tile.type = 'button';
      tile.dataset.countryId = id;
      tile.innerHTML =
        '<span class="picker-flag" aria-hidden="true">' + c.flag + '</span>' +
        '<span class="picker-name">' + c.name + '</span>';
      tile.addEventListener('click', () => selectCountry(id));
      grid.appendChild(tile);
    });
  }

  function selectCountry(id) {
    if (!COUNTRIES[id]) return;
    state.countryId = id;
    state.country = COUNTRIES[id];
    state.yearIdx = 0;
    state.userGuess = state.country.defaultGuess;
    applyPalette();
    populateStaticCopy();
    showScreen('cover');
    runCoverAnimation();
  }

  // =========================================================
  // POPULATE STATIC COPY
  // Read state.country and fill in all the text in the HTML.
  // =========================================================

  function populateStaticCopy() {
    const c = state.country;

    // Document title + meta
    document.title = 'The Spending Game (' + c.name + ')';
    const desc = document.querySelector('meta[name="description"]');
    if (desc) desc.setAttribute('content', 'The Spending Game,' + c.name + '. Where does every ' + c.currency.perUnitLabel + ' go?');

    // Masthead stays "Logos Circles" universally, never customised per region.

    // Cover
    const headline = document.getElementById('cover-heading');
    if (headline) {
      const usdEquiv = c.currency.perUnitUsd ? ' <span class="usd-equiv">(≈$' + c.currency.perUnitUsd + ')</span>' : '';
      const framingHtml = c.framingPhrase === 'tax bill'
        ? ' tax bill'
        : ' of ' + c.framingPhrase;
      headline.innerHTML = 'Where does every <em>' + c.coverHeadlineUnit + '</em>' + usdEquiv + framingHtml + ' go?';
    }
    setAttr('cover-grid', 'aria-label', 'Where ' + c.currency.perUnitLabel + ' of ' + c.name + ' ' + c.framingPhrase + ' goes');

    // Round
    setText('round-prompt', c.round.prompt);
    setAttr('grid', 'aria-label', c.round.gridAria);
    setText('stat-top6-label', c.round.statLabels.top6);
    setText('stat-debt-label', c.round.statLabels.debt);
    setText('stat-civic-label', c.round.statLabels.civic);
    // Suffix span no longer holds the "bn"/"T" unit (that's now part of the
    // dynamic value span). Just the country total label here.
    document.querySelectorAll('.stat-sub-suffix').forEach(el => { el.textContent = ' ' + c.totalLabel; });
    document.querySelectorAll('.currency').forEach(el => { el.textContent = c.currency.symbol; });
    setText('top5-eyebrow-static', c.round.top5Eyebrow);
    setAttr('top5', 'aria-label', c.round.top5Eyebrow);

    // Predict
    setText('predict-eyebrow', c.predict.eyebrow);
    const predictPrompt = document.getElementById('predict-prompt');
    if (predictPrompt) predictPrompt.innerHTML = c.predict.prompt;
    const guessFmt = formatBnValue(state.userGuess);
    setText('predict-number', guessFmt.value);
    const predictUnit = document.getElementById('predict-unit');
    if (predictUnit) predictUnit.textContent = guessFmt.unit;
    const predictUsd = document.getElementById('predict-number-usd');
    if (predictUsd) predictUsd.textContent = usdBn(state.userGuess);
    const slider = document.getElementById('slider');
    if (slider) {
      slider.min = c.predict.slider.min;
      slider.max = c.predict.slider.max;
      slider.step = c.predict.slider.step;
      slider.value = state.userGuess;
      slider.setAttribute('aria-label', c.predict.sliderAria);
    }
    const sliderMarks = document.querySelectorAll('#slider-marks span');
    c.predict.sliderMarks.forEach((m, i) => { if (sliderMarks[i]) sliderMarks[i].textContent = m; });
    const refContainer = document.getElementById('reference');
    if (refContainer) {
      refContainer.innerHTML = '';
      c.predict.references.forEach(r => {
        const cell = document.createElement('div');
        cell.className = 'ref-cell';
        let html = '<span class="ref-year">' + r.year + '</span>' +
                   '<span class="ref-val">' + r.val;
        // Add USD anchor if value looks numeric-bn and country has usdRate
        if (c.usdRate) {
          const numMatch = r.val.match(/[\d.,]+/);
          if (numMatch) {
            const numVal = parseFloat(numMatch[0].replace(/,/g, ''));
            const usd = usdBn(numVal);
            if (usd) html += ' <span class="usd-equiv">' + usd.replace('≈', '') + '</span>';
          }
        }
        html += '</span>';
        cell.innerHTML = html;
        refContainer.appendChild(cell);
      });
    }

    // End
    setText('end-eyebrow', c.end.eyebrow);
    const endUnit = document.getElementById('hero-unit');
    if (endUnit) endUnit.textContent = formatBnValue(c.forecast.bn).unit;
    setText('hero-caption', c.end.caption);
    setText('end-insight-text', c.end.insight);
    setText('trajectory-eyebrow', c.end.trajectoryEyebrow);
    setText('shift-baseline-year', c.baseline.year + ' baseline');
    const baselineFmt = formatBnValue(c.baseline.bn);
    setText('shift-baseline-val', baselineFmt.value);
    const shiftBaselineUnit = document.getElementById('shift-baseline-unit');
    if (shiftBaselineUnit) shiftBaselineUnit.textContent = baselineFmt.unit;
    const shiftBaselineUsd = document.getElementById('shift-baseline-usd');
    if (shiftBaselineUsd) shiftBaselineUsd.textContent = usdBn(c.baseline.bn);
    setText('shift-final-year', c.forecast.year + ' projection');
    const forecastFmt = formatBnValue(c.forecast.bn);
    setText('shift-final', forecastFmt.value);
    const shiftFinalUnit = document.getElementById('shift-final-unit');
    if (shiftFinalUnit) shiftFinalUnit.textContent = forecastFmt.unit;
    const shiftFinalUsd = document.getElementById('shift-final-usd');
    if (shiftFinalUsd) shiftFinalUsd.textContent = usdBn(c.forecast.bn);
    setText('end-footnote', c.end.footnote);

    // Takeaways
    const takeawaysHeading = document.getElementById('takeaways-heading');
    if (takeawaysHeading) takeawaysHeading.innerHTML = c.takeaways.headline;
    setText('takeaways-footnote', c.takeaways.footnote);
    populateTakeawayCard('major', c.takeaways.cards.major);
    populateTakeawayCard('debt', c.takeaways.cards.debt);
    populateTakeawayCard('civic', c.takeaways.cards.civic);

    // Campaign button — shown ONLY when a country's campaign is live. Every
    // other country just gets "Play again". (No disabled "#comingsoon" state.)
    const campaign = document.getElementById('cta-learn-takeaways');
    if (campaign) {
      if (c.logos.campaignLive && c.logos.campaignUrl) {
        campaign.classList.remove('is-hidden');
        campaign.textContent = c.logos.campaignLabelLive || 'Read the campaign';
        campaign.href = c.logos.campaignUrl;
        campaign.target = '_blank';
        campaign.rel = 'noopener';
      } else {
        campaign.classList.add('is-hidden');
        campaign.removeAttribute('href');
        campaign.removeAttribute('target');
      }
    }

    // Sources block in footer
    const sourcesEl = document.getElementById('site-sources');
    if (sourcesEl) {
      sourcesEl.innerHTML = '<span class="site-footer-label">Data:</span>';
      c.sources.forEach((s, i) => {
        if (i > 0) sourcesEl.innerHTML += '<span class="site-footer-sep" aria-hidden="true">·</span>';
        sourcesEl.innerHTML += '<a href="' + s.url + '" target="_blank" rel="noopener">' + s.label + '</a>';
      });
    }
  }

  function populateTakeawayCard(slot, cfg) {
    const card = document.querySelector('.takeaway-card-' + slot);
    if (!card) return;
    const pctEl = card.querySelector('.takeaway-pct');
    if (pctEl) {
      if (cfg.pctCustom) {
        pctEl.innerHTML = cfg.pct;
      } else {
        pctEl.innerHTML = cfg.pct + '<span class="takeaway-pct-sym" aria-hidden="true">%</span>';
      }
    }
    const bnEl = card.querySelector('.takeaway-bn');
    if (bnEl) {
      // Strip leading currency symbol from cfg.bn (we'll re-add via .currency span)
      const bn = cfg.bn;
      const usd = state.country.usdRate ? extractUsdAnchor(bn) : '';
      bnEl.innerHTML = bn + (usd ? ' <span class="usd-equiv">' + usd + '</span>' : '');
    }
    const nameEl = card.querySelector('.takeaway-name');
    if (nameEl) nameEl.textContent = cfg.name;
    const detailEl = card.querySelector('.takeaway-detail');
    if (detailEl) detailEl.textContent = cfg.detail;
  }

  function extractUsdAnchor(bnStr) {
    // The card config 'bn' field may already have an inline USD anchor for CHN/JPN.
    // No additional processing needed here; return '' so we don't double-anchor.
    return '';
  }

  function setText(id, txt) {
    const el = document.getElementById(id);
    if (el) el.textContent = txt;
  }
  function setAttr(id, attr, val) {
    const el = document.getElementById(id);
    if (el) el.setAttribute(attr, val);
  }

  // =========================================================
  // COVER SCREEN
  // =========================================================

  // Question-mark positions (same shape across all countries).
  const QUESTION_MARK_POSITIONS = new Set([13, 14, 15, 22, 26, 36, 45, 54, 74]);

  function runCoverAnimation() {
    const grid = document.getElementById('cover-grid');
    if (!grid) return;
    grid.innerHTML = '';
    const els = [];
    for (let i = 0; i < 100; i++) {
      const sq = document.createElement('div');
      sq.className = 'square';
      grid.appendChild(sq);
      els.push(sq);
    }
    const bgCounts = state.country.coverBgCounts;
    const bgPool = [];
    Object.entries(bgCounts).forEach(([group, count]) => {
      for (let i = 0; i < count; i++) bgPool.push(group);
    });
    const shuffledBg = shuffle(bgPool);
    const groups = new Array(100);
    let bgIdx = 0;
    for (let i = 0; i < 100; i++) {
      groups[i] = QUESTION_MARK_POSITIONS.has(i) ? 'debt' : shuffledBg[bgIdx++];
    }
    const reduced = prefersReducedMotion();
    const sub = document.getElementById('cover-sub');
    const cta = document.getElementById('cta-start');
    function revealCallouts() {
      setTimeout(() => sub && sub.classList.add('is-visible'), 200);
      setTimeout(() => cta && cta.classList.add('is-visible'), 400);
    }
    if (reduced) {
      groups.forEach((g, i) => {
        els[i].classList.add('is-revealed', 'is-cover-bg', 'is-' + g);
      });
      revealCallouts();
      return;
    }
    const order = shuffle([...Array(100).keys()]);
    order.forEach((pos, step) => {
      setTimeout(() => {
        const g = groups[pos];
        els[pos].classList.add('is-revealed', 'is-cover-bg', 'is-' + g);
        if (step === 99) revealCallouts();
      }, 8 * step);
    });
  }

  // =========================================================
  // ROUND SCREEN
  // =========================================================

  const TOTAL_STEPS = 7;

  function startRound(idx) {
    const year = state.country.years[idx];
    if (!year) return;
    state.yearIdx = idx;
    showScreen('round');
    setProgress(idx + 1);
    document.getElementById('round-eyebrow').textContent =
      'Round ' + (idx + 1) + ' of ' + TOTAL_STEPS + ' · ' + (year.sublabel || '');
    document.getElementById('round-heading').textContent = year.label;

    // Reset stat strip
    document.querySelectorAll('#stat-top6 .stat-value-number, #stat-debt .stat-value-number, #stat-civic .stat-value-number').forEach(el => { el.textContent = state.country.currency.perUnit === 100 ? '0.00' : '0'; });
    document.querySelectorAll('.stat-sub-number').forEach(el => { el.textContent = '0bn'; });

    const insight = document.getElementById('insight');
    insight.classList.add('is-hidden');
    document.getElementById('top5').classList.add('is-hidden');
    document.getElementById('cta-next').classList.add('is-hidden');

    // Build squares
    const grid = document.getElementById('grid');
    grid.innerHTML = '';
    const els = [];
    for (let i = 0; i < 100; i++) {
      const sq = document.createElement('button');
      sq.type = 'button';
      sq.className = 'square';
      sq.setAttribute('aria-label', 'Tap to reveal the breakdown');
      if (i !== 0) sq.tabIndex = -1;
      grid.appendChild(sq);
      els.push(sq);
    }

    const squares = shuffle(buildSquarePlan(year.categories));
    const order = shuffle(squares.map((_, i) => i));

    // Per-X (drives the grid colour split + the sub-stat under each big number)
    const debtTotal = year.debtValue;
    const debtCount = squares.filter(s => s.group === 'debt').length;
    const perDebt = debtCount > 0 ? debtTotal / debtCount : 0;
    const topSixCats = new Set(topSix(year.categories).map(c => c.name));
    const top6Total = topSixTotal(year.categories);
    const top6Count = squares.filter(s => topSixCats.has(s.name)).length;
    const perTop6 = top6Count > 0 ? top6Total / top6Count : 0;
    const civicTotalVal = civicTotal(year.categories);
    const civicCount = squares.filter(s => s.group === 'civic').length;
    const perCivic = civicCount > 0 ? civicTotalVal / civicCount : 0;

    // Absolute Xbn (the hero metric). Scales the per-X by year TME.
    const tme = year.tmeBn || 0;
    const debtBn = year.debtBillBn || (tme * debtTotal / 100);
    const top6Bn = tme * top6Total / 100;
    const civicBn = tme * civicTotalVal / 100;
    const perDebtBn = debtCount > 0 ? debtBn / debtCount : 0;
    const perTop6Bn = top6Count > 0 ? top6Bn / top6Count : 0;
    const perCivicBn = civicCount > 0 ? civicBn / civicCount : 0;

    const reduced = prefersReducedMotion();
    const statTop6 = document.querySelector('#stat-top6 .stat-value-number');
    const statTop6Sub = document.querySelector('#stat-top6 .stat-sub-number');
    const statDebt = document.querySelector('#stat-debt .stat-value-number');
    const statDebtSub = document.querySelector('#stat-debt .stat-sub-number');
    const statCivic = document.querySelector('#stat-civic .stat-value-number');
    const statCivicSub = document.querySelector('#stat-civic .stat-sub-number');
    const nextCta = document.getElementById('cta-next');
    nextCta.textContent = year.nextCta || 'Next year →';

    let top6Revealed = 0, debtRevealed = 0, civicRevealed = 0;
    let started = false;
    let canceled = false;
    let spinInterval = null;

    // Bind click on EACH square individually (more reliable than the grid
    // container — guarantees no bubbled clicks from other elements can trigger
    // the cascade). The cover CTA / screen transition cannot reach these.
    els.forEach(sq => {
      sq.addEventListener('click', startCascade);
      sq.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          startCascade();
        }
      });
    });

    // Spinning numbers — cycle plausible random values on the stat strip
    // until the user clicks a square. Gives the round a "live" feel and makes
    // it obvious that the numbers are waiting to be locked in.
    function startSpinning() {
      if (spinInterval) clearInterval(spinInterval);
      const baseTme = tme || 1000;
      spinInterval = setInterval(() => {
        if (started || canceled) {
          clearInterval(spinInterval);
          spinInterval = null;
          return;
        }
        // Per-X stat values — random in plausible 0-25 range. money() handles
        // each country's unit scaling (×10 for ¥1,000, ×100 for ¥10,000).
        statTop6.textContent = money(8 + Math.random() * 18);
        statDebt.textContent = money(Math.random() * 14);
        statCivic.textContent = money(Math.random() * 3);
        // Sub-bn stat values — random shares of year TME. formatBn() picks
        // the right unit (bn vs T) so the display stays consistent.
        statTop6Sub.textContent = formatBn(baseTme * (0.4 + Math.random() * 0.5));
        statDebtSub.textContent = formatBn(baseTme * Math.random() * 0.2);
        statCivicSub.textContent = formatBn(baseTme * Math.random() * 0.05);
      }, 70);
    }
    function stopSpinning() {
      if (spinInterval) {
        clearInterval(spinInterval);
        spinInterval = null;
      }
    }
    startSpinning();

    function renderTop6() {
      const list = document.getElementById('top5-list');
      const top5El = document.getElementById('top5');
      if (!list || !top5El) return;
      list.innerHTML = '';
      topSix(year.categories).forEach((cat, i) => {
        const bn = (cat.share / 100) * tme;
        const bnStr = formatBn(bn);
        const li = document.createElement('li');
        li.className = 'top5-row' + (cat.group === 'debt' ? ' is-debt' : '');
        const sym = state.country.currency.symbol;
        li.innerHTML =
          '<span class="top5-rank">' + String(i + 1).padStart(2, '0') + '</span>' +
          '<span class="top5-name">' + shortName(cat.name) + '</span>' +
          '<span class="top5-amount"><span class="currency" aria-hidden="true">' + sym + '</span>' + bnStr + '</span>';
        list.appendChild(li);
      });
      document.querySelector('#top5 .top5-eyebrow').textContent = state.country.round.top5EyebrowYear.replace('{year}', year.label);
      top5El.classList.remove('is-hidden');
    }

    function showInsight() {
      document.getElementById('insight-text').textContent = year.insight;
      insight.classList.remove('is-hidden');
      renderTop6();
      nextCta.classList.remove('is-hidden');
      vibrate(25);
    }

    function revealAll() {
      squares.forEach((s, i) => {
        els[i].classList.add('is-revealed', 'is-' + s.group);
        els[i].setAttribute('aria-label', s.name);
      });
      statTop6.textContent = money(top6Total);
      statTop6Sub.textContent = formatBn(top6Bn);
      statDebt.textContent = money(debtTotal);
      statDebtSub.textContent = formatBn(debtBn);
      statCivic.textContent = money(civicTotalVal);
      statCivicSub.textContent = formatBn(civicBn);
      showInsight();
    }

    function startCascade() {
      if (started || canceled) return;
      started = true;
      stopSpinning();
      if (reduced) { revealAll(); return; }
      order.forEach((pos, step) => {
        setTimeout(() => {
          if (canceled) return;
          const s = squares[pos];
          const el = els[pos];
          el.classList.add('is-revealed', 'is-' + s.group);
          el.setAttribute('aria-label', s.name);
          if (s.group === 'debt') {
            debtRevealed++;
            const isLast = debtRevealed === debtCount;
            statDebt.textContent = money(isLast ? debtTotal : debtRevealed * perDebt);
            statDebtSub.textContent = formatBn(isLast ? debtBn : debtRevealed * perDebtBn);
          } else if (topSixCats.has(s.name)) {
            top6Revealed++;
            const isLast = top6Revealed === top6Count;
            statTop6.textContent = money(isLast ? top6Total : top6Revealed * perTop6);
            statTop6Sub.textContent = formatBn(isLast ? top6Bn : top6Revealed * perTop6Bn);
          } else if (s.group === 'civic') {
            civicRevealed++;
            const isLast = civicRevealed === civicCount;
            statCivic.textContent = money(isLast ? civicTotalVal : civicRevealed * perCivic);
            statCivicSub.textContent = formatBn(isLast ? civicBn : civicRevealed * perCivicBn);
          }
          if (step === order.length - 1) {
            setTimeout(showInsight, 200);
          }
        }, 14 * step);
      });
    }

    // Cascade is click-only, tap any square to reveal. (No auto-start.)

    nextCta.onclick = () => {
      canceled = true;
      if (idx + 1 < state.country.years.length) {
        startRound(idx + 1);
      } else {
        startPredict();
      }
    };
  }

  // =========================================================
  // PREDICT SCREEN
  // =========================================================

  function startPredict() {
    showScreen('predict');
    setProgress(7);
    const slider = document.getElementById('slider');
    const out = document.getElementById('predict-number');
    const outUsd = document.getElementById('predict-number-usd');
    const predictUnit = document.getElementById('predict-unit');
    slider.value = String(state.userGuess);
    const initFmt = formatBnValue(state.userGuess);
    out.textContent = initFmt.value;
    if (predictUnit) predictUnit.textContent = initFmt.unit;
    if (outUsd) outUsd.textContent = usdBn(state.userGuess);
    slider.oninput = () => {
      const v = parseFloat(slider.value);
      const fmt = formatBnValue(v);
      out.textContent = fmt.value;
      if (predictUnit) predictUnit.textContent = fmt.unit;
      if (outUsd) outUsd.textContent = usdBn(v);
      state.userGuess = v;
    };
    document.getElementById('cta-lock').onclick = () => startEnd();
  }

  // =========================================================
  // END SCREEN
  // =========================================================

  function renderTrajectory() {
    const list = document.getElementById('trajectory-list');
    if (!list) return;
    list.innerHTML = '';
    const c = state.country;
    const series = c.years.map(y => ({
      label: y.label, value: y.debtBillBn,
      isProjection: !!y.isProjection, isForecast: false,
    }));
    series.push({ label: c.forecast.year, value: c.forecast.bn, isProjection: true, isForecast: true });
    const max = Math.max(...series.map(s => s.value)) || 1;
    series.forEach(s => {
      const pct = (s.value / max) * 100;
      const row = document.createElement('div');
      row.className = 'trajectory-row' + (s.isProjection ? ' is-projection' : '') + (s.isForecast ? ' is-forecast' : '');
      row.innerHTML =
        '<span class="trajectory-label">' + s.label + '</span>' +
        '<span class="trajectory-bar"><span class="trajectory-bar-fill" style="width:' + pct.toFixed(1) + '%"></span></span>' +
        '<span class="trajectory-val"><span class="currency" aria-hidden="true">' + c.currency.symbol + '</span>' + formatBn(s.value) + '</span>';
      list.appendChild(row);
    });
  }

  function startEnd() {
    showScreen('end');
    renderTrajectory();
    const c = state.country;
    const target = c.forecast.bn;
    const targetFmt = formatBnValue(target);
    const heroEl = document.getElementById('hero-value');
    const heroUnitEl = document.getElementById('hero-unit');
    const heroUsdEl = document.getElementById('hero-usd');
    if (heroUnitEl) heroUnitEl.textContent = targetFmt.unit;
    const reduced = prefersReducedMotion();
    if (reduced) {
      heroEl.textContent = targetFmt.value;
      if (heroUsdEl) heroUsdEl.textContent = usdBn(target);
    } else {
      const duration = 1200;
      const start = performance.now();
      const ease = t => 1 - Math.pow(1 - t, 3);
      function tick(now) {
        const t = Math.min(1, (now - start) / duration);
        const current = target * ease(t);
        // Force the same unit as the target throughout the animation so the
        // scale and unit suffix don't switch mid-tick.
        const currentFmt = formatBnValue(current, targetFmt.unit);
        heroEl.textContent = currentFmt.value;
        if (t < 1) requestAnimationFrame(tick);
        else {
          heroEl.textContent = targetFmt.value;
          if (heroUsdEl) heroUsdEl.textContent = usdBn(target);
        }
      }
      requestAnimationFrame(tick);
      vibrate([0, 80, 30, 80]);
    }

    // Comparison,{guess} placeholder is replaced with the full "{currency}X.XT" string.
    const guess = state.userGuess;
    const diff = guess - target;
    const tmpl = Math.abs(diff) <= c.tolerance ? c.end.comparison.close
              : diff > 0 ? c.end.comparison.higher
              : c.end.comparison.lower;
    // {guess} → full "{currency}{value}{unit}" string. {usd} → " (≈$Xbn)" anchor
    // for China/Japan, or "" elsewhere. Both placeholders are explicit in the
    // templates so there's no fragile string-position insertion.
    const guessStr = c.currency.symbol + formatBn(guess);
    const usdAnchor = usdBn(guess);
    const comp = tmpl
      .replace('{guess}', guessStr)
      .replace('{usd}', usdAnchor ? ' ' + usdAnchor : '');
    document.getElementById('comparison-text').textContent = comp;

    // Shift card final
    const finalFmt = formatBnValue(target);
    document.getElementById('shift-final').textContent = finalFmt.value;
    const shiftFinalUnitEl = document.getElementById('shift-final-unit');
    if (shiftFinalUnitEl) shiftFinalUnitEl.textContent = finalFmt.unit;
    const shiftUsdEl = document.getElementById('shift-final-usd');
    if (shiftUsdEl) shiftUsdEl.textContent = usdBn(target);

    // Shift summary,{delta} placeholder is replaced with full formatted amount.
    const delta = target - c.baseline.bn;
    const pct = Math.round(((target - c.baseline.bn) / c.baseline.bn) * 100);
    const years = Number(c.forecast.year) - Number(c.baseline.year);
    const deltaStr = c.currency.symbol + formatBn(delta);
    let summary = c.end.shiftSummary
      .replace('{delta}', deltaStr)
      .replace('{pct}', pct)
      .replace('{years}', years);
    const deltaUsd = usdBn(delta);
    if (deltaUsd) summary = summary.replace(deltaStr, deltaStr + ' ' + deltaUsd);
    document.getElementById('shift-summary').textContent = summary;
  }

  // =========================================================
  // TAKEAWAYS SCREEN
  // =========================================================

  function startTakeaways() {
    showScreen('takeaways');
  }

  function buildTweet(card) {
    const c = state.country;
    const body = card ? c.tweets[card] || c.tweets.main : c.tweets.main;
    return body + '\n\n' + SHARE_URL + '\n\n@Logos_network';
  }

  function shareToX(card) {
    const text = encodeURIComponent(buildTweet(card));
    window.open('https://x.com/intent/tweet?text=' + text, '_blank', 'noopener');
  }

  // =========================================================
  // INIT
  // =========================================================

  function init() {
    renderPicker();
    showScreen('picker');

    // Optional: ?country=uk param skips picker
    const params = new URLSearchParams(location.search);
    const preselect = params.get('country');
    if (preselect && COUNTRIES[preselect]) {
      selectCountry(preselect);
    }

    // Cover CTA → first round
    const ctaStart = document.getElementById('cta-start');
    if (ctaStart) ctaStart.addEventListener('click', () => startRound(0));

    // End → takeaways
    const ctaShare = document.getElementById('cta-share');
    if (ctaShare) ctaShare.addEventListener('click', startTakeaways);

    // Replay buttons
    const ctaReplay = document.getElementById('cta-replay');
    if (ctaReplay) ctaReplay.addEventListener('click', () => { state.yearIdx = 0; runCoverAnimation(); showScreen('cover'); });
    const ctaReplayTakeaways = document.getElementById('cta-replay-takeaways');
    if (ctaReplayTakeaways) ctaReplayTakeaways.addEventListener('click', () => { state.yearIdx = 0; runCoverAnimation(); showScreen('cover'); });

    // Takeaway share buttons
    document.querySelectorAll('.takeaway-share').forEach(btn => {
      btn.addEventListener('click', () => shareToX(btn.dataset.card));
    });

    // Back-to-picker affordance
    const ctaBackToPicker = document.getElementById('cta-back-to-picker');
    if (ctaBackToPicker) ctaBackToPicker.addEventListener('click', () => {
      state.country = null;
      state.countryId = null;
      document.documentElement.removeAttribute('data-country');
      showScreen('picker');
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
