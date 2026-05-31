import { Router } from "express";
import {
  checkSession,
  login,
  logout,
  signup,
} from "../controllers/auth.controller.js";

const router = Router();

/**
 * @route   GET /auth/check-session
 * @desc    Check if user has an active session
 */
router.get("/auth/check-session", checkSession);

/**
 * @route   POST /login
 * @desc    Authenticate user with email and password
 */
router.post("/login", login);

/**
 * @route   GET /logout
 * @desc    Destroy user session
 */
router.get("/logout", logout);

/**
 * @route   POST /signup
 * @desc    Register a new user
 */
router.post("/signup", signup);

export default router;
