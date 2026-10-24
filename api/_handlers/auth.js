/**
 * POST /api/auth   — Login with email + password, return JWT.
 * 
 * Body: { email, password }
 * Response: { token, user: { email } }
 * 
 * On first call, if no admin user exists in the database, it auto-seeds one
 * using ADMIN_EMAIL and ADMIN_PASSWORD env vars.
 * 
 * Uses Mongoose AdminUser model.
 */
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { connectDb } from '../_db.js';
import { ACTUAL_JWT_SECRET, setCors, handlePreflight } from '../_middleware.js';
import AdminUser from '../models/AdminUser.js';

// Rate limiting map: tracks failed login attempts by IP
const loginAttempts = new Map();
const MAX_ATTEMPTS = 5;
const LOCKOUT_WINDOW_MS = 15 * 60 * 1000; // 15 minutes

function checkRateLimit(ip) {
  const now = Date.now();
  const record = loginAttempts.get(ip);
  if (!record) return true;
  if (now - record.firstAttempt > LOCKOUT_WINDOW_MS) {
    loginAttempts.delete(ip);
    return true;
  }
  return record.count < MAX_ATTEMPTS;
}

function recordFailedAttempt(ip) {
  const now = Date.now();
  const record = loginAttempts.get(ip);
  if (!record || (now - record.firstAttempt > LOCKOUT_WINDOW_MS)) {
    loginAttempts.set(ip, { count: 1, firstAttempt: now });
  } else {
    record.count++;
  }
}

function clearRateLimit(ip) {
  loginAttempts.delete(ip);
}

export default async function handler(req, res) {
  setCors(res);
  if (handlePreflight(req, res)) return;

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const clientIp = req.headers['x-forwarded-for']?.split(',')[0]?.trim() || req.socket?.remoteAddress || 'unknown';

  if (!checkRateLimit(clientIp)) {
    return res.status(429).json({
      success: false,
      error: 'Too many failed login attempts. Please wait 15 minutes before trying again.'
    });
  }

  try {
    const rawIdentifier = (req.body.email || req.body.username || '').toLowerCase().trim();
    const password = req.body.password;

    if (!rawIdentifier || !password) {
      return res.status(400).json({ success: false, error: 'Email/username and password are required.' });
    }

    const envEmail = (process.env.ADMIN_EMAIL || 'admin@aura.dev').toLowerCase().trim();
    const envUser = (process.env.ADMIN_USERNAME || 'admin').toLowerCase().trim();
    const envPass = process.env.ADMIN_PASSWORD;

    let user = null;
    try {
      await connectDb();

      // 1. Direct search by email
      user = await AdminUser.findOne({ email: rawIdentifier }).select('+password');

      // 2. Fallback aliases for master admin
      if (!user && (rawIdentifier === 'admin' || rawIdentifier === envUser || rawIdentifier === envEmail || rawIdentifier === 'amir@pro.dev')) {
        user = await AdminUser.findOne({
          email: { $in: [envEmail, 'admin@aura.dev', 'amir@pro.dev', 'admin'] }
        }).select('+password');
      }

      // 3. Auto-seed if still not found and envPass is available
      if (!user && envPass && (rawIdentifier === 'admin' || rawIdentifier === envUser || rawIdentifier === envEmail || rawIdentifier === 'amir@pro.dev')) {
        const hashedPassword = await bcrypt.hash(envPass, 12);
        user = await AdminUser.create({
          email: rawIdentifier.includes('@') ? rawIdentifier : envEmail,
          password: hashedPassword,
          role: 'admin',
        }).catch(() => null);
      }
    } catch (dbErr) {
      console.warn('DB warning during auth (using fallback auth):', dbErr.message);
    }

    // 4. Verify password (check bcrypt hash OR direct match with envPass)
    const isBcryptValid = user ? await bcrypt.compare(password, user.password).catch(() => false) : false;
    const isDirectMatch = envPass ? (password === envPass) : false;

    const isMasterIdentifier = (rawIdentifier === 'admin' || rawIdentifier === envUser || rawIdentifier === envEmail || rawIdentifier === 'amir@pro.dev');

    if (!isBcryptValid && !(isMasterIdentifier && isDirectMatch)) {
      recordFailedAttempt(clientIp);
      return res.status(401).json({ success: false, error: 'Invalid credentials.' });
    }

    clearRateLimit(clientIp);

    const effectiveUserId = user?._id?.toString() || 'admin-master-id';
    const effectiveEmail = user?.email || rawIdentifier || envEmail;
    const effectiveRole = user?.role || 'admin';

    // 5. Sign JWT (24h expiry)
    const token = jwt.sign(
      { userId: effectiveUserId, email: effectiveEmail, role: effectiveRole },
      ACTUAL_JWT_SECRET,
      { expiresIn: '24h' }
    );

    return res.status(200).json({
      success: true,
      token,
      user: { email: effectiveEmail, role: effectiveRole }
    });
  } catch (error) {
    console.error('Auth error:', error);
    return res.status(500).json({ error: 'Internal server error.' });
  }
}
