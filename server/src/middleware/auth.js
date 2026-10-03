import jwt from 'jsonwebtoken';
import supabase from '../config/supabase.js';

const JWT_SECRET = process.env.SUPABASE_JWT_SECRET;

/**
 * Express middleware to verify Supabase JWT tokens.
 * First validates via supabase.auth.getUser(token), with fallback to local jwt.verify.
 * Extracts the user from the token and attaches to req.user.
 */
export const authenticateToken = async (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1]; // "Bearer <token>"

  if (!token) {
    return res.status(401).json({ error: 'Access token required' });
  }

  // 1. Try verifying with Supabase auth client
  try {
    const { data: { user }, error } = await supabase.auth.getUser(token);
    if (!error && user) {
      req.user = {
        id: user.id,
        email: user.email,
        role: user.role,
        user_metadata: user.user_metadata,
      };
      return next();
    }
  } catch (err) {
    // Fall back to jwt.verify if offline or secret provided
  }

  // 2. Fallback to local JWT secret verification if configured
  if (JWT_SECRET && JWT_SECRET !== 'your-jwt-secret-here') {
    try {
      const decoded = jwt.verify(token, JWT_SECRET);
      req.user = {
        id: decoded.sub,
        email: decoded.email,
        role: decoded.role,
      };
      return next();
    } catch (err) {
      return res.status(403).json({ error: 'Invalid or expired token' });
    }
  }

  return res.status(403).json({ error: 'Invalid or expired token' });
};
