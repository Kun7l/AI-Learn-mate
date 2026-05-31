import { GoogleGenerativeAI } from "@google/generative-ai";
import dotenv from "dotenv";

dotenv.config();

/**
 * @description Singleton Google Generative AI client instance.
 * Initialized once and reused across all service methods.
 */
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

/**
 * @description Creates a new Gemini chat session and sends a single message.
 * Uses the gemini-1.5-flash model with an empty chat history.
 *
 * @param {string} prompt - The prompt to send to Gemini
 * @returns {Promise<string>} The text response from Gemini
 */
async function sendChatMessage(prompt) {
  const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });
  const chat = model.startChat({ history: [] });
  const result = await chat.sendMessage(prompt);
  return result.response.text();
}

/**
 * @description Extracts content between the first `[` and `]` in a string.
 * Useful for parsing Gemini responses that wrap results in brackets.
 *
 * @param {string} text - The raw text to extract from
 * @returns {string} The substring between the first `[` and `]`
 */
function extractBracketContent(text) {
  const startIndex = text.indexOf("[");
  const endIndex = text.indexOf("]");
  return text.substring(startIndex + 1, endIndex);
}

/**
 * @description Checks the spelling of a word using Gemini and returns
 * the corrected version with the first letter capitalized.
 *
 * @param {string} word - The word to spell-check
 * @returns {Promise<string>} The corrected word
 */
export async function spellCheck(word) {
  const response = await sendChatMessage(
    `check the spelling of word ${word} if its wrong then return the right word in [] and if its correct then return as it is in [] and make first letter capital.`
  );
  return extractBracketContent(response);
}

/**
 * @description Validates whether a topic belongs to a given subject using Gemini.
 *
 * @param {string} topic - The topic to validate
 * @param {string} subject - The subject to check against
 * @returns {Promise<boolean>} True if the topic belongs to the subject
 */
export async function validateTopicBelongsToSubject(topic, subject) {
  const response = await sendChatMessage(
    `check if ${topic} belongs to subject ${subject} or not. if belongs then give response [1] and if not then [0]`
  );
  const result = extractBracketContent(response);
  return result === "1";
}

/**
 * @description Generates an array of 10-12 sub-topics for a given topic and subject
 * using Gemini AI.
 *
 * @param {string} topic - The main topic
 * @param {string} subject - The subject the topic belongs to
 * @returns {Promise<string[]>} Array of generated sub-topic names
 */
export async function generateSubTopics(topic, subject) {
  const response = await sendChatMessage(
    `give an array of around 10-12 topics related to ${topic} in subject ${subject}. the response should be array. no other text should be in the response.response should be without any "\\n" or any text. ex : ["example topic"]  `
  );
  const startIndex = response.indexOf("[");
  const endIndex = response.indexOf("]");
  return JSON.parse(response.substring(startIndex, endIndex + 1));
}

/**
 * @description Generates detailed HTML course content for a topic at a given level
 * using Gemini AI. The response includes headings, examples, and practice questions.
 *
 * @param {string} topic - The topic to generate content for
 * @param {string} level - The difficulty level (beginner, intermediate, pro)
 * @returns {Promise<string>} HTML-formatted course content
 */
export async function generateCourseContent(topic, level) {
  const response = await sendChatMessage(
    "teach me in detail with every necessary topic and with example and practice questions regarding the teached topic " +
      topic +
      " " +
      level +
      " level.  in response replace ** with h1 tag gnewive every h1 tag classname `dangH1`give classname like react className and replace evey * with p tag. response must not contain any '*' or '**' characters. each content should be in html div tag nothing should be outside html div tag remove ```html and ``` from the response."
  );
  return response;
}

/**
 * @description Generates an MCQ test on a given topic at a specified difficulty level.
 *
 * @param {string} topic - The topic for the MCQ test
 * @param {string} level - The difficulty level
 * @param {number} [count=10] - Number of questions to generate
 * @returns {Promise<string>} JSON string of MCQ array
 */
export async function generateMCQ(topic, level, count = 10) {
  const response = await sendChatMessage(
    `create an mcq test on topic ${topic}. The test should be of ${count} questions. the level of exam should be ${level} level. and the response must follow the structure given here and no other text of character should be there in response other that array itself. [{question:"question of mcq",options:[option1,option2,option3,option4],correctAnswer:"correact answer"}]  ` +
      "dont add the ```json and ``` in the response"
  );
  return response;
}

/**
 * @description Generates a course challenge exam covering multiple topics within a subject.
 *
 * @param {string} subject - The subject of the exam
 * @param {string} subtopic - The main subtopic being tested
 * @param {string[]} topics - Array of specific topics the exam should cover
 * @returns {Promise<string>} JSON string of MCQ array (15 questions)
 */
export async function generateCourseChallengeExam(subject, subtopic, topics) {
  const response = await sendChatMessage(
    `create an mcq test on subject ${subject}. On topic ${subtopic} and the exam should cover ${topics} all these topics.  The test should be of 15 questions.  and the response must follow the structure given here and no other text of character should be there in response other that array itself. [{question:"question of mcq",options:[option1,option2,option3,option4],correctAnswer:"correact answer"}]  ` +
      "dont add the ```json and ``` in the response"
  );
  return response;
}

/**
 * @description Evaluates exam results using Gemini and returns suggested topics
 * where the user needs improvement.
 *
 * @param {Object} examData - The exam data to evaluate
 * @param {string} examData.subject - The exam subject
 * @param {string} examData.topic - The exam topic
 * @param {Array} examData.test - The test questions and answers
 * @param {string[]} examData.userAnswers - The user's submitted answers
 * @param {number} examData.score - The user's score
 * @returns {Promise<string[]>} Array of suggested topics for improvement
 */
export async function evaluateExam(examData) {
  const response = await sendChatMessage(
    `you are a exam evaluater this is the exam data from user subject: ${examData.subject}, topic: ${examData.topic}, testData: ${examData.test}, users answers in order of questions; ${examData.userAnswers}, score: ${examData.score}  if user scores low marks then return a array of suggested topic user lacs in. in response only provide the array of suggested topic nothing else and if user scores good then return null array.`
  );
  const startIndex = response.indexOf("[");
  const endIndex = response.indexOf("]");
  return JSON.parse(response.substring(startIndex, endIndex + 1));
}

/**
 * @description Sends a study-related question to Gemini in the context of specific content.
 * Only answers study-related questions; rejects non-academic queries.
 *
 * @param {string} question - The user's question
 * @param {string} content - The reference content/context for the answer
 * @returns {Promise<string>} Gemini's answer in paragraph form
 */
export async function chatbotAnswer(question, content) {
  const response = await sendChatMessage(
    'you are a teacher and a student is asking you question related to study only answer if the question is related to study otherwise say "I cant answer that" and if you answer only in paragraph and shortest form possible no * included. and you have to answer in refrence to ' +
      content +
      " ignore the tags of html. Ouestion : " +
      question
  );
  return response;
}

// =============================================================================
// STREAMING METHODS (Socket.IO)
// =============================================================================

/**
 * @description Streams a Gemini response chunk-by-chunk using generateContentStream.
 * Calls the onChunk callback for each piece of text as it arrives.
 *
 * @param {string} prompt - The prompt to send to Gemini
 * @param {(chunk: string) => void} onChunk - Callback invoked with each text chunk
 * @returns {Promise<string>} The complete concatenated response
 */
async function streamChatMessage(prompt, onChunk) {
  const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });
  const result = await model.generateContentStream(prompt);

  let fullText = "";
  for await (const chunk of result.stream) {
    const chunkText = chunk.text();
    fullText += chunkText;
    onChunk(chunkText);
  }
  return fullText;
}

/**
 * @description Streams detailed HTML course content for a topic at a given level.
 * Each chunk of generated HTML is sent to the onChunk callback in real time.
 *
 * @param {string} topic - The topic to generate content for
 * @param {string} level - The difficulty level (beginner, intermediate, pro)
 * @param {(chunk: string) => void} onChunk - Callback invoked with each HTML chunk
 * @returns {Promise<string>} The complete HTML response
 */
export async function streamCourseContent(topic, level, onChunk) {
  return streamChatMessage(
    "teach me in detail with every necessary topic and with example and practice questions regarding the teached topic " +
      topic +
      " " +
      level +
      " level.  in response replace ** with h1 tag gnewive every h1 tag classname `dangH1`give classname like react className and replace evey * with p tag. response must not contain any '*' or '**' characters. each content should be in html div tag nothing should be outside html div tag remove ```html and ``` from the response.",
    onChunk
  );
}

/**
 * @description Streams a chatbot answer for a study-related question.
 * Each chunk of the answer is sent to the onChunk callback in real time.
 *
 * @param {string} question - The user's question
 * @param {string} content - The reference content/context for the answer
 * @param {(chunk: string) => void} onChunk - Callback invoked with each text chunk
 * @returns {Promise<string>} The complete answer text
 */
export async function streamChatbotAnswer(question, content, onChunk) {
  return streamChatMessage(
    'you are a teacher and a student is asking you question related to study only answer if the question is related to study otherwise say "I cant answer that" and if you answer only in paragraph and shortest form possible no * included. and you have to answer in refrence to ' +
      content +
      " ignore the tags of html. Ouestion : " +
      question,
    onChunk
  );
}

