const allowedCors = [
  'http://api.gasay-movies-explorer.nomoredomains.rocks',
  'https://api.gasay-movies-explorer.nomoredomains.rocks',
  'http://localhost:3000',
  'https://localhost:3000',
  'http://localhost:3001',
  'https://localhost:3001',
  'https://localhost:3002',
  'http://localhost:3002',
  'https://localhost:3003',
  'http://localhost:3003',
  'https://localhost:3004',
  'http://localhost:3004',
  'https://localhost:3005',
  'http://localhost:3005',
];

const DEFAULT_ALLOWED_METHODS = 'GET,HEAD,PUT,PATCH,POST,DELETE';

const cors = (req, res, next) => {
  const { origin } = req.headers;
  const { method } = req;
  const requestHeaders = req.headers['access-control-request-headers'];
  res.header('Access-Control-Allow-Credentials', true);

  if (allowedCors.includes(origin)) {
    res.header('Access-Control-Allow-Origin', origin);
  }

  if (method === 'OPTIONS') {
    res.header('Access-Control-Allow-Methods', DEFAULT_ALLOWED_METHODS);
    res.header('Access-Control-Allow-Headers', requestHeaders);
    return res.end();
  }

  return next();
};

module.exports = cors;
