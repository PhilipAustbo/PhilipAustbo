// Eksempeldata for porteføljen (kan byttes ut med ekte tall senere)
const portfolioData = {
    values: [1000000, 1020000, 1015000, 1050000, 1075000, 1100000, 1120000, 1150000, 1200000, 1250000],
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'Mai', 'Jun', 'Jul', 'Aug', 'Sep', 'Okt'],
    total: 1250000,
    monthlyChange: 1250000 - 1200000,
    yearReturn: ((1250000 - 1000000) / 1000000) * 100
  };
  
  // Eksempeltransaksjoner
  const transactions = [
    { date: '10.10.2025', asset: 'Equinor', type: 'Kjøp', amount: 25000, return: 6,
      details: { description: 'Kjøp av Equinor-aksjer', series: [0, 2, 4, 6] } },
    { date: '20.09.2025', asset: 'Norsk Hydro', type: 'Salg', amount: 12000, return: -2,
      details: { description: 'Salg av Norsk Hydro-aksjer', series: [0, -1, -2] } },
    { date: '15.08.2025', asset: 'Yara', type: 'Kjøp', amount: 30000, return: 4,
      details: { description: 'Kjøp av Yara-aksjer', series: [0, 1, 2, 4] } }
  ];
  
  // Eksempelblogginnlegg
  const blogPosts = [
    {
      title: 'Analyse av fornybar energi-markedet',
      date: '20. oktober 2025',
      summary: 'Et dypdykk i vekstutsiktene for grønn energi og hvordan sektoren kan påvirke porteføljen min.',
      link: '#'
    },
    {
      title: 'Hvorfor inflasjonen påvirker spareporteføljer',
      date: '5. september 2025',
      summary: 'En enkel forklaring på effekten av inflasjon og hvordan investorer kan beskytte seg.',
      link: '#'
    }
  ];
  
  // Formater tall med mellomrom som tusenskiller (norsk standard)
  function formatNumber(n) {
    return n.toLocaleString('no-NO');
  }
  
  // Initialiser porteføljesiden
  function initPortfolio() {
    if (!document.getElementById('portfolioChart')) return;
    // Oppdater nøkkeltall
    document.getElementById('totalValue').textContent =
      formatNumber(portfolioData.total) + ' NOK';
    const monthlyChangeEl = document.getElementById('monthlyChange');
    monthlyChangeEl.textContent =
      (portfolioData.monthlyChange >= 0 ? '+' : '') +
      formatNumber(portfolioData.monthlyChange) + ' NOK';
    monthlyChangeEl.className =
      portfolioData.monthlyChange >= 0 ? 'positive' : 'negative';
    const yearReturnEl = document.getElementById('yearReturn');
    yearReturnEl.textContent =
      (portfolioData.yearReturn >= 0 ? '+' : '') +
      portfolioData.yearReturn.toFixed(1) + ' %';
    yearReturnEl.className =
      portfolioData.yearReturn >= 0 ? 'positive' : 'negative';
  
    // Tegn porteføljegrafen
    const ctx = document.getElementById('portfolioChart').getContext('2d');
    new Chart(ctx, {
      type: 'line',
      data: {
        labels: portfolioData.labels,
        datasets: [{
          label: 'Porteføljeverdi (NOK)',
          data: portfolioData.values,
          fill: false,
          tension: 0.3
        }]
      },
      options: {
        plugins: { legend: { display: false } },
        scales: {
          y: {
            beginAtZero: false,
            ticks: { color: '#e6edf3' },
            grid: { color: 'rgba(255,255,255,0.1)' }
          },
          x: {
            ticks: { color: '#e6edf3' },
            grid: { color: 'rgba(255,255,255,0.1)' }
          }
        }
      }
    });
  }
  
  // Initialiser historikksiden
  function initHistory() {
    const body = document.getElementById('historyBody');
    if (!body) return;
    body.innerHTML = '';
    transactions.forEach((tx) => {
      const tr = document.createElement('tr');
      tr.innerHTML = `
        <td>${tx.date}</td>
        <td>${tx.asset}</td>
        <td>${tx.type}</td>
        <td>${formatNumber(tx.amount)}</td>
        <td class="${tx.return >= 0 ? 'positive' : 'negative'}">${
          tx.return >= 0 ? '+' : ''
        }${tx.return} %</td>
      `;
      tr.addEventListener('click', () => showTransactionDetails(tx));
      body.appendChild(tr);
    });
  }
  
  // Vis detaljer for en transaksjon (inkl. mini‑graf)
  function showTransactionDetails(tx) {
    const detailsDiv = document.getElementById('transactionDetails');
    detailsDiv.innerHTML = `
      <h3>${tx.asset} (${tx.type})</h3>
      <p>${tx.details.description}</p>
      <canvas id="txChart" height="100"></canvas>
    `;
    // Mini-graf for denne transaksjonen
    const ctx = document.getElementById('txChart').getContext('2d');
    new Chart(ctx, {
      type: 'line',
      data: {
        labels: tx.details.series.map((_, i) => i + 1),
        datasets: [{
          label: 'Utvikling (%)',
          data: tx.details.series,
          fill: false,
          tension: 0.3
        }]
      },
      options: {
        plugins: { legend: { display: false } },
        scales: {
          y: {
            ticks: { color: '#e6edf3' },
            grid: { color: 'rgba(255,255,255,0.1)' }
          },
          x: {
            ticks: { color: '#e6edf3' },
            grid: { color: 'rgba(255,255,255,0.1)' }
          }
        }
      }
    });
  }
  
  // Initialiser bloggsiden
  function initBlog() {
    const container = document.getElementById('blogPosts');
    if (!container) return;
    container.innerHTML = '';
    blogPosts.forEach((post) => {
      const article = document.createElement('article');
      article.className = 'post';
      article.innerHTML = `
        <h3>${post.title}</h3>
        <p class="date">Publisert: ${post.date}</p>
        <p>${post.summary}</p>
        <a href="${post.link}" class="read-more">Les mer →</a>
      `;
      container.appendChild(article);
    });
  }
  
  // Kjør riktig initialisering når siden lastes
  document.addEventListener('DOMContentLoaded', () => {
    initPortfolio();
    initHistory();
    initBlog();
  });
  

  // ------- Tilstands­håndtering ------- //
const defaultState = {
    cash: 100000,
    holdings: {},
    transactions: []
  };
  
  function loadState() {
    const saved = localStorage.getItem('portfolioState');
    return saved ? JSON.parse(saved) : { ...defaultState };
  }
  
  function saveState(state) {
    localStorage.setItem('portfolioState', JSON.stringify(state));
  }
  
  // Ha en global variabel for tilstanden
  let state = loadState();
  
  // ------- Oppdater visning -------- //
  async function updatePortfolioView() {
    // Hent nåverdi for alle holdings
    let total = state.cash;
    const holdingsRows = [];
    for (const symbol in state.holdings) {
      const qty = state.holdings[symbol].quantity;
      const price = await fetchStockPrice(symbol);  // hent via API
      const currentValue = price * qty;
      const avgCost = state.holdings[symbol].avgCost;
      const pnl = currentValue - (avgCost * qty);
      total += currentValue;
      holdingsRows.push({ symbol, qty, avgCost, price, currentValue, pnl });
    }
  
    // Oppdater totalsum i statistikk
    document.getElementById('totalValue').textContent =
      total.toLocaleString('no-NO') + ' NOK';
  
    // Oppdater kontantsaldo (kan vises i en egen card)
    // document.getElementById('cashValue').textContent = state.cash.toLocaleString('no-NO') + ' NOK';
  
    // Bygg holdings-tabell i porteføljens oversikt
    const container = document.getElementById('holdingsTableBody');
    if (container) {
      container.innerHTML = '';
      holdingsRows.forEach(row => {
        const tr = document.createElement('tr');
        tr.innerHTML = `
          <td>${row.symbol}</td>
          <td>${row.qty}</td>
          <td>${row.avgCost.toFixed(2)}</td>
          <td>${row.price.toFixed(2)}</td>
          <td>${row.currentValue.toFixed(2)}</td>
          <td class="${row.pnl >= 0 ? 'positive' : 'negative'}">${row.pnl.toFixed(2)}</td>
        `;
        container.appendChild(tr);
      });
    }
  }
  