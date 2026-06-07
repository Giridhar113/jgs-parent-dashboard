document.addEventListener('DOMContentLoaded', async () => {
  const page = document.getElementById('page-content');
  if (!page) return;
  await JGSParentDataClient.load('/api/parent/events');
  page.innerHTML = `
    <div class="page-title"><div><p class="breadcrumb">Dashboard &gt; Events</p><h1>Events & Academic Calendar</h1></div></div>
    <section class="grid three">${JGSParentUI.eventsList()}</section>
    <section class="card">
      <h3>Calendar Categories</h3>
      <div class="filters">
        ${['Exams', 'Fee due dates', 'PTM', 'Holidays', 'Campus events'].map((item) => `<span class="status info">${item}</span>`).join('')}
      </div>
      <div class="actions"><a class="button" href="https://calendar.google.com/calendar/render?action=TEMPLATE&text=JGS%20Parent%20Portal%20Event">Add to Google Calendar</a></div>
    </section>
  `;
});
