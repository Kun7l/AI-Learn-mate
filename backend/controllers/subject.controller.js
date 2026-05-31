import { Subject } from "../models/subject.js";
import { SubTopic } from "../models/subtopic.js";
import { boardSubjects } from "../models/boardsubject.js";
import { User } from "../models/user.js";

/**
 * @description Retrieves all available subjects from the database.
 *
 * @param {import('express').Request} req - Express request object
 * @param {import('express').Response} res - Express response object
 */
export async function getAllSubjects(req, res) {
  try {
    const subjects = await Subject.find({});
    res.send(subjects);
  } catch (err) {
    console.error("Error fetching subjects:", err);
    res.status(500).json({ message: "Error fetching subjects" });
  }
}

/**
 * @description Retrieves subjects associated with a specific education level/board.
 *
 * @param {import('express').Request} req - Express request with `education` in body
 * @param {import('express').Response} res - Express response object
 */
export async function getBoardSubjects(req, res) {
  try {
    const boardSub = await boardSubjects.find({ std: req.body.education });
    res.send(boardSub);
  } catch (err) {
    console.error("Error fetching board subjects:", err);
    res.status(500).json({ message: "Error fetching board subjects" });
  }
}

/**
 * @description Retrieves subtopics filtered by subject and difficulty level.
 *
 * @param {import('express').Request} req - Express request with `subject` and `level` in body
 * @param {import('express').Response} res - Express response object
 */
export async function getSubTopics(req, res) {
  try {
    const response = await SubTopic.find({
      subject: req.body.subject,
      level: req.body.level,
    });
    res.send(response);
  } catch (err) {
    console.error("Error fetching subtopics:", err);
    res.status(500).json({ message: "Error fetching subtopics" });
  }
}

/**
 * @description Retrieves the opted/enrolled subtopics for a specific user.
 *
 * @param {import('express').Request} req - Express request with `user` (email) in body
 * @param {import('express').Response} res - Express response object
 */
export async function getOptedTopics(req, res) {
  try {
    const subTopic = await User.find({ email: req.body.user }, "subtopic");
    res.send(subTopic);
  } catch (err) {
    console.error("Error fetching opted topics:", err);
    res.status(500).json({ message: "Error fetching opted topics" });
  }
}
