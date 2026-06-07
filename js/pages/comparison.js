document.addEventListener('DOMContentLoaded', async () => {
  const page = document.getElementById('page-content');
  if (!page) return;
  await JGSParentDataClient.load('/api/parent/children');
  const children = JGSParentData.children && JGSParentData.children.length ? JGSParentData.children : [{
    name: JGSParentData.ward.name,
    initials: JGSParentData.ward.initials || 'PS',
    roll: JGSParentData.ward.roll,
    grade: JGSParentData.ward.semester,
    attendance: JGSParentData.ward.attendance,
    latestMarks: JGSParentData.marks[0]?.total || 0,
    feeStatus: JGSParentData.fees.status,
    cgpa: Number(JGSParentData.ward.cgpa || 0)
  }];
  const best = children.slice().sort((a, b) => (b.latestMarks + b.attendance + b.cgpa * 10) - (a.latestMarks + a.attendance + a.cgpa * 10))[0];
  page.innerHTML = `
    <div class="page-title"><div><p class="breadcrumb">Dashboard &gt; Child Comparison</p><h1>Child Performance Comparison</h1></div></div>
    <section class="children-grid comparison-grid">
      ${children.map((child) => `
        <article class="school-card child-card ${child.roll === best.roll ? 'best-child' : ''}" data-switch-child="${child.roll}">
          <div class="child-head">
            <div><h3>${child.name} ${child.roll === best.roll ? '<span class="star-badge">Best Performer</span>' : ''}</h3><p class="muted">${child.grade} &middot; ${child.roll}</p></div>
            <span class="child-avatar">${child.initials}</span>
          </div>
          <div class="grid three">
            <p><span class="muted">Attendance</span><br><strong>${child.attendance}%</strong></p>
            <p><span class="muted">Latest Marks</span><br><strong>${child.latestMarks}%</strong></p>
            <p><span class="muted">Fee Status</span><br><span class="status ${child.feeStatus === 'Paid' ? 'success' : 'warning'}">${child.feeStatus}</span></p>
          </div>
          <button type="button">Open Full Dashboard</button>
        </article>
      `).join('')}
    </section>
  `;
  document.querySelectorAll('[data-switch-child]').forEach((card) => {
    card.addEventListener('click', () => {
      const child = children.find((item) => item.roll === card.dataset.switchChild);
      localStorage.setItem('jgs_ward', child.name);
      localStorage.setItem('jgs_ward_roll', child.roll);
      JGSParentData.ward = { ...JGSParentData.ward, name: child.name, roll: child.roll, attendance: child.attendance, feeStatus: child.feeStatus };
      window.location.href = 'parent-dashboard.html';
    });
  });
});
