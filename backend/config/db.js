import mongoose from "mongoose";

const connectDB = async () => {
  try {
    // We removed the empty {} options object since Mongoose 6+ doesn't need them
    const conn = await mongoose.connect(process.env.MONGO_URI);
    console.log(`✅ MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error(`❌ MongoDB connection error: ${error.message}`);
    process.exit(1);
  }
};

export default connectDB;