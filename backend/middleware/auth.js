import jwt from 'jsonwebtoken';

/**
 * Authentication middleware – verifies JWT token from Authorization header.
 */
export function auth(req, res, next) {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ error: 'Authentication required' });
    }

    const token = authHeader.split(' ')[1];
    if (!token) {
      return res.status(401).json({ error: 'Authentication required' });
    }

    const secret = process.env.JWT_SECRET || 'futbolaz-default-secret';
    const decoded = jwt.verify(token, secret);
    req.user = decoded;
    next();
  } catch (error) {
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({ error: 'Token expired' });
    }
    return res.status(401).json({ error: 'Invalid token' });
  }
}

/**
 * Admin authentication middleware – verifies JWT and checks admin role.
 */
export function adminAuth(req, res, next) {
  auth(req, res, (err) => {
    if (err) return;
    if (res.headersSent) return;

    // Check if user has admin role
    if (!req.user || req.user.role !== 'admin') {
      return res.status(403).json({ error: 'Admin access required' });
    }
    next();
  });
}
