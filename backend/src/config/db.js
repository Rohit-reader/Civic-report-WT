import mongoose from 'mongoose';

export const connectDB = async () => {
  const primaryUri = process.env.MONGODB_URI;
  const fallbackUri = 'mongodb://127.0.0.1:27017/civic_resolve';

  try {
    const conn = await mongoose.connect(primaryUri || fallbackUri);
    console.log(`[MongoDB Connected] Host: ${conn.connection.host}, Database: ${conn.connection.name}`);
  } catch (error) {
    console.warn(`[Primary MongoDB Connection Failed] ${error.message}`);
    if (primaryUri && primaryUri !== fallbackUri) {
      console.log(`Attempting fallback to local MongoDB Compass (${fallbackUri})...`);
      try {
        const fallbackConn = await mongoose.connect(fallbackUri);
        console.log(`[MongoDB Fallback Connected] Host: ${fallbackConn.connection.host}, Database: ${fallbackConn.connection.name}`);
        return;
      } catch (fallbackError) {
        console.error(`[Local MongoDB Fallback Failed] ${fallbackError.message}`);
      }
    }
    console.error('Ensure MongoDB is accessible via Compass (mongodb://127.0.0.1:27017) or check Atlas connection string.');
  }
};
