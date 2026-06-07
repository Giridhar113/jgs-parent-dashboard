(function () {
  const DEFAULT_CONTEXT = {
    parentName: 'Mrs. Sunita Sharma',
    wardName: 'Priya Sharma',
    wardRoll: 'JGS/CSE/2024/048',
    branch: 'B.Tech CSE',
    semester: 'Semester 3',
    attendance: 79.4,
    feeStatus: 'Paid'
  };

  const configuredApiBase = () => {
    const base = (window.JGS_API_BASE || '').trim();
    if (!base || base.includes('YOUR-BACKEND-URL')) return '';
    return base.replace(/\/$/, '');
  };

  function demoModeAllowed() {
    return location.protocol === 'file:' || ['localhost', '127.0.0.1'].includes(location.hostname) || localStorage.getItem('jgs_demo_mode') === 'true';
  }

  async function apiFetch(path, options) {
    const base = configuredApiBase();
    if (!base) throw new Error('Backend is not configured.');
    const response = await fetch(base + path, {
      headers: {
        'Content-Type': 'application/json',
        ...(localStorage.getItem('jgs_token') ? { Authorization: `Bearer ${localStorage.getItem('jgs_token')}` } : {})
      },
      ...options
    });
    if (!response.ok) {
      const error = new Error('API request failed.');
      error.status = response.status;
      throw error;
    }
    return response.json();
  }

  function setParentSession(context) {
    const data = { ...DEFAULT_CONTEXT, ...context };
    localStorage.setItem('jgs_role', 'parent');
    localStorage.setItem('jgs_name', data.parentName);
    localStorage.setItem('jgs_ward', data.wardName);
    localStorage.setItem('jgs_ward_roll', data.wardRoll);
    if (data.token) localStorage.setItem('jgs_token', data.token);
  }

  function clearParentSession() {
    Object.keys(localStorage)
      .filter((key) => key.startsWith('jgs_'))
      .forEach((key) => localStorage.removeItem(key));
  }

  function getSession() {
    return {
      role: localStorage.getItem('jgs_role'),
      parentName: localStorage.getItem('jgs_name') || DEFAULT_CONTEXT.parentName,
      wardName: localStorage.getItem('jgs_ward') || DEFAULT_CONTEXT.wardName,
      wardRoll: localStorage.getItem('jgs_ward_roll') || DEFAULT_CONTEXT.wardRoll
    };
  }

  function requireParent() {
    if (localStorage.getItem('jgs_role') !== 'parent') {
      window.location.href = 'parent-login.html';
    }
  }

  async function loginParent(identifier, pin) {
    try {
      const result = await apiFetch('/api/auth/login', {
        method: 'POST',
        body: JSON.stringify({ identifier, pin, role: 'parent' })
      });
      const parent = result.parent || result.user || {};
      const ward = result.ward || result.student || {};
      const context = {
        parentName: parent.name,
        wardName: ward.name,
        wardRoll: ward.roll || ward.rollNumber || identifier,
        branch: ward.branch,
        semester: ward.semester,
        attendance: ward.attendance,
        feeStatus: ward.feeStatus,
        token: result.token
      };
      setParentSession(context);
      if (result.dashboard && window.JGSParentDataClient) {
        window.JGSParentDataClient.merge(result.dashboard);
      }
      return { mode: 'api', context: { ...DEFAULT_CONTEXT, ...context } };
    } catch (error) {
      if (error.status === 401 || error.status === 403) {
        throw new Error('Invalid parent login. Check your registered details or contact IT support.');
      }
      if (configuredApiBase() && !demoModeAllowed()) throw new Error('Parent portal backend is unavailable. Contact IT support.');
      if (!configuredApiBase() && !demoModeAllowed()) throw new Error('Parent portal backend is not configured. Contact IT support.');
      setParentSession(DEFAULT_CONTEXT);
      return { mode: 'demo', context: DEFAULT_CONTEXT };
    }
  }

  function wireLogout() {
    document.querySelectorAll('[data-logout]').forEach((button) => {
      button.addEventListener('click', () => {
        clearParentSession();
        window.location.href = 'parent-login.html';
      });
    });
  }

  window.JGSAuth = {
    apiFetch,
    clearParentSession,
    getSession,
    loginParent,
    requireParent,
    setParentSession,
    wireLogout,
    DEFAULT_CONTEXT
  };
})();
