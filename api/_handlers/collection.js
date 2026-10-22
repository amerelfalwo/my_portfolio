/**
 * Generic CRUD handler for collection-based resources.
 * 
 * GET    /api/collection?name=services         — List all documents.
 * POST   /api/collection?name=services         — Create a new document (auth required).
 * PUT    /api/collection?name=services&id=xxx  — Update a document (auth required).
 * DELETE /api/collection?name=services&id=xxx  — Delete a document (auth required).
 *
 * Uses Mongoose models for schema validation and data integrity.
 */
import mongoose from 'mongoose';
import { connectDb } from '../_db.js';
import { setCors, handlePreflight, requireAuth } from '../_middleware.js';

export const config = {
  api: {
    bodyParser: {
      sizeLimit: '10mb',
    },
  },
};


// Import all models so Mongoose registers them
import Service from '../models/Service.js';
import Skill from '../models/Skill.js';
import Project from '../models/Project.js';
import Certification from '../models/Certification.js';
import Training from '../models/Training.js';
import Message from '../models/Message.js';

/**
 * Maps collection name (from query string) → Mongoose model.
 */
const MODEL_MAP = {
  services: Service,
  skills: Skill,
  projects: Project,
  certifications: Certification,
  trainings: Training,
  messages: Message,
};

const ALLOWED_COLLECTIONS = Object.keys(MODEL_MAP);

export default async function handler(req, res) {
  setCors(res);
  if (handlePreflight(req, res)) return;

  const { name, id } = req.query;

  if (!name || !ALLOWED_COLLECTIONS.includes(name)) {
    return res.status(400).json({ error: `Invalid collection. Allowed: ${ALLOWED_COLLECTIONS.join(', ')}` });
  }

  await connectDb();
  const Model = MODEL_MAP[name];

  try {
    // ── GET: List all ──
    if (req.method === 'GET') {
      const docs = await Model.find({}).lean();
      // Normalize _id → id for frontend compatibility
      const result = docs.map(({ _id, __v: _v, ...rest }) => ({ id: _id.toString(), ...rest }));
      return res.status(200).json(result);
    }

    // ── POST: Create (messages are public, rest require auth) ──
    if (req.method === 'POST') {
      if (name !== 'messages') {
        if (!requireAuth(req, res)) return;
      }
      const doc = await Model.create(req.body);
      return res.status(201).json(doc.toJSON());
    }

    // ── PUT: Update ──
    if (req.method === 'PUT') {
      if (!requireAuth(req, res)) return;
      if (!id) return res.status(400).json({ error: 'Missing "id" query parameter.' });
      if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(400).json({ error: 'Invalid "id" format.' });
      }

      const data = { ...req.body };
      delete data.id;
      delete data._id;

      const updated = await Model.findByIdAndUpdate(id, data, { new: true, runValidators: true });
      if (!updated) return res.status(404).json({ error: 'Document not found.' });
      return res.status(200).json({ success: true });
    }

    // ── DELETE ──
    if (req.method === 'DELETE') {
      if (!requireAuth(req, res)) return;
      if (!id) return res.status(400).json({ error: 'Missing "id" query parameter.' });
      if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(400).json({ error: 'Invalid "id" format.' });
      }

      const deleted = await Model.findByIdAndDelete(id);
      if (!deleted) return res.status(404).json({ error: 'Document not found.' });
      return res.status(200).json({ success: true });
    }

    return res.status(405).json({ error: 'Method not allowed' });
  } catch (error) {
    console.error(`Collection API error (${name}):`, error);
    return res.status(500).json({ error: 'Internal server error.' });
  }
}
