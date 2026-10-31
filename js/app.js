/* ============================================================
   MARKFLOW — app.js
   SPA routing, KPI counters, tables, interactions
   ============================================================ */

// ── Current page state ───────────────────────────────────────────
let currentPage = 'dashboard';
let sortState   = {};

// ── Page titles ─────────────────────────────────────────────────
const PAGE_TITLES = {
  'dashboard':   'Dashboard Overview',
  'campaigns':   'Campaign Analytics',
  'ai-optimize': 'AI Optimization',
  'audience':    'Audience Insights',
  'roi':         'ROI Tracker',
};

// ── Navigation ───────────────────────────────────────────────────
function navigateTo(pageId) {
  if (currentPage === pageId) return;
  currentPage = pageId;

  // Hide all pages
  document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));

  // Show target
  const target = document.getElementById('page-' + pageId);
  if (target) target.classList.add('active');

  // Update nav active state
  document.querySelectorAll('.nav-item').forEach(item => {
    item.classList.toggle('active', item.dataset.page === pageId);
  });

  // Update header title
  const titleEl = document.getElementById('pageTitle');
  if (titleEl) titleEl.textContent = PAGE_TITLES[pageId] || pageId;

  // Page-specific init
  if (pageId === 'ai-optimize')  initAIPage();
  if (pageId === 'audience')     initAudiencePage();
  if (pageId === 'roi')          calcROAS();

  // Close mobile sidebar
  document.getElementById('sidebar').classList.remove('open');
  const overlay = document.querySelector('.sidebar-overlay');
  if (overlay) overlay.classList.remove('show');
}

// ── KPI Counter Animation ────────────────────────────────────────
function animateKPICounters() {
  document.querySelectorAll('.kpi-value[data-target]').forEach(el => {
    const target  = parseFloat(el.dataset.target);
    const prefix  = el.dataset.prefix  || '';
    const suffix  = el.dataset.suffix  || '';
    const format  = el.dataset.format  || 'int';
    const duration = 1800;
    const start    = performance.now();

    function step(now) {
      const progress = Math.min(1, (now - start) / duration);
      const eased    = 1 - Math.pow(1 - progress, 4);
      const val      = target * eased;

      let display;
      if (format === 'abbr') {
        // Abbreviate large numbers
        if (target >= 1000000)      display = prefix + (val / 1000000).toFixed(2) + 'M';
        else if (target >= 1000)    display = prefix + (val / 1000).toFixed(1) + 'K';
        else                         display = prefix + Math.round(val) + suffix;
      } else if (format === 'float') {
        display = prefix + val.toFixed(2) + suffix;
      } else {
        display = prefix + Math.round(val) + suffix;
      }

      el.textContent = display;
      if (progress < 1) requestAnimationFrame(step);
    }
    requestAnimationFrame(step);
  });
}

// ── Build Dashboard Campaign Table ──────────────────────────────
function buildDashCampTable() {
  const tbody = document.getElementById('dashCampBody');
  if (!tbody) return;
  const rows = CAMPAIGNS.slice(0, 6);
  tbody.innerHTML = rows.map(c => `
    <tr>
      <td><strong style="color:var(--silver-head)">${c.name}</strong></td>
      <td><span class="channel-tag ${channelClass(c.channel)}">${channelIcon(c.channel)} ${c.channel}</span></td>
      <td>${formatCurrency(c.budget)}</td>
      <td>${formatCurrency(c.spend)}</td>
      <td><strong class="green">${formatCurrency(c.revenue)}</strong></td>
      <td><strong style="color:var(--silver-high)">${c.roas}x</strong></td>
      <td><span class="status-badge ${statusClass(c.status)}">${c.status}</span></td>
    </tr>
  `).join('');
}

// ── Build Full Campaign Table ────────────────────────────────────
function buildFullCampTable(data) {
  const tbody = document.getElementById('fullCampBody');
  if (!tbody) return;
  const rows = data || CAMPAIGNS;
  const countEl = document.getElementById('campTableCount');
  if (countEl) countEl.textContent = `Showing ${rows.length} of ${CAMPAIGNS.length} campaigns`;

  tbody.innerHTML = rows.map(c => `
    <tr data-channel="${c.channel}" data-status="${c.status}">
      <td><strong style="color:var(--silver-head)">${c.name}</strong></td>
      <td><span class="channel-tag ${channelClass(c.channel)}">${channelIcon(c.channel)} ${c.channel}</span></td>
      <td>${formatCurrency(c.budget)}</td>
      <td>${formatCurrency(c.spend)}</td>
      <td><strong class="green">${formatCurrency(c.revenue)}</strong></td>
      <td><strong style="color:var(--silver-high)">${c.roas}x</strong></td>
      <td>${c.ctr}</td>
      <td>${c.cpa}</td>
      <td><span class="status-badge ${statusClass(c.status)}">${c.status}</span></td>
    </tr>
  `).join('');
}

// ── Build ROI Ranking Table ──────────────────────────────────────
function buildROITable() {
  const tbody = document.getElementById('roiRankBody');
  if (!tbody) return;
  const sorted = [...CAMPAIGNS].sort((a, b) => b.roas - a.roas);
  tbody.innerHTML = sorted.map((c, i) => {
    const roi = ((c.revenue - c.spend) / c.spend * 100).toFixed(1);
    const rankHtml = i === 0 ? `<span class="rank-1">#1</span>`
                   : i === 1 ? `<span class="rank-2">#2</span>`
                   : i === 2 ? `<span class="rank-3">#3</span>`
                   : `<span class="rank-n">#${i+1}</span>`;
    return `
      <tr>
        <td>${rankHtml}</td>
        <td><strong style="color:var(--silver-head)">${c.name}</strong></td>
        <td>${formatCurrency(c.spend)}</td>
        <td><strong class="green">${formatCurrency(c.revenue)}</strong></td>
        <td><strong style="color:var(--silver-high)">${c.roas}x</strong></td>
        <td class="${parseFloat(roi) >= 200 ? 'green' : ''}">${roi}%</td>
        <td><span class="status-badge ${statusClass(c.status)}">${c.status}</span></td>
      </tr>
    `;
  }).join('');
}

// ── Helpers ──────────────────────────────────────────────────────
function channelClass(ch) {
  const map = {
    'Google Ads': 'ch-google', 'Facebook': 'ch-facebook', 'Instagram': 'ch-instagram',
    'LinkedIn': 'ch-linkedin', 'TikTok': 'ch-tiktok', 'Email': 'ch-email',
    'YouTube': 'ch-youtube', 'Twitter': 'ch-twitter',
  };
  return map[ch] || '';
}
function channelIcon(ch) {
  const map = {
    'Google Ads': '<i class="fab fa-google"></i>', 'Facebook': '<i class="fab fa-facebook"></i>',
    'Instagram': '<i class="fab fa-instagram"></i>', 'LinkedIn': '<i class="fab fa-linkedin"></i>',
    'TikTok': '<i class="fab fa-tiktok"></i>', 'Email': '<i class="fas fa-envelope"></i>',
    'YouTube': '<i class="fab fa-youtube"></i>', 'Twitter': '<i class="fab fa-twitter"></i>',
  };
  return map[ch] || '<i class="fas fa-ad"></i>';
}
function statusClass(s) {
  return s === 'Active' ? 'status-active' : s === 'Paused' ? 'status-paused' : 'status-completed';
}

// ── Filters (Campaigns page) ─────────────────────────────────────
function applyFilters() {
  const channel = document.getElementById('channelFilter')?.value || '';
  const status  = document.getElementById('statusFilter')?.value  || '';
  const filtered = CAMPAIGNS.filter(c => {
    return (!channel || c.channel === channel) && (!status || c.status === status);
  });
  buildFullCampTable(filtered);
  showToast(`Filter applied — ${filtered.length} campaigns shown.`);
}

// ── Search campaigns table ───────────────────────────────────────
function filterCampaignTable() {
  const q = (document.getElementById('campSearch')?.value || '').toLowerCase();
  const rows = document.querySelectorAll('#fullCampBody tr');
  let visible = 0;
  rows.forEach(row => {
    const text = row.textContent.toLowerCase();
    const show = text.includes(q);
    row.style.display = show ? '' : 'none';
    if (show) visible++;
  });
  const countEl = document.getElementById('campTableCount');
  if (countEl) countEl.textContent = `Showing ${visible} of ${CAMPAIGNS.length} campaigns`;
}

// ── Global search ────────────────────────────────────────────────
function setupGlobalSearch() {
  const input = document.getElementById('globalSearch');
  if (!input) return;
  input.addEventListener('keydown', e => {
    if (e.key === 'Enter' && input.value.trim()) {
      navigateTo('campaigns');
      setTimeout(() => {
        const campSearch = document.getElementById('campSearch');
        if (campSearch) { campSearch.value = input.value; filterCampaignTable(); }
        input.value = '';
      }, 100);
    }
  });
}

// ── Sort table ───────────────────────────────────────────────────
function sortTable(tableId, colIdx) {
  const table = document.getElementById(tableId);
  if (!table) return;
  const key  = tableId + colIdx;
  const asc  = sortState[key] = !sortState[key];
  const tbody = table.querySelector('tbody');
  const rows  = Array.from(tbody.querySelectorAll('tr'));
  rows.sort((a, b) => {
    const av = a.cells[colIdx]?.textContent.replace(/[\$,%Kx]/g,'').trim() || '';
    const bv = b.cells[colIdx]?.textContent.replace(/[\$,%Kx]/g,'').trim() || '';
    const an = parseFloat(av), bn = parseFloat(bv);
    if (!isNaN(an) && !isNaN(bn)) return asc ? an - bn : bn - an;
    return asc ? av.localeCompare(bv) : bv.localeCompare(av);
  });
  rows.forEach(r => tbody.appendChild(r));
}

// ── Export CSV ───────────────────────────────────────────────────
function exportCSV() {
  const headers = ['Campaign Name','Channel','Budget','Spend','Revenue','ROAS','CTR','CPA','Status'];
  const rows = CAMPAIGNS.map(c =>
    [c.name, c.channel, c.budget, c.spend, c.revenue, c.roas, c.ctr, c.cpa, c.status].join(',')
  );
  const csv = [headers.join(','), ...rows].join('\n');
  const blob = new Blob([csv], { type: 'text/csv' });
  const url  = URL.createObjectURL(blob);
  const a    = document.createElement('a');
  a.href = url; a.download = 'markflow_campaigns.csv';
  a.click();
  URL.revokeObjectURL(url);
  showToast('CSV exported successfully.');
}

// ── ROAS Calculator ──────────────────────────────────────────────
function calcROAS() {
  const spend   = parseFloat(document.getElementById('calcSpend')?.value)   || 0;
  const revenue = parseFloat(document.getElementById('calcRevenue')?.value) || 0;
  const cost    = parseFloat(document.getElementById('calcCost')?.value)    || 0;

  const roas   = spend > 0 ? revenue / spend : 0;
  const profit = revenue - spend - cost;
  const roi    = (spend + cost) > 0 ? (profit / (spend + cost) * 100) : 0;
  const margin = revenue > 0 ? (profit / revenue * 100) : 0;

  const set = (id, val) => { const el = document.getElementById(id); if (el) el.textContent = val; };
  set('calcRoas',   roas.toFixed(2) + 'x');
  set('calcRoi',    roi.toFixed(1) + '%');
  set('calcProfit', '$' + profit.toLocaleString('en-US', { maximumFractionDigits: 0 }));
  set('calcMargin', margin.toFixed(1) + '%');
}

// ── Audience page init ────────────────────────────────────────────
function initAudiencePage() {
  // Gender bars
  document.querySelectorAll('.gender-fill').forEach(bar => {
    setTimeout(() => { bar.style.width = bar.dataset.target + '%'; }, 200);
  });

  // Geo grid
  buildGeoGrid();

  // Interest tags
  buildInterestTags();
}

function buildGeoGrid() {
  const grid = document.getElementById('geoGrid');
  if (!grid || grid.children.length > 0) return;

  AUDIENCE.geoData.forEach((item, i) => {
    const opacity = 0.15 + item.intensity * 0.8;
    const r = Math.round(232 * item.intensity);
    const g = Math.round(25  * item.intensity * 0.3);
    const b = Math.round(44  * item.intensity * 0.2);
    const bg = `rgba(${r},${g},${b},${opacity})`;
    const cell = document.createElement('div');
    cell.className = 'geo-cell';
    cell.style.cssText = `background:${bg};border:1px solid rgba(232,25,44,${opacity * 0.5});animation-delay:${i*0.04}s`;
    cell.title = `${item.region}: ${item.val}%`;
    cell.innerHTML = `<span class="geo-label">${item.region}</span><span class="geo-val">${item.val}%</span>`;
    grid.appendChild(cell);
  });
}

function buildInterestTags() {
  const container = document.getElementById('interestTags');
  if (!container || container.children.length > 0) return;
  AUDIENCE.interests.forEach(tag => {
    const el = document.createElement('span');
    el.className = 'interest-tag';
    el.style.cssText = `color:${tag.color};background:${tag.bg};border:1px solid ${tag.color}44`;
    el.textContent = tag.label;
    container.appendChild(el);
  });
}

// ── Toast notification ────────────────────────────────────────────
function showToast(msg) {
  const toast = document.getElementById('toast');
  if (!toast) return;
  toast.textContent = msg;
  toast.classList.add('show');
  clearTimeout(toast._timer);
  toast._timer = setTimeout(() => toast.classList.remove('show'), 3200);
}

// ── Generate Report (modal) ───────────────────────────────────────
function setupGenerateReport() {
  const btn = document.getElementById('generateReportBtn');
  if (!btn) return;
  btn.addEventListener('click', () => {
    btn.innerHTML = '<span class="spinner"></span> Generating…';
    btn.disabled = true;
    setTimeout(() => {
      btn.innerHTML = '<i class="fas fa-file-chart-line"></i> Generate Report';
      btn.disabled = false;
      showToast('📊 Report generated — check your downloads folder.');
    }, 2000);
  });
}

// ── Sidebar mobile toggle ─────────────────────────────────────────
function setupSidebarToggle() {
  const toggleBtn = document.getElementById('sidebarToggle');
  const sidebar   = document.getElementById('sidebar');
  if (!toggleBtn || !sidebar) return;

  // Create overlay
  const overlay = document.createElement('div');
  overlay.className = 'sidebar-overlay';
  document.body.appendChild(overlay);

  toggleBtn.addEventListener('click', () => {
    sidebar.classList.toggle('open');
    overlay.classList.toggle('show');
  });
  overlay.addEventListener('click', () => {
    sidebar.classList.remove('open');
    overlay.classList.remove('show');
  });
}

// ── DOMContentLoaded ─────────────────────────────────────────────
document.addEventListener('DOMContentLoaded', () => {
  // Nav click handlers
  document.querySelectorAll('.nav-item').forEach(item => {
    item.addEventListener('click', () => navigateTo(item.dataset.page));
  });

  // Init tables
  buildDashCampTable();
  buildFullCampTable();
  buildROITable();

  // Animate KPI counters
  setTimeout(animateKPICounters, 300);

  // Init charts after short delay to ensure canvas is ready
  setTimeout(initAllCharts, 100);

  // Setup interactions
  setupGlobalSearch();
  setupSidebarToggle();
  setupGenerateReport();

  // ROAS calculator init
  calcROAS();
});
