(function () {
  function safeFilePart(value) {
    return String(value || 'jgs').replace(/[^a-z0-9]+/gi, '-').replace(/^-|-$/g, '').toLowerCase();
  }

  function saveTextFile(filename, text) {
    const blob = new Blob([text], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    link.remove();
    URL.revokeObjectURL(url);
  }

  function loadScriptOnce(src) {
    return new Promise((resolve, reject) => {
      if ([...document.scripts].some((script) => script.src === src)) return resolve();
      const script = document.createElement('script');
      script.src = src;
      script.onload = resolve;
      script.onerror = reject;
      document.head.append(script);
    });
  }

  function receiptText() {
    const data = window.JGSParentData;
    return [
      'JGS Group of Institutes',
      'Fee Receipt',
      '',
      `Parent: ${data.parent.name}`,
      `Student: ${data.ward.name}`,
      `Roll: ${data.ward.roll}`,
      `Fee: ${data.fees.title}`,
      `Amount: ${data.fees.amount}`,
      `Status: ${data.fees.status}`,
      `Paid on: ${data.fees.paidOn}`,
      `Receipt: ${data.fees.receipt}`,
      '',
      'Breakdown:',
      ...data.fees.breakdown.map((item) => `- ${item.label}: ${item.value}`)
    ].join('\n');
  }

  function attendanceText() {
    const data = window.JGSParentData;
    return [
      'JGS Group of Institutes',
      'Monthly Attendance Report',
      '',
      `Student: ${data.ward.name}`,
      `Roll: ${data.ward.roll}`,
      `Overall Attendance: ${data.ward.attendance}%`,
      `Present Days: ${data.attendance.present}`,
      `Absent Days: ${data.attendance.absent}`,
      `Working Days: ${data.attendance.working}`,
      '',
      'Subject-wise Attendance:',
      ...data.attendance.subjects.map((item) => `- ${item.name}: ${item.percent}%`)
    ].join('\n');
  }

  function progressText() {
    const data = window.JGSParentData;
    return [
      'JGS Group of Institutes',
      'Progress Report',
      '',
      `Student: ${data.ward.name}`,
      `Roll: ${data.ward.roll}`,
      `CGPA: ${data.ward.cgpa}`,
      `Rank: ${data.ward.rank}`,
      '',
      'Marks:',
      ...data.marks.map((item) => `- ${item.subject}: ${item.total}/50, ${item.grade}, ${item.status}`)
    ].join('\n');
  }

  async function fetchText(path) {
    const base = (window.JGS_API_BASE || '').trim().replace(/\/$/, '');
    if (!base || base.includes('YOUR-BACKEND-URL')) throw new Error('Backend is not configured.');
    const token = localStorage.getItem('jgs_token');
    const response = await fetch(base + path, {
      headers: token ? { Authorization: `Bearer ${token}` } : {}
    });
    if (!response.ok) throw new Error('Download request failed.');
    return response.text();
  }

  async function download(kind) {
    const data = window.JGSParentData;
    if (kind === 'receipt') {
      await downloadReceiptPdf(data.fees);
      return;
    }
    const roll = safeFilePart(data.ward.roll);
    const map = {
      receipt: {
        path: '/api/parent/fees/receipt',
        filename: `jgs-fee-receipt-${roll}.txt`,
        fallback: receiptText
      },
      attendance: {
        path: '/api/parent/attendance/report',
        filename: `jgs-attendance-report-${roll}.txt`,
        fallback: attendanceText
      },
      progress: {
        path: '/api/parent/progress/report',
        filename: `jgs-progress-report-${roll}.txt`,
        fallback: progressText
      }
    };
    const item = map[kind];
    if (!item) return;
    let text;
    try {
      text = await fetchText(item.path);
    } catch (error) {
      text = item.fallback();
    }
    saveTextFile(item.filename, text);
  }

  async function downloadReceiptPdf(receipt) {
    const data = window.JGSParentData;
    await loadScriptOnce('https://cdn.jsdelivr.net/npm/jspdf@2.5.1/dist/jspdf.umd.min.js');
    const doc = new window.jspdf.jsPDF();
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(18);
    doc.text('JGS Group of Institutes', 20, 22);
    doc.setFontSize(11);
    doc.text('Fee Payment Receipt', 20, 31);
    doc.setFontSize(48);
    doc.setTextColor(220, 38, 38);
    doc.text('PAID', 112, 118, { angle: -25, align: 'center' });
    doc.setTextColor(20, 32, 52);
    doc.setFontSize(11);
    [
      ['Student Name', data.ward.name],
      ['Roll Number', data.ward.roll],
      ['Semester', data.ward.semester],
      ['Fee Amount', receipt.amount],
      ['Payment Date', receipt.paidOn || receipt.date],
      ['Receipt Number', receipt.receipt || receipt.receiptNumber],
      ['Status', receipt.status || 'Paid']
    ].forEach(([label, value], index) => {
      const y = 52 + index * 12;
      doc.setFont('helvetica', 'bold');
      doc.text(label + ':', 24, y);
      doc.setFont('helvetica', 'normal');
      doc.text(String(value || '-'), 72, y);
    });
    doc.setFont('helvetica', 'bold');
    doc.text('JGS', 172, 22);
    doc.rect(18, 14, 174, 140);
    doc.save(`jgs-fee-receipt-${safeFilePart(data.ward.roll)}.pdf`);
  }

  function renderGateway() {
    const data = window.JGSParentData;
    return `
      <section class="card payment-gateway">
        <h3>Payment Gateway</h3>
        <p class="muted">Pay securely for ${data.ward.name}. This demo gateway creates an order, confirms payment, updates fee status, and enables receipt download.</p>
        <div class="grid three">
          <label class="gateway-option"><input type="radio" name="payment-method" value="UPI" checked> UPI</label>
          <label class="gateway-option"><input type="radio" name="payment-method" value="Card"> Card</label>
          <label class="gateway-option"><input type="radio" name="payment-method" value="Net Banking"> Net Banking</label>
        </div>
        <div class="field">
          <label for="payer-note">Payment note</label>
          <input id="payer-note" value="${data.fees.title} - ${data.ward.roll}">
        </div>
        <p class="form-status" id="payment-status"></p>
        <div class="actions">
          <button class="gold" data-payment-start type="button">${data.fees.status === 'Paid' ? 'Pay Next Fee' : 'Pay Now'}</button>
          <button class="secondary" data-download="receipt" type="button">Download Receipt</button>
        </div>
      </section>
    `;
  }

  function refreshFeeViews(fees, ward) {
    if (fees) window.JGSParentData.fees = fees;
    if (ward) window.JGSParentData.ward = { ...window.JGSParentData.ward, ...ward };
    document.querySelectorAll('[data-fee-status]').forEach((item) => {
      item.textContent = window.JGSParentData.fees.status;
      item.className = `status ${window.JGSParentData.fees.status === 'Paid' ? 'success' : 'warning'}`;
    });
    document.querySelectorAll('[data-fee-paid-on]').forEach((item) => {
      item.textContent = window.JGSParentData.fees.paidOn;
    });
    document.querySelectorAll('[data-fee-receipt]').forEach((item) => {
      item.textContent = window.JGSParentData.fees.receipt;
    });
  }

  async function startPayment() {
    const status = document.getElementById('payment-status');
    const method = document.querySelector('input[name="payment-method"]:checked')?.value || 'UPI';
    const note = document.getElementById('payer-note')?.value || window.JGSParentData.fees.title;
    if (status) status.textContent = 'Creating payment order...';

    try {
      const created = await window.JGSAuth.apiFetch('/api/payments/create', {
        method: 'POST',
        body: JSON.stringify({
          amount: window.JGSParentData.fees.amount,
          purpose: note,
          gateway: 'JGS Demo Gateway'
        })
      });
      if (status) status.textContent = `Processing ${method} payment...`;
      const confirmed = await window.JGSAuth.apiFetch('/api/payments/confirm', {
        method: 'POST',
        body: JSON.stringify({
          orderId: created.order.id,
          method,
          transactionId: `DEMO-${Date.now()}`
        })
      });
      refreshFeeViews(confirmed.fees, confirmed.ward);
      if (status) status.textContent = 'Payment successful. Receipt is ready to download.';
    } catch (error) {
      const today = new Date().toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' });
      const fallbackFees = {
        ...window.JGSParentData.fees,
        status: 'Paid',
        paidOn: today,
        receipt: `JGS/FEE/2026/DEMO-${Date.now().toString().slice(-4)}`
      };
      fallbackFees.history = [
        { date: today, detail: `${note} paid via ${method}`, amount: fallbackFees.amount, status: 'Paid' },
        ...(fallbackFees.history || [])
      ];
      refreshFeeViews(fallbackFees, { feeStatus: 'Paid' });
      if (status) status.textContent = 'Demo payment completed locally. Backend was not reachable.';
    }
  }

  function wire() {
    document.querySelectorAll('[data-download]').forEach((button) => {
      button.addEventListener('click', () => download(button.dataset.download));
    });
    document.querySelectorAll('[data-payment-start]').forEach((button) => {
      button.addEventListener('click', startPayment);
    });
    document.querySelectorAll('[data-receipt-index]').forEach((button) => {
      button.addEventListener('click', () => {
        const row = window.JGSParentData.fees.history[Number(button.dataset.receiptIndex)];
        downloadReceiptPdf({
          amount: row.amount,
          paidOn: row.date,
          receipt: window.JGSParentData.fees.receipt,
          status: row.status
        });
      });
    });
  }

  window.JGSFeeActions = {
    download,
    renderGateway,
    wire
  };
})();
