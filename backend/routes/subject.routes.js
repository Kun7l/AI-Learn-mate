import { Router } from "express";
import {
  getAllSubjects,
  getBoardSubjects,
  getSubTopics,
  getOptedTopics,
} from "../controllers/subject.controller.js";

const router = Router();

/**
 * @route   POST /explore
 * @desc    Get all available subjects
 */
router.post("/explore", getAllSubjects);

/**
 * @route   POST /exploreBoard
 * @desc    Get subjects for a specific education level/board
 */
router.post("/exploreBoard", getBoardSubjects);

/**
 * @route   POST /subject
 * @desc    Get subtopics by subject and level
 */
router.post("/subject", getSubTopics);

/**
 * @route   POST /opted
 * @desc    Get user's enrolled subtopics
 */
router.post("/opted", getOptedTopics);

export default router;
