document.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById('parent-login-form');
  const status = document.getElementById('login-status');
  const toggle = document.getElementById('toggle-password');
  const pin = document.getElementById('pin');

  toggle.addEventListener('click', () => {
    const visible = pin.type === 'text';
    pin.type = visible ? 'password' : 'text';
    toggle.textContent = visible ? 'Show' : 'Hide';
  });

  document.getElementById('send-otp').addEventListener('click', () => {
    status.textContent = 'OTP button ready. Demo mode does not send SMS.';
  });

  form.addEventListener('submit', async (event) => {
    event.preventDefault();
    status.textContent = 'Signing in...';
    const identifier = document.getElementById('identifier').value.trim();
    const pinValue = pin.value.trim();
    try {
      const result = await window.JGSAuth.loginParent(identifier, pinValue);
      status.textContent = result.mode === 'api' ? 'Login successful.' : 'Demo login successful.';
      window.location.href = 'parent-dashboard.html';
    } catch (error) {
      status.textContent = error.message || 'Login failed. Please try again.';
    }
  });
});
