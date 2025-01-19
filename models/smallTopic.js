import mongoose from "mongoose";

const smallTopicSchema = new mongoose.Schema({
  user: String,
  name: String,
  subject: String,
  subtopic: String,
  htmlContent: String,
  isLoaded: Boolean,
  completed: Boolean,
  order:Number
});

export const SmallTopic = mongoose.model("smalltopic", smallTopicSchema);
