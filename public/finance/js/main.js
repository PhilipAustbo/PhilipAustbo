/* Supabase and portfolio simulation */
const supabaseUrl = window.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = window.NEXT_PUBLIC_SUPABASE_ANON_KEY;
const supabase = supabase.createClient(supabaseUrl, supabaseAnonKey);
const stockApiKey = window.NEXT_PUBLIC_ALPHA_API_KEY;

async function fetchStockPrice(symbol) {
  try {
    const res = await fetch(`/api/stock?symbol=${symbol}`);
    const data = await res.json();
    return data.price;
  } catch (err) {
    console.error(err);
    return null;
  }
}

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

async function fetchPortfolio() {
  const { data, error } = await supabase.from('portfolio').select('*').single();
  if (error) {
    console.error(error);
    return null;
  }
  return data;
}
async function fetchHoldings() {
  const { data, error } = await supabase.from('holdings').select('*');
  if (error) {
    console.error(error);
    return [];
  }
  return data;
}
async function fetchTrades() {
  const { data, error } = await supabase.from('trades').select('*').order('date', { ascending: false });
  if (error) {
    console.error(error);
    return [];
  }
  return data;
}
async function fetchStockPrice(symbol) {
  try {
    const url = `https://www.alphavantage.co/query?function=GLOBAL_QUOTE&symbol=${symbol}&apikey=${stockApiKey}`;
    const res = await fetch(url);
    const data = await res.json();
    // returner prisen som et tall
    return parseFloat(data['Global Quote']['05. price']);
  } catch (err) {
    console.error(err);
    return null;
  }
}
let portfolioChart;
function renderLineChart(labels, values) {
  const canvas = document.getElementById('portfolioChart');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  if (portfolioChart) {const url = `https://www.alphavantage.co/query?function=GLOBAL_QUOTE&symbol=${symbol}&apikey=${stockApiKey}`;
      const res = await fetch(url);
      const data = await res.json();
      return parseFloat(data['Global Quote']['05. price']);
    portfolioChart.destroy();
  }
  portfolioChart = new Chart(ctx, {
    type: 'line',
    data: {
      labels: labels,
      datasets: [{
        label: 'Porteføljeverdi (NOK)',
        data: values,
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
let compositionChart;
function renderCompositionChart(labels, values) {
  const canvas = document.getElementById('portfolioPieChart');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  if (compositionChart) {
    compositionChart.destroy();
  }
  compositionChart = new Chart(ctx, {
    type: 'pie',
    data: {
      labels: labels,
      datasets: [{
        data: values
      }]
    },
    options: {
      plugins: { legend: { position: 'bottom' } }
    }
  });
}
async function initPortfolio() {
  const portfolio = await fetchPortfolio();
  const holdings = await fetchHoldings();
  if (!portfolio) return;
  let totalValue = portfolio.cash;
  const compLabels = ['Kontanter'];
  const compValues = [portfolio.cash];
  for (const item of holdings) {
    const price = await fetchStockPrice(item.symbol);
    const value = item.quantity * price;
    totalValue += value;
    compLabels.push(item.symbol);
    compValues.push(value);
  }
  const totalEl = document.getElementById('totalValue');
  if (totalEl) {
    totalEl.textContent = totalValue.toLocaleString('no-NO') + ' NOK';
  }
  const monthlyChangeEl = document.getElementById('monthlyChange');
  if (monthlyChangeEl) {
    monthlyChangeEl.textContent = '-';
    monthlyChangeEl.className = '';
  }
  const yearReturnEl = document.getElementById('yearReturn');
  if (yearReturnEl) {
    yearReturnEl.textContent = '-';
    yearReturnEl.className = '';
  }
  renderCompositionChart(compLabels, compValues);
  const lineLabels = ['-5m','-4m','-3m','-2m','-1m','Nå'];
  const lineValues = [
    totalValue * 0.8,
    totalValue * 0.85,
    totalValue * 0.9,
    totalValue * 0.95,
    totalValue * 0.98,
    totalValue
  ];
  renderLineChart(lineLabels, lineValues);
}
async function initHistory() {
  const tableBody = document.getElementById('historyBody');
  if (!tableBody) return;
  const trades = await fetchTrades();
  tableBody.innerHTML = '';
  trades.forEach(tx => {
    const tr = document.createElement('tr');
    tr.innerHTML = `
      <td>${new Date(tx.date).toLocaleDateString('no-NO')}</td>
      <td>${tx.symbol}</td>
      <td>${tx.trade_type}</td>
      <td>${tx.quantity}</td>
      <td>${tx.price.toFixed(2)}</td>
    `;
    tableBody.appendChild(tr);
  });
}
function initBlog() {
  const container = document.getElementById('blogPosts');
  if (!container) return;
  container.innerHTML = '';
  blogPosts.forEach(post => {
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
async function performTrade(symbol, qty, type) {
  const price = await fetchStockPrice(symbol);
  if (!price) {
    alert('Klarte ikke hente pris.');
    return;
  }
  const portfolio = await fetchPortfolio();
  const holdings = await fetchHoldings();
  if (type === 'Kjøp') {
    const cost = price * qty;
    if (portfolio.cash < cost) {
      alert('Ikke nok kontanter.');
      return;
    }
    const newCash = portfolio.cash - cost;
    await supabase.from('portfolio').update({ cash: newCash }).eq('id', portfolio.id);
    const existing = holdings.find(h => h.symbol === symbol);
    if (existing) {
      const newQty = existing.quantity + qty;
      const newAvg = ((existing.avg_cost * existing.quantity) + cost) / newQty;
      await supabase.from('holdings').update({ quantity: newQty, avg_cost: newAvg }).eq('id', existing.id);
    } else {
      await supabase.from('holdings').insert([{ symbol: symbol, quantity: qty, avg_cost: price }]);
    }
  } else {
    const existing = holdings.find(h => h.symbol === symbol);
    if (!existing || existing.quantity < qty) {
      alert('Du eier ikke nok aksjer.');
      return;
    }
    const revenue = price * qty;
    const newCash = portfolio.cash + revenue;
    await supabase.from('portfolio').update({ cash: newCash }).eq('id', portfolio.id);
    const newQty = existing.quantity - qty;
    if (newQty === 0) {
      await supabase.from('holdings').delete().eq('id', existing.id);
    } else {
      await supabase.from('holdings').update({ quantity: newQty }).eq('id', existing.id);
    }
  }
  await supabase.from('trades').insert([{ date: new Date().toISOString(), symbol: symbol, trade_type: type, quantity: qty, price: price }]);
  alert('Transaksjonen ble gjennomført.');
}
function initInvestPage() {
  const form = document.getElementById('investForm');
  if (!form) return;
  form.addEventListener('submit', async e => {
    e.preventDefault();
    const symbol = document.getElementById('symbol').value.toUpperCase();
    const quantity = parseFloat(document.getElementById('quantity').value);
    const type = document.getElementById('tradeType').value;
    await performTrade(symbol, quantity, type);
    document.getElementById('symbol').value = '';
    document.getElementById('quantity').value = '';
  });
}
document.addEventListener('DOMContentLoaded', () => {
  initPortfolio();
  initHistory();
  initBlog();
  initInvestPage();
});
