import express from "express";
import { createServer } from "http";
import { Server as SocketIOServer } from "socket.io";
import bodyParser from "body-parser";
import cors from "cors";
import session from "express-session";
import dotenv from "dotenv";

import { connectDB } from "./config/db.js";
import { corsOptions, allowedOrigins } from "./config/cors.js";
import { sessionOptions } from "./config/session.js";
import { mountRoutes } from "./routes/index.js";
import { registerGeminiHandlers } from "./socket/gemini.handler.js";

dotenv.config();

/**
 * @description Application entry point.
 * Connects to the database, configures middleware, mounts REST routes,
 * attaches Socket.IO for real-time streaming, and starts the server.
 */
async function startServer() {
  // Connect to MongoDB
  await connectDB();

  const app = express();
  const httpServer = createServer(app);

  // --- Socket.IO ---
  const io = new SocketIOServer(httpServer, {
    cors: {
      origin: allowedOrigins,
      credentials: true,
    },
  });

  // --- Middleware ---
  app.use(cors(corsOptions));
  app.use(bodyParser.json());
  app.use(bodyParser.urlencoded({ extended: true }));
  app.use(express.static("public"));
  app.use(session(sessionOptions));

  // --- REST Routes ---
  mountRoutes(app);

  // --- Socket.IO Handlers ---
  registerGeminiHandlers(io);

  // --- Start Server ---
  const PORT = process.env.PORT || 3000;
  httpServer.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
    console.log(`Socket.IO ready for connections`);
  });
}

// Catch unhandled promise rejections (e.g. MongoDB DNS resolution failures)
process.on("unhandledRejection", (err) => {
  console.error("Unhandled rejection:", err.message);
  process.exit(1);
});

startServer().catch((err) => {
  console.error("Failed to start server:", err.message);
  process.exit(1);
});
