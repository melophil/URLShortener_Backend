const rateLimit = require("express-rate-limit");

// Limit for URL creation (stricter)
exports.shortenLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 20, // max 20 shorten requests per IP
  message: {
    error: "Too many URLs created. Please try again later."
  },
  standardHeaders: true,
  legacyHeaders: false,
});

// Limit for redirects (looser)
exports.redirectLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 500, // redirects allowed
  message: {
    error: "Too many requests. Slow down."
  },
});
