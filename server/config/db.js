import mongoose from 'mongoose';

export const connectDB = async () => {
  try {
    const connUri = process.env.MONGODB_URI || 'mongodb://localhost:27017/intervue-ai';
    console.log(`Connecting to MongoDB at: ${connUri}...`);
    
    const conn = await mongoose.connect(connUri);
    console.log(`MongoDB Connected successfully: ${conn.connection.host}`);
  } catch (error) {
    console.error(`MongoDB Connection Error: ${error.message}`);
    console.log('Ensure that your local MongoDB server is running ("mongod") or MONGODB_URI is correct in .env');
    // We won't force process.exit(1) so that the server can still start for health-checks/routing tests.
  }
};
