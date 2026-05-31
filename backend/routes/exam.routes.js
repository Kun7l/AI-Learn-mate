import { Router } from "express";
import {
  generateExam,
  generateCourseChallenge,
  submitExam,
  submitCourseChallenge,
} from "../controllers/exam.controller.js";

const router = Router();

/**
 * @route   POST /exam
 * @desc    Generate an MCQ exam for a topic
 */
router.post("/exam", generateExam);

/**
 * @route   POST /coursechallenge
 * @desc    Generate a course challenge exam covering multiple topics
 */
router.post("/coursechallenge", generateCourseChallenge);

/**
 * @route   POST /submitExam
 * @desc    Submit exam results, handle level progression and suggestions
 */
router.post("/submitExam", submitExam);

/**
 * @route   POST /submitcourseChallenge
 * @desc    Submit course challenge results
 */
router.post("/submitcourseChallenge", submitCourseChallenge);

export default router;
