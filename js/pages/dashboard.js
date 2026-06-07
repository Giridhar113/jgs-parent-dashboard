document.addEventListener('DOMContentLoaded', async () => {
  const page = document.getElementById('page-content');
  if (!page) return;
  document.body.classList.add('school-overview-page');
  await JGSParentDataClient.load('/api/dashboard/parent');

  const today = new Date().toLocaleDateString('en-IN', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric'
  });
  const parentInitials = (JGSParentData.parent.name || 'Parent')
    .split(' ')
    .filter(Boolean)
    .map((part) => part[0])
    .join('')
    .slice(-2)
    .toUpperCase();

  const children = (JGSParentData.children && JGSParentData.children.length ? JGSParentData.children : [{
    name: JGSParentData.ward.name,
    grade: JGSParentData.ward.semester,
    roll: JGSParentData.ward.roll,
    badges: [
      JGSParentData.ward.attendance >= 85 ? 'Good attendance' : 'Attendance watch',
      Number(JGSParentData.ward.cgpa) >= 8 ? 'Top performer' : 'Steady progress'
    ],
    subjects: JGSParentData.attendance.subjects.slice(0, 4)
  }]);

  const events = [
    { color: 'blue', name: 'Parent Teacher Meeting', date: '08 Jun 2026', time: '10:00 AM', location: 'JGS Auditorium' },
    { color: 'gold', name: 'Internal Assessment Review', date: '10 Jun 2026', time: '02:00 PM', location: 'CSE Block' },
    { color: 'green', name: 'Campus Counselling Meet', date: '15 Jun 2026', time: '11:30 AM', location: 'Seminar Hall' },
    { color: 'red', name: 'Fee Window Closes', date: '30 Jun 2026', time: '05:00 PM', location: 'Accounts Office' }
  ];

  const messages = [
    { initials: 'AM', sender: 'Prof. Asha Mehta', preview: 'Priya has submitted her Data Structures assignment on time.', time: '12 min ago', unread: true },
    { initials: 'KR', sender: 'Dr. Kavita Rao', preview: 'Please revise the worksheet before Friday maths class.', time: '1 hr ago', unread: true },
    { initials: 'OF', sender: 'Office', preview: 'Semester 4 fee schedule is available in the Fees tab.', time: 'Yesterday', unread: false }
  ];

  const notifications = [
    { icon: 'A', message: 'Attendance is below the 80% school threshold.', time: 'Today' },
    { icon: 'F', message: 'Receipt download is ready for Semester 3 fee.', time: '2 hrs ago' },
    { icon: 'E', message: 'Hall ticket window opens on 3 Jun 2026.', time: '1 day ago' }
  ];

  const metricCards = [
    { label: 'Average Attendance', value: `${JGSParentData.ward.attendance}%`, trend: '+2.4%', trendType: 'up' },
    { label: 'Overall GPA', value: JGSParentData.ward.cgpa, trend: '+0.3', trendType: 'up' },
    { label: 'Pending Fees', value: JGSParentData.fees.status === 'Paid' ? 'Rs 0' : JGSParentData.fees.amount, trend: JGSParentData.fees.status, trendType: JGSParentData.fees.status === 'Paid' ? 'up' : 'down' },
    { label: 'Unread Messages', value: '2', trend: '+1 today', trendType: 'down' }
  ];

  const renderProgress = (subjects) => subjects.map((subject) => `
    <div class="school-progress-row">
      <div><strong>${subject.name}</strong><span>${subject.percent}%</span></div>
      <div class="school-progress"><span style="width: ${subject.percent}%"></span></div>
    </div>
  `).join('');

  page.innerHTML = `
    <section class="school-dashboard">
      <div class="school-topbar">
        <div class="school-parent">
          <div class="school-avatar">${parentInitials}</div>
          <div>
            <p class="muted">Welcome back</p>
            <h1>Hello, ${JGSParentData.parent.name}</h1>
            <span>${today}</span>
          </div>
        </div>
        <div class="school-actions">
          <button class="icon-btn" type="button" aria-label="Search">S</button>
          <button class="icon-btn has-alert" type="button" aria-label="Notifications">N</button>
          <button class="icon-btn" data-theme-toggle type="button" aria-label="Settings and theme">G</button>
        </div>
      </div>

      <nav class="school-tabs" aria-label="Parent dashboard sections">
        ${['Overview', 'Academics', 'Attendance', 'Fees', 'Messages'].map((tab, index) => `<a class="${index === 0 ? 'active' : ''}" href="${index === 0 ? 'parent-dashboard.html' : `parent-${tab.toLowerCase() === 'academics' ? 'progress' : tab.toLowerCase()}.html`}">${tab}</a>`).join('')}
      </nav>

      <section class="school-stats">
        ${metricCards.map((metric) => `
          <article class="school-card stat-card">
            <span class="muted">${metric.label}</span>
            <strong>${metric.value}</strong>
            <small class="${metric.trendType}">${metric.trendType === 'up' ? 'Up' : 'Action'} ${metric.trend}</small>
          </article>
        `).join('')}
      </section>

      <section>
        <div class="section-head">
          <h2>Children</h2>
          <span class="badge">${children.length} ward shown from ${JGSParentData.schoolStats?.totalStudents || 1248} students</span>
        </div>
        <div class="children-grid">
          ${children.map((child) => `
            <article class="school-card child-card">
              <div class="child-head">
                <div>
                  <h3>${child.name}</h3>
                  <p class="muted">${child.grade} &middot; Roll ${child.roll}</p>
                </div>
                <span class="child-avatar">${child.name.split(' ').map((part) => part[0]).join('').slice(0, 2)}</span>
              </div>
              <div class="badge-row">${child.badges.map((badge) => `<span class="status success">${badge}</span>`).join('')}</div>
              ${renderProgress(child.subjects)}
            </article>
          `).join('')}
        </div>
      </section>

      <section class="school-two-col">
        <article class="school-card">
          <div class="section-head"><h2>Upcoming Events</h2><a href="parent-events.html">View all</a></div>
          <div class="school-list">
            ${events.map((event) => `
              <div class="event-item">
                <span class="event-dot ${event.color}"></span>
                <div>
                  <strong>${event.name}</strong>
                  <p>${event.date} &middot; ${event.time}</p>
                  <small>${event.location}</small>
                </div>
              </div>
            `).join('')}
          </div>
        </article>

        <article class="school-card">
          <div class="section-head"><h2>Recent Messages</h2><a href="parent-messages.html">Open inbox</a></div>
          <div class="school-list">
            ${messages.map((message) => `
              <div class="message-item">
                <span class="mini-avatar">${message.initials}</span>
                <div>
                  <strong>${message.sender}</strong>
                  <p>${message.preview}</p>
                  <small>${message.time}</small>
                </div>
                ${message.unread ? '<span class="unread-dot"></span>' : ''}
              </div>
            `).join('')}
          </div>
        </article>
      </section>

      <section class="school-card notifications-panel">
        <div class="section-head"><h2>Notifications</h2><button class="secondary" type="button">Mark all read</button></div>
        <div class="notification-grid">
          ${notifications.map((notice) => `
            <div class="notification-item">
              <span class="notice-icon">${notice.icon}</span>
              <div><strong>${notice.message}</strong><p class="muted">${notice.time}</p></div>
            </div>
          `).join('')}
        </div>
      </section>

      ${JGSFeeActions.renderGateway()}
    </section>
  `;
  document.querySelector('[data-theme-toggle]')?.addEventListener('click', () => {
    const current = document.documentElement.dataset.theme || 'light';
    document.documentElement.dataset.theme = current === 'dark' ? 'light' : 'dark';
  });
  JGSFeeActions.wire();
});
