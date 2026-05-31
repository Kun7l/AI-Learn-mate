import { io } from "socket.io-client";

/**
 * @description Singleton Socket.IO client instance.
 * Connects to the backend server on localhost:3000.
 * Auto-connects on import and can be reused across components.
 */
const socket = io("http://localhost:3000");

export default socket;
