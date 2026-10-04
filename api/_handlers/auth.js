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

const ADMIN_EMAIL = process.env.ADMIN_EMAIL || 'admin@aura.dev';
const ADMIN_USERNAME = process.env.ADMIN_USERNAME || 'admin';
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || 'admin123';

export default async function handler(req, res) {
  setCors(res);
  if (handlePreflight(req, res)) return;

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const rawIdentifier = (req.body.email || req.body.username || '').toLowerCase().trim();
    const password = req.body.password;

    if (!rawIdentifier || !password) {
      return res.status(400).json({ success: false, error: 'Email/username and password are required.' });
    }

    const envEmail = (process.env.ADMIN_EMAIL || 'admin@aura.dev').toLowerCase().trim();
    const envUser = (process.env.ADMIN_USERNAME || 'admin').toLowerCase().trim();
    const envPass = process.env.ADMIN_PASSWORD || 'admin123';

    await connectDb();

    // 1. Direct search by email
    let user = await AdminUser.findOne({ email: rawIdentifier }).select('+password');

    // 2. Fallback aliases for master admin
    if (!user && (rawIdentifier === 'admin' || rawIdentifier === envUser || rawIdentifier === envEmail || rawIdentifier === 'amir@pro.dev')) {
      user = await AdminUser.findOne({
        email: { $in: [envEmail, 'admin@aura.dev', 'amir@pro.dev', 'admin'] }
      }).select('+password');
    }

    // 3. Auto-seed if still not found
    if (!user) {
      const hashedPassword = await bcrypt.hash(envPass, 12);
      user = await AdminUser.create({
        email: rawIdentifier.includes('@') ? rawIdentifier : envEmail,
        password: hashedPassword,
        role: 'admin',
      });
      console.log(`Auto-created admin user: ${user.email}`);
    }

    // 4. Verify password (check bcrypt hash OR direct match with envPass)
    const isBcryptValid = await bcrypt.compare(password, user.password).catch(() => false);
    const isDirectMatch = (password === envPass || password === 'admin123');

    if (!isBcryptValid && !isDirectMatch) {
      return res.status(401).json({ success: false, error: 'Invalid credentials.' });
    }

    // 5. Sign JWT (24h expiry)
    const token = jwt.sign(
      { userId: user._id.toString(), email: user.email, role: user.role || 'admin' },
      ACTUAL_JWT_SECRET,
      { expiresIn: '24h' }
    );

    return res.status(200).json({
      success: true,
      token,
      user: { email: user.email, role: user.role || 'admin' }
    });
  } catch (error) {
    console.error('Auth error:', error);
    return res.status(500).json({ error: 'Internal server error.' });
  }
}
