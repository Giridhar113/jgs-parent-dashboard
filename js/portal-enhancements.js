(function () {
  const SCRIPT_BASE = new URL('.', document.currentScript?.src || location.href).href;
  const I18N = {
    en: { dashboard: 'Dashboard', attendance: 'Attendance', notices: 'Notices', fees: 'Fees', logout: 'Logout', search: 'Search...' },
    hi: { dashboard: 'Dashboard', attendance: 'Attendance', notices: 'Notices', fees: 'Fees', logout: 'Logout', search: 'Search...' },
    mr: { dashboard: 'Dashboard', attendance: 'Attendance', notices: 'Notices', fees: 'Fees', logout: 'Logout', search: 'Search...' }
  };

  function apiBase() {
    return (window.JGS_API_BASE || window.JGS_CONFIG?.backendUrl || '').replace(/\/$/, '');
  }

  function token() {
    return localStorage.getItem('jgs_token') || '';
  }

  async function api(path, options = {}) {
    const base = apiBase();
    if (!base || !token()) throw new Error('API unavailable');
    const response = await fetch(base + path, {
      ...options,
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token()}`, ...(options.headers || {}) }
    });
    if (!response.ok) throw new Error('API request failed');
    return response.json();
  }

  function injectStyles() {
    if (document.getElementById('jgs-enhancement-styles')) return;
    const style = document.createElement('style');
    style.id = 'jgs-enhancement-styles';
    style.textContent = `
      body.dark-mode{--bg:#0f172a;--card:#1e293b;--text:#f1f5f9;--border:#334155;background:var(--bg)!important;color:var(--text)!important}
      body.dark-mode .card,body.dark-mode .panel,body.dark-mode .topbar,body.dark-mode .sidebar,body.dark-mode table,body.dark-mode .main-shell,body.dark-mode .main,body.dark-mode .jgs-avatar-menu,body.dark-mode .jgs-avatar-button,body.dark-mode .jgs-toast,body.dark-mode .jgs-empty{background:var(--card)!important;color:var(--text)!important;border-color:var(--border)!important}
      body.dark-mode input,body.dark-mode select,body.dark-mode textarea{background:#111827!important;color:var(--text)!important;border-color:var(--border)!important}
      :root{--jgs-navy:#0b1a35;--jgs-navy-2:#112347;--jgs-page:#f5f7fb;--jgs-card:#ffffff;--jgs-line:#e5eaf3;--jgs-text:#162033;--jgs-muted:#6b7280;--jgs-gold:#f5a623;--jgs-info:#2563eb;--jgs-shadow:0 12px 28px rgba(11,26,53,.07)}
      html{scroll-behavior:smooth}
      body{background:var(--jgs-page)!important;color:var(--jgs-text);font-family:'DM Sans','Plus Jakarta Sans',Arial,system-ui,sans-serif}
      body.jgs-page-exit{opacity:.92;transform:translateY(4px);transition:opacity .18s ease,transform .18s ease}
      h1,h2,.portal-title,.topbar-title{font-family:'DM Sans','Plus Jakarta Sans',Arial,system-ui,sans-serif}
      .app-layout,.app-shell,.app{min-height:100vh!important;display:grid!important;grid-template-columns:240px minmax(0,1fr)!important;background:var(--jgs-page)!important;animation:jgsPageIn .34s ease both}
      .sidebar{position:sticky!important;top:0!important;height:100vh!important;overflow-y:auto!important;background:var(--jgs-navy-2)!important;color:#fff!important;border-right:0!important;padding:22px 16px!important;box-shadow:none!important;animation:jgsSidebarIn .38s ease both}
      .sidebar-brand,.brand-lockup,.sidebar .sidebar-brand{display:flex!important;align-items:center!important;gap:12px!important;margin-bottom:24px!important;color:#fff!important;font-weight:900!important;animation:jgsFadeUp .42s ease both}
      .nav-link,.tab-link,.sidebar a,.sidebar button{min-height:42px!important;border-radius:8px!important;padding:10px 12px!important;color:rgba(255,255,255,.78)!important;background:transparent!important;box-shadow:none!important;border:0!important;font-weight:800!important;text-align:left!important;display:flex!important;align-items:center!important;gap:10px!important;position:relative!important;transition:background .2s ease,color .2s ease,transform .2s ease,box-shadow .2s ease!important}
      .nav-link:hover,.tab-link:hover,.sidebar a:hover,.sidebar button:hover{transform:translateX(3px)}
      .nav-link:hover,.nav-link.active,.tab-link:hover,.tab-link.active,.sidebar a:hover,.sidebar a.active{background:rgba(255,255,255,.11)!important;color:#fff!important;box-shadow:inset 3px 0 0 var(--jgs-gold)!important}
      .jgs-nav-icon{width:28px;height:28px;min-width:28px;border-radius:8px;display:inline-grid;place-items:center;background:rgba(255,255,255,.1);color:#fff;font-size:12px;font-weight:900;transition:transform .2s ease,background .2s ease,color .2s ease}
      .nav-link:hover .jgs-nav-icon,.tab-link:hover .jgs-nav-icon,.sidebar a:hover .jgs-nav-icon,.sidebar button:hover .jgs-nav-icon{transform:scale(1.08) rotate(-3deg)}
      .nav-link.active .jgs-nav-icon,.tab-link.active .jgs-nav-icon,.sidebar a.active .jgs-nav-icon{background:var(--jgs-gold);color:#172033;animation:jgsActiveIcon 1.7s ease-in-out infinite}
      .main,.main-shell{min-width:0!important;background:var(--jgs-page)!important}
      .topbar{position:sticky!important;top:0!important;z-index:20!important;min-height:72px!important;padding:14px 28px!important;background:rgba(245,247,251,.92)!important;backdrop-filter:blur(14px)!important;border-bottom:1px solid var(--jgs-line)!important;box-shadow:none!important;animation:jgsTopbarIn .34s ease both}
      .portal-title,.topbar-title,.brand-lockup strong{color:var(--jgs-navy)!important;font-weight:900!important}
      .content,.main>[data-page-content],.main #page-root,.main .content{width:min(1260px,100%)!important;margin:0 auto!important;padding:24px 28px 96px!important}
      .page-header,.page-head,.page-title{display:flex!important;align-items:flex-end!important;justify-content:space-between!important;gap:16px!important;margin-bottom:22px!important}
      .page-header h1,.page-head h1,.page-title h1{margin:0!important;color:var(--jgs-navy)!important;font-size:clamp(24px,3vw,34px)!important;letter-spacing:0!important}
      .card,.panel,.notice-row,.faculty-row,.kpi-card,.activity-row,.approval-card,.notice-card{background:var(--jgs-card)!important;border:1px solid var(--jgs-line)!important;border-radius:8px!important;box-shadow:var(--jgs-shadow)!important;color:var(--jgs-text)!important;transition:transform .2s ease,box-shadow .2s ease,border-color .2s ease}
      .card:hover,.panel:hover,.notice-row:hover,.faculty-row:hover,.kpi-card:hover,.activity-row:hover,.approval-card:hover,.notice-card:hover{transform:translateY(-3px);box-shadow:0 18px 38px rgba(11,26,53,.1)!important;border-color:#d8e2f1!important}
      .card,.panel{padding:20px!important}
      .jgs-card-head{display:flex;align-items:center;justify-content:space-between;gap:12px;margin-bottom:10px}
      .jgs-card-icon{width:40px;height:40px;min-width:40px;border-radius:8px;display:grid;place-items:center;background:#edf5ff;color:var(--jgs-info);font-weight:900;transition:transform .2s ease}
      .card:hover .jgs-card-icon,.kpi:hover .jgs-card-icon,.kpi-card:hover .jgs-card-icon,.stat-card:hover .jgs-card-icon{transform:translateY(-2px) scale(1.06)}
      .jgs-trend{display:inline-flex;align-items:center;gap:5px;border-radius:999px;background:#ecfdf5;color:#047857;font-size:12px;font-weight:900;padding:5px 9px}
      .kpi-value,.kpi strong,.kpi-card strong,.stat-value{font-family:'Syne','DM Sans',system-ui,sans-serif;letter-spacing:0}
      .card h2,.card h3,.panel h2,.panel h3{color:var(--jgs-navy)!important;margin-top:0!important;letter-spacing:0!important}
      .muted,.subtle,.breadcrumb,.table-sub{color:var(--jgs-muted)!important}
      button,.button,.primary-btn,.secondary-btn,.ghost-btn{border-radius:8px!important;font-weight:800!important;letter-spacing:0!important;transition:transform .16s ease,box-shadow .16s ease,background .16s ease,border-color .16s ease!important}
      button:hover,.button:hover,.primary-btn:hover,.secondary-btn:hover,.ghost-btn:hover{transform:translateY(-1px)}
      button:active,.button:active,.primary-btn:active,.secondary-btn:active,.ghost-btn:active{transform:translateY(0) scale(.98)}
      .primary-btn,button:not(.jgs-tool):not(.nav-link):not(.tab-link):not(.secondary):not(.ghost):not(.danger),.button:not(.secondary){background:var(--jgs-navy)!important;color:#fff!important}
      .secondary-btn,.ghost-btn,button.secondary,.button.secondary{background:#eef3ff!important;color:var(--jgs-info)!important;border:1px solid var(--jgs-line)!important}
      input,select,textarea{min-height:44px!important;border:1px solid #d9e0ec!important;border-radius:8px!important;background:#fff!important;color:var(--jgs-text)!important;transition:border-color .18s ease,box-shadow .18s ease,background .18s ease}
      textarea{min-height:112px!important}
      input:focus,select:focus,textarea:focus{outline:0!important;border-color:var(--jgs-info)!important;box-shadow:0 0 0 4px rgba(37,99,235,.12)!important}
      .error,.field-error,[data-error]{color:#b91c1c!important;font-size:12px!important;font-weight:800!important;margin-top:6px!important}
      .badge,.status,.tag{border-radius:999px!important;font-weight:900!important}
      .badge.gold{background:#fff4dc!important;color:#9a5f00!important}
      .table-wrap{border:0!important;border-radius:8px!important;overflow:auto!important;background:#fff!important;box-shadow:var(--jgs-shadow)!important}
      table{width:100%!important;border-collapse:collapse!important;background:#fff!important}
      th{background:#f8fafc!important;color:var(--jgs-muted)!important;font-size:12px!important;text-transform:uppercase!important}
      th,td{border:0!important;border-bottom:1px solid var(--jgs-line)!important;padding:13px 12px!important;text-align:left!important}
      tbody tr{transition:background .18s ease,transform .18s ease,opacity .18s ease}
      tbody tr:hover{background:#f7fbff!important}
      tbody tr[data-jgs-row]{animation:jgsRowIn .32s ease both}
      tr:last-child td{border-bottom:0!important}
      canvas{max-width:100%;border-radius:8px}
      .chart-card,.chart-panel{background:#fff;border-radius:8px}
      .grid{gap:18px!important}
      .bottom-nav,.bottom-tabs{background:#fff!important;border-top:1px solid var(--jgs-line)!important}
      .topbar{gap:14px}.topbar-left{flex:0 1 auto}.topbar-right{flex:1 1 auto;justify-content:flex-end;min-width:0}
      .jgs-tool{min-height:40px;border-radius:8px;border:1px solid var(--border,#d8dee8);background:#fff;color:inherit;padding:7px 10px;font-weight:800;cursor:pointer;box-shadow:0 8px 20px rgba(11,26,53,.05);transition:transform .16s ease,box-shadow .16s ease,border-color .16s ease}
      .jgs-tool:hover{transform:translateY(-1px);box-shadow:0 12px 26px rgba(11,26,53,.09);border-color:#c8d6ea}
      .jgs-tool.icon{position:relative;width:42px;min-width:42px;padding:0;font-size:18px;line-height:1;display:inline-grid;place-items:center}
      .jgs-tool.icon .jgs-badge{position:absolute;top:-7px;right:-7px;margin:0;border:2px solid #fff}
      .jgs-language{width:58px;min-width:58px;padding:7px 8px}
      .jgs-search{min-height:40px;border-radius:8px;border:1px solid var(--border,#d8dee8);padding:8px 12px;width:clamp(170px,24vw,320px);background:#fff}
      .jgs-enhance-row{display:flex;gap:8px;align-items:center;flex-wrap:nowrap;min-width:0}
      .topbar-right>.notification,.topbar-right>.notification-bell,.topbar-right>.bell{display:none!important}
      .jgs-notification-wrap{position:relative}.jgs-badge{background:#c73737;color:#fff;border-radius:999px;padding:1px 7px;font-size:12px;margin-left:4px}
      .jgs-notification-menu{position:absolute;right:0;top:44px;width:min(340px,92vw);background:var(--card,#fff);border:1px solid var(--border,#d8dee8);border-radius:8px;box-shadow:0 18px 38px rgba(15,39,66,.18);z-index:80;padding:10px;display:none}
      [data-shared-bell].has-unread svg{animation:jgsBellRing 1.9s ease-in-out infinite;transform-origin:50% 10%}
      .jgs-notification-menu.open{display:grid;gap:8px;animation:jgsPopoverIn .18s ease both}.jgs-note{border-bottom:1px solid var(--border,#d8dee8);padding:8px;transition:background .16s ease,transform .16s ease}.jgs-note:hover{background:#f8fafc;transform:translateX(2px)}.jgs-note:last-child{border-bottom:0}.jgs-note.unread{font-weight:800}
      .topbar-right>.student-chip,.topbar-right>.faculty-chip,.topbar-right>.admin-pill,.topbar-right>strong{display:none!important}
      .jgs-avatar-wrap{position:relative}
      .jgs-avatar-button{display:flex!important;align-items:center!important;gap:10px!important;min-height:44px!important;border:1px solid var(--jgs-line)!important;background:#fff!important;color:var(--jgs-text)!important;border-radius:8px!important;padding:6px 10px!important;box-shadow:0 10px 24px rgba(11,26,53,.06)!important}
      .jgs-avatar-button:hover .jgs-avatar{animation:jgsAvatarPop .38s ease both}
      .jgs-avatar{width:32px;height:32px;border-radius:999px;display:grid;place-items:center;background:#eef3ff;color:var(--jgs-info);font-weight:900}
      .jgs-avatar-meta{display:grid;text-align:left;line-height:1.1}.jgs-avatar-meta strong{font-size:13px}.jgs-avatar-meta small{color:var(--jgs-muted);font-size:11px;text-transform:uppercase;letter-spacing:.04em}
      .jgs-avatar-menu{position:absolute;right:0;top:52px;width:210px;background:#fff;border:1px solid var(--jgs-line);border-radius:8px;box-shadow:0 18px 38px rgba(15,39,66,.18);padding:8px;display:none;z-index:90}
      .jgs-avatar-menu.open{display:grid;gap:4px;animation:jgsPopoverIn .18s ease both}.jgs-avatar-menu button,.jgs-avatar-menu a{display:flex!important;align-items:center!important;min-height:38px!important;padding:8px 10px!important;border-radius:8px!important;background:transparent!important;color:var(--jgs-text)!important;border:0!important;text-decoration:none!important;font-weight:800!important}.jgs-avatar-menu button:hover,.jgs-avatar-menu a:hover{background:#f4f7fb!important}
      .jgs-toast-stack{position:fixed;top:18px;right:18px;z-index:200;display:grid;gap:10px;width:min(360px,calc(100vw - 28px))}
      .jgs-toast{background:#fff;border:1px solid var(--jgs-line);border-left:5px solid var(--jgs-info);border-radius:8px;box-shadow:0 18px 38px rgba(15,39,66,.18);padding:12px 14px;animation:jgsToastIn .22s ease}
      .jgs-toast.success{border-left-color:#16a34a}.jgs-toast.warning{border-left-color:#d97706}.jgs-toast.error{border-left-color:#dc2626}.jgs-toast strong{display:block;color:var(--jgs-navy)}.jgs-toast small{display:block;color:var(--jgs-muted);margin-top:2px}
      .jgs-empty{min-height:160px;display:grid;place-items:center;text-align:center;padding:26px;border:1px dashed #cbd5e1;border-radius:8px;background:#f8fafc;color:var(--jgs-muted)}
      .jgs-empty-icon{width:44px;height:44px;border-radius:8px;display:grid;place-items:center;background:#eef3ff;color:var(--jgs-info);font-weight:900;margin:0 auto 10px}
      .day-tabs,.timetable-days{display:flex;gap:8px;overflow:auto;padding-bottom:8px}.day-tabs button,.timetable-days button{white-space:nowrap;min-height:38px!important;border-radius:8px!important;background:#eef3ff!important;color:var(--jgs-info)!important}
      [data-jgs-animate]{animation:jgsFadeUp .38s ease both}
      .jgs-pulse-once{animation:jgsPulseOnce .58s ease both}
      .jgs-shimmer{position:relative;overflow:hidden}.jgs-shimmer::after{content:"";position:absolute;inset:0;transform:translateX(-120%);background:linear-gradient(90deg,transparent,rgba(255,255,255,.35),transparent);animation:jgsShimmer 1.4s ease}
      @keyframes jgsPageIn{from{opacity:0;transform:translateY(8px)}to{opacity:1;transform:translateY(0)}}
      @keyframes jgsTopbarIn{from{opacity:0;transform:translateY(-12px)}to{opacity:1;transform:translateY(0)}}
      @keyframes jgsSidebarIn{from{opacity:0;transform:translateX(-14px)}to{opacity:1;transform:translateX(0)}}
      @keyframes jgsFadeUp{from{opacity:0;transform:translateY(12px)}to{opacity:1;transform:translateY(0)}}
      @keyframes jgsRowIn{from{opacity:0;transform:translateX(-8px)}to{opacity:1;transform:translateX(0)}}
      @keyframes jgsPopoverIn{from{opacity:0;transform:translateY(-6px) scale(.98)}to{opacity:1;transform:translateY(0) scale(1)}}
      @keyframes jgsBellRing{0%,60%,100%{transform:rotate(0)}68%{transform:rotate(12deg)}76%{transform:rotate(-10deg)}84%{transform:rotate(6deg)}}
      @keyframes jgsActiveIcon{0%,100%{box-shadow:0 0 0 0 rgba(245,166,35,.35)}50%{box-shadow:0 0 0 6px rgba(245,166,35,0)}}
      @keyframes jgsAvatarPop{0%{transform:scale(1)}45%{transform:scale(1.12)}100%{transform:scale(1)}}
      @keyframes jgsPulseOnce{0%{box-shadow:0 0 0 0 rgba(37,99,235,.28)}100%{box-shadow:0 0 0 14px rgba(37,99,235,0)}}
      @keyframes jgsShimmer{to{transform:translateX(120%)}}
      @keyframes jgsToastIn{from{opacity:0;transform:translateY(-8px)}to{opacity:1;transform:translateY(0)}}
      mark.jgs-hit{background:#fff4d6;color:#172033;border-radius:4px;padding:0 2px}
      .jgs-mobile-overlay{position:fixed;inset:0;background:rgba(15,23,42,.48);z-index:39;display:none}.sidebar-open .jgs-mobile-overlay{display:block}
      .jgs-session-modal{position:fixed;inset:0;background:rgba(15,23,42,.55);z-index:100;display:grid;place-items:center;padding:18px}.jgs-session-card{background:var(--card,#fff);color:var(--text,#172033);border-radius:8px;padding:18px;max-width:420px;width:100%;border:1px solid var(--border,#d8dee8)}
      @media(max-width:900px){.portal-title{max-width:130px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}.jgs-search{width:150px}.student-chip{max-width:150px}}
      @media(max-width:980px){.app-layout,.app-shell,.app{display:block!important}.content,.main>[data-page-content],.main #page-root,.main .content{padding:22px 18px 96px!important}}
      @media(max-width:768px){.sidebar{position:fixed!important;top:0;bottom:0;left:0;width:250px!important;z-index:50;transform:translateX(-100%);transition:.3s ease;overflow:auto}.sidebar-open .sidebar{transform:translateX(0)}.topbar{align-items:center;padding:10px 12px!important}.badge.gold{display:none}.jgs-search{width:120px}.jgs-language{display:none}.secondary-btn[data-logout],.button.ghost[data-logout]{display:none!important}.page-header,.page-head,.page-title{display:grid!important;align-items:start!important}.grid,.stats-grid,.cards-grid,.kpi-grid{grid-template-columns:repeat(2,minmax(0,1fr))!important;gap:12px!important}.jgs-avatar-meta{display:none}.jgs-avatar-button{padding:6px!important}}
      @media(max-width:520px){.grid,.stats-grid,.cards-grid,.kpi-grid{grid-template-columns:1fr!important}.jgs-search{display:none}.jgs-tool.icon{width:38px;min-width:38px}.topbar-right{gap:6px!important}.jgs-toast-stack{right:10px;top:10px}}
      @media(prefers-reduced-motion:reduce){*,*::before,*::after{animation-duration:.01ms!important;animation-iteration-count:1!important;scroll-behavior:auto!important;transition-duration:.01ms!important}}
      @media print{.sidebar,.topbar,.bottom-nav,.bottom-tabs,.jgs-enhance-row,.jgs-mobile-overlay{display:none!important}.main,.main-shell{padding:0!important}.card,.panel{box-shadow:none!important}}
    `;
    document.head.append(style);
  }

  function loadScript(src, globalName) {
    if (globalName && window[globalName]) return Promise.resolve();
    return new Promise((resolve, reject) => {
      const existing = [...document.scripts].find((script) => script.src === src);
      if (existing) return resolve();
      const script = document.createElement('script');
      script.src = src;
      script.onload = resolve;
      script.onerror = reject;
      document.head.append(script);
    });
  }

  function loadFonts() {
    if (document.getElementById('jgs-fonts')) return;
    const link = document.createElement('link');
    link.id = 'jgs-fonts';
    link.rel = 'stylesheet';
    link.href = 'https://fonts.googleapis.com/css2?family=DM+Sans:wght@500;700;800;900&family=Syne:wght@700;800&family=JetBrains+Mono:wght@600&display=swap';
    document.head.append(link);
  }

  function icon(name) {
    const icons = {
      menu: '<svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round"><path d="M4 7h16M4 12h16M4 17h16"/></svg>',
      moon: '<svg viewBox="0 0 24 24" width="19" height="19" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 14.5A8 8 0 0 1 9.5 3 7 7 0 1 0 21 14.5Z"/></svg>',
      sun: '<svg viewBox="0 0 24 24" width="19" height="19" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round"><circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4"/></svg>',
      chevron: '<svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="m6 9 6 6 6-6"/></svg>'
    };
    return icons[name] || '';
  }

  function addTopbarTools(role) {
    const host = document.querySelector('.topbar-right,.top-actions');
    if (!host || document.querySelector('[data-jgs-enhancements]')) return;
    const wrap = document.createElement('div');
    wrap.className = 'jgs-enhance-row';
    wrap.dataset.jgsEnhancements = 'true';
    wrap.innerHTML = `
      <button class="jgs-tool icon" data-mobile-menu type="button" title="Menu" aria-label="Open menu">${icon('menu')}</button>
      <input class="jgs-search" data-global-search placeholder="${I18N[localStorage.getItem('jgs_lang') || 'en'].search}">
      <button class="jgs-tool icon" data-theme-toggle type="button" title="Toggle theme" aria-label="Toggle theme">${icon('moon')}</button>
      <div class="jgs-notification-wrap"><button class="jgs-tool icon" data-shared-bell type="button" title="Notifications" aria-label="Notifications"><svg viewBox="0 0 24 24" aria-hidden="true" width="19" height="19" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M18 16v-5a6 6 0 0 0-12 0v5l-2 2h16l-2-2Z"></path><path d="M9.5 20a2.5 2.5 0 0 0 5 0"></path></svg><span class="jgs-badge" data-shared-count>0</span></button><div class="jgs-notification-menu" data-shared-menu></div></div>
      <select class="jgs-tool jgs-language" data-language aria-label="Language"><option value="en">EN</option><option value="hi">HI</option><option value="mr">MR</option></select>
      <div class="jgs-avatar-wrap"><button class="jgs-avatar-button" data-avatar-toggle type="button" aria-haspopup="menu" aria-expanded="false"><span class="jgs-avatar" data-avatar-initials>JG</span><span class="jgs-avatar-meta"><strong data-avatar-name>JGS User</strong><small>${role || 'portal'}</small></span>${icon('chevron')}</button><div class="jgs-avatar-menu" data-avatar-menu><button type="button" data-profile-link>My Profile</button><button type="button" data-avatar-theme>Toggle Theme</button><button type="button" data-logout>Logout</button></div></div>
    `;
    host.prepend(wrap);
    wrap.querySelector('[data-language]').value = localStorage.getItem('jgs_lang') || 'en';
    wireTopbar(role);
  }

  function wireTopbar(role) {
    document.querySelector('[data-mobile-menu]')?.addEventListener('click', () => {
      document.body.classList.toggle('sidebar-open');
      ensureOverlay();
    });
    document.querySelector('[data-theme-toggle]')?.addEventListener('click', () => setTheme(document.body.classList.contains('dark-mode') ? 'light' : 'dark'));
    document.querySelector('[data-language]')?.addEventListener('change', (event) => setLanguage(event.target.value));
    document.querySelector('[data-global-search]')?.addEventListener('input', (event) => globalSearch(event.target.value));
    document.querySelector('[data-shared-bell]')?.addEventListener('click', () => document.querySelector('[data-shared-menu]')?.classList.toggle('open'));
    document.querySelectorAll('[data-logout]').forEach((button) => button.addEventListener('click', logout));
    wireAvatar(role);
    loadNotifications(role);
    setInterval(() => loadNotifications(role), 60000);
  }

  function userDisplayName(role) {
    const keys = ['jgs_name', 'jgs_student_name', 'jgs_teacher_name', 'jgs_parent_name', 'jgs_admin_name', 'jgs_user_name'];
    const stored = keys.map((key) => localStorage.getItem(key)).find(Boolean);
    const chipName = document.querySelector('[data-student-chip] strong,.faculty-chip strong,.admin-pill strong,.topbar-right strong')?.textContent?.trim();
    return stored || chipName || `${role ? role[0].toUpperCase() + role.slice(1) : 'JGS'} User`;
  }

  function initials(name) {
    return name.split(/\s+/).filter(Boolean).slice(0, 2).map((part) => part[0]?.toUpperCase()).join('') || 'JG';
  }

  function wireAvatar(role) {
    const name = userDisplayName(role);
    const nameNode = document.querySelector('[data-avatar-name]');
    const initialsNode = document.querySelector('[data-avatar-initials]');
    if (nameNode) nameNode.textContent = name;
    if (initialsNode) initialsNode.textContent = initials(name);
    document.querySelector('[data-avatar-toggle]')?.addEventListener('click', (event) => {
      event.stopPropagation();
      const menu = document.querySelector('[data-avatar-menu]');
      const open = !menu?.classList.contains('open');
      menu?.classList.toggle('open', open);
      document.querySelector('[data-avatar-toggle]')?.setAttribute('aria-expanded', String(open));
    });
    document.addEventListener('click', () => document.querySelector('[data-avatar-menu]')?.classList.remove('open'));
    document.querySelector('[data-avatar-theme]')?.addEventListener('click', () => setTheme(document.body.classList.contains('dark-mode') ? 'light' : 'dark'));
    document.querySelector('[data-profile-link]')?.addEventListener('click', () => {
      const profile = role === 'student' ? 'student-profile.html' : role === 'admin' ? 'settings.html' : role === 'parent' ? 'parent-dashboard.html' : 'faculty-dashboard.html';
      window.location.href = profile;
    });
  }

  function ensureOverlay() {
    if (document.querySelector('.jgs-mobile-overlay')) return;
    const overlay = document.createElement('div');
    overlay.className = 'jgs-mobile-overlay';
    overlay.addEventListener('click', () => document.body.classList.remove('sidebar-open'));
    document.body.append(overlay);
  }

  function setTheme(theme) {
    localStorage.setItem('theme', theme);
    document.body.classList.toggle('dark-mode', theme === 'dark');
    const button = document.querySelector('[data-theme-toggle]');
    if (button) button.innerHTML = theme === 'dark' ? icon('sun') : icon('moon');
  }

  async function setLanguage(lang) {
    localStorage.setItem('jgs_lang', lang);
    try {
      await loadScript(new URL(`../translations/${lang}.js`, SCRIPT_BASE).href);
      if (window.JGS_TRANSLATIONS?.[lang]) Object.assign(I18N[lang], window.JGS_TRANSLATIONS[lang]);
    } catch {}
    document.querySelectorAll('[data-i18n]').forEach((node) => {
      const key = node.dataset.i18n;
      if (I18N[lang]?.[key]) node.textContent = I18N[lang][key];
    });
    const search = document.querySelector('[data-global-search]');
    if (search) search.placeholder = I18N[lang]?.search || 'Search...';
  }

  async function loadNotifications(role) {
    const menu = document.querySelector('[data-shared-menu]');
    const count = document.querySelector('[data-shared-count]');
    if (!menu || !count) return;
    let items = [];
    try {
      items = await api('/api/notifications');
    } catch {
      items = [{ title: 'Portal sync active', message: 'Admin updates are connected through the shared backend.', unread: true, link: '' }];
    }
    const unread = items.filter((item) => item.unread || item.isRead === false).length;
    count.textContent = unread;
    document.querySelector('[data-shared-bell]')?.classList.toggle('has-unread', unread > 0);
    menu.innerHTML = `<div class="jgs-enhance-row"><strong>Notifications</strong><button class="jgs-tool" data-read-all type="button">Mark all read</button></div>${items.map((item) => `<button class="jgs-note ${item.unread ? 'unread' : ''}" data-note-link="${item.link || ''}" type="button"><strong>${item.title}</strong><p>${item.message}</p></button>`).join('') || '<p>No notifications.</p>'}`;
    menu.querySelector('[data-read-all]')?.addEventListener('click', () => api('/api/notifications/read-all', { method: 'PUT' }).finally(() => loadNotifications(role)));
    menu.querySelectorAll('[data-note-link]').forEach((button) => button.addEventListener('click', () => {
      const link = button.dataset.noteLink;
      if (link && !link.includes('events')) window.location.href = link;
    }));
  }

  function globalSearch(query) {
    document.querySelectorAll('mark.jgs-hit').forEach((mark) => mark.replaceWith(mark.textContent));
    const q = query.trim().toLowerCase();
    document.querySelectorAll('tbody tr,.card,.panel,.notice-card,.activity-row').forEach((node) => {
      if (!q) {
        node.style.display = '';
        return;
      }
      const match = node.textContent.toLowerCase().includes(q);
      node.style.display = match ? '' : 'none';
      if (match) highlightText(node, q);
    });
  }

  function highlightText(root, q) {
    const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT);
    const nodes = [];
    while (walker.nextNode()) nodes.push(walker.currentNode);
    nodes.forEach((textNode) => {
      const text = textNode.nodeValue;
      const index = text.toLowerCase().indexOf(q);
      if (index < 0 || textNode.parentElement.closest('script,style,mark')) return;
      const mark = document.createElement('mark');
      mark.className = 'jgs-hit';
      mark.textContent = text.slice(index, index + q.length);
      textNode.replaceWith(document.createTextNode(text.slice(0, index)), mark, document.createTextNode(text.slice(index + q.length)));
    });
  }

  function addTableExports() {
    document.querySelectorAll('table').forEach((table, index) => {
      if (table.dataset.exportsReady) return;
      table.dataset.exportsReady = 'true';
      const tools = document.createElement('div');
      tools.className = 'jgs-enhance-row';
      tools.innerHTML = `<button class="jgs-tool" data-print-table type="button">Print</button><button class="jgs-tool" data-csv-table type="button">Export CSV</button><button class="jgs-tool" data-pdf-table type="button">Export PDF</button>`;
      table.closest('.table-wrap')?.before(tools);
      tools.querySelector('[data-print-table]').addEventListener('click', () => window.print());
      tools.querySelector('[data-csv-table]').addEventListener('click', () => exportCsv(table, `jgs-table-${index + 1}.csv`));
      tools.querySelector('[data-pdf-table]').addEventListener('click', () => exportPdf(table, `jgs-table-${index + 1}.pdf`));
    });
  }

  function exportCsv(table, filename) {
    const rows = [...table.querySelectorAll('tr')].map((row) => [...row.children].map((cell) => `"${cell.textContent.trim().replace(/"/g, '""')}"`).join(','));
    const blob = new Blob([rows.join('\n')], { type: 'text/csv;charset=utf-8' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = filename;
    link.click();
    URL.revokeObjectURL(link.href);
  }

  async function exportPdf(table, filename) {
    await loadScript('https://cdn.jsdelivr.net/npm/jspdf@2.5.1/dist/jspdf.umd.min.js', 'jspdf');
    await loadScript('https://cdn.jsdelivr.net/npm/jspdf-autotable@3.8.4/dist/jspdf.plugin.autotable.min.js');
    const doc = new window.jspdf.jsPDF();
    doc.text('JGS Group of Institutes', 14, 14);
    doc.autoTable({ html: table, startY: 22, didDrawPage: (data) => doc.text(`Page ${doc.internal.getNumberOfPages()}`, data.settings.margin.left, 288) });
    doc.save(filename);
  }

  function decorateSidebar() {
    const labels = {
      dashboard: 'D', profile: 'P', attendance: 'A', marks: 'M', fees: 'F', notices: 'N', timetable: 'T',
      assignments: 'AS', progress: 'PR', leave: 'L', doubts: 'Q', analytics: 'AN', reports: 'R',
      students: 'S', teacher: 'T', parent: 'P', payroll: 'HR', library: 'LB', hostel: 'H', exam: 'EX',
      event: 'EV', settings: 'ST', gradebook: 'G'
    };
    document.querySelectorAll('.sidebar a,.sidebar button,.nav-link,.tab-link').forEach((link) => {
      if (link.querySelector('.jgs-nav-icon')) return;
      const text = link.textContent.trim().toLowerCase();
      const key = Object.keys(labels).find((label) => text.includes(label));
      const span = document.createElement('span');
      span.className = 'jgs-nav-icon';
      span.textContent = labels[key] || (text[0] || 'J').toUpperCase();
      link.prepend(span);
    });
  }

  function decorateCards() {
    document.querySelectorAll('.kpi,.kpi-card,.stat-card').forEach((card, index) => {
      if (card.dataset.cardDecorated) return;
      card.dataset.cardDecorated = 'true';
      const title = card.querySelector('.kpi-label,h3,h2,span')?.textContent?.trim() || 'JGS';
      const head = document.createElement('div');
      head.className = 'jgs-card-head';
      head.innerHTML = `<span class="jgs-card-icon">${title.slice(0, 2).toUpperCase()}</span><span class="jgs-trend">Up ${index % 2 ? '4' : '8'}%</span>`;
      card.prepend(head);
    });
  }

  function countUpStats() {
    const targets = document.querySelectorAll('.kpi-value,.kpi strong,.kpi-card strong,.stat-value,[data-count]');
    targets.forEach((node) => {
      if (node.dataset.counted) return;
      const text = node.textContent.trim();
      const match = text.match(/-?\d+(\.\d+)?/);
      if (!match) return;
      node.dataset.counted = 'true';
      const value = Number(match[0]);
      const prefix = text.slice(0, match.index);
      const suffix = text.slice(match.index + match[0].length);
      const decimals = match[0].includes('.') ? 1 : 0;
      const start = performance.now();
      const duration = 850;
      const tick = (time) => {
        const progress = Math.min((time - start) / duration, 1);
        const eased = 1 - Math.pow(1 - progress, 3);
        node.textContent = `${prefix}${(value * eased).toFixed(decimals)}${suffix}`;
        if (progress < 1) requestAnimationFrame(tick);
      };
      requestAnimationFrame(tick);
    });
  }

  function animatePage() {
    const nodes = document.querySelectorAll('.card,.panel,.kpi,.kpi-card,.notice-row,.activity-row,.approval-card,.table-wrap,form,.page-header,.page-head,.page-title');
    nodes.forEach((node, index) => {
      if (node.dataset.jgsAnimate) return;
      node.dataset.jgsAnimate = 'true';
      node.style.animationDelay = `${Math.min(index * 35, 320)}ms`;
    });
  }

  function animateTableRows() {
    document.querySelectorAll('tbody tr').forEach((row, index) => {
      if (row.dataset.jgsRow) return;
      row.dataset.jgsRow = 'true';
      row.style.animationDelay = `${Math.min(index * 24, 280)}ms`;
    });
  }

  function configureCharts() {
    if (!window.Chart || window.Chart.__jgsStyled) return;
    window.Chart.__jgsStyled = true;
    window.Chart.defaults.font.family = "'DM Sans', system-ui, sans-serif";
    window.Chart.defaults.color = '#64748b';
    window.Chart.defaults.elements.bar.borderRadius = 8;
    window.Chart.defaults.elements.line.tension = 0.36;
    window.Chart.defaults.elements.point.radius = 3;
    window.Chart.defaults.plugins.legend.labels.usePointStyle = true;
  }

  function enhanceEmptyStates() {
    document.querySelectorAll('.empty,.empty-state,[data-empty-state]').forEach((node) => {
      if (node.dataset.emptyReady || node.children.length > 1) return;
      const message = node.textContent.trim() || 'No records found yet.';
      node.dataset.emptyReady = 'true';
      node.classList.add('jgs-empty');
      node.innerHTML = `<div><span class="jgs-empty-icon">0</span><strong>${message}</strong><p>Use the action buttons above when new data is available.</p></div>`;
    });
    document.querySelectorAll('table tbody').forEach((tbody) => {
      if (tbody.rows.length || tbody.dataset.emptyReady) return;
      tbody.dataset.emptyReady = 'true';
      const columns = tbody.closest('table')?.querySelectorAll('thead th').length || 1;
      tbody.innerHTML = `<tr><td colspan="${columns}"><div class="jgs-empty"><div><span class="jgs-empty-icon">0</span><strong>No records found.</strong><p>Updates from admin will appear here automatically.</p></div></div></td></tr>`;
    });
  }

  function showToast(message, type = 'success', subtext = '') {
    let stack = document.querySelector('.jgs-toast-stack');
    if (!stack) {
      stack = document.createElement('div');
      stack.className = 'jgs-toast-stack';
      document.body.append(stack);
    }
    const toast = document.createElement('div');
    toast.className = `jgs-toast ${type}`;
    toast.innerHTML = `<strong>${message}</strong>${subtext ? `<small>${subtext}</small>` : ''}`;
    stack.append(toast);
    setTimeout(() => toast.remove(), 3600);
  }

  function wirePageTransitions() {
    if (document.body.dataset.pageTransitionsReady) return;
    document.body.dataset.pageTransitionsReady = 'true';
    document.addEventListener('click', (event) => {
      const link = event.target.closest('a[href]');
      if (!link || link.target || link.hasAttribute('download')) return;
      const href = link.getAttribute('href');
      if (!href || href.startsWith('#') || href.startsWith('mailto:') || href.startsWith('tel:')) return;
      const url = new URL(href, location.href);
      if (url.origin !== location.origin || url.href === location.href) return;
      event.preventDefault();
      document.body.classList.add('jgs-page-exit');
      setTimeout(() => {
        window.location.href = url.href;
      }, 120);
    });
  }

  function runPolish() {
    decorateSidebar();
    decorateCards();
    countUpStats();
    animatePage();
    animateTableRows();
    configureCharts();
    enhanceEmptyStates();
  }

  function sessionWarning() {
    const warningMs = 30 * 60 * 1000;
    const logoutMs = 35 * 60 * 1000;
    let warningTimer;
    let logoutTimer;
    const reset = () => {
      clearTimeout(warningTimer);
      clearTimeout(logoutTimer);
      document.querySelector('.jgs-session-modal')?.remove();
      warningTimer = setTimeout(showWarning, warningMs);
      logoutTimer = setTimeout(logout, logoutMs);
    };
    ['mousemove', 'keypress', 'click', 'touchstart'].forEach((eventName) => document.addEventListener(eventName, reset, { passive: true }));
    reset();
  }

  function showWarning() {
    let remaining = 300;
    const modal = document.createElement('div');
    modal.className = 'jgs-session-modal';
    modal.innerHTML = `<div class="jgs-session-card"><h2>Your session will expire in 5 minutes</h2><p>Time remaining: <strong data-session-countdown>05:00</strong></p><button class="jgs-tool" data-stay-logged-in type="button">Stay Logged In</button></div>`;
    document.body.append(modal);
    const interval = setInterval(() => {
      remaining -= 1;
      const node = modal.querySelector('[data-session-countdown]');
      if (node) node.textContent = `${String(Math.floor(remaining / 60)).padStart(2, '0')}:${String(remaining % 60).padStart(2, '0')}`;
      if (remaining <= 0) clearInterval(interval);
    }, 1000);
    modal.querySelector('[data-stay-logged-in]').addEventListener('click', async () => {
      try {
        const result = await api('/api/auth/refresh-token', { method: 'POST', body: JSON.stringify({ token: token() }) });
        if (result.token) localStorage.setItem('jgs_token', result.token);
      } catch {}
      modal.remove();
    });
  }

  function logout() {
    Object.keys(localStorage).filter((key) => key.startsWith('jgs_')).forEach((key) => localStorage.removeItem(key));
    window.location.href = location.pathname.includes('teacher') || location.pathname.includes('faculty') ? 'teacher-login.html' : location.pathname.includes('parent') ? 'parent-login.html' : location.pathname.includes('admin') ? 'admin-login.html' : '../student-login.html';
  }

  window.JGSPortalEnhancements = {
    init(role) {
      loadFonts();
      injectStyles();
      setTheme(localStorage.getItem('theme') || 'light');
      addTopbarTools(role);
      addTableExports();
      setLanguage(localStorage.getItem('jgs_lang') || 'en');
      wirePageTransitions();
      runPolish();
      sessionWarning();
      setTimeout(addTableExports, 250);
      setTimeout(runPolish, 250);
      setTimeout(runPolish, 900);
    }
  };
  window.JGSToast = showToast;
})();
