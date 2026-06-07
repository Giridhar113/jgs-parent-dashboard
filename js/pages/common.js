(function () {
  const data = window.JGSParentData;

  const navItems = [
    ['parent-dashboard.html', 'Dashboard'],
    ['parent-attendance.html', 'Attendance Report'],
    ['parent-progress.html', 'Progress Report'],
    ['parent-fees.html', 'Fee & Payment'],
    ['parent-ptm.html', 'PTM Booking'],
    ['parent-comparison.html', 'Child Comparison'],
    ['parent-complaints.html', 'Complaints'],
    ['parent-messages.html', 'Message Faculty'],
    ['parent-notices.html', 'Notices'],
    ['parent-events.html', 'Events']
  ];

  function currentPage() {
    return window.location.pathname.split('/').pop() || 'parent-dashboard.html';
  }

  function initShell() {
    if (!document.body.classList.contains('portal-page')) return;
    if (localStorage.getItem('jgs_role') !== 'parent') {
      window.location.href = 'parent-login.html';
      return;
    }
    const session = window.JGSAuth.getSession();
    const page = currentPage();
    const nav = navItems
      .map(([href, label]) => `<a class="tab-link ${page === href ? 'active' : ''}" href="${href}">${label}</a>`)
      .join('');
    const bottomItems = [
      ['parent-dashboard.html', 'Home'],
      ['parent-attendance.html', 'Attendance'],
      ['parent-fees.html', 'Fees'],
      ['parent-messages.html', 'Messages'],
      ['parent-notices.html', 'More']
    ];
    const bottom = bottomItems
      .map(([href, label]) => `<a class="${page === href ? 'active' : ''}" href="${href}">${label}</a>`)
      .join('');

    document.body.insertAdjacentHTML('afterbegin', `
      <div class="app">
        <aside class="sidebar">
          <div class="sidebar-brand">JGS Parent Portal</div>
          <nav>${nav}<button class="tab-link" data-logout type="button">Logout</button></nav>
          <a class="sidebar-footer" href="https://jgs.edu.in">Visit JGS Website</a>
        </aside>
        <main class="main">
          <header class="topbar">
            <div class="topbar-left">
              <span class="topbar-title">JGS &middot; Parent Portal</span>
              <span class="badge">AY 2025-26</span>
            </div>
            <div class="topbar-right">
              <button class="notification-bell" id="parentNotificationBell" type="button" aria-label="Notifications">
                Bell <span id="parentUnreadCount">0</span>
              </button>
              <div class="notification-menu" id="parentNotificationMenu" hidden>
                <div class="notification-head"><strong>Notifications</strong><button class="secondary" id="markParentNotificationsRead" type="button">Mark all read</button></div>
                <div id="parentNotificationList" class="notification-list"></div>
              </div>
              <strong>${session.parentName}</strong>
              <button class="secondary" data-logout type="button">Logout</button>
            </div>
          </header>
          <section class="content" id="page-content"></section>
        </main>
      </div>
      <nav class="bottom-nav">${bottom}</nav>
    `);
    window.JGSAuth.wireLogout();
    wireNotifications();
    loadEnhancements();
  }

  function loadEnhancements() {
    if (window.JGSPortalEnhancements) return window.JGSPortalEnhancements.init('parent');
    const script = document.createElement('script');
    script.src = 'js/portal-enhancements.js';
    script.onload = () => window.JGSPortalEnhancements?.init('parent');
    document.head.append(script);
  }

  function fallbackNotifications() {
    return [
      { id: 'n1', title: 'Child marked absent today', message: `${data.ward.name} was marked absent in Engineering Maths.`, time: 'Today', unread: true },
      { id: 'n2', title: 'New marks uploaded', message: 'DBMS internal marks are available.', time: '2 hrs ago', unread: true },
      { id: 'n3', title: 'Fee due reminder', message: 'Semester 4 fee is due in 3 days.', time: 'Yesterday', unread: true },
      { id: 'n4', title: 'New notice posted', message: 'Parent-teacher meeting notice posted.', time: '30 May', unread: false },
      { id: 'n5', title: 'Leave status changed', message: 'Medical leave application was approved.', time: '28 May', unread: false }
    ];
  }

  async function loadNotifications() {
    try {
      const items = await window.JGSAuth.apiFetch('/api/parent/notifications');
      return Array.isArray(items) && items.length ? items : fallbackNotifications();
    } catch {
      return JSON.parse(localStorage.getItem('jgs_parent_notifications') || 'null') || fallbackNotifications();
    }
  }

  async function renderNotifications() {
    const list = document.getElementById('parentNotificationList');
    const count = document.getElementById('parentUnreadCount');
    if (!list || !count) return;
    const items = await loadNotifications();
    localStorage.setItem('jgs_parent_notifications', JSON.stringify(items));
    const unread = items.filter((item) => item.unread).length;
    count.textContent = unread;
    count.hidden = unread === 0;
    list.innerHTML = items.map((item) => `
      <article class="notification-row ${item.unread ? 'unread' : ''}">
        <strong>${item.title}</strong>
        <p>${item.message}</p>
        <small>${item.time || item.createdAt || ''}</small>
      </article>
    `).join('');
  }

  function wireNotifications() {
    const bell = document.getElementById('parentNotificationBell');
    const menu = document.getElementById('parentNotificationMenu');
    const markRead = document.getElementById('markParentNotificationsRead');
    if (!bell || !menu) return;
    bell.addEventListener('click', () => {
      menu.hidden = !menu.hidden;
    });
    markRead?.addEventListener('click', () => {
      const items = (JSON.parse(localStorage.getItem('jgs_parent_notifications') || '[]')).map((item) => ({ ...item, unread: false }));
      localStorage.setItem('jgs_parent_notifications', JSON.stringify(items));
      renderNotifications();
    });
    renderNotifications();
    setInterval(renderNotifications, 60000);
  }

  function statusClass(value) {
    if (value === 'Paid' || value === 'Active' || value === 'Strong' || value === 'Excellent') return 'success';
    if (value === 'Urgent' || value === 'Needs revision' || value === 'High') return 'warning';
    return 'info';
  }

  function wardBanner() {
    const ward = data.ward;
    return `
      <section class="ward-banner">
        <div class="avatar">${ward.initials}</div>
        <div>
          <h2>${ward.name}</h2>
          <p class="muted">${ward.roll}</p>
          <p>${ward.branch} &middot; ${ward.semester}</p>
        </div>
        <span class="status success">${ward.status}</span>
      </section>
    `;
  }

  function attendanceAlert() {
    const percent = data.ward.attendance;
    if (percent < 75) {
      return `<section class="alert warning">${data.ward.name.split(' ')[0]}'s attendance is below minimum eligibility. Please contact the class teacher.</section>`;
    }
    if (percent < 80) {
      return `<section class="alert warning">${data.ward.name.split(' ')[0]}'s attendance is ${percent}% - below the 80% threshold. Please ensure regular attendance.</section>`;
    }
    return '';
  }

  function kpiCards() {
    const ward = data.ward;
    return `
      <section class="grid four">
        <article class="card kpi"><span class="muted">Attendance</span><strong>${ward.attendance}%</strong><span class="status warning">Needs attention</span></article>
        <article class="card kpi"><span class="muted">Last Present</span><strong>${ward.lastPresent}</strong><span class="status success">Present</span></article>
        <article class="card kpi"><span class="muted">Fee Status</span><strong>${ward.feeStatus}</strong><span class="status success">Receipt ready</span></article>
        <article class="card kpi"><span class="muted">Next Exam</span><strong>${ward.nextExam}</strong><span class="status info">Internal</span></article>
      </section>
    `;
  }

  function subjectBars() {
    return data.attendance.subjects.map((subject) => `
      <div class="subject-row">
        <strong>${subject.name}</strong>
        <div class="bar"><span class="${subject.percent < 80 ? 'warning' : 'success'}" style="width: ${subject.percent}%"></span></div>
        <span>${subject.percent}%</span>
      </div>
    `).join('');
  }

  function marksTable() {
    return `
      <div class="table-wrap">
        <table>
          <thead><tr><th>Subject</th><th>Internal Marks</th><th>Mid-term Marks</th><th>Total</th><th>Grade</th><th>Status</th></tr></thead>
          <tbody>
            ${data.marks.map((row) => `
              <tr>
                <td>${row.subject}</td><td>${row.internal}</td><td>${row.midterm}</td><td>${row.total}/50</td><td>${row.grade}</td>
                <td><span class="status ${statusClass(row.status)}">${row.status}</span></td>
              </tr>
            `).join('')}
          </tbody>
        </table>
      </div>
    `;
  }

  function feeCard(full) {
    const fee = data.fees;
    return `
      <section class="card">
        <h3>${fee.title}</h3>
        <div class="grid ${full ? 'two' : ''}">
          <p><span class="muted">Amount</span><br><strong>${fee.amount}</strong></p>
          <p><span class="muted">Status</span><br><span class="status ${fee.status === 'Paid' ? 'success' : 'warning'}" data-fee-status>${fee.status}</span></p>
          <p><span class="muted">Paid on</span><br><strong data-fee-paid-on>${fee.paidOn}</strong></p>
          <p><span class="muted">Receipt</span><br><strong data-fee-receipt>${fee.receipt}</strong></p>
        </div>
        <div class="actions">
          <button data-download="receipt" type="button">Download Receipt</button>
          <a class="button secondary" href="https://wa.me/?text=JGS%20fee%20receipt%20${encodeURIComponent(fee.receipt)}">Share on WhatsApp</a>
          <button class="gold" data-payment-start type="button">${fee.status === 'Paid' ? 'Pay Next Fee' : 'Pay Now'}</button>
        </div>
      </section>
    `;
  }

  function messageForm() {
    return `
      <form class="card" id="message-form">
        <h3>Message Teacher</h3>
        <div class="field">
          <label for="faculty">To</label>
          <select id="faculty" name="faculty">${data.faculty.map((name) => `<option>${name}</option>`).join('')}</select>
        </div>
        <div class="field">
          <label for="message-subject">Subject</label>
          <input id="message-subject" name="subject" required placeholder="Example: Attendance support">
        </div>
        <div class="field">
          <label for="message-body">Message</label>
          <textarea id="message-body" name="message" rows="5" required placeholder="Write your message to the teacher"></textarea>
        </div>
        <p class="form-status" id="message-status"></p>
        <div class="actions">
          <button type="submit">Send via Portal</button>
          <a class="button secondary" href="https://wa.me/?text=Hello%20Teacher,%20I%20am%20Priya%20Sharma's%20parent.">Open WhatsApp</a>
        </div>
      </form>
    `;
  }

  function wireMessageForm() {
    const form = document.getElementById('message-form');
    if (!form) return;
    form.addEventListener('submit', async (event) => {
      event.preventDefault();
      const payload = Object.fromEntries(new FormData(form).entries());
      payload.wardRoll = data.ward.roll;
      const saved = JSON.parse(localStorage.getItem('jgs_parent_messages') || '[]');
      saved.unshift({ ...payload, sentAt: new Date().toISOString() });
      localStorage.setItem('jgs_parent_messages', JSON.stringify(saved));
      try {
        await window.JGSAuth.apiFetch('/api/messages', { method: 'POST', body: JSON.stringify(payload) });
      } catch (error) {
      }
      document.getElementById('message-status').textContent = 'Message sent to faculty.';
      form.reset();
    });
  }

  function noticesList(filter) {
    const notices = data.notices.filter((notice) => !filter || filter === 'All' || notice.category === filter || notice.priority === filter);
    return notices.map((notice) => `
      <article class="card notice-card ${notice.unread ? 'unread' : ''}">
        <h3>${notice.title}</h3>
        <p class="muted">${notice.date}</p>
        <span class="status info">${notice.category}</span>
        <span class="status ${statusClass(notice.priority)}">${notice.priority}</span>
      </article>
    `).join('') || '<p class="empty">No notices found for this filter.</p>';
  }

  function eventsList() {
    return data.events.map((event) => `
      <article class="card event-row">
        <h3>${event.title}</h3>
        <p><strong>${event.date}</strong> &middot; ${event.time}</p>
        <p class="muted">${event.description}</p>
        <button class="secondary" type="button">Add to Calendar</button>
      </article>
    `).join('');
  }

  window.JGSParentUI = {
    attendanceAlert,
    eventsList,
    feeCard,
    initShell,
    kpiCards,
    marksTable,
    messageForm,
    noticesList,
    subjectBars,
    wardBanner,
    wireMessageForm
  };

  document.addEventListener('DOMContentLoaded', initShell);
})();
