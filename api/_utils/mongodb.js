import mongoose from 'mongoose';


/**
 * Global cache object to persist connection across hot reloads in development
 * and across function invocations in Vercel's serverless environment.
 */
let cached = global._mongooseConnection;

if (!cached) {
  cached = global._mongooseConnection = { conn: null, promise: null };
}

/**
 * Connect to MongoDB using Mongoose with connection pooling and caching.
 * @returns {Promise<mongoose.Connection>}
 */
export async function connectDb() {
  const uri = process.env.MONGO_URI || process.env.MONGODB_URI;
  const dbName = process.env.MONGO_DB_NAME || 'portfolio';

  if (cached.conn && mongoose.connection.readyState === 1) {
    return cached.conn;
  }

  if (!cached.promise || mongoose.connection.readyState === 0 || mongoose.connection.readyState === 3) {
    if (!uri) {
      throw new Error('Please define the MONGO_URI environment variable inside .env or Vercel settings.');
    }

    const opts = {
      dbName: dbName,
      bufferCommands: false,
      serverSelectionTimeoutMS: 3000,
      connectTimeoutMS: 5000,
      socketTimeoutMS: 45000,
      maxPoolSize: 10,
    };

    cached.promise = mongoose.connect(uri, opts).then((m) => m.connection);
  }

  try {
    cached.conn = await cached.promise;
  } catch (e) {
    cached.promise = null;
    cached.conn = null;
    throw e;
  }

  return cached.conn;
}

export default connectDb;
