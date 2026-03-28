// ── RESULTS.JS ──

const API = 'http://localhost/spark-backend/api';

// monochromatic SVG icons per career category keyword
const CAREER_ICONS = {
  default:   `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><rect x="2" y="7" width="20" height="14" rx="2"/><path d="M16 21V5a2 2 0 00-2-2h-4a2 2 0 00-2 2v16"/></svg>`,
  tech:      `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><rect x="2" y="3" width="20" height="14" rx="2"/><line x1="8" y1="21" x2="16" y2="21"/><line x1="12" y1="17" x2="12" y2="21"/></svg>`,
  data:      `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><line x1="18" y1="20" x2="18" y2="10"/><line x1="12" y1="20" x2="12" y2="4"/><line x1="6" y1="20" x2="6" y2="14"/></svg>`,
  design:    `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><circle cx="12" cy="12" r="10"/><circle cx="12" cy="12" r="3"/></svg>`,
  law:       `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M12 22V2M12 2l-4 4M12 2l4 4M4 9l4 7H4M16 9l4 7h-4"/><path d="M3 22h18"/></svg>`,
  health:    `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78L12 21.23l8.84-8.84a5.5 5.5 0 000-7.78z"/></svg>`,
  finance:   `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><line x1="12" y1="1" x2="12" y2="23"/><path d="M17 5H9.5a3.5 3.5 0 000 7h5a3.5 3.5 0 010 7H6"/></svg>`,
  edu:       `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M2 3h6a4 4 0 014 4v14a3 3 0 00-3-3H2z"/><path d="M22 3h-6a4 4 0 00-4 4v14a3 3 0 013-3h7z"/></svg>`,
  media:     `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><polygon points="23 7 16 12 23 17 23 7"/><rect x="1" y="5" width="15" height="14" rx="2"/></svg>`,
  eng:       `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><circle cx="12" cy="12" r="3"/><path d="M19.07 4.93l-1.41 1.41M4.93 4.93l1.41 1.41M19.07 19.07l-1.41-1.41M4.93 19.07l1.41-1.41M12 2v2M12 20v2M2 12h2M20 12h2"/></svg>`,
  biz:       `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><polyline points="22 7 13.5 15.5 8.5 10.5 2 17"/><polyline points="16 7 22 7 22 13"/></svg>`,
  psych:     `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M9.09 9a3 3 0 015.83 1c0 2-3 3-3 3"/><line x1="12" y1="17" x2="12.01" y2="17"/><circle cx="12" cy="12" r="10"/></svg>`,
  startup:   `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M4.5 16.5c-1.5 1.26-2 5-2 5s3.74-.5 5-2c.71-.84.7-2.13-.09-2.91a2.18 2.18 0 00-2.91-.09zM12 15l-3-3a22 22 0 012-3.95A12.88 12.88 0 0122 2c0 2.72-.78 7.5-6 11a22.35 22.35 0 01-4 2z"/></svg>`,
  electric:  `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/></svg>`,
  carpenter: `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M14.7 6.3a1 1 0 000 1.4l1.6 1.6a1 1 0 001.4 0l3.77-3.77a6 6 0 01-7.94 7.94l-6.91 6.91a2.12 2.12 0 01-3-3l6.91-6.91a6 6 0 017.94-7.94l-3.76 3.76z"/></svg>`,
  mechanic:  `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><circle cx="12" cy="12" r="3"/><path d="M19.07 4.93l-1.41 1.41M4.93 4.93l1.41 1.41M19.07 19.07l-1.41-1.41M4.93 19.07l1.41-1.41M12 2v2M12 20v2M2 12h2M20 12h2"/></svg>`,
  driver:    `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><rect x="1" y="3" width="15" height="13" rx="2"/><path d="M16 8h4l3 5v3h-7V8z"/><circle cx="5.5" cy="18.5" r="2.5"/><circle cx="18.5" cy="18.5" r="2.5"/></svg>`,
  sales:     `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2"/><circle cx="12" cy="7" r="4"/><path d="M16 11l2 2 4-4"/></svg>`,
  cook:      `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M18 8h1a4 4 0 010 8h-1"/><path d="M2 8h16v9a4 4 0 01-4 4H6a4 4 0 01-4-4V8z"/><line x1="6" y1="1" x2="6" y2="4"/><line x1="10" y1="1" x2="10" y2="4"/><line x1="14" y1="1" x2="14" y2="4"/></svg>`,
  farm:      `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z"/><path d="M12 22V12M8 12h8"/></svg>`,
  plumber:   `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M12 2v6m0 0c0 2-2 4-4 4H4m8-4c0 2 2 4 4 4h4M8 12v10M16 12v10"/></svg>`,
  retail:    `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z"/><line x1="3" y1="6" x2="21" y2="6"/><path d="M16 10a4 4 0 01-8 0"/></svg>`,
  beauty:    `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78L12 21.23l8.84-8.84a5.5 5.5 0 000-7.78z"/></svg>`,
};

function getIcon(title) {
  const t = title.toLowerCase();
  if (t.includes('electric') || t.includes('wir') || t.includes('lineman')) return CAREER_ICONS.electric;
  if (t.includes('carpen') || t.includes('wood') || t.includes('furniture') || t.includes('cabinet')) return CAREER_ICONS.carpenter;
  if (t.includes('mechan') || t.includes('auto') || t.includes('garage') || t.includes('vehicle repair')) return CAREER_ICONS.mechanic;
  if (t.includes('driver') || t.includes('truck') || t.includes('bus') || t.includes('transport') || t.includes('logistic')) return CAREER_ICONS.driver;
  if (t.includes('sales') || t.includes('salesman') || t.includes('saleswoman')) return CAREER_ICONS.sales;
  if (t.includes('cook') || t.includes('chef') || t.includes('catering') || t.includes('kitchen')) return CAREER_ICONS.cook;
  if (t.includes('farm') || t.includes('agri') || t.includes('cultivat')) return CAREER_ICONS.farm;
  if (t.includes('plumb') || t.includes('pipe') || t.includes('sanit')) return CAREER_ICONS.plumber;
  if (t.includes('retail') || t.includes('shop') || t.includes('store') || t.includes('merchant')) return CAREER_ICONS.retail;
  if (t.includes('beauty') || t.includes('salon') || t.includes('hair') || t.includes('groom') || t.includes('makeup')) return CAREER_ICONS.beauty;
  if (t.includes('software') || t.includes('developer') || t.includes('programmer')) return CAREER_ICONS.tech;
  if (t.includes('data') || t.includes('analyst') || t.includes('scientist')) return CAREER_ICONS.data;
  if (t.includes('design') || t.includes('ux') || t.includes('ui')) return CAREER_ICONS.design;
  if (t.includes('law') || t.includes('legal')) return CAREER_ICONS.law;
  if (t.includes('doctor') || t.includes('health') || t.includes('medical') || t.includes('nurse') || t.includes('surgeon')) return CAREER_ICONS.health;
  if (t.includes('financ') || t.includes('bank') || t.includes('account')) return CAREER_ICONS.finance;
  if (t.includes('teach') || t.includes('educat') || t.includes('professor')) return CAREER_ICONS.edu;
  if (t.includes('media') || t.includes('film') || t.includes('content') || t.includes('journal')) return CAREER_ICONS.media;
  if (t.includes('engineer') || t.includes('civil') || t.includes('construct') || t.includes('builder') || t.includes('mason')) return CAREER_ICONS.eng;
  if (t.includes('product') || t.includes('manager') || t.includes('business')) return CAREER_ICONS.biz;
  if (t.includes('psychol') || t.includes('counsel') || t.includes('therapist')) return CAREER_ICONS.psych;
  if (t.includes('founder') || t.includes('entrepreneur') || t.includes('startup')) return CAREER_ICONS.startup;
  return CAREER_ICONS.default;
}

// ── STATE ──
let results = null;

// ── BOOT ──
window.addEventListener('DOMContentLoaded', () => {
  startCanvas();
  document.getElementById('btn-pdf').addEventListener('click', () => downloadPDF(results));
  // Show bird loader immediately — hide once results are rendered
  SparkLoader.show('Building your career report', 6000, null);
  loadResults();
});

// ── LOAD ──
async function loadResults() {
  const profile = JSON.parse(localStorage.getItem('spark_profile') || '{}');
  const user    = JSON.parse(localStorage.getItem('spark_current_user') || '{}');
  const name    = (profile.name || user.name || 'there').split(' ')[0];
  document.getElementById('res-name').textContent = name;

  const raw = localStorage.getItem('spark_results');
  if (raw) {
    results = JSON.parse(raw);
    // small delay so bird gets at least one full pass
    setTimeout(() => {
      SparkLoader.hide(() => {
        renderAll(results);
        // Auto-download PDF if coming fresh from quiz
        if (localStorage.getItem('spark_pdf_pending') === '1') {
          localStorage.removeItem('spark_pdf_pending');
          setTimeout(() => downloadPDF(results), 800);
        }
      });
    }, 1400);
  } else {
    // Attempt backend sync
    try {
      const res = await fetch(`${API}/quiz/history.php`, { credentials: 'include' });
      const data = await res.json();
      if (data.success && data.results && data.results.length > 0) {
        results = data.results[0]; // Get most recent
        localStorage.setItem('spark_results', JSON.stringify(results));
        setTimeout(() => {
          SparkLoader.hide(() => renderAll(results));
        }, 1400);
        return;
      }
    } catch(err) {
      console.warn('Backend history fetch failed:', err);
    }
    fetchFromProfile(profile);
  }
}

// ── FETCH (fallback if no quiz results) ──
async function fetchFromProfile(profile) {
  const prompt = `Career advisor. Suggest 4 careers for this user profile.
Name:${profile.name||'User'} Age:${profile.age||'?'} City:${profile.city||'India'}
Education:${profile.education||'?'} Field:${profile.field||'?'} Status:${profile.status||'?'}
Interests:${(profile.interests||[]).join(',')} Priority:${profile.priority||'?'}

Respond ONLY valid JSON:
{"personality_type":"3-5 words","personality_summary":"2-3 sentences.","careers":[{"title":"Title","match_pct":95,"why":"2 sentences.","salary_label":"₹X–Y LPA","path":["Step 1 (0-1 yr)","Step 2 (1-3 yrs)","Step 3 (3-5 yrs)","Step 4 (5+ yrs)"],"skills":["s1","s2","s3"],"top_companies":["c1","c2","c3"]}],"closing_note":"1-2 sentences."}`;
  try {
    const res = await fetch('https://api.anthropic.com/v1/messages',{
      method:'POST', headers:{'Content-Type':'application/json'},
      body:JSON.stringify({model:'claude-sonnet-4-20250514',max_tokens:2000,messages:[{role:'user',content:prompt}]})
    });
    const data = await res.json();
    const text = data.content.map(b=>b.text||'').join('');
    results = JSON.parse(text.replace(/```json|```/g,'').trim());
    localStorage.setItem('spark_results', JSON.stringify(results));
    SparkLoader.hide(() => renderAll(results));
  } catch(e) {
    results = fallback();
    SparkLoader.hide(() => renderAll(results));
  }
}

// ── RENDER ──
function renderAll(data) {
  document.getElementById('res-type').textContent    = data.personality_type || '';
  document.getElementById('res-summary').textContent = data.personality_summary || '';

  const careers = data.careers || [];
  document.getElementById('stat-careers').textContent   = careers.length;
  document.getElementById('stat-top-match').textContent = careers[0] ? careers[0].match_pct + '%' : '—';
  document.getElementById('stat-salary').textContent    = careers[0] ? careers[0].salary_label : '—';

  const row = document.getElementById('cards-row');
  row.innerHTML = '';
  careers.forEach((c, i) => {
    const col = document.createElement('div');
    col.className = 'col-md-6 col-lg-3';
    col.innerHTML = buildCard(c, i === 0);
    row.appendChild(col);
    setTimeout(() => {
      const bar = col.querySelector('.cc-bar-fill');
      if (bar) bar.style.width = c.match_pct + '%';
    }, 350 + i * 100);
    col.querySelector('.career-card').addEventListener('click', () => openRoadmap(c));
  });
}

// ── BUILD CARD ──
function buildCard(c, isTop) {
  const icon = getIcon(c.title);
  return `
    <div class="career-card ${isTop ? 'best' : ''}">
      ${isTop ? `<div class="best-badge"><svg width="9" height="9" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/></svg> Best match</div>` : ''}
      <div class="cc-icon">${icon}</div>
      <div class="cc-top">
        <div class="cc-title">${c.title}</div>
        <div>
          <div class="cc-match-pct">${c.match_pct}%</div>
          <div class="cc-match-sub">match</div>
        </div>
      </div>
      <div class="cc-bar"><div class="cc-bar-fill"></div></div>
      <div class="cc-why">${c.why}</div>
      <div class="cc-salary">
        <span class="cc-salary-icon">
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="12" y1="1" x2="12" y2="23"/><path d="M17 5H9.5a3.5 3.5 0 000 7h5a3.5 3.5 0 010 7H6"/></svg>
        </span>
        ${c.salary_label || '—'}
      </div>
      <div class="cc-cta">
        View roadmap
        <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/></svg>
      </div>
    </div>`;
}

// ── ROADMAP ──
function openRoadmap(c) {
  const panel = document.getElementById('roadmap-panel');
  const icon  = getIcon(c.title);

  document.getElementById('rm-icon').innerHTML  = icon;
  document.getElementById('rm-title').textContent = c.title;

  // Timeline
  document.getElementById('rm-timeline').innerHTML = (c.path || []).map((step, i) => {
    const match = step.match(/^(.+?)\s*(\(.+\))?$/);
    const title = match ? match[1].trim() : step;
    const time  = match && match[2] ? match[2] : '';
    return `<div class="rm-step">
      <div class="rm-dot">${i+1}</div>
      <div>
        <div class="rm-step-title">${title}</div>
        ${time ? `<div class="rm-step-time">${time}</div>` : ''}
      </div>
    </div>`;
  }).join('');

  // Skills
  document.getElementById('rm-skills').innerHTML =
    (c.skills || []).map(s => `<span class="rm-tag">${s}</span>`).join('');

  // Companies
  document.getElementById('rm-companies').innerHTML =
    (c.top_companies || []).map(co => `<div class="rm-company">${co}</div>`).join('');

  panel.style.display = 'block';
  panel.style.animation = 'none';
  void panel.offsetHeight;
  panel.style.animation = '';

  setTimeout(() => panel.scrollIntoView({ behavior:'smooth', block:'start' }), 60);
}

function closeRoadmap() {
  const p = document.getElementById('roadmap-panel');
  p.style.transition = 'opacity 0.25s, transform 0.25s';
  p.style.opacity = '0';
  p.style.transform = 'translateY(8px)';
  setTimeout(() => {
    p.style.display = 'none';
    p.style.opacity = p.style.transform = p.style.transition = '';
  }, 260);
}

// ── PDF DOWNLOAD ──
function downloadPDF(data) {
  if (!data) { alert('Results not ready yet.'); return; }
  const { jsPDF } = window.jspdf;
  const doc = new jsPDF({ unit:'mm', format:'a4' });
  const profile = JSON.parse(localStorage.getItem('spark_profile') || '{}');
  const W = 210, M = 18;
  let y = 22;

  // helpers
  const txt = (t, x, yy, size=10, style='normal', rgb=[240,238,232]) => {
    doc.setFontSize(size); doc.setFont('helvetica', style); doc.setTextColor(...rgb);
    doc.text(String(t), x, yy);
  };
  const rule = (yy) => {
    doc.setDrawColor(40,40,44); doc.setLineWidth(0.3);
    doc.line(M, yy, W-M, yy);
  };

  // bg
  doc.setFillColor(12,12,15); doc.rect(0,0,W,297,'F');

  // header card
  doc.setFillColor(20,20,24); doc.roundedRect(M, y-8, W-M*2, 30, 3,3,'F');
  doc.setFillColor(255,107,43); doc.rect(M, y-8, 3, 30, 'F');
  txt('SPARK', M+9, y+1, 16, 'bold', [255,107,43]);
  txt('Career Discovery Report', M+9, y+9, 8, 'normal', [120,118,110]);
  txt(profile.name || 'Your Results', W-M-4, y+1, 10, 'bold', [240,238,232]);
  doc.setFontSize(7.5); doc.setTextColor(80,80,85);
  doc.text(new Date().toLocaleDateString('en-IN',{day:'numeric',month:'long',year:'numeric'}), W-M-4, y+9, {align:'right'});
  y += 32;

  // personality
  txt('PERSONALITY PROFILE', M, y, 6.5, 'bold', [255,107,43]); y += 6;
  txt(data.personality_type || '', M, y, 13, 'bold', [240,238,232]); y += 7;
  const sumLines = doc.splitTextToSize(data.personality_summary || '', W-M*2);
  doc.setFontSize(8.5); doc.setFont('helvetica','normal'); doc.setTextColor(140,138,130);
  doc.text(sumLines, M, y); y += sumLines.length * 4.8 + 8;

  rule(y); y += 8;

  // careers
  txt('YOUR CAREER MATCHES', M, y, 6.5, 'bold', [255,107,43]); y += 8;

  (data.careers || []).forEach((c, i) => {
    if (y > 248) { doc.addPage(); doc.setFillColor(12,12,15); doc.rect(0,0,W,297,'F'); y = 20; }

    // card
    doc.setFillColor(18,18,22); doc.roundedRect(M, y, W-M*2, 58, 3,3,'F');
    if (i===0) { doc.setFillColor(255,107,43); doc.roundedRect(M, y, 3, 58, 1,1,'F'); }

    // match circle
    const cx2 = W-M-18;
    doc.setDrawColor(255,107,43); doc.setLineWidth(0.8);
    doc.circle(cx2, y+14, 8, 'S');
    txt(c.match_pct+'%', cx2, y+16, 7, 'bold', [255,107,43]);
    doc.setFontSize(5.5); doc.setTextColor(100,98,90);
    doc.text('match', cx2, y+21, {align:'center'});

    const lx = M+7;
    txt(c.title, lx, y+9, 11, 'bold', [240,238,232]);

    // match bar
    const bw = W-M*2-50;
    doc.setFillColor(28,28,34); doc.roundedRect(lx, y+13, bw, 2, 1,1,'F');
    doc.setFillColor(255,107,43);
    doc.roundedRect(lx, y+13, (bw * c.match_pct/100), 2, 1,1,'F');

    txt('Salary: ' + (c.salary_label||'—'), lx, y+22, 8.5, 'normal', [200,175,80]);

    const whyLines = doc.splitTextToSize(c.why||'', W-M*2-18);
    doc.setFontSize(8); doc.setFont('helvetica','normal'); doc.setTextColor(110,108,100);
    doc.text(whyLines.slice(0,2), lx, y+30);

    const skillLine = 'Skills  ' + (c.skills||[]).join('  ·  ');
    txt(skillLine, lx, y+44, 7, 'normal', [80,78,72]);

    const pathLine = 'Path  ' + (c.path||[]).map((p,pi) => (pi+1)+'. '+p).join('   ');
    const pLines = doc.splitTextToSize(pathLine, W-M*2-14);
    doc.setFontSize(6.5); doc.setFont('helvetica','normal'); doc.setTextColor(70,68,65);
    doc.text(pLines.slice(0,2), lx, y+50);

    y += 63;
  });

  y += 4; rule(y); y += 10;

  // closing note
  if (data.closing_note) {
    const nl = doc.splitTextToSize('" ' + data.closing_note + ' "', W-M*2);
    doc.setFontSize(9); doc.setFont('helvetica','italic'); doc.setTextColor(255,107,43);
    doc.text(nl, M, y); y += nl.length * 5.5;
  }

  // footer
  doc.setFontSize(7); doc.setFont('helvetica','normal'); doc.setTextColor(45,45,50);
  doc.text('Generated by Spark  ·  spark.careers', W/2, 290, {align:'center'});

  const fname = 'spark-' + (profile.name||'results').replace(/\s+/g,'-').toLowerCase() + '.pdf';
  doc.save(fname);
}

// ── FALLBACK ──
function fallback() {
  return {
    personality_type:'Curious Analytical Thinker',
    personality_summary:'You think deeply before acting and value intellectual challenge. You thrive in environments where your ideas are heard and you can blend creativity with logic.',
    careers:[
      {title:'Product Manager',match_pct:95,why:'Your analytical thinking and empathy make you a natural PM who bridges tech and business.',salary_label:'₹12–35 LPA',path:['Associate PM (0-2 yrs)','Product Manager (2-4 yrs)','Senior PM (4-7 yrs)','VP Product / CPO (7+ yrs)'],skills:['Product Strategy','Data Analysis','Stakeholder Management'],top_companies:['Google','Flipkart','Razorpay']},
      {title:'UX Designer',match_pct:91,why:'Your creative instincts and empathy for users make you a natural at crafting experiences.',salary_label:'₹8–20 LPA',path:['Junior Designer (0-2 yrs)','UX Designer (2-4 yrs)','Senior Designer (4-6 yrs)','Design Lead (6+ yrs)'],skills:['Figma','User Research','Prototyping'],top_companies:['Swiggy','Zomato','Meesho']},
      {title:'Data Scientist',match_pct:87,why:'Your love for deep analysis and pattern recognition aligns perfectly with data science.',salary_label:'₹10–28 LPA',path:['Data Analyst (0-2 yrs)','Data Scientist (2-4 yrs)','Senior DS (4-6 yrs)','ML Lead (6+ yrs)'],skills:['Python','Machine Learning','Statistics'],top_companies:['Amazon','Microsoft','Walmart Labs']},
      {title:'Entrepreneur',match_pct:83,why:'Your drive to build and comfort with uncertainty point toward founding your own venture.',salary_label:'Variable — unlimited upside',path:['Validate idea (0-1 yr)','Launch & users (1-2 yrs)','Scale & funding (2-4 yrs)','Growth or exit (4+ yrs)'],skills:['Product Thinking','Sales','Resilience'],top_companies:['Build your own','Y Combinator','Antler India']},
    ],
    closing_note:'Your curiosity and drive are rare. Trust the path — every great career started with a single step forward.'
  };
}

// ── CANVAS ──
function startCanvas() {
  const c = document.getElementById('res-canvas');
  if (!c) return;
  const ctx = c.getContext('2d');
  let W = c.width = window.innerWidth;
  let H = c.height = window.innerHeight;
  window.addEventListener('resize', () => { W=c.width=window.innerWidth; H=c.height=window.innerHeight; });

  const shapes = Array.from({length:10}, () => ({
    x:Math.random()*W, y:Math.random()*H,
    size:Math.random()*110+40, sides:Math.random()>.5?6:4,
    rot:Math.random()*Math.PI, drot:(Math.random()-.5)*0.001,
    dx:(Math.random()-.5)*0.1, dy:(Math.random()-.5)*0.1,
    alpha:Math.random()*0.022+0.006,
  }));

  function poly(x,y,r,n,rot) {
    ctx.beginPath();
    for(let i=0;i<n;i++){const a=rot+(i*2*Math.PI/n); i?ctx.lineTo(x+r*Math.cos(a),y+r*Math.sin(a)):ctx.moveTo(x+r*Math.cos(a),y+r*Math.sin(a));}
    ctx.closePath();
  }
  (function draw(){
    ctx.clearRect(0,0,W,H);
    shapes.forEach(s=>{
      poly(s.x,s.y,s.size,s.sides,s.rot);
      ctx.strokeStyle=`rgba(240,238,232,${s.alpha})`; ctx.lineWidth=0.5; ctx.stroke();
      s.x+=s.dx; s.y+=s.dy; s.rot+=s.drot;
      if(s.x<-s.size)s.x=W+s.size; if(s.x>W+s.size)s.x=-s.size;
      if(s.y<-s.size)s.y=H+s.size; if(s.y>H+s.size)s.y=-s.size;
    });
    requestAnimationFrame(draw);
  })();
}
