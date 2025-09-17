const mongoose = require('mongoose');

const DEFAULT_URI = 'mongodb://localhost:27017/civic-pulse';

function buildMongoUri() {
  if (process.env.MONGODB_URI) return process.env.MONGODB_URI.trim();
  const host = process.env.MONGO_HOST || 'localhost';
  const port = process.env.MONGO_PORT || '27017';
  const db   = process.env.MONGO_DB   || 'civic-pulse';
  if (process.env.MONGO_USER && process.env.MONGO_PASS) {
    return `mongodb://${encodeURIComponent(process.env.MONGO_USER)}:${encodeURIComponent(process.env.MONGO_PASS)}@${host}:${port}/${db}?authSource=${process.env.MONGO_AUTH_DB || 'admin'}`;
  }
  return `mongodb://${host}:${port}/${db}`;
}

let cached = false;

async function connectDB(maxRetries = 5, delayMs = 1500) {
  if (cached) return mongoose.connection;
  const uri = buildMongoUri() || DEFAULT_URI;
  console.log('[DB] Attempting connection to', uri);
  let attempt = 0;
  while (attempt <= maxRetries) {
    try {
      await mongoose.connect(uri, {
        // Add any desired options here
        autoIndex: true
      });
      console.log('[DB] Connected. State:', mongoose.connection.readyState);
      cached = true;
      mongoose.connection.on('disconnected', () => {
        console.warn('[DB] Disconnected');
        cached = false;
      });
      mongoose.connection.on('reconnected', () => {
        console.log('[DB] Reconnected');
      });
      return mongoose.connection;
    } catch (err) {
      attempt++;
      console.error(`[DB] Connection attempt ${attempt} failed:`, err.message);
      if (attempt > maxRetries) {
        console.error('[DB] Exceeded max retries. Exiting.');
        throw err;
      }
      await new Promise(r => setTimeout(r, delayMs));
    }
  }
}

module.exports = { connectDB, buildMongoUri };