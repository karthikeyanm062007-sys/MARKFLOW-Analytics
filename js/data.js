/* ============================================================
   MARKFLOW — data.js
   Realistic mock data for the platform
   ============================================================ */

// ── 30-Day labels ──────────────────────────────────────────────
const DAYS_30 = (() => {
  const labels = [];
  const now = new Date();
  for (let i = 29; i >= 0; i--) {
    const d = new Date(now);
    d.setDate(d.getDate() - i);
    labels.push(d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }));
  }
  return labels;
})();

// ── Helper ──────────────────────────────────────────────────────
function rand(min, max, dec = 0) {
  const val = Math.random() * (max - min) + min;
  return dec ? parseFloat(val.toFixed(dec)) : Math.round(val);
}
function trend(start, end, len, noise = 0.12) {
  return Array.from({ length: len }, (_, i) => {
    const base = start + (end - start) * (i / (len - 1));
    return Math.max(0, Math.round(base * (1 + (Math.random() - 0.5) * 2 * noise)));
  });
}

// ── Daily performance data (30 days) ───────────────────────────
const PERF_DATA = {
  labels: DAYS_30,
  impressions: trend(210000, 340000, 30, 0.15),
  clicks:      trend(8200,  14800,  30, 0.18),
  conversions: trend(310,   680,    30, 0.20),
};

// ── Campaigns ───────────────────────────────────────────────────
const CAMPAIGNS = [
  {
    name: 'Summer Blaze Q3',
    channel: 'Google Ads',
    budget: 48000,
    spend:  42300,
    revenue: 198400,
    roas: 4.69,
    ctr: '5.2%',
    cpa: '$62',
    status: 'Active',
    impressions: 2840000,
    clicks: 147600,
  },
  {
    name: 'Enterprise Lead Gen',
    channel: 'LinkedIn',
    budget: 35000,
    spend:  33800,
    revenue: 124600,
    roas: 3.69,
    ctr: '2.8%',
    cpa: '$124',
    status: 'Active',
    impressions: 1240000,
    clicks: 34700,
  },
  {
    name: 'Retargeting Wave 5',
    channel: 'Facebook',
    budget: 22000,
    spend:  21100,
    revenue: 98400,
    roas: 4.66,
    ctr: '6.1%',
    cpa: '$41',
    status: 'Active',
    impressions: 980000,
    clicks: 59800,
  },
  {
    name: 'Brand Awareness Blitz',
    channel: 'Instagram',
    budget: 18000,
    spend:  17200,
    revenue: 52000,
    roas: 3.02,
    ctr: '3.9%',
    cpa: '$88',
    status: 'Paused',
    impressions: 3200000,
    clicks: 124800,
  },
  {
    name: 'Holiday Flash Sale',
    channel: 'TikTok',
    budget: 12000,
    spend:  12000,
    revenue: 61400,
    roas: 5.12,
    ctr: '7.4%',
    cpa: '$38',
    status: 'Completed',
    impressions: 5600000,
    clicks: 414400,
  },
  {
    name: 'Newsletter Nurture',
    channel: 'Email',
    budget: 6500,
    spend:  5800,
    revenue: 48200,
    roas: 8.31,
    ctr: '24.6%',
    cpa: '$18',
    status: 'Active',
    impressions: 240000,
    clicks: 59000,
  },
  {
    name: 'Product Launch Alpha',
    channel: 'Google Ads',
    budget: 55000,
    spend:  49200,
    revenue: 218000,
    roas: 4.43,
    ctr: '4.8%',
    cpa: '$74',
    status: 'Active',
    impressions: 3100000,
    clicks: 148800,
  },
  {
    name: 'Video Discovery Push',
    channel: 'TikTok',
    budget: 28000,
    spend:  24600,
    revenue: 76800,
    roas: 3.12,
    ctr: '4.1%',
    cpa: '$96',
    status: 'Paused',
    impressions: 8400000,
    clicks: 344400,
  },
];

// ── Audience demographics ───────────────────────────────────────
const AUDIENCE = {
  ageGroups: {
    labels: ['18–24', '25–34', '35–44', '45–54', '55–64', '65+'],
    data:   [18, 31, 24, 14, 9, 4],
    colors: ['#E8192C','#FF6B7A','#B01020','#9494A0','#6E7FFF','#A855F7'],
  },
  geoData: [
    { region: 'California',  val: 18.4, intensity: 0.95 },
    { region: 'Texas',       val: 12.1, intensity: 0.72 },
    { region: 'New York',    val: 11.8, intensity: 0.70 },
    { region: 'Florida',     val: 9.4,  intensity: 0.60 },
    { region: 'Illinois',    val: 6.2,  intensity: 0.44 },
    { region: 'Washington',  val: 5.8,  intensity: 0.42 },
    { region: 'Georgia',     val: 5.1,  intensity: 0.38 },
    { region: 'Colorado',    val: 4.8,  intensity: 0.36 },
    { region: 'Arizona',     val: 4.4,  intensity: 0.34 },
    { region: 'Ohio',        val: 4.2,  intensity: 0.32 },
    { region: 'N. Carolina', val: 3.8,  intensity: 0.30 },
    { region: 'Virginia',    val: 3.6,  intensity: 0.28 },
    { region: 'Michigan',    val: 3.4,  intensity: 0.26 },
    { region: 'Penn.',       val: 3.2,  intensity: 0.24 },
    { region: 'Minnesota',   val: 2.8,  intensity: 0.22 },
    { region: 'Oregon',      val: 2.4,  intensity: 0.18 },
  ],
  interests: [
    { label: 'SaaS & Tech',       color: '#3B82F6', bg: 'rgba(59,130,246,0.12)' },
    { label: 'E-Commerce',        color: '#E8192C', bg: 'rgba(232,25,44,0.12)' },
    { label: 'Digital Marketing', color: '#A855F7', bg: 'rgba(168,85,247,0.12)' },
    { label: 'Finance & Invest.', color: '#22C55E', bg: 'rgba(34,197,94,0.12)' },
    { label: 'Health & Wellness', color: '#F59E0B', bg: 'rgba(245,158,11,0.12)' },
    { label: 'Gaming',            color: '#06B6D4', bg: 'rgba(6,182,212,0.12)' },
    { label: 'Travel',            color: '#FF6B7A', bg: 'rgba(255,107,122,0.12)' },
    { label: 'Productivity Apps', color: '#8B5CF6', bg: 'rgba(139,92,246,0.12)' },
    { label: 'Luxury Goods',      color: '#D4A0FF', bg: 'rgba(212,160,255,0.12)' },
    { label: 'Sports & Fitness',  color: '#34D399', bg: 'rgba(52,211,153,0.12)' },
    { label: 'Food & Beverage',   color: '#FB923C', bg: 'rgba(251,146,60,0.12)' },
    { label: 'Real Estate',       color: '#FBBF24', bg: 'rgba(251,191,36,0.12)' },
    { label: 'Online Education',  color: '#60A5FA', bg: 'rgba(96,165,250,0.12)' },
    { label: 'B2B Enterprise',    color: '#9CA3AF', bg: 'rgba(156,163,175,0.12)' },
  ],
};

// ── Monthly budget / revenue (12 months) ───────────────────────
const MONTHLY = {
  labels:  ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'],
  budget:  [38000,42000,45000,48000,50000,52000,55000,58000,60000,48000,52000,65000],
  spend:   [35200,39400,42100,44800,47200,49600,52100,55300,57400,45800,49600,62100],
  revenue: [148000,162000,178000,196000,214000,228000,244000,264000,282000,218000,238000,310000],
};

// ── Predictive data (next 30 days) ─────────────────────────────
const PREDICTIVE = (() => {
  const actual = trend(290000, 380000, 30, 0.12);
  const predicted = actual.map((v, i) => {
    if (i < 15) return null;
    return Math.round(v * (1 + rand(3, 9, 2) / 100));
  });
  return {
    labels: DAYS_30,
    actual,
    predicted,
    upper: predicted.map(v => v ? Math.round(v * 1.08) : null),
    lower: predicted.map(v => v ? Math.round(v * 0.93) : null),
  };
})();

// ── Channel performance ─────────────────────────────────────────
const CHANNEL_PERF = {
  labels:  ['Google Ads','LinkedIn','Facebook','Instagram','TikTok','Email'],
  revenue: [416400, 124600, 98400, 52000, 138200, 48200],
  colors:  ['#4285F4','#0A66C2','#1877F2','#E1306C','#FE2C55','#F59E0B'],
};

// ── Performance trend (area, for campaigns page) ────────────────
const PERF_TREND = {
  labels: DAYS_30,
  google:    trend(62000, 98000, 30, 0.14),
  facebook:  trend(28000, 38000, 30, 0.18),
  instagram: trend(14000, 22000, 30, 0.20),
  linkedin:  trend(18000, 32000, 30, 0.16),
};

// ── Format helpers ──────────────────────────────────────────────
function formatCurrency(val) {
  if (val >= 1000000) return '$' + (val / 1000000).toFixed(2) + 'M';
  if (val >= 1000)    return '$' + (val / 1000).toFixed(1) + 'K';
  return '$' + val.toLocaleString();
}
function fmtNum(val) {
  return val >= 1000 ? (val/1000).toFixed(1)+'K' : val.toString();
}
