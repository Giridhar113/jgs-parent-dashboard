(function () {
  function merge(payload) {
    if (!payload || !window.JGSParentData) return window.JGSParentData;
    Object.keys(payload).forEach((key) => {
      if (payload[key] && typeof payload[key] === 'object' && !Array.isArray(payload[key]) && window.JGSParentData[key]) {
        window.JGSParentData[key] = { ...window.JGSParentData[key], ...payload[key] };
      } else if (payload[key] !== undefined) {
        window.JGSParentData[key] = payload[key];
      }
    });
    return window.JGSParentData;
  }

  async function load(path) {
    try {
      const payload = await window.JGSAuth.apiFetch(path);
      merge(payload);
      return { mode: 'api', payload };
    } catch (error) {
      return { mode: 'demo', error };
    }
  }

  window.JGSParentDataClient = {
    load,
    merge
  };
})();
