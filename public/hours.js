const hoursData = {
  labels: ["School (1-10)", "Studying", "Football", "Gaming", "Chess", "Traveling", "Sleeping", "Working"],
  totals: [10140, 9200, 12410, 4000, 500, 4200, 75000, 2210]
};

const timeLabels = ["2002", "2004", "2006", "2008", "2010", "2012", "2014", "2016", "2018", "2020", "2022", "2023"];

function getCumulativeData(total, years, label) {
  const result = [];
  let cumulative = 0;
  const baseIncrement = total / (years.length - 1);
  const variation = baseIncrement * 0.2; // 20% variability

  for (let i = 0; i < years.length; i++) {
    let year = parseInt(years[i]);
    let increment = baseIncrement + (Math.random() * variation - variation / 2);

    // Narrative rules per label
    switch (label) {
      case "School (1-10)":
        if (year < 2008 || year > 2021) increment = 0;
        else increment *= 1.5
        break;

      case "Studying":
        if (year < 2021) increment = 0;
        else if (year === 2022) increment *= 3;
        break;
      case "Football":
        if (year < 2008) increment = 0;
        else if (year === 2010) increment *= 2.7; // peak
        else if (year === 20114) increment *= 2.3;
        else if (year ===2016) increment *= 1.7;
        else if (year ===2018) increment *= 1.5;
        else if (year ===2020) increment *= 1.1;
        break;
      case "Gaming":
        if (year < 2016) increment = 0;
        else if (year === 2018) increment *= 3;
        else if (year === 2020) increment *= 5;
        else if (year === 2022) increment *= 1.35;
        else if (year === 2016) increment *= 1;
        break;
      case "Chess":
        if (year < 2016) increment = 0;
        break;
      case "Traveling":
        if (year < 2016) increment *= 0.4;
        if (year >= 2022) increment *= 2.5;
        break;
      case "Sleeping":
        if (year < 2010) increment *= 1.2;
        else if (year > 2020) increment *= 0.5;
        else increment *= 0.9;
        break;
      case "Working":
        if (year < 2019) increment = 0;
        else if (year >2019) increment *= 2;
        break;
    }

    // Clamp to total
    if (cumulative + increment > total || i === years.length - 1) {
      increment = total - cumulative;
    }

    cumulative += increment;
    result.push(Math.round(cumulative));
  }

  return result;
}

let timeChart;

function renderTimeChart(filteredLabels = hoursData.labels) {
  const ctx = document.getElementById('timeChart').getContext('2d');

  if (timeChart) timeChart.destroy();

  const datasets = hoursData.labels
    .map((label, i) => {
      if (!filteredLabels.includes(label)) return null;
      return {
        label,
        data: getCumulativeData(hoursData.totals[i], timeLabels, label),
        fill: false,
        borderColor: `hsl(${i * 40}, 70%, 50%)`,
        tension: 0.3
      };
    })
    .filter(Boolean);

  timeChart = new Chart(ctx, {
    type: 'line',
    data: {
      labels: timeLabels,
      datasets
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      scales: {
        y: {
          beginAtZero: true,
          title: { display: true, text: 'Total Hours' }
        },
        x: {
          title: { display: true, text: 'Year' }
        }
      },
      plugins: {
        legend: { position: 'bottom' }
      }
    }
  });
}

// Keep the rest of your JS logic below unchanged


// Initial pie chart
const pieCtx = document.getElementById('pieChart').getContext('2d');
const pieChart = new Chart(pieCtx, {
  type: 'pie',
  data: {
    labels: hoursData.labels,
    datasets: [{
      data: hoursData.totals,
      backgroundColor: hoursData.labels.map((_, i) => `hsl(${i * 40}, 70%, 60%)`)
    }]
  },
  options: {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { position: 'bottom' }
    }
  }
});

// Chart toggle
const buttons = document.querySelectorAll('.chart-toggle');
const pieCanvas = document.getElementById('pieChart');
const timeCanvas = document.getElementById('timeChart');
const barChart = document.getElementById('barChart');

buttons.forEach(button => {
  button.addEventListener('click', () => {
    const target = button.getAttribute('data-chart');
    pieCanvas.style.display = target === 'pie' ? 'block' : 'none';
    timeCanvas.style.display = target === 'time' ? 'block' : 'none';
    barChart.style.display = target === 'bars' ? 'block' : 'none';
    if (target === 'time') renderTimeChart();
  });
});

// Clear existing filters and initialize
const filterContainer = document.querySelector('.filter-container');
if (filterContainer) {
  filterContainer.innerHTML = '';
  hoursData.labels.forEach(label => {
    const lbl = document.createElement('label');
    lbl.htmlFor = label;
    lbl.innerHTML = `<input type="checkbox" checked id="${label}" /> ${label}`;
    filterContainer.appendChild(lbl);
  });

  filterContainer.addEventListener('change', () => {
    const active = Array.from(filterContainer.querySelectorAll('input:checked')).map(cb => cb.id);
    renderTimeChart(active);
  });
}

// Bar chart setup
const maxHours = Math.max(...hoursData.totals);
document.querySelectorAll('#barChart .bar').forEach((bar, i) => {
  const label = bar.getAttribute('data-label');
  const hours = +bar.getAttribute('data-hours');
  const percent = (hours / maxHours) * 100;
  bar.innerHTML = `<span>${label} (${hours} hrs)</span><div style="width: ${percent}%; background:#0a3d62; height: 24px; border-radius: 6px; margin-top: 5px;"></div>`;
});
