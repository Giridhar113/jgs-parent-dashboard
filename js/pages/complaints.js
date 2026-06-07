document.addEventListener('DOMContentLoaded', async () => {
  const page = document.getElementById('page-content');
  if (!page) return;
  await JGSParentDataClient.load('/api/parent/complaints');
  const stored = JSON.parse(localStorage.getItem('jgs_parent_complaints') || 'null');
  const complaints = stored || JGSParentData.complaints || [];
  page.innerHTML = `
    <div class="page-title"><div><p class="breadcrumb">Dashboard &gt; Complaints</p><h1>Complaint / Feedback Form</h1></div></div>
    <section class="grid two">
      <form class="card" id="complaint-form">
        <h3>Submit Formal Complaint</h3>
        <div class="field"><label>Category</label><select name="category"><option>Academic</option><option>Facility</option><option>Staff</option><option>Other</option></select></div>
        <div class="field"><label>Subject</label><input name="subject" required placeholder="Short subject"></div>
        <div class="field"><label>Description</label><textarea name="description" rows="6" required></textarea></div>
        <div class="field"><label>Priority</label><select name="priority"><option>Low</option><option>Medium</option><option>High</option></select></div>
        <button type="submit">Submit Complaint</button>
        <p class="form-status" id="complaint-status"></p>
      </form>
      <article class="card">
        <h3>Track Complaint Status</h3>
        <div id="complaint-list">${renderComplaints(complaints)}</div>
      </article>
    </section>
  `;

  function renderComplaints(items) {
    return items.length ? items.map((item) => `
      <div class="complaint-row">
        <div><strong>${item.subject}</strong><p class="muted">${item.category} &middot; ${item.priority} priority &middot; ${item.createdAt || 'Today'}</p></div>
        <span class="status ${item.status === 'Resolved' ? 'success' : item.status === 'In Progress' ? 'info' : 'warning'}">${item.status}</span>
      </div>
    `).join('') : '<p class="empty">No complaints submitted.</p>';
  }

  document.getElementById('complaint-form').addEventListener('submit', async (event) => {
    event.preventDefault();
    const values = Object.fromEntries(new FormData(event.currentTarget));
    const item = { id: `cmp-${Date.now()}`, ...values, status: 'Open', createdAt: new Date().toLocaleDateString('en-IN'), wardRoll: JGSParentData.ward.roll };
    const next = [item, ...JSON.parse(localStorage.getItem('jgs_parent_complaints') || JSON.stringify(complaints))];
    localStorage.setItem('jgs_parent_complaints', JSON.stringify(next));
    document.getElementById('complaint-list').innerHTML = renderComplaints(next);
    try {
      await JGSAuth.apiFetch('/api/parent/complaints', { method: 'POST', body: JSON.stringify(item) });
    } catch {}
    document.getElementById('complaint-status').textContent = 'Complaint submitted. Status: Open.';
    event.currentTarget.reset();
  });
});
