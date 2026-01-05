import mongoose from 'mongoose';

type MongooseConnection = typeof mongoose;

// Global variable to track connection state
declare global {
  var mongooseCache: {
    conn: MongooseConnection | null;
    promise: Promise<MongooseConnection> | null;
  };
}

// Initialize global mongoose object
let cached = global.mongooseCache;

if (!cached) {
  cached = global.mongooseCache = { conn: null, promise: null };
}

/**
 * Connect to MongoDB using Mongoose
 * Uses connection pooling and caching for optimal performance
 */
export async function connectDB(): Promise<MongooseConnection> {
  // Check if already connected
  if (cached.conn) {
    console.log('✓ Using existing MongoDB connection');
    return cached.conn;
  }

  // Check if MONGODB_URI is set
  const MONGODB_URI = process.env.MONGODB_URI;
  
  if (!MONGODB_URI) {
    throw new Error(
      '❌ Please define MONGODB_URI environment variable in .env.local'
    );
  }

  // If a connection is already being established, wait for it
  if (cached.promise) {
    console.log('⏳ Waiting for existing MongoDB connection...');
    cached.conn = await cached.promise;
    return cached.conn;
  }

  // Create new connection
  console.log('⚡ Establishing new MongoDB connection...');
  
  cached.promise = mongoose.connect(MONGODB_URI, {
    bufferCommands: false,
    maxPoolSize: 10,
    minPoolSize: 2,
  }).then((mongooseInstance) => {
    console.log('✓ MongoDB connected successfully');
    return mongooseInstance;
  }).catch((error) => {
    console.error('❌ MongoDB connection error:', error);
    cached.promise = null;
    throw error;
  });

  try {
    cached.conn = await cached.promise;
  } catch (error) {
    cached.promise = null;
    throw error;
  }

  return cached.conn;
}

/**
 * Disconnect from MongoDB
 */
export async function disconnectDB(): Promise<void> {
  if (cached.conn) {
    await mongoose.disconnect();
    cached.conn = null;
    cached.promise = null;
    console.log('✓ MongoDB disconnected');
  }
}
