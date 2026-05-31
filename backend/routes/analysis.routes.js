import { Router } from "express";
import {
  chatbot,
  searchYouTube,
  getExamData,
  getExamAnalysis,
  getAnalysisTopic,
} from "../controllers/analysis.controller.js";

const router = Router();

/**
 * @route   POST /chatbot
 * @desc    Ask a study-related question to the AI chatbot
 */
router.post("/chatbot", chatbot);

/**
 * @route   POST /yt
 * @desc    Search YouTube for educational videos
 */
router.post("/yt", searchYouTube);

/**
 * @route   POST /getExamData
 * @desc    Get exam history for a user
 */
router.post("/getExamData", getExamData);

/**
 * @route   POST /getExamAnalysis
 * @desc    Get exam analysis data for a user
 */
router.post("/getExamAnalysis", getExamAnalysis);

/**
 * @route   POST /getAnalysisTopic
 * @desc    Get analysis topics for a user
 */
router.post("/getAnalysisTopic", getAnalysisTopic);

export default router;
