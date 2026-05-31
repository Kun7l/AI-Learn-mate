/**
 * @description Middleware that checks if the user has an active session.
 * Returns 401 Unauthorized if no session exists.
 * Attach this middleware to any route that requires authentication.
 *
 * @param {import('express').Request} req - Express request object
 * @param {import('express').Response} res - Express response object
 * @param {import('express').NextFunction} next - Express next middleware function
 */
export function requireAuth(req, res, next) {
  if (req.session && req.session.user) {
    next();
  } else {
    res.status(401).json({ message: "Not authenticated" });
  }
}
