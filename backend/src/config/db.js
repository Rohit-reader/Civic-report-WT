import mongoose from 'mongoose';

export const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/civic_resolve');
    console.log(`[MongoDB Connected] Host: ${conn.connection.host}, Database: ${conn.connection.name}`);
  } catch (error) {
    console.error(`[MongoDB Connection Error] ${error.message}`);
    console.log('Ensure your local MongoDB service is running (e.g. MongoDB Compass connection to mongodb://127.0.0.1:27017) or verify your Atlas MONGODB_URI in .env');
    process.exit(1);
  }
};
