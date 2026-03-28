// ── THEME.JS ──

const THEME_KEY = 'spark_theme';

function applyTheme(theme) {
  document.documentElement.setAttribute('data-theme', theme);
  document.documentElement.setAttribute('data-bs-theme', theme === 'light' ? 'light' : 'dark');
  localStorage.setItem(THEME_KEY, theme);
}

function toggleTheme() {
  const current = localStorage.getItem(THEME_KEY) || 'dark';
  applyTheme(current === 'dark' ? 'light' : 'dark');
  const btn = document.getElementById('theme-toggle-btn');
  if (btn) {
    btn.style.transform = 'rotate(180deg) scale(0.85)';
    setTimeout(() => { btn.style.transform = ''; }, 350);
  }
}

// Apply saved theme immediately — no flash
(function() {
  applyTheme(localStorage.getItem(THEME_KEY) || 'dark');
})();

document.addEventListener('DOMContentLoaded', () => {
  // Wire click on existing button if already in HTML (index.html)
  const existing = document.getElementById('theme-toggle-btn');
  if (existing) {
    existing.addEventListener('click', toggleTheme);
    return; // don't inject a second one
  }

  // No button found — inject one (profile, quiz, results pages)
  const nav = document.querySelector('.spark-nav .container');
  if (!nav) return;

  const btn = document.createElement('button');
  btn.className = 'theme-toggle ms-2';
  btn.id = 'theme-toggle-btn';
  btn.title = 'Toggle theme';
  btn.setAttribute('aria-label', 'Toggle light/dark mode');
  btn.style.transition = 'transform 0.3s cubic-bezier(0.34,1.56,0.64,1)';
  btn.innerHTML = `
    <svg class="icon-moon" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 12.79A9 9 0 1111.21 3 7 7 0 0021 12.79z"/></svg>
    <svg class="icon-sun" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="5"/><line x1="12" y1="1" x2="12" y2="3"/><line x1="12" y1="21" x2="12" y2="23"/><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/><line x1="1" y1="12" x2="3" y2="12"/><line x1="21" y1="12" x2="23" y2="12"/><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/></svg>
  `;
  btn.addEventListener('click', toggleTheme);
  nav.appendChild(btn);
});
