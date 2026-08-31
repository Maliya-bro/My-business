const helmet = require('helmet');
const rateLimit = require('express-rate-limit');

const securityMiddleware = [
  helmet({
    contentSecurityPolicy: {
      directives: {
        defaultSrc: ["'self'"],
        styleSrc: ["'self'", "'unsafe-inline'", 'https://fonts.googleapis.com'],
        fontSrc: ["'self'", 'https://fonts.gstatic.com'],
        scriptSrc: ["'self'", "'unsafe-inline'"],
        imgSrc: ["'self'", 'data:', 'https://*.imagekit.io'],
      }
    }
  }),
  rateLimit({
    windowMs: 15 * 60 * 1000, // 15 min
    max: 100,
    message: 'Too many requests, please try again later.'
  })
];

module.exports = securityMiddleware;