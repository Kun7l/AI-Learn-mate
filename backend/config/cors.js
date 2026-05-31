/**
 * @description CORS configuration for the Express application.
 * Defines allowed origins and enables credentials for cross-origin requests.
 */

export const allowedOrigins = [
  "http://localhost:5173",
];

/**
 * @description CORS options object compatible with the `cors` middleware.
 * Validates incoming request origins against the allowedOrigins whitelist.
 */
export const corsOptions = {
  origin: function (origin, callback) {
    // Allow requests with no origin (e.g., mobile apps, curl, Postman)
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  },
  credentials: true,
};
