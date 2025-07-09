// middleware/timeout.js
export const setTimeoutMiddleware = (ms) => (req, res, next) => {
  req.setTimeout(ms);
  res.setTimeout(ms, () => {
    console.warn(`❗ Timeout of ${ms}ms: ${req.originalUrl}`);
    if (!res.headersSent) {
      res.status(504).json({ message: "Request timeout. Please try again." });
    }
  });
  next();
};
