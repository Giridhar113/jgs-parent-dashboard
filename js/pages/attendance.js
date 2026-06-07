document.addEventListener('DOMContentLoaded', async () => {
  const page = document.getElementById('page-content');
  if (!page) return;
  await JGSParentDataClient.load('/api/parent/attendance');
  const weeks = JGSParentData.attendance.weeks.map((percent, index) => `
    <div class="subject-row">
      <strong>Week ${index + 1}</strong>
      <div class="bar"><span class="${percent < 80 ? 'warning' : 'success'}" style="width: ${percent}%"></span></div>
      <span>${percent}%</span>
    </div>
  `).join('');
  page.innerHTML = `
    <div class="page-title"><div><p class="breadcrumb">Dashboard &gt; Attendance Report</p><h1>Attendance Report</h1></div></div>
    ${JGSParentUI.wardBanner()}
    ${JGSParentUI.attendanceAlert()}
    <section class="grid two">
      <article class="card">
        <h3>Monthly Summary</h3>
        <div class="grid four">
          <p><span class="muted">Present</span><br><strong>${JGSParentData.attendance.present}</strong></p>
          <p><span class="muted">Absent</span><br><strong>${JGSParentData.attendance.absent}</strong></p>
          <p><span class="muted">Working</span><br><strong>${JGSParentData.attendance.working}</strong></p>
          <p><span class="muted">Overall</span><br><strong>${JGSParentData.ward.attendance}%</strong></p>
        </div>
      </article>
      <article class="card"><h3>Week-by-week Attendance</h3>${weeks}</article>
    </section>
    <section class="card">
      <h3>Subject-wise Attendance</h3>
      <div class="table-wrap">
        <table>
          <thead><tr><th>Subject</th><th>Present</th><th>Absent</th><th>Percentage</th></tr></thead>
          <tbody>${JGSParentData.attendance.subjects.map((row) => `<tr><td>${row.name}</td><td>${row.present}</td><td>${row.absent}</td><td>${row.percent}%</td></tr>`).join('')}</tbody>
        </table>
      </div>
    </section>
    <section class="card">
      <h3>Absent Dates</h3>
      <div class="grid three">${JGSParentData.attendance.absentDates.map((date) => `<p class="status warning">${date}</p>`).join('')}</div>
      <div class="actions"><button data-download="attendance" type="button">Download Monthly Report</button><a class="button secondary" href="https://wa.me/?text=I%20would%20like%20to%20discuss%20Priya's%20attendance.">WhatsApp Class Teacher</a></div>
    </section>
  `;
  JGSFeeActions.wire();
});
