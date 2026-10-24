import 'dotenv/config';
import mongoose from 'mongoose';
import { projects } from '../src/data/projects.js';
import Project from '../api/models/Project.js';

const MONGO_URI = process.env.MONGO_URI;
const DB_NAME = process.env.MONGO_DB_NAME || 'portfolio';

async function syncProjects() {
  console.log('Connecting to MongoDB...');
  await mongoose.connect(MONGO_URI, { dbName: DB_NAME });
  console.log('Connected successfully.');

  console.log(`Found ${projects.length} verified projects from GitHub in projects.js.`);

  // Safe non-destructive sync: upsert projects without deleting admin custom data
  console.log('Upserting verified projects into MongoDB (preserving existing records)...');
  let insertedCount = 0;
  for (const p of projects) {
    const doc = {
      ...p,
      tags: p.caseStudy?.stack || p.tags || [],
      description: p.summary,
    };
    const res = await Project.findOneAndUpdate(
      { id: p.id },
      { $setOnInsert: doc },
      { upsert: true, new: true }
    );
    if (res) insertedCount++;
  }
  console.log(`Successfully checked and synced ${insertedCount} projects.`);

  await mongoose.disconnect();
  console.log('Disconnected from MongoDB.');
}

syncProjects().catch(err => {
  console.error('Error syncing projects:', err);
  process.exit(1);
});
