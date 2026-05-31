import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config();

/**
 * @description Connects to MongoDB using the connection string from environment variables.
 * Logs the connection status to the console.
 * @returns {Promise<void>}
 */
export async function connectDB() {
  try {
    await mongoose.connect(process.env.MONGO_URL);
    console.log("Database connected successfully");
  } catch (error) {
    console.error(`Error connecting to database: ${error.message}`);
    process.exit(1);
  }
}
