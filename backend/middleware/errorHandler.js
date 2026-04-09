/**
 * Express error-handling middleware.
 * Must be registered AFTER all routes (4-argument signature required by Express).
 */
export function errorHandler(err, req, res, next) { // eslint-disable-line no-unused-vars
  console.error('Error:', err.message);
  res.status(err.status || 500).json({
    error: err.message || 'Internal server error',
  });
}
