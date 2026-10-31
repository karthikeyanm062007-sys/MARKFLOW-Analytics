/* ============================================================
   MARKFLOW — ai-engine.js
   Simulated AI analysis, refresh logic, scoring
   ============================================================ */

let aiRefreshing = false;

// ── AI recommendations pool ──────────────────────────────────────
const AI_RECS_POOL = [
  {
    priority: 'HIGH',
    icon: 'fa-wallet',
    title: 'Reallocate Budget to Google Ads',
    desc: 'Google Ads is outperforming Facebook by 2.3x ROAS. Shifting $8,000 could yield +$18K revenue.',
  },
  {
    priority: 'HIGH',
    icon: 'fa-crosshairs',
    title: 'Narrow Audience Targeting',
    desc: 'Age 25–34 converts at 6.1%. Focusing budget here could reduce CPA by 22%.',
  },
  {
    priority: 'MED',
    icon: 'fa-image',
    title: 'Refresh Creative Assets',
    desc: 'CTR has dropped 12% over 14 days. New creatives recommended for "Summer Blaze Q3".',
  },
  {
    priority: 'MED',
    icon: 'fa-clock',
    title: 'Adjust Ad Scheduling',
    desc: 'Peak conversions occur 7–9 PM. Increase bids by 30% during those hours.',
  },
  {
    priority: 'HIGH',
    icon: 'fa-bolt',
    title: 'Activate Retargeting Sequences',
    desc: '18% of cart abandoners can be recovered with a 3-touch retargeting sequence on Facebook.',
  },
  {
    priority: 'MED',
    icon: 'fa-language',
    title: 'Test Spanish Language Variants',
    desc: 'Hispanic audience segment shows 2.4x engagement but receives <8% of current budget.',
  },
  {
    priority: 'LOW',
    icon: 'fa-mobile-alt',
    title: 'Mobile-First Creative Optimization',
    desc: '62% traffic is mobile yet desktop creative is used. Mobile-optimized assets lift CTR +19%.',
  },
  {
    priority: 'HIGH',
    icon: 'fa-envelope',
    title: 'Email Drip Sequence Upgrade',
    desc: 'Newsletter ROAS is 8.3x — highest across all channels. 3x current email send frequency.',
  },
];

// ── Render AI recommendation cards ──────────────────────────────
function renderAIRecs(recs) {
  const list = document.getElementById('aiRecList');
  if (!list) return;

  list.innerHTML = '';
  recs.forEach((rec, i) => {
    const div = document.createElement('div');
    div.className = 'ai-rec-item';
    div.style.animationDelay = `${i * 0.07}s`;
    const badgeClass = rec.priority === 'HIGH' ? 'badge-high' : rec.priority === 'MED' ? 'badge-med' : 'badge-low';
    div.innerHTML = `
      <div class="rec-top">
        <span class="badge ${badgeClass}">${rec.priority}</span>
        <i class="fas ${rec.icon} rec-icon"></i>
      </div>
      <p class="rec-title">${rec.title}</p>
      <p class="rec-desc">${rec.desc}</p>
      <button class="btn-apply" onclick="applyRec(this)">Apply <i class="fas fa-check"></i></button>
    `;
    list.appendChild(div);
  });
}

// ── Apply recommendation ─────────────────────────────────────────
function applyRec(btn) {
  if (btn.classList.contains('applied')) return;
  btn.classList.add('applied');
  btn.innerHTML = '<i class="fas fa-check-circle"></i> Applied';
  btn.disabled = true;

  const title = btn.closest('.ai-rec-item').querySelector('.rec-title').textContent;
  showToast(`✓ Applied: "${title}"`);

  // Update score by +1 (max 100)
  const scoreEl = document.getElementById('aiScoreVal');
  if (scoreEl) {
    const cur = parseInt(scoreEl.textContent) || 94;
    if (cur < 100) {
      scoreEl.textContent = Math.min(100, cur + 1);
      animateCircularScore(Math.min(100, cur + 1));
    }
  }
}

// ── Apply optimization card ──────────────────────────────────────
function applyOpt(btn, name) {
  if (btn.disabled) return;
  btn.innerHTML = '<span class="spinner"></span> Applying…';
  btn.disabled = true;
  setTimeout(() => {
    btn.innerHTML = '<i class="fas fa-check"></i> Applied';
    btn.style.background = 'rgba(34,197,94,0.15)';
    btn.style.borderColor = 'var(--green)';
    btn.style.color = 'var(--green)';
    showToast(`✓ "${name}" optimization applied successfully.`);
  }, 1400);
}

// ── Refresh AI analysis ──────────────────────────────────────────
function refreshAI() {
  if (aiRefreshing) return;
  aiRefreshing = true;

  const btn  = document.getElementById('refreshAiBtn');
  const icon = document.getElementById('refreshIcon');
  if (!btn || !icon) return;

  btn.disabled = true;
  icon.className = 'fas fa-sync-alt rotating';
  btn.innerHTML = '<span class="spinner"></span> Analyzing…';

  // Shimmer the list
  const list = document.getElementById('aiRecList');
  if (list) {
    list.innerHTML = Array(4).fill(0).map(() => `
      <div class="ai-rec-item">
        <div class="shimmer" style="height:12px;width:60%;margin-bottom:10px;"></div>
        <div class="shimmer" style="height:10px;width:90%;margin-bottom:6px;"></div>
        <div class="shimmer" style="height:10px;width:75%;"></div>
      </div>
    `).join('');
  }

  // New AI score
  const newScore = Math.min(100, 90 + Math.floor(Math.random() * 9));

  setTimeout(() => {
    // Pick 4 random recs
    const shuffled = [...AI_RECS_POOL].sort(() => Math.random() - 0.5).slice(0, 4);
    renderAIRecs(shuffled);

    // Update score
    const scoreEl = document.getElementById('aiScoreVal');
    if (scoreEl) {
      scoreEl.textContent = newScore;
      animateCircularScore(newScore);
    }

    btn.disabled  = false;
    btn.innerHTML = '<i class="fas fa-sync-alt" id="refreshIcon"></i> Refresh Analysis';
    aiRefreshing  = false;
    showToast('AI analysis refreshed — ' + shuffled.length + ' recommendations updated.');
  }, 2400);
}

// ── Animate circular progress ────────────────────────────────────
function animateCircularScore(pct) {
  const circle = document.getElementById('aiScoreCircle');
  if (!circle) return;
  const circumference = 326.7;
  const offset = circumference - (pct / 100) * circumference;
  circle.style.strokeDashoffset = offset;
}

// ── Initialize AI page elements ──────────────────────────────────
function initAIPage() {
  // Animate score circle
  setTimeout(() => animateCircularScore(94), 400);

  // Counter for score display
  const scoreEl = document.getElementById('aiScoreVal');
  if (scoreEl) animateCounter(scoreEl, 0, 94, 1200);
}

// ── Tiny counter helper ──────────────────────────────────────────
function animateCounter(el, from, to, duration) {
  const start = performance.now();
  function step(now) {
    const progress = Math.min(1, (now - start) / duration);
    const eased = 1 - Math.pow(1 - progress, 3);
    el.textContent = Math.round(from + (to - from) * eased);
    if (progress < 1) requestAnimationFrame(step);
  }
  requestAnimationFrame(step);
}
