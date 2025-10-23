const DB_NAME = 'portfolioDB';
const DB_VER = 1;
let db;

function openDB() {
  return new Promise((resolve, reject) => {
    const req = indexedDB.open(DB_NAME, DB_VER);
    req.onupgradeneeded = e => {
      const d = e.target.result;
      if (!d.objectStoreNames.contains('transactions')) d.createObjectStore('transactions', { keyPath: 'id', autoIncrement: true });
      if (!d.objectStoreNames.contains('snapshots')) d.createObjectStore('snapshots', { keyPath: 'ts' });
    };
    req.onsuccess = () => { db = req.result; resolve(); };
    req.onerror = () => reject(req.error);
  });
}

function idb(name, mode='readonly') { return db.transaction(name, mode).objectStore(name); }
function addTx(tx) { return new Promise((r,j)=>{ const req=idb('transactions','readwrite').add(tx); req.onsuccess=()=>r(); req.onerror=()=>j(req.error); }); }
function getAll(store) { return new Promise((r,j)=>{ const req=idb(store).getAll(); req.onsuccess=()=>r(req.result); req.onerror=()=>j(req.error); }); }
function putSnapshot(s) { return new Promise((r,j)=>{ const req=idb('snapshots','readwrite').put(s); req.onsuccess=()=>r(); req.onerror=()=>j(req.error); }); }
function clearStore(name){ return new Promise((r,j)=>{ const req=idb(name,'readwrite').clear(); req.onsuccess=()=>r(); req.onerror=()=>j(req.error); }); }

const Settings = {
  get(){ return Object.assign({provider:'alphavantage', apiKey:'', refreshSec:60, startingCash:100000}, JSON.parse(localStorage.getItem('pf_settings')||'{}')); },
  set(s){ localStorage.setItem('pf_settings', JSON.stringify(s)); }
};

async function fetchQuoteAlpha(symbol, key) {
  const url = `https://www.alphavantage.co/query?function=GLOBAL_QUOTE&symbol=${symbol}&apikey=${key}`;
  const res = await fetch(url); const j = await res.json();
  const q = j['Global Quote']; return { price: parseFloat(q['05. price']), prevClose: parseFloat(q['08. previous close']) };
}

async function fetchQuotes(symbols) {
  const {apiKey} = Settings.get();
  const out = {};
  for (const s of symbols) {
    try { out[s] = await fetchQuoteAlpha(s, apiKey); }
    catch { console.warn('quote fail', s); }
    await new Promise(r=>setTimeout(r, 13000));
  }
  return out;
}

function computeHoldings(tx){
  const map={};
  tx.sort((a,b)=>new Date(a.date)-new Date(b.date));
  for(const t of tx){
    const s=t.symbol; map[s]=map[s]||{qty:0,cost:0};
    const sign=t.side==='BUY'?1:-1;
    const qtyBefore=map[s].qty;
    map[s].qty+=sign*t.qty;
    if(t.side==='BUY') map[s].cost+=t.qty*t.price;
    else { const avg=qtyBefore?map[s].cost/qtyBefore:0; map[s].cost-=Math.min(qtyBefore,t.qty)*avg; }
    if(map[s].qty<=0){delete map[s];}
  }
  return Object.entries(map).map(([s,v])=>({symbol:s,qty:v.qty,avgCost:v.cost/v.qty}));
}

function computeCash(tx,start){let c=start;for(const t of tx){c+=t.side==='BUY'?-t.qty*t.price:t.qty*t.price;}return c;}
const f$ = n=>new Intl.NumberFormat('en-US',{style:'currency',currency:'USD'}).format(n);
const fPct = n=>`${n>=0?'+':''}${n.toFixed(2)}%`;

let CHART; const RANGES={ '1D':{d:1},'1W':{d:7},'1M':{d:30},'3M':{d:90},'6M':{d:182},'1Y':{d:365},'3Y':{d:365*3},'ALL':null };
let selectedRange=localStorage.getItem('pf_range')||'ALL';
const cutoff=r=>RANGES[r]?new Date(Date.now()-RANGES[r].d*864e5):null;
const filterSnaps=s=>selectedRange==='ALL'?s:s.filter(x=>new Date(x.ts)>=cutoff(selectedRange));

async function render(){
  const s=Settings.get(), tx=await getAll('transactions'), holdings=computeHoldings(tx);
  const quotes=s.apiKey?await fetchQuotes(holdings.map(h=>h.symbol)):{};
  const cash=computeCash(tx,s.startingCash);
  const tbody=document.querySelector('#holdingsTable tbody'); tbody.innerHTML='';
  let val=0,cost=0,day=0;
  for(const h of holdings){
    const q=quotes[h.symbol]; const p=q?.price||h.avgCost; const prev=q?.prevClose||p;
    const worth=h.qty*p; val+=worth; cost+=h.qty*h.avgCost; day+=h.qty*(p-prev);
    tbody.insertAdjacentHTML('beforeend',`<tr><td>${h.symbol}</td><td>${h.qty}</td><td>${f$(h.avgCost)}</td><td>${f$(p)}</td><td>${f$(worth)}</td><td>${f$(worth-h.qty*h.avgCost)}</td><td>${fPct((worth/h.avgCost/h.qty-1)*100)}</td><td><button class='ghost' onclick=\"sellAll('${h.symbol}')\">Sell</button></td></tr>`);
  }
  const total=cash+val; document.querySelector('#k_value').textContent=f$(total);
  document.querySelector('#k_cash').textContent=f$(cash);
  document.querySelector('#k_pl').textContent=f$(val-cost);
  document.querySelector('#k_day').textContent=f$(day);
  document.querySelector('#txCount').textContent=`${tx.length} transactions`;

  const snaps=filterSnaps(await getAll('snapshots'));
  const labels=snaps.map(s=>new Date(s.ts)); const data=snaps.map(s=>s.value);
  if(!CHART){const ctx=document.getElementById('chart');CHART=new Chart(ctx,{type:'line',data:{labels,datasets:[{label:'Portfolio',data}]},options:{plugins:{legend:{display:false}},scales:{x:{ticks:{color:'#9aa4b2'}},y:{ticks:{color:'#9aa4b2'}}}}});}
  else{CHART.data.labels=labels;CHART.data.datasets[0].data=data;CHART.update();}
  await putSnapshot({ts:new Date().toISOString(),value:total});
}

async function sellAll(sym){
  const tx=await getAll('transactions');const h=computeHoldings(tx).find(x=>x.symbol===sym);
  if(!h)return;const {apiKey}=Settings.get();const q=apiKey?(await fetchQuotes([sym]))[sym]:null;
  const price=q?.price||h.avgCost;await addTx({symbol:sym,side:'SELL',qty:h.qty,price,date:new Date().toISOString()});await render();
}

document.addEventListener('click',e=>{
  const b=e.target.closest('#rangeBar button');if(!b)return;
  selectedRange=b.dataset.range;localStorage.setItem('pf_range',selectedRange);
  document.querySelectorAll('#rangeBar button').forEach(x=>x.classList.toggle('active',x===b));
  render();
});

document.getElementById('addTx').onclick=async()=>{
  const s=document.querySelector('#symbol').value.trim().toUpperCase();
  const qty=parseFloat(document.querySelector('#qty').value);
  let p=parseFloat(document.querySelector('#price').value);
  const side=document.querySelector('#side').value;
  if(!p){const {apiKey}=Settings.get();if(!apiKey)return alert('No API key or price');const q=await fetchQuotes([s]);p=q[s]?.price;}
  await addTx({symbol:s,side,qty,p,date:new Date().toISOString()});await render();
};

document.getElementById('exportCSV').onclick=async()=>{
  const tx=await getAll('transactions');
  const csv=['symbol,side,qty,price,date',...tx.map(t=>`${t.symbol},${t.side},${t.qty},${t.price},${t.date}`)].join('\\n');
  const blob=new Blob([csv],{type:'text/csv'});const a=document.createElement('a');
  a.href=URL.createObjectURL(blob);a.download='transactions.csv';a.click();
};

document.getElementById('openSettings').onclick=()=>document.getElementById('settings').classList.add('active');
document.getElementById('closeSettings').onclick=()=>document.getElementById('settings').classList.remove('active');
document.getElementById('saveSettings').onclick=()=>{Settings.set({
  provider:document.querySelector('#provider').value,
  apiKey:document.querySelector('#apiKey').value.trim(),
  refreshSec:+document.querySelector('#refreshInt').value,
  startingCash:+document.querySelector('#startingCash').value
});document.getElementById('settings').classList.remove('active');render();};
document.getElementById('resetAll').onclick=async()=>{await clearStore('transactions');await clearStore('snapshots');localStorage.clear();location.reload();};

openDB().then(render);
