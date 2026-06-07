const http = require('http');
const handler = require('./api/index');

const port = Number(process.env.PORT || 4174);

const server = http.createServer((req, res) => {
  handler(req, res);
});

server.listen(port, '127.0.0.1', () => {
  console.log(`JGS Parent Portal API running at http://127.0.0.1:${port}`);
});
