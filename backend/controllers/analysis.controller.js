import { User } from "../models/user.js";
import { chatbotAnswer } from "../services/gemini.service.js";
import { searchVideos } from "../services/youtube.service.js";

/**
 * @description Handles chatbot questions. Sends the user's study-related question
 * to Gemini AI along with the current content context.
 *
 * @param {import('express').Request} req - Express request with `input` (question) and `content` in body
 * @param {import('express').Response} res - Express response — text answer from Gemini
 */
export async function chatbot(req, res) {
  try {
    const answer = await chatbotAnswer(req.body.input, req.body.content);
    res.send(answer);
  } catch (err) {
    console.error("Chatbot error:", err);
    res.status(500).json({ message: "Error processing chatbot request" });
  }
}

/**
 * @description Searches YouTube for educational videos related to the given topic.
 *
 * @param {import('express').Request} req - Express request with `opt` (topic) in body
 * @param {import('express').Response} res - Express response — array of YouTube video URLs
 */
export async function searchYouTube(req, res) {
  try {
    const links = await searchVideos(req.body.opt);
    res.send(links);
  } catch (err) {
    console.error("YouTube search error:", err);
    res.status(500).json({ message: "Error searching YouTube" });
  }
}

/**
 * @description Retrieves all exam data (history) for a specific user.
 *
 * @param {import('express').Request} req - Express request with `user` (email) in body
 * @param {import('express').Response} res - Express response — array of exam records
 */
export async function getExamData(req, res) {
  try {
    const data = await User.findOne({ email: req.body.user });
    res.send(data.exam);
  } catch (err) {
    console.error("Error fetching exam data:", err);
    res.status(500).json({ message: "Error fetching exam data" });
  }
}

/**
 * @description Retrieves exam analysis data for a user.
 *
 * @param {import('express').Request} req - Express request with `user` (email) in body
 * @param {import('express').Response} res - Express response — array of exam records
 */
export async function getExamAnalysis(req, res) {
  try {
    const user = await User.findOne({ email: req.body.user });
    res.send(user.exam);
  } catch (err) {
    console.error("Error fetching exam analysis:", err);
    res.status(500).json({ message: "Error fetching exam analysis" });
  }
}

/**
 * @description Retrieves all exam topics/history for a user for analysis purposes.
 *
 * @param {import('express').Request} req - Express request with `user` (email) in body
 * @param {import('express').Response} res - Express response — array of exam records
 */
export async function getAnalysisTopic(req, res) {
  try {
    const topics = await User.find({ email: req.body.user });
    res.send(topics[0].exam);
  } catch (err) {
    console.error("Error fetching analysis topics:", err);
    res.status(500).json({ message: "Error fetching analysis topics" });
  }
}
