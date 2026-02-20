import mongoose from 'mongoose';

const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
  throw new Error('Please define the MONGODB_URI environment variable');
}

let cached = global.mongoose;

if (!cached) {
  cached = global.mongoose = { conn: null, promise: null };
}

function createConnectionPromise() {
  return new Promise((resolve, reject) => {
    const timeoutId = setTimeout(() => {
      reject(new Error('MongoDB connection timeout after 10 seconds'));
    }, 10000);

    const opts = {
      bufferCommands: false,
      serverSelectionTimeoutMS: 5000,
      socketTimeoutMS: 5000,
      family: 4,
    };

    mongoose
      .connect(MONGODB_URI as string, opts)
      .then((mongoose) => {
        clearTimeout(timeoutId);
        console.log('✅ MongoDB Connected');
        resolve(mongoose);
      })
      .catch((error) => {
        clearTimeout(timeoutId);
        console.error('❌ MongoDB Connection Error:', error.message);
        reject(error);
      });
  });
}

export async function connectDB() {
  if (cached.conn) {
    return cached.conn;
  }

  if (!cached.promise) {
    cached.promise = createConnectionPromise();
  }

  try {
    cached.conn = await cached.promise;
  } catch (e: any) {
    cached.promise = null;
    console.error('DB Connection Failed:', e.message);
    throw new Error(`Failed to connect to MongoDB: ${e.message}`);
  }

  return cached.conn;
}

declare global {
  var mongoose: any;
}
