import { User } from "../models/user.js";
import { SmallTopic } from "../models/smallTopic.js";
import { SuggestedTopic } from "../models/sugTopic.js";
import {
  spellCheck,
  validateTopicBelongsToSubject,
  generateSubTopics,
  generateCourseContent,
} from "../services/gemini.service.js";

/**
 * @description Adds a new learning option/subtopic for a user. Validates the topic
 * using Gemini AI (spell-check + subject validation), generates sub-topics,
 * and saves them to the user profile and SmallTopic collection.
 *
 * @param {import('express').Request} req - Express request with `user`, `option`, `subject` in body
 * @param {import('express').Response} res - Express response — sends "1" on success, "0" on failure
 */
export async function setOption(req, res) {
  const { user, option, subject } = req.body;

  try {
    // Step 1: Spell-check the topic name
    const spelledTopic = await spellCheck(option);

    // Step 2: Validate that the topic belongs to the subject
    const isValid = await validateTopicBelongsToSubject(spelledTopic, subject);

    if (!isValid) {
      return res.send("0");
    }

    // Step 3: Generate sub-topics using Gemini
    const topics = await generateSubTopics(spelledTopic, subject);

    // Step 4: Add subtopic to user's profile
    await User.updateOne(
      { email: user },
      {
        $push: {
          subtopic: {
            name: spelledTopic,
            progress: 0,
            subject: subject,
            level: "beginner",
            smallTopics: topics,
          },
        },
      },
      { new: true }
    );

    // Step 5: Create individual SmallTopic documents
    for (let index = 0; index < topics.length; index++) {
      const smallUser = new SmallTopic({
        user: user,
        name: topics[index],
        subject: subject,
        subtopic: spelledTopic,
        isLoaded: false,
        completed: false,
        htmlContent: null,
        order: index,
      });
      await smallUser.save();
    }

    res.send("1");
  } catch (err) {
    console.error("Error in setOption:", err);
    res.send("0");
  }
}

/**
 * @description Retrieves all small topics for a user's subtopic, ordered by their
 * original index, including completion status.
 *
 * @param {import('express').Request} req - Express request with `user`, `topic`, `subject` in body
 * @param {import('express').Response} res - Express response — array of { name, completed }
 */
export async function getTopics(req, res) {
  const { topic, subject, user: email } = req.body;

  try {
    const topicData = await SmallTopic.find({
      user: email,
      subject: subject,
      subtopic: topic,
    });

    const topicArray = [];
    topicData.forEach((data) => {
      topicArray[data.order] = {
        name: data.name,
        completed: data.completed,
      };
    });

    res.send(topicArray);
  } catch (err) {
    console.error("Error fetching topics:", err);
    res.status(500).json({ message: "Error fetching topics" });
  }
}

/**
 * @description Retrieves suggested topics for a user's subtopic.
 * These are topics recommended after a low exam score.
 *
 * @param {import('express').Request} req - Express request with `user`, `topic`, `subject` in body
 * @param {import('express').Response} res - Express response — array of suggested topic names
 */
export async function getSuggestedTopics(req, res) {
  const { topic, subject, user: email } = req.body;

  try {
    const userData = await User.find({
      email: email,
      subtopic: {
        $elemMatch: { name: topic, subject: subject },
      },
    });

    let topics = [];
    if (userData[0]) {
      for (let index = 0; index < userData[0].subtopic.length; index++) {
        if (
          userData[0].subtopic[index].name === topic &&
          userData[0].subtopic[index].subject === subject
        ) {
          topics = userData[0].subtopic[index].sugTopic;
        }
      }
    }

    res.send(topics);
  } catch (err) {
    console.error("Error fetching suggested topics:", err);
    res.status(500).json({ message: "Error fetching suggested topics" });
  }
}

/**
 * @description Retrieves or generates HTML course content for a specific small topic.
 * If the content hasn't been generated yet, it calls Gemini AI to create it
 * and caches it in the database for future requests.
 *
 * @param {import('express').Request} req - Express request with `user`, `topic`, `level`, `smallTopic`, `subject` in body
 * @param {import('express').Response} res - Express response — HTML string of course content
 */
export async function getCourseContent(req, res) {
  const { topic, level, smallTopic, user, subject } = req.body;

  try {
    const response = await SmallTopic.find({
      user: user,
      subtopic: topic,
      subject: subject,
      name: smallTopic,
    });

    if (!response[0]) {
      return res.status(404).json({ message: "Topic not found" });
    }

    // If content hasn't been generated yet, generate and cache it
    if (response[0].isLoaded === false) {
      const htmlContent = await generateCourseContent(smallTopic, level);

      await SmallTopic.updateOne(
        {
          user: user,
          subtopic: topic,
          subject: subject,
          name: smallTopic,
        },
        { $set: { htmlContent: htmlContent, isLoaded: true } }
      );

      return res.send(htmlContent);
    }

    // Content already cached — return it directly
    res.send(response[0].htmlContent);
  } catch (err) {
    console.error("Error fetching course content:", err);
    res.status(500).json({ message: "Error fetching course content" });
  }
}

/**
 * @description Retrieves stepper data — the suggested topic names for a specific
 * small topic within a subtopic.
 *
 * @param {import('express').Request} req - Express request with `user`, `subtopic`, `smallTopic`, `subject` in body
 * @param {import('express').Response} res - Express response — array of suggested topic names
 */
export async function getStepper(req, res) {
  try {
    const data = await SuggestedTopic.find({
      user: req.body.user,
      subtopic: req.body.subtopic,
      smallTopic: req.body.smallTopic,
      subject: req.body.subject,
    });

    const suggtopic = data.map((item) => item.name);
    res.send(suggtopic);
  } catch (err) {
    console.error("Error fetching stepper data:", err);
    res.status(500).json({ message: "Error fetching stepper data" });
  }
}
