document.addEventListener('DOMContentLoaded', async () => {
  const page = document.getElementById('page-content');
  if (!page) return;
  await JGSParentDataClient.load('/api/parent/notices');
  const filters = ['All', 'Exam', 'Fee', 'Attendance', 'General', 'Urgent'];
  page.innerHTML = `
    <div class="page-title"><div><p class="breadcrumb">Dashboard &gt; Notices</p><h1>Notices</h1></div></div>
    <section class="card"><h3>Filters</h3><div class="filters">${filters.map((filter) => `<button class="filter-button ${filter === 'All' ? 'active' : ''}" data-filter="${filter}" type="button">${filter}</button>`).join('')}</div></section>
    <section class="grid" id="notice-list">${JGSParentUI.noticesList('All')}</section>
  `;
  document.querySelectorAll('[data-filter]').forEach((button) => {
    button.addEventListener('click', () => {
      document.querySelectorAll('[data-filter]').forEach((item) => item.classList.remove('active'));
      button.classList.add('active');
      document.getElementById('notice-list').innerHTML = JGSParentUI.noticesList(button.dataset.filter);
    });
  });
});
