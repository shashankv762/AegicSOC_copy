import rateLimit from 'express-rate-limit';

export const apiLimiter = rateLimit({
  windowMs: 60 * 1000, // 1 minute
  max: 5000, // Increased limit to 5000 requests per minute
  skip: (req) => {
    // Skip rate limiting for internal log generator and health checks
    return req.ip === '::ffff:127.0.0.1' || req.ip === '::1' || req.ip === '127.0.0.1';
  },
  handler: (req, res) => {
    console.warn(`Rate limit exceeded for IP: ${req.ip} on ${req.method} ${req.path}`);
    res.status(429).json({
      error: 'Too many requests, please try again later.',
    });
  },
  message: {
    error: 'Too many requests, please try again later.',
  },
  standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
  legacyHeaders: false, // Disable the `X-RateLimit-*` headers
});
