/* ============================================================
   The Spending Game — app.js
   Vanilla JS, no build step. Open index.html in a browser.
   ============================================================ */

(() => {
  'use strict';

  // ---------- Config & data ----------

  // Baseline year for the shift summary (pre-2022 spike).
  const BASELINE_YEAR = '2021';
  const BASELINE_BN = 73;       // absolute UK bill, £bn
  const BASELINE_PER100 = 7.6;  // for context only

  // Far-horizon year the player guesses against (in £bn — the hero metric).
  // OBR Nov 2025 EFO central projection: ~£120–130bn for 2030-31. Using £130bn
  // to reflect the upper-end central trajectory after debt re-pricing.
  const FORECAST_YEAR = '2030';
  const FORECAST_BN = 130;
  const FORECAST_PER100 = 9.5;

  // Where the end screen "Read the campaign brief" link goes.
  // Flip CAMPAIGN_LIVE to true once the campaign page is published — the button
  // is rendered disabled until then.
  const CAMPAIGN_URL = 'https://logos.co/ukdebt';
  const CAMPAIGN_LIVE = false;

  // Public URL to include in the share text.
  // Defaults to whatever the game is served from.
  const SHARE_URL = (typeof location !== 'undefined' && /^https?:/.test(location.protocol))
    ? location.href.split('#')[0]
    : 'https://invisible-department.example';

  // Each year carries both metrics:
  // - debtBillBn / tmeBn → absolute UK scale (the hero metric, in £bn)
  // - debtValue + category .share % → per-£100 context (also drives the 100-square grid)
  const YEARS = [
    {
      id: '2021',
      label: '2021',
      sublabel: 'Tax year 2021–22 · HMRC',
      debtValue: 7.6,
      debtBillBn: 73,
      tmeBn: 958,
      insight: 'In 2021, the UK paid £73 billion to debt interest (approx. £7.60 of every £100 you pay in tax).',
      nextCta: 'Take me to 2022',
      categories: [
        { name: 'Health',                    share: 22.8, group: 'major' },
        { name: 'Welfare',                   share: 20.4, group: 'major' },
        { name: 'State Pensions',            share: 11.0, group: 'major' },
        { name: 'Education',                 share: 10.5, group: 'major' },
        { name: 'National Debt Interest',    share:  7.6, group: 'debt'  },
        { name: 'Business and Industry',     share:  5.4, group: 'other' },
        { name: 'Defence',                   share:  5.1, group: 'other' },
        { name: 'Transport',                 share:  4.7, group: 'other' },
        { name: 'Public Order and Safety',   share:  4.4, group: 'other' },
        { name: 'Government Administration', share:  2.3, group: 'other' },
        { name: 'Housing and Utilities',     share:  1.6, group: 'civic' },
        { name: 'Environment',               share:  1.5, group: 'civic' },
        { name: 'Culture',                   share:  1.3, group: 'civic' },
        { name: 'EU Payments',               share:  0.7, group: 'other' },
        { name: 'Overseas Aid',              share:  0.6, group: 'other' }
      ]
    },
    {
      id: '2022',
      label: '2022',
      sublabel: 'Tax year 2022–23 · HMRC',
      debtValue: 12.0,
      debtBillBn: 108,
      tmeBn: 896,
      insight: 'Inflation hit 11% in autumn 2022. The debt-interest bill jumped £35 billion (across a 12mon period), to £108bn.',
      nextCta: 'Take me to 2023',
      categories: [
        { name: 'Health',                    share: 19.8, group: 'major' },
        { name: 'Welfare',                   share: 19.6, group: 'major' },
        { name: 'National Debt Interest',    share: 12.0, group: 'debt'  },
        { name: 'State Pensions',            share: 10.3, group: 'major' },
        { name: 'Education',                 share:  9.9, group: 'major' },
        { name: 'Business and Industry',     share:  7.6, group: 'other' },
        { name: 'Defence',                   share:  5.2, group: 'other' },
        { name: 'Public Order and Safety',   share:  4.1, group: 'other' },
        { name: 'Transport',                 share:  4.1, group: 'other' },
        { name: 'Government Administration', share:  2.0, group: 'other' },
        { name: 'Housing and Utilities',     share:  1.7, group: 'civic' },
        { name: 'Culture',                   share:  1.3, group: 'civic' },
        { name: 'Environment',               share:  1.3, group: 'civic' },
        { name: 'EU Payments',               share:  0.6, group: 'other' },
        { name: 'Overseas Aid',              share:  0.5, group: 'other' }
      ]
    },
    {
      id: '2023',
      label: '2023',
      sublabel: 'Tax year 2023–24 · HMRC (interpolated)',
      debtValue: 11.8,
      debtBillBn: 121,
      tmeBn: 1026,
      insight: 'Inflation eased, but the bill kept climbing, reaching £121 billion.',
      nextCta: 'Take me to 2024',
      // 2023–24 category splits estimated from HMRC ATS 2022–23 / 2024–25 trends.
      // Swap with HMRC's published 2023–24 figures when available.
      categories: [
        { name: 'Health',                    share: 20.5, group: 'major' },
        { name: 'Welfare',                   share: 20.5, group: 'major' },
        { name: 'National Debt Interest',    share: 11.8, group: 'debt'  },
        { name: 'State Pensions',            share: 11.1, group: 'major' },
        { name: 'Education',                 share: 10.1, group: 'major' },
        { name: 'Defence',                   share:  5.4, group: 'other' },
        { name: 'Business and Industry',     share:  5.0, group: 'other' },
        { name: 'Public Order and Safety',   share:  4.1, group: 'other' },
        { name: 'Transport',                 share:  4.0, group: 'other' },
        { name: 'Government Administration', share:  2.1, group: 'other' },
        { name: 'Housing and Utilities',     share:  1.7, group: 'civic' },
        { name: 'Culture',                   share:  1.3, group: 'civic' },
        { name: 'Environment',               share:  1.3, group: 'civic' },
        { name: 'EU Payments',               share:  0.6, group: 'other' },
        { name: 'Overseas Aid',              share:  0.5, group: 'other' }
      ]
    },
    {
      id: '2024',
      label: '2024',
      sublabel: 'Tax year 2024–25 · HMRC (partial)',
      debtValue: 10.8,
      debtBillBn: 125,
      tmeBn: 1154,
      insight: '£125 billion. More than the UK spends on schools, police, defence, or civic space.',
      nextCta: 'Take me to 2025',
      categories: [
        { name: 'Welfare',                   share: 21.3, group: 'major' },
        { name: 'Health',                    share: 20.9, group: 'major' },
        { name: 'State Pensions',            share: 11.9, group: 'major' },
        { name: 'National Debt Interest',    share: 10.8, group: 'debt'  },
        { name: 'Education',                 share: 10.3, group: 'major' },
        { name: 'Defence',                   share:  5.5, group: 'other' },
        // Civic estimates — HMRC 2024-25 hasn't broken out civic yet, but the
        // share has held at ~4.3% across every published year. Carrying it forward.
        { name: 'Housing and Utilities',     share:  1.7, group: 'civic' },
        { name: 'Culture',                   share:  1.3, group: 'civic' },
        { name: 'Environment',               share:  1.3, group: 'civic' },
        { name: 'Other (not yet published)', share: 15.0, group: 'unknown' }
      ]
    },
    {
      id: '2025',
      label: '2025',
      sublabel: 'OBR projection · 2025–26',
      debtValue: 9.5,
      debtBillBn: 110,
      tmeBn: 1158,
      isProjection: true,
      insight: 'OBR thinks the bill dips a bit, to £110 billion, but the floor sits well above 2021 records.',
      nextCta: 'Take me to the present',
      // Projection: OBR Nov 2025 EFO implies ~9.5%. OBR doesn't break out civic
      // categories at the projection horizon; we carry forward the ~4.3% historical share.
      categories: [
        { name: 'Welfare',                   share: 21.5, group: 'major' },
        { name: 'Health',                    share: 21.4, group: 'major' },
        { name: 'State Pensions',            share: 12.3, group: 'major' },
        { name: 'Education',                 share: 10.3, group: 'major' },
        { name: 'National Debt Interest',    share:  9.5, group: 'debt'  },
        { name: 'Defence',                   share:  5.5, group: 'other' },
        { name: 'Housing and Utilities',     share:  1.7, group: 'civic' },
        { name: 'Culture',                   share:  1.3, group: 'civic' },
        { name: 'Environment',               share:  1.3, group: 'civic' },
        { name: 'Other (OBR projection)',    share: 15.2, group: 'unknown' }
      ]
    },
    {
      id: '2026',
      label: '2026',
      sublabel: 'OBR projection · 2026–27',
      debtValue: 9.7,
      debtBillBn: 115,
      tmeBn: 1186,
      isProjection: true,
      insight: 'And then it climbs again. £115 billion projected. 58% bigger than 2021 records.',
      nextCta: 'Make your prediction',
      categories: [
        { name: 'Welfare',                   share: 21.5, group: 'major' },
        { name: 'Health',                    share: 21.3, group: 'major' },
        { name: 'State Pensions',            share: 12.5, group: 'major' },
        { name: 'Education',                 share: 10.3, group: 'major' },
        { name: 'National Debt Interest',    share:  9.7, group: 'debt'  },
        { name: 'Defence',                   share:  5.7, group: 'other' },
        { name: 'Housing and Utilities',     share:  1.7, group: 'civic' },
        { name: 'Culture',                   share:  1.3, group: 'civic' },
        { name: 'Environment',               share:  1.3, group: 'civic' },
        { name: 'Other (OBR projection)',    share: 14.7, group: 'unknown' }
      ]
    }
  ];

  // ---------- Stats helpers ----------

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
    return categories
      .filter(c => c.group === 'civic')
      .reduce((s, c) => s + c.share, 0);
  }

  function buildTweetText() {
    return (
      'UK debt interest was £73bn five years ago.\n' +
      'It\'s £125bn now.\n' +
      'OBR thinks £130bn by 2030.\n\n' +
      'About £3,800 per taxpayer, every year. For a line nobody campaigns on.\n\n' +
      SHARE_URL + '\n\n' +
      '@Logos_network'
    );
  }

  // Per-takeaway-card tweets — each card shares its own headline stat.
  function takeawayTweet(card) {
    const url = SHARE_URL;
    if (card === 'major') {
      return (
        '79% of every £100 in UK tax is absorbed by just six departments: ' +
        'Health, Welfare, Pensions, Education, Debt Interest, Defence.\n\n' +
        'About £800bn a year.\n\n' +
        url + '\n\n@Logos_network'
      );
    }
    if (card === 'debt') {
      return (
        '12% of every £100 in UK tax goes to debt interest.\n\n' +
        '£125bn a year. About £3,800 per taxpayer. To fund past decisions, not today\'s needs.\n\n' +
        url + '\n\n@Logos_network'
      );
    }
    if (card === 'civic') {
      return (
        '4% of every £100 in UK tax reaches civic society — libraries, parks, culture, the environment. Combined.\n\n' +
        'About £40bn out of more than a trillion in UK spending.\n\n' +
        url + '\n\n@Logos_network'
      );
    }
    return buildTweetText();
  }

  // ---------- Allocation ----------

  // Largest-remainder algorithm: turns percentages into integer counts that sum to 100.
  function allocateSquares(categories) {
    const items = categories.map((c, idx) => ({
      ...c,
      idx,
      floor: Math.floor(c.share),
      remainder: c.share - Math.floor(c.share)
    }));
    const flooredTotal = items.reduce((s, a) => s + a.floor, 0);
    const remaining = 100 - flooredTotal;

    const ranked = items
      .slice()
      .sort((a, b) => (b.remainder - a.remainder) || (a.idx - b.idx));

    for (let i = 0; i < remaining; i++) ranked[i].floor += 1;

    return items.map(it => ({ ...it, count: it.floor }));
  }

  function buildSquarePlan(categories) {
    const allocations = allocateSquares(categories);
    const squares = [];
    allocations.forEach(a => {
      for (let i = 0; i < a.count; i++) {
        squares.push({ group: a.group, name: a.name });
      }
    });
    while (squares.length < 100) squares.push({ group: 'other', name: 'Unallocated' });
    return squares.slice(0, 100);
  }

  function shuffle(arr) {
    const a = arr.slice();
    for (let i = a.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [a[i], a[j]] = [a[j], a[i]];
    }
    return a;
  }

  // ---------- Helpers ----------

  // Per-£100 formatter — two decimals for relatability ("£10.80" reads as real money).
  function money(n) { return n.toFixed(2); }
  // Absolute £bn — whole number for impact ("£125bn").
  function moneyBn(n) { return Math.round(n).toString(); }

  // Absolute £bn for any category in any year, via category-share × year TME.
  function categoryBn(category, year) {
    if (!year.tmeBn) return null;
    return (category.share / 100) * year.tmeBn;
  }

  function shortName(name) {
    if (name === 'National Debt Interest') return 'Debt Interest';
    if (name === 'Government Administration') return 'Govt. Admin.';
    if (name === 'Public Order and Safety') return 'Public Order';
    if (name === 'Housing and Utilities') return 'Housing';
    return name;
  }

  function topSixRows(categories) {
    return topSix(categories).map(c => ({
      name: shortName(c.name),
      group: c.group,
      amount: c.share
    }));
  }

  function vibrate(pattern) {
    if (!('vibrate' in navigator)) return;
    try { navigator.vibrate(pattern); } catch (_) {}
  }

  function prefersReducedMotion() {
    return window.matchMedia &&
           window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  }

  function animateIn(el) {
    if (!el) return;
    el.classList.remove('is-entering');
    void el.offsetWidth;
    el.classList.add('is-entering');
  }

  // ---------- State ----------

  const state = {
    roundIndex: 0,
    // Player's estimate for FORECAST_YEAR (in £bn), set on the predict screen.
    userGuess: 115
  };
  const TOTAL_STEPS = YEARS.length + 1; // 6 reveals + 1 predict

  // ---------- Elements ----------

  const screens = {};
  document.querySelectorAll('.screen').forEach(s => {
    screens[s.dataset.screen] = s;
  });

  function showScreen(name) {
    Object.entries(screens).forEach(([key, el]) => {
      if (key === name) {
        el.classList.remove('is-hidden');
        animateIn(el);
      } else {
        el.classList.add('is-hidden');
      }
    });
    window.scrollTo({ top: 0, behavior: 'instant' in window ? 'instant' : 'auto' });
  }

  function setProgress(currentRound) {
    // Only set the round screen's progress; the predict screen's progress dots
    // are static in HTML (always "6 done + 1 current").
    const roundProgress = screens.round && screens.round.querySelector('.progress');
    if (!roundProgress) return;
    const dots = roundProgress.querySelectorAll('.progress-dot');
    dots.forEach((d, i) => {
      d.classList.remove('is-current', 'is-done');
      if (i < currentRound - 1) d.classList.add('is-done');
      else if (i === currentRound - 1) d.classList.add('is-current');
    });
    roundProgress.setAttribute('aria-valuenow', String(currentRound));
    roundProgress.setAttribute('aria-valuemax', String(TOTAL_STEPS));
  }

  // ---------- Round flow ----------

  function startRound(index) {
    const year = YEARS[index];
    if (!year) return;
    state.roundIndex = index;

    setProgress(index + 1);
    document.getElementById('round-eyebrow').textContent =
      `Round ${index + 1} of ${TOTAL_STEPS} · ${year.sublabel || ''}`;
    document.getElementById('round-heading').textContent = year.label;

    // Reset stat strip — per-£100 is the hero, £bn UK total is the sub-stat.
    document.querySelector('#stat-top6 .stat-value-number').textContent = '0.00';
    document.querySelector('#stat-top6 .stat-sub-number').textContent = '0';
    document.querySelector('#stat-debt .stat-value-number').textContent = '0.00';
    document.querySelector('#stat-debt .stat-sub-number').textContent = '0';
    document.querySelector('#stat-civic .stat-value-number').textContent = '0.00';
    document.querySelector('#stat-civic .stat-sub-number').textContent = '0';

    const insight = document.getElementById('insight');
    insight.classList.add('is-hidden');

    const top5El = document.getElementById('top5');
    top5El.classList.add('is-hidden');

    const nextCta = document.getElementById('cta-next');
    nextCta.classList.add('is-hidden');
    nextCta.innerHTML = `${year.nextCta} <span class="arrow" aria-hidden="true">→</span>`;

    const grid = document.getElementById('grid');
    grid.innerHTML = '';

    // Build the 100-square plan, then scatter category assignment across the grid
    // so categories don't appear as sequential blocks. Cascade reveal order is
    // a second, independent shuffle.
    const squares = shuffle(buildSquarePlan(year.categories));
    const order = shuffle(squares.map((_, i) => i));

    // Per-£100 (drives the grid colour split + the sub-stat under each big number)
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

    // Absolute £bn (the hero metric). Scales the per-£100 by year TME.
    const tme = year.tmeBn || 0;
    const debtBn = year.debtBillBn || (tme * debtTotal / 100);
    const top6Bn = tme * top6Total / 100;
    const civicBn = tme * civicTotalVal / 100;
    const perDebtBn = debtCount > 0 ? debtBn / debtCount : 0;
    const perTop6Bn = top6Count > 0 ? top6Bn / top6Count : 0;
    const perCivicBn = civicCount > 0 ? civicBn / civicCount : 0;

    const els = [];
    for (let i = 0; i < 100; i++) {
      const sq = document.createElement('button');
      sq.type = 'button';
      sq.className = 'square';
      sq.setAttribute('aria-label', 'Hidden tax square');
      if (i !== 0) sq.tabIndex = -1;
      grid.appendChild(sq);
      els.push(sq);
    }

    let started = false;
    let debtRevealed = 0;
    let top6Revealed = 0;
    let civicRevealed = 0;
    let totalRevealed = 0;
    const reduced = prefersReducedMotion();

    const statTop6 = document.querySelector('#stat-top6 .stat-value-number');
    const statTop6Sub = document.querySelector('#stat-top6 .stat-sub-number');
    const statDebt = document.querySelector('#stat-debt .stat-value-number');
    const statDebtSub = document.querySelector('#stat-debt .stat-sub-number');
    const statCivic = document.querySelector('#stat-civic .stat-value-number');
    const statCivicSub = document.querySelector('#stat-civic .stat-sub-number');

    function renderTop6() {
      const list = document.getElementById('top5-list');
      list.innerHTML = '';
      topSix(year.categories).forEach((c, idx) => {
        const li = document.createElement('li');
        li.className = 'top5-row' + (c.group === 'debt' ? ' is-debt' : '');
        const bn = categoryBn(c, year);
        const bnStr = bn != null ? moneyBn(bn) + 'bn' : 'n/a';
        li.innerHTML =
          '<span class="top5-rank">' + (idx + 1) + '</span>' +
          '<span class="top5-name">' + shortName(c.name) + '</span>' +
          '<span class="top5-amount"><span class="currency" aria-hidden="true">£</span>' + bnStr + '</span>';
        list.appendChild(li);
      });
      document.querySelector('#top5 .top5-eyebrow').textContent = `Top 6 lines · UK total bill (${year.label})`;
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
        els[i].classList.add('is-revealed', `is-${s.group}`);
        els[i].setAttribute('aria-label', s.name);
      });
      // Per-£100 = hero (big), £bn UK total = sub (small)
      statTop6.textContent = money(top6Total);
      statTop6Sub.textContent = moneyBn(top6Bn);
      statDebt.textContent = money(debtTotal);
      statDebtSub.textContent = moneyBn(debtBn);
      statCivic.textContent = money(civicTotalVal);
      statCivicSub.textContent = moneyBn(civicBn);
      showInsight();
    }

    function startCascade() {
      if (started) return;
      started = true;

      if (reduced) { revealAll(); return; }

      order.forEach((pos, step) => {
        setTimeout(() => {
          const s = squares[pos];
          const el = els[pos];
          el.classList.add('is-revealed', `is-${s.group}`);
          el.setAttribute('aria-label', s.name);

          // Per-£100 = hero (big), £bn UK total = sub (small)
          if (s.group === 'debt') {
            debtRevealed++;
            const isLast = debtRevealed === debtCount;
            statDebt.textContent = money(isLast ? debtTotal : debtRevealed * perDebt);
            statDebtSub.textContent = moneyBn(isLast ? debtBn : debtRevealed * perDebtBn);
            vibrate(10);
          }
          if (topSixCats.has(s.name)) {
            top6Revealed++;
            const isLast = top6Revealed === top6Count;
            statTop6.textContent = money(isLast ? top6Total : top6Revealed * perTop6);
            statTop6Sub.textContent = moneyBn(isLast ? top6Bn : top6Revealed * perTop6Bn);
          }
          if (s.group === 'civic') {
            civicRevealed++;
            const isLast = civicRevealed === civicCount;
            statCivic.textContent = money(isLast ? civicTotalVal : civicRevealed * perCivic);
            statCivicSub.textContent = moneyBn(isLast ? civicBn : civicRevealed * perCivicBn);
          }

          totalRevealed++;
          if (totalRevealed === 100) {
            statTop6.textContent = money(top6Total);
            statTop6Sub.textContent = moneyBn(top6Bn);
            statDebt.textContent = money(debtTotal);
            statDebtSub.textContent = moneyBn(debtBn);
            statCivic.textContent = money(civicTotalVal);
            statCivicSub.textContent = moneyBn(civicBn);
            showInsight();
          }
        }, step * 22);
      });
    }

    grid.addEventListener('click', startCascade, { once: true });
    grid.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        startCascade();
      }
    }, { once: true });
  }

  // ---------- Predict ----------

  // ---------- Predict ----------

  function startPredict() {
    showScreen('predict');
    const slider = document.getElementById('slider');
    const out = document.getElementById('predict-number');

    slider.value = String(state.userGuess);
    out.textContent = moneyBn(state.userGuess);

    slider.addEventListener('input', () => {
      const v = parseFloat(slider.value);
      out.textContent = moneyBn(v);
      state.userGuess = v;
    });
  }

  // ---------- End screen ----------

  function renderTrajectory() {
    const list = document.getElementById('trajectory-list');
    if (!list) return;
    list.innerHTML = '';
    // Trajectory shown in £bn now — the hero metric.
    const series = YEARS.map(y => ({
      label: y.label,
      value: y.debtBillBn,
      isProjection: !!y.isProjection,
      isForecast: false
    }));
    series.push({
      label: FORECAST_YEAR,
      value: FORECAST_BN,
      isProjection: true,
      isForecast: true
    });

    const maxVal = Math.max(...series.map(s => s.value));
    series.forEach(s => {
      const row = document.createElement('div');
      const isPeak = s.value === maxVal && !s.isForecast;
      row.className = 'trajectory-row' +
        (isPeak ? ' is-peak' : '') +
        (s.isProjection ? ' is-projection' : '') +
        (s.isForecast ? ' is-forecast' : '');
      const pct = Math.max(2, (s.value / maxVal) * 100);
      row.innerHTML =
        '<span class="trajectory-year">' + s.label + (s.isProjection ? ' proj.' : '') + '</span>' +
        '<span class="trajectory-bar"><span class="trajectory-bar-fill" style="width:' + pct.toFixed(1) + '%"></span></span>' +
        '<span class="trajectory-val"><span class="currency" aria-hidden="true">£</span>' + moneyBn(s.value) + 'bn</span>';
      list.appendChild(row);
    });
  }

  function startEnd() {
    showScreen('end');
    renderTrajectory();

    const target = FORECAST_BN;
    const heroEl = document.getElementById('hero-value');
    const reduced = prefersReducedMotion();

    if (reduced) {
      heroEl.textContent = moneyBn(target);
    } else {
      const duration = 1200;
      const start = performance.now();
      const ease = t => 1 - Math.pow(1 - t, 3);

      function tick(now) {
        const t = Math.min(1, (now - start) / duration);
        heroEl.textContent = moneyBn(target * ease(t));
        if (t < 1) requestAnimationFrame(tick);
        else heroEl.textContent = moneyBn(target);
      }
      requestAnimationFrame(tick);
      vibrate([0, 80, 30, 80]);
    }

    // Adaptive comparison vs. user's guess (in £bn).
    const guess = state.userGuess;
    const diff = guess - target;
    let comp;
    if (Math.abs(diff) <= 5) {
      comp = `Your guess: £${moneyBn(guess)}bn. Almost what the OBR thinks.`;
    } else if (diff > 0) {
      comp = `Your guess: £${moneyBn(guess)}bn. Higher than the OBR forecast. If you're right, this is worse than they're admitting.`;
    } else {
      comp = `Your guess: £${moneyBn(guess)}bn. Lower than the OBR forecast. Most people lowball this.`;
    }
    document.getElementById('comparison-text').textContent = comp;

    document.getElementById('shift-final').textContent = moneyBn(target);
    const delta = target - BASELINE_BN;
    const pct = Math.round(((target - BASELINE_BN) / BASELINE_BN) * 100);
    const years = Number(FORECAST_YEAR) - Number(BASELINE_YEAR);
    document.getElementById('shift-summary').textContent =
      `An extra £${delta} billion a year. A ${pct}% jump in ${years} years. OBR thinks the bill stays there.`;
  }

  // ---------- Share ----------

  function shareText() {
    const text = buildTweetText();
    if (navigator.share) {
      navigator.share({ text }).catch(() => fallbackShare(text));
    } else {
      fallbackShare(text);
    }
  }

  function fallbackShare(text) {
    const url = `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}`;
    window.open(url, '_blank', 'noopener,noreferrer');
  }

  // ---------- Wire up ----------

  document.getElementById('cta-start').addEventListener('click', () => {
    showScreen('round');
    startRound(0);
  });

  document.getElementById('cta-next').addEventListener('click', () => {
    if (state.roundIndex < YEARS.length - 1) {
      animateIn(screens.round);
      startRound(state.roundIndex + 1);
    } else {
      startPredict();
    }
  });

  document.getElementById('cta-lock').addEventListener('click', startEnd);

  // Old share button (still on end screen, now repurposed to advance to takeaways).
  document.getElementById('cta-share').addEventListener('click', () => {
    showScreen('takeaways');
  });

  // Per-stat share on the Takeaways screen.
  document.querySelectorAll('.takeaway-share').forEach(btn => {
    btn.addEventListener('click', () => {
      const card = btn.dataset.card;
      const text = takeawayTweet(card);
      if (navigator.share) {
        navigator.share({ text }).catch(() => fallbackShare(text));
      } else {
        fallbackShare(text);
      }
    });
  });

  // Replay from the Takeaways screen.
  const replayFinal = document.getElementById('cta-replay-takeaways');
  if (replayFinal) {
    replayFinal.addEventListener('click', () => {
      state.roundIndex = 0;
      state.userGuess = 115;
      const cs = document.getElementById('cover-sub');
      if (cs) cs.classList.remove('is-visible');
      document.getElementById('cta-start').classList.remove('is-visible');
      showScreen('cover');
      setTimeout(runCoverAnimation, 350);
    });
  }

  const learnLink = document.getElementById('cta-learn');
  if (CAMPAIGN_LIVE && CAMPAIGN_URL) {
    learnLink.href = CAMPAIGN_URL;
    learnLink.target = '_blank';
    learnLink.rel = 'noopener noreferrer';
    learnLink.classList.remove('is-disabled');
    learnLink.removeAttribute('aria-disabled');
  }

  document.getElementById('cta-replay').addEventListener('click', () => {
    state.roundIndex = 0;
    state.userGuess = 115;
    showScreen('cover');
  });

  // ---------- Animated cover ----------

  // 9 positions on the 10x10 grid forming a compact, rounded '?' shape.
  // Visual:
  //   . . . . . . . . . .
  //   . . . X X X . . . .   top of curve (3)
  //   . . X . . . X . . .   shoulders (2)
  //   . . . . . . X . . .   right side (1)
  //   . . . . . X . . . .   curve back (1)
  //   . . . . X . . . . .   stem (1)
  //   . . . . . . . . . .   gap
  //   . . . . X . . . . .   dot (1)
  //   . . . . . . . . . .
  //   . . . . . . . . . .
  const QUESTION_MARK_POSITIONS = new Set([13, 14, 15, 22, 26, 36, 45, 54, 74]);

  // Background distribution for the 91 non-question-mark squares.
  // Approx Union Jack proportions: top 6 (excluding debt) + civic + other.
  const COVER_BG_COUNTS = { major: 60, civic: 4, other: 27 };

  function runCoverAnimation() {
    const grid = document.getElementById('cover-grid');
    if (!grid) return;
    grid.innerHTML = '';

    // Render 100 empty squares.
    const els = [];
    for (let i = 0; i < 100; i++) {
      const sq = document.createElement('div');
      sq.className = 'square';
      grid.appendChild(sq);
      els.push(sq);
    }

    // Build the background pool and shuffle for random spatial assignment.
    // (shuffle returns a new array — capture it.)
    const bgPool = [];
    Object.entries(COVER_BG_COUNTS).forEach(([group, count]) => {
      for (let i = 0; i < count; i++) bgPool.push(group);
    });
    const shuffledBg = shuffle(bgPool);

    // Assign a group to every position: debt at the question-mark spots, mixed Union Jack background elsewhere.
    const groups = new Array(100);
    let bgIdx = 0;
    for (let i = 0; i < 100; i++) {
      groups[i] = QUESTION_MARK_POSITIONS.has(i) ? 'debt' : shuffledBg[bgIdx++];
    }

    const reduced = prefersReducedMotion();
    const sub = document.getElementById('cover-sub');
    const cta = document.getElementById('cta-start');

    function revealCallouts() {
      // Callouts moved to the Takeaways screen. Just fade in the sub + CTA now.
      setTimeout(() => sub && sub.classList.add('is-visible'), 200);
      setTimeout(() => cta && cta.classList.add('is-visible'), 450);
    }

    function flip(i) {
      els[i].classList.add('is-revealed', `is-${groups[i]}`);
    }

    if (reduced) {
      for (let i = 0; i < 100; i++) flip(i);
      revealCallouts();
      return;
    }

    // Cascade — 100 squares at 18ms intervals (~1.8s), random order.
    const order = shuffle(Array.from({ length: 100 }, (_, i) => i));
    order.forEach((pos, step) => {
      setTimeout(() => flip(pos), step * 18);
    });

    setTimeout(revealCallouts, 100 * 18 + 250);
  }

  // Initial screen + animation
  animateIn(screens.cover);
  // Let the screen-enter animation finish, then kick off the cover sequence.
  setTimeout(runCoverAnimation, 350);

  // Re-run the cover animation when the player returns to the cover via "Play again".
  document.getElementById('cta-replay').addEventListener('click', () => {
    const cs = document.getElementById('cover-sub');
    if (cs) cs.classList.remove('is-visible');
    document.getElementById('cta-start').classList.remove('is-visible');
    setTimeout(runCoverAnimation, 350);
  });
})();
