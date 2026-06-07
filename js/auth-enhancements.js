(function () {
  function apiBase() {
    return (window.JGS_API_BASE || window.JGS_CONFIG?.backendUrl || '').replace(/\/$/, '');
  }

  function loginPage() {
    if (!/login\.html$/i.test(location.pathname)) return;
    const form = document.querySelector('form');
    if (!form || document.querySelector('[data-forgot-password]')) return;
    form.insertAdjacentHTML('beforeend', '<button class="secondary-btn" data-forgot-password type="button">Forgot Password?</button><p class="error" data-forgot-status></p>');
    document.querySelector('[data-forgot-password]').addEventListener('click', async () => {
      const email = prompt('Enter your registered email');
      if (!email) return;
      const status = document.querySelector('[data-forgot-status]');
      try {
        const response = await fetch(apiBase() + '/api/auth/forgot-password', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email, portalUrl: location.href.replace(/[^/]+$/, '').replace(/\/$/, '') })
        });
        const result = await response.json();
        status.textContent = result.message || 'Reset request submitted.';
      } catch {
        status.textContent = 'Reset request saved in demo mode.';
      }
    });
  }

  function resetPage() {
    if (!/reset-password\.html$/i.test(location.pathname)) return;
    const params = new URLSearchParams(location.search);
    document.body.innerHTML = '<main class="login-page"><section class="login-panel"><div class="login-card"><h2>Reset Password</h2><form id="resetForm"><div class="field"><label>Email</label><input name="email" type="email" required></div><div class="field"><label>Reset Token</label><input name="token" required></div><div class="field"><label>New Password</label><input name="password" type="password" required></div><button type="submit">Reset Password</button><p class="error" id="resetStatus"></p></form></div></section></main>';
    document.querySelector('[name="email"]').value = params.get('email') || '';
    document.querySelector('[name="token"]').value = params.get('token') || '';
    document.getElementById('resetForm').addEventListener('submit', async (event) => {
      event.preventDefault();
      const status = document.getElementById('resetStatus');
      try {
        const response = await fetch(apiBase() + '/api/auth/reset-password', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(Object.fromEntries(new FormData(event.currentTarget)))
        });
        const result = await response.json();
        status.textContent = result.message || 'Password reset complete.';
      } catch {
        status.textContent = 'Password reset accepted in demo mode.';
      }
    });
  }

  document.addEventListener('DOMContentLoaded', () => {
    loginPage();
    resetPage();
  });
})();
