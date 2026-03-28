// ── PROFILE.JS — clean rebuild ──

// ── SPARK API ──
const API = 'http://localhost/spark-backend/api';

// ── STATE ──
let step = 1;
let eduVal = '';
let interests = [];
let priorityVal = '';

// ── BOOT ──
window.addEventListener('DOMContentLoaded', () => {
  setupAuth();
  setupEdu();
  setupTags();
  setupPriority();
  startCanvas();
  updateStepper();
  updateBar();
  prefill();
});

// ── AUTH ──
async function setupAuth() {
  try {
    const res = await fetch(`${API}/auth/me.php`, { credentials: 'include' });
    const data = await res.json();
    if (data.authenticated && data.user) {
      localStorage.setItem('spark_current_user', JSON.stringify(data.user));
      const el = document.getElementById('nav-user');
      if (el) el.textContent = '👋 ' + data.user.name.split(' ')[0];
    } else {
      window.location.href = 'index.html'; // User not logged in
    }
  } catch (err) {
    // Server offline, fallback to localStorage
    let user = JSON.parse(localStorage.getItem('spark_current_user') || 'null');
    if (!user) { window.location.href = 'index.html'; return; }
    const el = document.getElementById('nav-user');
    if (el) el.textContent = '👋 ' + user.name.split(' ')[0];
  }

  document.getElementById('btn-logout').addEventListener('click', async () => {
    try { await fetch(`${API}/auth/logout.php`, { method: 'POST', credentials: 'include' }); } catch(e) {}
    localStorage.clear();
    window.location.href = 'index.html';
  });
}

async function prefill() {
  try {
    const res = await fetch(`${API}/profile/get.php`, { credentials: 'include' });
    const data = await res.json();
    if (data.success && data.profile) {
       const p = data.profile;
       if (p.name) document.getElementById('p-name').value = p.name;
       if (p.age && p.age !== '0') document.getElementById('p-age').value = p.age;
       if (p.city) document.getElementById('p-city').value = p.city;
       
       if (p.education) {
         eduVal = p.education;
         document.querySelectorAll('.sp-edu-btn').forEach(b => {
           if (b.dataset.val === eduVal) b.classList.add('selected');
           else b.classList.remove('selected');
         });
       }
       if (p.status) document.getElementById('p-status').value = p.status;
       
       if (p.priority) {
         priorityVal = p.priority;
         document.querySelectorAll('.sp-priority-btn').forEach(b => {
           if (b.dataset.val === priorityVal) b.classList.add('selected');
           else b.classList.remove('selected');
         });
       }

       localStorage.setItem('spark_profile', JSON.stringify(p));
       return;
    }
  } catch (e) {}

  // Fallback to just user name
  const user = JSON.parse(localStorage.getItem('spark_current_user') || 'null');
  const n = document.getElementById('p-name');
  if (user && n && user.name !== 'Guest') n.value = user.name;
}

// ── THE ONLY NAVIGATION FUNCTION ──
function showPanel(n) {
  // hide current
  const cur = document.getElementById('step-' + step);
  if (cur) cur.style.display = 'none';

  // show target
  step = n;
  const nxt = document.getElementById('step-' + step);
  if (nxt) {
    nxt.style.display = 'block';
    // retrigger animation by cloning
    nxt.style.animation = 'none';
    void nxt.offsetHeight;
    nxt.style.animation = '';
  }

  updateStepper();
  updateBar();
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

// ── NEXT (called from HTML onclick) ──
function goNext(from) {
  const err = validate(from);
  if (err) { setErr(from, err); return; }
  clearErr(from);

  if (from === 4) {
    saveProfile();
    showDone();
    return;
  }

  showPanel(from + 1);
}

// ── BACK (called from HTML onclick) ──
function goBack(from) {
  clearErr(from);
  showPanel(from - 1);
}

// ── VALIDATE ──
function validate(s) {
  if (s === 1) {
    if (!val('p-name'))                             return 'Please enter your full name.';
    const age = parseInt(val('p-age'));
    if (!age || age < 13 || age > 65)               return 'Please enter a valid age (13–65).';
    if (!val('p-city'))                             return 'Please enter your city.';
  }
  if (s === 2) {
    if (!eduVal)                                    return 'Please select your education level.';
    if (!val('p-status'))                           return 'Please select your current status.';
  }
  if (s === 3) {
    if (interests.length < 2)                       return 'Please select at least 2 interests.';
  }
  if (s === 4) {
    if (!priorityVal)                               return 'Please select what matters most to you.';
  }
  return null;
}

function val(id) {
  const el = document.getElementById(id);
  return el ? el.value.trim() : '';
}

function setErr(s, msg) {
  const el = document.getElementById('err-' + s);
  if (!el) return;
  el.textContent = msg;
  el.classList.remove('shake');
  void el.offsetHeight;
  el.classList.add('shake');
}

function clearErr(s) {
  const el = document.getElementById('err-' + s);
  if (el) { el.textContent = ''; el.classList.remove('shake'); }
}

// ── STEPPER UI ──
function updateStepper() {
  document.querySelectorAll('.sp-step').forEach(item => {
    const n = parseInt(item.dataset.n);
    item.classList.remove('active', 'done');
    if (n === step)     item.classList.add('active');
    else if (n < step)  item.classList.add('done');
  });

  // lines between steps
  for (let i = 1; i <= 3; i++) {
    const line = document.getElementById('line-' + i);
    if (line) line.classList.toggle('done', i < step);
  }
}

function updateBar() {
  const pct = ((step - 1) / 4) * 100;
  const fill = document.getElementById('top-bar-fill');
  if (fill) fill.style.width = pct + '%';
}

// ── EDU BUTTONS ──
function setupEdu() {
  document.querySelectorAll('.sp-edu-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('.sp-edu-btn').forEach(b => b.classList.remove('selected'));
      btn.classList.add('selected');
      eduVal = btn.dataset.val;
    });
  });
}

// ── INTEREST TAGS ──
function setupTags() {
  document.querySelectorAll('.sp-tag').forEach(btn => {
    btn.addEventListener('click', () => {
      const v = btn.dataset.val;
      btn.classList.toggle('selected');
      if (btn.classList.contains('selected')) {
        interests.push(v);
      } else {
        interests = interests.filter(x => x !== v);
      }
    });
  });
}

// ── PRIORITY BUTTONS ──
function setupPriority() {
  document.querySelectorAll('.sp-priority-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('.sp-priority-btn').forEach(b => b.classList.remove('selected'));
      btn.classList.add('selected');
      priorityVal = btn.dataset.val;
    });
  });
}

// ── SAVE ──
async function saveProfile() {
  const profile = {
    name:      val('p-name'),
    age:       val('p-age'),
    city:      val('p-city'),
    gender:    val('p-gender'),
    education: eduVal,
    field:     val('p-field'),
    status:    val('p-status'),
    interests: interests,
    priority:  priorityVal,
    extra:     val('p-extra'),
  };
  // Save to localStorage for quick access
  localStorage.setItem('spark_profile', JSON.stringify(profile));

  // Save to backend database
  try {
    await fetch(`${API}/profile/save.php`, {
      method:      'POST',
      headers:     { 'Content-Type': 'application/json' },
      credentials: 'include',
      body:        JSON.stringify(profile),
    });
  } catch (err) {
    console.warn('Could not save profile to server:', err);
  }
}

// ── DONE SCREEN ──
function showDone() {
  // hide all steps
  [1,2,3,4].forEach(n => {
    const el = document.getElementById('step-' + n);
    if (el) el.style.display = 'none';
  });

  // fill bar 100%
  document.getElementById('top-bar-fill').style.width = '100%';

  // mark all stepper done
  document.querySelectorAll('.sp-step').forEach(i => {
    i.classList.remove('active');
    i.classList.add('done');
  });
  [1,2,3].forEach(i => {
    const l = document.getElementById('line-' + i);
    if (l) l.classList.add('done');
  });

  // set name
  const user = JSON.parse(localStorage.getItem('spark_current_user') || '{}');
  const doneEl = document.getElementById('done-name');
  if (doneEl) doneEl.textContent = (user.name || 'there').split(' ')[0];

  // show done panel
  const done = document.getElementById('step-done');
  done.style.display = 'block';
  done.style.animation = 'none';
  void done.offsetHeight;
  done.style.animation = '';

  confetti();
}

// ── CONFETTI ──
function confetti() {
  const colors = ['#FF6B2B', '#ffaa66', '#ffffff', '#ffd700'];
  for (let i = 0; i < 70; i++) {
    setTimeout(() => {
      const d = document.createElement('div');
      const c = colors[Math.floor(Math.random() * colors.length)];
      const sz = Math.random() * 9 + 4;
      const dur = (Math.random() * 1.8 + 1.4).toFixed(2);
      d.style.cssText = `position:fixed;top:-16px;left:${Math.random()*100}%;width:${sz}px;height:${sz}px;background:${c};border-radius:${Math.random()>.5?'50%':'3px'};z-index:9999;pointer-events:none;animation:cfall ${dur}s ease-in forwards`;
      document.body.appendChild(d);
      setTimeout(() => d.remove(), parseFloat(dur) * 1000 + 200);
    }, i * 28);
  }
}

// inject confetti keyframe once
const s = document.createElement('style');
s.textContent = '@keyframes cfall{0%{transform:translateY(0) rotate(0deg);opacity:1}100%{transform:translateY(105vh) rotate(600deg);opacity:0}}';
document.head.appendChild(s);

// ── CANVAS BACKGROUND ──
function startCanvas() {
  const canvas = document.getElementById('bg-canvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  let W = canvas.width = window.innerWidth;
  let H = canvas.height = window.innerHeight;

  window.addEventListener('resize', () => {
    W = canvas.width = window.innerWidth;
    H = canvas.height = window.innerHeight;
  });

  const pts = Array.from({ length: 55 }, () => ({
    x: Math.random() * W, y: Math.random() * H,
    r: Math.random() * 1.8 + 0.4,
    dx: (Math.random() - 0.5) * 0.35,
    dy: (Math.random() - 0.5) * 0.35,
    a: Math.random() * 0.45 + 0.08,
  }));

  (function draw() {
    ctx.clearRect(0, 0, W, H);
    pts.forEach(p => {
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(255,107,43,${p.a})`;
      ctx.fill();
      p.x += p.dx; p.y += p.dy;
      if (p.x < 0 || p.x > W) p.dx *= -1;
      if (p.y < 0 || p.y > H) p.dy *= -1;
    });

    for (let i = 0; i < pts.length; i++) {
      for (let j = i + 1; j < pts.length; j++) {
        const dx = pts[i].x - pts[j].x;
        const dy = pts[i].y - pts[j].y;
        const d = Math.sqrt(dx*dx + dy*dy);
        if (d < 110) {
          ctx.beginPath();
          ctx.moveTo(pts[i].x, pts[i].y);
          ctx.lineTo(pts[j].x, pts[j].y);
          ctx.strokeStyle = `rgba(255,107,43,${0.07 * (1 - d/110)})`;
          ctx.lineWidth = 0.5;
          ctx.stroke();
        }
      }
    }
    requestAnimationFrame(draw);
  })();
}
