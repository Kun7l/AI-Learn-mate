import mongoose from "mongoose";

const suggestedtopicSchema = new mongoose.Schema({
    name:String,
    subtopic:String,
    user:String,
    subject:String,
    smallTopic:String,
    complete:Boolean
});

export const SuggestedTopic = mongoose.model("suggestedtopic",suggestedtopicSchema);