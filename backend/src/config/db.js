import mongoose from 'mongoose';

export async function connectDB(uri = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/ridify') {
  await mongoose.connect(uri);
  return mongoose.connection;
}
