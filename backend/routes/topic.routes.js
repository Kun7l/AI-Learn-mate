import { Router } from "express";
import {
  setOption,
  getTopics,
  getSuggestedTopics,
  getCourseContent,
  getStepper,
} from "../controllers/topic.controller.js";

const router = Router();

/**
 * @route   POST /setoption
 * @desc    Add a new learning topic for the user (AI-validated)
 */
router.post("/setoption", setOption);

/**
 * @route   POST /getTopic
 * @desc    Get all small topics for a subtopic with completion status
 */
router.post("/getTopic", getTopics);

/**
 * @route   POST /getsugTopic
 * @desc    Get suggested improvement topics for a subtopic
 */
router.post("/getsugTopic", getSuggestedTopics);

/**
 * @route   POST /course
 * @desc    Get or generate HTML course content for a small topic
 */
router.post("/course", getCourseContent);

/**
 * @route   POST /getStepper
 * @desc    Get stepper data (suggested topic names) for a small topic
 */
router.post("/getStepper", getStepper);

export default router;
