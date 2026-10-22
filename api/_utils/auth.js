import jwt from 'jsonwebtoken';
import { parseCookie } from 'cookie';

const JWT_SECRET = process.env.JWT_SECRET || 'dev-aura-jwt-secret-key-32-chars-long';

/**
 * Verify JWT token from request cookies, Authorization header, or x-auth-token header.
 * 
 * @param {object} req - Vercel Serverless request object
 * @returns {object|null} Decoded token payload or null if invalid
 */
export function verifyToken(req) {
  const candidateTokens = [];

  // 1. Authorization header: Bearer <token>
  const authHeader = req?.headers?.authorization || req?.headers?.Authorization;
  if (authHeader && authHeader.startsWith('Bearer ')) {
    candidateTokens.push(authHeader.split(' ')[1]);
  }

  // 2. x-auth-token header
  const xAuthToken = req?.headers?.['x-auth-token'];
  if (xAuthToken) {
    candidateTokens.push(xAuthToken);
  }

  // 3. Cookies for 'aura_token' or 'token'
  if (req?.headers?.cookie) {
    try {
      const cookies = parseCookie(req.headers.cookie);
      if (cookies.aura_token) candidateTokens.push(cookies.aura_token);
      if (cookies.token) candidateTokens.push(cookies.token);
    } catch (e) {
      console.error('Error parsing cookie:', e);
    }
  }

  for (const token of candidateTokens) {
    if (!token) continue;
    try {
      const payload = jwt.verify(token, JWT_SECRET);
      if (payload) return payload;
    } catch {
      // Token candidate failed verification, try next candidate
    }
  }

  return null;
}

/**
 * Middleware utility to enforce authentication on mutation endpoints.
 * Returns 401 Unauthorized response if token is invalid or missing.
 * 
 * @param {object} req - Vercel Serverless request object
 * @param {object} res - Vercel Serverless response object
 * @returns {object|null} Decoded payload if authorized, null if unauthorized (response sent)
 */
export function verifyAuth(req, res) {
  const payload = verifyToken(req);

  if (!payload) {
    res.status(401).json({
      success: false,
      error: 'Unauthorized: Invalid or missing authentication token',
    });
    return null;
  }

  return payload;
}

export default verifyAuth;

