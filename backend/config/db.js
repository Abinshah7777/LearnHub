import mongoose from "mongoose";
import { MongoMemoryServer } from "mongodb-memory-server";

let mongod = null;

const connectDB = async () => {
  try {
    let uri = process.env.MONGO_URI;

    // Check if Mongo is running on uri, if not or if MONGO_URI is missing, spin up in-memory DB
    if (!uri || uri.includes("localhost") || uri.includes("127.0.0.1")) {
      try {
        console.log("🔍 Checking local MongoDB server availability...");
        // Try connecting with a short timeout
        const tempConn = await mongoose.createConnection(uri || "mongodb://localhost:27017/learnhub", {
          serverSelectionTimeoutMS: 2000,
        }).asPromise();
        await tempConn.close();
        console.log("✅ Local MongoDB server is available.");
      } catch (err) {
        console.log("⚠️ Local MongoDB server not available. Starting in-memory MongoDB server fallback...");
        mongod = await MongoMemoryServer.create();
        uri = mongod.getUri();
      }
    }

    const conn = await mongoose.connect(uri);
    console.log(`✅ MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error(`❌ MongoDB connection error: ${error.message}`);
    process.exit(1);
  }
};

export default connectDB;