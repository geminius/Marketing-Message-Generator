const http = require('http');
const url = require('url');
const { handleRequest } = require('./handler');

const PORT = process.env.PORT || 3100;

function send(res, status, data) {
  const body = data ? JSON.stringify(data) : '';
  res.writeHead(status, { 'Content-Type': 'application/json' });
  res.end(body);
}

function mapError(err) {
  if (err && err.message === 'invalid_json') {
    return { status: 400, body: { error: 'invalid_json' } };
  }
  return { status: 500, body: { error: 'server_error' } };
}

function parseBody(req) {
  return new Promise((resolve, reject) => {
    let buf = '';
    req.on('data', (c) => (buf += c));
    req.on('end', () => {
      if (!buf) return resolve({});
      try {
        resolve(JSON.parse(buf.toString()));
      } catch (e) {
        reject(new Error('invalid_json'));
      }
    });
  });
}

const server = http.createServer(async (req, res) => {
  const parsed = url.parse(req.url, true);
  const path = parsed.pathname || '/';
  const method = req.method || 'GET';

  // CORS for local dev
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,POST,PUT,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  if (method === 'OPTIONS') return send(res, 204);

  try {
    const body = ['POST', 'PUT'].includes(method) ? await parseBody(req) : {};
    const { status, body: resp } = await handleRequest(method, path, parsed.query || {}, body);
    return send(res, status, resp);
  } catch (e) {
    const { status: errStatus, body: errBody } = mapError(e);
    return send(res, errStatus, errBody);
  }
});

if (require.main === module) {
  server.listen(PORT, () => {
    console.log(`Server listening on :${PORT}`);
  });
}

module.exports = { server, mapError };
