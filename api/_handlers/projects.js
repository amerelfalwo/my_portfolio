import { connectDb } from '../_utils/mongodb.js';
import Project from '../models/Project.js';
import { setCors, handlePreflight } from '../_middleware.js';
import { verifyAuth } from '../_utils/auth.js';
import { projects as staticProjects } from '../../src/data/projects.js';

export default async function handler(req, res) {
  setCors(res);
  if (handlePreflight(req, res)) return;

  try {
    // GET requests are public
    if (req.method === 'GET') {
      try {
        await connectDb();
        const projects = await Project.find({}).sort({ createdAt: -1 });
        if (Array.isArray(projects) && projects.length > 0) {
          return res.status(200).json({
            success: true,
            data: projects,
          });
        }
      } catch (dbErr) {
        console.warn('MongoDB query failed, falling back to static projects:', dbErr.message);
      }

      return res.status(200).json({
        success: true,
        data: staticProjects,
      });
    }

    // Enforce authentication for mutation endpoints (POST, PUT, DELETE)
    if (['POST', 'PUT', 'DELETE'].includes(req.method)) {
      if (!verifyAuth(req, res)) return;
      await connectDb();
    }

    if (req.method === 'POST') {
      const projectData = { ...req.body };
      if (projectData.imageUrl) {
        projectData.image = projectData.imageUrl;
      }
      const newProject = await Project.create(projectData);
      return res.status(201).json({
        success: true,
        data: newProject,
      });
    }

    if (req.method === 'PUT') {
      const { id } = req.query;
      if (!id) {
        return res.status(400).json({ success: false, error: 'Missing document id parameter' });
      }
      const updateData = { ...req.body };
      if (updateData.imageUrl) {
        updateData.image = updateData.imageUrl;
      }
      const updated = await Project.findByIdAndUpdate(id, updateData, { new: true, runValidators: true });
      if (!updated) {
        return res.status(404).json({ success: false, error: 'Project document not found' });
      }
      return res.status(200).json({ success: true, data: updated });
    }

    if (req.method === 'DELETE') {
      const { id } = req.query;
      if (!id) {
        return res.status(400).json({ success: false, error: 'Missing document id parameter' });
      }
      const deleted = await Project.findByIdAndDelete(id);
      if (!deleted) {
        return res.status(404).json({ success: false, error: 'Project document not found' });
      }
      return res.status(200).json({ success: true, data: deleted });
    }

    return res.status(405).json({
      success: false,
      error: 'Method not allowed',
    });
  } catch (error) {
    console.error('API Error (/api/projects):', error);
    return res.status(500).json({
      success: false,
      error: error.message || 'Internal server error',
    });
  }
}
