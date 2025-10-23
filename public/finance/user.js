/* ========= Public (read-only) Portfolio JS ========= */

/* ----- Range presets ----- */
const RANGES = { '1D': 1, '1W': 7, '1M': 30, '3M': 90, '6M': 182, '1Y': 365, '3Y': 365 * 3, 'ALL': 3650 };
let selectedRange = localStorage.getItem('pub_range') || 'ALL';
let CHART;

/* ----- Mock data for design preview (replace with real data later) ----- */
const mock = {
  value: 123456.78,
  sinceInception: 0.364, // 36.4%
  holdings: [
    { symbol: 'AAPL', weight: 0.22, qty: 50, avgCost: 170.10, last: 189.30 },
    { symbol: 'MSFT', weight: 0.18, qty: 30, avgCost: 300.00, last: 410.22 },
    { symbol: 'MOWI', weight: 0.10, qty: 80, avgCost: 150.50, last: 158.40 }
  ],
  history: [
    { side: 'BUY', symbol: 'AAPL', qty: 20, price: 165.2, date: '2024-10-03T09:14:00Z' },
    { side: 'BUY', symbol: 'MSFT', qty: 10, price: 355.8, date: '2024-11-12T10:33:00Z' },
    { side: 'BUY', symbol: 'MOWI', qty: 80, price: 150.5, date: '2025-01-15T12:12:00Z' },
    { side: 'BUY', symbol: 'AAPL', qty: 30, price: 175.0, date: '2025-03-20T14:22:00Z' }
  ]
};

/* ----- Utils ----- */
function fMoney(n, c = 'USD') { return new Intl.NumberFormat(undefined, { style: 'currency', currency: c, maximumFractionDigits: 2 }).format(n); }
function pctStr(x) { return (x * 100 >= 0 ? '+' : '') + (x * 100).toFixed(2) + '%'; }
function fmtDate(s) { const d = new Date(s); return d.toLocaleString(); }
function q(id) { return document.getElementById(id); }

/* Short x-axis labels like Nordnet */
function tickLabel(date, range) {
  const d = (date instanceof Date) ? date : new Date(date);
  if (range === '1D') return new Intl.DateTimeFormat(undefined, { hour: '2-digit', minute: '2-digit' }).format(d);
  if (range === '1W' || range === '1M') return new Intl.DateTimeFormat(undefined, { day: '2-digit', month: 'short' }).format(d);
  if (range === '3M' || range === '6M') return new Intl.DateTimeFormat(undefined, { month: 'short' }).format(d);
  // 1Y / 3Y / ALL
  return new Intl.DateTimeFormat(undefined, { year: 'numeric' }).format(d);
}

/* Random-walk series just so the UI renders now; replace with your real portfolio series later */
function mockSeries(range) {
  const days = RANGES[range] || 365;
  const pts = [];
  let val = mock.value * 0.7; // start lower so trend is visible
  for (let i = days; i >= 0; i--) {
    const d = new Date(Date.now() - i * 864e5);
    val *= (1 + (Math.random() - 0.5) * 0.006);
    pts.push({ ts: d, value: val });
  }
  return pts;
}

/* ----- Renderers ----- */
function setActiveRange() {
  document.querySelectorAll('#rangeBar button').forEach(b => {
    b.classList.toggle('active', b.dataset.range === selectedRange);
  });
}

function renderKPIs() {
  q('k_value').textContent = fMoney(mock.value);
  q('k_rangeRet').textContent = '+4.12%';           // placeholder until hooked to real series
  q('k_si').textContent = pctStr(mock.sinceInception);
  q('k_vol').textContent = '12.8%';                 // placeholder
}

function renderHoldings() {
  const tbody = document.querySelector('#holdingsTable tbody');
  if (!tbody) return;
  tbody.innerHTML = '';
  for (const h of mock.holdings) {
    const pl = (h.last - h.avgCost) * h.qty;
    const plPct = (h.last / h.avgCost - 1) * 100;
    tbody.insertAdjacentHTML('beforeend', `
      <tr>
        <td><strong>${h.symbol}</strong></td>
        <td>${(h.weight * 100).toFixed(1)}%</td>
        <td style="text-align:right">${h.qty}</td>
        <td style="text-align:right">${fMoney(h.avgCost)}</td>
        <td style="text-align:right">${fMoney(h.last)}</td>
        <td style="text-align:right" class="${pl >= 0 ? 'gain' : 'loss'}">${pl >= 0 ? '+' : ''}${fMoney(pl)}</td>
        <td style="text-align:right" class="${plPct >= 0 ? 'gain' : 'loss'}">${plPct.toFixed(2)}%</td>
      </tr>
    `);
  }
  const lu = q('lastUpdated'); if (lu) lu.textContent = 'Updated: ' + new Date().toLocaleString();
}

function renderHistory(filter = 'ALL', search = '') {
  const wrap = q('timeline'); if (!wrap) return;
  wrap.innerHTML = '';
  const rows = mock.history
    .filter(t => filter === 'ALL' || t.side === filter)
    .filter(t => !search || t.symbol.toUpperCase().includes(search.toUpperCase()))
    .sort((a, b) => new Date(b.date) - new Date(a.date));
  for (const t of rows) {
    wrap.insertAdjacentHTML('beforeend', `
      <div class="titem">
        <div class="meta">${fmtDate(t.date)}</div>
        <div>
          <h4>${t.side} ${t.qty} ${t.symbol} @ ${fMoney(t.price)}</h4>
          <div class="meta">${t.side === 'BUY' ? 'Added position' : 'Reduced/Closed'}</div>
        </div>
      </div>
    `);
  }
}

function renderChart() {
  const series = mockSeries(selectedRange);
  const labels = series.map(p => p.ts);
  const data = series.map(p => p.value);

  const showBm = !!q('toggleBenchmark')?.checked;
  const bmSeries = showBm ? mockSeries(selectedRange).map(p => p.value * 0.98) : null;

  // Main dataset: no points, just a smooth line (Nordnet style)
  const dsMain = {
    label: 'Portfolio',
    data,
    tension: 0.25,
    pointRadius: 0,
    pointHoverRadius: 0,
    borderWidth: 2.2,
    fill: false,
    spanGaps: true
  };

  const dsBm = showBm ? [{
    label: 'Benchmark',
    data: bmSeries,
    tension: 0.25,
    pointRadius: 0,
    pointHoverRadius: 0,
    borderWidth: 2,
    borderDash: [5, 4],
    fill: false,
    spanGaps: true
  }] : [];

  const opts = {
    responsive: true,
    plugins: { legend: { display: true } },
    elements: { point: { radius: 0 } },
    scales: {
      x: {
        grid: { display: false },
        ticks: {
          maxRotation: 0,
          autoSkip: true,
          callback: (_, idx) => tickLabel(labels[idx], selectedRange),
          maxTicksLimit:
            selectedRange === '1D' ? 8 :
            selectedRange === '1W' ? 6 :
            selectedRange === '1M' ? 8 :
            selectedRange === '3M' ? 8 :
            selectedRange === '6M' ? 8 : 6
        }
      },
      y: {
        grid: { color: 'rgba(150,160,180,0.15)' },
        ticks: { callback: (v) => new Intl.NumberFormat(undefined, { notation: 'compact' }).format(v) }
      }
    }
  };

  const canvas = q('perfChart');
  if (!canvas) return;

  if (!CHART) {
    const ctx = canvas.getContext('2d');
    CHART = new Chart(ctx, {
      type: 'line',
      data: { labels, datasets: [dsMain, ...dsBm] },
      options: opts
    });
  } else {
    CHART.data.labels = labels;
    CHART.data.datasets = [dsMain, ...dsBm];
    CHART.options = opts;
    CHART.update();
  }
}

/* ----- Events & Boot ----- */
function wireEvents() {
  // Range buttons
  document.addEventListener('click', (e) => {
    const btn = e.target.closest('#rangeBar button'); if (!btn) return;
    selectedRange = btn.dataset.range || 'ALL';
    localStorage.setItem('pub_range', selectedRange);
    setActiveRange();
    renderChart();
  });

  // Benchmark toggle & selector
  q('toggleBenchmark')?.addEventListener('change', renderChart);
  q('benchmarkSelect')?.addEventListener('change', renderChart);

  // History filters
  q('historyFilter')?.addEventListener('change', (e) => {
    renderHistory(e.target.value, q('searchSymbol')?.value || '');
  });
  q('searchSymbol')?.addEventListener('input', (e) => {
    renderHistory(q('historyFilter')?.value || 'ALL', e.target.value);
  });

  // Theme toggle
  q('themeToggle')?.addEventListener('click', () => {
    document.documentElement.classList.toggle('light');
  });
}

function boot() {
  const y = q('year'); if (y) y.textContent = new Date().getFullYear();
  setActiveRange();
  renderKPIs();
  renderHoldings();
  renderHistory();
  renderChart();
}

/* Start once DOM is ready */
window.addEventListener('DOMContentLoaded', () => {
  wireEvents();
  boot();
});


/* ... eksisterende kode over ... */

// Flere tidsspenn-data (demo)
// Disse arrayene må enten oppdateres manuelt eller fylles fra en API-kilde.
// Du kan generere tilfeldige eller basert på ekte data.
const timeSeries = {
  '1D': { labels: ['09:00','12:00','15:00','18:00','21:00'], values: [1245000, 1247000, 1246500, 1248000, 1250000] },
  '1U': { labels: ['Man','Tir','Ons','Tor','Fre','Lør','Søn'], values: [1200000, 1210000, 1220000, 1225000, 1230000, 1240000, 1250000] },
  '1M': { labels: Array.from({length: 30}, (_, i) => i+1), values: Array.from({length:30}, (_, i) => 1000000 + i*8000) },
  '6M': { labels: ['Mai','Jun','Jul','Aug','Sep','Okt'], values: [1050000, 1070000, 1100000, 1120000, 1200000, 1250000] },
  '1Y': { labels: ['Nov','Des','Jan','Feb','Mar','Apr','Mai','Jun','Jul','Aug','Sep','Okt'], values: [950000, 970000, 980000, 1000000, 1030000, 1050000, 1070000, 1100000, 1120000, 1150000, 1200000, 1250000] },
  '3Y': { labels: ['2023','2024','2025'], values: [800000, 950000, 1250000] },
  '5Y': { labels: ['2021','2022','2023','2024','2025'], values: [600000, 750000, 900000, 1050000, 1250000] },
  'ALL': portfolioData  // fallback til original data
};

// Render chart ut fra valgt periode
function renderPortfolioChart(rangeKey) {
  const chartEl = document.getElementById('portfolioChart');
  if (!chartEl) return;
  const ctx = chartEl.getContext('2d');
  const dataObj = timeSeries[rangeKey] || portfolioData;
  // Fjern eksisterende graf hvis den finnes
  if (window.portfolioChart) {
    window.portfolioChart.destroy();
  }
  window.portfolioChart = new Chart(ctx, {
    type: 'line',
    data: {
      labels: dataObj.labels,
      datasets: [{
        label: 'Porteføljeverdi (NOK)',
        data: dataObj.values,
        fill: false,
        tension: 0.3
      }]
    },
    options: {
      plugins: { legend: { display: false } },
      scales: {
        y: { ticks: { color: '#e6edf3' }, grid: { color: 'rgba(255,255,255,0.1)' } },
        x: { ticks: { color: '#e6edf3' }, grid: { color: 'rgba(255,255,255,0.1)' } }
      }
    }
  });
}

// Initialiser porteføljeside og knapper
function initPortfolio() {
  if (!document.getElementById('portfolioChart')) return;
  // Oppdater nøkkeltall (som før)
  // ...
  // Render default graf (all time)
  renderPortfolioChart('ALL');

  // Legg til event listeners på tidsknapper
  document.querySelectorAll('.time-range button').forEach(btn => {
    btn.addEventListener('click', () => {
      const range = btn.getAttribute('data-range');
      renderPortfolioChart(range);
    });
  });
}

/* -----------------------------------------------------------
   Automatisk henting av sanntidspriser
   - NB: Du må få en egen API-nøkkel hos Alpha Vantage eller Finnhub.
   - Se Alpha Vantages dokumentasjon:contentReference[oaicite:2]{index=2} eller Finnhub:contentReference[oaicite:3]{index=3} for mer informasjon.
----------------------------------------------------------- */


// Eksempel på å hente pris fra Alpha Vantage
async function fetchPriceAlpha(symbol) {
  const apiKey = '5MQE4DKYDO4WB2W6'; // bytt ut med egen nøkkel
  const url = `https://www.alphavantage.co/query?function=GLOBAL_QUOTE&symbol=${symbol}&apikey=${apiKey}`;
  const res = await fetch(url);
  const data = await res.json();
  return parseFloat(data['Global Quote']['05. price']);
}

/* -----------------------------------------------------------
   Investeringer – kjøp/salg fra egen skjult side
----------------------------------------------------------- */
function initInvestPage() {
  const form = document.getElementById('investForm');
  if (!form) return;

  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    const symbol = document.getElementById('symbol').value.toUpperCase();
    const qty = parseInt(document.getElementById('quantity').value);
    const type = document.getElementById('tradeType').value;

    try {
      // hent pris fra valgfritt API
      const price = await fetchStockPrice(symbol);
      const totalValue = price * qty;

      // Legg til ny transaksjon i "transactions"-arrayet
      const newTx = {
        date: new Date().toLocaleDateString('no-NO'),
        asset: symbol,
        type: type,
        amount: totalValue,
        return: 0,  // til simulering kan settes til 0
        details: { description: `${type} av ${symbol}`, series: [0] }
      };
      transactions.push(newTx);

      // Oppdater visningen av historikk (om du går tilbake til historikk-siden senere)
      initHistory();
      // Oppdater porteføljestatistikken (her må du selv bestemme hvordan porteføljen beregnes)
      // For enkelhets skyld øker vi totalen med beløpet ved kjøp, reduserer ved salg:
      if (type === 'Kjøp') {
        portfolioData.total += totalValue;
      } else {
        portfolioData.total -= totalValue;
      }
      portfolioData.values[portfolioData.values.length - 1] = portfolioData.total;
      document.getElementById('tradeResult').textContent =
        `${type} av ${qty} ${symbol} til NOK ${price.toFixed(2)} per stk ble gjennomført.`;

      // Oppdater grafen (dersom du vil se endringen umiddelbart)
      renderPortfolioChart('ALL');
    } catch (error) {
      document.getElementById('tradeResult').textContent =
        'Feil ved henting av pris. Sjekk API-nøkkel og aksjesymbol.';
    }
  });
}

/* -----------------------------------------------------------
   Start riktig initialisering for hver side
----------------------------------------------------------- */
document.addEventListener('DOMContentLoaded', () => {
  initPortfolio();
  initHistory();
  initBlog();
  initInvestPage();
});
