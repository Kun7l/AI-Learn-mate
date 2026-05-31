import { SmallTopic } from "../models/smallTopic.js";
import {
  streamChatbotAnswer,
  streamCourseContent,
} from "../services/gemini.service.js";

/**
 * @description Registers all Socket.IO event handlers for Gemini streaming.
 * Handles real-time streaming of chatbot answers and course content generation.
 *
 * Events listened:
 *   - "chatbot:ask"    → streams response via "chatbot:chunk" + "chatbot:done"
 *   - "course:generate" → streams response via "course:chunk" + "course:done"
 *
 * @param {import('socket.io').Server} io - The Socket.IO server instance
 */
export function registerGeminiHandlers(io) {
  io.on("connection", (socket) => {
    console.log(`Socket connected: ${socket.id}`);

    // =========================================================================
    // CHATBOT STREAMING
    // =========================================================================

    /**
     * @event chatbot:ask
     * @description Streams a chatbot answer for a study-related question.
     * @param {Object} data
     * @param {string} data.input - The user's question
     * @param {string} data.content - The reference content/context
     *
     * @emits chatbot:chunk - Each text chunk as Gemini generates it
     * @emits chatbot:done  - Signals streaming is complete (includes full text)
     * @emits chatbot:error - If an error occurs during generation
     */
    socket.on("chatbot:ask", async (data) => {
      try {
        const { input, content } = data;

        const fullText = await streamChatbotAnswer(input, content, (chunk) => {
          socket.emit("chatbot:chunk", { text: chunk });
        });

        socket.emit("chatbot:done", { text: fullText });
      } catch (err) {
        console.error("Chatbot streaming error:", err);
        socket.emit("chatbot:error", { message: "Failed to generate response" });
      }
    });

    // =========================================================================
    // COURSE CONTENT STREAMING
    // =========================================================================

    /**
     * @event course:generate
     * @description Streams course content for a small topic. If the content
     * has already been generated and cached, it sends the cached version
     * immediately (non-streamed). Otherwise, it streams from Gemini and
     * caches the result in the database.
     *
     * @param {Object} data
     * @param {string} data.user     - User email
     * @param {string} data.topic    - The subtopic name
     * @param {string} data.level    - Difficulty level
     * @param {string} data.smallTopic - The specific small topic name
     * @param {string} data.subject  - The subject name
     *
     * @emits course:chunk  - Each HTML chunk as Gemini generates it
     * @emits course:done   - Signals streaming is complete (includes full HTML)
     * @emits course:cached - Sent when content was already cached (includes full HTML)
     * @emits course:error  - If an error occurs during generation
     */
    socket.on("course:generate", async (data) => {
      try {
        const { user, topic, level, smallTopic, subject } = data;

        // Check if content already exists in the database
        const existing = await SmallTopic.find({
          user,
          subtopic: topic,
          subject,
          name: smallTopic,
        });

        if (!existing[0]) {
          socket.emit("course:error", { message: "Topic not found" });
          return;
        }

        // If content is already cached, send it immediately (no streaming needed)
        if (existing[0].isLoaded === true) {
          socket.emit("course:cached", { html: existing[0].htmlContent });
          return;
        }

        // Stream fresh content from Gemini
        const fullHtml = await streamCourseContent(
          smallTopic,
          level,
          (chunk) => {
            socket.emit("course:chunk", { html: chunk });
          }
        );

        // Cache the generated content in the database
        await SmallTopic.updateOne(
          { user, subtopic: topic, subject, name: smallTopic },
          { $set: { htmlContent: fullHtml, isLoaded: true } }
        );

        socket.emit("course:done", { html: fullHtml });
      } catch (err) {
        console.error("Course streaming error:", err);
        socket.emit("course:error", { message: "Failed to generate course content" });
      }
    });

    // =========================================================================
    // DISCONNECT
    // =========================================================================

    socket.on("disconnect", () => {
      console.log(`Socket disconnected: ${socket.id}`);
    });
  });
}
