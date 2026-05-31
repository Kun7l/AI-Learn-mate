import authRoutes from "./auth.routes.js";
import subjectRoutes from "./subject.routes.js";
import topicRoutes from "./topic.routes.js";
import examRoutes from "./exam.routes.js";
import analysisRoutes from "./analysis.routes.js";

/**
 * @description Mounts all route modules onto the Express application.
 * Each route module handles a specific domain of the API.
 *
 * @param {import('express').Application} app - The Express application instance
 */
export function mountRoutes(app) {
  app.use(authRoutes);
  app.use(subjectRoutes);
  app.use(topicRoutes);
  app.use(examRoutes);
  app.use(analysisRoutes);
}
