import mongoose from "mongoose";

const coursechallenge = new mongoose.Schema({
  user: String,
  subject: String,
  topic: String,
  userAnswers: [String],
  test: [
    {
      question: String,
      options: [String],
      correctAnswer: String,
    },
  ],
  score: Number,
});

export const Coursechallenge = mongoose.model(
  "coursechallenge",
  coursechallenge
);
