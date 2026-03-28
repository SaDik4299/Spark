// ── SPARK APP.JS — Connected to PHP backend ──

const API = 'http://localhost/spark-backend/api';

// ── DOM READY ──
document.addEventListener('DOMContentLoaded', () => {

  // Panel switching — Login ↔ Signup
  document.getElementById('go-signup').addEventListener('click', (e) => {
    e.preventDefault();
    document.getElementById('panel-login').classList.add('d-none');
    document.getElementById('panel-signup').classList.remove('d-none');
    clearErrors();
  });

  document.getElementById('go-login').addEventListener('click', (e) => {
    e.preventDefault();
    document.getElementById('panel-signup').classList.add('d-none');
    document.getElementById('panel-login').classList.remove('d-none');
    clearErrors();
  });

  // ── LOGIN ──
  document.getElementById('login-btn').addEventListener('click', async () => {
    const email    = document.getElementById('login-email').value.trim();
    const password = document.getElementById('login-password').value.trim();

    if (!email || !password) {
      document.getElementById('login-error').textContent = 'Please fill in all fields.';
      return;
    }

    setLoading('login-btn', true);

    try {
      const res  = await fetch(`${API}/auth/login.php`, {
        method:      'POST',
        headers:     { 'Content-Type': 'application/json' },
        credentials: 'include',
        body:        JSON.stringify({ email, password }),
      });
      const data = await res.json();

      if (data.error) {
        document.getElementById('login-error').textContent = data.error;
      } else {
        // Save to localStorage so other pages know who is logged in
        localStorage.setItem('spark_current_user', JSON.stringify(data.user));
        onLoginSuccess(data.user);
      }
    } catch (err) {
      document.getElementById('login-error').textContent = 'Could not connect to server. Is XAMPP running?';
    }

    setLoading('login-btn', false);
  });

  // ── SIGNUP ──
  document.getElementById('signup-btn').addEventListener('click', async () => {
    const name     = document.getElementById('signup-name').value.trim();
    const email    = document.getElementById('signup-email').value.trim();
    const password = document.getElementById('signup-password').value.trim();

    if (!name || !email || !password) {
      document.getElementById('signup-error').textContent = 'Please fill in all fields.';
      return;
    }
    if (password.length < 8) {
      document.getElementById('signup-error').textContent = 'Password must be at least 8 characters.';
      return;
    }

    setLoading('signup-btn', true);

    try {
      const res  = await fetch(`${API}/auth/signup.php`, {
        method:      'POST',
        headers:     { 'Content-Type': 'application/json' },
        credentials: 'include',
        body:        JSON.stringify({ name, email, password }),
      });
      const data = await res.json();

      if (data.error) {
        document.getElementById('signup-error').textContent = data.error;
      } else {
        localStorage.setItem('spark_current_user', JSON.stringify(data.user));
        onLoginSuccess(data.user);
      }
    } catch (err) {
      document.getElementById('signup-error').textContent = 'Could not connect to server. Is XAMPP running?';
    }

    setLoading('signup-btn', false);
  });

  // Enter key support
  document.querySelectorAll('.spark-input').forEach(input => {
    input.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') {
        const loginPanel  = document.getElementById('panel-login');
        const signupPanel = document.getElementById('panel-signup');
        if (!loginPanel.classList.contains('d-none'))  document.getElementById('login-btn').click();
        else if (!signupPanel.classList.contains('d-none')) document.getElementById('signup-btn').click();
      }
    });
  });

  // Check if already logged in on page load
  checkSession();
});

// ── CHECK SESSION ──
async function checkSession() {
  try {
    const res  = await fetch(`${API}/auth/me.php`, { credentials: 'include' });
    const data = await res.json();
    if (data.authenticated && data.user) {
      localStorage.setItem('spark_current_user', JSON.stringify(data.user));
      updateNavForUser(data.user);
    }
  } catch (err) {
    // Server not reachable — fall back to localStorage
    const user = JSON.parse(localStorage.getItem('spark_current_user') || 'null');
    if (user) updateNavForUser(user);
  }
}

// ── ON SUCCESSFUL AUTH ──
function onLoginSuccess(user) {
  const modal = bootstrap.Modal.getInstance(document.getElementById('authModal'));
  if (modal) modal.hide();
  updateNavForUser(user);

  setTimeout(() => {
    SparkLoader.show(`Welcome, ${user.name.split(' ')[0]}!`, 2000, () => {
      window.location.href = 'profile.html';
    });
  }, 200);
}

// ── NAV UPDATE ──
function updateNavForUser(user) {
  const signinBtn = document.getElementById('signin-nav');
  const signupBtn = document.getElementById('signup-nav');
  if (signinBtn) {
    signinBtn.outerHTML = `<span class="text-secondary small">👋 ${user.name.split(' ')[0]}</span>`;
  }
  if (signupBtn) {
    signupBtn.textContent = 'Dashboard';
    signupBtn.removeAttribute('data-bs-toggle');
    signupBtn.removeAttribute('data-bs-target');
    signupBtn.addEventListener('click', () => window.location.href = 'profile.html');
  }
}

// ── LOADING STATE ON BUTTON ──
function setLoading(btnId, loading) {
  const btn = document.getElementById(btnId);
  if (!btn) return;
  if (loading) {
    btn.disabled = true;
    btn.dataset.originalText = btn.innerHTML;
    btn.innerHTML = '<span class="spinner-border spinner-border-sm me-2"></span>Please wait...';
  } else {
    btn.disabled = false;
    btn.innerHTML = btn.dataset.originalText || btn.innerHTML;
  }
}

// ── UTILS ──
function clearErrors() {
  const le = document.getElementById('login-error');
  const se = document.getElementById('signup-error');
  if (le) le.textContent = '';
  if (se) se.textContent = '';
}
