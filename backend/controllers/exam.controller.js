import { User } from "../models/user.js";
import { SmallTopic } from "../models/smallTopic.js";
import { SuggestedTopic } from "../models/sugTopic.js";
import { Coursechallenge } from "../models/coursechallenge.js";
import {
  generateMCQ,
  generateCourseChallengeExam,
  evaluateExam,
} from "../services/gemini.service.js";

/**
 * @description Generates an MCQ exam for a given topic and difficulty level.
 *
 * @param {import('express').Request} req - Express request with `topic` and `level` in body
 * @param {import('express').Response} res - Express response — JSON string of MCQ array
 */
export async function generateExam(req, res) {
  try {
    const result = await generateMCQ(req.body.topic, req.body.level);
    res.send(result);
  } catch (err) {
    console.error("Error generating exam:", err);
    res.status(500).json({ message: "Error generating exam" });
  }
}

/**
 * @description Generates a course challenge exam covering multiple topics
 * within a subject and subtopic.
 *
 * @param {import('express').Request} req - Express request with `user`, `subject`, `subtopic`, `topics` in body
 * @param {import('express').Response} res - Express response — JSON string of MCQ array (15 questions)
 */
export async function generateCourseChallenge(req, res) {
  try {
    const result = await generateCourseChallengeExam(
      req.body.subject,
      req.body.subtopic,
      req.body.topics
    );
    res.send(result);
  } catch (err) {
    console.error("Error generating course challenge:", err);
    res.status(500).json({ message: "Error generating course challenge" });
  }
}

/**
 * @description Processes exam submission. Handles:
 *   1. Marking small topics as completed (if score >= 8)
 *   2. Advancing user level (beginner → intermediate → pro → complete)
 *   3. Saving exam results to user profile
 *   4. Generating suggested improvement topics via Gemini (if score < 8)
 *
 * @param {import('express').Request} req - Express request with full exam data in body
 * @param {import('express').Response} res - Express response
 */
export async function submitExam(req, res) {
  const examData = {
    user: req.body.user,
    subject: req.body.subject,
    topic: req.body.topic,
    level: req.body.level,
    test: req.body.test,
    userAnswers: req.body.userAnswers,
    score: req.body.score,
    smallTopic: req.body.smallTopic,
  };

  try {
    // Mark small topic as completed if score is high enough
    if (examData.score >= 8) {
      await SmallTopic.updateOne(
        {
          user: examData.user,
          name: examData.smallTopic,
          subject: examData.subject,
          subtopic: examData.topic,
        },
        { $set: { completed: true } }
      );
    }

    // Advance user level if score is high enough
    if (examData.score >= 8) {
      const nextLevel = getNextLevel(examData.level);

      if (nextLevel) {
        const userFound = await User.find({
          email: examData.user,
          subtopic: {
            $elemMatch: { name: examData.topic, subject: examData.subject },
          },
        });

        if (userFound[0]) {
          userFound[0].subtopic.forEach((subtopic) => {
            if (
              subtopic.name === examData.topic &&
              subtopic.subject === examData.subject
            ) {
              subtopic.level = nextLevel;
            }
          });
          await userFound[0].save();
          res.send(userFound);
        }
      }
    }

    // Save exam results to user profile
    await User.updateOne(
      { email: examData.user },
      {
        $push: {
          exam: {
            subject: examData.subject,
            topic: examData.topic,
            level: examData.level,
            test: examData.test,
            score: examData.score,
            userAnswers: examData.userAnswers,
            smallTopic: examData.smallTopic,
          },
        },
      },
      { new: true }
    );

    // Generate suggested topics if score is low
    if (examData.score < 8) {
      const sugTopic = await evaluateExam(examData);

      // Save suggested topics to user's subtopic
      const response = await User.find({ email: examData.user });
      for (let index = 0; index < response[0].subtopic.length; index++) {
        if (
          response[0].subtopic[index].name === examData.topic &&
          response[0].subtopic[index].subject === examData.subject
        ) {
          response[0].subtopic[index].sugTopic = sugTopic;
          await response[0].save();
        }
      }

      // Create SuggestedTopic and SmallTopic documents for each suggestion
      for (let i = 0; i < sugTopic.length; i++) {
        const sugResponse = new SuggestedTopic({
          name: sugTopic[i],
          smallTopic: examData.smallTopic,
          subtopic: examData.topic,
          subject: examData.subject,
          user: examData.user,
          complete: false,
        });
        await sugResponse.save();

        const smallUser = new SmallTopic({
          user: examData.user,
          name: sugTopic[i],
          subject: examData.subject,
          subtopic: examData.topic,
          isLoaded: false,
          completed: false,
          htmlContent: null,
        });
        await smallUser.save();
      }
    }
  } catch (err) {
    console.error("Error submitting exam:", err);
    res.status(500).json({ message: "Error submitting exam" });
  }
}

/**
 * @description Determines the next difficulty level in the progression.
 *
 * @param {string} currentLevel - The current level (beginner, intermidiate, pro)
 * @returns {string|null} The next level, or null if already at max
 */
function getNextLevel(currentLevel) {
  const levelProgression = {
    beginner: "intermidiate",
    intermidiate: "pro",
    pro: "complete",
  };
  return levelProgression[currentLevel] || null;
}

/**
 * @description Saves course challenge results to the database.
 *
 * @param {import('express').Request} req - Express request with challenge data in body
 * @param {import('express').Response} res - Express response
 */
export async function submitCourseChallenge(req, res) {
  try {
    const response = new Coursechallenge({
      email: req.body.user,
      subject: req.body.subject,
      topic: req.body.topic,
      test: req.body.test,
      score: req.body.score,
      userAnswers: req.body.userAnswers,
    });
    await response.save();
    res.status(200).json({ message: "Challenge submitted successfully" });
  } catch (err) {
    console.error("Error submitting course challenge:", err);
    res.status(500).json({ message: "Error submitting course challenge" });
  }
}
