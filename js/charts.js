/* ============================================================
   MARKFLOW — charts.js
   All Chart.js chart initializations
   ============================================================ */

// ── Global Chart.js defaults ────────────────────────────────────
Chart.defaults.color          = '#9494A0';
Chart.defaults.font.family    = "'Inter', sans-serif";
Chart.defaults.font.size      = 12;
Chart.defaults.plugins.legend.display = false;

// Shared tooltip config
const TOOLTIP_CFG = {
  backgroundColor: '#1A1A1E',
  borderColor:     'rgba(255,255,255,0.08)',
  borderWidth:     1,
  titleColor:      '#E8E8F0',
  bodyColor:       '#C8C8D0',
  padding:         12,
  cornerRadius:    8,
  titleFont:       { weight: '600', size: 12 },
  bodyFont:        { size: 11 },
  displayColors:   true,
  boxWidth:        10,
  boxHeight:       10,
  boxPadding:      4,
};

// Grid defaults
const GRID_CFG = {
  color:      'rgba(255,255,255,0.05)',
  drawBorder: false,
};
const TICK_CFG = { color: '#9494A0', font: { size: 11 } };

// ── Chart references ────────────────────────────────────────────
let charts = {};

// ── 1. Campaign Performance (Dashboard - Line) ──────────────────
function initCampaignPerfChart() {
  const ctx = document.getElementById('campaignPerfChart');
  if (!ctx) return;
  if (charts.perf) charts.perf.destroy();

  charts.perf = new Chart(ctx, {
    type: 'line',
    data: {
      labels: PERF_DATA.labels,
      datasets: [
        {
          label: 'Impressions',
          data: PERF_DATA.impressions,
          borderColor: '#E8192C',
          backgroundColor: 'rgba(232,25,44,0.06)',
          borderWidth: 2,
          pointRadius: 2,
          pointHoverRadius: 6,
          pointBackgroundColor: '#E8192C',
          tension: 0.4,
          fill: true,
          yAxisID: 'y',
        },
        {
          label: 'Clicks',
          data: PERF_DATA.clicks,
          borderColor: '#C8C8D0',
          backgroundColor: 'rgba(200,200,208,0.04)',
          borderWidth: 2,
          pointRadius: 2,
          pointHoverRadius: 6,
          pointBackgroundColor: '#C8C8D0',
          tension: 0.4,
          fill: true,
          yAxisID: 'y1',
        },
        {
          label: 'Conversions',
          data: PERF_DATA.conversions,
          borderColor: '#22C55E',
          backgroundColor: 'rgba(34,197,94,0.05)',
          borderWidth: 2,
          pointRadius: 2,
          pointHoverRadius: 6,
          pointBackgroundColor: '#22C55E',
          tension: 0.4,
          fill: true,
          yAxisID: 'y2',
        },
      ],
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      interaction: { mode: 'index', intersect: false },
      plugins: {
        tooltip: TOOLTIP_CFG,
        legend: { display: false },
      },
      scales: {
        x: {
          grid: GRID_CFG,
          ticks: { ...TICK_CFG, maxTicksLimit: 8 },
        },
        y: {
          position: 'left',
          grid: GRID_CFG,
          ticks: {
            ...TICK_CFG,
            callback: v => v >= 1000 ? (v/1000).toFixed(0)+'K' : v,
          },
          title: { display: true, text: 'Impressions', color: '#9494A0', font: { size: 10 } },
        },
        y1: {
          position: 'right',
          grid: { display: false },
          ticks: {
            ...TICK_CFG,
            callback: v => v >= 1000 ? (v/1000).toFixed(0)+'K' : v,
          },
          title: { display: true, text: 'Clicks', color: '#9494A0', font: { size: 10 } },
        },
        y2: { display: false },
      },
    },
  });

  // Build legend
  const legend = document.getElementById('perfLegend');
  if (legend) {
    legend.innerHTML = [
      { label: 'Impressions', color: '#E8192C' },
      { label: 'Clicks',      color: '#C8C8D0' },
      { label: 'Conversions', color: '#22C55E' },
    ].map(l => `<div class="legend-item"><div class="legend-dot" style="background:${l.color}"></div>${l.label}</div>`).join('');
  }
}

// ── 2. Performance Trend (Campaigns - Area) ─────────────────────
function initPerfTrendChart() {
  const ctx = document.getElementById('perfTrendChart');
  if (!ctx) return;
  if (charts.trend) charts.trend.destroy();

  const alpha = (hex, a) => {
    const r = parseInt(hex.slice(1,3),16);
    const g = parseInt(hex.slice(3,5),16);
    const b = parseInt(hex.slice(5,7),16);
    return `rgba(${r},${g},${b},${a})`;
  };

  charts.trend = new Chart(ctx, {
    type: 'line',
    data: {
      labels: PERF_TREND.labels,
      datasets: [
        {
          label: 'Google Ads',
          data: PERF_TREND.google,
          borderColor: '#4285F4',
          backgroundColor: alpha('#4285F4', 0.12),
          borderWidth: 2,
          tension: 0.4,
          fill: true,
          pointRadius: 1,
        },
        {
          label: 'Facebook',
          data: PERF_TREND.facebook,
          borderColor: '#1877F2',
          backgroundColor: alpha('#1877F2', 0.08),
          borderWidth: 2,
          tension: 0.4,
          fill: true,
          pointRadius: 1,
        },
        {
          label: 'Instagram',
          data: PERF_TREND.instagram,
          borderColor: '#E1306C',
          backgroundColor: alpha('#E1306C', 0.08),
          borderWidth: 2,
          tension: 0.4,
          fill: true,
          pointRadius: 1,
        },
        {
          label: 'LinkedIn',
          data: PERF_TREND.linkedin,
          borderColor: '#0A66C2',
          backgroundColor: alpha('#0A66C2', 0.06),
          borderWidth: 2,
          tension: 0.4,
          fill: true,
          pointRadius: 1,
        },
      ],
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      interaction: { mode: 'index', intersect: false },
      plugins: {
        tooltip: {
          ...TOOLTIP_CFG,
          callbacks: {
            label: ctx => ` ${ctx.dataset.label}: $${ctx.parsed.y.toLocaleString()}`,
          },
        },
        legend: {
          display: true,
          position: 'top',
          align: 'end',
          labels: { boxWidth: 10, boxHeight: 10, color: '#9494A0', font: { size: 11 }, padding: 16 },
        },
      },
      scales: {
        x: { grid: GRID_CFG, ticks: { ...TICK_CFG, maxTicksLimit: 8 } },
        y: {
          grid: GRID_CFG,
          ticks: { ...TICK_CFG, callback: v => '$'+(v/1000).toFixed(0)+'K' },
        },
      },
    },
  });
}

// ── 3. Channel Bar Chart (Campaigns - Horizontal Bar) ──────────
function initChannelBarChart() {
  const ctx = document.getElementById('channelBarChart');
  if (!ctx) return;
  if (charts.channelBar) charts.channelBar.destroy();

  charts.channelBar = new Chart(ctx, {
    type: 'bar',
    data: {
      labels: CHANNEL_PERF.labels,
      datasets: [{
        label: 'Revenue',
        data: CHANNEL_PERF.revenue,
        backgroundColor: CHANNEL_PERF.colors.map(c => c + '99'),
        borderColor:     CHANNEL_PERF.colors,
        borderWidth: 1,
        borderRadius: 6,
        borderSkipped: false,
      }],
    },
    options: {
      indexAxis: 'y',
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        tooltip: {
          ...TOOLTIP_CFG,
          callbacks: {
            label: ctx => ` Revenue: $${ctx.parsed.x.toLocaleString()}`,
          },
        },
        legend: { display: false },
      },
      scales: {
        x: {
          grid: GRID_CFG,
          ticks: { ...TICK_CFG, callback: v => '$'+(v/1000).toFixed(0)+'K' },
        },
        y: { grid: { display: false }, ticks: TICK_CFG },
      },
    },
  });
}

// ── 4. Age Donut Chart (Audience) ───────────────────────────────
function initAgeDonutChart() {
  const ctx = document.getElementById('ageDonutChart');
  if (!ctx) return;
  if (charts.age) charts.age.destroy();

  charts.age = new Chart(ctx, {
    type: 'doughnut',
    data: {
      labels: AUDIENCE.ageGroups.labels,
      datasets: [{
        data: AUDIENCE.ageGroups.data,
        backgroundColor: AUDIENCE.ageGroups.colors.map(c => c + 'CC'),
        borderColor:     AUDIENCE.ageGroups.colors,
        borderWidth: 1.5,
        hoverOffset: 8,
      }],
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      cutout: '68%',
      plugins: {
        tooltip: {
          ...TOOLTIP_CFG,
          callbacks: {
            label: ctx => ` ${ctx.label}: ${ctx.parsed}%`,
          },
        },
        legend: {
          display: true,
          position: 'right',
          labels: { boxWidth: 10, boxHeight: 10, color: '#9494A0', font: { size: 11 }, padding: 10 },
        },
      },
    },
  });
}

// ── 5. Budget vs Revenue (ROI - Grouped Bar) ────────────────────
function initBudgetRevenueChart() {
  const ctx = document.getElementById('budgetRevenueChart');
  if (!ctx) return;
  if (charts.budgetRev) charts.budgetRev.destroy();

  charts.budgetRev = new Chart(ctx, {
    type: 'bar',
    data: {
      labels: MONTHLY.labels,
      datasets: [
        {
          label: 'Budget',
          data: MONTHLY.budget,
          backgroundColor: 'rgba(148,148,160,0.3)',
          borderColor: '#9494A0',
          borderWidth: 1,
          borderRadius: 5,
        },
        {
          label: 'Spend',
          data: MONTHLY.spend,
          backgroundColor: 'rgba(232,25,44,0.3)',
          borderColor: '#E8192C',
          borderWidth: 1,
          borderRadius: 5,
        },
        {
          label: 'Revenue',
          data: MONTHLY.revenue,
          backgroundColor: 'rgba(34,197,94,0.25)',
          borderColor: '#22C55E',
          borderWidth: 1,
          borderRadius: 5,
        },
      ],
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      interaction: { mode: 'index', intersect: false },
      plugins: {
        tooltip: {
          ...TOOLTIP_CFG,
          callbacks: {
            label: ctx => ` ${ctx.dataset.label}: $${ctx.parsed.y.toLocaleString()}`,
          },
        },
        legend: {
          display: true,
          position: 'top',
          align: 'end',
          labels: { boxWidth: 10, boxHeight: 10, color: '#9494A0', font: { size: 11 }, padding: 14 },
        },
      },
      scales: {
        x: { grid: GRID_CFG, ticks: TICK_CFG },
        y: {
          grid: GRID_CFG,
          ticks: { ...TICK_CFG, callback: v => '$'+(v/1000).toFixed(0)+'K' },
        },
      },
    },
  });
}

// ── 6. Monthly Trend (ROI - Line) ───────────────────────────────
function initMonthlyTrendChart() {
  const ctx = document.getElementById('monthlyTrendChart');
  if (!ctx) return;
  if (charts.monthlyTrend) charts.monthlyTrend.destroy();

  charts.monthlyTrend = new Chart(ctx, {
    type: 'line',
    data: {
      labels: MONTHLY.labels,
      datasets: [{
        label: 'Revenue',
        data: MONTHLY.revenue,
        borderColor: '#E8192C',
        backgroundColor: 'rgba(232,25,44,0.08)',
        borderWidth: 2.5,
        pointRadius: 4,
        pointBackgroundColor: '#E8192C',
        pointBorderColor: '#111114',
        pointBorderWidth: 2,
        pointHoverRadius: 8,
        tension: 0.4,
        fill: true,
      }],
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        tooltip: {
          ...TOOLTIP_CFG,
          callbacks: {
            label: ctx => ` Revenue: $${ctx.parsed.y.toLocaleString()}`,
          },
        },
        legend: { display: false },
      },
      scales: {
        x: { grid: GRID_CFG, ticks: TICK_CFG },
        y: {
          grid: GRID_CFG,
          ticks: { ...TICK_CFG, callback: v => '$'+(v/1000).toFixed(0)+'K' },
        },
      },
    },
  });
}

// ── 7. Predictive Chart (AI page) ───────────────────────────────
function initPredictiveChart() {
  const ctx = document.getElementById('predictiveChart');
  if (!ctx) return;
  if (charts.predictive) charts.predictive.destroy();

  charts.predictive = new Chart(ctx, {
    type: 'line',
    data: {
      labels: PREDICTIVE.labels,
      datasets: [
        {
          label: 'Actual',
          data: PREDICTIVE.actual,
          borderColor: '#C8C8D0',
          backgroundColor: 'rgba(200,200,208,0.06)',
          borderWidth: 2,
          pointRadius: 2,
          tension: 0.4,
          fill: false,
        },
        {
          label: 'AI Forecast',
          data: PREDICTIVE.predicted,
          borderColor: '#E8192C',
          backgroundColor: 'rgba(232,25,44,0.08)',
          borderWidth: 2,
          borderDash: [6, 3],
          pointRadius: 3,
          pointBackgroundColor: '#E8192C',
          tension: 0.4,
          fill: true,
        },
        {
          label: 'Upper Band',
          data: PREDICTIVE.upper,
          borderColor: 'rgba(232,25,44,0.25)',
          backgroundColor: 'rgba(232,25,44,0.04)',
          borderWidth: 1,
          borderDash: [3, 3],
          pointRadius: 0,
          tension: 0.4,
          fill: '-1',
        },
      ],
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      interaction: { mode: 'index', intersect: false },
      plugins: {
        tooltip: {
          ...TOOLTIP_CFG,
          callbacks: {
            label: ctx => {
              if (ctx.parsed.y === null) return null;
              return ` ${ctx.dataset.label}: ${fmtNum(ctx.parsed.y)}`;
            },
          },
        },
        legend: {
          display: true,
          position: 'top',
          align: 'end',
          labels: { boxWidth: 10, boxHeight: 10, color: '#9494A0', font: { size: 11 }, padding: 14 },
        },
      },
      scales: {
        x: { grid: GRID_CFG, ticks: { ...TICK_CFG, maxTicksLimit: 10 } },
        y: {
          grid: GRID_CFG,
          ticks: { ...TICK_CFG, callback: v => fmtNum(v) },
        },
      },
    },
  });
}

// ── Initialize all charts ────────────────────────────────────────
function initAllCharts() {
  initCampaignPerfChart();
  initPerfTrendChart();
  initChannelBarChart();
  initAgeDonutChart();
  initBudgetRevenueChart();
  initMonthlyTrendChart();
  initPredictiveChart();
}
