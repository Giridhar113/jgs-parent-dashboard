document.addEventListener('DOMContentLoaded', async () => {
  const page = document.getElementById('page-content');
  if (!page) return;
  await JGSParentDataClient.load('/api/dashboard/parent');
  const sent = JSON.parse(localStorage.getItem('jgs_parent_messages') || '[]');
  page.innerHTML = `
    <div class="page-title"><div><p class="breadcrumb">Dashboard &gt; Message Faculty</p><h1>Message Faculty</h1></div></div>
    <section class="grid two">
      <article class="card"><h3>Faculty List</h3>${JGSParentData.faculty.map((name) => `<p class="list-row">${name}</p>`).join('')}</article>
      ${JGSParentUI.messageForm()}
    </section>
    <section class="grid two">
      <article class="card"><h3>Sent Messages</h3>${sent.length ? sent.map((msg) => `<p class="list-row"><strong>${msg.subject}</strong><span class="muted">${msg.faculty}</span></p>`).join('') : '<p class="empty">No sent messages yet.</p>'}</article>
      <article class="card"><h3>Received Replies</h3>${JGSParentData.replies.map((reply) => `<p class="list-row"><strong>${reply.subject}</strong><span>${reply.message}</span><span class="muted">${reply.from} &middot; ${reply.date}</span></p>`).join('')}</article>
    </section>
    <section class="card"><h3>Filter by Subject</h3><div class="filters">${['All', 'Data Structures', 'Engineering Maths', 'Operating Systems', 'DBMS'].map((label) => `<button class="filter-button" type="button">${label}</button>`).join('')}</div></section>
  `;
  JGSParentUI.wireMessageForm();
});
