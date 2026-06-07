document.addEventListener('DOMContentLoaded', async () => {
  const page = document.getElementById('page-content');
  if (!page) return;
  await JGSParentDataClient.load('/api/parent/ptm/slots');
  const bookings = JSON.parse(localStorage.getItem('jgs_ptm_bookings') || '[]');
  const slots = JGSParentData.ptmSlots || [];
  page.innerHTML = `
    <div class="page-title"><div><p class="breadcrumb">Dashboard &gt; PTM Booking</p><h1>Parent-Teacher Meeting Scheduler</h1></div></div>
    ${JGSParentUI.wardBanner()}
    <section class="grid two">
      <article class="card">
        <h3>Available PTM Slots</h3>
        <div class="stack">
          ${slots.map((slot) => `
            <div class="ptm-slot">
              <div><strong>${slot.date} &middot; ${slot.time}</strong><p class="muted">${slot.teacher} &middot; ${slot.room}</p></div>
              <button data-book-slot="${slot.id}" type="button">Book Slot</button>
            </div>
          `).join('')}
        </div>
      </article>
      <article class="card">
        <h3>Current Bookings</h3>
        <div id="booking-list">${renderBookings(bookings)}</div>
      </article>
    </section>
    <p class="form-status" id="ptm-status"></p>
  `;

  function renderBookings(items) {
    return items.length ? items.map((item) => `
      <div class="ptm-slot">
        <div><strong>${item.date} &middot; ${item.time}</strong><p class="muted">${item.teacher} &middot; ${item.room}</p></div>
        <button class="secondary" data-cancel-booking="${item.id}" type="button">Cancel</button>
      </div>
    `).join('') : '<p class="empty">No PTM slot booked yet.</p>';
  }

  function save(items) {
    localStorage.setItem('jgs_ptm_bookings', JSON.stringify(items));
    document.getElementById('booking-list').innerHTML = renderBookings(items);
    wireCancel();
  }

  document.querySelectorAll('[data-book-slot]').forEach((button) => {
    button.addEventListener('click', async () => {
      const slot = slots.find((item) => item.id === button.dataset.bookSlot);
      const next = [{ ...slot, bookedAt: new Date().toISOString(), wardRoll: JGSParentData.ward.roll }, ...JSON.parse(localStorage.getItem('jgs_ptm_bookings') || '[]')];
      save(next);
      try {
        await JGSAuth.apiFetch('/api/parent/ptm/book', { method: 'POST', body: JSON.stringify(slot) });
      } catch {}
      document.getElementById('ptm-status').textContent = `Booking confirmed: ${slot.date} at ${slot.time} with ${slot.teacher}.`;
    });
  });

  function wireCancel() {
    document.querySelectorAll('[data-cancel-booking]').forEach((button) => {
      button.addEventListener('click', () => {
        const next = JSON.parse(localStorage.getItem('jgs_ptm_bookings') || '[]').filter((item) => item.id !== button.dataset.cancelBooking);
        save(next);
        document.getElementById('ptm-status').textContent = 'Booking cancelled.';
      });
    });
  }

  wireCancel();
});
