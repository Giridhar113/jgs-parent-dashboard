document.addEventListener('DOMContentLoaded', async () => {
  const page = document.getElementById('page-content');
  if (!page) return;
  await JGSParentDataClient.load('/api/parent/progress');
  page.innerHTML = `
    <div class="page-title">
      <div><p class="breadcrumb">Dashboard &gt; Progress Report</p><h1>Progress Report</h1></div>
      <label class="field"><span>Semester</span><select><option>Semester 3</option><option>Semester 2</option></select></label>
    </div>
    ${JGSParentUI.wardBanner()}
    <section class="grid three">
      <article class="card kpi"><span class="muted">CGPA</span><strong>${JGSParentData.ward.cgpa}</strong><span class="status success">Good progress</span></article>
      <article class="card kpi"><span class="muted">Rank</span><strong>${JGSParentData.ward.rank}</strong><span class="status info">Class rank</span></article>
      <article class="card"><h3>Teacher Remarks</h3><p>Priya is consistent in lab work and should revise Operating Systems and Computer Networks before the next internal exam.</p></article>
    </section>
    <section class="card"><h3>Marks</h3>${JGSParentUI.marksTable()}</section>
    <div class="actions"><button data-download="progress" type="button">Download Progress Report</button><a class="button secondary" href="https://wa.me/?text=Priya%20Sharma%20progress%20report%20summary">Share on WhatsApp</a></div>
  `;
  JGSFeeActions.wire();
});
