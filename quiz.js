// ── QUIZ.JS — Brick 3: Animated career quiz ──

const API = 'http://localhost/spark-backend/api';

// ── QUESTIONS BANK ──
const MEDIUM_QUESTIONS = [
  {
    category: "Work Type",
    q: "Which kind of work feels most natural to you?",
    opts: ["Working with my hands — fixing, building, making things", "Working with people — selling, serving, communicating", "Working with my mind — analysing, designing, problem-solving", "Working with systems — organising, managing, planning"]
  },
  {
    category: "Environment",
    q: "Where would you feel most comfortable working every day?",
    opts: ["Outdoors, on-site, or moving around — not stuck at a desk", "A shop, market, or place with customers and foot traffic", "An office, studio, or lab with focused work", "Different places each day — variety keeps me going"]
  },
  {
    category: "Personality",
    q: "When a task is in front of you, what drives you?",
    opts: ["Getting it done with my own hands and skills", "Making the person in front of me happy or satisfied", "Finding the smartest or most efficient way to do it", "Making sure everything is correct and well-organised"]
  },
  {
    category: "Learning",
    q: "How do you prefer to learn new skills?",
    opts: ["Watching someone do it, then trying it myself", "Reading, studying, or taking a course", "Figuring it out by trial and error on the job", "Being trained step-by-step with clear instructions"]
  },
  {
    category: "Physical",
    q: "How do you feel about physical or hands-on work?",
    opts: ["I love it — I feel productive when I use my body and hands", "It's fine occasionally but I prefer lighter work", "I strongly prefer mental or desk-based work", "I like a mix of both"]
  },
  {
    category: "People",
    q: "How much do you enjoy interacting with people during work?",
    opts: ["Constantly — I thrive on human interaction", "Regularly — but I also need solo time", "Occasionally — I prefer working independently", "Rarely — I like working alone most of the time"]
  },
  {
    category: "Motivation",
    q: "What would make you feel proudest at the end of a workday?",
    opts: ["I built, fixed, or made something with my own hands", "I helped someone solve a problem or made a sale", "I completed a complex task that required real skill", "I kept everything running smoothly and on time"]
  },
  {
    category: "Income",
    q: "What matters most about how you earn?",
    opts: ["Daily or weekly cash — I want to see money quickly", "A steady monthly salary with job security", "Commission or performance-based — the more I do, the more I earn", "Building something over time — even if it's slow at first"]
  },
  {
    category: "Tools",
    q: "Which set of tools excites you most?",
    opts: ["Spanners, drills, welders, or electrical equipment", "A phone, laptop, or register — customer-facing tools", "Design software, code, or analytical tools", "Spreadsheets, clipboards, or management systems"]
  },
  {
    category: "Vision",
    q: "In 5 years, where do you see yourself?",
    opts: ["Running my own small business or workshop", "Being a skilled specialist people trust and call first", "Growing in a company into a senior or management role", "Having a stable, respected job that pays well and is secure"]
  }
];

const LONG_EXTRA = [
  {
    category: "Skill Type",
    q: "Which skill are you most proud of or want to master?",
    opts: ["A trade skill — wiring, plumbing, carpentry, mechanics", "Sales or negotiation — convincing and closing deals", "Technical or digital — coding, design, analysis", "Leadership — managing people and projects"]
  },
  {
    category: "Independence",
    q: "Would you rather work for someone or work for yourself?",
    opts: ["For myself — I want my own business, even if it's small", "For a company — stable salary and clear career path", "Freelance or contract — freedom with some structure", "Either is fine — depends on the opportunity"]
  },
  {
    category: "Travel",
    q: "How do you feel about moving around or travelling for work?",
    opts: ["Love it — I want to be on the road or on-site daily", "Fine occasionally — but I want a home base", "Prefer to stay in one place and build a local reputation", "Happy to relocate if there's a big opportunity"]
  },
  {
    category: "Certification",
    q: "How do you feel about formal training or certifications?",
    opts: ["I'd rather learn on the job — experience beats certificates", "I'm happy to do a short course or trade apprenticeship", "I want a proper degree or professional qualification", "I already have skills — I just need the right opportunity"]
  },
  {
    category: "Customers",
    q: "How do you feel about dealing with customers directly?",
    opts: ["I love it — building relationships is my strength", "It's part of the job — I can handle it well", "I prefer working behind the scenes", "Only when needed — I'd rather focus on the technical side"]
  },
  {
    category: "Repetition",
    q: "How do you feel about repetitive tasks done really well?",
    opts: ["I thrive on mastery — doing one thing perfectly every time", "I like routine but need some variety", "I get bored quickly — I need constant new challenges", "I prefer systems that make repetition easier"]
  },
  {
    category: "Income Style",
    q: "Which income model suits you best long-term?",
    opts: ["Daily wages or cash-in-hand — predictable and immediate", "Monthly salary — security and benefits", "Project-based or contract — bigger chunks less often", "Business revenue — variable but potentially unlimited"]
  },
  {
    category: "Respect",
    q: "What does career success mean to you?",
    opts: ["Being known as the best at what I do in my area", "Having financial security and a comfortable life", "Making a real difference to people around me", "Being my own boss with freedom to make decisions"]
  },
  {
    category: "Crisis",
    q: "When something breaks down or goes wrong, you...",
    opts: ["Step in immediately — I'm calm and good under pressure", "Find the right person to fix it and coordinate the response", "Analyse what went wrong and how to prevent it", "Follow the process and escalate if needed"]
  },
  {
    category: "Legacy",
    q: "What do you want people to say about your work?",
    opts: ["He built that with his own hands — and it still stands", "She could sell anything — and always delivered", "He always found the smartest solution", "She kept the whole operation running smoothly"]
  }
];

// ── STATE ──
let questions = [];
let answers = [];
let currentQ = 0;
let timerInterval = null;
let elapsedSeconds = 0;
let quizMode = 'medium';

// ── INIT ──
document.addEventListener('DOMContentLoaded', () => {
  guardAuth();
  initCanvas();
});

async function guardAuth() {
  try {
    const res = await fetch(`${API}/auth/me.php`, { credentials: 'include' });
    const data = await res.json();
    if (data.authenticated && data.user) {
      localStorage.setItem('spark_current_user', JSON.stringify(data.user));
      const el = document.getElementById('nav-username');
      if (el) el.textContent = `👋 ${data.user.name.split(' ')[0]}`;
    } else {
      window.location.href = 'index.html';
    }
  } catch (err) {
    const user = JSON.parse(localStorage.getItem('spark_current_user') || 'null');
    if (!user) { window.location.href = 'index.html'; return; }
    const el = document.getElementById('nav-username');
    if (el) el.textContent = `👋 ${user.name.split(' ')[0]}`;
  }
}

// ── START QUIZ ──
function startQuiz(mode) {
  quizMode = mode;
  questions = mode === 'long'
    ? [...MEDIUM_QUESTIONS, ...LONG_EXTRA]
    : [...MEDIUM_QUESTIONS];

  answers = [];
  currentQ = 0;

  document.getElementById('q-total').textContent = questions.length;
  document.getElementById('intro-q-count').textContent = questions.length;

  showScreen('quiz');
  startTimer();
  renderQuestion(true);
}

// ── TIMER ──
function startTimer() {
  elapsedSeconds = 0;
  clearInterval(timerInterval);
  timerInterval = setInterval(() => {
    elapsedSeconds++;
    const m = Math.floor(elapsedSeconds / 60);
    const s = elapsedSeconds % 60;
    document.getElementById('timer-display').textContent =
      `${m}:${s.toString().padStart(2, '0')}`;
  }, 1000);
}

// ── RENDER QUESTION ──
function renderQuestion(immediate = false) {
  const card = document.getElementById('q-card');
  const q = questions[currentQ];

  const doRender = () => {
    document.getElementById('q-current').textContent = currentQ + 1;
    document.getElementById('q-category').textContent = q.category;
    document.getElementById('q-text').textContent = q.q;

    const optContainer = document.getElementById('q-options');
    optContainer.innerHTML = '';

    const letters = ['A', 'B', 'C', 'D'];
    q.opts.forEach((opt, i) => {
      const btn = document.createElement('button');
      btn.className = 'q-option';
      btn.innerHTML = `
        <div class="opt-indicator">${letters[i]}</div>
        <div class="opt-text">${opt}</div>
      `;
      btn.addEventListener('click', () => selectAnswer(i, opt, btn));
      optContainer.appendChild(btn);
    });

    // Progress
    const pct = (currentQ / questions.length) * 100;
    document.getElementById('quiz-progress').style.width = pct + '%';

    // Upgrade nudge at Q10 in long mode
    const nudge = document.getElementById('upgrade-nudge');
    if (quizMode === 'long' && currentQ === 10) {
      nudge.classList.remove('d-none');
      setTimeout(() => nudge.classList.add('d-none'), 4000);
    }

    card.classList.remove('slide-out');
    card.classList.add('slide-in');
    setTimeout(() => card.classList.remove('slide-in'), 450);
  };

  if (immediate) {
    doRender();
  } else {
    card.classList.add('slide-out');
    setTimeout(doRender, 280);
  }
}

// ── SELECT ANSWER ──
function selectAnswer(i, val, btn) {
  // Deselect all
  document.querySelectorAll('.q-option').forEach(b => b.classList.remove('selected'));
  btn.classList.add('selected');

  // Ripple
  createRipple(btn);

  // Save
  answers[currentQ] = { q: questions[currentQ].q, category: questions[currentQ].category, a: val };

  // Advance
  setTimeout(() => {
    currentQ++;
    if (currentQ < questions.length) {
      renderQuestion();
    } else {
      endQuiz();
    }
  }, 420);
}

// ── END QUIZ ──
function endQuiz() {
  clearInterval(timerInterval);
  // Show bird loader — fetchResults() will hide it when done
  SparkLoader.show('Analysing your answers', 99999, null);
  fetchResults();
}

// ── LOADING ANIMATION ──
function runLoadingAnimation() {
  const steps = ['lstep-1', 'lstep-2', 'lstep-3', 'lstep-4'];
  let i = 0;

  const advance = () => {
    if (i > 0) {
      document.getElementById(steps[i - 1]).classList.remove('active');
      document.getElementById(steps[i - 1]).classList.add('done');
    }
    if (i < steps.length) {
      document.getElementById(steps[i]).classList.add('active');
      i++;
      setTimeout(advance, 1800);
    }
  };
  advance();
}

// ── FETCH AI RESULTS ──
async function fetchResults() {
  const profile = JSON.parse(localStorage.getItem('spark_profile') || '{}');
  const answerSummary = answers
    .map((a, i) => `Q${i + 1} [${a.category}]: ${a.q}\nAnswer: ${a.a}`)
    .join('\n\n');

  const prompt = `You are a career advisor AI. A user completed a career aptitude quiz. Based on their profile and quiz answers, provide personalised career recommendations.

USER PROFILE:
Name: ${profile.name || 'User'}
Age: ${profile.age || 'Unknown'}
Location: ${profile.city || 'India'}
Education: ${profile.education || 'Unknown'}
Field of Study: ${profile.field || 'N/A'}
Status: ${profile.status || 'Unknown'}
Interests: ${(profile.interests || []).join(', ') || 'Not specified'}
Career Priority: ${profile.priority || 'Not specified'}
Additional Info: ${profile.extra || 'None'}

QUIZ ANSWERS:
${answerSummary}

Respond ONLY with a valid JSON object (no markdown, no explanation):
{
  "personality_type": "A short 3-5 word label for their personality type, e.g. 'Analytical Creative Builder'",
  "personality_summary": "2-3 sentences describing their core traits and working style based on their answers.",
  "careers": [
    {
      "title": "Career Title",
      "emoji": "single relevant emoji",
      "match_pct": 97,
      "why": "2 sentences on why this suits them specifically.",
      "salary_min": 800000,
      "salary_max": 2000000,
      "salary_label": "₹8–20 LPA",
      "path": ["Step 1 (0-1 yr)", "Step 2 (1-3 yrs)", "Step 3 (3-5 yrs)", "Step 4 (5+ yrs)"],
      "skills": ["Skill 1", "Skill 2", "Skill 3"],
      "top_companies": ["Company 1", "Company 2", "Company 3"]
    }
  ],
  "closing_note": "A warm, motivating 1-2 sentence message personalised to them."
}

Return exactly 4 careers sorted by match percentage descending. Use Indian salary figures (LPA). Be specific and genuine — avoid generic advice.`;

  try {
    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        model: 'claude-sonnet-4-20250514',
        max_tokens: 2000,
        messages: [{ role: 'user', content: prompt }]
      })
    });

    const data = await response.json();
    const text = data.content.map(b => b.text || '').join('');
    const clean = text.replace(/```json|```/g, '').trim();
    const result = JSON.parse(clean);

    localStorage.setItem('spark_results', JSON.stringify(result));
    localStorage.setItem('spark_pdf_pending', '1');

    // Save quiz results to backend database
    try {
      await fetch(`${API}/quiz/save.php`, {
        method:      'POST',
        headers:     { 'Content-Type': 'application/json' },
        credentials: 'include',
        body:        JSON.stringify({
          personality_type:    result.personality_type,
          personality_summary: result.personality_summary,
          careers:             result.careers,
          closing_note:        result.closing_note,
          quiz_mode:           quizMode,
        }),
      });
    } catch (e) { console.warn('Could not save quiz to server:', e); }

    try { SparkLoader.hide(() => { window.location.href = 'results.html'; }); }
    catch(e) { window.location.href = 'results.html'; }

  } catch (err) {
    console.error('AI fetch error:', err);
    // Fallback results
    const fallback = {
      personality_type: "Curious Analytical Thinker",
      personality_summary: "You think deeply before acting and value intellectual challenge. You're drawn to work that blends creativity with logic, and you prefer environments where your ideas are heard.",
      careers: [
        {
          title: "Product Manager", emoji: "💼", match_pct: 95,
          why: "Your blend of analytical thinking and people skills is exactly what product teams need.",
          salary_min: 1200000, salary_max: 3500000, salary_label: "₹12–35 LPA",
          path: ["Junior PM / Associate (0-2 yrs)", "Product Manager (2-4 yrs)", "Senior PM (4-7 yrs)", "VP Product / CPO (7+ yrs)"],
          skills: ["Product Strategy", "Data Analysis", "Stakeholder Management"],
          top_companies: ["Google", "Flipkart", "Razorpay"]
        },
        {
          title: "UX Designer", emoji: "🎨", match_pct: 91,
          why: "Your creative instincts and empathy for users make you a natural fit for experience design.",
          salary_min: 800000, salary_max: 2000000, salary_label: "₹8–20 LPA",
          path: ["Junior Designer (0-2 yrs)", "UX Designer (2-4 yrs)", "Senior Designer (4-6 yrs)", "Design Lead / Head of Design (6+ yrs)"],
          skills: ["Figma", "User Research", "Prototyping"],
          top_companies: ["Swiggy", "Zomato", "Meesho"]
        },
        {
          title: "Data Scientist", emoji: "📊", match_pct: 87,
          why: "Your love for deep analysis and pattern recognition aligns perfectly with data science.",
          salary_min: 1000000, salary_max: 2800000, salary_label: "₹10–28 LPA",
          path: ["Data Analyst (0-2 yrs)", "Data Scientist (2-4 yrs)", "Senior DS (4-6 yrs)", "Principal Scientist / ML Lead (6+ yrs)"],
          skills: ["Python", "Machine Learning", "Statistics"],
          top_companies: ["Amazon", "Microsoft", "Walmart Labs"]
        },
        {
          title: "Entrepreneur / Founder", emoji: "🚀", match_pct: 83,
          why: "Your comfort with uncertainty and drive to build something lasting point toward entrepreneurship.",
          salary_min: 0, salary_max: 10000000, salary_label: "Variable — unlimited upside",
          path: ["Side project / Validation (0-1 yr)", "Launch & early users (1-2 yrs)", "Scale & funding (2-4 yrs)", "Growth or exit (4+ yrs)"],
          skills: ["Product Thinking", "Sales", "Resilience"],
          top_companies: ["Build your own", "Y Combinator", "Antler India"]
        }
      ],
      closing_note: "Your mix of curiosity and drive is rare. Trust the path — every great career started with a single step."
    };

    localStorage.setItem('spark_results', JSON.stringify(fallback));
    localStorage.setItem('spark_pdf_pending', '1');
    try { SparkLoader.hide(() => { window.location.href = 'results.html'; }); }
    catch(e) { window.location.href = 'results.html'; }
  }
}

// ── SCREEN SWITCHER ──
function showScreen(id) {
  document.querySelectorAll('.quiz-screen').forEach(s => s.classList.remove('active'));
  document.getElementById(`screen-${id}`).classList.add('active');
}

// ── EXIT CONFIRM ──
function confirmExit() {
  new bootstrap.Modal(document.getElementById('exitModal')).show();
}

// ── RIPPLE ──
function createRipple(el) {
  const r = document.createElement('span');
  r.style.cssText = `
    position:absolute;border-radius:50%;
    background:rgba(240,238,232,0.06);
    width:200px;height:200px;pointer-events:none;
    transform:scale(0);animation:rippleQ 0.5s ease-out forwards;
    left:50%;top:50%;margin-left:-100px;margin-top:-100px;z-index:0;
  `;
  const s = document.createElement('style');
  s.textContent = '@keyframes rippleQ{to{transform:scale(3);opacity:0;}}';
  document.head.appendChild(s);
  el.style.position = 'relative';
  el.appendChild(r);
  setTimeout(() => r.remove(), 500);
}

// ── CANVAS BG ──
function initCanvas() {
  const canvas = document.getElementById('quiz-canvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  let W = canvas.width = window.innerWidth;
  let H = canvas.height = window.innerHeight;

  window.addEventListener('resize', () => {
    W = canvas.width = window.innerWidth;
    H = canvas.height = window.innerHeight;
  });

  // Slow drifting geometric shapes
  const shapes = Array.from({ length: 12 }, () => ({
    x: Math.random() * W, y: Math.random() * H,
    size: Math.random() * 120 + 40,
    dx: (Math.random() - 0.5) * 0.15,
    dy: (Math.random() - 0.5) * 0.15,
    alpha: Math.random() * 0.03 + 0.01,
    sides: Math.random() > 0.5 ? 4 : 6,
    rot: Math.random() * Math.PI,
    drot: (Math.random() - 0.5) * 0.002,
  }));

  function drawPolygon(ctx, x, y, r, sides, rot) {
    ctx.beginPath();
    for (let i = 0; i < sides; i++) {
      const angle = rot + (i * 2 * Math.PI) / sides;
      const px = x + r * Math.cos(angle);
      const py = y + r * Math.sin(angle);
      i === 0 ? ctx.moveTo(px, py) : ctx.lineTo(px, py);
    }
    ctx.closePath();
  }

  function draw() {
    ctx.clearRect(0, 0, W, H);
    shapes.forEach(s => {
      drawPolygon(ctx, s.x, s.y, s.size, s.sides, s.rot);
      ctx.strokeStyle = `rgba(240,238,232,${s.alpha})`;
      ctx.lineWidth = 0.5;
      ctx.stroke();
      s.x += s.dx; s.y += s.dy; s.rot += s.drot;
      if (s.x < -s.size) s.x = W + s.size;
      if (s.x > W + s.size) s.x = -s.size;
      if (s.y < -s.size) s.y = H + s.size;
      if (s.y > H + s.size) s.y = -s.size;
    });
    requestAnimationFrame(draw);
  }
  draw();
}
