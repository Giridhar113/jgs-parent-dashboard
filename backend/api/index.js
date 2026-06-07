const {
  addMessage,
  attendanceReportText,
  confirmPayment,
  createToken,
  createPaymentOrder,
  findParentByLogin,
  findParentByToken,
  getParentPayload,
  getWardScopedData,
  messages,
  progressReportText,
  receiptText
} = require('../data/store');

function setCors(res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,POST,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type,Authorization');
}

function sendJson(res, statusCode, payload) {
  setCors(res);
  res.statusCode = statusCode;
  res.setHeader('Content-Type', 'application/json');
  res.end(JSON.stringify(payload));
}

function sendText(res, statusCode, text, filename) {
  setCors(res);
  res.statusCode = statusCode;
  res.setHeader('Content-Type', 'text/plain; charset=utf-8');
  if (filename) {
    res.setHeader('Content-Disposition', `attachment; filename="${filename}"`);
  }
  res.end(text);
}

function parseBody(req) {
  return new Promise((resolve, reject) => {
    let body = '';
    req.on('data', (chunk) => {
      body += chunk;
      if (body.length > 100000) {
        reject(new Error('Payload too large'));
      }
    });
    req.on('end', () => {
      if (!body) {
        resolve({});
        return;
      }
      try {
        resolve(JSON.parse(body));
      } catch (error) {
        reject(new Error('Invalid JSON'));
      }
    });
  });
}

function getToken(req) {
  const auth = req.headers.authorization || '';
  if (!auth.startsWith('Bearer ')) return '';
  return auth.slice('Bearer '.length).trim();
}

function getPath(req) {
  const url = new URL(req.url, 'http://localhost');
  return url.pathname.replace(/\/$/, '') || '/';
}

function requireParent(req, res) {
  const parent = findParentByToken(getToken(req));
  if (!parent) {
    sendJson(res, 401, { error: 'Parent login required.' });
    return null;
  }
  return parent;
}

async function handler(req, res) {
  setCors(res);

  if (req.method === 'OPTIONS') {
    res.statusCode = 204;
    res.end();
    return;
  }

  const path = getPath(req);

  try {
    if (req.method === 'POST' && path === '/api/auth/login') {
      const body = await parseBody(req);
      if (body.role && body.role !== 'parent') {
        sendJson(res, 403, { error: 'Only parent login is allowed for this portal.' });
        return;
      }

      const parent = findParentByLogin(body.identifier, body.pin);
      if (!parent) {
        sendJson(res, 401, { error: 'Invalid parent credentials.' });
        return;
      }

      const data = getWardScopedData(parent);
      sendJson(res, 200, {
        token: createToken(parent.id),
        parent: getParentPayload(parent),
        ward: data.ward,
        dashboard: data
      });
      return;
    }

    const parent = requireParent(req, res);
    if (!parent) return;

    const data = getWardScopedData(parent);

    if (req.method === 'GET' && path === '/api/dashboard/parent') {
      sendJson(res, 200, data);
      return;
    }

    if (req.method === 'GET' && path === '/api/parent/attendance') {
      sendJson(res, 200, { parent: data.parent, ward: data.ward, attendance: data.attendance });
      return;
    }

    if (req.method === 'GET' && path === '/api/parent/progress') {
      sendJson(res, 200, { parent: data.parent, ward: data.ward, marks: data.marks });
      return;
    }

    if (req.method === 'GET' && path === '/api/parent/fees') {
      sendJson(res, 200, { parent: data.parent, ward: data.ward, fees: data.fees });
      return;
    }

    if (req.method === 'GET' && path === '/api/parent/fees/receipt') {
      sendText(res, 200, receiptText(parent), 'jgs-fee-receipt.txt');
      return;
    }

    if (req.method === 'GET' && path === '/api/parent/attendance/report') {
      sendText(res, 200, attendanceReportText(parent), 'jgs-attendance-report.txt');
      return;
    }

    if (req.method === 'GET' && path === '/api/parent/progress/report') {
      sendText(res, 200, progressReportText(parent), 'jgs-progress-report.txt');
      return;
    }

    if (req.method === 'GET' && path === '/api/parent/notices') {
      sendJson(res, 200, { parent: data.parent, ward: data.ward, notices: data.notices });
      return;
    }

    if (req.method === 'GET' && path === '/api/parent/events') {
      sendJson(res, 200, { parent: data.parent, ward: data.ward, events: data.events });
      return;
    }

    if (req.method === 'POST' && path === '/api/messages') {
      const body = await parseBody(req);
      if (!body.faculty || !body.subject || !body.message) {
        sendJson(res, 400, { error: 'Faculty, subject, and message are required.' });
        return;
      }
      const message = addMessage(parent, body);
      sendJson(res, 201, {
        message,
        sentMessages: messages.filter((item) => item.parentId === parent.id)
      });
      return;
    }

    if (req.method === 'POST' && path === '/api/payments/create') {
      const body = await parseBody(req);
      const order = createPaymentOrder(parent, body);
      sendJson(res, 201, {
        order,
        gateway: {
          name: 'JGS Demo Gateway',
          mode: 'demo',
          supportedMethods: ['UPI', 'Card', 'Net Banking']
        }
      });
      return;
    }

    if (req.method === 'POST' && path === '/api/payments/confirm') {
      const body = await parseBody(req);
      if (!body.orderId) {
        sendJson(res, 400, { error: 'Payment order id is required.' });
        return;
      }
      const result = confirmPayment(parent, body);
      sendJson(res, 200, result);
      return;
    }

    sendJson(res, 404, { error: 'API route not found.' });
  } catch (error) {
    sendJson(res, 500, { error: error.message || 'Server error.' });
  }
}

module.exports = handler;
