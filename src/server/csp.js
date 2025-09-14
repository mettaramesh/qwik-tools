// src/server/csp.js
// Express middleware for CSP header with report-only and nonce support

const crypto = require('crypto');

function cspMiddleware(options = {}) {
  const {
    reportOnly = false,
    nonce = false,
    directives = {},
    reportUri = null,
  } = options;

  return function (req, res, next) {
    let nonceValue = null;
    if (nonce) {
      nonceValue = crypto.randomBytes(16).toString('base64');
      res.locals.cspNonce = nonceValue;
    }
    const baseDirectives = {
      "default-src": ["'self'"],
      "style-src": ["'self'"],
      "script-src": ["'self'", ...(nonceValue ? [`'nonce-${nonceValue}'`] : [])],
      ...directives,
    };
    if (reportUri) {
      baseDirectives['report-uri'] = [reportUri];
    }
    const cspHeader = Object.entries(baseDirectives)
      .map(([k, v]) => `${k} ${v.join(' ')}`)
      .join('; ');
    res.setHeader(
      reportOnly ? 'Content-Security-Policy-Report-Only' : 'Content-Security-Policy',
      cspHeader
    );
    next();
  };
}

module.exports = cspMiddleware;
