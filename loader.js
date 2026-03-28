// ── LOADER.JS — flying bird transition ──

// Inject the loader HTML once
function createLoader(statusText) {
  if (document.getElementById('spark-loader')) return;

  const div = document.createElement('div');
  div.id = 'spark-loader';
  div.innerHTML = `
    <div class="loader-track">
      <div class="loader-trail"></div>
      <img class="loader-bird" src="logo.png" alt="" id="loader-bird-img"/>
    </div>
    <div class="loader-bar-wrap">
      <div class="loader-bar-fill" id="loader-bar"></div>
    </div>
    <div class="loader-brand">
      <span class="brand-text">
        <span class="brand-s">S</span><span class="brand-park">par</span><span class="brand-k">k</span>
      </span>
    </div>
    <div class="loader-status" id="loader-status">${statusText || 'Loading'}</div>
  `;
  document.body.appendChild(div);
}

// Show loader, run bird loop, call onDone when ready
function showLoader(statusText, durationMs, onDone) {
  createLoader(statusText);

  const loader = document.getElementById('spark-loader');
  const bar    = document.getElementById('loader-bar');
  const status = document.getElementById('loader-status');

  loader.classList.remove('fade-out');
  if (status) status.textContent = statusText || 'Loading';

  // Animate progress bar
  const steps = 60;
  const interval = durationMs / steps;
  let progress = 0;
  const barTimer = setInterval(() => {
    progress = Math.min(progress + (100 / steps), 95);
    if (bar) bar.style.width = progress + '%';
  }, interval);

  // Multiple bird passes
  let pass = 0;
  const maxPasses = Math.floor(durationMs / 1200) + 1;

  function flyBird() {
    const bird = document.getElementById('loader-bird-img');
    if (!bird) return;
    // reset
    bird.style.animation = 'none';
    void bird.offsetHeight;
    bird.style.animation = 'birdFly 1.1s cubic-bezier(0.22,1,0.36,1) forwards';

    pass++;
    if (pass < maxPasses) {
      setTimeout(flyBird, 1150);
    }
  }
  flyBird();

  // Done
  setTimeout(() => {
    clearInterval(barTimer);
    if (bar) bar.style.width = '100%';
    if (onDone) onDone();
  }, durationMs);
}

// Hide loader with fade
function hideLoader(callback) {
  const loader = document.getElementById('spark-loader');
  if (!loader) { if (callback) callback(); return; }
  const bar = document.getElementById('loader-bar');
  if (bar) bar.style.width = '100%';

  // Stop any ongoing bird animation
  const bird = document.getElementById('loader-bird-img');
  if (bird) bird.style.animation = 'none';

  loader.classList.add('fade-out');
  setTimeout(() => {
    try { loader.remove(); } catch(e) {}
    if (callback) callback();
  }, 420);
}

// ── EXPORTED HELPERS ──

// Called after login/signup success — fly then redirect
window.SparkLoader = {
  // show for a fixed duration then call callback
  show(text, ms, cb) { showLoader(text, ms, cb); },

  // show, then hide when promise resolves
  async wrap(text, promise) {
    createLoader(text);
    const loader = document.getElementById('spark-loader');
    const bar    = document.getElementById('loader-bar');
    loader.classList.remove('fade-out');

    // slow progress bar while waiting
    let p = 0;
    const timer = setInterval(() => {
      p = Math.min(p + 1.2, 88);
      if (bar) bar.style.width = p + '%';
    }, 120);

    // bird loops
    let flying = true;
    function flyLoop() {
      if (!flying) return;
      const bird = document.getElementById('loader-bird-img');
      if (!bird) return;
      bird.style.animation = 'none';
      void bird.offsetHeight;
      bird.style.animation = 'birdFly 1.1s cubic-bezier(0.22,1,0.36,1) forwards';
      setTimeout(() => { if (flying) flyLoop(); }, 1150);
    }
    flyLoop();

    let result;
    try { result = await promise; } catch(e) { result = null; }

    flying = false;
    clearInterval(timer);
    if (bar) bar.style.width = '100%';

    await new Promise(r => setTimeout(r, 300));
    await new Promise(r => hideLoader(r));
    return result;
  },

  hide(cb) { hideLoader(cb); }
};
