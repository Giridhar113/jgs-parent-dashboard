document.addEventListener('DOMContentLoaded', async () => {
  const page = document.getElementById('page-content');
  if (!page) return;
  await JGSParentDataClient.load('/api/parent/fees');
  page.innerHTML = `
    <div class="page-title"><div><p class="breadcrumb">Dashboard &gt; Fee & Payment</p><h1>Fee & Payment</h1></div></div>
    ${JGSParentUI.wardBanner()}
    ${JGSParentUI.feeCard(true)}
    ${JGSFeeActions.renderGateway()}
    <section class="grid two">
      <article class="card">
        <h3>Fee Breakdown</h3>
        ${JGSParentData.fees.breakdown.map((row) => `<div class="fee-row"><strong>${row.label}</strong><span>${row.value}</span></div>`).join('')}
      </article>
      <article class="card">
        <h3>Reminder History</h3>
        ${JGSParentData.fees.reminders.map((item) => `<p class="list-row">${item}</p>`).join('')}
      </article>
    </section>
    <section class="card">
      <h3>Payment History</h3>
      <div class="table-wrap">
        <table><thead><tr><th>Date</th><th>Detail</th><th>Amount</th><th>Status</th><th>Receipt</th></tr></thead><tbody>${JGSParentData.fees.history.map((row, index) => `<tr><td>${row.date}</td><td>${row.detail}</td><td>${row.amount}</td><td><span class="status success">${row.status}</span></td><td><button class="secondary" data-receipt-index="${index}" type="button">Download Receipt</button></td></tr>`).join('')}</tbody></table>
      </div>
    </section>
  `;
  JGSFeeActions.wire();
});
